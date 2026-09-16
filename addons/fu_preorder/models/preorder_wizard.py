import uuid

from odoo import _, api, Command, fields, models
from odoo.exceptions import AccessError, ValidationError


_PREORDER_OPERATOR_GROUPS = (
    "fu_core.group_fu_cashier",
    "fu_core.group_fu_store_manager",
)
_ALLOCATION_GROUPS = (
    "fu_core.group_fu_inventory_staff",
    "fu_core.group_fu_store_manager",
)


def _allowed_stores(env):
    owner = (
        env.is_superuser()
        or env.user.has_group("fu_core.group_fu_owner_admin")
        or env.user.has_group("base.group_system")
    )
    if owner:
        return env["stock.location"].sudo().search(
            [
                ("company_id", "=", env.company.id),
                ("fu_location_role", "=", "store"),
            ],
            order="id",
        )
    return env.user.sudo().fu_stock_location_ids.filtered(
        lambda location: location.company_id == env.company
        and location.fu_location_role == "store"
    )


def _checked_preorder(env, preorder_id, groups):
    try:
        preorder_id = int(preorder_id)
    except (TypeError, ValueError):
        raise ValidationError(_("A valid Fares preorder is required."))
    reference = env["sale.order"].with_user(env.user).browse(preorder_id)
    order = reference._fu_preorder_sudo()
    reference._fu_assert_store_access(order.fu_store_location_id, groups)
    return order


def _return_preorder_action(env, order):
    return {
        "type": "ir.actions.act_window",
        "name": _("Preorder %s", order.name),
        "res_model": "sale.order",
        "res_id": order.id,
        "view_mode": "form",
        "views": [(env.ref("fu_preorder.fu_preorder_form").id, "form")],
        "target": "current",
    }


def _payment_journals(env):
    journals = env["account.journal"].sudo().search(
        [
            ("company_id", "=", env.company.id),
            ("type", "in", ["cash", "bank"]),
        ],
        order="type,name,id",
    )
    return journals.filtered(
        lambda journal: journal.type == "cash"
        or (
            journal.type == "bank"
            and journal.fu_confirmation_mode == "bank_notification"
        )
    )


class FuPreorderCreateWizard(models.TransientModel):
    _name = "fu.preorder.create.wizard"
    _description = "Fares Preorder Creation"

    partner_id = fields.Many2one(
        "res.partner",
        string="Customer",
        required=True,
    )
    commitment_date = fields.Datetime(
        string="Promised Pickup",
        required=True,
    )
    allowed_store_ids = fields.Many2many(
        "stock.location",
        string="Allowed Stores",
        compute="_compute_allowed_store_ids",
    )
    store_location_id = fields.Many2one(
        "stock.location",
        string="Collection Store",
        required=True,
        domain=[("fu_location_role", "=", "store")],
        default=lambda self: self._default_store_location(),
    )
    line_ids = fields.One2many(
        "fu.preorder.create.line",
        "wizard_id",
        string="Items",
    )

    def _default_store_location(self):
        stores = _allowed_stores(self.env)
        return stores.id if len(stores) == 1 else False

    @api.depends_context("uid", "allowed_company_ids")
    def _compute_allowed_store_ids(self):
        stores = _allowed_stores(self.env)
        for wizard in self:
            wizard.allowed_store_ids = stores

    def action_create(self):
        self.ensure_one()
        if self.store_location_id not in self.allowed_store_ids:
            raise AccessError(_("This Retail Store is outside your assigned Fares scope."))
        lines = [
            {"product_id": line.product_id.id, "quantity": line.quantity}
            for line in self.line_ids
            if line.quantity > 0
        ]
        if not lines:
            raise ValidationError(_("Add at least one product with a positive quantity."))
        order_id = self.env["sale.order"].fu_create_preorder(
            self.partner_id.id,
            self.commitment_date,
            lines,
            self.store_location_id.id,
        )
        order = self.env["sale.order"].sudo().browse(order_id)
        return _return_preorder_action(self.env, order)


