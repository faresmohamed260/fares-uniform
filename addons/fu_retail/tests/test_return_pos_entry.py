from odoo import Command
from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailReturnPOSEntry(TestPointOfSaleHttpCommon):
    def setUp(self):
        super().setUp()
        self.pos_user.group_ids += self.env.ref("fu_core.group_fu_cashier")
        store = self.main_pos_config.picking_type_id.warehouse_id.lot_stock_id
        if store.fu_location_role != "store":
            store.fu_location_role = "store"
        self.pos_user.fu_stock_location_ids = [Command.set([store.id])]

    def test_controlled_returns_entry_replaces_native_refund(self):
        self.start_pos_tour("fu_retail_returns_entry_online", timeout=180)

    def test_returns_entry_fails_closed_offline(self):
        self.start_pos_tour("fu_retail_returns_entry_offline", timeout=180)
