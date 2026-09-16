from datetime import timedelta

from odoo import Command, fields
from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install", "phase5_uat")
class TestFaresPhase5Uat(CommonPosTest):
    """Cross-phase release journeys over production models and services only."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.env["stock.location"].with_context(
            allowed_company_ids=[cls.env.company.id]
        )._fu_configure_initial_locations()

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
            raise AssertionError("Phase 5 requires initialized Retail Store and Storage locations")

        size = cls.env["product.attribute"].create(
            {"name": "Phase 5 Synthetic Size", "create_variant": "always"}
        )
        size_values = cls.env["product.attribute.value"].create(
            [
                {"name": "S", "attribute_id": size.id},
                {"name": "M", "attribute_id": size.id},
            ]
        )
        cls.template = cls.env["product.template"].create(
            {
                "name": "Phase 5 Synthetic School Polo",
                "is_storable": True,
                "list_price": 120.0,
                "taxes_id": [Command.clear()],
                "attribute_line_ids": [
                    Command.create(
                        {
                            "attribute_id": size.id,
                            "value_ids": [Command.set(size_values.ids)],
                        }
                    )
                ],
            }
        )
        cls.products = cls.template.product_variant_ids.sorted("id")
        if len(cls.products) != 2:
            raise AssertionError("Phase 5 S/M onboarding fixture must create two variants")

        cls.retail_customer = cls.env["res.partner"].create(
            {"name": "Phase 5 Synthetic Retail Customer"}
        )
        cls.business_customer = cls.env["res.partner"].create(
            {
                "name": "Phase 5 Synthetic Academy",
                "company_type": "company",
                "email": "uat-buyer@example.invalid",
            }
        )

        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 5 Cash",
                "type": "cash",
                "code": "P5C",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.instapay_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 5 InstaPay",
                "type": "bank",
                "code": "P5I",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "bank_notification",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        cls.instapay_method = cls.instapay_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method or not cls.instapay_method:
            raise AssertionError("Phase 5 synthetic journals require native inbound payment methods")

        cls.manager = cls._make_user(
            "manager", cls.env.ref("fu_core.group_fu_store_manager"), [cls.store]
        )
        cls.cashier = cls._make_user(
            "cashier", cls.env.ref("fu_core.group_fu_cashier"), [cls.store]
        )
        cls.inventory = cls._make_user(
            "inventory", cls.env.ref("fu_core.group_fu_inventory_staff"), [cls.store, cls.storage]
        )
        cls.production = cls._make_user(
            "production", cls.env.ref("fu_core.group_fu_production_manager"), []
        )
        cls.sales = cls._make_user(
            "sales", cls.env.ref("fu_core.group_fu_sales_bd"), []
        )
        cls.reporting = cls.env["fu.reporting.service"]

    @classmethod
    def _make_user(cls, suffix, group, locations):
        values = {
            "name": f"Phase 5 {suffix}",
            "login": f"phase5-{suffix}@example.invalid",
            "email": f"phase5-{suffix}@example.invalid",
            "group_ids": [Command.set([group.id])],
        }
        if locations:
            values["fu_stock_location_ids"] = [
                Command.set([location.id for location in locations])
            ]
        return cls.env["res.users"].with_context(no_reset_password=True).create(values)

    def _quantity(self, product, location):
        return self.env["stock.quant"].sudo()._get_available_quantity(
            product, location, strict=True
        )

    def _movement(self, key, movement_type, product, quantity, **values):
        return self.env["fu.stock.movement.request"].process_idempotent(
            key,
            movement_type,
            product_id=product.id,
            quantity=quantity,
            reason="Phase 5 synthetic UAT movement",
            batch_ref="P5-UAT",
            **values,
        )

    def _create_preorder(self, quantities, pickup_days=30):
        order_id = self.env["sale.order"].with_user(self.cashier).fu_create_preorder(
            self.retail_customer.id,
            fields.Datetime.now() + timedelta(days=pickup_days),
            [
                {"product_id": product.id, "quantity": quantity}
                for product, quantity in quantities
            ],
            self.store.id,
        )
        return self.env["sale.order"].sudo().browse(order_id)

    def _pay_preorder(self, order, amount, key, instapay=False):
        journal = self.instapay_journal if instapay else self.cash_journal
        method = self.instapay_method if instapay else self.cash_method
        payment_id = order.with_user(self.cashier).fu_record_payment(
            amount,
            journal.id,
            method.id,
            key,
            manual_confirmed=instapay,
        )
        return self.env["account.payment"].sudo().browse(payment_id)

    def _cash_sale(self, product, quantity=1):
        order, _refund = self.create_backend_pos_order(
            {
                "line_data": [{"product_id": product.id, "qty": quantity}],
                "payment_data": [
                    {
                        "payment_method_id": self.cash_payment_method.id,
                        "amount": product.lst_price * quantity,
                    }
                ],
            }
        )
        self.assertIn(order.state, ("paid", "done"))
        return order

    def _refund(self, order):
        source_line = order.lines.filtered(lambda line: line.qty > 0)[:1]
        request = self.env["fu.retail.return.request"].with_user(self.cashier).create(
            {
                "source_order_id": order.id,
                "operation": "refund",
                "eligibility_path": "no_reason",
                "reason": "Phase 5 integrated UAT refund",
                "physical_received": True,
                "line_ids": [
                    Command.create(
                        {"source_line_id": source_line.id, "quantity": 1}
                    )
                ],
            }
        )
        request.with_user(self.cashier).action_submit()
        request.with_user(self.manager).action_approve()
        refund = request.with_user(self.manager).action_execute()
        refund.ensure_one()
        return refund

    def _business_order(self, quantity=2, unit_price=180.0, deposit=100.0):
        lead = self.env["crm.lead"].with_user(self.sales).create(
            {
                "name": "Phase 5 Synthetic Business Enquiry",
                "fu_business_client": True,
                "partner_id": self.business_customer.id,
                "partner_name": self.business_customer.name,
                "contact_name": "Synthetic Procurement",
                "email_from": "uat-buyer@example.invalid",
                "fu_design_requirements": "Synthetic approved uniform sample",
            }
        )
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        order_id = lead.action_fu_create_business_quotation()["res_id"]
        order = self.env["sale.order"].browse(order_id)
        editor = self.env["fu.business.quotation.wizard"].with_user(self.sales).create(
            {
                "quotation_id": order.id,
                "client_order_ref": f"P5-UAT-{order.id}",
                "commitment_date": fields.Datetime.now() + timedelta(days=21),
                "line_ids": [
                    Command.create(
                        {
                            "product_id": self.products[0].id,
                            "quantity": quantity,
                            "unit_price": unit_price,
                        }
                    )
                ],
            }
        )
        editor.action_save_draft()
        order = order.sudo()
        payment_id = order.with_user(self.cashier).fu_record_business_payment(
            deposit,
            self.cash_journal.id,
            self.cash_method.id,
            f"p5-business-deposit-{order.id}",
        )
        self.env["account.payment"].sudo().browse(payment_id).ensure_one()
        order.with_user(self.sales).action_fu_confirm_business_order()
        order.invalidate_recordset()
        return lead, order

    def _pay_business_balance(self, order):
        payment_id = order.with_user(self.cashier).fu_record_business_payment(
            order._fu_live_business_balance_due(),
            self.cash_journal.id,
            self.cash_method.id,
            f"p5-business-balance-{order.id}",
        )
        return self.env["account.payment"].sudo().browse(payment_id)

    def test_onboarding_product_stock_and_role_scope_journey(self):
        self.assertEqual({self.store.fu_location_role, self.storage.fu_location_role}, {"store", "storage"})
        self.assertEqual(len(set(self.products.mapped("default_code"))), 2)
        for product in self.products:
            self.assertRegex(product.default_code, r"^FU-\d{6}$")
            self.assertEqual(product.barcode, product.default_code)

        opening = self._movement(
            "P5-OPEN-STORAGE-S",
            "opening",
            self.products[0],
            6,
            destination_location_id=self.storage.id,
        )
        self.assertEqual(opening.state, "done")
        transfer = self._movement(
            "P5-XFER-S-STORE",
            "internal",
            self.products[0],
            2,
            source_location_id=self.storage.id,
            destination_location_id=self.store.id,
        )
        self.assertEqual(transfer.picking_id.state, "done")
        self.assertAlmostEqual(self._quantity(self.products[0], self.storage), 4)
        self.assertAlmostEqual(self._quantity(self.products[0], self.store), 2)
        replay = self._movement(
            "P5-XFER-S-STORE",
            "internal",
            self.products[0],
            2,
            source_location_id=self.storage.id,
            destination_location_id=self.store.id,
        )
        self.assertEqual(replay, transfer)
        self.assertAlmostEqual(self._quantity(self.products[0], self.storage), 4)
        self.assertAlmostEqual(self._quantity(self.products[0], self.store), 2)

        with self.assertRaises(AccessError):
            self.env["fu.stock.movement.request"].with_user(self.cashier).process_idempotent(
                "P5-CASHIER-BYPASS",
                "opening",
                product_id=self.products[1].id,
                quantity=1,
                destination_location_id=self.store.id,
                reason="Unauthorized UAT bypass",
            )

        manager_service = self.env["fu.reporting.service"].with_user(self.manager)
        self.assertEqual(
            manager_service.fu_get_snapshot(location_id=self.store.id)["meta"]["role"],
            "manager",
        )
        with self.assertRaisesRegex(AccessError, "outside your authorized scope"):
            manager_service.fu_get_snapshot(location_id=self.storage.id)

    def test_preorder_production_receipt_collection_and_reporting_journey(self):
        config = self.env["fu.production.config"]._fu_get_or_create(self.env.company)
        config.with_user(self.production).write(
            {"quantity_threshold": 1.0, "lead_time_days": 7}
        )
        order = self._create_preorder(
            [(self.products[0], 2), (self.products[1], 1)], pickup_days=30
        )
        tasks = self.env["fu.production.task"].sudo().search(
            [("line_ids.preorder_id", "=", order.id)], order="id"
        )
        self.assertEqual(len(tasks), 2)
        self.assertEqual(set(tasks.product_id.ids), set(self.products.ids))
        before_finish = {
            product.id: self._quantity(product, self.store) for product in self.products
        }
        for task in tasks:
            task.with_user(self.production).action_start()
            task.with_user(self.production).action_finish()
            self.assertEqual(task.state, "finished")
        for product in self.products:
            self.assertAlmostEqual(self._quantity(product, self.store), before_finish[product.id])

        self._movement(
            "P5-RECEIPT-S",
            "receipt",
            self.products[0],
            2,
            destination_location_id=self.store.id,
        )
        self._movement(
            "P5-RECEIPT-M",
            "receipt",
            self.products[1],
            1,
            destination_location_id=self.store.id,
        )
        lines = order.order_line.filtered(lambda line: not line.display_type)
        order.with_user(self.inventory).fu_allocate_ready(
            [
                {"line_id": line.id, "quantity": line.product_uom_qty}
                for line in lines
            ]
        )
        order.invalidate_recordset()
        self.assertEqual(order.fu_collection_state, "ready")

        self._pay_preorder(order, order.amount_total / 2, "p5-preorder-deposit")
        first_line = lines.filtered(lambda line: line.product_id == self.products[0]).ensure_one()
        with self.assertRaisesRegex(ValidationError, "entire remaining preorder balance"):
            order.with_user(self.cashier).fu_collect(
                [{"line_id": first_line.id, "quantity": 1}],
                "p5-preorder-collect-blocked",
            )

        self._pay_preorder(order, order.fu_balance_due, "p5-preorder-balance")
        first_collection = order.with_user(self.cashier).fu_collect(
            [{"line_id": first_line.id, "quantity": 1}],
            "p5-preorder-collect-1",
        )
        self.assertTrue(first_collection)
        order.invalidate_recordset()
        self.assertEqual(order.fu_collection_state, "partially_collected")
        partial_report = self.reporting.fu_get_snapshot(location_id=self.store.id)
        self.assertNotIn(order.id, {row["order_id"] for row in partial_report["balances"]["rows"]})
        self.assertIn(order.id, {row["order_id"] for row in partial_report["upcoming"]["rows"]})

        remaining_payload = []
        for line in lines:
            line.invalidate_recordset(["fu_remaining_qty", "fu_ready_qty", "fu_collected_qty"])
            if line.fu_remaining_qty:
                remaining_payload.append(
                    {"line_id": line.id, "quantity": line.fu_remaining_qty}
                )
        order.with_user(self.cashier).fu_collect(
            remaining_payload,
            "p5-preorder-collect-rest",
        )
        order.invalidate_recordset()
        self.assertEqual(order.fu_collection_state, "collected")
        final_report = self.reporting.fu_get_snapshot(location_id=self.store.id)
        live_ids = {
            row["order_id"]
            for bucket in ("upcoming", "overdue")
            for row in final_report[bucket]["rows"]
        }
        self.assertNotIn(order.id, live_ids)
        self.assertNotIn(order.id, {row["order_id"] for row in final_report["balances"]["rows"]})

    def test_retail_sale_refund_and_reporting_journey(self):
        self._movement(
            "P5-RETAIL-STOCK",
            "opening",
            self.products[0],
            3,
            destination_location_id=self.store.id,
        )
        report_date = self.reporting._fu_default_report_date()
        before = self.reporting.fu_get_snapshot(report_date, self.store.id)
        order = self._cash_sale(self.products[0])
        after_sale = self.reporting.fu_get_snapshot(report_date, self.store.id)
        self.assertGreater(after_sale["sales"]["gross"], before["sales"]["gross"])
        self.assertGreater(after_sale["payments"]["cash"]["net"], before["payments"]["cash"]["net"])

        refund = self._refund(order)
        self.assertTrue(refund.is_refund)
        self.assertEqual(refund.refunded_order_id, order)
        self.assertIn(order.state, ("paid", "done"))
        after_refund = self.reporting.fu_get_snapshot(report_date, self.store.id)
        self.assertGreater(after_refund["sales"]["refunds"], after_sale["sales"]["refunds"])
        self.assertLess(after_refund["sales"]["net"], after_sale["sales"]["net"])
        self.assertIn("offline POS", after_refund["meta"]["sync_notice"])

    def test_business_public_and_reporting_boundaries_journey(self):
        _lead, order = self._business_order()
        before_ship = self.reporting.fu_get_snapshot()
        self.assertIn(order.id, {row["order_id"] for row in before_ship["upcoming"]["rows"]})
        self.assertIn(order.id, {row["order_id"] for row in before_ship["balances"]["rows"]})
        manager_report = self.env["fu.reporting.service"].with_user(self.manager).fu_get_snapshot()
        self.assertNotIn(order.id, {row["order_id"] for row in manager_report["balances"]["rows"]})

        self._movement(
            "P5-BUSINESS-STOCK",
            "opening",
            self.products[0],
            2,
            destination_location_id=self.store.id,
        )
        self._pay_business_balance(order)
        picking = order.picking_ids.filtered(
            lambda item: item.location_dest_id.usage == "customer"
        ).ensure_one()
        picking.with_user(self.inventory).fu_release_business_delivery()
        picking.invalidate_recordset()
        self.assertEqual(picking.state, "done")
        after_ship = self.reporting.fu_get_snapshot()
        active_ids = {
            row["order_id"]
            for bucket in ("upcoming", "overdue", "balances")
            for row in after_ship[bucket]["rows"]
        }
        self.assertNotIn(order.id, active_ids)

        self.template.write(
            {
                "fu_public_slug": "phase-5-school-polo",
                "fu_public_name_en": "Synthetic School Polo Program",
                "fu_public_name_ar": "برنامج قميص مدرسي تجريبي",
                "fu_public_summary_en": "Synthetic public UAT catalog entry.",
                "fu_public_summary_ar": "عنصر تجريبي عام لاختبار القبول.",
                "fu_public_sector": "Schools",
                "fu_public_published": True,
            }
        )
        public_en = self.template._fu_public_payload("en")
        public_ar = self.template._fu_public_payload("ar")
        self.assertEqual(set(public_en), {"slug", "name", "summary", "sector", "image_url"})
        self.assertEqual(public_ar["name"], "برنامج قميص مدرسي تجريبي")
        serialized_values = " ".join(str(value) for value in public_en.values())
        self.assertNotIn(self.products[0].default_code, serialized_values)

        enquiry_payload = {
            "idempotency_key": "phase5-uat-enquiry-001",
            "contact_name": "Synthetic Buyer",
            "organization_name": "Synthetic Academy",
            "email": "phase5-enquiry@example.invalid",
            "phone": "",
            "sector": "Schools",
            "message": "Synthetic Phase 5 public enquiry.",
            "language": "en",
            "source_product_slug": "phase-5-school-polo",
        }
        service = self.env["fu.public.enquiry"].sudo()
        enquiry, created = service.fu_create_from_public(enquiry_payload)
        self.assertTrue(created)
        replay, replay_created = service.fu_create_from_public(enquiry_payload)
        self.assertFalse(replay_created)
        self.assertEqual(replay, enquiry)
        with self.assertRaises(AccessError):
            enquiry.with_user(self.cashier).read(["reference"])
