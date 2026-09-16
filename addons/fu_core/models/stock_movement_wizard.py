import uuid

from odoo import _, api, fields, models


class FuStockMovementWizard(models.TransientModel):
    _name = "fu.stock.movement.wizard"
    _description = "Fares Stock Operation"

    request_key = fields.Char(
        string="Request Key",
        required=True,
        readonly=True,
        default=lambda self: f"UI-{uuid.uuid4()}",
    )
    operation = fields.Selection(
        [
            ("receipt", "Receipt"),
            ("internal", "Store/Storage Transfer"),
            ("opening", "Opening Count"),
        ],
        string="Operation",
        required=True,
        default="receipt",
    )
    product_id = fields.Many2one(
        "product.product",
        string="Product",
        required=True,
        domain=[("is_storable", "=", True)],
    )
    quantity = fields.Float(
        string="Quantity",
        required=True,
        digits="Product Unit",
        default=1.0,
    )
    allowed_location_ids = fields.Many2many(
        "stock.location",
        string="Allowed Locations",
        compute="_compute_allowed_location_ids",
    )
    source_location_id = fields.Many2one(
        "stock.location",
        string="Source Location",
        domain=[("fu_location_role", "in", ["store", "storage"])],
    )
    destination_location_id = fields.Many2one(
        "stock.location",
        string="Destination Location",
        required=True,
        domain=[("fu_location_role", "in", ["store", "storage"])],
    )
    reason = fields.Char(string="Reason", required=True)
    batch_ref = fields.Char(string="Batch Reference")

    @api.depends_context("uid", "allowed_company_ids")
    def _compute_allowed_location_ids(self):
        owner = (
            self.env.is_superuser()
            or self.env.user.has_group("fu_core.group_fu_owner_admin")
            or self.env.user.has_group("base.group_system")
        )
        if owner:
            locations = self.env["stock.location"].sudo().search(
                [
                    ("company_id", "=", self.env.company.id),
                    ("fu_location_role", "in", ["store", "storage"]),
                ]
            )
        else:
            locations = self.env.user.fu_stock_location_ids.filtered(
                lambda location: location.company_id == self.env.company
            )
        for wizard in self:
            wizard.allowed_location_ids = locations

    @api.onchange("operation")
    def _onchange_operation(self):
        if self.operation != "internal":
            self.source_location_id = False
        if self.operation != "opening":
            self.batch_ref = False

    def action_submit(self):
        self.ensure_one()
        request = self.env["fu.stock.movement.request"].process_idempotent(
            self.request_key,
            self.operation,
            product_id=self.product_id.id,
            quantity=self.quantity,
            source_location_id=self.source_location_id.id,
            destination_location_id=self.destination_location_id.id,
            reason=self.reason,
            batch_ref=self.batch_ref,
        )
        return {
            "type": "ir.actions.act_window",
            "name": _("Stock Movement"),
            "res_model": "fu.stock.movement.request",
            "res_id": request.id,
            "view_mode": "form",
            "views": [
                (self.env.ref("fu_core.fu_stock_movement_request_form").id, "form")
            ],
            "target": "current",
        }
