from datetime import timedelta

from odoo import Command, fields
from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged
from odoo.tests.common import TransactionCase


@tagged("post_install", "-at_install")
class TestPreorderDirectMutationBoundary(TransactionCase):
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
        cls.product = cls.env["product.product"].create(
            {
                "name": "Phase 2B Direct Mutation Polo",
                "is_storable": True,
                "lst_price": 100.0,
                "taxes_id": [Command.clear()],
            }
        )
        cls.partner = cls.env["res.partner"].create(
            {"name": "Phase 2B Direct Mutation Customer"}
        )
        cls.cash_journal = cls.env["account.journal"].create(
            {
                "name": "Phase 2B Direct Mutation Cash",
                "type": "cash",
                "code": "P2BS",
                "company_id": cls.env.company.id,
                "fu_confirmation_mode": "none",
            }
        )
        cls.cash_method = cls.cash_journal.inbound_payment_method_line_ids[:1]
        if not cls.cash_method:
            raise AssertionError("Synthetic Cash journal must expose an inbound payment method")
        cls.cashier = cls._make_user("cashier", "fu_core.group_fu_cashier")
        cls.store_manager = cls._make_user("manager", "fu_core.group_fu_store_manager")

    @classmethod
    def _make_user(cls, suffix, group_xmlid):
        group = cls.env.ref(group_xmlid)
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 2B boundary {suffix}",
                "login": f"phase2b-boundary-{suffix}@example.invalid",
                "email": f"phase2b-boundary-{suffix}@example.invalid",
                "group_ids": [Command.set([group.id])],
                "fu_stock_location_ids": [Command.set([cls.store.id])],
            }
        )

    def _prepare_native_records(self):
        order_id = self.env["sale.order"].with_user(self.cashier).fu_create_preorder(
            self.partner.id,
            fields.Datetime.now() + timedelta(days=14),
            [{"product_id": self.product.id, "quantity": 1}],
            self.store.id,
        )
        order = self.env["sale.order"].sudo().browse(order_id)
        line = order.order_line

        payment_id = order.with_user(self.cashier).fu_record_payment(
            order.amount_total / 2,
            self.cash_journal.id,
            self.cash_method.id,
            "p2b-direct-mutation-payment",
        )
        payment = self.env["account.payment"].sudo().browse(payment_id)

        self.env["fu.stock.movement.request"].process_idempotent(
            "p2b-direct-mutation-opening",
            "opening",
            product_id=self.product.id,
            quantity=1,
            destination_location_id=self.store.id,
            reason="Phase 2B direct-mutation boundary stock",
            batch_ref="P2B-DIRECT-MUTATION",
        )
        picking_id = order.with_user(self.store_manager).fu_allocate_ready(
            [{"line_id": line.id, "quantity": 1}]
        )
        picking = self.env["stock.picking"].sudo().browse(picking_id)
        move = picking.move_ids
        return order, line, payment, picking, move

    def _assert_boundary_state(self, order, line, picking):
        self.assertEqual(order.state, "draft")
        self.assertAlmostEqual(order.fu_amount_paid, order.amount_total / 2)
        self.assertEqual(picking.state, "assigned")
        self.assertAlmostEqual(line.fu_ready_qty, 1)

    def test_direct_sale_order_mutation_is_denied(self):
        order, line, _payment, picking, _move = self._prepare_native_records()
        with self.assertRaises(AccessError):
            order.with_user(self.cashier).write(
                {"commitment_date": fields.Datetime.now() + timedelta(days=30)}
            )
        self._assert_boundary_state(order, line, picking)

    def test_direct_sale_order_line_mutation_is_denied(self):
        order, line, _payment, picking, _move = self._prepare_native_records()
        with self.assertRaises(AccessError):
            line.with_user(self.cashier).write({"product_uom_qty": 2})
        self._assert_boundary_state(order, line, picking)

    def test_direct_account_payment_mutation_is_denied(self):
        order, line, payment, picking, _move = self._prepare_native_records()
        with self.assertRaises(AccessError):
            payment.with_user(self.cashier).write({"amount": payment.amount})
        self._assert_boundary_state(order, line, picking)

    def test_direct_stock_picking_mutation_is_denied(self):
        order, line, _payment, picking, _move = self._prepare_native_records()
        with self.assertRaises(AccessError):
            picking.with_user(self.store_manager).write({"origin": "forbidden-direct-edit"})
        self._assert_boundary_state(order, line, picking)

    def test_direct_stock_move_mutation_is_denied(self):
        order, line, _payment, picking, move = self._prepare_native_records()
        with self.assertRaises(AccessError):
            move.with_user(self.store_manager).write({"product_uom_qty": 2})
        self._assert_boundary_state(order, line, picking)


