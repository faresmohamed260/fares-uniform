from datetime import timedelta

from odoo import Command, fields
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


@tagged("post_install", "-at_install")
class TestFaresProduction(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.store = cls.env["stock.location"].search(
            [
                ("company_id", "=", cls.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )
        if not cls.store:
            raise AssertionError("Phase 3A requires the Fares Retail Store fixture")

        size = cls.env["product.attribute"].create(
            {"name": "Phase 3A Synthetic Size", "create_variant": "always"}
        )
        size_values = cls.env["product.attribute.value"].create(
            [
                {"name": "S", "attribute_id": size.id},
                {"name": "M", "attribute_id": size.id},
            ]
        )
        template = cls.env["product.template"].create(
            {
                "name": "Phase 3A Synthetic School Polo",
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
        if len(cls.products) != 2:
            raise AssertionError("The Phase 3A S/M fixture must create two variants")
        cls.partner = cls.env["res.partner"].create({"name": "Phase 3A Synthetic Customer"})

        cls.cashier = cls._make_user(
            "cashier",
            cls.env.ref("fu_core.group_fu_cashier"),
            assign_store=True,
        )
        cls.inventory = cls._make_user(
            "inventory",
            cls.env.ref("fu_core.group_fu_inventory_staff"),
            assign_store=True,
        )
        cls.production_manager = cls._make_user(
            "production-manager",
            cls.env.ref("fu_core.group_fu_production_manager"),
            assign_store=False,
        )

        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 3A Cash",
                "type": "cash",
                "code": "P3AC",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method:
            raise AssertionError("The Phase 3A Cash journal requires a native inbound payment method")

    @classmethod
    def _make_user(cls, suffix, group, assign_store):
        vals = {
            "name": f"Phase 3A {suffix}",
            "login": f"phase3a-{suffix}@example.invalid",
            "email": f"phase3a-{suffix}@example.invalid",
            "group_ids": [Command.set([group.id])],
        }
        if assign_store:
            vals["fu_stock_location_ids"] = [Command.set([cls.store.id])]
        return cls.env["res.users"].with_context(no_reset_password=True).create(vals)

    def _config(self):
        return self.env["fu.production.config"]._fu_get_or_create(self.env.company).with_user(
            self.env.user
        )

    def _create_preorder(self, quantities, pickup_days=30):
        lines = [
            {"product_id": product.id, "quantity": quantity}
            for product, quantity in quantities
        ]
        order_id = self.env["sale.order"].with_user(self.cashier).fu_create_preorder(
            self.partner.id,
            fields.Datetime.now() + timedelta(days=pickup_days),
            lines,
            self.store.id,
        )
        return self.env["sale.order"].sudo().browse(order_id)

    def _tasks(self, order=None):
        domain = []
        if order:
            domain = [("line_ids.preorder_id", "=", order.id)]
        return self.env["fu.production.task"].sudo().search(domain, order="id")

    def _seed_store(self, product, quantity, key):
        return self.env["fu.stock.movement.request"].process_idempotent(
            key,
            "opening",
            product_id=product.id,
            quantity=quantity,
            destination_location_id=self.store.id,
            reason="Phase 3A synthetic opening stock",
            batch_ref="P3A-SYNTHETIC-OPENING",
        )

    def _pay_full(self, order, key):
        return order.with_user(self.cashier).fu_record_payment(
            order.fu_balance_due,
            self.cash_journal.id,
            self.cash_method.id,
            key,
        )

    def test_config_defaults_disable_quantity_trigger_and_are_role_bounded(self):
        config = self._config()
        self.assertEqual(config.quantity_threshold, 0.0)
        self.assertEqual(config.lead_time_days, 7)

        with self.assertRaises(AccessError):
            config.with_user(self.cashier).write({"lead_time_days": 5})

        config.with_user(self.production_manager).write(
            {"quantity_threshold": 3.0, "lead_time_days": 5}
        )
        config = config.sudo()
        self.assertEqual(config.quantity_threshold, 3.0)
        self.assertEqual(config.lead_time_days, 5)
        self.assertEqual(config.last_configured_by_id, self.production_manager)
        self.assertTrue(config.last_configured_at)

    def test_quantity_trigger_requires_explicit_threshold_and_snapshots_uncovered_demand(self):
        order = self._create_preorder([(self.products[0], 3)], pickup_days=30)
        self.assertFalse(self._tasks(order))

        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 5.0})
        self.assertFalse(
            self.env["fu.production.task"].with_user(self.production_manager).fu_evaluate_demand()
        )
        self.assertFalse(self._tasks(order))

        config.with_user(self.production_manager).write({"quantity_threshold": 2.0})
        task_ids = self.env["fu.production.task"].with_user(
            self.production_manager
        ).fu_evaluate_demand()
        self.assertEqual(len(task_ids), 1)
        task = self.env["fu.production.task"].sudo().browse(task_ids)
        self.assertEqual(task.product_id, self.products[0])
        self.assertEqual(task.trigger_reason, "quantity")
        self.assertEqual(task.state, "queued")
        self.assertEqual(task.quantity, 3.0)
        self.assertEqual(task.line_ids.preorder_id, order)
        self.assertEqual(task.line_ids.quantity, 3.0)

        self.assertFalse(
            self.env["fu.production.task"].with_user(self.production_manager).fu_evaluate_demand()
        )
        self.assertEqual(len(self._tasks(order)), 1)

    def test_default_and_configurable_deadline_trigger(self):
        due_with_default = self._create_preorder([(self.products[0], 1)], pickup_days=7)
        default_tasks = self._tasks(due_with_default)
        self.assertEqual(len(default_tasks), 1)
        self.assertEqual(default_tasks.trigger_reason, "deadline")

        config = self._config()
        config.with_user(self.production_manager).write({"lead_time_days": 3})
        later_order = self._create_preorder([(self.products[1], 1)], pickup_days=4)
        self.assertFalse(self._tasks(later_order))

        config.with_user(self.production_manager).write({"lead_time_days": 4})
        task_ids = self.env["fu.production.task"].with_user(
            self.production_manager
        ).fu_evaluate_demand()
        later_tasks = self._tasks(later_order)
        self.assertTrue(task_ids)
        self.assertEqual(len(later_tasks), 1)
        self.assertEqual(later_tasks.trigger_reason, "deadline")

    def test_exact_variant_demand_is_never_merged_across_sizes(self):
        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 1.0})
        order = self._create_preorder(
            [(self.products[0], 2), (self.products[1], 3)],
            pickup_days=30,
        )
        tasks = self._tasks(order)
        self.assertEqual(len(tasks), 2)
        self.assertEqual(set(tasks.product_id.ids), set(self.products.ids))
        quantities = {task.product_id.id: task.quantity for task in tasks}
        self.assertEqual(quantities[self.products[0].id], 2.0)
        self.assertEqual(quantities[self.products[1].id], 3.0)

    def test_ready_and_collected_quantities_are_excluded_from_production_demand(self):
        order = self._create_preorder([(self.products[0], 1)], pickup_days=30)
        line = order.order_line.filtered(lambda item: item.product_id == self.products[0])
        self._seed_store(self.products[0], 1, "P3A-READY-STOCK-001")
        order.with_user(self.inventory).fu_allocate_ready(
            [{"line_id": line.id, "quantity": 1}]
        )
        line.invalidate_recordset(["fu_ready_qty", "fu_collected_qty"])
        self.assertEqual(line.fu_ready_qty, 1.0)

        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 1.0})
        self.assertFalse(
            self.env["fu.production.task"].with_user(self.production_manager).fu_evaluate_demand()
        )
        self.assertFalse(self._tasks(order))

        self._pay_full(order, "p3a-collect-payment-001")
        order.with_user(self.cashier).fu_collect(
            [{"line_id": line.id, "quantity": 1}],
            "p3a-collection-001",
        )
        line.invalidate_recordset(["fu_ready_qty", "fu_collected_qty"])
        self.assertEqual(line.fu_collected_qty, 1.0)
        self.assertFalse(
            self.env["fu.production.task"].with_user(self.production_manager).fu_evaluate_demand()
        )
        self.assertFalse(self._tasks(order))

    def test_cancelled_queue_releases_coverage_and_replay_remains_idempotent(self):
        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 1.0})
        order = self._create_preorder([(self.products[0], 2)], pickup_days=30)
        original = self._tasks(order)
        self.assertEqual(len(original), 1)

        original.with_user(self.production_manager).write({"cancel_reason": "Regroup demand"})
        original.with_user(self.production_manager).action_cancel()
        self.assertEqual(original.state, "cancelled")
        self.assertEqual(original.cancelled_by_id, self.production_manager)

        created = self.env["fu.production.task"].with_user(
            self.production_manager
        ).fu_evaluate_demand()
        self.assertEqual(len(created), 1)
        tasks = self._tasks(order)
        self.assertEqual(len(tasks), 2)
        self.assertEqual(len(tasks.filtered(lambda task: task.state == "cancelled")), 1)
        self.assertEqual(len(tasks.filtered(lambda task: task.state == "queued")), 1)
        self.assertFalse(
            self.env["fu.production.task"].with_user(self.production_manager).fu_evaluate_demand()
        )
        self.assertEqual(len(self._tasks(order)), 2)

    def test_start_finish_security_and_no_stock_effect(self):
        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 1.0})
        order = self._create_preorder([(self.products[0], 1)], pickup_days=30)
        task = self._tasks(order)
        self.assertEqual(len(task), 1)

        with self.assertRaises(AccessError):
            task.with_user(self.cashier).action_start()
        with self.assertRaises(AccessError):
            task.with_user(self.production_manager).write({"state": "finished"})
        with self.assertRaises(AccessError):
            self.env["fu.production.task"].with_user(self.production_manager).create(
                {
                    "product_id": self.products[0].id,
                    "earliest_commitment_date": fields.Datetime.now(),
                    "trigger_reason": "quantity",
                }
            )

        move_count = self.env["stock.move"].sudo().search_count(
            [("product_id", "=", self.products[0].id)]
        )
        location_count = self.env["stock.location"].sudo().search_count([])
        store_qty = self.env["stock.quant"].sudo()._get_available_quantity(
            self.products[0], self.store, strict=False
        )

        task.with_user(self.production_manager).action_start()
        started_at = task.started_at
        self.assertEqual(task.state, "in_production")
        self.assertEqual(task.started_by_id, self.production_manager)
        task.with_user(self.production_manager).action_start()
        self.assertEqual(task.started_at, started_at)

        task.with_user(self.production_manager).action_finish()
        finished_at = task.finished_at
        self.assertEqual(task.state, "finished")
        self.assertEqual(task.finished_by_id, self.production_manager)
        task.with_user(self.production_manager).action_finish()
        self.assertEqual(task.finished_at, finished_at)

        self.assertEqual(
            self.env["stock.move"].sudo().search_count(
                [("product_id", "=", self.products[0].id)]
            ),
            move_count,
        )
        self.assertEqual(self.env["stock.location"].sudo().search_count([]), location_count)
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(
                self.products[0], self.store, strict=False
            ),
            store_qty,
        )
        order.invalidate_recordset(["fu_collection_state"])
        self.assertEqual(order.fu_collection_state, "awaiting_ready")

    def test_cumulative_task_coverage_cannot_exceed_uncovered_preorder_demand(self):
        config = self._config()
        config.with_user(self.production_manager).write({"quantity_threshold": 1.0})
        order = self._create_preorder([(self.products[0], 2)], pickup_days=30)
        source = order.order_line.filtered(lambda line: line.product_id == self.products[0])
        self.assertEqual(self._tasks(order).quantity, 2.0)

        with self.assertRaisesRegex(ValidationError, "coverage cannot exceed"):
            self.env["fu.production.task"].sudo().create(
                {
                    "company_id": self.env.company.id,
                    "product_id": self.products[0].id,
                    "earliest_commitment_date": order.commitment_date,
                    "trigger_reason": "quantity",
                    "queued_by_id": self.env.user.id,
                    "queued_at": fields.Datetime.now(),
                    "line_ids": [
                        Command.create(
                            {
                                "preorder_line_id": source.id,
                                "quantity": 1,
                            }
                        )
                    ],
                }
            )
        self.assertEqual(len(self._tasks(order)), 1)
