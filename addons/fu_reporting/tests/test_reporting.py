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

    def _create_business_draft(self, promised=None):
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
        return order

    def _record_business_payment(self, order, amount, key, instapay=False):
        journal = self.instapay_journal if instapay else self.cash_journal
        method = self.instapay_method if instapay else self.cash_method
        payment_id = order.fu_record_business_payment(
            amount,
            journal.id,
            method.id,
            key,
            manual_confirmed=instapay,
        )
        order.invalidate_recordset()
        return self.env["account.payment"].sudo().browse(payment_id)

    def _create_business_order(self, promised=None, deposit=25.0):
        order = self._create_business_draft(promised)
        self._record_business_payment(
            order,
            deposit,
            f"p4b-business-{order.id}",
        )
        order.action_fu_confirm_business_order()
        order.invalidate_recordset()
        return order

    def _seed_store(self, quantity, key):
        return self.env["fu.stock.movement.request"].process_idempotent(
            key,
            "opening",
            product_id=self.product.id,
            quantity=quantity,
            destination_location_id=self.store.id,
            reason="Phase 4B reporting stock fixture",
            batch_ref="P4B-REPORTING-OPENING",
        )

    def _cash_sale(self, quantity=1):
        order, _refund = self.create_backend_pos_order(
            {
                "line_data": [{"product_id": self.product.id, "qty": quantity}],
                "payment_data": [
                    {
                        "payment_method_id": self.cash_payment_method.id,
                        "amount": self.product.lst_price * quantity,
                    }
                ],
            }
        )
        self.assertIn(order.state, ("paid", "done"))
        return order

    def _execute_refund(self, order, **extra):
        source_line = order.lines.filtered(lambda line: line.qty > 0)[:1]
        request = self.env["fu.retail.return.request"].with_user(self.cashier).create(
            {
                "source_order_id": order.id,
                "operation": "refund",
                "eligibility_path": "no_reason",
                "reason": "Phase 4B reporting refund fixture",
                "physical_received": True,
                "line_ids": [
                    Command.create(
                        {"source_line_id": source_line.id, "quantity": 1}
                    )
                ],
                **extra,
            }
        )
        request.with_user(self.cashier).action_submit()
        request.with_user(self.manager).action_approve()
        refund = request.with_user(self.manager).action_execute()
        refund.ensure_one()
        return refund

    def test_completed_pos_sale_drives_daily_sales_and_cash_movement(self):
        report_date = self.service._fu_default_report_date()
        order = self._cash_sale()
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

    def test_cash_refund_reverses_sales_and_cash_movement_through_return_workflow(self):
        self._seed_store(2, "P4B-REFUND-STOCK")
        report_date = self.service._fu_default_report_date()
        order = self._cash_sale()
        after_sale = self.service.fu_get_snapshot(report_date, self.store.id)

        refund = self._execute_refund(order)
        self.assertTrue(refund.is_refund)
        self.assertEqual(refund.refunded_order_id, order)
        after_refund = self.service.fu_get_snapshot(report_date, self.store.id)

        refund_value = -self.service._fu_company_amount(
            refund.amount_total, refund.currency_id, refund.date_order
        )
        self.assertGreater(refund_value, 0)
        self.assertAlmostEqual(after_refund["sales"]["gross"], after_sale["sales"]["gross"])
        self.assertAlmostEqual(
            after_refund["sales"]["refunds"] - after_sale["sales"]["refunds"],
            refund_value,
        )
        self.assertAlmostEqual(
            after_refund["sales"]["net"] - after_sale["sales"]["net"],
            -refund_value,
        )
        refund_payment = refund.payment_ids.filtered(lambda payment: not payment.is_change).ensure_one()
        refund_movement = -self.service._fu_company_amount(
            refund_payment.amount,
            refund_payment.currency_id,
            refund_payment.payment_date,
        )
        self.assertAlmostEqual(
            after_refund["payments"]["cash"]["outflow"]
            - after_sale["payments"]["cash"]["outflow"],
            refund_movement,
        )
        self.assertAlmostEqual(
            after_refund["payments"]["cash"]["net"]
            - after_sale["payments"]["cash"]["net"],
            -refund_movement,
        )

    def test_pos_instapay_refund_and_other_method_are_classified_from_method_metadata(self):
        self._seed_store(3, "P4B-POS-PAYMENT-STOCK")
        report_date = self.service._fu_default_report_date()
        before = self.service.fu_get_snapshot(report_date, self.store.id)

        other_method = self.env["pos.payment.method"].create(
            {
                "name": "Phase 4B Other Bank",
                "journal_id": self.company_data["default_journal_bank"].id,
                "receivable_account_id": self.company_data["default_account_receivable"].id,
            }
        )
        self.pos_config_usd.write({"payment_method_ids": [Command.link(other_method.id)]})
        other_order, _refund = self.create_backend_pos_order(
            {
                "line_data": [{"product_id": self.product.id, "qty": 1}],
                "payment_data": [
                    {
                        "payment_method_id": other_method.id,
                        "amount": self.product.lst_price,
                    }
                ],
            }
        )
        after_other = self.service.fu_get_snapshot(report_date, self.store.id)
        other_payment = other_order.payment_ids.filtered(lambda payment: not payment.is_change).ensure_one()
        expected_other = self.service._fu_company_amount(
            other_payment.amount,
            other_payment.currency_id,
            other_payment.payment_date,
        )
        self.assertAlmostEqual(
            after_other["payments"]["other"]["net"] - before["payments"]["other"]["net"],
            expected_other,
        )

        self.bank_payment_method.write(
            {"name": "Phase 4B POS InstaPay", "fu_confirmation_mode": "bank_notification"}
        )
        instapay_order, _refund = self.create_backend_pos_order(
            {"line_data": [{"product_id": self.product.id, "qty": 1}]}
        )
        instapay_order.add_payment(
            {
                "pos_order_id": instapay_order.id,
                "amount": instapay_order.amount_total,
                "payment_method_id": self.bank_payment_method.id,
                "name": "Phase 4B inbound InstaPay",
                "fu_manual_confirmed": True,
            }
        )
        instapay_order._process_saved_order(False)
        after_instapay = self.service.fu_get_snapshot(report_date, self.store.id)
        instapay_payment = instapay_order.payment_ids.filtered(
            lambda payment: not payment.is_change
        ).ensure_one()
        expected_instapay = self.service._fu_company_amount(
            instapay_payment.amount,
            instapay_payment.currency_id,
            instapay_payment.payment_date,
        )
        self.assertAlmostEqual(
            after_instapay["payments"]["instapay"]["inflow"]
            - after_other["payments"]["instapay"]["inflow"],
            expected_instapay,
        )

        refund = self._execute_refund(
            instapay_order,
            bank_refund_confirmed=True,
            settlement_reference="P4B-INSTAPAY-OUT-001",
        )
        after_instapay_refund = self.service.fu_get_snapshot(report_date, self.store.id)
        refund_payment = refund.payment_ids.filtered(lambda payment: not payment.is_change).ensure_one()
        expected_outflow = -self.service._fu_company_amount(
            refund_payment.amount,
            refund_payment.currency_id,
            refund_payment.payment_date,
        )
        self.assertAlmostEqual(
            after_instapay_refund["payments"]["instapay"]["outflow"]
            - after_instapay["payments"]["instapay"]["outflow"],
            expected_outflow,
        )

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

    def test_unposted_and_cancelled_preorder_payments_are_excluded(self):
        report_date = self.service._fu_default_report_date()
        order = self._create_preorder()
        baseline = self.service.fu_get_snapshot(report_date, self.store.id)
        payment = self.env["account.payment"].sudo().create(
            {
                "payment_type": "inbound",
                "partner_type": "customer",
                "partner_id": order.partner_id.id,
                "amount": order.amount_total / 4,
                "currency_id": order.currency_id.id,
                "journal_id": self.cash_journal.id,
                "payment_method_line_id": self.cash_method.id,
                "memo": f"Phase 4B unposted preorder {order.name}",
                "fu_preorder_id": order.id,
                "fu_preorder_payment_uuid": f"p4b-unposted-{order.id}",
                "fu_recorded_by_user_id": self.env.user.id,
            }
        )
        unposted = self.service.fu_get_snapshot(report_date, self.store.id)
        self.assertEqual(unposted["payments"]["cash"], baseline["payments"]["cash"])

        payment.action_post()
        posted = self.service.fu_get_snapshot(report_date, self.store.id)
        expected = self.service._fu_company_amount(
            payment.amount, payment.currency_id, payment.date
        )
        self.assertAlmostEqual(
            posted["payments"]["cash"]["net"] - baseline["payments"]["cash"]["net"],
            expected,
        )

        payment.action_cancel()
        cancelled = self.service.fu_get_snapshot(report_date, self.store.id)
        self.assertEqual(cancelled["payments"]["cash"], baseline["payments"]["cash"])

    def test_instapay_preorder_payment_is_classified_from_journal_confirmation_mode(self):
        report_date = self.service._fu_default_report_date()
        order = self._create_preorder()
        payment = self._pay_preorder(
            order,
            order.amount_total / 3,
            "p4b-preorder-instapay",
            instapay=True,
        )
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
        row = next(
            row for row in low["low_stock"]["rows"] if row["product_id"] == self.product.id
        )
        self.assertAlmostEqual(row["available_quantity"], 0.0)

        self._seed_store(2, "P4B-LOW-STOCK-EQUAL")
        equal = self.service.fu_get_snapshot(location_id=self.store.id)
        row = next(
            row for row in equal["low_stock"]["rows"] if row["product_id"] == self.product.id
        )
        self.assertAlmostEqual(row["available_quantity"], 2.0)

        self._seed_store(3, "P4B-LOW-STOCK-ABOVE")
        recovered = self.service.fu_get_snapshot(location_id=self.store.id)
        self.assertFalse(
            any(row["product_id"] == self.product.id for row in recovered["low_stock"]["rows"])
        )
        self.assertTrue(rule.active)

        inspection = self.env["stock.location"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_location_role", "=", "returns_inspection"),
            ],
            limit=1,
        )
        self.assertTrue(inspection)
        with self.assertRaisesRegex(ValidationError, "Store or Storage"):
            self.env["fu.reporting.stock.rule"].create(
                {
                    "location_id": inspection.id,
                    "product_id": self.product.id,
                    "minimum_available_qty": 1.0,
                }
            )

    def test_reservation_triggers_low_stock_without_reducing_physical_on_hand(self):
        self._seed_store(5, "P4B-RESERVATION-STOCK")
        self.env["fu.reporting.stock.rule"].create(
            {
                "location_id": self.store.id,
                "product_id": self.product.id,
                "minimum_available_qty": 2.0,
            }
        )
        order = self._create_business_order()
        picking = order.picking_ids.filtered(
            lambda item: item.location_dest_id.usage == "customer"
        ).ensure_one()
        picking.action_assign()

        Quant = self.env["stock.quant"].sudo()
        physical = sum(
            Quant.search(
                [
                    ("product_id", "=", self.product.id),
                    ("location_id", "child_of", self.store.id),
                ]
            ).mapped("quantity")
        )
        available = Quant._get_available_quantity(self.product, self.store, strict=False)
        self.assertAlmostEqual(physical, 5.0)
        self.assertAlmostEqual(available, 1.0)

        snapshot = self.service.fu_get_snapshot(location_id=self.store.id)
        row = next(
            row
            for row in snapshot["low_stock"]["rows"]
            if row["product_id"] == self.product.id
        )
        self.assertAlmostEqual(row["available_quantity"], 1.0)

    def test_low_stock_configuration_is_owner_only_and_manager_location_scope_fails_closed(self):
        with self.assertRaises(AccessError):
            self.env["fu.reporting.stock.rule"].with_user(self.manager).create(
                {
                    "location_id": self.store.id,
                    "product_id": self.product.id,
                    "minimum_available_qty": 1.0,
                }
            )
        self.env["fu.reporting.stock.rule"].create(
            {
                "location_id": self.store.id,
                "product_id": self.product.id,
                "minimum_available_qty": 0.0,
            }
        )
        manager_service = self.env["fu.reporting.service"].with_user(self.manager)
        snapshot = manager_service.fu_get_snapshot(location_id=self.store.id)
        self.assertEqual(snapshot["meta"]["role"], "manager")
        self.assertIn(
            self.product.id,
            {row["product_id"] for row in snapshot["low_stock"]["rows"]},
        )
        with self.assertRaisesRegex(AccessError, "outside your authorized scope"):
            manager_service.fu_get_snapshot(location_id=self.storage.id)

        other_company = self.env["res.company"].create({"name": "Phase 4B Other Company"})
        with self.assertRaisesRegex(AccessError, "current company"):
            self.env["fu.reporting.stock.rule"].create(
                {
                    "company_id": other_company.id,
                    "location_id": self.store.id,
                    "product_id": self.product.id,
                    "minimum_available_qty": 0.0,
                }
            )
        foreign_location = self.env["stock.location"].sudo().create(
            {
                "name": "Phase 4B Foreign Internal",
                "usage": "internal",
                "company_id": other_company.id,
            }
        )
        with self.assertRaisesRegex(AccessError, "outside your authorized scope"):
            self.service.fu_get_snapshot(location_id=foreign_location.id)

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

    def test_cancelled_and_fully_collected_preorders_leave_live_deadlines(self):
        cancelled = self._create_preorder(fields.Datetime.now() + timedelta(days=5))
        cancelled.action_cancel()
        cancelled.invalidate_recordset()
        self.assertEqual(cancelled.state, "cancel")

        collected = self._create_preorder(fields.Datetime.now() + timedelta(days=6))
        self._seed_store(1, "P4B-COLLECTED-PREORDER-STOCK")
        self._pay_preorder(collected, collected.amount_total, "p4b-collected-preorder-full")
        line = collected.order_line.filtered(lambda item: not item.display_type).ensure_one()
        collected.with_user(self.inventory).fu_allocate_ready(
            [{"line_id": line.id, "quantity": 1}]
        )
        collected.with_user(self.cashier).fu_collect(
            [{"line_id": line.id, "quantity": 1}],
            "p4b-reporting-collection",
        )
        collected.invalidate_recordset()
        self.assertEqual(collected.fu_collection_state, "collected")

        snapshot = self.service.fu_get_snapshot(location_id=self.store.id)
        live_deadlines = {
            row["order_id"]
            for bucket in ("upcoming", "overdue")
            for row in snapshot[bucket]["rows"]
        }
        balances = {row["order_id"] for row in snapshot["balances"]["rows"]}
        self.assertNotIn(cancelled.id, live_deadlines)
        self.assertNotIn(cancelled.id, balances)
        self.assertNotIn(collected.id, live_deadlines)
        self.assertNotIn(collected.id, balances)

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

    def test_business_draft_balance_requires_recorded_money(self):
        draft = self._create_business_draft(fields.Datetime.now() + timedelta(days=9))
        before = self.service.fu_get_snapshot()
        self.assertNotIn(draft.id, {row["order_id"] for row in before["balances"]["rows"]})
        self.assertNotIn(draft.id, {row["order_id"] for row in before["upcoming"]["rows"]})

        self._record_business_payment(draft, 25.0, f"p4b-draft-money-{draft.id}")
        after = self.service.fu_get_snapshot()
        self.assertIn(draft.id, {row["order_id"] for row in after["balances"]["rows"]})
        self.assertNotIn(draft.id, {row["order_id"] for row in after["upcoming"]["rows"]})
        manager = self.env["fu.reporting.service"].with_user(self.manager).fu_get_snapshot()
        self.assertNotIn(draft.id, {row["order_id"] for row in manager["balances"]["rows"]})

    def test_completed_business_delivery_leaves_live_deadlines(self):
        self._seed_store(4, "P4B-BUSINESS-SHIP-STOCK")
        order = self._create_business_order(fields.Datetime.now() + timedelta(days=7))
        before = self.service.fu_get_snapshot()
        self.assertIn(order.id, {row["order_id"] for row in before["upcoming"]["rows"]})

        self._record_business_payment(
            order,
            order._fu_live_business_balance_due(),
            f"p4b-business-balance-{order.id}",
        )
        picking = order.picking_ids.filtered(
            lambda item: item.location_dest_id.usage == "customer"
        ).ensure_one()
        picking.with_user(self.inventory).fu_release_business_delivery()
        picking.invalidate_recordset()
        self.assertEqual(picking.state, "done")

        after = self.service.fu_get_snapshot()
        live_deadlines = {
            row["order_id"]
            for bucket in ("upcoming", "overdue")
            for row in after[bucket]["rows"]
        }
        self.assertNotIn(order.id, live_deadlines)
        self.assertNotIn(order.id, {row["order_id"] for row in after["balances"]["rows"]})

    def test_timezone_day_bounds_use_company_timezone_and_explicit_utc_fallback(self):
        self.env.company.partner_id.tz = "Asia/Dubai"
        report_date, start, end = self.service._fu_day_bounds(date(2026, 1, 5))
        self.assertEqual(report_date, date(2026, 1, 5))
        self.assertEqual(start, datetime(2026, 1, 4, 20, 0, 0))
        self.assertEqual(end, datetime(2026, 1, 5, 20, 0, 0))
        self.assertEqual(self.service._fu_timezone()[0], "Asia/Dubai")

        self.env.company.partner_id.tz = False
        self.assertEqual(self.service._fu_timezone()[0], "UTC")

    def test_timezone_boundaries_classify_pos_sale_and_payment_independently(self):
        self.env.company.partner_id.tz = "Asia/Dubai"
        outside_sale = self._cash_sale()
        inside_sale = self._cash_sale()
        outside_sale.write({"date_order": datetime(2026, 1, 4, 19, 59, 59)})
        inside_sale.write({"date_order": datetime(2026, 1, 4, 20, 0, 0)})
        outside_payment = outside_sale.payment_ids.filtered(
            lambda payment: not payment.is_change
        ).ensure_one()
        inside_payment = inside_sale.payment_ids.filtered(
            lambda payment: not payment.is_change
        ).ensure_one()
        outside_payment.write({"payment_date": datetime(2026, 1, 4, 20, 0, 0)})
        inside_payment.write({"payment_date": datetime(2026, 1, 4, 19, 59, 59)})

        snapshot = self.service.fu_get_snapshot(date(2026, 1, 5), self.store.id)
        expected_sale = self.service._fu_company_amount(
            inside_sale.amount_total,
            inside_sale.currency_id,
            inside_sale.date_order,
        )
        expected_payment = self.service._fu_company_amount(
            outside_payment.amount,
            outside_payment.currency_id,
            outside_payment.payment_date,
        )
        self.assertEqual(snapshot["sales"]["count"], 1)
        self.assertAlmostEqual(snapshot["sales"]["gross"], expected_sale)
        self.assertEqual(snapshot["payments"]["cash"]["count"], 1)
        self.assertAlmostEqual(snapshot["payments"]["cash"]["net"], expected_payment)

    def test_reporting_roles_company_boundary_and_pagination_are_server_enforced(self):
        roleless = self.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": "Phase 4B roleless",
                "login": "phase4b-roleless@example.invalid",
                "email": "phase4b-roleless@example.invalid",
                "group_ids": [Command.set([self.env.ref("base.group_user").id])],
            }
        )
        for user in (
            self.cashier,
            self.inventory,
            self.production,
            self.sales,
            roleless,
            self.env.ref("base.public_user"),
        ):
            with self.subTest(user=user.login):
                with self.assertRaises(AccessError):
                    self.env["fu.reporting.service"].with_user(user).fu_get_snapshot()
        with self.assertRaises(ValidationError):
            self.service.fu_get_snapshot(limit=101)
        with self.assertRaises(ValidationError):
            self.service.fu_get_snapshot(offset=-1)
