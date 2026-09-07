from odoo.exceptions import ValidationError
from odoo.tests.common import TransactionCase


class TestFaresStockCustody(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.warehouse = cls.env["stock.warehouse"].search(
            [("company_id", "=", cls.env.company.id)], limit=1
        )
        cls.store = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        cls.storage = cls.env["stock.location"].search(
            [("company_id", "=", cls.env.company.id), ("fu_location_role", "=", "storage")],
            limit=1,
        )
        cls.product = cls.env["product.template"].create(
            {"name": "Synthetic Custody Polo", "is_storable": True}
        ).product_variant_id
        cls.request_model = cls.env["fu.stock.movement.request"]

    def _quantity(self, location):
        return self.env["stock.quant"]._get_available_quantity(
            self.product, location, strict=True
        )

    def _opening(self, key, location, quantity):
        return self.request_model.process_idempotent(
            key,
            "opening",
            product_id=self.product.id,
            quantity=quantity,
            destination_location_id=location.id,
            reason="Synthetic opening count",
            batch_ref="OPEN-A",
        )

    def test_only_store_and_storage_are_fares_finished_stock_locations(self):
        locations = self.env["stock.location"].search(
            [("company_id", "=", self.env.company.id), ("fu_location_role", "!=", False)]
        )
        self.assertEqual(set(locations.mapped("fu_location_role")), {"store", "storage"})
        self.assertEqual(len(locations), 2)
        self.assertEqual(self.store, self.warehouse.lot_stock_id)
        self.assertEqual(self.store.name, "Retail Store")
        self.assertEqual(self.storage.name, "Storage")
        self.assertEqual(self.storage.usage, "internal")
        self.assertEqual(self.storage.location_id, self.warehouse.view_location_id)

    def test_opening_count_sets_native_quant_and_records_attribution(self):
        request = self._opening("OPEN-STORE-001", self.store, 10)
        self.assertEqual(request.state, "done")
        self.assertEqual(self._quantity(self.store), 10)
        self.assertEqual(request.create_uid, self.env.user)
        self.assertTrue(request.create_date)
        self.assertTrue(request.stock_move_id)
        self.assertTrue(request.stock_move_id.is_inventory)
        self.assertIn("OPEN-STORE-001", request.stock_move_id.inventory_name)
        self.assertIn("OPEN-A", request.stock_move_id.inventory_name)
        self.assertIn("Synthetic opening count", request.stock_move_id.inventory_name)

        repeated = self._opening("OPEN-STORE-001", self.store, 10)
        self.assertEqual(repeated, request)
        self.assertEqual(self._quantity(self.store), 10)
        self.assertEqual(
            self.env["fu.stock.movement.request"].search_count(
                [("request_key", "=", "OPEN-STORE-001")]
            ),
            1,
        )

    def test_receipt_uses_native_picking_and_retry_does_not_duplicate(self):
        request = self.request_model.process_idempotent(
            "RECEIPT-STORAGE-001",
            "receipt",
            product_id=self.product.id,
            quantity=5,
            destination_location_id=self.storage.id,
            reason="Synthetic finished-goods receipt",
        )
        self.assertEqual(request.picking_id.state, "done")
        self.assertEqual(request.picking_id.location_dest_id, self.storage)
        self.assertEqual(request.picking_id.location_id.usage, "supplier")
        self.assertEqual(self._quantity(self.storage), 5)

        repeated = self.request_model.process_idempotent(
            "RECEIPT-STORAGE-001",
            "receipt",
            product_id=self.product.id,
            quantity=5,
            destination_location_id=self.storage.id,
            reason="Synthetic finished-goods receipt",
        )
        self.assertEqual(repeated, request)
        self.assertEqual(repeated.picking_id, request.picking_id)
        self.assertEqual(self._quantity(self.storage), 5)
        self.assertEqual(
            self.env["stock.picking"].search_count(
                [("origin", "=", "FU:RECEIPT-STORAGE-001")]
            ),
            1,
        )

    def test_internal_transfer_moves_once_between_store_and_storage(self):
        self._opening("OPEN-XFER-001", self.store, 10)
        request = self.request_model.process_idempotent(
            "TRANSFER-001",
            "internal",
            product_id=self.product.id,
            quantity=4,
            source_location_id=self.store.id,
            destination_location_id=self.storage.id,
            reason="Synthetic store to storage transfer",
        )
        self.assertEqual(request.picking_id.state, "done")
        self.assertEqual(self._quantity(self.store), 6)
        self.assertEqual(self._quantity(self.storage), 4)

        repeated = self.request_model.process_idempotent(
            "TRANSFER-001",
            "internal",
            product_id=self.product.id,
            quantity=4,
            source_location_id=self.store.id,
            destination_location_id=self.storage.id,
            reason="Synthetic store to storage transfer",
        )
        self.assertEqual(repeated, request)
        self.assertEqual(self._quantity(self.store), 6)
        self.assertEqual(self._quantity(self.storage), 4)
        self.assertEqual(
            self.env["stock.picking"].search_count([("origin", "=", "FU:TRANSFER-001")]),
            1,
        )

    def test_untracked_internal_location_is_rejected_as_finished_stock_destination(self):
        other = self.env["stock.location"].create(
            {
                "name": "Synthetic Factory Finished",
                "usage": "internal",
                "location_id": self.warehouse.view_location_id.id,
                "company_id": self.env.company.id,
            }
        )
        with self.assertRaises(ValidationError):
            self.request_model.process_idempotent(
                "INVALID-FACTORY-001",
                "receipt",
                product_id=self.product.id,
                quantity=3,
                destination_location_id=other.id,
                reason="Must not create factory-finished custody",
            )
        self.assertEqual(self._quantity(other), 0)

    def test_reused_request_key_with_changed_payload_is_rejected(self):
        self._opening("OPEN-IDEMP-001", self.store, 8)
        with self.assertRaises(ValidationError):
            self.request_model.process_idempotent(
                "OPEN-IDEMP-001",
                "opening",
                product_id=self.product.id,
                quantity=9,
                destination_location_id=self.store.id,
                reason="Synthetic opening count",
                batch_ref="OPEN-A",
            )
        self.assertEqual(self._quantity(self.store), 8)

    def test_internal_transfer_rejects_insufficient_source_stock(self):
        self._opening("OPEN-LOW-001", self.store, 2)
        with self.assertRaises(ValidationError):
            self.request_model.process_idempotent(
                "TRANSFER-LOW-001",
                "internal",
                product_id=self.product.id,
                quantity=3,
                source_location_id=self.store.id,
                destination_location_id=self.storage.id,
                reason="Synthetic impossible transfer",
            )
        self.assertEqual(self._quantity(self.store), 2)
        self.assertEqual(self._quantity(self.storage), 0)
