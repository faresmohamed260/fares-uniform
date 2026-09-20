import re

from odoo import _, api, fields, models
from odoo.exceptions import ValidationError


_SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
_PUBLICATION_STATES = [("draft", "Draft"), ("published", "Published")]


def _localized(record, english_field, arabic_field, language):
    english = getattr(record, english_field) or ""
    arabic = getattr(record, arabic_field) or ""
    return (arabic or english) if language == "ar" else english


def _published(records):
    return records.filtered(
        lambda record: record.publication_state == "published"
    ).sorted(key=lambda record: (record.sequence, record.id))


class FuPublicPublicationMixin(models.AbstractModel):
    _name = "fu.public.publication.mixin"
    _description = "Fares Public Publication Mixin"
    _check_company_auto = True

    sequence = fields.Integer(default=10, required=True)
    publication_state = fields.Selection(
        _PUBLICATION_STATES,
        required=True,
        default="draft",
        index=True,
    )
    company_id = fields.Many2one(
        "res.company",
        required=True,
        default=lambda self: self.env.company,
        index=True,
    )


class FuPublicSlugMixin(models.AbstractModel):
    _name = "fu.public.slug.mixin"
    _description = "Fares Public Slug Mixin"
    _inherit = "fu.public.publication.mixin"

    slug = fields.Char(required=True, size=120, index=True)

    @api.constrains("slug")
    def _fu_validate_slug(self):
        for record in self:
            if not _SLUG_RE.fullmatch(record.slug or ""):
                raise ValidationError(
                    _("Public slug must contain only lowercase letters, numbers and single hyphens.")
                )


class FuPublicOrganization(models.Model):
    _name = "fu.public.organization"
    _description = "Fares Public Organization"
    _inherit = "fu.public.slug.mixin"
    _order = "sequence, id"
    _rec_name = "name_en"

    name_en = fields.Char(required=True, size=160)
    name_ar = fields.Char(size=160)
    sector_en = fields.Char(required=True, size=120)
    sector_ar = fields.Char(size=120)
    program_ids = fields.One2many("fu.public.program", "organization_id")

    _fu_public_organization_slug_unique = models.UniqueIndex("(company_id, slug)")

    def _fu_public_payload(self, language):
        self.ensure_one()
        return {
            "slug": self.slug,
            "name": _localized(self, "name_en", "name_ar", language),
            "sector": _localized(self, "sector_en", "sector_ar", language),
        }


