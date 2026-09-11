from collections import defaultdict
from datetime import timedelta

from odoo import _, api, Command, fields, models
from odoo.exceptions import AccessError, ValidationError


_PRODUCTION_GROUPS = (
    "fu_core.group_fu_owner_admin",
    "fu_core.group_fu_production_manager",
)


class FuProductionConfig(models.Model):
    _name = "fu.production.config"
    _description = "Fares production trigger configuration"
    _order = "company_id"

    company_id = fields.Many2one(
        "res.company",
        required=True,
        default=lambda self: self.env.company,
        ondelete="cascade",
        index=True,
    )
    quantity_threshold = fields.Float(
        string="Quantity trigger",
        digits="Product Unit",
        default=0.0,
        help="Zero means no quantity trigger is configured. Deadline triggering remains active.",
    )
    lead_time_days = fields.Integer(
        string="Pickup lead time (days)",
        required=True,
        default=7,
    )
    last_configured_by_id = fields.Many2one(
        "res.users",
        string="Last configured by",
        readonly=True,
        copy=False,
    )
    last_configured_at = fields.Datetime(
        string="Last configured at",
        readonly=True,
        copy=False,
    )

    _company_unique = models.Constraint(
        "unique(company_id)",
        "Only one Fares production configuration may exist per company.",
    )
    _quantity_nonnegative = models.Constraint(
        "CHECK(quantity_threshold >= 0)",
        "Production quantity threshold cannot be negative.",
    )
    _lead_positive = models.Constraint(
        "CHECK(lead_time_days > 0)",
        "Production pickup lead time must be at least one day.",
    )

    def _fu_assert_operator(self):
        if self.env.su:
            return
        if not any(self.env.user.has_group(group) for group in _PRODUCTION_GROUPS):
            raise AccessError(_("Your Fares role cannot change production settings."))

    @api.model_create_multi
    def create(self, vals_list):
        self._fu_assert_operator()
        now = fields.Datetime.now()
        actor_id = self.env.user.id
        prepared = []
        for vals in vals_list:
            values = dict(vals)
            values["last_configured_by_id"] = actor_id
            values["last_configured_at"] = now
            prepared.append(values)
        return super().create(prepared)

    def write(self, vals):
        self._fu_assert_operator()
        protected = {"last_configured_by_id", "last_configured_at"}
        if not self.env.su and protected.intersection(vals):
            raise AccessError(_("Production configuration audit fields are system controlled."))
        values = dict(vals)
        values["last_configured_by_id"] = self.env.user.id
        values["last_configured_at"] = fields.Datetime.now()
        return super().write(values)

    def unlink(self):
        raise AccessError(_("Production configuration is retained for auditability."))

    @api.model
    def _fu_get_or_create(self, company):
        config = self.sudo().search([("company_id", "=", company.id)], limit=1)
        if not config:
            config = self.sudo().create(
                {
                    "company_id": company.id,
                    "quantity_threshold": 0.0,
                    "lead_time_days": 7,
                }
            )
        return config

    def action_evaluate_demand(self):
        self.ensure_one()
        self._fu_assert_operator()
        task_ids = self.env["fu.production.task"].fu_evaluate_demand(
            company_id=self.company_id.id
        )
        return {
            "type": "ir.actions.client",
            "tag": "display_notification",
            "params": {
                "title": _("Production queue evaluated"),
                "message": _("%s production task(s) created.", len(task_ids)),
                "type": "success",
                "sticky": False,
            },
        }


