from odoo.tests import tagged
from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon
from .visual_capture import capture_views, install_arabic


@tagged("post_install", "-at_install")
class TestProofPOS(TestPointOfSaleHttpCommon):
    def check_offline_checkout(self, method):
        self.start_pos_tour("fu_offline_checkout_" + method, timeout=180)
        orders = self.env["pos.order"].search([
            ("config_id", "=", self.main_pos_config.id), ("state", "=", "paid"),
        ])
        self.assertEqual(len(orders), 1, "Reconnect must create exactly one paid order")
        self.assertEqual(len(orders.payment_ids), 1)
        self.assertAlmostEqual(orders.amount_paid, orders.amount_total)

    def test_offline_bank_reload_reconnect(self):
        self.check_offline_checkout("Bank")

    def test_offline_cash_reload_reconnect(self):
        self.check_offline_checkout("Cash")

    def test_native_pos_visual(self):
        with capture_views("pos_en", pos=True):
            self.start_pos_tour("fu_pos_visual", timeout=120)

    def test_native_pos_visual_arabic(self):
        install_arabic(self.env, self.pos_user)
        with capture_views("pos_ar", rtl=True, pos=True):
            self.start_pos_tour("fu_pos_visual", timeout=120)
