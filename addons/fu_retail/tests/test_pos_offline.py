from odoo.addons.point_of_sale.tests.test_frontend import TestPointOfSaleHttpCommon
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailPOSOffline(TestPointOfSaleHttpCommon):
    def setUp(self):
        super().setUp()
        self.pos_user.group_ids += self.env.ref("fu_core.group_fu_cashier")
        cash_journal = self.env["account.journal"].create(
            {
                "name": "Fares Retail Cash Test",
                "type": "cash",
                "company_id": self.env.company.id,
                "code": "FUC",
            }
        )
        self.cash_payment_method = self.env["pos.payment.method"].create(
            {"name": "Cash", "journal_id": cash_journal.id}
        )
        self.bank_payment_method.write(
            {"name": "InstaPay", "fu_confirmation_mode": "bank_notification"}
        )
        self.main_pos_config.write(
            {
                "payment_method_ids": [
                    (6, 0, [self.cash_payment_method.id, self.bank_payment_method.id])
                ]
            }
        )

    def _assert_single_synced_order(self, method_name, manual_confirmed):
        orders = self.env["pos.order"].search(
            [("config_id", "=", self.main_pos_config.id), ("state", "=", "paid")]
        )
        self.assertEqual(len(orders), 1, "Reconnect/replay must create exactly one paid order")
        self.assertEqual(len(orders.payment_ids), 1)
        self.assertEqual(orders.payment_ids.payment_method_id.name, method_name)
        self.assertEqual(orders.payment_ids.fu_manual_confirmed, manual_confirmed)
        self.assertAlmostEqual(orders.amount_paid, orders.amount_total)

    def test_instapay_cancel_then_confirm_ui_gate(self):
        self.start_pos_tour("fu_retail_instapay_cancel_then_confirm", timeout=180)

    def test_offline_cash_reload_reconnect_is_idempotent(self):
        self.start_pos_tour("fu_retail_offline_cash", timeout=180)
        self._assert_single_synced_order("Cash", False)

    def test_offline_cash_arabic_receipt_marks_pending_sync(self):
        self.env["res.lang"]._activate_and_install_lang("ar_001")
        self.pos_user.lang = "ar_001"
        self.start_pos_tour("fu_retail_offline_cash_ar", timeout=180)
        self._assert_single_synced_order("Cash", False)

    def test_offline_instapay_reload_reconnect_is_idempotent(self):
        self.start_pos_tour("fu_retail_offline_instapay", timeout=180)
        self._assert_single_synced_order("InstaPay", True)
