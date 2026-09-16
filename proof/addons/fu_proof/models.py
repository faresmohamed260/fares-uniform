from datetime import timedelta
from odoo import api, fields, models
from odoo.exceptions import ValidationError


class ProofOrder(models.Model):
    _name = "fu.proof.order"
    _description = "Synthetic preorder — NOT a financial ledger"

    name = fields.Char(required=True)
    amount_due = fields.Float(required=True)
    amount_paid = fields.Float()
    line_ids = fields.One2many("fu.proof.line", "order_id")

    @api.constrains("amount_due", "amount_paid")
    def _check_amounts(self):
        for record in self:
            if record.amount_due < 0 or record.amount_paid < 0:
                raise ValidationError("Amounts must be non-negative.")


class ProofLine(models.Model):
    _name = "fu.proof.line"
    _description = "Synthetic variant demand"

    order_id = fields.Many2one("fu.proof.order", required=True, ondelete="cascade")
    product_id = fields.Many2one("product.product", required=True)
    quantity = fields.Integer(required=True, default=1)
    collected = fields.Integer(default=0)
    pickup_date = fields.Date(required=True)
    task_id = fields.Many2one("fu.proof.task", ondelete="restrict")

    @api.constrains("quantity", "collected")
    def _check_quantities(self):
        for line in self:
            if line.quantity <= 0 or not 0 <= line.collected <= line.quantity:
                raise ValidationError("Invalid ordered or collected quantity.")

    def collect(self, quantity):
        self.ensure_one()
        if self.order_id.amount_paid < self.order_id.amount_due:
            raise ValidationError("Settle the full order balance before any collection.")
        if self.task_id.state != "ready":
            raise ValidationError("Items have not reached the store.")
        if not isinstance(quantity, int) or quantity <= 0:
            raise ValidationError("Collection must be positive whole pieces.")
        self.collected += quantity

    @api.model
    def make_tasks(self, threshold, lead_days=7, today=None):
        if threshold < 1 or lead_days < 0:
            raise ValidationError("Invalid production settings.")
        today = today or fields.Date.today()
        # Serializes this disposable proof's task creation. Production needs a
        # bounded per-company design and stock/order allocation integration.
        self.env.cr.execute("SELECT pg_advisory_xact_lock(706202609)")
        lines = self.search([("task_id", "=", False)])
        tasks = self.env["fu.proof.task"]
        for product in lines.product_id:
            demand = lines.filtered(lambda line: line.product_id == product)
            due = min(demand.mapped("pickup_date")) <= today + timedelta(days=lead_days)
            if sum(demand.mapped("quantity")) >= threshold or due:
                task = tasks.create({"product_id": product.id})
                demand.write({"task_id": task.id})
                tasks |= task
        return tasks


class ProofTask(models.Model):
    _name = "fu.proof.task"
    _description = "Synthetic production task"
    _rec_name = "product_id"

    product_id = fields.Many2one("product.product", required=True)
    state = fields.Selection([
        ("queued", "Queued"), ("production", "In production"),
        ("finished", "Finished"), ("ready", "Ready for collection"),
    ], required=True, default="queued")
    line_ids = fields.One2many("fu.proof.line", "task_id")

    def advance(self):
        transitions = {"queued": "production", "production": "finished", "finished": "ready"}
        for task in self:
            if task.state not in transitions:
                raise ValidationError("Task is already ready.")
            task.state = transitions[task.state]
