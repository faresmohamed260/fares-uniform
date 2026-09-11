from odoo import _, Command, api, fields, models
from odoo.exceptions import ValidationError

from .business import _INTERNAL_CONTEXT


class FuBusinessQuotationWizard(models.TransientModel):
    _name = "fu.business.quotation.wizard"
    _description = "Fares Business Draft Quotation Editor"

    quotation_id = fields.Many2one(
        "sale.order",
        string="Business quotation",
        required=True,
        readonly=True,
    )
    client_order_ref = fields.Char(string="Customer Reference")
    commitment_date = fields.Datetime(string="Delivery Date")
    line_ids = fields.One2many(
        "fu.business.quotation.wizard.line",
        "wizard_id",
        string="Candidate items",
    )

    @api.model
    def default_get(self, field_names):
        values = super().default_get(field_names)
        quotation_id = self.env.context.get("default_quotation_id") or self.env.context.get(
            "active_id"
        )
        if not quotation_id:
            return values

        order = self.env["sale.order"].browse(quotation_id).exists()
        if not order:
            return values
        order._fu_assert_draft_editor_access()

        values.update(
            {
                "quotation_id": order.id,
                "client_order_ref": order.client_order_ref,
                "commitment_date": order.commitment_date,
                "line_ids": [
                    Command.create(
                        {
                            "product_id": line.product_id.id,
                            "quantity": line.product_uom_qty,
                            "unit_price": line.price_unit,
                        }
                    )
                    for line in order.order_line
                    if not line.display_type and not line.is_downpayment
                ],
            }
        )
        return values

    def action_save_draft(self):
        self.ensure_one()
        order = self.quotation_id
        order._fu_assert_draft_editor_access()

        for line in self.line_ids:
            if line.quantity <= 0:
                raise ValidationError(_("Candidate item quantity must be greater than zero."))
            if line.unit_price < 0:
                raise ValidationError(_("Candidate unit price cannot be negative."))
            if not line.product_id.sale_ok:
                raise ValidationError(_("Candidate products must be available for sale."))

        commands = [Command.clear()]
        commands.extend(
            Command.create(
                {
                    "product_id": line.product_id.id,
                    "product_uom_qty": line.quantity,
                    "price_unit": line.unit_price,
                }
            )
            for line in self.line_ids
        )
        order.sudo().with_context(
            **{_INTERNAL_CONTEXT: True, "sale_no_log_for_new_lines": True}
        ).write(
            {
                "client_order_ref": self.client_order_ref or False,
                "commitment_date": self.commitment_date or False,
                "order_line": commands,
            }
        )

        view = self.env.ref("fu_business.fu_business_sale_order_form")
        return {
            "type": "ir.actions.act_window",
            "name": self.env._("Business Quotation"),
            "res_model": "sale.order",
            "res_id": order.id,
            "view_mode": "form",
            "views": [(view.id, "form")],
            "target": "current",
        }


class FuBusinessQuotationWizardLine(models.TransientModel):
    _name = "fu.business.quotation.wizard.line"
    _description = "Fares Business Draft Quotation Candidate Item"

    wizard_id = fields.Many2one(
        "fu.business.quotation.wizard",
        required=True,
        ondelete="cascade",
    )
    product_id = fields.Many2one(
        "product.product",
        string="Product",
        required=True,
        domain="[('sale_ok', '=', True)]",
    )
    quantity = fields.Float(
        string="Quantity",
        required=True,
        default=1.0,
        digits="Product Unit",
    )
    unit_price = fields.Float(
        string="Unit Price",
        required=True,
        digits="Product Price",
    )

    @api.onchange("product_id")
    def _onchange_product_id(self):
        for line in self:
            if line.product_id:
                line.unit_price = line.product_id.lst_price
