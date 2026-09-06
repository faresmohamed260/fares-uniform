from datetime import date, timedelta
from odoo.tests import TransactionCase, tagged
from odoo.exceptions import ValidationError


@tagged("post_install", "-at_install")
class TestFactoryRules(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.today = date(2026, 9, 6)
        size = cls.env["product.attribute"].create({"name": "Proof size"})
        values = cls.env["product.attribute.value"].create([
            {"name": "S", "attribute_id": size.id},
            {"name": "M", "attribute_id": size.id},
        ])
        cls.template = cls.env["product.template"].create({
            "name": "Synthetic school polo",
            "attribute_line_ids": [(0, 0, {"attribute_id": size.id, "value_ids": [(6, 0, values.ids)]})],
        })
        cls.small, cls.medium = cls.template.product_variant_ids.sorted("id")
        cls.lines = cls.env["fu.proof.line"]

    def demand(self, product, quantity, days=20):
        order = self.env["fu.proof.order"].create({"name": "Synthetic receipt", "amount_due": 100})
        return self.lines.create({
            "order_id": order.id, "product_id": product.id,
            "quantity": quantity, "pickup_date": self.today + timedelta(days=days),
        })

    def test_size_threshold_and_repeat(self):
        small = self.demand(self.small, 3)
        medium = self.demand(self.medium, 3)
        self.assertFalse(self.lines.make_tasks(5, today=self.today))
        extra = self.demand(self.small, 2)
        tasks = self.lines.make_tasks(5, today=self.today)
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks.state, "queued")
        self.assertEqual(small.task_id, extra.task_id)
        self.assertFalse(medium.task_id)
        self.assertFalse(self.lines.make_tasks(5, today=self.today))

    def test_deadline_and_configuration(self):
        line = self.demand(self.small, 1, days=7)
        self.assertFalse(self.lines.make_tasks(10, lead_days=6, today=self.today))
        self.assertEqual(len(self.lines.make_tasks(10, lead_days=7, today=self.today)), 1)
        self.assertEqual(line.task_id.state, "queued")

    def test_collection_balance_and_partial(self):
        line = self.demand(self.small, 3, days=0)
        task = self.lines.make_tasks(10, today=self.today)
        line.order_id.amount_paid = 20
        with self.assertRaises(ValidationError):
            line.collect(1)
        task.advance()
        self.assertEqual(task.state, "production")
        task.advance()
        self.assertEqual(task.state, "finished")
        line.order_id.amount_paid = 100
        with self.assertRaises(ValidationError):
            line.collect(1)
        task.advance()
        line.collect(1)
        self.assertEqual(line.collected, 1)
        self.assertEqual(line.quantity - line.collected, 2)
        with self.assertRaises(ValidationError), self.env.cr.savepoint():
            line.collect(3)

    def test_unauthorized_user(self):
        user = self.env["res.users"].create({"name": "Synthetic reader", "login": "proof_reader", "group_ids": [(6, 0, [self.env.ref("base.group_user").id])]})
        from odoo.exceptions import AccessError
        with self.assertRaises(AccessError):
            self.env["fu.proof.order"].with_user(user).create({"name": "Blocked", "amount_due": 100})
