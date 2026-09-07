from odoo import _, Command, api, fields, models
from odoo.exceptions import AccessError, UserError, ValidationError


class FuStockMovementRequest(models.Model):
    _name = "fu.stock.movement.request"
    _description = "Fares Stock Movement Request"
    _order = "id desc"

    request_key = fields.Char(required=True, readonly=True, index=True, copy=False)
    operation = fields.Selection(
        [
            ("receipt", "Receipt"),
            ("internal", "Store/Storage Transfer"),
            ("opening", "Opening Count"),
        ],
        required=True,
        readonly=True,
    )
    product_id = fields.Many2one(
        "product.product",
        required=True,
        readonly=True,
        check_company=True,
        domain=[("is_storable", "=", True)],
    )
    quantity = fields.Float(required=True, readonly=True, digits="Product Unit")
    source_location_id = fields.Many2one(
        "stock.location", readonly=True, check_company=True
    )
    destination_location_id = fields.Many2one(
        "stock.location", required=True, readonly=True, check_company=True
    )
    reason = fields.Char(required=True, readonly=True)
    batch_ref = fields.Char(readonly=True)
    actor_id = fields.Many2one(
        "res.users", required=True, readonly=True, copy=False, string="Requested by"
    )
    executed_by_id = fields.Many2one(
        "res.users", readonly=True, copy=False, string="Executed by"
    )
    company_id = fields.Many2one(
        "res.company",
        required=True,
        readonly=True,
        default=lambda self: self.env.company,
    )
    picking_id = fields.Many2one("stock.picking", readonly=True, copy=False)
    stock_move_id = fields.Many2one("stock.move", readonly=True, copy=False)
    state = fields.Selection(
        [("draft", "Draft"), ("done", "Done")],
        required=True,
        default="draft",
        readonly=True,
        copy=False,
    )

    _request_key_unique = models.UniqueIndex("(request_key)")
    _quantity_positive = models.Constraint(
        "CHECK (quantity > 0)",
        "Stock movement quantity must be greater than zero.",
    )

    @api.model
    def _fu_normalize_payload(self, operation, payload):
        values = dict(payload)
        values["operation"] = operation

        product = self.env["product.product"].browse(values.get("product_id")).exists()
        destination = self.env["stock.location"].browse(
            values.get("destination_location_id")
        ).exists()
        if not product or not destination:
            raise ValidationError(_("A valid product and destination location are required."))

        values["product_id"] = product.id
        values["destination_location_id"] = destination.id
        values["company_id"] = destination.company_id.id or self.env.company.id

        if operation == "receipt":
            values["source_location_id"] = self.env.ref(
                "stock.stock_location_suppliers"
            ).id
        elif operation == "internal":
            source = self.env["stock.location"].browse(
                values.get("source_location_id")
            ).exists()
            if not source:
                raise ValidationError(_("Internal transfers require a source location."))
            values["source_location_id"] = source.id
        elif operation == "opening":
            values["source_location_id"] = False
        else:
            raise ValidationError(_("Unsupported Fares stock operation."))

        values["reason"] = (values.get("reason") or "").strip()
        values["batch_ref"] = (values.get("batch_ref") or "").strip() or False
        return values

    @api.model
    def _fu_actor_is_owner_or_technical_admin(self):
        return (
            self.env.is_superuser()
            or self.env.user.has_group("fu_core.group_fu_owner_admin")
            or self.env.user.has_group("base.group_system")
        )

    @api.model
    def _fu_check_actor_access(self, values):
        if self._fu_actor_is_owner_or_technical_admin():
            return True
        if not self.env.user.has_group("fu_core.group_fu_inventory_staff"):
            raise AccessError(_("This role cannot execute finished-stock movements."))

        allowed = self.env.user.fu_stock_location_ids
        destination = self.env["stock.location"].browse(values.get("destination_location_id"))
        if destination not in allowed:
            raise AccessError(_("The destination is outside your assigned stock locations."))
        if values.get("operation") == "internal":
            source = self.env["stock.location"].browse(values.get("source_location_id"))
            if source not in allowed:
                raise AccessError(_("The source is outside your assigned stock locations."))
        return True

    @api.model
    def process_idempotent(self, request_key, operation, **payload):
        """Execute one native Odoo stock effect at most once for a stable key.

        Inventory Staff never receive Odoo's broad stock mutation ACL. This service
        checks role + assigned locations, then performs the approved native Odoo
        effect under sudo while preserving the business actor on this immutable ledger.
        """
        request_key = (request_key or "").strip()
        if not request_key:
            raise ValidationError(_("An idempotency request key is required."))

        values = self._fu_normalize_payload(operation, payload)
        self._fu_check_actor_access(values)
        self.env.cr.execute(
            "SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))", [request_key]
        )

        existing = self.search([("request_key", "=", request_key)], limit=1)
        if existing:
            existing._fu_assert_same_payload(values)
            if existing.state != "done":
                existing.action_execute()
            return existing

        request = self.sudo().create(
            {
                "request_key": request_key,
                "actor_id": self.env.user.id,
                **values,
            }
        )
        return request.with_user(self.env.user).action_execute() and request

    def _fu_assert_same_payload(self, values):
        self.ensure_one()
        comparable = (
            "operation",
            "product_id",
            "source_location_id",
            "destination_location_id",
            "reason",
            "batch_ref",
        )
        for field_name in comparable:
            current = self[field_name]
            incoming = values.get(field_name)
            current_value = current.id if hasattr(current, "id") else (current or False)
            incoming_value = incoming.id if hasattr(incoming, "id") else (incoming or False)
            if current_value != incoming_value:
                raise ValidationError(
                    _("The request key is already bound to a different stock operation.")
                )
        if self.product_id.uom_id.compare(self.quantity, values.get("quantity", 0)):
            raise ValidationError(
                _("The request key is already bound to a different stock operation.")
            )

    def _fu_values_for_access_check(self):
        self.ensure_one()
        return {
            "operation": self.operation,
            "source_location_id": self.source_location_id.id,
            "destination_location_id": self.destination_location_id.id,
        }

    def _fu_validate_business_contract(self):
        self.ensure_one()
        if not self.product_id.is_storable:
            raise ValidationError(_("Only inventory-tracked products may move stock."))
        if not self.reason:
            raise ValidationError(_("A movement reason is required."))
        if self.destination_location_id.fu_location_role not in {"store", "storage"}:
            raise ValidationError(
                _("Finished stock may only enter the Retail Store or Storage locations.")
            )
        if self.operation == "internal":
            if self.source_location_id.fu_location_role not in {"store", "storage"}:
                raise ValidationError(
                    _("Internal Fares transfers may only start at Retail Store or Storage.")
                )
            if self.source_location_id == self.destination_location_id:
                raise ValidationError(_("Source and destination must be different."))
            available = self.env["stock.quant"].sudo()._get_available_quantity(
                self.product_id, self.source_location_id
            )
            if self.product_id.uom_id.compare(available, self.quantity) < 0:
                raise ValidationError(_("The source location does not have enough stock."))
        if self.operation == "opening" and not self.batch_ref:
            raise ValidationError(_("Opening counts require a batch reference."))

    def action_execute(self):
        for request in self:
            request._fu_check_actor_access(request._fu_values_for_access_check())
            if request.state == "done":
                continue
            request._fu_validate_business_contract()
            request.sudo().executed_by_id = self.env.user
            if request.operation == "opening":
                request._fu_apply_opening_count()
            else:
                request._fu_apply_native_picking()
            request.sudo().state = "done"
        return True

    def _fu_apply_native_picking(self):
        self.ensure_one()
        warehouse = self.destination_location_id.warehouse_id or self.source_location_id.warehouse_id
        if not warehouse:
            raise UserError(_("No warehouse owns the requested Fares stock locations."))
        picking_type = (
            warehouse.in_type_id if self.operation == "receipt" else warehouse.int_type_id
        )
        if not picking_type:
            raise UserError(_("The required native Odoo operation type is not configured."))

        picking = self.env["stock.picking"].sudo().create(
            {
                "picking_type_id": picking_type.id,
                "location_id": self.source_location_id.id,
                "location_dest_id": self.destination_location_id.id,
                "origin": f"FU:{self.request_key}",
                "move_ids": [
                    Command.create(
                        {
                            "product_id": self.product_id.id,
                            "product_uom_qty": self.quantity,
                            "product_uom": self.product_id.uom_id.id,
                            "location_id": self.source_location_id.id,
                            "location_dest_id": self.destination_location_id.id,
                        }
                    )
                ],
            }
        )
        picking.action_confirm()
        picking.action_assign()
        picking.move_ids.quantity = self.quantity
        picking.button_validate()
        if picking.state != "done":
            raise UserError(_("The native Odoo stock transfer did not complete."))
        self.sudo().picking_id = picking

    def _fu_apply_opening_count(self):
        self.ensure_one()
        inventory_name = f"FU opening {self.request_key} | {self.batch_ref} | {self.reason}"
        quant_env = self.env["stock.quant"].sudo().with_context(
            inventory_mode=True, inventory_name=inventory_name
        )
        quant = quant_env.search(
            [
                ("product_id", "=", self.product_id.id),
                ("location_id", "=", self.destination_location_id.id),
                ("lot_id", "=", False),
                ("package_id", "=", False),
                ("owner_id", "=", False),
            ],
            limit=1,
        )
        executor = self.executed_by_id or self.actor_id
        if quant:
            quant.inventory_quantity = self.quantity
            quant.user_id = executor
        else:
            quant = quant_env.create(
                {
                    "product_id": self.product_id.id,
                    "location_id": self.destination_location_id.id,
                    "inventory_quantity": self.quantity,
                    "user_id": executor.id,
                }
            )
        quant.with_context(
            inventory_mode=True, inventory_name=inventory_name
        ).action_apply_inventory()

        inventory_move = self.env["stock.move"].sudo().search(
            [
                ("is_inventory", "=", True),
                ("inventory_name", "=", inventory_name),
                ("product_id", "=", self.product_id.id),
            ],
            order="id desc",
            limit=1,
        )
        self.sudo().stock_move_id = inventory_move