class FuPreorderCreateLine(models.TransientModel):
    _name = "fu.preorder.create.line"
    _description = "Fares Preorder Creation Line"

    wizard_id = fields.Many2one(
        "fu.preorder.create.wizard",
        required=True,
        ondelete="cascade",
    )
    product_id = fields.Many2one(
        "product.product",
        string="Product",
        required=True,
        domain=[("is_storable", "=", True), ("sale_ok", "=", True)],
    )
    quantity = fields.Float(
        string="Quantity",
        required=True,
        digits="Product Unit",
        default=1.0,
    )


class FuPreorderPaymentWizard(models.TransientModel):
    _name = "fu.preorder.payment.wizard"
    _description = "Fares Preorder Payment"

    preorder_id = fields.Many2one(
        "sale.order",
        string="Preorder",
        required=True,
        readonly=True,
    )
    currency_id = fields.Many2one(
        related="preorder_id.currency_id",
        readonly=True,
    )
    balance_due = fields.Monetary(
        string="Balance Due",
        related="preorder_id.fu_balance_due",
        currency_field="currency_id",
        readonly=True,
    )
    amount = fields.Monetary(
        string="Amount",
        currency_field="currency_id",
        required=True,
        default=lambda self: self._default_amount(),
    )
    journal_key = fields.Selection(
        selection="_selection_payment_journal",
        string="Payment Method",
        required=True,
        default=lambda self: self._default_journal_key(),
    )
    requires_manual_confirmation = fields.Boolean(
        compute="_compute_requires_manual_confirmation",
    )
    manual_confirmed = fields.Boolean(
        string="I confirm the bank notification was observed",
    )
    payment_uuid = fields.Char(
        string="Payment Reference",
        required=True,
        readonly=True,
        default=lambda self: f"UI-PAY-{uuid.uuid4()}",
    )

    def _default_amount(self):
        preorder_id = self.env.context.get("default_preorder_id")
        if not preorder_id:
            return 0.0
        order = _checked_preorder(self.env, preorder_id, _PREORDER_OPERATOR_GROUPS)
        return order.fu_balance_due

    @api.model
    def _selection_payment_journal(self):
        result = []
        for journal in _payment_journals(self.env):
            if journal.type == "cash":
                label = _("Cash — %s", journal.name)
            else:
                label = _("InstaPay — %s", journal.name)
            result.append((str(journal.id), label))
        return result

    def _default_journal_key(self):
        journals = _payment_journals(self.env)
        cash = journals.filtered(lambda journal: journal.type == "cash")[:1]
        journal = cash or journals[:1]
        return str(journal.id) if journal else False

    def _selected_journal(self):
        self.ensure_one()
        try:
            journal_id = int(self.journal_key)
        except (TypeError, ValueError):
            raise ValidationError(_("Select an authorized preorder payment method."))
        journal = self.env["account.journal"].sudo().browse(journal_id).exists()
        allowed = (
            len(journal) == 1
            and journal.company_id == self.env.company
            and (
                journal.type == "cash"
                or (
                    journal.type == "bank"
                    and journal.fu_confirmation_mode == "bank_notification"
                )
            )
        )
        if not allowed:
            raise ValidationError(_("Select an authorized Cash or InstaPay journal."))
        return journal

    @api.depends("journal_key")
    def _compute_requires_manual_confirmation(self):
        for wizard in self:
            wizard.requires_manual_confirmation = False
            if not wizard.journal_key:
                continue
            try:
                journal_id = int(wizard.journal_key)
            except (TypeError, ValueError):
                continue
            journal = self.env["account.journal"].sudo().browse(journal_id).exists()
            wizard.requires_manual_confirmation = bool(
                journal
                and journal.type == "bank"
                and journal.fu_confirmation_mode == "bank_notification"
            )

    def action_record_payment(self):
        self.ensure_one()
        order = _checked_preorder(
            self.env,
            self.preorder_id.id,
            _PREORDER_OPERATOR_GROUPS,
        )
        journal = self._selected_journal()
        method = journal.inbound_payment_method_line_ids[:1]
        if not method:
            raise ValidationError(_("The selected journal has no inbound payment method."))
        order.with_user(self.env.user).fu_record_payment(
            self.amount,
            journal.id,
            method.id,
            self.payment_uuid,
            manual_confirmed=(
                bool(self.manual_confirmed)
                if journal.fu_confirmation_mode == "bank_notification"
                else False
            ),
        )
        return _return_preorder_action(self.env, order)


