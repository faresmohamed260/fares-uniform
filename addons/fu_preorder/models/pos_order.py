from collections import defaultdict

from odoo import _, models
from odoo.exceptions import ValidationError


class PosOrder(models.Model):
    _inherit = "pos.order"

    def _fu_assert_preorder_reserved_stock_available(self):
        """Keep ordinary POS checkout from consuming stock reserved for a preorder.

        Native Odoo POS writes the sold quantity directly to its outgoing stock move
        before completing that move.  Without this server-side gate, a POS sale can
        consume units already reserved on an active preorder picking.  We deliberately
        apply the guard only when an active Fares preorder reservation exists so Phase
        2A's ordinary stock-shortage behavior is otherwise unchanged.
        """
        self.ensure_one()
        source = self.config_id.picking_type_id.default_location_src_id
        if not source:
            return

        requested_by_product = defaultdict(float)
        for line in self.lines:
            if line.qty > 0 and line.product_id.is_storable:
                requested_by_product[line.product_id.id] += line.qty
        if not requested_by_product:
            return

        Move = self.env["stock.move"].sudo()
        Quant = self.env["stock.quant"].sudo()
        products = self.env["product.product"].sudo().browse(requested_by_product)

        for product in products:
            active_preorder_move = Move.search(
                [
                    ("fu_preorder_line_id", "!=", False),
                    ("fu_preorder_line_id.order_id.fu_is_preorder", "=", True),
                    ("product_id", "=", product.id),
                    ("location_id", "child_of", source.id),
                    ("state", "not in", ("done", "cancel")),
                ],
                limit=1,
            )
            if not active_preorder_move:
                continue

            available = Quant._get_available_quantity(product, source, strict=False)
            requested = requested_by_product[product.id]
            if product.uom_id.compare(requested, available) > 0:
                raise ValidationError(
                    _(
                        "Only %(available)s %(uom)s of %(product)s remains available for "
                        "ordinary POS checkout after active preorder reservations; "
                        "%(requested)s was requested. The sale remains pending and requires review.",
                        available=available,
                        uom=product.uom_id.display_name,
                        product=product.display_name,
                        requested=requested,
                    )
                )

    def _create_order_picking(self):
        self.ensure_one()
        self._fu_assert_preorder_reserved_stock_available()
        return super()._create_order_picking()
