import copy

from odoo import Command
from odoo.addons.point_of_sale.tests.common import CommonPosTest, TestPoSCommon
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailPaymentConfirmation(CommonPosTest):
    def setUp(self):
        super().setUp()
        self.env.user.group_ids += self.env.ref("fu_core.group_fu_owner_admin")
        self.bank_payment_method.write(
            {"name": "InstaPay", "fu_confirmation_mode": "bank_notification"}
        )
        self.order, _refund = self.create_backend_pos_order(
            {
                "line_data": [
                    {
                        "product_id": self.ten_dollars_no_tax.product_variant_id.id,
                        "qty": 1,
                    }
                ]
            }
        )

    def _make_user(self, suffix, groups):
        return self.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 2A {suffix}",
                "login": f"phase2a-{suffix}@example.invalid",
                "email": f"phase2a-{suffix}@example.invalid",
                "group_ids": [Command.set([group.id for group in groups])],
            }
        )

    def test_confirmation_capability_is_loaded_into_pos(self):
        fields_to_load = self.env["pos.payment.method"]._load_pos_data_fields(self.pos_config_usd)
        self.assertIn("fu_confirmation_mode", fields_to_load)

    def test_instapay_requires_positive_manual_confirmation(self):
        vals = {
            "pos_order_id": self.order.id,
            "amount": self.order.amount_total,
            "payment_method_id": self.bank_payment_method.id,
        }
        with self.assertRaisesRegex(ValidationError, "requires staff confirmation"):
            self.env["pos.payment"].create(vals)

        payment = self.env["pos.payment"].create({**vals, "fu_manual_confirmed": True})
        self.assertTrue(payment.fu_manual_confirmed)
        self.assertEqual(payment.create_uid, self.env.user)
        self.assertTrue(payment.create_date)

        payment.write({"fu_manual_confirmed": True})
        with self.assertRaisesRegex(ValidationError, "cannot be cleared"):
            payment.write({"fu_manual_confirmed": False})

    def test_cash_does_not_require_external_confirmation(self):
        payment = self.env["pos.payment"].create(
            {
                "pos_order_id": self.order.id,
                "amount": self.order.amount_total,
                "payment_method_id": self.cash_payment_method.id,
            }
        )
        self.assertFalse(payment.fu_manual_confirmed)

    def test_fares_retail_roles_map_to_native_pos_without_broadening_cashier(self):
        owner = self._make_user("owner", [self.env.ref("fu_core.group_fu_owner_admin")])
        manager = self._make_user(
            "store-manager", [self.env.ref("fu_core.group_fu_store_manager")]
        )
        cashier = self._make_user("cashier", [self.env.ref("fu_core.group_fu_cashier")])
        inventory = self._make_user(
            "inventory", [self.env.ref("fu_core.group_fu_inventory_staff")]
        )

        self.assertTrue(owner.has_group("point_of_sale.group_pos_manager"))
        self.assertTrue(manager.has_group("point_of_sale.group_pos_user"))
        self.assertTrue(cashier.has_group("point_of_sale.group_pos_user"))
        self.assertFalse(cashier.has_group("point_of_sale.group_pos_manager"))
        self.assertFalse(inventory.has_group("point_of_sale.group_pos_user"))

    def test_sync_revalidates_current_fares_role_after_offline_role_revocation(self):
        cashier_group = self.env.ref("fu_core.group_fu_cashier")
        native_pos_user = self.env.ref("point_of_sale.group_pos_user")
        base_user = self.env.ref("base.group_user")
        former_cashier = self._make_user("former-cashier", [cashier_group])

        self.env["pos.order"].with_user(former_cashier)._fu_assert_retail_sync_authorized()
        former_cashier.group_ids = [Command.set([base_user.id, native_pos_user.id])]

        self.assertTrue(former_cashier.has_group("point_of_sale.group_pos_user"))
        self.assertFalse(former_cashier.has_group("fu_core.group_fu_cashier"))
        with self.assertRaisesRegex(AccessError, "remains pending and requires review"):
            self.env["pos.order"].with_user(former_cashier).sync_from_ui(
                [{"uuid": "fu-revoked-offline-order"}]
            )
        self.assertFalse(
            self.env["pos.order"].search([("uuid", "=", "fu-revoked-offline-order")])
        )

    def test_lost_ack_replay_keeps_one_order_payment_and_stock_effect(self):
        if not self.pos_config_usd.current_session_id:
            self.pos_config_usd.open_ui()

        product = self.twenty_dollars_no_tax.product_variant_id
        product.product_tmpl_id.is_storable = True
        order_uuid = "fu-retail-lost-ack-0001"

        # Reuse Odoo's own UI-payload builder from the pinned 19.0 test framework.
        # CommonPosTest deliberately does not inherit TestPoSCommon, so provide the
        # four session attributes that helper documents as prerequisites and invoke
        # it unbound. This keeps the replay payload identical to a native POS payload.
        self.config = self.pos_config_usd
        self.pos_session = self.pos_config_usd.current_session_id
        self.currency = self.pos_session.currency_id
        self.pricelist = self.config.pricelist_id
        payload = TestPoSCommon.create_ui_order_data(
            self,
            [(product, 1)],
            payments=[(self.cash_payment_method, 20.0)],
            uuid=order_uuid,
        )

        first_result = self.env["pos.order"].sync_from_ui([copy.deepcopy(payload)])
        first_order = self.env["pos.order"].browse(first_result["pos.order"][0]["id"])
        self.assertEqual(first_order.uuid, order_uuid)
        self.assertEqual(len(first_order.payment_ids), 1)
        self.assertEqual(len(first_order.picking_ids), 1)
        first_moves = first_order.picking_ids.move_ids.filtered(lambda move: move.product_id == product)
        self.assertEqual(len(first_moves), 1)

        second_result = self.env["pos.order"].sync_from_ui([copy.deepcopy(payload)])
        second_order = self.env["pos.order"].browse(second_result["pos.order"][0]["id"])

        matching_orders = self.env["pos.order"].search([("uuid", "=", order_uuid)])
        self.assertEqual(second_order, first_order)
        self.assertEqual(matching_orders, first_order)
        self.assertEqual(len(first_order.payment_ids), 1)
        self.assertEqual(len(first_order.picking_ids), 1)
        replay_moves = first_order.picking_ids.move_ids.filtered(lambda move: move.product_id == product)
        self.assertEqual(len(replay_moves), 1)
