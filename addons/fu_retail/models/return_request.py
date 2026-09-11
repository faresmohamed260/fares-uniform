from datetime import timedelta
from uuid import uuid4

from odoo import _, Command, api, fields, models
from odoo.exceptions import AccessError, UserError, ValidationError
from odoo.tools import float_is_zero


class FuRetailReturnRequest(models.Model):
    _name = "fu.retail.return.request"
    _description = "Fares Retail Return Request"
    _order = "id desc"
    _rec_name = "request_key"

    request_key = fields.Char(
        required=True,
        readonly=True,
        copy=False,
        index=True,
        default=lambda self: str(uuid4()),
    )
    source_order_id = fields.Many2one(
        "pos.order", required=True, readonly=True, copy=False, index=True, check_company=True
    )
    store_location_id = fields.Many2one(
        "stock.location", required=True, readonly=True, copy=False, check_company=True
    )
    company_id = fields.Many2one(
        "res.company", required=True, readonly=True, copy=False, check_company=True
    )
    currency_id = fields.Many2one(related="source_order_id.currency_id", readonly=True)
    operation = fields.Selection(
        [("refund", "Refund"), ("exchange", "Size exchange")],
        required=True,
        default="refund",
    )
    eligibility_path = fields.Selection(
        [("no_reason", "Consumer return / exchange"), ("defect", "Defective item")],
        required=True,
        default="no_reason",
    )
    reason = fields.Char(required=True)
    physical_received = fields.Boolean(
        string="Returned item physically received",
        help="Approval requires physical receipt of the returned garment.",
    )
    bank_refund_confirmed = fields.Boolean(
        string="Outbound InstaPay confirmed",
        copy=False,
        help="Staff positively confirmed the outbound bank transfer. This is manual evidence, not bank API verification.",
    )
    settlement_reference = fields.Char(copy=False)
    line_ids = fields.One2many(
        "fu.retail.return.line", "request_id", string="Returned items", copy=False
    )
    state = fields.Selection(
        [
            ("draft", "Draft"),
            ("requested", "Requested"),
            ("approved", "Approved"),
            ("done", "Done"),
            ("rejected", "Rejected"),
        ],
        required=True,
        default="draft",
        readonly=True,
        copy=False,
        index=True,
    )
    requested_by_id = fields.Many2one("res.users", readonly=True, copy=False)
    requested_at = fields.Datetime(readonly=True, copy=False)
    approved_by_id = fields.Many2one("res.users", readonly=True, copy=False)
    approved_at = fields.Datetime(readonly=True, copy=False)
    executed_by_id = fields.Many2one("res.users", readonly=True, copy=False)
    executed_at = fields.Datetime(readonly=True, copy=False)
    rejected_by_id = fields.Many2one("res.users", readonly=True, copy=False)
    rejected_at = fields.Datetime(readonly=True, copy=False)
    refund_order_id = fields.Many2one("pos.order", readonly=True, copy=False)
    quarantine_picking_id = fields.Many2one("stock.picking", readonly=True, copy=False)

    _request_key_unique = models.UniqueIndex("(request_key)")

    @api.model
    def _fu_is_owner(self):
        return self.env.is_superuser() or self.env.user.has_group(
            "fu_core.group_fu_owner_admin"
        )

    @api.model
    def _fu_is_manager(self):
        return self._fu_is_owner() or self.env.user.has_group(
            "fu_core.group_fu_store_manager"
        )

    @api.model
    def _fu_assert_request_role(self):
        if not (
            self._fu_is_manager()
            or self.env.user.has_group("fu_core.group_fu_cashier")
        ):
            raise AccessError(_("This role cannot create retail return requests."))

    @api.model
    def _fu_assert_approval_role(self):
        if not self._fu_is_manager():
            raise AccessError(_("Only a Store Manager or Owner may approve or execute a return."))

    def _fu_assert_store_scope(self):
        for request in self:
            if request._fu_is_owner():
                continue
            if request.store_location_id not in self.env.user.fu_stock_location_ids:
                raise AccessError(_("This return belongs to a store outside your assignment."))
        return True

    @api.model
    def _fu_store_for_order(self, order):
        warehouse = order.config_id.picking_type_id.warehouse_id
        if not warehouse:
            raise ValidationError(_("The source POS is not linked to a warehouse."))
        store = warehouse.lot_stock_id
        if not store or store.fu_location_role != "store":
            raise ValidationError(_("The source POS is not linked to the configured Retail Store."))
        return store

    @api.model_create_multi
    def create(self, vals_list):
        self._fu_assert_request_role()
        normalized = []
        for incoming in vals_list:
            vals = dict(incoming)
            order = self.env["pos.order"].browse(vals.get("source_order_id")).exists()
            if not order:
                raise ValidationError(_("A valid source retail transaction is required."))
            store = self._fu_store_for_order(order)
            vals["store_location_id"] = store.id
            vals["company_id"] = order.company_id.id
            vals.pop("state", None)
            for protected in (
                "requested_by_id",
                "requested_at",
                "approved_by_id",
                "approved_at",
                "executed_by_id",
                "executed_at",
                "rejected_by_id",
                "rejected_at",
                "refund_order_id",
                "quarantine_picking_id",
            ):
                vals.pop(protected, None)
            normalized.append(vals)
        requests = super().create(normalized)
        requests._fu_assert_store_scope()
        return requests

    def write(self, vals):
        if not self.env.context.get("fu_return_internal"):
            protected = {
                "state",
                "store_location_id",
                "company_id",
                "requested_by_id",
                "requested_at",
                "approved_by_id",
                "approved_at",
                "executed_by_id",
                "executed_at",
                "rejected_by_id",
                "rejected_at",
                "refund_order_id",
                "quarantine_picking_id",
            }
            if protected.intersection(vals):
                raise AccessError(_("Return workflow state and audit fields are system managed."))
            if any(request.state != "draft" for request in self):
                raise AccessError(_("Submitted return requests cannot be edited directly."))
            self._fu_assert_request_role()
            self._fu_assert_store_scope()
        return super().write(vals)

    def unlink(self):
        if any(request.state != "draft" for request in self):
            raise AccessError(_("Submitted return requests are preserved as audit history."))
        self._fu_assert_request_role()
        self._fu_assert_store_scope()
        return super().unlink()

    def _fu_done_outgoing_pickings(self):
        self.ensure_one()
        return self.source_order_id.picking_ids.filtered(
            lambda picking: picking.state == "done"
            and picking.picking_type_id.code == "outgoing"
        )

    def _fu_delivery_datetime(self):
        self.ensure_one()
        pickings = self._fu_done_outgoing_pickings()
        if not pickings:
            raise ValidationError(
                _("Phase 2C only accepts goods that were already physically released to the customer.")
            )
        dates = [value for value in pickings.mapped("date_done") if value]
        return max(dates) if dates else self.source_order_id.date_order

    def _fu_supported_payment_method(self):
        self.ensure_one()
        payments = self.source_order_id.payment_ids.filtered(
            lambda payment: not payment.is_change and payment.amount > 0
        )
        methods = payments.mapped("payment_method_id")
        if len(methods) != 1:
            raise ValidationError(
                _(
                    "Automated Phase 2C refunds require the source sale to use exactly one supported payment method. Mixed-method refunds require Manager/Owner exception handling."
                )
            )
        method = methods.ensure_one()
        if method.is_cash_count:
            return method
        if method.fu_confirmation_mode == "bank_notification":
            if any(not payment.fu_manual_confirmed for payment in payments):
                raise ValidationError(_("The source InstaPay payment lacks positive manual confirmation."))
            return method
        raise ValidationError(_("The source sale uses a payment method not supported by Phase 2C."))

    def _fu_validate_business_contract(self):
        self.ensure_one()
        order = self.source_order_id
        if order.state not in {"paid", "done"} or order.is_refund:
            raise ValidationError(_("The source transaction must be a completed original retail sale."))
        if not self.line_ids:
            raise ValidationError(_("At least one returned item is required."))
        if self.operation != "refund":
            raise UserError(_("Size-exchange execution is not enabled in the refund-foundation slice yet."))

        delivery_dt = self._fu_delivery_datetime()
        age = fields.Datetime.now() - delivery_dt
        limit = timedelta(days=14 if self.eligibility_path == "no_reason" else 30)
        if age > limit:
            raise ValidationError(
                _("This transaction is outside the accepted %(days)s-day eligibility window.", days=limit.days)
            )

        seen = set()
        for line in self.line_ids:
            source = line.source_line_id
            if source.id in seen:
                raise ValidationError(_("A source sale line may appear only once in a return request."))
            seen.add(source.id)
            if source.order_id != order or source.qty <= 0:
                raise ValidationError(_("Every returned line must belong to the original positive sale."))
            if not source.product_id.is_storable:
                raise ValidationError(_("Phase 2C returns currently cover inventory-tracked garments only."))
            if line.quantity <= 0:
                raise ValidationError(_("Returned quantity must be greater than zero."))
            outstanding = source.qty - source.refunded_qty
            if source.product_uom_id.compare(outstanding, line.quantity) < 0:
                raise ValidationError(_("Requested return quantity exceeds the outstanding source quantity."))
            if (
                self.eligibility_path == "no_reason"
                and source.product_id.product_tmpl_id.fu_made_to_special_specification
            ):
                raise ValidationError(
                    _("A compliant made-to-special-specification item is excluded from the routine no-reason path.")
                )

        self._fu_supported_payment_method()
        return True

    def action_submit(self):
        self._fu_assert_request_role()
        for request in self:
            request._fu_assert_store_scope()
            if request.state in {"requested", "approved", "done"}:
                continue
            if request.state != "draft":
                raise ValidationError(_("Only a draft return request can be submitted."))
            request._fu_validate_business_contract()
            request.sudo().with_context(fu_return_internal=True).write(
                {
                    "state": "requested",
                    "requested_by_id": self.env.user.id,
                    "requested_at": fields.Datetime.now(),
                }
            )
        return True

    def action_approve(self):
        self._fu_assert_approval_role()
        for request in self:
            request._fu_assert_store_scope()
            if request.state in {"approved", "done"}:
                continue
            if request.state != "requested":
                raise ValidationError(_("Only a submitted return request can be approved."))
            if not request.physical_received:
                raise ValidationError(_("The returned garment must be physically received before approval."))
            request._fu_validate_business_contract()
            request.sudo().with_context(fu_return_internal=True).write(
                {
                    "state": "approved",
                    "approved_by_id": self.env.user.id,
                    "approved_at": fields.Datetime.now(),
                }
            )
        return True

    def action_reject(self):
        self._fu_assert_approval_role()
        for request in self:
            request._fu_assert_store_scope()
            if request.state == "rejected":
                continue
            if request.state not in {"draft", "requested"}:
                raise ValidationError(_("Only a draft or submitted request can be rejected."))
            request.sudo().with_context(fu_return_internal=True).write(
                {
                    "state": "rejected",
                    "rejected_by_id": self.env.user.id,
                    "rejected_at": fields.Datetime.now(),
                }
            )
        return True

    def _fu_prepare_native_refund(self):
        self.ensure_one()
        internal_ctx = {
            "fu_return_internal": True,
            "fu_return_request_id": self.id,
        }
        refund_order = self.source_order_id.sudo().with_context(**internal_ctx)._refund()
        refund_order.ensure_one()
        requested_by_source = {line.source_line_id.id: line for line in self.line_ids}
        for refund_line in refund_order.lines:
            request_line = requested_by_source.get(refund_line.refunded_orderline_id.id)
            if not request_line:
                refund_line.sudo().with_context(**internal_ctx).unlink()
                continue
            refund_line = refund_line.sudo().with_context(**internal_ctx)
            refund_line.qty = -request_line.quantity
            refund_line._onchange_qty()
            refund_line._onchange_amount_line_all()
        refund_order._compute_prices()
        refund_order.sudo().with_context(**internal_ctx).write(
            {"fu_return_request_id": self.id}
        )
        return refund_order

    def _fu_settle_refund(self, refund_order):
        self.ensure_one()
        method = self._fu_supported_payment_method()
        if float_is_zero(
            self.source_order_id.amount_total + refund_order.amount_total,
            precision_rounding=refund_order.currency_id.rounding,
        ):
            amount = -self.source_order_id.amount_paid
        else:
            amount = refund_order.amount_total

        payment_vals = {
            "pos_order_id": refund_order.id,
            "amount": amount,
            "name": self.settlement_reference or f"FU return {self.request_key}",
            "payment_method_id": method.id,
        }
        if method.fu_confirmation_mode == "bank_notification":
            if not self.bank_refund_confirmed or not (self.settlement_reference or "").strip():
                raise ValidationError(
                    _("An outbound InstaPay refund requires positive manual bank evidence and a settlement reference.")
                )
            payment_vals["fu_manual_confirmed"] = True

        internal_ctx = {
            "fu_return_internal": True,
            "fu_return_request_id": self.id,
        }
        refund_order.sudo().with_context(**internal_ctx).add_payment(payment_vals)
        if not refund_order._is_pos_order_paid():
            raise UserError(_("The native refund order is not fully settled."))
        refund_order.sudo().with_context(**internal_ctx)._process_saved_order(False)
        if refund_order.state not in {"paid", "done"}:
            raise UserError(_("The native refund order did not reach a paid state."))
        return True

    def _fu_create_quarantine_picking(self):
        self.ensure_one()
        warehouse = self.store_location_id.warehouse_id
        inspection = self.env["stock.location"]._fu_get_or_create_returns_inspection_location(
            warehouse
        )
        if not inspection:
            raise UserError(_("Returns / Inspection location could not be configured."))
        picking_type = warehouse.int_type_id
        if not picking_type:
            raise UserError(_("The Retail Store warehouse has no internal transfer operation type."))

        quantity_by_product = {}
        for line in self.line_ids:
            product = line.source_line_id.product_id
            quantity_by_product[product] = quantity_by_product.get(product, 0.0) + line.quantity

        picking = self.env["stock.picking"].sudo().create(
            {
                "picking_type_id": picking_type.id,
                "location_id": self.store_location_id.id,
                "location_dest_id": inspection.id,
                "origin": f"FU return quarantine {self.request_key}",
                "move_ids": [
                    Command.create(
                        {
                            "product_id": product.id,
                            "product_uom_qty": quantity,
                            "product_uom": product.uom_id.id,
                            "location_id": self.store_location_id.id,
                            "location_dest_id": inspection.id,
                        }
                    )
                    for product, quantity in quantity_by_product.items()
                ],
            }
        )
        picking.action_confirm()
        picking.action_assign()
        for move in picking.move_ids:
            move.quantity = move.product_uom_qty
        picking.button_validate()
        if picking.state != "done":
            raise UserError(_("Returned stock was not quarantined successfully."))
        return picking

    def action_execute(self):
        self._fu_assert_approval_role()
        results = self.env["pos.order"]
        for request in self:
            request._fu_assert_store_scope()
            self.env.cr.execute(
                "SELECT id FROM fu_retail_return_request WHERE id = %s FOR UPDATE",
                [request.id],
            )
            request.invalidate_recordset()
            if request.state == "done":
                results |= request.refund_order_id
                continue
            if request.state != "approved":
                raise ValidationError(_("Only an approved return request can be executed."))
            self.env.cr.execute(
                "SELECT id FROM pos_order WHERE id = %s FOR UPDATE",
                [request.source_order_id.id],
            )
            request._fu_validate_business_contract()
            refund_order = request._fu_prepare_native_refund()
            request._fu_settle_refund(refund_order)
            quarantine = request._fu_create_quarantine_picking()
            request.sudo().with_context(fu_return_internal=True).write(
                {
                    "state": "done",
                    "executed_by_id": self.env.user.id,
                    "executed_at": fields.Datetime.now(),
                    "refund_order_id": refund_order.id,
                    "quarantine_picking_id": quarantine.id,
                }
            )
            results |= refund_order
        return results


