from odoo import api, fields, models


class StockLocation(models.Model):
    _inherit = "stock.location"

    fu_location_role = fields.Selection(
        [
            ("store", "Retail Store"),
            ("storage", "Storage"),
        ],
        string="Fares finished-stock role",
        copy=False,
        index=True,
    )

    _fu_location_role_unique = models.UniqueIndex(
        "(company_id, fu_location_role) WHERE fu_location_role IS NOT NULL"
    )

    @api.model
    def _fu_configure_initial_locations(self):
        """Mark exactly the two initial Fares finished-stock custody locations.

        Odoo's existing one-step warehouse stock location becomes the Retail Store.
        Storage is a sibling internal location under the same warehouse view. Native
        supplier/customer/inventory/production virtual locations remain untouched and
        are not Fares finished-stock custody locations.
        """
        for company in self.env["res.company"].search([]):
            warehouse = self.env["stock.warehouse"].search(
                [("company_id", "=", company.id), ("active", "=", True)],
                order="id",
                limit=1,
            )
            if not warehouse:
                continue

            store = warehouse.lot_stock_id
            store.write({"name": "Retail Store", "fu_location_role": "store"})

            storage = self.search(
                [
                    ("company_id", "=", company.id),
                    ("fu_location_role", "=", "storage"),
                ],
                limit=1,
            )
            if not storage:
                storage = self.create(
                    {
                        "name": "Storage",
                        "usage": "internal",
                        "location_id": warehouse.view_location_id.id,
                        "company_id": company.id,
                        "fu_location_role": "storage",
                    }
                )

        return True
