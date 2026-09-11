from datetime import timedelta

from odoo import Command, fields
from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailReturns(CommonPosTest):
    def setUp(self):
        super().setUp()
        self.env.user.group_ids += self.env.ref("fu_core.group_fu_owner_admin")
        self.env["stock.location"]._fu_configure_initial_locations()
        self.store = self.env["stock.location"].search(
            [("company_id", "=", self.env.company.id), ("fu_location_role", "=", "store")],
            limit=1,
        )
        self.assertTrue(self.store)

        self.product = self.ten_dollars_no_tax.product_variant_id
        self.product.product_tmpl_id.is_storable = True
        self.env["fu.stock.movement.request"].process_idempotent(
            "phase2c-opening-stock",
            "opening",
            product_id=self.product.id,
            quantity=10,
            destination_location_id=self.store.id,
            reason="Synthetic Phase 2C test opening stock",
            batch_ref="PHASE2C-TEST",
        )
        self.bank_payment_method.write(
            {"name": "InstaPay", "fu_confirmation_mode": "bank_notification"}
        )

        self.cashier = self._make_user("cashier", "fu_core.group_fu_cashier", assigned=True)
        self.manager = self._make_user(
            "manager", "fu_core.group_fu_store_manager", assigned=True
        )
        self.unscoped_manager = self._make_user(
            "unscoped-manager", "fu_core.group_fu_store_manager", assigned=False
        )
        self.inventory = self._make_user(
            "inventory", "fu_core.group_fu_inventory_staff", assigned=True
        )

    def _make_user(self, suffix, group_xmlid, *, assigned):
        user = self.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 2C {suffix}",
                "login": f"phase2c-{suffix}@example.invalid",
                "email": f"phase2c-{suffix}@example.invalid",
                "group_ids": [Command.set([self.env.ref(group_xmlid).id])],
            }
        )
        if assigned:
            user.fu_stock_location_ids = [Command.set(self.store.ids)]
        return user

    def _cash_sale(self, *, qty=1, product=None):
        product = product or self.product
        order, _refund = self.create_backend_pos_order(
            {
                "line_data": [{"product_id": product.id, "qty": qty}],
                "payment_data": [
                    {
                        "payment_method_id": self.cash_payment_method.id,
                        "amount": product.lst_price * qty,
                    }
                ],
            }
        )
        self.assertIn(order.state, {"paid", "done"})
        self.assertTrue(
            order.picking_ids.filtered(
                lambda picking: picking.state == "done"
                and picking.picking_type_id.code == "outgoing"
            )
        )
        return order

    def _instapay_sale(self):
        order, _refund = self.create_backend_pos_order(
            {"line_data": [{"product_id": self.product.id, "qty": 1}]}
        )
        order.add_payment(
            {
                "pos_order_id": order.id,
                "amount": order.amount_total,
                "payment_method_id": self.bank_payment_method.id,
                "name": "Synthetic inbound InstaPay",
                "fu_manual_confirmed": True,
            }
        )
        order._process_saved_order(False)
        self.assertIn(order.state, {"paid", "done"})
        return order

    def _mixed_sale(self):
        order, _refund = self.create_backend_pos_order(
            {"line_data": [{"product_id": self.product.id, "qty": 1}]}
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
                "amount": 5.0,
                "payment_method_id": self.bank_payment_method.id,
                "name": "Synthetic mixed InstaPay",
                "fu_manual_confirmed": True,
            }
        )
        order._process_saved_order(False)
        return order

    def _request(self, order, *, user=None, path="no_reason", qty=1, **extra):
        user = user or self.cashier
        source_line = order.lines.filtered(lambda line: line.qty > 0)[:1]
        return self.env["fu.retail.return.request"].with_user(user).create(
            {
                "source_order_id": order.id,
                "operation": "refund",
                "eligibility_path": path,
                "reason": "Synthetic Phase 2C return",
                "physical_received": True,
                "line_ids": [
                    Command.create(
                        {"source_line_id": source_line.id, "quantity": qty}
                    )
                ],
                **extra,
            }
        )

    def _inspection_location(self):
        return self.env["stock.location"].sudo().search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_location_role", "=", "returns_inspection"),
            ],
            limit=1,
        )

    def test_cashier_requests_but_manager_approves_and_executes(self):
        order = self._cash_sale()
        request = self._request(order)
        request.with_user(self.cashier).action_submit()
        self.assertEqual(request.state, "requested")
        self.assertEqual(request.requested_by_id, self.cashier)

        with self.assertRaisesRegex(AccessError, "Store Manager or Owner"):
            request.with_user(self.cashier).action_approve()
        request.with_user(self.manager).action_approve()
        self.assertEqual(request.state, "approved")
        self.assertEqual(request.approved_by_id, self.manager)

        with self.assertRaisesRegex(AccessError, "Store Manager or Owner"):
            request.with_user(self.cashier).action_execute()
        request.with_user(self.manager).action_execute()
        self.assertEqual(request.state, "done")
        self.assertEqual(request.executed_by_id, self.manager)

    def test_unscoped_manager_cannot_approve_store_return(self):
        request = self._request(self._cash_sale())
        request.action_submit()
        with self.assertRaises(AccessError):
            request.with_user(self.unscoped_manager).action_approve()

    def test_no_reason_and_defect_windows_are_enforced(self):
        old_no_reason = self._cash_sale()
        old_no_reason.picking_ids.filtered(
            lambda picking: picking.picking_type_id.code == "outgoing"
        ).sudo().write({"date_done": fields.Datetime.now() - timedelta(days=15)})
        request = self._request(old_no_reason, path="no_reason")
        with self.assertRaisesRegex(ValidationError, "14-day"):
            request.action_submit()

        defect_order = self._cash_sale()
        defect_order.picking_ids.filtered(
            lambda picking: picking.picking_type_id.code == "outgoing"
        ).sudo().write({"date_done": fields.Datetime.now() - timedelta(days=29)})
        defect = self._request(defect_order, path="defect")
        defect.action_submit()
        self.assertEqual(defect.state, "requested")

    def test_special_specification_blocks_only_no_reason_path(self):
        order = self._cash_sale()
        self.product.product_tmpl_id.fu_made_to_special_specification = True
        no_reason = self._request(order, path="no_reason")
        with self.assertRaisesRegex(ValidationError, "special-specification"):
            no_reason.action_submit()

        defect = self._request(order, path="defect")
        defect.action_submit()
        self.assertEqual(defect.state, "requested")

    def test_direct_native_refund_and_negative_line_bypass_are_denied(self):
        order = self._cash_sale()
        with self.assertRaisesRegex(AccessError, "approved Fares return request"):
            order.with_user(self.manager)._refund()

        with self.assertRaisesRegex(AccessError, "approved Fares return execution"):
            self.env["pos.order.line"].with_user(self.manager).create(
                {
                    "order_id": order.id,
                    "product_id": self.product.id,
                    "qty": -1,
                    "price_unit": self.product.lst_price,
                }
            )

    def test_cash_refund_is_linked_idempotent_and_quarantined(self):
        order = self._cash_sale()
        original_payment_ids = order.payment_ids.ids
        original_line = order.lines.filtered(lambda line: line.qty > 0)[:1]
        store_after_sale = self.env["stock.quant"].sudo()._get_available_quantity(
            self.product, self.store
        )
        self.assertEqual(store_after_sale, 9)

        request = self._request(order)
        request.action_submit()
        request.with_user(self.manager).action_approve()
        refund = request.with_user(self.manager).action_execute()
        refund.ensure_one()

        self.assertEqual(request.state, "done")
        self.assertEqual(request.refund_order_id, refund)
        self.assertTrue(refund.is_refund)
        self.assertEqual(refund.refunded_order_id, order)
        self.assertEqual(order.payment_ids.ids, original_payment_ids)
        self.assertEqual(len(refund.payment_ids), 1)
        self.assertEqual(refund.payment_ids.payment_method_id, self.cash_payment_method)
        self.assertEqual(refund.payment_ids.amount, -10.0)
        self.assertEqual(original_line.refunded_qty, 1)

        native_returns = refund.picking_ids.filtered(
            lambda picking: picking.state == "done"
            and any(move.origin_returned_move_id for move in picking.move_ids)
        )
        self.assertEqual(len(native_returns), 1)
        self.assertTrue(request.quarantine_picking_id)
        self.assertEqual(request.quarantine_picking_id.state, "done")

        inspection = self._inspection_location()
        self.assertTrue(inspection)
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.product, inspection),
            1,
        )
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.product, self.store),
            9,
        )

        refund_payment_ids = refund.payment_ids.ids
        refund_picking_ids = refund.picking_ids.ids
        quarantine_id = request.quarantine_picking_id.id
        replay = request.with_user(self.manager).action_execute()
        self.assertEqual(replay, refund)
        self.assertEqual(refund.payment_ids.ids, refund_payment_ids)
        self.assertEqual(refund.picking_ids.ids, refund_picking_ids)
        self.assertEqual(request.quarantine_picking_id.id, quarantine_id)

    def test_instapay_refund_requires_positive_outbound_evidence(self):
        missing = self._request(self._instapay_sale())
        missing.action_submit()
        missing.with_user(self.manager).action_approve()
        with self.assertRaisesRegex(ValidationError, "outbound InstaPay"):
            missing.with_user(self.manager).action_execute()

        request = self._request(
            self._instapay_sale(),
            bank_refund_confirmed=True,
            settlement_reference="IP-OUT-TEST-001",
        )
        request.action_submit()
        request.with_user(self.manager).action_approve()
        refund = request.with_user(self.manager).action_execute()
        payment = refund.payment_ids.ensure_one()
        self.assertEqual(payment.payment_method_id, self.bank_payment_method)
        self.assertTrue(payment.fu_manual_confirmed)
        self.assertEqual(payment.name, "IP-OUT-TEST-001")

    def test_mixed_method_source_sale_is_not_automated(self):
        request = self._request(self._mixed_sale())
        with self.assertRaisesRegex(ValidationError, "exactly one supported payment method"):
            request.action_submit()

    def test_inspection_acceptance_is_scoped_and_idempotent(self):
        request = self._request(self._cash_sale())
        request.action_submit()
        request.with_user(self.manager).action_approve()
        request.with_user(self.manager).action_execute()
        line = request.line_ids.ensure_one()
        inspection = self._inspection_location()

        line.with_user(self.inventory).action_accept_sellable()
        self.assertEqual(line.inspection_state, "accepted")
        self.assertEqual(line.inspected_by_id, self.inventory)
        acceptance_id = line.acceptance_picking_id.id
        self.assertTrue(acceptance_id)
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.product, inspection),
            0,
        )
        self.assertEqual(
            self.env["stock.quant"].sudo()._get_available_quantity(self.product, self.store),
            10,
        )

        line.with_user(self.inventory).action_accept_sellable()
        self.assertEqual(line.acceptance_picking_id.id, acceptance_id)
