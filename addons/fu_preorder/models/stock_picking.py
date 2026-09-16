from odoo import _, api, fields, models
from odoo.exceptions import AccessError


_PREORDER_STOCK_MUTATION_ERROR = _(
    "Preorder stock documents must be changed through the approved Fares preorder workflow."
)


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

    def _fu_assert_preorder_native_mutation_allowed(self, vals=None):
        if self.env.su:
            return
        vals = vals or {}
        if vals.get("fu_preorder_id") or self.sudo().filtered("fu_preorder_id"):
            raise AccessError(_PREORDER_STOCK_MUTATION_ERROR)

    @api.model_create_multi
    def create(self, vals_list):
        if not self.env.su and any(vals.get("fu_preorder_id") for vals in vals_list):
            raise AccessError(_PREORDER_STOCK_MUTATION_ERROR)
        return super().create(vals_list)

    def write(self, vals):
        self._fu_assert_preorder_native_mutation_allowed(vals)
        return super().write(vals)

    def unlink(self):
        self._fu_assert_preorder_native_mutation_allowed()
        return super().unlink()


class StockMove(models.Model):
    _inherit = "stock.move"

    fu_preorder_line_id = fields.Many2one(
        "sale.order.line",
        string="Fares preorder line",
        copy=True,
        index=True,
        ondelete="restrict",
    )

    def _fu_assert_preorder_native_mutation_allowed(self, vals=None):
        if self.env.su:
            return
        vals = vals or {}
        if vals.get("fu_preorder_line_id") or self.sudo().filtered("fu_preorder_line_id"):
            raise AccessError(_PREORDER_STOCK_MUTATION_ERROR)

    @api.model_create_multi
    def create(self, vals_list):
        if not self.env.su and any(vals.get("fu_preorder_line_id") for vals in vals_list):
            raise AccessError(_PREORDER_STOCK_MUTATION_ERROR)
        return super().create(vals_list)

    def write(self, vals):
        self._fu_assert_preorder_native_mutation_allowed(vals)
        return super().write(vals)

    def unlink(self):
        self._fu_assert_preorder_native_mutation_allowed()
        return super().unlink()