class FuRetailReturnLine(models.Model):
    _name = "fu.retail.return.line"
    _description = "Fares Retail Return Line"
    _order = "id"

    request_id = fields.Many2one(
        "fu.retail.return.request",
        required=True,
        ondelete="restrict",
        index=True,
        check_company=True,
    )
    company_id = fields.Many2one(related="request_id.company_id", store=True, readonly=True)
    source_line_id = fields.Many2one(
        "pos.order.line", required=True, readonly=True, copy=False, index=True
    )
    product_id = fields.Many2one(related="source_line_id.product_id", readonly=True)
    quantity = fields.Float(required=True, digits="Product Unit")
    inspection_state = fields.Selection(
        [
            ("pending", "Pending inspection"),
            ("accepted", "Accepted as sellable"),
            ("non_sellable", "Non-sellable"),
        ],
        required=True,
        default="pending",
        readonly=True,
        copy=False,
    )
    inspected_by_id = fields.Many2one("res.users", readonly=True, copy=False)
    inspected_at = fields.Datetime(readonly=True, copy=False)
    acceptance_picking_id = fields.Many2one("stock.picking", readonly=True, copy=False)

    _request_source_unique = models.UniqueIndex("(request_id, source_line_id)")
    _quantity_positive = models.Constraint(
        "CHECK (quantity > 0)", "Returned quantity must be greater than zero."
    )

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            request = self.env["fu.retail.return.request"].browse(vals.get("request_id"))
            request._fu_assert_request_role()
            request._fu_assert_store_scope()
            if request.state != "draft":
                raise AccessError(_("Return lines can only be added while the request is draft."))
        return super().create(vals_list)

    def write(self, vals):
        if not self.env.context.get("fu_return_internal"):
            if {"inspection_state", "inspected_by_id", "inspected_at", "acceptance_picking_id"}.intersection(vals):
                raise AccessError(_("Inspection audit fields are system managed."))
            for line in self:
                line.request_id._fu_assert_request_role()
                line.request_id._fu_assert_store_scope()
                if line.request_id.state != "draft":
                    raise AccessError(_("Submitted return lines cannot be edited directly."))
        return super().write(vals)

    def unlink(self):
        for line in self:
            line.request_id._fu_assert_request_role()
            line.request_id._fu_assert_store_scope()
            if line.request_id.state != "draft":
                raise AccessError(_("Submitted return lines are preserved as audit history."))
        return super().unlink()

    def _fu_assert_inspection_role(self):
        if not (
            self.env.is_superuser()
            or self.env.user.has_group("fu_core.group_fu_owner_admin")
            or self.env.user.has_group("fu_core.group_fu_store_manager")
            or self.env.user.has_group("fu_core.group_fu_inventory_staff")
        ):
            raise AccessError(_("This role cannot classify returned stock."))

    def action_accept_sellable(self):
        self._fu_assert_inspection_role()
        for line in self:
            request = line.request_id
            request._fu_assert_store_scope()
            self.env.cr.execute(
                "SELECT id FROM fu_retail_return_line WHERE id = %s FOR UPDATE", [line.id]
            )
            line.invalidate_recordset()
            if line.inspection_state == "accepted":
                continue
            if line.inspection_state != "pending" or request.state != "done":
                raise ValidationError(_("Only a completed return pending inspection can re-enter sellable stock."))

            store = request.store_location_id
            warehouse = store.warehouse_id
            inspection = self.env["stock.location"]._fu_get_or_create_returns_inspection_location(
                warehouse
            )
            available = self.env["stock.quant"].sudo()._get_available_quantity(
                line.product_id, inspection
            )
            if line.product_id.uom_id.compare(available, line.quantity) < 0:
                raise ValidationError(_("Returns / Inspection does not contain enough of this item."))

            picking = self.env["stock.picking"].sudo().create(
                {
                    "picking_type_id": warehouse.int_type_id.id,
                    "location_id": inspection.id,
                    "location_dest_id": store.id,
                    "origin": f"FU inspected return {request.request_key}:{line.id}",
                    "move_ids": [
                        Command.create(
                            {
                                "product_id": line.product_id.id,
                                "product_uom_qty": line.quantity,
                                "product_uom": line.product_id.uom_id.id,
                                "location_id": inspection.id,
                                "location_dest_id": store.id,
                            }
                        )
                    ],
                }
            )
            picking.action_confirm()
            picking.action_assign()
            picking.move_ids.quantity = line.quantity
            picking.button_validate()
            if picking.state != "done":
                raise UserError(_("The inspected item did not return to sellable stock."))
            line.sudo().with_context(fu_return_internal=True).write(
                {
                    "inspection_state": "accepted",
                    "inspected_by_id": self.env.user.id,
                    "inspected_at": fields.Datetime.now(),
                    "acceptance_picking_id": picking.id,
                }
            )
        return True

    def action_mark_non_sellable(self):
        self._fu_assert_inspection_role()
        for line in self:
            line.request_id._fu_assert_store_scope()
            if line.inspection_state == "non_sellable":
                continue
            if line.inspection_state != "pending" or line.request_id.state != "done":
                raise ValidationError(_("Only a completed return pending inspection can be classified."))
            line.sudo().with_context(fu_return_internal=True).write(
                {
                    "inspection_state": "non_sellable",
                    "inspected_by_id": self.env.user.id,
                    "inspected_at": fields.Datetime.now(),
                }
            )
        return True