class FuProductionTask(models.Model):
    _name = "fu.production.task"
    _description = "Fares preorder production task"
    _order = "state, earliest_commitment_date, id"

    name = fields.Char(
        string="Task",
        required=True,
        readonly=True,
        copy=False,
        default=lambda self: _("New"),
        index=True,
    )
    company_id = fields.Many2one(
        "res.company",
        required=True,
        default=lambda self: self.env.company,
        ondelete="restrict",
        index=True,
    )
    product_id = fields.Many2one(
        "product.product",
        string="Product / size",
        required=True,
        readonly=True,
        ondelete="restrict",
        check_company=True,
        index=True,
    )
    quantity = fields.Float(
        string="Production quantity",
        digits="Product Unit",
        compute="_compute_quantity",
        store=True,
    )
    earliest_commitment_date = fields.Datetime(
        string="Earliest pickup",
        required=True,
        readonly=True,
        copy=False,
        index=True,
    )
    trigger_reason = fields.Selection(
        [
            ("quantity", "Quantity threshold"),
            ("deadline", "Pickup deadline"),
            ("quantity_deadline", "Quantity + deadline"),
        ],
        required=True,
        readonly=True,
        copy=False,
        index=True,
    )
    state = fields.Selection(
        [
            ("queued", "Queued"),
            ("in_production", "In production"),
            ("finished", "Finished"),
            ("cancelled", "Cancelled"),
        ],
        required=True,
        readonly=True,
        default="queued",
        copy=False,
        index=True,
    )
    line_ids = fields.One2many(
        "fu.production.task.line",
        "task_id",
        string="Source preorder demand",
        readonly=True,
        copy=False,
    )
    queued_by_id = fields.Many2one("res.users", string="Queued by", readonly=True, copy=False)
    queued_at = fields.Datetime(string="Queued at", readonly=True, copy=False)
    started_by_id = fields.Many2one("res.users", string="Started by", readonly=True, copy=False)
    started_at = fields.Datetime(string="Started at", readonly=True, copy=False)
    finished_by_id = fields.Many2one("res.users", string="Finished by", readonly=True, copy=False)
    finished_at = fields.Datetime(string="Finished at", readonly=True, copy=False)
    cancelled_by_id = fields.Many2one("res.users", string="Cancelled by", readonly=True, copy=False)
    cancelled_at = fields.Datetime(string="Cancelled at", readonly=True, copy=False)
    cancel_reason = fields.Char(string="Cancellation reason", copy=False)

    _name_unique = models.Constraint(
        "unique(name)",
        "Production task reference must be unique.",
    )

    @api.depends("line_ids.quantity", "line_ids.preorder_line_id.product_uom_id")
    def _compute_quantity(self):
        for task in self:
            total = 0.0
            for line in task.line_ids:
                source = line.preorder_line_id
                total += source.product_uom_id._compute_quantity(
                    line.quantity,
                    task.product_id.uom_id,
                    rounding_method="HALF-UP",
                )
            task.quantity = total

    def _fu_assert_operator(self):
        if not any(self.env.user.has_group(group) for group in _PRODUCTION_GROUPS):
            raise AccessError(_("Your Fares role cannot perform this production operation."))

    @api.model_create_multi
    def create(self, vals_list):
        if not self.env.su:
            raise AccessError(_("Production tasks may only be created by the Fares demand evaluator."))
        prepared = []
        sequence = self.env["ir.sequence"]
        for vals in vals_list:
            values = dict(vals)
            if not values.get("name") or values.get("name") == _("New"):
                values["name"] = sequence.next_by_code("fu.production.task") or _("New")
            prepared.append(values)
        return super().create(prepared)

    def write(self, vals):
        if self.env.su:
            return super().write(vals)
        self._fu_assert_operator()
        if vals and set(vals) <= {"cancel_reason"} and all(task.state == "queued" for task in self):
            return super().write(vals)
        raise AccessError(_("Production task fields are controlled by the production workflow."))

    def unlink(self):
        raise AccessError(_("Production tasks are retained for auditability."))

    def action_start(self):
        self._fu_assert_operator()
        actor_id = self.env.user.id
        now = fields.Datetime.now()
        for task in self:
            if task.state == "in_production":
                continue
            if task.state != "queued":
                raise ValidationError(_("Only queued production tasks can be started."))
            task.sudo().write(
                {
                    "state": "in_production",
                    "started_by_id": actor_id,
                    "started_at": now,
                }
            )
        return True

    def action_finish(self):
        self._fu_assert_operator()
        actor_id = self.env.user.id
        now = fields.Datetime.now()
        for task in self:
            if task.state == "finished":
                continue
            if task.state != "in_production":
                raise ValidationError(_("Only in-production tasks can be marked Finished."))
            task.sudo().write(
                {
                    "state": "finished",
                    "finished_by_id": actor_id,
                    "finished_at": now,
                }
            )
        return True

    def action_cancel(self):
        self._fu_assert_operator()
        actor_id = self.env.user.id
        now = fields.Datetime.now()
        for task in self:
            if task.state == "cancelled":
                continue
            if task.state != "queued":
                raise ValidationError(_("Only queued production tasks can be cancelled."))
            reason = (task.cancel_reason or "").strip()
            if not reason:
                raise ValidationError(_("Record a cancellation reason before cancelling the queued task."))
            task.sudo().write(
                {
                    "state": "cancelled",
                    "cancel_reason": reason,
                    "cancelled_by_id": actor_id,
                    "cancelled_at": now,
                }
            )
        return True

    @api.model
    def fu_evaluate_demand(self, company_id=None, as_of=None):
        self._fu_assert_operator()
        company = self.env["res.company"].browse(company_id or self.env.company.id).exists()
        if len(company) != 1:
            raise ValidationError(_("A valid company is required to evaluate production demand."))
        return self.sudo()._fu_evaluate_company(
            company,
            as_of=as_of,
            actor_id=self.env.user.id,
        )

    @api.model
    def _fu_evaluate_company(self, company, as_of=None, actor_id=None):
        company = company.sudo().exists()
        if len(company) != 1:
            return []
        evaluation_time = fields.Datetime.to_datetime(as_of) if as_of else fields.Datetime.now()
        actor_id = actor_id or self.env.user.id
        config = self.env["fu.production.config"]._fu_get_or_create(company)

        self.env.cr.execute(
            "SELECT pg_advisory_xact_lock(hashtext(%s), %s)",
            ["fu_production_evaluate", company.id],
        )

        source_lines = self.env["sale.order.line"].sudo().search(
            [
                ("order_id.company_id", "=", company.id),
                ("order_id.fu_is_preorder", "=", True),
                ("display_type", "=", False),
                ("product_id", "!=", False),
            ],
            order="product_id, id",
        ).filtered(lambda line: line.product_id.is_storable and line.product_id.sale_ok)
        if not source_lines:
            return []

        for line_id in source_lines.ids:
            self.env.cr.execute(
                "SELECT id FROM sale_order_line WHERE id = %s FOR UPDATE",
                [line_id],
            )
        source_lines.invalidate_recordset(["fu_ready_qty", "fu_collected_qty"])

        existing_coverage = defaultdict(float)
        coverage_lines = self.env["fu.production.task.line"].sudo().search(
            [
                ("preorder_line_id", "in", source_lines.ids),
                ("task_id.state", "!=", "cancelled"),
            ]
        )
        for coverage in coverage_lines:
            existing_coverage[coverage.preorder_line_id.id] += coverage.quantity

        uncovered_by_product = defaultdict(list)
        for line in source_lines:
            uncovered = max(
                line.product_uom_qty
                - line.fu_collected_qty
                - line.fu_ready_qty
                - existing_coverage[line.id],
                0.0,
            )
            if line.product_uom_id.compare(uncovered, 0.0) <= 0:
                continue
            uncovered_by_product[line.product_id].append((line, uncovered))

        created = self.browse()
        horizon = evaluation_time + timedelta(days=config.lead_time_days)
        threshold = config.quantity_threshold
        for product in sorted(uncovered_by_product, key=lambda record: record.id):
            entries = uncovered_by_product[product]
            aggregate_product_qty = sum(
                line.product_uom_id._compute_quantity(
                    uncovered,
                    product.uom_id,
                    rounding_method="HALF-UP",
                )
                for line, uncovered in entries
            )
            quantity_trigger = bool(
                threshold > 0
                and product.uom_id.compare(aggregate_product_qty, threshold) >= 0
            )
            deadline_trigger = any(
                line.order_id.commitment_date
                and line.order_id.commitment_date <= horizon
                for line, _uncovered in entries
            )
            if not quantity_trigger and not deadline_trigger:
                continue

            if quantity_trigger and deadline_trigger:
                trigger_reason = "quantity_deadline"
            elif quantity_trigger:
                trigger_reason = "quantity"
            else:
                trigger_reason = "deadline"

            commitment_dates = [
                line.order_id.commitment_date
                for line, _uncovered in entries
                if line.order_id.commitment_date
            ]
            if not commitment_dates:
                continue
            task = self.sudo().create(
                {
                    "company_id": company.id,
                    "product_id": product.id,
                    "earliest_commitment_date": min(commitment_dates),
                    "trigger_reason": trigger_reason,
                    "queued_by_id": actor_id,
                    "queued_at": evaluation_time,
                    "line_ids": [
                        Command.create(
                            {
                                "preorder_line_id": line.id,
                                "quantity": uncovered,
                            }
                        )
                        for line, uncovered in entries
                    ],
                }
            )
            created |= task
        return created.ids

    @api.model
    def _cron_evaluate_demand(self):
        actor_id = self.env.user.id
        for company in self.env["res.company"].sudo().search([]):
            self.sudo()._fu_evaluate_company(company, actor_id=actor_id)
        return True


