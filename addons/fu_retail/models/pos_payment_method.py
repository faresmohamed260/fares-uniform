from odoo import fields, models


class PosPaymentMethod(models.Model):
    _inherit = "pos.payment.method"

    fu_confirmation_mode = fields.Selection(
        selection=[
            ("none", "No manual confirmation"),
            ("bank_notification", "Bank notification observed"),
        ],
        string="Manual Confirmation",
        default="none",
        required=True,
        help=(
            "Require the cashier to explicitly confirm an external payment signal "
            "before this payment method can be recorded. This does not verify the "
            "payment with a bank or payment provider."
        ),
    )

    def _load_pos_data_fields(self, config):
        fields_to_load = list(super()._load_pos_data_fields(config))
        if "fu_confirmation_mode" not in fields_to_load:
            fields_to_load.append("fu_confirmation_mode")
        return fields_to_load