class FuPreorderAllocationWizard(models.TransientModel):
    _name = "fu.preorder.allocation.wizard"
    _description = "Fares Preorder Readiness Allocation"

    preorder_id = fields.Many2one(
        "sale.order",
        string="Preorder",
        required=True,
        readonly=True,
    )
    store_location_id = fields.Many2one(
        related="preorder_id.fu_store_location_id",
        string="Collection Store",
        readonly=True,
    )
    line_ids = fields.One2many(
        "fu.preorder.allocation.line",
        "wizard_id",
        string="Items",
    )

    @api.model
    def default_get(self, fields_list):
        values = super().default_get(fields_list)
        preorder_id = self.env.context.get("default_preorder_id")
        if not preorder_id or "line_ids" not in fields_list:
            return values
        order = _checked_preorder(self.env, preorder_id, _ALLOCATION_GROUPS)
        Quant = self.env["stock.quant"].sudo()
        commands = []
        for line in order.order_line.filtered(
            lambda item: not item.display_type and item.product_id
        ):
            unallocated = max(
                line.product_uom_qty - line.fu_collected_qty - line.fu_ready_qty,
                0.0,
            )
            if line.product_uom_id.is_zero(unallocated):
                continue
            free_product_qty = Quant._get_available_quantity(
                line.product_id,
                order.fu_store_location_id,
                strict=False,
            )
            free_line_qty = line.product_id.uom_id._compute_quantity(
                free_product_qty,
                line.product_uom_id,
                rounding_method="HALF-UP",
            )
            commands.append(
                Command.create(
                    {
                        "sale_line_id": line.id,
                        "ordered_qty": line.product_uom_qty,
                        "ready_qty": line.fu_ready_qty,
                        "collected_qty": line.fu_collected_qty,
                        "unallocated_qty": unallocated,
                        "available_stock_qty": max(free_line_qty, 0.0),
                    }
                )
            )
        values["line_ids"] = commands
        return values

    def action_allocate(self):
        self.ensure_one()
        order = _checked_preorder(
            self.env,
            self.preorder_id.id,
            _ALLOCATION_GROUPS,
        )
        allocations = [
            {"line_id": line.sale_line_id.id, "quantity": line.quantity}
            for line in self.line_ids
            if line.quantity > 0
        ]
        if not allocations:
            raise ValidationError(_("Enter at least one positive quantity to allocate."))
        order.with_user(self.env.user).fu_allocate_ready(allocations)
        return _return_preorder_action(self.env, order)


class FuPreorderAllocationLine(models.TransientModel):
    _name = "fu.preorder.allocation.line"
    _description = "Fares Preorder Readiness Allocation Line"

    wizard_id = fields.Many2one(
        "fu.preorder.allocation.wizard",
        required=True,
        ondelete="cascade",
    )
    sale_line_id = fields.Many2one(
        "sale.order.line",
        string="Preorder Line",
        required=True,
        readonly=True,
    )
    product_id = fields.Many2one(
        related="sale_line_id.product_id",
        string="Product",
        readonly=True,
    )
    ordered_qty = fields.Float(string="Ordered", digits="Product Unit", readonly=True)
    ready_qty = fields.Float(string="Ready", digits="Product Unit", readonly=True)
    collected_qty = fields.Float(string="Collected", digits="Product Unit", readonly=True)
    unallocated_qty = fields.Float(string="Unallocated", digits="Product Unit", readonly=True)
    available_stock_qty = fields.Float(
        string="Store Free Stock",
        digits="Product Unit",
        readonly=True,
    )
    quantity = fields.Float(
        string="Allocate Quantity",
        digits="Product Unit",
        default=0.0,
    )


