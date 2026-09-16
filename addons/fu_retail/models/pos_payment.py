from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class PosPayment(models.Model):
    _inherit = "pos.payment"

    fu_manual_confirmed = fields.Boolean(
        string="Manual payment confirmation",
        copy=False,
        help=(
            "The cashier explicitly confirmed the external signal required by the "
            "payment method. For the initial InstaPay workflow this means the bank "
            "mobile transaction notification was observed; it is not bank-side verification."
        ),
    )

    @api.model_create_multi
    def create(self, vals_list):
        method_ids = {vals.get("payment_method_id") for vals in vals_list if vals.get("payment_method_id")}
        methods = {method.id: method for method in self.env["pos.payment.method"].browse(method_ids)}
        for vals in vals_list:
            method = methods.get(vals.get("payment_method_id"))
            if (
                method
                and method.fu_confirmation_mode == "bank_notification"
                and not vals.get("fu_manual_confirmed")
            ):
                raise ValidationError(
                    _("This payment method requires staff confirmation that the bank notification was observed.")
                )
        return super().create(vals_list)

    def write(self, vals):
        if vals.get("fu_manual_confirmed") is False:
            protected = self.filtered(
                lambda payment: payment.payment_method_id.fu_confirmation_mode == "bank_notification"
            )
            if protected:
                raise ValidationError(
                    _("A recorded manual bank-notification confirmation cannot be cleared.")
                )

        if vals.get("payment_method_id"):
            method = self.env["pos.payment.method"].browse(vals["payment_method_id"])
            if method.fu_confirmation_mode == "bank_notification":
                for payment in self:
                    if not vals.get("fu_manual_confirmed", payment.fu_manual_confirmed):
                        raise ValidationError(
                            _("This payment method requires staff confirmation that the bank notification was observed.")
                        )

        return super().write(vals)