class FuProductionTaskLine(models.Model):
    _name = "fu.production.task.line"
    _description = "Fares production task source demand"
    _order = "task_id, id"

    task_id = fields.Many2one(
        "fu.production.task",
        required=True,
        ondelete="cascade",
        index=True,
    )
    preorder_line_id = fields.Many2one(
        "sale.order.line",
        string="Preorder line",
        required=True,
        ondelete="restrict",
        index=True,
    )
    preorder_id = fields.Many2one(
        "sale.order",
        related="preorder_line_id.order_id",
        string="Preorder",
        store=True,
        readonly=True,
    )
    preorder_reference = fields.Char(
        related="preorder_line_id.order_id.name",
        string="Preorder reference",
        store=True,
        readonly=True,
    )
    product_id = fields.Many2one(
        "product.product",
        related="preorder_line_id.product_id",
        string="Product / size",
        store=True,
        readonly=True,
    )
    commitment_date = fields.Datetime(
        related="preorder_line_id.order_id.commitment_date",
        string="Pickup date",
        store=True,
        readonly=True,
    )
    quantity = fields.Float(
        string="Covered quantity",
        required=True,
        digits="Product Unit",
    )

    _quantity_positive = models.Constraint(
        "CHECK(quantity > 0)",
        "Production task source quantity must be positive.",
    )

    @api.constrains("task_id", "preorder_line_id", "quantity")
    def _check_source(self):
        for line in self:
            source = line.preorder_line_id
            if not source.order_id.fu_is_preorder:
                raise ValidationError(_("Production task lines must reference a Fares preorder."))
            if source.order_id.company_id != line.task_id.company_id:
                raise ValidationError(_("Production task and preorder must belong to the same company."))
            if source.product_id != line.task_id.product_id:
                raise ValidationError(_("Production task and preorder line must use the same product variant."))
            if source.product_uom_id.compare(line.quantity, source.product_uom_qty) > 0:
                raise ValidationError(_("Production task source quantity cannot exceed the preorder line quantity."))

            other_coverage = sum(
                self.sudo().search(
                    [
                        ("preorder_line_id", "=", source.id),
                        ("id", "!=", line.id),
                        ("task_id.state", "!=", "cancelled"),
                    ]
                ).mapped("quantity")
            )
            available_for_production = max(
                source.product_uom_qty - source.fu_ready_qty - source.fu_collected_qty,
                0.0,
            )
            if source.product_uom_id.compare(
                other_coverage + line.quantity,
                available_for_production,
            ) > 0:
                raise ValidationError(
                    _("Production task coverage cannot exceed the preorder line's uncovered production demand.")
                )

    @api.model_create_multi
    def create(self, vals_list):
        if not self.env.su:
            raise AccessError(_("Production task source lines are system controlled."))
        return super().create(vals_list)

    def write(self, vals):
        if not self.env.su:
            raise AccessError(_("Production task source lines are system controlled."))
        return super().write(vals)

    def unlink(self):
        if not self.env.su:
            raise AccessError(_("Production task source lines are retained with their task."))
        return super().unlink()


class SaleOrder(models.Model):
    _inherit = "sale.order"

    @api.model
    def fu_create_preorder(self, partner_id, commitment_date, lines, store_location_id):
        order_id = super().fu_create_preorder(
            partner_id,
            commitment_date,
            lines,
            store_location_id,
        )
        order = self.sudo().browse(order_id)
        self.env["fu.production.task"].sudo()._fu_evaluate_company(
            order.company_id,
            actor_id=self.env.user.id,
        )
        return order_id
