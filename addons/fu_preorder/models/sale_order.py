from collections import defaultdict

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


class SaleOrder(models.Model):
    _inherit = "sale.order"

    fu_is_preorder = fields.Boolean(
        string="Fares preorder",
        copy=False,
        index=True,
    )
    fu_store_location_id = fields.Many2one(
        "stock.location",
        string="Fares collection store",
        copy=False,
        domain=[("fu_location_role", "=", "store")],
        check_company=True,
    )
    fu_preorder_payment_ids = fields.One2many(
        "account.payment",
        "fu_preorder_id",
        string="Fares preorder payments",
        readonly=True,
    )
    fu_preorder_picking_ids = fields.One2many(
        "stock.picking",
        "fu_preorder_id",
        string="Fares preorder collection transfers",
        readonly=True,
    )
    fu_amount_paid = fields.Monetary(
        string="Fares amount paid",
        currency_field="currency_id",
        compute="_compute_fu_preorder_financials",
    )
    fu_balance_due = fields.Monetary(
        string="Fares balance due",
        currency_field="currency_id",
        compute="_compute_fu_preorder_financials",
    )
    fu_payment_state = fields.Selection(
        [("balance_due", "Balance due"), ("paid", "Fully paid")],
        string="Fares payment state",
        compute="_compute_fu_preorder_financials",
    )
    fu_collection_state = fields.Selection(
        [
            ("awaiting_ready", "Awaiting readiness"),
            ("partially_ready", "Partially ready"),
            ("ready", "Ready for collection"),
            ("partially_collected", "Partially collected"),
            ("collected", "Fully collected"),
        ],
        string="Fares collection state",
        compute="_compute_fu_collection_state",
    )

    def _fu_assert_store_access(self, store, allowed_groups):
        user = self.env.user
        if user.has_group("fu_core.group_fu_owner_admin"):
            return
        if not any(user.has_group(group) for group in allowed_groups):
            raise AccessError(_("Your current Fares role cannot perform this preorder operation."))
        if store not in user.sudo().fu_stock_location_ids:
            raise AccessError(_("This preorder is outside your assigned Fares store scope."))

    def _fu_preorder_sudo(self):
        self.ensure_one()
        order = self.sudo().exists()
        if not order or not order.fu_is_preorder:
            raise ValidationError(_("This operation requires a Fares preorder."))
        if not order.fu_store_location_id or order.fu_store_location_id.fu_location_role != "store":
            raise ValidationError(_("A Fares preorder requires one Retail Store collection location."))
        return order

    @api.model
    def fu_create_preorder(self, partner_id, commitment_date, lines, store_location_id):
        store = self.env["stock.location"].sudo().browse(store_location_id).exists()
        if len(store) != 1 or store.fu_location_role != "store":
            raise ValidationError(_("Preorders must be assigned to the Fares Retail Store."))
        self._fu_assert_store_access(store, _PREORDER_OPERATOR_GROUPS)

        partner = self.env["res.partner"].sudo().browse(partner_id).exists()
        if len(partner) != 1:
            raise ValidationError(_("A valid preorder customer is required."))
        promised = fields.Datetime.to_datetime(commitment_date)
        if not promised:
            raise ValidationError(_("A promised pickup date is required."))
        if not isinstance(lines, (list, tuple)) or not lines:
            raise ValidationError(_("A preorder requires at least one product line."))

        line_commands = []
        for item in lines:
            try:
                product_id = int(item["product_id"])
                quantity = float(item["quantity"])
            except (KeyError, TypeError, ValueError):
                raise ValidationError(_("Each preorder line requires a product and positive quantity."))
            product = self.env["product.product"].sudo().browse(product_id).exists()
            if len(product) != 1 or not product.sale_ok or not product.is_storable:
                raise ValidationError(_("Preorders may contain only sellable finished-stock variants."))
            if product.uom_id.compare(quantity, 0.0) <= 0:
                raise ValidationError(_("Preorder quantities must be positive."))
            line_commands.append(
                Command.create(
                    {
                        "product_id": product.id,
                        "product_uom_qty": quantity,
                    }
                )
            )

        order = self.sudo().create(
            {
                "partner_id": partner.id,
                "commitment_date": promised,
                "fu_is_preorder": True,
                "fu_store_location_id": store.id,
                "user_id": self.env.user.id,
                "order_line": line_commands,
            }
        )
        # P2B-04: preorder acceptance must not confirm Sales or launch stock rules.
        if order.state != "draft" or order.picking_ids:
            raise ValidationError(_("Preorder creation must not reserve or release stock."))
        return order.id

    def _fu_valid_payments(self):
        self.ensure_one()
        return self.sudo().fu_preorder_payment_ids.filtered(
            lambda payment: payment.move_id.state == "posted"
            and payment.state not in ("canceled", "rejected")
        )

    def _fu_live_paid_amount(self):
        self.ensure_one()
        order = self.sudo()
        total = 0.0
        for payment in order._fu_valid_payments():
            total += payment.currency_id._convert(
                payment.amount,
                order.currency_id,
                order.company_id,
                payment.date or fields.Date.context_today(order),
            )
        return total

    def _fu_live_balance_due(self):
        self.ensure_one()
        order = self.sudo()
        return max(order.amount_total - order._fu_live_paid_amount(), 0.0)

    @api.depends(
        "amount_total",
        "fu_preorder_payment_ids.amount",
        "fu_preorder_payment_ids.state",
        "fu_preorder_payment_ids.move_id.state",
    )
    def _compute_fu_preorder_financials(self):
        for order in self:
            if not order.fu_is_preorder:
                order.fu_amount_paid = 0.0
                order.fu_balance_due = 0.0
                order.fu_payment_state = False
                continue
            paid = order._fu_live_paid_amount()
            balance = max(order.amount_total - paid, 0.0)
            order.fu_amount_paid = paid
            order.fu_balance_due = balance
            order.fu_payment_state = "paid" if order.currency_id.is_zero(balance) else "balance_due"

    def fu_record_payment(
        self,
        amount,
        journal_id,
        payment_method_line_id,
        payment_uuid,
        manual_confirmed=False,
    ):
        order = self._fu_preorder_sudo()
        self._fu_assert_store_access(order.fu_store_location_id, _PREORDER_OPERATOR_GROUPS)
        try:
            amount = float(amount)
        except (TypeError, ValueError):
            raise ValidationError(_("A valid preorder payment amount is required."))
        payment_uuid = str(payment_uuid or "").strip()
        if not payment_uuid:
            raise ValidationError(_("A stable preorder payment UUID is required."))

        # Serialize payment decisions for this preorder so concurrent retries cannot overpay it.
        self.env.cr.execute("SELECT id FROM sale_order WHERE id = %s FOR UPDATE", [order.id])

        Payment = self.env["account.payment"].sudo()
        existing = Payment.search([("fu_preorder_payment_uuid", "=", payment_uuid)], limit=1)
        if existing:
            same_payload = (
                existing.fu_preorder_id == order
                and existing.journal_id.id == int(journal_id)
                and existing.payment_method_line_id.id == int(payment_method_line_id)
                and order.currency_id.compare_amounts(existing.amount, amount) == 0
                and existing.fu_manual_confirmed == bool(manual_confirmed)
            )
            if not same_payload:
                raise ValidationError(_("This preorder payment UUID was already used with different data."))
            return existing.id

        if order.currency_id.compare_amounts(amount, 0.0) <= 0:
            raise ValidationError(_("A preorder payment amount must be positive."))
        balance = order._fu_live_balance_due()
        if order.currency_id.compare_amounts(amount, balance) > 0:
            raise ValidationError(_("A preorder payment cannot exceed the remaining balance."))

        journal = self.env["account.journal"].sudo().browse(journal_id).exists()
        method_line = self.env["account.payment.method.line"].sudo().browse(
            payment_method_line_id
        ).exists()
        if len(journal) != 1 or journal.company_id != order.company_id or journal.type not in (
            "cash",
            "bank",
        ):
            raise ValidationError(_("Use an authorized Cash or bank journal for preorder payment."))
        if len(method_line) != 1 or method_line not in journal.inbound_payment_method_line_ids:
            raise ValidationError(_("The selected inbound payment method does not belong to this journal."))
        journal_currency = journal.currency_id or journal.company_id.currency_id
        if journal_currency != order.currency_id:
            raise ValidationError(_("The preorder and payment journal must use the same currency."))
        if journal.fu_confirmation_mode == "bank_notification" and not manual_confirmed:
            raise ValidationError(
                _("This preorder payment requires staff confirmation of the bank notification.")
            )

        payment = Payment.create(
            {
                "payment_type": "inbound",
                "partner_type": "customer",
                "partner_id": order.partner_id.id,
                "amount": amount,
                "currency_id": order.currency_id.id,
                "journal_id": journal.id,
                "payment_method_line_id": method_line.id,
                "memo": _("Preorder %s", order.name),
                "fu_preorder_id": order.id,
                "fu_preorder_payment_uuid": payment_uuid,
                "fu_manual_confirmed": bool(manual_confirmed),
                "fu_recorded_by_user_id": self.env.user.id,
            }
        )
        payment.action_post()
        order.invalidate_recordset(["fu_preorder_payment_ids"])
        return payment.id

    @api.model
    def _fu_normalize_line_quantities(self, values, label):
        if not isinstance(values, (list, tuple)) or not values:
            raise ValidationError(_("At least one %s quantity is required.", label))
        result = defaultdict(float)
        for item in values:
            try:
                line_id = int(item["line_id"])
                quantity = float(item["quantity"])
            except (KeyError, TypeError, ValueError):
                raise ValidationError(_("Each %s entry requires a line and positive quantity.", label))
            if quantity <= 0:
                raise ValidationError(_("%s quantities must be positive.", label.capitalize()))
            result[line_id] += quantity
        return dict(result)

    def _fu_active_reservation_picking(self):
        self.ensure_one()
        pickings = self.env["stock.picking"].sudo().search(
            [
                ("fu_preorder_id", "=", self.id),
                ("state", "not in", ["done", "cancel"]),
            ],
            order="id",
        )
        if len(pickings) > 1:
            raise ValidationError(_("A preorder must have at most one active collection reservation."))
        return pickings

    def fu_allocate_ready(self, allocations):
        order = self._fu_preorder_sudo()
        self._fu_assert_store_access(order.fu_store_location_id, _ALLOCATION_GROUPS)
        requested = self._fu_normalize_line_quantities(allocations, "allocation")
        self.env.cr.execute("SELECT id FROM sale_order WHERE id = %s FOR UPDATE", [order.id])

        lines = order.order_line.filtered(lambda line: not line.display_type and line.product_id)
        line_by_id = {line.id: line for line in lines}
        store = order.fu_store_location_id
        Quant = self.env["stock.quant"].sudo()

        for line_id, quantity in requested.items():
            line = line_by_id.get(line_id)
            if not line:
                raise ValidationError(_("Allocation lines must belong to this preorder."))
            unallocated = max(line.product_uom_qty - line.fu_collected_qty - line.fu_ready_qty, 0.0)
            if line.product_uom_id.compare(quantity, unallocated) > 0:
                raise ValidationError(_("Allocation cannot exceed the preorder line's unallocated quantity."))
            free_product_qty = Quant._get_available_quantity(line.product_id, store, strict=False)
            free_line_qty = line.product_id.uom_id._compute_quantity(
                free_product_qty,
                line.product_uom_id,
                rounding_method="HALF-UP",
            )
            if line.product_uom_id.compare(quantity, free_line_qty) > 0:
                raise ValidationError(_("Only stock physically available at the Retail Store may be allocated."))

        picking = order._fu_active_reservation_picking()
        if not picking:
            warehouse = self.env["stock.warehouse"].sudo().search(
                [
                    ("company_id", "=", order.company_id.id),
                    ("lot_stock_id", "=", store.id),
                ],
                limit=1,
            )
            if not warehouse or not warehouse.out_type_id:
                raise ValidationError(_("The Retail Store requires a native outgoing operation type."))
            picking = self.env["stock.picking"].sudo().create(
                {
                    "picking_type_id": warehouse.out_type_id.id,
                    "location_id": store.id,
                    "location_dest_id": order.partner_id.property_stock_customer.id,
                    "partner_id": order.partner_id.id,
                    "origin": order.name,
                    "fu_preorder_id": order.id,
                }
            )

        new_moves = self.env["stock.move"].sudo()
        for line_id, quantity in requested.items():
            line = line_by_id[line_id]
            new_moves |= self.env["stock.move"].sudo().create(
                {
                    "name": line.name,
                    "product_id": line.product_id.id,
                    "product_uom_qty": quantity,
                    "product_uom": line.product_uom_id.id,
                    "location_id": store.id,
                    "location_dest_id": picking.location_dest_id.id,
                    "picking_id": picking.id,
                    "company_id": order.company_id.id,
                    "partner_id": order.partner_id.id,
                    "origin": order.name,
                    "fu_preorder_line_id": line.id,
                }
            )

        picking.action_confirm()
        picking.action_assign()
        for move in new_moves:
            if move.product_uom.compare(move.quantity, move.product_uom_qty) != 0:
                raise ValidationError(_("Store availability changed before allocation; retry the allocation."))
        order.invalidate_recordset(["fu_preorder_picking_ids"])
        lines.invalidate_recordset(["fu_ready_qty", "fu_collected_qty", "fu_remaining_qty"])
        return picking.id

    def _fu_done_collection_payload(self, picking):
        payload = defaultdict(float)
        for move in picking.move_ids.filtered(
            lambda move: move.state == "done" and move.fu_preorder_line_id
        ):
            line = move.fu_preorder_line_id
            payload[line.id] += move.product_uom._compute_quantity(
                move.quantity,
                line.product_uom_id,
                rounding_method="HALF-UP",
            )
        return dict(payload)

    def _fu_assert_same_collection_payload(self, expected, actual):
        line_by_id = {line.id: line for line in self.sudo().order_line}
        if set(expected) != set(actual):
            raise ValidationError(_("This collection UUID was already used with different lines."))
        for line_id, quantity in expected.items():
            line = line_by_id.get(line_id)
            if not line or line.product_uom_id.compare(quantity, actual[line_id]) != 0:
                raise ValidationError(_("This collection UUID was already used with different quantities."))

    def fu_collect(self, collections, collection_uuid):
        order = self._fu_preorder_sudo()
        self._fu_assert_store_access(order.fu_store_location_id, _PREORDER_OPERATOR_GROUPS)
        requested = self._fu_normalize_line_quantities(collections, "collection")
        collection_uuid = str(collection_uuid or "").strip()
        if not collection_uuid:
            raise ValidationError(_("A stable collection UUID is required."))

        self.env.cr.execute("SELECT id FROM sale_order WHERE id = %s FOR UPDATE", [order.id])
        Picking = self.env["stock.picking"].sudo()
        existing = Picking.search([("fu_collection_uuid", "=", collection_uuid)], limit=1)
        if existing:
            if existing.fu_preorder_id != order:
                raise ValidationError(_("This collection UUID belongs to another preorder."))
            order._fu_assert_same_collection_payload(
                requested,
                order._fu_done_collection_payload(existing),
            )
            return existing.id

        balance = order._fu_live_balance_due()
        if not order.currency_id.is_zero(balance):
            raise ValidationError(
                _("The entire remaining preorder balance must be paid before any collection.")
            )

        picking = order._fu_active_reservation_picking()
        if not picking:
            raise ValidationError(_("No Ready for collection stock is allocated to this preorder."))

        lines = order.order_line.filtered(lambda line: not line.display_type and line.product_id)
        line_by_id = {line.id: line for line in lines}
        active_moves = picking.move_ids.filtered(lambda move: move.state not in ("done", "cancel"))
        moves_by_line = active_moves.grouped("fu_preorder_line_id")

        for line_id, quantity in requested.items():
            line = line_by_id.get(line_id)
            if not line:
                raise ValidationError(_("Collection lines must belong to this preorder."))
            ready = sum(
                move.product_uom._compute_quantity(
                    move.quantity,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                for move in moves_by_line.get(line, self.env["stock.move"])
            )
            if line.product_uom_id.compare(quantity, ready) > 0:
                raise ValidationError(_("Collection cannot exceed the quantity Ready for collection."))

        active_moves.write({"picked": False})
        for line_id, requested_line_qty in requested.items():
            line = line_by_id[line_id]
            remaining = requested_line_qty
            for move in moves_by_line.get(line, self.env["stock.move"]):
                if line.product_uom_id.is_zero(remaining):
                    break
                reserved_line_qty = move.product_uom._compute_quantity(
                    move.quantity,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                portion_line_qty = min(remaining, reserved_line_qty)
                portion_move_qty = line.product_uom_id._compute_quantity(
                    portion_line_qty,
                    move.product_uom,
                    rounding_method="HALF-UP",
                )
                if move.product_uom.compare(portion_move_qty, move.quantity) < 0:
                    move.quantity = portion_move_qty
                move.picked = True
                remaining -= portion_line_qty
            if not line.product_uom_id.is_zero(remaining):
                raise ValidationError(_("Ready stock changed before collection; retry the collection."))

        picking.fu_collection_uuid = collection_uuid
        picking._action_done()
        order.invalidate_recordset(["fu_preorder_picking_ids"])
        lines.invalidate_recordset(["fu_ready_qty", "fu_collected_qty", "fu_remaining_qty"])
        return picking.id

    @api.depends(
        "order_line.product_uom_qty",
        "order_line.fu_ready_qty",
        "order_line.fu_collected_qty",
    )
    def _compute_fu_collection_state(self):
        for order in self:
            if not order.fu_is_preorder:
                order.fu_collection_state = False
                continue
            lines = order.order_line.filtered(lambda line: not line.display_type and line.product_id)
            ordered = sum(lines.mapped("product_uom_qty"))
            collected = sum(lines.mapped("fu_collected_qty"))
            ready = sum(lines.mapped("fu_ready_qty"))
            if ordered and all(
                line.product_uom_id.is_zero(line.fu_remaining_qty) for line in lines
            ):
                order.fu_collection_state = "collected"
            elif collected > 0:
                order.fu_collection_state = "partially_collected"
            elif ready <= 0:
                order.fu_collection_state = "awaiting_ready"
            elif ready < max(ordered - collected, 0.0):
                order.fu_collection_state = "partially_ready"
            else:
                order.fu_collection_state = "ready"


class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"

    fu_ready_qty = fields.Float(
        string="Fares ready quantity",
        digits="Product Unit",
        compute="_compute_fu_preorder_quantities",
    )
    fu_collected_qty = fields.Float(
        string="Fares collected quantity",
        digits="Product Unit",
        compute="_compute_fu_preorder_quantities",
    )
    fu_remaining_qty = fields.Float(
        string="Fares remaining collection quantity",
        digits="Product Unit",
        compute="_compute_fu_preorder_quantities",
    )

    @api.depends(
        "product_uom_qty",
        "order_id.fu_preorder_picking_ids.move_ids.state",
        "order_id.fu_preorder_picking_ids.move_ids.quantity",
        "order_id.fu_preorder_picking_ids.move_ids.fu_preorder_line_id",
    )
    def _compute_fu_preorder_quantities(self):
        for line in self:
            if not line.order_id.fu_is_preorder or line.display_type or not line.product_id:
                line.fu_ready_qty = 0.0
                line.fu_collected_qty = 0.0
                line.fu_remaining_qty = 0.0
                continue
            moves = line.order_id.sudo().fu_preorder_picking_ids.move_ids.filtered(
                lambda move: move.fu_preorder_line_id == line
            )
            collected = sum(
                move.product_uom._compute_quantity(
                    move.quantity,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                for move in moves.filtered(lambda move: move.state == "done")
            )
            ready = sum(
                move.product_uom._compute_quantity(
                    move.quantity,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                for move in moves.filtered(lambda move: move.state not in ("done", "cancel"))
            )
            line.fu_collected_qty = collected
            line.fu_remaining_qty = max(line.product_uom_qty - collected, 0.0)
            line.fu_ready_qty = min(ready, line.fu_remaining_qty)
