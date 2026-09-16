from odoo import fields, models


class AccountJournal(models.Model):
    _inherit = "account.journal"

    fu_confirmation_mode = fields.Selection(
        [
            ("none", "No extra confirmation"),
            ("bank_notification", "Manual bank notification"),
        ],
        string="Fares payment confirmation",
        default="none",
        required=True,
        help=(
            "Controls whether a Fares preorder payment recorded through this journal "
            "requires explicit staff confirmation of an observed bank notification."
        ),
    )
