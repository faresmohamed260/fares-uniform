from odoo import _, api, models
from odoo.exceptions import UserError, ValidationError


FU_SEQUENCE_CODE = "fu.product.variant"
FU_CODE_PREFIX = "FU-"


class ProductProduct(models.Model):
    _inherit = "product.product"

    # Odoo's native default_code is intentionally not globally unique. Fares-owned
    # permanent codes are, while unrelated/non-Fares references retain native behavior.
    _fu_default_code_unique = models.UniqueIndex(
        "(default_code) WHERE default_code LIKE 'FU-%'"
    )

    @api.model
    def _fu_next_code(self):
        """Return the next sequence value, skipping any pre-existing manual collision."""
        while True:
            code = self.env["ir.sequence"].next_by_code(FU_SEQUENCE_CODE)
            if not code:
                raise UserError(_("The Fares Uniform item-code sequence is not configured."))
            if not self.sudo().search_count([("default_code", "=", code)], limit=1):
                return code

    def _fu_ensure_identifiers(self):
        """Ensure every inventory-tracked variant owns a permanent FU code and barcode."""
        for product in self.filtered("is_storable"):
            needs_code = not product.default_code or not product.default_code.startswith(FU_CODE_PREFIX)
            if not needs_code:
                continue

            code = self._fu_next_code()
            values = {"default_code": code}
            if not product.barcode:
                values["barcode"] = code

            # Bypass this class's public write guard only for this internal assignment.
            super(ProductProduct, product).write(values)
        return True

    @api.model_create_multi
    def create(self, vals_list):
        sanitized_vals_list = []
        for incoming in vals_list:
            vals = dict(incoming)
            template = self.env["product.template"].browse(vals.get("product_tmpl_id")).exists()
            if template and template.is_storable:
                # A permanent Fares identifier is system-owned. Ignore a client-supplied
                # code/barcode at creation and allocate after the native variant exists.
                vals.pop("default_code", None)
                vals.pop("barcode", None)
            sanitized_vals_list.append(vals)

        products = super().create(sanitized_vals_list)
        products._fu_ensure_identifiers()
        return products

    def write(self, vals):
        if "default_code" in vals:
            requested = vals.get("default_code") or False
            for product in self:
                if (
                    product.default_code
                    and product.default_code.startswith(FU_CODE_PREFIX)
                    and requested != product.default_code
                ):
                    raise ValidationError(
                        _(
                            "Fares item code %(code)s is permanent and cannot be changed through normal editing.",
                            code=product.default_code,
                        )
                    )

        result = super().write(vals)
        self._fu_ensure_identifiers()
        return result
