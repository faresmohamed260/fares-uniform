from datetime import timedelta

from odoo import _, api, fields, models
from odoo.exceptions import AccessError, UserError, ValidationError
from odoo.tools import float_is_zero


class FuRetailReturnRequest(models.Model):
    _inherit = "fu.retail.return.request"

    exchange_order_id = fields.Many2one(
        "pos.order",
        string="Exchange order",
        readonly=True,
        copy=False,
        index=True,
        help="Native Odoo POS order containing the returned line(s) and replacement size line(s).",
    )

    @api.model_create_multi
    def create(self, vals_list):
        sanitized = []
        for incoming in vals_list:
            vals = dict(incoming)
            vals.pop("exchange_order_id", None)
            sanitized.append(vals)
        return super().create(sanitized)

    def write(self, vals):
        if "exchange_order_id" in vals and not self.env.context.get("fu_return_internal"):
            raise AccessError(_("Exchange-order linkage is system managed."))
        return super().write(vals)

    def _fu_validate_business_contract(self):
        self.ensure_one()
        if self.operation == "refund":
            result = super()._fu_validate_business_contract()
            if self.line_ids.filtered("replacement_product_id"):
                raise ValidationError(_("Refund requests cannot contain replacement products."))
            return result
        if self.operation != "exchange":
            raise ValidationError(_("Unsupported retail return operation."))

        order = self.source_order_id
        if order.state not in {"paid", "done"} or order.is_refund:
            raise ValidationError(_("The source transaction must be a completed original retail sale."))
        if not self.line_ids:
            raise ValidationError(_("At least one returned item is required."))

        delivery_dt = self._fu_delivery_datetime()
        age = fields.Datetime.now() - delivery_dt
        limit = timedelta(days=14 if self.eligibility_path == "no_reason" else 30)
        if age > limit:
            raise ValidationError(
                _(
                    "This transaction is outside the accepted %(days)s-day eligibility window.",
                    days=limit.days,
                )
            )

        seen = set()
        for line in self.line_ids:
            source = line.source_line_id
            replacement = line.replacement_product_id
            if source.id in seen:
                raise ValidationError(_("A source sale line may appear only once in a return request."))
            seen.add(source.id)
            if source.order_id != order or source.qty <= 0:
                raise ValidationError(_("Every returned line must belong to the original positive sale."))
            if not source.product_id.is_storable:
                raise ValidationError(_("Phase 2C exchanges cover inventory-tracked garments only."))
            if line.quantity <= 0:
                raise ValidationError(_("Returned quantity must be greater than zero."))
            outstanding = source.qty - source.refunded_qty
            if source.product_uom_id.compare(outstanding, line.quantity) < 0:
                raise ValidationError(_("Requested exchange quantity exceeds the outstanding source quantity."))
            if not replacement:
                raise ValidationError(_("Every size-exchange line requires a replacement product variant."))
            if not replacement.is_storable:
                raise ValidationError(_("The replacement size must be an inventory-tracked garment."))
            if replacement == source.product_id:
                raise ValidationError(_("A size exchange must select a different product variant."))
            if replacement.product_tmpl_id != source.product_id.product_tmpl_id:
                raise ValidationError(_("A size exchange must stay within the same product template."))
            if replacement.uom_id != source.product_uom_id:
                raise ValidationError(_("Returned and replacement variants must use the same unit of measure."))
            if (
                self.eligibility_path == "no_reason"
                and source.product_id.product_tmpl_id.fu_made_to_special_specification
            ):
                raise ValidationError(
                    _(
                        "A compliant made-to-special-specification item is excluded from the routine no-reason path."
                    )
                )

        self._fu_supported_payment_method()
        return True

    def _fu_assert_exchange_stock_available(self):
        self.ensure_one()
        for line in self.line_ids:
            replacement = line.replacement_product_id
            available = self.env["stock.quant"].sudo()._get_available_quantity(
                replacement, self.store_location_id
            )
            if replacement.uom_id.compare(available, line.quantity) < 0:
                raise ValidationError(
                    _(
                        "Replacement size %(product)s does not have enough sellable stock in this store.",
                        product=replacement.display_name,
                    )
                )
        return True

    def _fu_add_exchange_lines(self, exchange_order):
        self.ensure_one()
        internal_ctx = {
            "fu_return_internal": True,
            "fu_return_request_id": self.id,
        }
        line_model = self.env["pos.order.line"].sudo().with_context(**internal_ctx)
        for return_line in self.line_ids:
            replacement_line = line_model.create(
                {
                    "order_id": exchange_order.id,
                    "product_id": return_line.replacement_product_id.id,
                    "qty": return_line.quantity,
                    "price_unit": 0.0,
                    "price_subtotal": 0.0,
                    "price_subtotal_incl": 0.0,
                }
            )
            # Use the pinned Odoo POS onchange so the active POS pricelist,
            # fiscal position, tax-included pricing and tax mapping remain native.
            replacement_line._onchange_product_id()
            return_line.sudo().with_context(fu_return_internal=True).write(
                {"replacement_order_line_id": replacement_line.id}
            )
        exchange_order._compute_prices()
        return exchange_order

    def _fu_settle_exchange(self, exchange_order):
        self.ensure_one()
        method = self._fu_supported_payment_method()
        amount = exchange_order.amount_total
        internal_ctx = {
            "fu_return_internal": True,
            "fu_return_request_id": self.id,
        }

        if not float_is_zero(amount, precision_rounding=exchange_order.currency_id.rounding):
            payment_vals = {
                "pos_order_id": exchange_order.id,
                "amount": amount,
                "name": self.settlement_reference or f"FU exchange {self.request_key}",
                "payment_method_id": method.id,
            }
            if method.fu_confirmation_mode == "bank_notification":
                if not self.bank_refund_confirmed or not (self.settlement_reference or "").strip():
                    raise ValidationError(
                        _(
                            "An InstaPay exchange difference requires positive manual bank evidence and a settlement reference."
                        )
                    )
                payment_vals["fu_manual_confirmed"] = True
            exchange_order.sudo().with_context(**internal_ctx).add_payment(payment_vals)

        if not exchange_order._is_pos_order_paid():
            raise UserError(_("The native exchange order is not fully settled."))
        exchange_order.sudo().with_context(**internal_ctx)._process_saved_order(False)
        if exchange_order.state not in {"paid", "done"}:
            raise UserError(_("The native exchange order did not reach a paid state."))
        return True

    def action_execute(self):
        refund_requests = self.filtered(lambda request: request.operation == "refund")
        results = self.env["pos.order"]
        if refund_requests:
            results |= super(FuRetailReturnRequest, refund_requests).action_execute()

        for request in self - refund_requests:
            request._fu_assert_approval_role()
            request._fu_assert_store_scope()
            self.env.cr.execute(
                "SELECT id FROM fu_retail_return_request WHERE id = %s FOR UPDATE",
                [request.id],
            )
            request.invalidate_recordset()
            if request.state == "done":
                results |= request.exchange_order_id
                continue
            if request.state != "approved":
                raise ValidationError(_("Only an approved exchange request can be executed."))
            self.env.cr.execute(
                "SELECT id FROM pos_order WHERE id = %s FOR UPDATE",
                [request.source_order_id.id],
            )
            request._fu_validate_business_contract()
            request._fu_assert_exchange_stock_available()

            exchange_order = request._fu_prepare_native_refund()
            request._fu_add_exchange_lines(exchange_order)
            request._fu_settle_exchange(exchange_order)
            quarantine = request._fu_create_quarantine_picking()
            request.sudo().with_context(fu_return_internal=True).write(
                {
                    "state": "done",
                    "executed_by_id": self.env.user.id,
                    "executed_at": fields.Datetime.now(),
                    "exchange_order_id": exchange_order.id,
                    "quarantine_picking_id": quarantine.id,
                }
            )
            results |= exchange_order
        return results


class FuRetailReturnLine(models.Model):
    _inherit = "fu.retail.return.line"

    replacement_product_id = fields.Many2one(
        "product.product",
        string="Replacement size",
        copy=False,
        check_company=True,
        help="Replacement variant for a size exchange. It must belong to the same product template.",
    )
    replacement_order_line_id = fields.Many2one(
        "pos.order.line",
        string="Replacement order line",
        readonly=True,
        copy=False,
        help="System-managed native POS line that released the replacement garment.",
    )

    @api.model_create_multi
    def create(self, vals_list):
        sanitized = []
        for incoming in vals_list:
            vals = dict(incoming)
            vals.pop("replacement_order_line_id", None)
            sanitized.append(vals)
        return super().create(sanitized)

    def write(self, vals):
        if (
            "replacement_order_line_id" in vals
            and not self.env.context.get("fu_return_internal")
        ):
            raise AccessError(_("Replacement-order linkage is system managed."))
        return super().write(vals)
