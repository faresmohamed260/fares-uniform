from odoo import fields, models


class StockPicking(models.Model):
    _inherit = "stock.picking"

    fu_preorder_id = fields.Many2one(
        "sale.order",
        string="Fares preorder",
        copy=True,
        index=True,
        ondelete="restrict",
    )
    fu_collection_uuid = fields.Char(
        string="Fares collection UUID",
        copy=False,
        index=True,
    )

    _fu_collection_uuid_unique = models.UniqueIndex(
        "(fu_collection_uuid) WHERE fu_collection_uuid IS NOT NULL"
    )


class StockMove(models.Model):
    _inherit = "stock.move"

    fu_preorder_line_id = fields.Many2one(
        "sale.order.line",
        string="Fares preorder line",
        copy=True,
        index=True,
        ondelete="restrict",
    )
