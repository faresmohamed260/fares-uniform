from odoo.addons.point_of_sale.tests.common import CommonPosTest
from odoo.exceptions import ValidationError
from odoo.tests import tagged


@tagged("post_install", "-at_install")
class TestRetailPaymentConfirmation(CommonPosTest):
    def setUp(self):
        super().setUp()
        self.bank_payment_method.write(
            {"name": "InstaPay", "fu_confirmation_mode": "bank_notification"}
        )
        self.order = self.create_backend_pos_order(
            {
                "line_data": [
                    {
                        "product_id": self.ten_dollars_no_tax.product_variant_id.id,
                        "qty": 1,
                    }
                ]
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
