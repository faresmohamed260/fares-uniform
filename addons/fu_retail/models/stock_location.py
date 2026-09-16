from odoo import api, fields, models


class StockLocation(models.Model):
    _inherit = "stock.location"

    fu_location_role = fields.Selection(
        selection_add=[("returns_inspection", "Returns / Inspection")],
        ondelete={"returns_inspection": "set null"},
    )

    @api.model
    def _fu_get_or_create_returns_inspection_location(self, warehouse):
        warehouse = warehouse.exists()
        if not warehouse:
            return self.browse()
        location = self.sudo().search(
            [
                ("company_id", "=", warehouse.company_id.id),
                ("fu_location_role", "=", "returns_inspection"),
            ],
            limit=1,
        )
        if not location:
            location = self.sudo().create(
                {
                    "name": "Returns / Inspection",
                    "usage": "internal",
                    "location_id": warehouse.view_location_id.id,
                    "company_id": warehouse.company_id.id,
                    "fu_location_role": "returns_inspection",
                }
            )
        return location
