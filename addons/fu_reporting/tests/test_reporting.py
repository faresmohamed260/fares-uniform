from datetime import date, datetime, timedelta

from odoo import Command, fields
from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestFaresReporting(CommonPosTest):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        # CommonPosTest creates its company after module post-init hooks have run.
        # Re-run the idempotent Phase 1 location initializer for this test company
        # so the reporting fixture exercises the same Store/Storage contract as a
        # real initialized Fares company.
        cls.env["stock.location"].with_context(
            allowed_company_ids=[cls.env.company.id]
        )._fu_configure_initial_locations()
        cls.service = cls.env["fu.reporting.service"]
        cls.store = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )
        cls.storage = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "storage"),
            ],
            limit=1,
        )
        if not cls.store or not cls.storage:
            raise AssertionError("Phase 4B requires the Phase 1 Store and Storage locations")

        cls.product = cls.ten_dollars_no_tax.product_variant_id
        cls.product.product_tmpl_id.write({"is_storable": True, "taxes_id": [Command.clear()]})
        cls.partner = cls.env["res.partner"].create({"name": "Phase 4B Reporting Customer"})

        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 4B Cash",
                "type": "cash",
                "code": "P4BC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.instapay_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 4B InstaPay",
                "type": "bank",
                "code": "P4BI",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "bank_notification",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        cls.instapay_method = cls.instapay_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method or not cls.instapay_method:
            raise AssertionError("Phase 4B payment journals require native inbound methods")

        cls.manager = cls._make_user(
            "manager", cls.env.ref("fu_core.group_fu_store_manager"), [cls.store]
        )
        cls.cashier = cls._make_user(
            "cashier", cls.env.ref("fu_core.group_fu_cashier"), [cls.store]
        )
        cls.inventory = cls._make_user(
            "inventory", cls.env.ref("fu_core.group_fu_inventory_staff"), [cls.store]
        )
        cls.production = cls._make_user(
            "production", cls.env.ref("fu_core.group_fu_production_manager"), []
        )
        cls.sales = cls._make_user(
            "sales", cls.env.ref("fu_core.group_fu_sales_bd"), []
        )

    @classmethod
    def _make_user(cls, suffix, group, locations):
        values = {
            "name": f"Phase 4B {suffix}",
            "login": f"phase4b-{suffix}@example.invalid",
            "email": f"phase4b-{suffix}@example.invalid",
            "group_ids": [Command.set([group.id])],
        }
        if locations:
            values["fu_stock_location_ids"] = [Command.set([location.id for location in locations])]
        return cls.env["res.users"].with_context(no_reset_password=True).create(values)

    def _create_preorder(self, promised=None, quantity=1):
        promised = promised or (fields.Datetime.now() + timedelta(days=10))
        order_id = self.env["sale.order"].fu_create_preorder(
            self.partner.id,
            promised,
            [{"product_id": self.product.id, "quantity": quantity}],
            self.store.id,
        )
        return self.env["sale.order"].sudo().browse(order_id)

    def _pay_preorder(self, order, amount, key, instapay=False):
        journal = self.instapay_journal if instapay else self.cash_journal
        method = self.instapay_method if instapay else self.cash_method
        payment_id = order.fu_record_payment(
            amount,
            journal.id,
            method.id,
            key,
            manual_confirmed=instapay,
        )
        return self.env["account.payment"].sudo().browse(payment_id)

    def _create_business_order(self, promised=None, deposit=25.0):
        promised = promised or (fields.Datetime.now() + timedelta(days=12))
        lead = self.env["crm.lead"].create(
            {
                "name": "Phase 4B Reporting Business Enquiry",
                "fu_business_client": True,
                "partner_id": self.partner.id,
                "partner_name": self.partner.name,
                "contact_name": "Phase 4B Procurement",
                "fu_design_requirements": "Reporting fixture",
            }
        )
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        quotation_id = lead.action_fu_create_business_quotation()["res_id"]
        order = self.env["sale.order"].browse(quotation_id)
        editor = self.env["fu.business.quotation.wizard"].create(
            {
                "quotation_id": order.id,
                "client_order_ref": f"P4B-{order.id}",
                "commitment_date": promised,
                "line_ids": [
                    Command.create(
                        {
                            "product_id": self.product.id,
                            "quantity": 4,
                            "unit_price": 100.0,
                        }
                    )
                ],
            }
        )
        editor.action_save_draft()
        order.invalidate_recordset()
        order.fu_record_business_payment(
            deposit,
            self.cash_journal.id,
            self.cash_method.id,
            f"p4b-business-{order.id}",
        )
        order.action_fu_confirm_business_order()
        order.invalidate_recordset()
        return order

    def test_completed_pos_sale_drives_daily_sales_and_cash_movement(self):
        report_date = self.service._fu_default_report_date()
        order, _refund = self.create_backend_pos_order(
            {
                "line_data": [{"product_id": self.product.id, "qty": 1}],
                "payment_data": [
                    {"payment_method_id": self.cash_payment_method.id, "amount": self.product.lst_price}
                ],
            }
        )
        self.assertIn(order.state, ("paid", "done"))
        snapshot = self.service.fu_get_snapshot(report_date, self.store.id)
        expected = self.service._fu_company_amount(
            order.amount_total, order.currency_id, order.date_order
        )
        self.assertAlmostEqual(snapshot["sales"]["gross"], expected)
        self.assertAlmostEqual(snapshot["sales"]["net"], expected)
        self.assertAlmostEqual(snapshot["sales"]["refunds"], 0.0)
        expected_payment = sum(
            self.service._fu_company_amount(p.amount, p.currency_id, p.payment_date)
            for p in order.payment_ids.filtered(lambda payment: not payment.is_change)
        )
        self.assertAlmostEqual(snapshot["payments"]["cash"]["net"], expected_payment)

    def test_preorder_deposit_is_receipt_and_balance_not_daily_sale(self):
        report_date = self.service._fu_default_report_date()
        order = self._create_preorder()
        before = self.service.fu_get_snapshot(report_date, self.store.id)
        deposit = order.amount_total / 2
        payment = self._pay_preorder(order, deposit, "p4b-preorder-cash")
        after = self.service.fu_get_snapshot(report_date, self.store.id)

        self.assertEqual(before["sales"], after["sales"])
        expected = self.service._fu_company_amount(
            payment.amount, payment.currency_id, payment.date
        )
        self.assertAlmostEqual(
            after["payments"]["cash"]["net"] - before["payments"]["cash"]["net"],
            expected,
        )
        balance_rows = after["balances"]["rows"]
        row = next(item for item in balance_rows if item["order_id"] == order.id)
        self.assertAlmostEqual(row["balance_due"], order._fu_live_balance_due())

    def test_instapay_preorder_payment_is_classified_from_journal_confirmation_mode(self):
        report_date = self.service._fu_default_report_date()
        order = self._create_preorder()
        payment = self._pay_preorder(order, order.amount_total / 3, "p4b-preorder-instapay", instapay=True)
        snapshot = self.service.fu_get_snapshot(report_date, self.store.id)
        expected = self.service._fu_company_amount(payment.amount, payment.currency_id, payment.date)
        self.assertAlmostEqual(snapshot["payments"]["instapay"]["net"], expected)
        self.assertGreater(snapshot["payments"]["instapay"]["count"], 0)

    def test_low_stock_rule_uses_native_available_quantity_and_has_no_implicit_rule(self):
        initial = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertFalse(
            any(row["product_id"] == self.product.id for row in initial["low_stock"]["rows"])
        )
        rule = self.env["fu.reporting.stock.rule"].create(
            {
                "location_id": self.store.id,
                "product_id": self.product.id,
                "minimum_available_qty": 2.0,
            }
        )
        low = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertTrue(
            any(row["product_id"] == self.product.id for row in low["low_stock"]["rows"])
        )
        self.env["fu.stock.movement.request"].process_idempotent(
            "P4B-LOW-STOCK-SEED-001",
            "opening",
            product_id=self.product.id,
            quantity=5,
            destination_location_id=self.store.id,
            reason="Phase 4B reporting stock fixture",
            batch_ref="P4B-OPENING",
        )
        recovered = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertFalse(
            any(row["product_id"] == self.product.id for row in recovered["low_stock"]["rows"])
        )
        self.assertTrue(rule.active)

    def test_low_stock_configuration_is_owner_only_and_manager_location_scope_fails_closed(self):
        with self.assertRaises(AccessError):
            self.env["fu.reporting.stock.rule"].with_user(self.manager).create(
                {
                    "location_id": self.store.id,
                    "product_id": self.product.id,
                    "minimum_available_qty": 1.0,
                }
            )
        manager_service = self.env["fu.reporting.service"].with_user(self.manager)
        snapshot = manager_service.fu_get_snapshot(location_id=self.store.id)
        self.assertEqual(snapshot["meta"]["role"], "manager")
        with self.assertRaisesRegex(AccessError, "outside your authorized scope"):
            manager_service.fu_get_snapshot(location_id=self.storage.id)

    def test_upcoming_overdue_and_preorder_balance_follow_live_order_state(self):
        future = self._create_preorder(fields.Datetime.now() + timedelta(days=8))
        past = self._create_preorder(fields.Datetime.now() - timedelta(days=2))
        snapshot = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertIn(future.id, {row["order_id"] for row in snapshot["upcoming"]["rows"]})
        self.assertIn(past.id, {row["order_id"] for row in snapshot["overdue"]["rows"]})
        balances = {row["order_id"] for row in snapshot["balances"]["rows"]}
        self.assertIn(future.id, balances)
        self.assertIn(past.id, balances)

        self._pay_preorder(future, future.amount_total, "p4b-preorder-full")
        after_payment = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertNotIn(future.id, {row["order_id"] for row in after_payment["balances"]["rows"]})

    def test_business_order_receipt_deadline_and_balance_are_owner_only(self):
        report_date = self.service._fu_default_report_date()
        order = self._create_business_order()
        owner = self.service.fu_get_snapshot(report_date)
        self.assertIn(order.id, {row["order_id"] for row in owner["upcoming"]["rows"]})
        self.assertIn(order.id, {row["order_id"] for row in owner["balances"]["rows"]})
        self.assertGreater(owner["payments"]["cash"]["count"], 0)

        manager = self.env["fu.reporting.service"].with_user(self.manager).fu_get_snapshot(report_date)
        self.assertNotIn(order.id, {row["order_id"] for row in manager["upcoming"]["rows"]})
        self.assertNotIn(order.id, {row["order_id"] for row in manager["balances"]["rows"]})

    def test_timezone_day_bounds_use_company_timezone_and_explicit_utc_fallback(self):
        self.env.company.partner_id.tz = "Asia/Dubai"
        report_date, start, end = self.service._fu_day_bounds(date(2026, 1, 5))
        self.assertEqual(report_date, date(2026, 1, 5))
        self.assertEqual(start, datetime(2026, 1, 4, 20, 0, 0))
        self.assertEqual(end, datetime(2026, 1, 5, 20, 0, 0))
        self.assertEqual(self.service._fu_timezone()[0], "Asia/Dubai")

        self.env.company.partner_id.tz = False
        self.assertEqual(self.service._fu_timezone()[0], "UTC")

    def test_reporting_roles_and_pagination_are_server_enforced(self):
        for user in (self.cashier, self.inventory, self.production, self.sales):
            with self.subTest(user=user.login):
                with self.assertRaises(AccessError):
                    self.env["fu.reporting.service"].with_user(user).fu_get_snapshot()
        with self.assertRaises(ValidationError):
            self.service.fu_get_snapshot(limit=101)
        with self.assertRaises(ValidationError):
            self.service.fu_get_snapshot(offset=-1)
