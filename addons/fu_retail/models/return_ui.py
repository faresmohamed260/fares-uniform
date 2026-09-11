from odoo import _, api, fields, models
from odoo.exceptions import AccessError


class FuRetailReturnRequest(models.Model):
    _inherit = "fu.retail.return.request"

    # The source must be selectable on a new draft form. The create() override on
    # the base model still derives company/store authoritatively and write() below
    # prevents source swapping after the record exists.
    source_order_id = fields.Many2one(
        "pos.order",
        required=True,
        readonly=False,
        copy=False,
        index=True,
        check_company=True,
    )
    exchange_difference_preview = fields.Monetary(
        string="Current price difference",
        currency_field="currency_id",
        compute="_compute_exchange_difference_preview",
        help="Positive means collect from the customer; negative means refund to the customer. Execution recomputes the native POS order authoritatively.",
    )

    @api.depends(
        "operation",
        "source_order_id",
        "line_ids.source_line_id",
        "line_ids.quantity",
        "line_ids.replacement_product_id",
    )
    def _compute_exchange_difference_preview(self):
        line_model = self.env["pos.order.line"]
        for request in self:
            difference = 0.0
            if request.operation == "exchange" and request.source_order_id:
                for line in request.line_ids:
                    source = line.source_line_id
                    replacement = line.replacement_product_id
                    if not source or not replacement or line.quantity <= 0 or source.qty <= 0:
                        continue
                    source_total = (source.price_subtotal_incl / source.qty) * line.quantity
                    replacement_line = line_model.new(
                        {
                            "order_id": request.source_order_id.id,
                            "product_id": replacement.id,
                            "qty": line.quantity,
                        }
                    )
                    replacement_line._onchange_product_id()
                    replacement_line._onchange_qty()
                    replacement_line._onchange_amount_line_all()
                    difference += replacement_line.price_subtotal_incl - source_total
            request.exchange_difference_preview = difference

    def write(self, vals):
        if self.env.context.get("fu_return_internal"):
            return super().write(vals)

        if "source_order_id" in vals:
            raise AccessError(_("The original retail transaction cannot be changed after a return request is created."))

        evidence_fields = {"physical_received", "bank_refund_confirmed", "settlement_reference"}
        if vals and set(vals).issubset(evidence_fields) and any(
            request.state in {"requested", "approved"} for request in self
        ):
            for request in self:
                request._fu_assert_approval_role()
                request._fu_assert_store_scope()
                if request.state not in {"requested", "approved"}:
                    raise AccessError(_("Settlement evidence can only be updated on a submitted or approved request."))
            return super(FuRetailReturnRequest, self.with_context(fu_return_internal=True)).write(vals)

        return super().write(vals)


class FuRetailReturnLine(models.Model):
    _inherit = "fu.retail.return.line"

    source_line_id = fields.Many2one(
        "pos.order.line",
        required=True,
        readonly=False,
        copy=False,
        index=True,
    )
    source_product_template_id = fields.Many2one(
        "product.template",
        string="Original product",
        related="source_line_id.product_id.product_tmpl_id",
        readonly=True,
    )