@tagged("post_install", "-at_install")
class TestPreorderPOSReservationBoundary(CommonPosTest):
    def setUp(self):
        super().setUp()
        self.env.user.group_ids += self.env.ref("fu_core.group_fu_owner_admin")
        self.env["stock.location"]._fu_configure_initial_locations()
        self.store = self.env["stock.location"].search(
            [
                ("company_id", "=", self.env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            limit=1,
        )
        self.assertTrue(self.store, "POS test company must have a configured Retail Store")
        self.warehouse = self.env["stock.warehouse"].search(
            [
                ("company_id", "=", self.env.company.id),
                ("lot_stock_id", "=", self.store.id),
            ],
            limit=1,
        )
        self.config = self.pos_config_usd
        self.config.write({"picking_type_id": self.warehouse.pos_type_id.id})
        self.assertEqual(self.config.picking_type_id.default_location_src_id, self.store)

        self.pos_user = self.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": "Phase 2B POS Cashier",
                "login": "phase2b-pos-cashier@example.invalid",
                "email": "phase2b-pos-cashier@example.invalid",
                "group_ids": [
                    Command.set(
                        [
                            self.env.ref("point_of_sale.group_pos_user").id,
                            self.env.ref("stock.group_stock_user").id,
                            self.env.ref("fu_core.group_fu_cashier").id,
                        ]
                    )
                ],
                "fu_stock_location_ids": [Command.set([self.store.id])],
            }
        )
        if not self.config.current_session_id:
            self.config.open_ui()
        self.pos_session = self.config.current_session_id
        self.assertTrue(self.pos_session, "POS test config must have an open session")
        if self.pos_session.state == "opening_control":
            self.pos_session.set_opening_control(0, None)

        self.product = self.env["product.product"].create(
            {
                "name": "Phase 2B POS Reserved Polo",
                "is_storable": True,
                "available_in_pos": True,
                "lst_price": 100.0,
                "taxes_id": [Command.clear()],
            }
        )
        self.partner = self.env["res.partner"].create(
            {"name": "Phase 2B POS Reservation Customer"}
        )
        self.env["fu.stock.movement.request"].process_idempotent(
            "p2b-pos-reservation-opening",
            "opening",
            product_id=self.product.id,
            quantity=2,
            destination_location_id=self.store.id,
            reason="Phase 2B POS reservation boundary stock",
            batch_ref="P2B-POS-RESERVATION",
        )

        order_id = self.env["sale.order"].fu_create_preorder(
            self.partner.id,
            fields.Datetime.now() + timedelta(days=14),
            [{"product_id": self.product.id, "quantity": 1}],
            self.store.id,
        )
        self.preorder = self.env["sale.order"].sudo().browse(order_id)
        self.preorder_picking = self.env["stock.picking"].sudo().browse(
            self.preorder.fu_allocate_ready(
                [{"line_id": self.preorder.order_line.id, "quantity": 1}]
            )
        )

    def _pos_payload(self, order_uuid):
        quantity = 1
        price_unit = self.config.pricelist_id._get_product_price(self.product, quantity)
        cash_payment_method = self.config.payment_method_ids.filtered(
            lambda method: method.is_cash_count and not method.split_transactions
        )[:1]
        self.assertTrue(
            cash_payment_method,
            "POS test config must expose a non-split cash payment method",
        )
        line_client_id = 1 + sum(order_uuid.encode("utf-8"))
        return {
            "amount_paid": price_unit,
            "amount_return": 0,
            "amount_tax": 0,
            "amount_total": price_unit,
            "date_order": fields.Datetime.to_string(fields.Datetime.now()),
            "fiscal_position_id": self.config.default_fiscal_position_id.id,
            "pricelist_id": self.config.pricelist_id.id,
            "name": f"Order {order_uuid}",
            "last_order_preparation_change": "{}",
            "lines": [
                (
                    0,
                    0,
                    {
                        "id": line_client_id,
                        "pack_lot_ids": [],
                        "price_unit": price_unit,
                        "product_id": self.product.id,
                        "price_subtotal": price_unit,
                        "price_subtotal_incl": price_unit,
                        "qty": quantity,
                        "tax_ids": [(6, 0, [])],
                        "discount": 0.0,
                    },
                )
            ],
            "partner_id": False,
            "session_id": self.pos_session.id,
            "payment_ids": [
                (
                    0,
                    0,
                    {
                        "amount": price_unit,
                        "name": fields.Datetime.now(),
                        "payment_method_id": cash_payment_method.id,
                    },
                )
            ],
            "uuid": order_uuid,
            "user_id": self.pos_user.id,
            "to_invoice": False,
        }

    def test_pos_can_sell_only_free_stock_and_replay_cannot_consume_reservation(self):
        Quant = self.env["stock.quant"].sudo()
        self.assertAlmostEqual(
            Quant._get_available_quantity(self.product, self.store, strict=False),
            1,
            msg="One of two store units must remain free after reserving one for the preorder",
        )

        first_uuid = "p2b-pos-free-unit-0001"
        self.env["pos.order"].with_user(self.pos_user).sync_from_ui(
            [self._pos_payload(first_uuid)]
        )
        first_order = self.env["pos.order"].sudo().search(
            [("uuid", "=", first_uuid)], limit=1
        )
        self.assertEqual(first_order.state, "paid")
        self.assertEqual(len(first_order.picking_ids), 1)
        self.assertEqual(first_order.picking_ids.state, "done")
        self.assertEqual(self.preorder_picking.state, "assigned")
        self.assertAlmostEqual(self.preorder.order_line.fu_ready_qty, 1)
        self.assertAlmostEqual(
            Quant._get_available_quantity(self.product, self.store, strict=False),
            0,
            msg="Ordinary POS checkout must consume the free unit, not the preorder reservation",
        )

        blocked_uuid = "p2b-pos-reserved-unit-0002"
        with self.assertRaisesRegex(ValidationError, "active preorder reservations"):
            with self.env.cr.savepoint():
                self.env["pos.order"].with_user(self.pos_user).sync_from_ui(
                    [self._pos_payload(blocked_uuid)]
                )
        self.assertFalse(
            self.env["pos.order"].sudo().search([("uuid", "=", blocked_uuid)]),
            "A POS sale that would consume preorder-reserved stock must roll back",
        )
        self.assertEqual(self.preorder_picking.state, "assigned")
        self.assertAlmostEqual(self.preorder.order_line.fu_ready_qty, 1)

        self.env["pos.order"].with_user(self.pos_user).sync_from_ui(
            [self._pos_payload(first_uuid)]
        )
        self.assertEqual(
            self.env["pos.order"].sudo().search_count([("uuid", "=", first_uuid)]),
            1,
            "Lost-ack replay of the already-paid POS UUID must remain idempotent",
        )
        first_order.invalidate_recordset(["picking_ids"])
        self.assertEqual(len(first_order.picking_ids), 1)
        self.assertEqual(self.preorder_picking.state, "assigned")
        self.assertAlmostEqual(self.preorder.order_line.fu_ready_qty, 1)
