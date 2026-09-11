from datetime import timedelta

from odoo import Command, fields
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


@tagged("post_install", "-at_install")
class TestFaresBusinessWorkflow(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.warehouse = cls.env["stock.warehouse"].search(
            [("company_id", "=", cls.env.company.id)], limit=1
        )
        cls.store = cls.warehouse.lot_stock_id
        cls.partner = cls.env["res.partner"].create(
            {
                "name": "Phase 3B Synthetic Business Client",
                "company_type": "company",
                "email": "buyer@example.invalid",
            }
        )
        cls.product = cls.env["product.product"].create(
            {
                "name": "Phase 3B Candidate Uniform",
                "is_storable": True,
                "lst_price": 250.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.sales = cls._make_user("sales", cls.env.ref("fu_core.group_fu_sales_bd"))
        cls.sales_other = cls._make_user(
            "sales-other", cls.env.ref("fu_core.group_fu_sales_bd")
        )
        cls.cashier = cls._make_user(
            "cashier", cls.env.ref("fu_core.group_fu_cashier"), assign_store=True
        )
        cls.store_manager = cls._make_user(
            "manager", cls.env.ref("fu_core.group_fu_store_manager"), assign_store=True
        )
        cls.inventory = cls._make_user(
            "inventory", cls.env.ref("fu_core.group_fu_inventory_staff"), assign_store=True
        )
        cls.production = cls._make_user(
            "production", cls.env.ref("fu_core.group_fu_production_manager")
        )

        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 3B Cash",
                "type": "cash",
                "code": "P3BC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.instapay_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 3B InstaPay",
                "type": "bank",
                "code": "P3BI",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "bank_notification",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        cls.instapay_method = cls.instapay_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method or not cls.instapay_method:
            raise AssertionError("Synthetic business-payment journals need inbound payment methods")

    @classmethod
    def _make_user(cls, suffix, group, assign_store=False):
        vals = {
            "name": f"Phase 3B {suffix}",
            "login": f"phase3b-{suffix}@example.invalid",
            "email": f"phase3b-{suffix}@example.invalid",
            "group_ids": [Command.set([group.id])],
        }
        if assign_store:
            vals["fu_stock_location_ids"] = [Command.set([cls.store.id])]
        return cls.env["res.users"].with_context(no_reset_password=True).create(vals)

    def _lead(self, suffix="client"):
        return self.env["crm.lead"].with_user(self.sales).create(
            {
                "name": f"Phase 3B {suffix}",
                "fu_business_client": True,
                "partner_id": self.partner.id,
                "partner_name": self.partner.name,
                "contact_name": "Procurement Contact",
                "email_from": "buyer@example.invalid",
                "phone": "+200000000000",
                "fu_design_requirements": "Embroidered staff uniform sample",
            }
        )

    def _approved_order(self, suffix):
        lead = self._lead(suffix)
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        order_id = lead.action_fu_create_business_quotation()["res_id"]
        return lead, self.env["sale.order"].browse(order_id)

    def _set_terms(self, order, quantity=3, price=180.0, user=None, reference="CLIENT-PO-001"):
        user = user or self.sales
        commitment = fields.Datetime.now() + timedelta(days=21)
        wizard = self.env["fu.business.quotation.wizard"].with_user(user).create(
            {
                "quotation_id": order.id,
                "client_order_ref": reference,
                "commitment_date": commitment,
                "line_ids": [
                    Command.create(
                        {
                            "product_id": self.product.id,
                            "quantity": quantity,
                            "unit_price": price,
                        }
                    )
                ],
            }
        )
        wizard.action_save_draft()
        order = order.sudo()
        order.invalidate_recordset()
        return order

    def _pay(
        self,
        order,
        amount,
        payment_uuid,
        journal=None,
        method=None,
        manual_confirmed=False,
        user=None,
    ):
        journal = journal or self.cash_journal
        method = method or self.cash_method
        user = user or self.cashier
        payment_id = order.with_user(user).fu_record_business_payment(
            amount,
            journal.id,
            method.id,
            payment_uuid,
            manual_confirmed=manual_confirmed,
        )
        order.invalidate_recordset()
        return self.env["account.payment"].sudo().browse(payment_id)

    def _seed_store(self, quantity, key):
        return self.env["fu.stock.movement.request"].process_idempotent(
            key,
            "opening",
            product_id=self.product.id,
            quantity=quantity,
            destination_location_id=self.store.id,
            reason="Phase 3B synthetic business stock",
            batch_ref="P3B-SYNTHETIC-OPENING",
        )

    def test_sales_can_create_assigned_business_enquiry_without_broadening_other_roles(self):
        lead = self._lead()
        self.assertTrue(lead.fu_business_client)
        self.assertEqual(lead.user_id, self.sales)
        self.assertEqual(lead.type, "opportunity")
        self.assertEqual(lead.fu_sample_state, "not_started")
        self.assertEqual(lead.phone, "+200000000000")
        self.assertFalse(self.partner.sudo().phone)

        lead.write({"phone": "+201111111111"})
        self.assertEqual(lead.phone, "+201111111111")
        self.assertFalse(self.partner.sudo().phone)

        for user in (self.cashier, self.inventory, self.production):
            with self.assertRaises(AccessError):
                self.env["crm.lead"].with_user(user).create(
                    {"name": "Unauthorized Phase 3B enquiry", "fu_business_client": True}
                )

    def test_sales_scope_and_sample_audit_fields_are_server_controlled(self):
        lead = self._lead("scope")
        lead.write({"fu_design_requirements": "Updated approved design brief"})
        self.assertEqual(lead.fu_design_requirements, "Updated approved design brief")
        with self.assertRaises(AccessError):
            lead.write({"fu_sample_state": "approved"})
        with self.assertRaises(AccessError):
            lead.with_context(fu_business_transition=True).write({"fu_sample_state": "approved"})
        with self.assertRaises(AccessError):
            lead.write({"user_id": self.sales_other.id})
        with self.assertRaises(AccessError):
            lead.with_user(self.sales_other).write({"fu_design_requirements": "Scope bypass attempt"})

    def test_sample_workflow_is_explicit_attributable_and_revision_safe(self):
        lead = self._lead("sample")
        with self.assertRaises(ValidationError):
            lead.action_fu_approve_sample()
        lead.action_fu_prepare_sample()
        lead.write({"fu_sample_reference": "P3B-SAMPLE-001"})
        lead.action_fu_mark_sample_sent()
        self.assertEqual(lead.fu_sample_sent_by_id, self.sales)
        self.assertTrue(lead.fu_sample_sent_at)
        lead.action_fu_request_revision()
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        self.assertEqual(lead.fu_sample_state, "approved")
        self.assertEqual(lead.fu_sample_decided_by_id, self.sales)
        self.assertTrue(lead.fu_sample_decided_at)
        with self.assertRaises(ValidationError):
            lead.action_fu_prepare_sample()
        with self.assertRaises(AccessError):
            lead.sudo().write({"fu_sample_decided_by_id": self.sales_other.id})

    def test_business_order_requires_approval_and_creation_is_retry_safe(self):
        lead = self._lead("quotation")
        with self.assertRaises(ValidationError):
            lead.action_fu_create_business_quotation()
        lead.action_fu_prepare_sample()
        lead.action_fu_mark_sample_sent()
        lead.action_fu_approve_sample()
        picking_count = self.env["stock.picking"].sudo().search_count([])
        payment_count = self.env["account.payment"].sudo().search_count([])
        action = lead.action_fu_create_business_quotation()
        order = self.env["sale.order"].sudo().browse(action["res_id"])
        self.assertTrue(order.fu_business_order)
        self.assertEqual(order.opportunity_id, lead.sudo())
        self.assertEqual(order.partner_id, self.partner)
        self.assertEqual(order.state, "draft")
        second = lead.action_fu_create_business_quotation()
        self.assertEqual(second["res_id"], order.id)
        self.assertEqual(
            self.env["sale.order"].sudo().search_count(
                [("opportunity_id", "=", lead.id), ("fu_business_order", "=", True)]
            ),
            1,
        )
        self.assertEqual(self.env["stock.picking"].sudo().search_count([]), picking_count)
        self.assertEqual(self.env["account.payment"].sudo().search_count([]), payment_count)

    def test_assigned_sales_can_edit_candidate_draft_before_payment(self):
        _lead, order = self._approved_order("draft-editor")
        picking_count = self.env["stock.picking"].sudo().search_count([])
        payment_count = self.env["account.payment"].sudo().search_count([])
        action = order.with_user(self.sales).action_fu_open_draft_editor()
        self.assertEqual(action["res_model"], "fu.business.quotation.wizard")
        order = self._set_terms(order, quantity=3)
        self.assertEqual(order.client_order_ref, "CLIENT-PO-001")
        self.assertEqual(len(order.order_line), 1)
        self.assertEqual(order.order_line.product_uom_qty, 3)
        self.assertEqual(order.order_line.price_unit, 180.0)
        order = self._set_terms(order, quantity=4)
        self.assertEqual(len(order.order_line), 1)
        self.assertEqual(order.order_line.product_uom_qty, 4)
        self.assertEqual(self.env["stock.picking"].sudo().search_count([]), picking_count)
        self.assertEqual(self.env["account.payment"].sudo().search_count([]), payment_count)
        with self.assertRaisesRegex(ValidationError, "positive negotiated deposit"):
            order.with_user(self.sales).action_fu_confirm_business_order()

    def test_draft_editor_scope_and_values_fail_closed(self):
        _lead, order = self._approved_order("draft-editor-guard")
        with self.assertRaises(AccessError):
            order.with_user(self.sales_other).action_fu_open_draft_editor()
        with self.assertRaises(AccessError):
            self.env["fu.business.quotation.wizard"].with_user(self.cashier).create({"quotation_id": order.id})
        zero_qty = self.env["fu.business.quotation.wizard"].with_user(self.sales).create(
            {"quotation_id": order.id, "line_ids": [Command.create({"product_id": self.product.id, "quantity": 0, "unit_price": 100.0})]}
        )
        with self.assertRaisesRegex(ValidationError, "quantity must be greater than zero"):
            zero_qty.action_save_draft()
        negative_price = self.env["fu.business.quotation.wizard"].with_user(self.sales).create(
            {"quotation_id": order.id, "line_ids": [Command.create({"product_id": self.product.id, "quantity": 1, "unit_price": -1.0})]}
        )
        with self.assertRaisesRegex(ValidationError, "cannot be negative"):
            negative_price.action_save_draft()

    def test_internal_context_flags_and_payment_relink_cannot_be_spoofed(self):
        lead, order = self._approved_order("context-spoof")
        order = self._set_terms(order)
        with self.assertRaises(AccessError):
            self.env["sale.order"].with_user(self.sales).with_context(fu_business_internal=True).create(
                {"partner_id": self.partner.id, "opportunity_id": lead.id}
            )
        with self.assertRaises(ValidationError):
            order.with_user(self.sales).with_context(fu_business_commercial_execution=True).write({"state": "sale"})
        with self.assertRaises(AccessError):
            self.env["account.payment"].with_user(self.cashier).with_context(
                fu_business_payment_execution=True
            ).create(
                {
                    "payment_type": "inbound",
                    "partner_type": "customer",
                    "partner_id": self.partner.id,
                    "amount": 10,
                    "journal_id": self.cash_journal.id,
                    "payment_method_line_id": self.cash_method.id,
                    "fu_business_order_id": order.id,
                }
            )
        ordinary_payment = self.env["account.payment"].sudo().create(
            {
                "payment_type": "inbound",
                "partner_type": "customer",
                "partner_id": self.partner.id,
                "amount": 10,
                "journal_id": self.cash_journal.id,
                "payment_method_line_id": self.cash_method.id,
            }
        )
        with self.assertRaisesRegex(AccessError, "controlled Fares payment workflow"):
            ordinary_payment.with_user(self.cashier).write({"fu_business_order_id": order.id})

    def test_negotiated_deposit_is_positive_retry_safe_and_capped_at_total(self):
        _lead, order = self._approved_order("deposit")
        order = self._set_terms(order, quantity=4, price=200.0)
        deposit = 125.0
        payment = self._pay(order, deposit, "p3b-cash-0001")
        self.assertEqual(payment.move_id.state, "posted")
        self.assertEqual(payment.fu_business_order_id, order)
        self.assertEqual(payment.fu_business_recorded_by_user_id, self.cashier)
        self.assertAlmostEqual(order.fu_business_amount_paid, deposit)
        self.assertAlmostEqual(order.fu_business_balance_due, order.amount_total - deposit)
        self.assertEqual(order.fu_business_payment_state, "deposit")
        replay = self._pay(order, deposit, "p3b-cash-0001")
        self.assertEqual(replay, payment)
        self.assertEqual(
            self.env["account.payment"].sudo().search_count([("fu_business_payment_uuid", "=", "p3b-cash-0001")]),
            1,
        )
        with self.assertRaisesRegex(ValidationError, "different data"):
            self._pay(order, deposit + 1, "p3b-cash-0001")
        with self.assertRaisesRegex(ValidationError, "cannot exceed"):
            self._pay(order, order.fu_business_balance_due + 1, "p3b-cash-overpay")
        with self.assertRaisesRegex(ValidationError, "must be positive"):
            self._pay(order, 0, "p3b-cash-zero")

    def test_instapay_requires_positive_bank_notification_confirmation(self):
        _lead, order = self._approved_order("instapay")
        order = self._set_terms(order)
        with self.assertRaisesRegex(ValidationError, "requires staff confirmation"):
            self._pay(order, 100, "p3b-instapay-0001", journal=self.instapay_journal, method=self.instapay_method)
        payment = self._pay(
            order,
            100,
            "p3b-instapay-0002",
            journal=self.instapay_journal,
            method=self.instapay_method,
            manual_confirmed=True,
        )
        self.assertTrue(payment.fu_manual_confirmed)
        self.assertEqual(payment.fu_business_recorded_by_user_id, self.cashier)

    def test_deposit_enables_confirmation_but_not_shipment(self):
        _lead, order = self._approved_order("confirm")
        order = self._set_terms(order, quantity=2, price=250.0)
        with self.assertRaisesRegex(ValidationError, "positive negotiated deposit"):
            order.with_user(self.sales).action_fu_confirm_business_order()
        self._pay(order, 100, "p3b-confirm-deposit")
        order.with_user(self.sales).action_fu_confirm_business_order()
        order.invalidate_recordset()
        self.assertEqual(order.state, "sale")
        self.assertEqual(order.fu_business_confirmed_by_id, self.sales)
        self.assertTrue(order.fu_business_confirmed_at)
        picking = order.picking_ids.filtered(lambda item: item.location_dest_id.usage == "customer")[:1]
        self.assertTrue(picking)
        with self.assertRaisesRegex(ValidationError, "entire remaining business-order balance"):
            picking.with_user(self.inventory).fu_release_business_delivery()

    def test_post_payment_sales_edits_owner_approval_and_paid_floor(self):
        _lead, order = self._approved_order("post-payment-edit")
        order = self._set_terms(order, quantity=3)
        self._pay(order, 100, "p3b-edit-deposit")
        with self.assertRaisesRegex(AccessError, "Owner/Admin approval"):
            order.with_user(self.sales).action_fu_open_draft_editor()
        with self.assertRaisesRegex(AccessError, "controlled Fares workflow"):
            order.write({"client_order_ref": "DIRECT-BYPASS"})
        order = self._set_terms(
            order,
            quantity=4,
            price=175.0,
            user=self.env.user,
            reference="OWNER-APPROVED-CHANGE",
        )
        self.assertEqual(order.client_order_ref, "OWNER-APPROVED-CHANGE")
        self.assertEqual(order.order_line.product_uom_qty, 4)
        self.assertEqual(order.fu_business_change_approved_by_id, self.env.user)
        self.assertTrue(order.fu_business_change_approved_at)

        with self.assertRaisesRegex(ValidationError, "cannot reduce the order total below") , self.env.cr.savepoint():
            self._set_terms(
                order,
                quantity=1,
                price=50.0,
                user=self.env.user,
                reference="OWNER-INVALID-LOWER-TOTAL",
            )
        order.invalidate_recordset()
        self.assertEqual(order.client_order_ref, "OWNER-APPROVED-CHANGE")

    def test_paid_order_cancellation_and_payment_rewrite_are_fail_closed(self):
        _lead, unpaid = self._approved_order("unpaid-cancel")
        unpaid = self._set_terms(unpaid)
        unpaid.with_user(self.sales).action_fu_cancel_business_draft()
        unpaid.invalidate_recordset()
        self.assertEqual(unpaid.state, "cancel")

        _lead, order = self._approved_order("paid-cancel")
        order = self._set_terms(order)
        payment = self._pay(order, 100, "p3b-cancel-deposit")
        with self.assertRaisesRegex(ValidationError, "recorded money cannot be cancelled"):
            order.with_user(self.sales).action_fu_cancel_business_draft()
        with self.assertRaisesRegex(ValidationError, "cannot be cancelled"):
            payment.action_cancel()
        with self.assertRaisesRegex(ValidationError, "cannot be rewritten"):
            payment.write({"amount": 99})

    def test_full_balance_and_full_stock_are_required_for_complete_shipment(self):
        _lead, order = self._approved_order("shipment")
        order = self._set_terms(order, quantity=3, price=100.0)
        self._pay(order, 50, "p3b-ship-deposit")
        order.with_user(self.sales).action_fu_confirm_business_order()
        order.invalidate_recordset()
        picking = order.picking_ids.filtered(lambda item: item.location_dest_id.usage == "customer")[:1]
        self._seed_store(1, "P3B-SHIP-STOCK-PARTIAL")
        self._pay(order, order.fu_business_balance_due, "p3b-ship-balance")
        self.assertTrue(order.currency_id.is_zero(order.fu_business_balance_due))
        with self.assertRaisesRegex(ValidationError, "physically available"), self.env.cr.savepoint():
            picking.with_user(self.inventory).fu_release_business_delivery()
        picking.invalidate_recordset()
        picking.move_ids.invalidate_recordset()
        self._seed_store(3, "P3B-SHIP-STOCK-REST")
        picking.with_user(self.inventory).fu_release_business_delivery()
        picking.invalidate_recordset()
        self.assertEqual(picking.state, "done")
        self.assertEqual(picking.fu_business_released_by_id, self.inventory)
        self.assertTrue(picking.fu_business_released_at)

    def test_sales_cannot_release_or_native_validate_business_shipment(self):
        _lead, order = self._approved_order("shipment-role")
        order = self._set_terms(order, quantity=1, price=100.0)
        self._pay(order, order.amount_total, "p3b-ship-role-full")
        order.with_user(self.sales).action_fu_confirm_business_order()
        order.invalidate_recordset()
        picking = order.picking_ids.filtered(lambda item: item.location_dest_id.usage == "customer")[:1]
        self._seed_store(1, "P3B-SHIP-ROLE-STOCK")
        with self.assertRaises(AccessError):
            picking.with_user(self.sales).fu_release_business_delivery()
        with self.assertRaisesRegex(ValidationError, "controlled complete-shipment"):
            picking.sudo().button_validate()

    def test_ordinary_order_confirmation_is_not_globally_blocked(self):
        order = self.env["sale.order"].sudo().create({"partner_id": self.partner.id})
        self.assertFalse(order.fu_business_order)
        order.action_confirm()
        self.assertEqual(order.state, "sale")

    def test_business_order_visibility_follows_role_scope(self):
        lead, order = self._approved_order("visibility")
        self.assertEqual(order.with_user(self.sales).name, order.sudo().name)
        with self.assertRaises(AccessError):
            order.with_user(self.sales_other).read(["name"])
        self.assertEqual(order.with_user(self.cashier).name, order.sudo().name)
        self.assertEqual(order.with_user(self.inventory).name, order.sudo().name)
        ordinary = self.env["sale.order"].sudo().create({"partner_id": self.partner.id})
        with self.assertRaises(AccessError):
            ordinary.with_user(self.cashier).read(["name"])
        self.assertEqual(lead.user_id, self.sales)