class FuPublicProgram(models.Model):
    _name = "fu.public.program"
    _description = "Fares Public Program"
    _inherit = "fu.public.slug.mixin"
    _order = "sequence, id"
    _rec_name = "title_en"

    organization_id = fields.Many2one(
        "fu.public.organization",
        required=True,
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    title_en = fields.Char(required=True, size=160)
    title_ar = fields.Char(size=160)
    summary_en = fields.Text(required=True)
    summary_ar = fields.Text()
    brief_en = fields.Text()
    brief_ar = fields.Text()
    skin_accent = fields.Char(required=True, default="#163A5F", size=7)
    skin_accent_secondary = fields.Char(required=True, default="#A84646", size=7)
    skin_motif = fields.Char(default="none", size=80)
    cohort_ids = fields.One2many("fu.public.cohort", "program_id")
    look_ids = fields.One2many("fu.public.look", "program_id")
    garment_ids = fields.One2many("fu.public.garment", "program_id")
    media_ids = fields.One2many("fu.public.media", "program_id")

    _fu_public_program_slug_unique = models.UniqueIndex(
        "(company_id, organization_id, slug)"
    )

    @api.constrains("organization_id", "company_id")
    def _fu_validate_company(self):
        for record in self:
            if record.organization_id.company_id != record.company_id:
                raise ValidationError(_("Public program and organization must use the same company."))

    @api.constrains("skin_accent", "skin_accent_secondary")
    def _fu_validate_skin_colors(self):
        color_re = re.compile(r"^#[0-9A-Fa-f]{6}$")
        for record in self:
            if not color_re.fullmatch(record.skin_accent or ""):
                raise ValidationError(_("Primary public skin accent must be a six-digit hex color."))
            if not color_re.fullmatch(record.skin_accent_secondary or ""):
                raise ValidationError(_("Secondary public skin accent must be a six-digit hex color."))

    @api.model
    def _fu_public_domain(self):
        return [
            ("company_id", "=", self.env.company.id),
            ("publication_state", "=", "published"),
            ("organization_id.company_id", "=", self.env.company.id),
            ("organization_id.publication_state", "=", "published"),
        ]

    def _fu_public_summary(self, language):
        self.ensure_one()
        return {
            "organization": self.organization_id._fu_public_payload(language),
            "program": {
                "slug": self.slug,
                "title": _localized(self, "title_en", "title_ar", language),
                "summary": _localized(self, "summary_en", "summary_ar", language),
            },
        }

    def _fu_public_payload(self, language):
        self.ensure_one()
        if (
            self.publication_state != "published"
            or self.organization_id.publication_state != "published"
        ):
            raise ValidationError(_("This public program is not published."))

        cohorts = _published(self.cohort_ids)
        garments = _published(self.garment_ids)
        looks = _published(self.look_ids)
        program_media = _published(
            self.media_ids.filtered(lambda media: not media.garment_id)
        ).filtered(lambda media: media.rights_state == "approved")

        return {
            "organization": self.organization_id._fu_public_payload(language),
            "program": {
                "slug": self.slug,
                "title": _localized(self, "title_en", "title_ar", language),
                "summary": _localized(self, "summary_en", "summary_ar", language),
                "brief": _localized(self, "brief_en", "brief_ar", language),
                "visual_skin": {
                    "accent": self.skin_accent,
                    "accent_secondary": self.skin_accent_secondary,
                    "motif": self.skin_motif or "",
                },
            },
            "cohorts": [record._fu_public_payload(language) for record in cohorts],
            "looks": [record._fu_public_payload(language) for record in looks],
            "garments": [record._fu_public_payload(language) for record in garments],
            "media": [record._fu_public_payload(language) for record in program_media],
        }


class FuPublicCohort(models.Model):
    _name = "fu.public.cohort"
    _description = "Fares Public Cohort"
    _inherit = "fu.public.slug.mixin"
    _order = "sequence, id"
    _rec_name = "label_en"

    program_id = fields.Many2one(
        "fu.public.program",
        required=True,
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    label_en = fields.Char(required=True, size=160)
    label_ar = fields.Char(size=160)
    tagline_en = fields.Char(size=500)
    tagline_ar = fields.Char(size=500)

    _fu_public_cohort_slug_unique = models.UniqueIndex("(company_id, program_id, slug)")

    @api.constrains("program_id", "company_id")
    def _fu_validate_company(self):
        for record in self:
            if record.program_id.company_id != record.company_id:
                raise ValidationError(_("Public cohort and program must use the same company."))

    def _fu_public_payload(self, language):
        self.ensure_one()
        return {
            "slug": self.slug,
            "label": _localized(self, "label_en", "label_ar", language),
            "tagline": _localized(self, "tagline_en", "tagline_ar", language),
            "order": self.sequence,
        }


class FuPublicGarment(models.Model):
    _name = "fu.public.garment"
    _description = "Fares Public Garment"
    _inherit = "fu.public.slug.mixin"
    _order = "sequence, id"
    _rec_name = "name_en"

    program_id = fields.Many2one(
        "fu.public.program",
        required=True,
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    product_id = fields.Many2one(
        "product.template",
        ondelete="set null",
        check_company=True,
    )
    name_en = fields.Char(required=True, size=160)
    name_ar = fields.Char(size=160)
    category_en = fields.Char(required=True, size=120)
    category_ar = fields.Char(size=120)
    inspection_mode = fields.Selection(
        [("flat", "Flat / front-back"), ("exploded", "Exploded")],
        required=True,
        default="flat",
    )
    media_ids = fields.One2many("fu.public.media", "garment_id")

    _fu_public_garment_slug_unique = models.UniqueIndex("(company_id, program_id, slug)")

    @api.constrains("program_id", "company_id")
    def _fu_validate_company(self):
        for record in self:
            if record.program_id.company_id != record.company_id:
                raise ValidationError(_("Public garment and program must use the same company."))

    def _fu_public_payload(self, language):
        self.ensure_one()
        public_media = _published(self.media_ids).filtered(
            lambda media: media.rights_state == "approved"
        )
        return {
            "slug": self.slug,
            "name": _localized(self, "name_en", "name_ar", language),
            "category": _localized(self, "category_en", "category_ar", language),
            "inspection_mode": self.inspection_mode,
            "media": [media._fu_public_payload(language) for media in public_media],
        }


class FuPublicLook(models.Model):
    _name = "fu.public.look"
    _description = "Fares Public Look"
    _inherit = "fu.public.slug.mixin"
    _order = "sequence, id"
    _rec_name = "label_en"

    program_id = fields.Many2one(
        "fu.public.program",
        required=True,
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    label_en = fields.Char(required=True, size=160)
    label_ar = fields.Char(size=160)
    cohort_ids = fields.Many2many(
        "fu.public.cohort",
        "fu_public_look_cohort_rel",
        "look_id",
        "cohort_id",
    )
    garment_ids = fields.Many2many(
        "fu.public.garment",
        "fu_public_look_garment_rel",
        "look_id",
        "garment_id",
    )

    _fu_public_look_slug_unique = models.UniqueIndex("(company_id, program_id, slug)")

    @api.constrains("program_id", "company_id", "cohort_ids", "garment_ids")
    def _fu_validate_relationships(self):
        for record in self:
            if record.program_id.company_id != record.company_id:
                raise ValidationError(_("Public look and program must use the same company."))
            if any(cohort.program_id != record.program_id for cohort in record.cohort_ids):
                raise ValidationError(_("Public look cohorts must belong to the same program."))
            if any(garment.program_id != record.program_id for garment in record.garment_ids):
                raise ValidationError(_("Public look garments must belong to the same program."))

    def _fu_public_payload(self, language):
        self.ensure_one()
        cohorts = _published(self.cohort_ids)
        garments = _published(self.garment_ids)
        return {
            "slug": self.slug,
            "label": _localized(self, "label_en", "label_ar", language),
            "cohorts": [record.slug for record in cohorts],
            "garments": [record.slug for record in garments],
            "order": self.sequence,
        }


class FuPublicMedia(models.Model):
    _name = "fu.public.media"
    _description = "Fares Public Media"
    _inherit = "fu.public.publication.mixin"
    _order = "sequence, id"
    _rec_name = "public_url"

    program_id = fields.Many2one(
        "fu.public.program",
        required=True,
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    garment_id = fields.Many2one(
        "fu.public.garment",
        ondelete="cascade",
        check_company=True,
        index=True,
    )
    role = fields.Selection(
        [
            ("hero", "Hero"),
            ("lineup", "Lineup"),
            ("garment", "Garment"),
            ("detail", "Detail"),
            ("social", "Social"),
        ],
        required=True,
    )
    view = fields.Selection(
        [
            ("worn", "Worn"),
            ("front", "Front"),
            ("back", "Back"),
            ("detail", "Detail"),
            ("layer", "Layer"),
        ],
        required=True,
    )
    public_url = fields.Char(size=1000)
    private_object_key = fields.Char(size=512)
    width = fields.Integer()
    height = fields.Integer()
    decorative = fields.Boolean(default=False)
    alt_en = fields.Char(size=500)
    alt_ar = fields.Char(size=500)
    caption_en = fields.Text()
    caption_ar = fields.Text()
    rights_state = fields.Selection(
        [("private", "Private / not approved"), ("approved", "Approved")],
        required=True,
        default="private",
        index=True,
    )
    source_classification = fields.Selection(
        [("real", "Real"), ("archive", "Archive"), ("synthetic", "Synthetic")],
        required=True,
        default="synthetic",
    )
    content_hash = fields.Char(size=64)
    credit = fields.Char(size=250)

    @api.constrains("program_id", "garment_id", "company_id")
    def _fu_validate_relationships(self):
        for record in self:
            if record.program_id.company_id != record.company_id:
                raise ValidationError(_("Public media and program must use the same company."))
            if record.garment_id and record.garment_id.program_id != record.program_id:
                raise ValidationError(_("Public media garment must belong to the same program."))

    @api.constrains(
        "publication_state",
        "rights_state",
        "public_url",
        "width",
        "height",
        "decorative",
        "alt_en",
    )
    def _fu_validate_publication(self):
        for record in self:
            if record.publication_state != "published":
                continue
            if record.rights_state != "approved":
                raise ValidationError(_("Published public media requires approved rights."))
            if not (record.public_url or "").startswith("https://"):
                raise ValidationError(_("Published public media requires an HTTPS public URL."))
            if record.width <= 0 or record.height <= 0:
                raise ValidationError(_("Published public media requires positive dimensions."))
            if not record.decorative and not (record.alt_en or "").strip():
                raise ValidationError(_("Informative published media requires English alt text."))

    def _fu_public_payload(self, language):
        self.ensure_one()
        if self.publication_state != "published" or self.rights_state != "approved":
            raise ValidationError(_("This media is not public."))
        return {
            "url": self.public_url,
            "role": self.role,
            "view": self.view,
            "width": self.width,
            "height": self.height,
            "decorative": self.decorative,
            "alt": "" if self.decorative else _localized(self, "alt_en", "alt_ar", language),
            "caption": _localized(self, "caption_en", "caption_ar", language),
        }
