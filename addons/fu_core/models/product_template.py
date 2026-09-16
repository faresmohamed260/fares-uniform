from odoo import models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    def write(self, vals):
        result = super().write(vals)
        if vals.get("is_storable"):
            self.product_variant_ids._fu_ensure_identifiers()
        return result
