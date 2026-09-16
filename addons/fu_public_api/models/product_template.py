import re

from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError


_PUBLIC_FIELDS = {
    "fu_public_published",
    "fu_public_slug",
    "fu_public_name_en",
    "fu_public_name_ar",
    "fu_public_summary_en",
    "fu_public_summary_ar",
    "fu_public_sector",
    "fu_public_sequence",
}
_SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class ProductTemplate(models.Model):
    _inherit = "product.template"

    fu_public_published = fields.Boolean(string="Published in public catalog", default=False, copy=False)
    fu_public_slug = fields.Char(string="Public slug", size=120, index=True, copy=False)
    fu_public_name_en = fields.Char(string="Public name (English)", size=160)
    fu_public_name_ar = fields.Char(string="Public name (Arabic)", size=160)
    fu_public_summary_en = fields.Text(string="Public summary (English)")
    fu_public_summary_ar = fields.Text(string="Public summary (Arabic)")
    fu_public_sector = fields.Char(string="Public sector / use case", size=120)
    fu_public_sequence = fields.Integer(string="Public display order", default=10)

    _fu_public_slug_unique = models.UniqueIndex(
        "(fu_public_slug) WHERE fu_public_slug IS NOT NULL"
    )

    @api.model
    def _fu_public_is_curator(self):
        return (
            self.env.is_superuser()
            or self.env.user.has_group("fu_core.group_fu_owner_admin")
            or self.env.user.has_group("base.group_system")
        )

    @api.model
    def _fu_public_guard_values(self, values):
        if _PUBLIC_FIELDS.intersection(values) and not self._fu_public_is_curator():
            raise AccessError(_("Only Owner/Admin may change public catalog publication data."))

    @api.model
    def _fu_public_normalize_values(self, values):
        normalized = dict(values)
        for field_name in (
            "fu_public_slug",
            "fu_public_name_en",
            "fu_public_name_ar",
            "fu_public_summary_en",
            "fu_public_summary_ar",
            "fu_public_sector",
        ):
            if field_name in normalized and isinstance(normalized[field_name], str):
                normalized[field_name] = normalized[field_name].strip() or False
        return normalized

    @api.model_create_multi
    def create(self, vals_list):
        prepared = []
        for values in vals_list:
            self._fu_public_guard_values(values)
            prepared.append(self._fu_public_normalize_values(values))
        return super().create(prepared)

    def write(self, values):
        self._fu_public_guard_values(values)
        return super().write(self._fu_public_normalize_values(values))

    @api.constrains(
        "fu_public_published",
        "fu_public_slug",
        "fu_public_name_en",
        "fu_public_name_ar",
        "fu_public_summary_en",
        "fu_public_summary_ar",
        "fu_public_sector",
    )
    def _fu_validate_public_catalog_data(self):
        for product in self:
            slug = product.fu_public_slug or ""
            if slug and not _SLUG_RE.fullmatch(slug):
                raise ValidationError(
                    _("Public slug must contain only lowercase letters, numbers and single hyphens.")
                )
            if product.fu_public_name_en and len(product.fu_public_name_en) > 160:
                raise ValidationError(_("Public English name is too long."))
            if product.fu_public_name_ar and len(product.fu_public_name_ar) > 160:
                raise ValidationError(_("Public Arabic name is too long."))
            if product.fu_public_summary_en and len(product.fu_public_summary_en) > 1000:
                raise ValidationError(_("Public English summary is too long."))
            if product.fu_public_summary_ar and len(product.fu_public_summary_ar) > 1000:
                raise ValidationError(_("Public Arabic summary is too long."))
            if product.fu_public_published:
                missing = []
                if not product.fu_public_slug:
                    missing.append(_("slug"))
                if not product.fu_public_name_en:
                    missing.append(_("English public name"))
                if not product.fu_public_summary_en:
                    missing.append(_("English public summary"))
                if missing:
                    raise ValidationError(
                        _("Published catalog products require: %s", ", ".join(missing))
                    )

    def _fu_public_payload(self, language="en"):
        self.ensure_one()
        if not self.fu_public_published:
            raise ValidationError(_("This product is not published."))
        language = "ar" if language == "ar" else "en"
        if language == "ar":
            public_name = self.fu_public_name_ar or self.fu_public_name_en
            public_summary = self.fu_public_summary_ar or self.fu_public_summary_en
        else:
            public_name = self.fu_public_name_en
            public_summary = self.fu_public_summary_en
        return {
            "slug": self.fu_public_slug,
            "name": public_name,
            "summary": public_summary,
            "sector": self.fu_public_sector or "",
            "image_url": (
                f"/fu/public/catalog/{self.fu_public_slug}/image" if self.image_1920 else None
            ),
        }
