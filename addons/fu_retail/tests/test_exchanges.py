from odoo import Command
from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailExchanges(CommonPosTest):
    def setUp(self):
        super().setUp()
        self.env.user.group_ids += self.env.ref("fu_core.group_fu_owner_admin")
        self.env["stock.location"]._fu_configure_initial_locations()
        self.store = self.env["stock.location"].search(
            [("company_id", "=", self.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        self.assertTrue(self.store)
        self.bank_payment_method.write(
            {"name": "InstaPay", "fu_confirmation_mode": "bank_notification"}
        )

        size_attribute = self.env["product.attribute"].create(
            {
                "name": "Phase 2C Size",
                "value_ids": [
                    Command.create({"name": "S"}),
                    Command.create({"name": "M"}),
                    Command.create({"name": "L"}),
                ],
            }
        )
        self.template = self.env["product.template"].create(
            {
                "name": "Phase 2C Exchange Shirt",
                "list_price": 10.0,
                "is_storable": True,
                "taxes_id": [Command.clear()],
                "attribute_line_ids": [
                    Command.create(
                        {
                            "attribute_id": size_attribute.id,
                            "value_ids": [Command.set(size_attribute.value_ids.ids)],
                        }
                    )
                ],
            }
        )
        variants = {
            variant.product_template_attribute_value_ids.product_attribute_value_id.name: variant
            for variant in self.template.product_variant_ids
        }
        self.small = variants["S"]
        self.medium = variants["M"]
        self.large = variants["L"]
        self.large.product_template_attribute_value_ids.price_extra = 2.0
        self.large.invalidate_recordset(["lst_price"])
        self.assertEqual(self.small.lst_price, 10.0)
        self.assertEqual(self.medium.lst_price, 10.0)
        self.assertEqual(self.large.lst_price, 12.0)

        for product in (self.small, self.medium, self.large):
            self.env["fu.stock.movement.request"].process_idempotent(
                f"phase2c-exchange-opening-{product.id}",
                "opening",
                product_id=product.id,
                quantity=6,
                destination_location_id=self.store.id,
                reason="Synthetic Phase 2C exchange opening stock",
                batch_ref="PHASE2C-EXCHANGE",
            )

    def _sale(self, product, *, method=None):
        method = method or self.cash_payment_method
        order, _refund = self.create_backend_pos_order(
            {"line_data": [{"product_id": product.id, "qty": 1}]}
        )
        payment_vals = {
            "pos_order_id": order.id,
            "amount": order.amount_total,
            "payment_method_id": method.id,
            "name": "Synthetic Phase 2C exchange sale",
        }
        if method.fu_confirmation_mode == "bank_notification":
            payment_vals["fu_manual_confirmed"] = True
        order.add_payment(payment_vals)
        order._process_saved_order(False)
        self.assertIn(order.state, {"paid", "done"})
        self.assertTrue(
            order.picking_ids.filtered(
                lambda picking: picking.state == "done"
                and picking.picking_type_id.code == "outgoing"
            )
        )
        return order

    def _mixed_sale(self, product):
        order, _refund = self.create_backend_pos_order(
            {"line_data": [{"product_id": product.id, "qty": 1}]}
        )
        order.add_payment(
            {
                "pos_order_id": order.id,
                "amount": 5.0,
                "payment_method_id": self.cash_payment_method.id,
                "name": "Synthetic mixed cash",
            }
        )
        order.add_payment(
            {
                "pos_order_id": order.id,
                "amount": order.amount_total - 5.0,
                "payment_method_id": self.bank_payment_method.id,
                "name": "Synthetic mixed InstaPay",
                "fu_manual_confirmed": True,
            }
        )
        order._process_saved_order(False)
        return order

    def _exchange_request(self, order, replacement, **extra):
        source_line = order.lines.filtered(lambda line: line.qty > 0)[:1]
        return self.env["fu.retail.return.request"].create(
            {
                "source_order_id": order.id,
                "operation": "exchange",
                "eligibility_path": "no_reason",
                "reason": "Synthetic Phase 2C size exchange",
                "physical_received": True,
                "line_ids": [
                    Command.create(
                        {
                            "source_line_id": source_line.id,
                            "quantity": 1,
                            "replacement_product_id": replacement.id,
                        }
                    )
                ],
                **extra,
            }
        )

    def _execute(self, request):
        request.action_submit()
        request.action_approve()
        result = request.action_execute()
        result.ensure_one()
        self.assertEqual(request.state, "done")
        self.assertEqual(request.exchange_order_id, result)
        return result

    def test_same_price_exchange_has_zero_settlement_and_native_stock_lineage(self):
        source = self._sale(self.small)
        source_line = source.lines.filtered(lambda line: line.qty > 0).ensure_one()
        request = self._exchange_request(source, self.medium)
        exchange = self._execute(request)

        self.assertTrue(exchange.is_refund)
        self.assertEqual(exchange.refunded_order_id, source)
        self.assertAlmostEqual(exchange.amount_total, 0.0, places=2)
        self.assertFalse(exchange.payment_ids)
        self.assertEqual(source_line.refunded_qty, 1)
        self.assertEqual(len(exchange.lines), 2)

        returned = exchange.lines.filtered(lambda line: line.refunded_orderline_id == source_line)
        replacement = exchange.lines.filtered(
            lambda line: line.product_id == self.medium and line.qty > 0
        )
        self.assertEqual(len(returned), 1)
        self.assertEqual(returned.qty, -1)
        self.assertEqual(len(replacement), 1)
        self.assertEqual(replacement.qty, 1)
        self.assertEqual(request.line_ids.replacement_order_line_id, replacement)

        inspection = self.env["stock.location"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_location_role", "=", "returns_inspection"),
            ],
            limit=1,
        )
        self.assertTrue(inspection)
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.small, inspection),
            1,
        )
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.small, self.store),
            5,
        )
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.medium, self.store),
            5,
        )

    def test_more_expensive_size_collects_only_cash_difference(self):
        exchange = self._execute(self._exchange_request(self._sale(self.small), self.large))
        self.assertAlmostEqual(exchange.amount_total, 2.0, places=2)
        payment = exchange.payment_ids.ensure_one()
        self.assertEqual(payment.payment_method_id, self.cash_payment_method)
        self.assertAlmostEqual(payment.amount, 2.0, places=2)

    def test_cheaper_size_refunds_only_cash_difference(self):
        exchange = self._execute(self._exchange_request(self._sale(self.large), self.small))
        self.assertAlmostEqual(exchange.amount_total, -2.0, places=2)
        payment = exchange.payment_ids.ensure_one()
        self.assertEqual(payment.payment_method_id, self.cash_payment_method)
        self.assertAlmostEqual(payment.amount, -2.0, places=2)

    def test_exchange_rejects_replacement_stock_shortage(self):
        source = self._sale(self.small)
        for _index in range(6):
            self._sale(self.medium)
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.medium, self.store),
            0,
        )

        request = self._exchange_request(source, self.medium)
        request.action_submit()
        request.action_approve()
        with self.assertRaisesRegex(ValidationError, "does not have enough sellable stock"):
            request.action_execute()
        self.assertEqual(request.state, "approved")
        self.assertFalse(request.exchange_order_id)

    def test_instapay_exchange_refund_difference_requires_and_records_evidence(self):
        missing = self._exchange_request(
            self._sale(self.large, method=self.bank_payment_method), self.small
        )
        missing.action_submit()
        missing.action_approve()
        with self.assertRaisesRegex(ValidationError, "manual bank evidence"):
            missing.action_execute()

        request = self._exchange_request(
            self._sale(self.large, method=self.bank_payment_method),
            self.small,
            bank_refund_confirmed=True,
            settlement_reference="IP-EXCHANGE-OUT-001",
        )
        exchange = self._execute(request)
        self.assertAlmostEqual(exchange.amount_total, -2.0, places=2)
        payment = exchange.payment_ids.ensure_one()
        self.assertEqual(payment.payment_method_id, self.bank_payment_method)
        self.assertAlmostEqual(payment.amount, -2.0, places=2)
        self.assertTrue(payment.fu_manual_confirmed)
        self.assertEqual(payment.name, "IP-EXCHANGE-OUT-001")

    def test_exchange_rejects_mixed_source_payment(self):
        request = self._exchange_request(self._mixed_sale(self.small), self.medium)
        with self.assertRaisesRegex(ValidationError, "exactly one supported payment method"):
            request.action_submit()

    def test_exchange_requires_another_variant_of_same_template(self):
        unrelated = self.env["product.template"].create(
            {
                "name": "Unrelated exchange product",
                "is_storable": True,
                "list_price": 10.0,
                "taxes_id": [Command.clear()],
            }
        ).product_variant_id
        request = self._exchange_request(self._sale(self.small), unrelated)
        with self.assertRaisesRegex(ValidationError, "same product template"):
            request.action_submit()

    def test_exchange_execution_is_idempotent(self):
        request = self._exchange_request(self._sale(self.small), self.medium)
        exchange = self._execute(request)
        payment_ids = exchange.payment_ids.ids
        picking_ids = exchange.picking_ids.ids
        quarantine_id = request.quarantine_picking_id.id
        replacement_line_id = request.line_ids.replacement_order_line_id.id

        replay = request.action_execute()
        self.assertEqual(replay, exchange)
        self.assertEqual(exchange.payment_ids.ids, payment_ids)
        self.assertEqual(exchange.picking_ids.ids, picking_ids)
        self.assertEqual(request.quarantine_picking_id.id, quarantine_id)
        self.assertEqual(request.line_ids.replacement_order_line_id.id, replacement_line_id)
