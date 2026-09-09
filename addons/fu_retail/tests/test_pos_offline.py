from odoo import Command
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

        self.assertEqual(len(orders.lines), 1, "The checkout fixture must contain one sold product line")
        self.assertEqual(
            len(orders.picking_ids),
            1,
            "Reconnect/replay must create exactly one authoritative stock picking",
        )
        picking = orders.picking_ids
        self.assertEqual(picking.state, "done", "The authoritative POS stock picking must be done")
        self.assertEqual(
            len(picking.move_ids),
            1,
            "Reconnect/replay must create exactly one stock move for the sold product",
        )
        move = picking.move_ids
        self.assertEqual(move.product_id, orders.lines.product_id)
        self.assertAlmostEqual(
            move.quantity,
            orders.lines.qty,
            msg="Reconnect/replay must execute stock exactly once for the sold quantity",
        )

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

    def test_revoked_cashier_reconnect_is_retained_for_review(self):
        cashier_group = self.env.ref("fu_core.group_fu_cashier")
        native_pos_user = self.env.ref("point_of_sale.group_pos_user")
        self.pos_user.write(
            {
                "group_ids": [
                    Command.link(native_pos_user.id),
                    Command.unlink(cashier_group.id),
                ]
            }
        )
        self.assertTrue(self.pos_user.has_group("point_of_sale.group_pos_user"))
        self.assertFalse(self.pos_user.has_group("fu_core.group_fu_cashier"))

        self.start_pos_tour("fu_retail_revoked_cashier_review", timeout=180)

        self.assertFalse(
            self.env["pos.order"].search(
                [("config_id", "=", self.main_pos_config.id), ("state", "=", "paid")]
            ),
            "Server-rejected offline sale must not become an authoritative paid order",
        )