class FuPreorderCollectionWizard(models.TransientModel):
    _name = "fu.preorder.collection.wizard"
    _description = "Fares Preorder Collection"

    preorder_id = fields.Many2one(
        "sale.order",
        string="Preorder",
        required=True,
        readonly=True,
    )
    currency_id = fields.Many2one(
        related="preorder_id.currency_id",
        readonly=True,
    )
    balance_due = fields.Monetary(
        string="Balance Due",
        related="preorder_id.fu_balance_due",
        currency_field="currency_id",
        readonly=True,
    )
    fully_paid = fields.Boolean(
        compute="_compute_fully_paid",
    )
    collection_uuid = fields.Char(
        string="Collection Reference",
        required=True,
        readonly=True,
        default=lambda self: f"UI-COLLECT-{uuid.uuid4()}",
    )
    line_ids = fields.One2many(
        "fu.preorder.collection.line",
        "wizard_id",
        string="Items",
    )

    @api.depends("balance_due", "currency_id")
    def _compute_fully_paid(self):
        for wizard in self:
            order = wizard.preorder_id.sudo()
            wizard.fully_paid = bool(
                order
                and order.currency_id.is_zero(order.fu_balance_due)
            )

    @api.model
    def default_get(self, fields_list):
        values = super().default_get(fields_list)
        preorder_id = self.env.context.get("default_preorder_id")
        if not preorder_id or "line_ids" not in fields_list:
            return values
        order = _checked_preorder(self.env, preorder_id, _PREORDER_OPERATOR_GROUPS)
        commands = []
        for line in order.order_line.filtered(
            lambda item: not item.display_type and item.product_id
        ):
            if line.product_uom_id.is_zero(line.fu_ready_qty):
                continue
            commands.append(
                Command.create(
                    {
                        "sale_line_id": line.id,
                        "ordered_qty": line.product_uom_qty,
                        "ready_qty": line.fu_ready_qty,
                        "collected_qty": line.fu_collected_qty,
                        "remaining_qty": line.fu_remaining_qty,
                    }
                )
            )
        values["line_ids"] = commands
        return values

    def action_collect(self):
        self.ensure_one()
        order = _checked_preorder(
            self.env,
            self.preorder_id.id,
            _PREORDER_OPERATOR_GROUPS,
        )
        collections = [
            {"line_id": line.sale_line_id.id, "quantity": line.quantity}
            for line in self.line_ids
            if line.quantity > 0
        ]
        if not collections:
            raise ValidationError(_("Enter at least one positive quantity to collect."))
        order.with_user(self.env.user).fu_collect(collections, self.collection_uuid)
        return _return_preorder_action(self.env, order)


class FuPreorderCollectionLine(models.TransientModel):
    _name = "fu.preorder.collection.line"
    _description = "Fares Preorder Collection Line"

    wizard_id = fields.Many2one(
        "fu.preorder.collection.wizard",
        required=True,
        ondelete="cascade",
    )
    sale_line_id = fields.Many2one(
        "sale.order.line",
        string="Preorder Line",
        required=True,
        readonly=True,
    )
    product_id = fields.Many2one(
        related="sale_line_id.product_id",
        string="Product",
        readonly=True,
    )
    ordered_qty = fields.Float(string="Ordered", digits="Product Unit", readonly=True)
    ready_qty = fields.Float(string="Ready", digits="Product Unit", readonly=True)
    collected_qty = fields.Float(string="Collected", digits="Product Unit", readonly=True)
    remaining_qty = fields.Float(string="Remaining", digits="Product Unit", readonly=True)
    quantity = fields.Float(
        string="Collect Quantity",
        digits="Product Unit",
        default=0.0,
    )
