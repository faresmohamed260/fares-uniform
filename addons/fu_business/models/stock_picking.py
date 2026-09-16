from odoo import _, fields, models
from odoo.exceptions import AccessError, ValidationError

from .business import _OWNER_GROUP, _trusted_context


_SHIPMENT_CONTEXT = "fu_business_shipment_execution"
_SHIPMENT_OPERATOR_GROUPS = (
    "fu_core.group_fu_inventory_staff",
    "fu_core.group_fu_store_manager",
)
_SHIPMENT_AUDIT_FIELDS = {"fu_business_released_by_id", "fu_business_released_at"}


class StockPicking(models.Model):
    _inherit = "stock.picking"

    fu_business_released_by_id = fields.Many2one(
        "res.users",
        string="Business shipment released by",
        readonly=True,
        copy=False,
    )
    fu_business_released_at = fields.Datetime(
        string="Business shipment released at",
        readonly=True,
        copy=False,
    )

    def _fu_business_customer_deliveries(self):
        return self.filtered(
            lambda picking: picking.sale_id.fu_business_order
            and picking.location_dest_id.usage == "customer"
        )

    def _fu_assert_business_shipment_operator(self):
        self.ensure_one()
        if self.env.su or self.env.user.has_group(_OWNER_GROUP):
            return
        if not any(self.env.user.has_group(group) for group in _SHIPMENT_OPERATOR_GROUPS):
            raise AccessError(_("Your Fares role cannot release business-order shipments."))
        if self.location_id not in self.env.user.sudo().fu_stock_location_ids:
            raise AccessError(_("This business shipment is outside your assigned Fares stock-location scope."))

    def _fu_assert_complete_business_delivery(self):
        self.ensure_one()
        picking = self.sudo()
        order = picking.sale_id
        if not order or not order.fu_business_order or picking.location_dest_id.usage != "customer":
            raise ValidationError(_("This operation requires a Fares business customer delivery."))
        if order.state != "sale":
            raise ValidationError(_("Confirm the business order before releasing its shipment."))
        balance = order._fu_live_business_balance_due()
        if not order.currency_id.is_zero(balance):
            raise ValidationError(_("The entire remaining business-order balance must be paid before shipment."))

        customer_pickings = order.picking_ids.filtered(
            lambda candidate: candidate.location_dest_id.usage == "customer"
            and candidate.state != "cancel"
        )
        done_other = customer_pickings.filtered(
            lambda candidate: candidate.state == "done" and candidate != picking
        )
        pending = customer_pickings.filtered(lambda candidate: candidate.state != "done")
        if done_other or len(pending) != 1 or pending != picking:
            raise ValidationError(_("Partial or multi-delivery business shipment is not allowed in this MVP."))

        lines = order.order_line.filtered(
            lambda line: not line.display_type
            and not line.is_downpayment
            and line.product_id.is_storable
        )
        if not lines:
            raise ValidationError(_("The business order has no shippable finished-stock items."))
        moves = picking.move_ids.filtered(
            lambda move: move.state != "cancel" and move.sale_line_id.order_id == order
        )
        for line in lines:
            line_moves = moves.filtered(lambda move: move.sale_line_id == line)
            demanded = sum(
                move.product_uom._compute_quantity(
                    move.product_uom_qty,
                    line.product_uom_id,
                    rounding_method="HALF-UP",
                )
                for move in line_moves
            )
            if line.product_uom_id.compare(demanded, line.product_uom_qty) != 0:
                raise ValidationError(_("The complete business-order quantity must be present in one delivery."))
        return picking

    def fu_release_business_delivery(self):
        self.ensure_one()
        self._fu_assert_business_shipment_operator()
        picking = self._fu_assert_complete_business_delivery()

        self.env.cr.execute("SELECT id FROM sale_order WHERE id = %s FOR UPDATE", [picking.sale_id.id])
        self.env.cr.execute("SELECT id FROM stock_picking WHERE id = %s FOR UPDATE", [picking.id])
        picking = self._fu_assert_complete_business_delivery()
        picking.action_assign()

        moves = picking.move_ids.filtered(
            lambda move: move.state not in ("done", "cancel")
            and move.sale_line_id.order_id == picking.sale_id
        )
        if not moves:
            raise ValidationError(_("No active business-order stock moves are available for shipment."))
        for move in moves:
            if move.product_uom.compare(move.quantity, move.product_uom_qty) != 0:
                raise ValidationError(
                    _("All business-order quantities must be physically available before complete shipment release.")
                )
        moves.write({"picked": True})

        actor_id = self.env.user.id
        shipping = picking.with_context(**{_SHIPMENT_CONTEXT: True})
        shipping.write(
            {
                "fu_business_released_by_id": actor_id,
                "fu_business_released_at": fields.Datetime.now(),
            }
        )
        shipping._action_done()
        return picking.id

    def write(self, vals):
        business = self._fu_business_customer_deliveries()
        if business and _SHIPMENT_AUDIT_FIELDS.intersection(vals) and not _trusted_context(
            self.env, _SHIPMENT_CONTEXT
        ):
            raise AccessError(_("Business shipment audit fields are system controlled."))
        return super().write(vals)

    def button_validate(self):
        business = self._fu_business_customer_deliveries()
        if business and not _trusted_context(self.env, _SHIPMENT_CONTEXT):
            raise ValidationError(_("Business shipments must use the controlled complete-shipment release action."))
        return super().button_validate()

    def _action_done(self):
        business = self._fu_business_customer_deliveries()
        if business and not _trusted_context(self.env, _SHIPMENT_CONTEXT):
            raise ValidationError(_("Business shipments must use the controlled complete-shipment release action."))
        return super()._action_done()

    def action_cancel(self):
        business = self._fu_business_customer_deliveries()
        if business and any(picking.sale_id._fu_has_business_payment() for picking in business):
            raise ValidationError(
                _("A paid business delivery cannot be cancelled until B2B refund/credit policy is implemented.")
            )
        return super().action_cancel()
