from odoo import fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    fu_stock_location_ids = fields.Many2many(
        "stock.location",
        "fu_res_users_stock_location_rel",
        "user_id",
        "location_id",
        string="Fares stock locations",
        domain=[("fu_location_role", "in", ["store", "storage"])],
        help="Retail Store/Storage locations this user may see or operate within. Owner/Admin is not location-scoped.",
    )

    @property
    def SELF_READABLE_FIELDS(self):
        # A user may inspect their own assignment but cannot self-edit it because
        # the field is intentionally absent from SELF_WRITEABLE_FIELDS.
        return super().SELF_READABLE_FIELDS + ["fu_stock_location_ids"]
