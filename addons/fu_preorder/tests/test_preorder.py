from datetime import timedelta

from odoo import Command, fields
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


@tagged("post_install", "-at_install")
class TestFaresPreorder(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.warehouse = cls.env["stock.warehouse"].search(
            [("company_id", "=", cls.env.company.id)], limit=1
        )
        cls.store = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )

        size = cls.env["product.attribute"].create(
            {"name": "Phase 2B Synthetic Size", "create_variant": "always"}
        )
        size_values = cls.env["product.attribute.value"].create(
            [
                {"name": "S", "attribute_id": size.id},
                {"name": "M", "attribute_id": size.id},
            ]
        )
        template = cls.env["product.template"].create(
            {
                "name": "Phase 2B Synthetic School Polo",
                "is_storable": True,
                "list_price": 100.0,
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
        cls.products = template.product_variant_ids.sorted("id")
        cls.partner = cls.env["res.partner"].create({"name": "Phase 2B Synthetic Customer"})

        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 2B Cash",
                "type": "cash",
                "code": "P2BC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.instapay_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 2B InstaPay",
                "type": "bank",
                "code": "P2BI",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "bank_notification",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        cls.instapay_method = cls.instapay_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method or not cls.instapay_method:
            raise AssertionError("Synthetic journals must expose native inbound payment methods")

        cls.cashier = cls._make_user(
            "cashier", cls.env.ref("fu_core.group_fu_cashier"), assign_store=True
        )
        cls.cashier_without_store = cls._make_user(
            "cashier-no-store", cls.env.ref("fu_core.group_fu_cashier"), assign_store=False
        )
        cls.inventory = cls._make_user(
            "inventory", cls.env.ref("fu_core.group_fu_inventory_staff"), assign_store=True
        )

    @classmethod
    def _make_user(cls, suffix, group, assign_store):
        vals = {
            "name": f"Phase 2B {suffix}",
            "login": f"phase2b-{suffix}@example.invalid",
            "email": f"phase2b-{suffix}@example.invalid",
            "group_ids": [Command.set([group.id])],
        }
        if assign_store:
            vals["fu_stock_location_ids"] = [Command.set([cls.store.id])]
        return cls.env["res.users"].with_context(no_reset_password=True).create(vals)

    def _create_preorder(self, user=None):
        user = user or self.cashier
        order_id = self.env["sale.order"].with_user(user).fu_create_preorder(
            self.partner.id,
            fields.Datetime.now() + timedelta(days=14),
            [
                {"product_id": self.products[0].id, "quantity": 1},
                {"product_id": self.products[1].id, "quantity": 1},
            ],
            self.store.id,
        )
        return self.env["sale.order"].sudo().browse(order_id)

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
        payment_id = order.with_user(user).fu_record_payment(
            amount,
            journal.id,
            method.id,
            payment_uuid,
            manual_confirmed=manual_confirmed,
        )
        return self.env["account.payment"].sudo().browse(payment_id)

    def _seed_store(self, product, quantity, key):
        return self.env["fu.stock.movement.request"].process_idempotent(
            key,
            "opening",
            product_id=product.id,
            quantity=quantity,
            destination_location_id=self.store.id,
            reason="Phase 2B synthetic opening stock",
        )

    def test_preorder_creation_uses_draft_sale_identity_without_stock_reservation(self):
        order = self._create_preorder()

        self.assertTrue(order.fu_is_preorder)
        self.assertEqual(order.state, "draft")
        self.assertEqual(order.fu_store_location_id, self.store)
        self.assertEqual(set(order.order_line.product_id.ids), set(self.products.ids))
        self.assertEqual(len(order.order_line), 2)
        self.assertTrue(order.commitment_date)
        self.assertFalse(order.picking_ids)
        self.assertFalse(order.fu_preorder_picking_ids)
        self.assertEqual(order.fu_payment_state, "balance_due")
        self.assertEqual(order.fu_collection_state, "awaiting_ready")

    def test_cash_deposit_balance_and_payment_replay_are_idempotent(self):
        order = self._create_preorder()
        deposit = order.amount_total / 2

        payment = self._pay(order, deposit, "p2b-cash-0001")
        self.assertEqual(payment.move_id.state, "posted")
        self.assertEqual(payment.fu_preorder_id, order)
        self.assertEqual(payment.fu_recorded_by_user_id, self.cashier)
        self.assertFalse(payment.fu_manual_confirmed)
        self.assertAlmostEqual(order.fu_amount_paid, deposit)
        self.assertAlmostEqual(order.fu_balance_due, order.amount_total - deposit)

        replay = self._pay(order, deposit, "p2b-cash-0001")
        self.assertEqual(replay, payment)
        self.assertEqual(
            self.env["account.payment"].search_count(
                [("fu_preorder_payment_uuid", "=", "p2b-cash-0001")]
            ),
            1,
        )
        with self.assertRaisesRegex(ValidationError, "different data"):
            self._pay(order, deposit / 2, "p2b-cash-0001")

        final_payment = self._pay(order, order.fu_balance_due, "p2b-cash-0002")
        self.assertNotEqual(final_payment, payment)
        self.assertTrue(order.currency_id.is_zero(order.fu_balance_due))
        self.assertEqual(order.fu_payment_state, "paid")

    def test_instapay_requires_positive_manual_bank_notification_confirmation(self):
        order = self._create_preorder()
        with self.assertRaisesRegex(ValidationError, "requires staff confirmation"):
            self._pay(
                order,
                order.amount_total,
                "p2b-instapay-0001",
                journal=self.instapay_journal,
                method=self.instapay_method,
            )
        self.assertFalse(order.fu_preorder_payment_ids)

        payment = self._pay(
            order,
            order.amount_total,
            "p2b-instapay-0002",
            journal=self.instapay_journal,
            method=self.instapay_method,
            manual_confirmed=True,
        )
        self.assertTrue(payment.fu_manual_confirmed)
        self.assertEqual(payment.fu_recorded_by_user_id, self.cashier)
        self.assertTrue(order.currency_id.is_zero(order.fu_balance_due))

    def test_store_scope_and_allocation_roles_are_server_enforced(self):
        with self.assertRaises(AccessError):
            self._create_preorder(user=self.cashier_without_store)

        order = self._create_preorder()
        self._seed_store(self.products[0], 1, "P2B-ROLE-STOCK-001")
        line = order.order_line.filtered(lambda item: item.product_id == self.products[0])
        with self.assertRaises(AccessError):
            order.with_user(self.cashier).fu_allocate_ready(
                [{"line_id": line.id, "quantity": 1}]
            )

    def test_d014_partial_collection_and_replay_use_exact_native_stock_effects(self):
        order = self._create_preorder()
        first_line = order.order_line.filtered(lambda line: line.product_id == self.products[0])
        second_line = order.order_line.filtered(lambda line: line.product_id == self.products[1])
        self._seed_store(self.products[0], 2, "P2B-COLLECT-STOCK-001")
        self._seed_store(self.products[1], 2, "P2B-COLLECT-STOCK-002")

        picking_id = order.with_user(self.inventory).fu_allocate_ready(
            [
                {"line_id": first_line.id, "quantity": 1},
                {"line_id": second_line.id, "quantity": 1},
            ]
        )
        picking = self.env["stock.picking"].sudo().browse(picking_id)
        self.assertEqual(picking.state, "assigned")
        self.assertAlmostEqual(first_line.fu_ready_qty, 1)
        self.assertAlmostEqual(second_line.fu_ready_qty, 1)
        self.assertEqual(order.fu_collection_state, "ready")

        self._pay(order, order.amount_total / 2, "p2b-collect-pay-0001")
        with self.assertRaisesRegex(ValidationError, "entire remaining preorder balance"):
            order.with_user(self.cashier).fu_collect(
                [{"line_id": first_line.id, "quantity": 1}],
                "p2b-collection-0001",
            )

        self._pay(order, order.fu_balance_due, "p2b-collect-pay-0002")
        first_collection_id = order.with_user(self.cashier).fu_collect(
            [{"line_id": first_line.id, "quantity": 1}],
            "p2b-collection-0001",
        )
        first_collection = self.env["stock.picking"].sudo().browse(first_collection_id)
        self.assertEqual(first_collection.state, "done")
        self.assertAlmostEqual(first_line.fu_collected_qty, 1)
        self.assertAlmostEqual(first_line.fu_remaining_qty, 0)
        self.assertAlmostEqual(second_line.fu_collected_qty, 0)
        self.assertAlmostEqual(second_line.fu_ready_qty, 1)
        self.assertEqual(order.fu_collection_state, "partially_collected")
        self.assertEqual(order.state, "draft")

        replay_id = order.with_user(self.cashier).fu_collect(
            [{"line_id": first_line.id, "quantity": 1}],
            "p2b-collection-0001",
        )
        self.assertEqual(replay_id, first_collection_id)
        self.assertEqual(
            self.env["stock.picking"].search_count(
                [("fu_collection_uuid", "=", "p2b-collection-0001")]
            ),
            1,
        )

        second_collection_id = order.with_user(self.cashier).fu_collect(
            [{"line_id": second_line.id, "quantity": 1}],
            "p2b-collection-0002",
        )
        second_collection = self.env["stock.picking"].sudo().browse(second_collection_id)
        self.assertEqual(second_collection.state, "done")
        self.assertNotEqual(second_collection, first_collection)
        self.assertAlmostEqual(second_line.fu_collected_qty, 1)
        self.assertAlmostEqual(second_line.fu_remaining_qty, 0)
        self.assertEqual(order.fu_collection_state, "collected")
        self.assertEqual(order.state, "draft")

        for line in (first_line, second_line):
            done_moves = self.env["stock.move"].search(
                [("fu_preorder_line_id", "=", line.id), ("state", "=", "done")]
            )
            moved = sum(
                move.product_uom._compute_quantity(
                    move.quantity,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                for move in done_moves
            )
            self.assertAlmostEqual(moved, 1)
