from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    fu_made_to_special_specification = fields.Boolean(
        string="Made to special customer specification",
        default=False,
        help=(
            "Marks an item genuinely made to specifications set by the consumer. "
            "Do not enable this merely because a stocked uniform belongs to a school "
            "or client design. Phase 2C uses this only for the accepted no-reason "
            "return-policy exception; defective-item rights remain separate."
        ),
    )
