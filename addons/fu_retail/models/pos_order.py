from odoo import _, api, models
from odoo.exceptions import AccessError


class PosOrder(models.Model):
    _inherit = "pos.order"

    _FU_RETAIL_SYNC_GROUPS = (
        "fu_core.group_fu_owner_admin",
        "fu_core.group_fu_store_manager",
        "fu_core.group_fu_cashier",
    )

    @api.model
    def _fu_assert_retail_sync_authorized(self):
        if not any(self.env.user.has_group(xmlid) for xmlid in self._FU_RETAIL_SYNC_GROUPS):
            raise AccessError(
                _(
                    "Retail checkout synchronization requires an active Fares Uniform "
                    "Owner, Store Manager, or Cashier role. This transaction remains "
                    "pending and requires review."
                )
            )

    @api.model
    def sync_from_ui(self, orders):
        if orders:
            self._fu_assert_retail_sync_authorized()
        return super().sync_from_ui(orders)
