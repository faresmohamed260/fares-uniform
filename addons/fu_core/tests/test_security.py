from odoo import Command
from odoo.exceptions import AccessError
from odoo.tests.common import TransactionCase


class TestFaresRoleSecurity(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.owner_group = cls.env.ref("fu_core.group_fu_owner_admin")
        cls.store_manager_group = cls.env.ref("fu_core.group_fu_store_manager")
        cls.cashier_group = cls.env.ref("fu_core.group_fu_cashier")
        cls.inventory_group = cls.env.ref("fu_core.group_fu_inventory_staff")
        cls.production_group = cls.env.ref("fu_core.group_fu_production_manager")
        cls.sales_group = cls.env.ref("fu_core.group_fu_sales_bd")

        cls.store = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        cls.storage = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "storage")],
            limit=1,
        )
        cls.product = cls.env["product.template"].create(
            {"name": "Security Test Polo", "is_storable": True}
        ).product_variant_id

        cls.owner = cls._make_user("owner", [cls.owner_group])
        cls.store_manager = cls._make_user(
            "store-manager", [cls.store_manager_group], [cls.store]
        )
        cls.cashier = cls._make_user("cashier", [cls.cashier_group], [cls.store])
        cls.inventory = cls._make_user(
            "inventory", [cls.inventory_group], [cls.store]
        )
        cls.production = cls._make_user("production", [cls.production_group])
        cls.sales = cls._make_user("sales", [cls.sales_group])
        cls.multi_role = cls._make_user(
            "cashier-sales", [cls.cashier_group, cls.sales_group], [cls.store]
        )

    @classmethod
    def _make_user(cls, suffix, groups, locations=()):
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 1 {suffix}",
                "login": f"phase1-{suffix}@example.invalid",
                "email": f"phase1-{suffix}@example.invalid",
                "group_ids": [Command.set([group.id for group in groups])],
                "fu_stock_location_ids": [Command.set([location.id for location in locations])],
            }
        )

    def _opening(self, user, key, location, quantity):
        return self.env["fu.stock.movement.request"].with_user(user).process_idempotent(
            key,
            "opening",
            product_id=self.product.id,
            quantity=quantity,
            destination_location_id=location.id,
            reason="Security test opening",
            batch_ref="SECURITY-OPEN",
        )

    def test_roles_are_independent_and_can_be_combined(self):
        self.assertTrue(self.multi_role.has_group("fu_core.group_fu_cashier"))
        self.assertTrue(self.multi_role.has_group("fu_core.group_fu_sales_bd"))

    def test_owner_has_product_master_authority_but_cashier_does_not(self):
        product = self.env["product.template"].with_user(self.owner).create(
            {"name": "Owner-created Product", "is_storable": True}
        )
        self.assertTrue(product.product_variant_id.default_code.startswith("FU-"))

        with self.assertRaises(AccessError):
            self.product.product_tmpl_id.with_user(self.cashier).write(
                {"name": "Cashier must not edit product master"}
            )

    def test_inventory_uses_service_but_cannot_mutate_native_stock_directly(self):
        request = self._opening(self.inventory, "SEC-INV-OPEN-001", self.store, 6)
        self.assertEqual(request.state, "done")
        self.assertEqual(request.actor_id, self.inventory)
        self.assertEqual(request.executed_by_id, self.inventory)

        with self.assertRaises(AccessError):
            self.env["stock.picking"].with_user(self.inventory).create(
                {
                    "picking_type_id": self.env["stock.warehouse"].search([], limit=1).int_type_id.id,
                    "location_id": self.store.id,
                    "location_dest_id": self.storage.id,
                }
            )
        with self.assertRaises(AccessError):
            self.env["stock.quant"].with_user(self.inventory).with_context(
                inventory_mode=True
            ).create(
                {
                    "product_id": self.product.id,
                    "location_id": self.store.id,
                    "inventory_quantity": 99,
                }
            )

    def test_inventory_location_assignment_is_enforced_server_side(self):
        self._opening(self.inventory, "SEC-STORE-OPEN-001", self.store, 4)
        with self.assertRaises(AccessError):
            self._opening(self.inventory, "SEC-STORAGE-DENY-001", self.storage, 3)
        with self.assertRaises(AccessError):
            self.env["fu.stock.movement.request"].with_user(self.inventory).process_idempotent(
                "SEC-XFER-DENY-001",
                "internal",
                product_id=self.product.id,
                quantity=1,
                source_location_id=self.store.id,
                destination_location_id=self.storage.id,
                reason="Unassigned destination must fail",
            )

    def test_assigned_location_quant_visibility_is_scoped(self):
        self.env["fu.stock.movement.request"].process_idempotent(
            "SEC-VIS-STORE-001",
            "opening",
            product_id=self.product.id,
            quantity=7,
            destination_location_id=self.store.id,
            reason="Visibility store",
            batch_ref="SEC-VIS",
        )
        self.env["fu.stock.movement.request"].process_idempotent(
            "SEC-VIS-STORAGE-001",
            "opening",
            product_id=self.product.id,
            quantity=5,
            destination_location_id=self.storage.id,
            reason="Visibility storage",
            batch_ref="SEC-VIS",
        )
        quants = self.env["stock.quant"].with_user(self.cashier).search(
            [
                ("product_id", "=", self.product.id),
                ("location_id", "in", [self.store.id, self.storage.id]),
            ]
        )
        self.assertEqual(quants.location_id, self.store)

    def test_cashier_cannot_execute_stock_service(self):
        with self.assertRaises(AccessError):
            self._opening(self.cashier, "SEC-CASHIER-DENY-001", self.store, 2)

    def test_store_manager_reads_assigned_request_but_sales_does_not(self):
        request = self.env["fu.stock.movement.request"].process_idempotent(
            "SEC-MANAGER-READ-001",
            "opening",
            product_id=self.product.id,
            quantity=2,
            destination_location_id=self.store.id,
            reason="Manager visibility",
            batch_ref="SEC-MGR",
        )
        visible = self.env["fu.stock.movement.request"].with_user(self.store_manager).search(
            [("id", "=", request.id)]
        )
        self.assertEqual(visible, request)
        with self.assertRaises(AccessError):
            request.with_user(self.sales).read(["request_key"])

    def test_self_escalation_and_self_location_reassignment_are_denied(self):
        with self.assertRaises(AccessError):
            self.cashier.with_user(self.cashier).write(
                {"group_ids": [Command.link(self.owner_group.id)]}
            )
        with self.assertRaises(AccessError):
            self.cashier.with_user(self.cashier).write(
                {"fu_stock_location_ids": [Command.link(self.storage.id)]}
            )

    def test_owner_can_administer_fares_roles_and_location_assignments(self):
        self.sales.with_user(self.owner).write(
            {
                "group_ids": [Command.link(self.inventory_group.id)],
                "fu_stock_location_ids": [Command.set([self.storage.id])],
            }
        )
        self.assertTrue(self.sales.has_group("fu_core.group_fu_inventory_staff"))
        self.assertEqual(self.sales.fu_stock_location_ids, self.storage)
