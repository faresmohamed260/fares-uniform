import uuid

from odoo import _, api, fields, models
from odoo.exceptions import AccessError, ValidationError


class FuPublicEnquiryConflict(Exception):
    pass


class FuPublicEnquiry(models.Model):
    _name = "fu.public.enquiry"
    _description = "Fares Public Enquiry"
    _order = "submitted_at desc, id desc"

    reference = fields.Char(required=True, readonly=True, index=True, copy=False)
    idempotency_key = fields.Char(required=True, readonly=True, index=True, copy=False)
    contact_name = fields.Char(required=True, readonly=True)
    organization_name = fields.Char(required=True, readonly=True)
    email = fields.Char(readonly=True)
    phone = fields.Char(readonly=True)
    sector = fields.Char(required=True, readonly=True)
    message = fields.Text(required=True, readonly=True)
    language = fields.Selection(
        [("en", "English"), ("ar", "Arabic")], required=True, readonly=True
    )
    source_product_id = fields.Many2one(
        "product.template", readonly=True, ondelete="set null", check_company=True
    )
    submitted_at = fields.Datetime(required=True, readonly=True, default=fields.Datetime.now)
    company_id = fields.Many2one(
        "res.company",
        required=True,
        readonly=True,
        default=lambda self: self.env.company,
    )

    _fu_public_reference_unique = models.UniqueIndex("(reference)")
    _fu_public_idempotency_unique = models.UniqueIndex("(company_id, idempotency_key)")

    _PUBLIC_KEYS = {
        "idempotency_key",
        "contact_name",
        "organization_name",
        "email",
        "phone",
        "sector",
        "message",
        "language",
        "source_product_slug",
    }
    _LIMITS = {
        "idempotency_key": 120,
        "contact_name": 120,
        "organization_name": 160,
        "email": 254,
        "phone": 60,
        "sector": 120,
        "message": 4000,
        "source_product_slug": 120,
    }

    @api.model
    def _fu_public_normalize_text(self, payload, key, required=False):
        value = payload.get(key, "")
        if value is None:
            value = ""
        if not isinstance(value, str):
            raise ValidationError(_("Public enquiry values must be text."))
        value = value.strip()
        limit = self._LIMITS.get(key)
        if limit and len(value) > limit:
            raise ValidationError(_("Public enquiry field '%s' is too long.", key))
        if required and not value:
            raise ValidationError(_("Public enquiry field '%s' is required.", key))
        return value

    @api.model
    def _fu_public_normalize_payload(self, payload):
        if not isinstance(payload, dict):
            raise ValidationError(_("Public enquiry payload must be a JSON object."))
        unknown = set(payload) - self._PUBLIC_KEYS
        if unknown:
            raise ValidationError(_("Unsupported public enquiry fields were supplied."))

        normalized = {
            "idempotency_key": self._fu_public_normalize_text(
                payload, "idempotency_key", required=True
            ),
            "contact_name": self._fu_public_normalize_text(
                payload, "contact_name", required=True
            ),
            "organization_name": self._fu_public_normalize_text(
                payload, "organization_name", required=True
            ),
            "email": self._fu_public_normalize_text(payload, "email"),
            "phone": self._fu_public_normalize_text(payload, "phone"),
            "sector": self._fu_public_normalize_text(payload, "sector", required=True),
            "message": self._fu_public_normalize_text(payload, "message", required=True),
            "source_product_slug": self._fu_public_normalize_text(
                payload, "source_product_slug"
            ),
        }
        language = payload.get("language", "en")
        if language not in {"en", "ar"}:
            raise ValidationError(_("Public enquiry language must be English or Arabic."))
        normalized["language"] = language
        if not normalized["email"] and not normalized["phone"]:
            raise ValidationError(_("Provide at least an email address or phone number."))
        return normalized

    @api.model
    def _fu_public_source_product(self, slug):
        if not slug:
            return self.env["product.template"]
        product = self.env["product.template"].search(
            [
                ("fu_public_slug", "=", slug),
                ("fu_public_published", "=", True),
                "|",
                ("company_id", "=", False),
                ("company_id", "=", self.env.company.id),
            ],
            limit=1,
        )
        if not product:
            raise ValidationError(_("The selected catalog item is not available."))
        return product

    @api.model
    def _fu_public_matches(self, record, normalized, source_product):
        return (
            record.company_id == self.env.company
            and record.contact_name == normalized["contact_name"]
            and record.organization_name == normalized["organization_name"]
            and (record.email or "") == normalized["email"]
            and (record.phone or "") == normalized["phone"]
            and record.sector == normalized["sector"]
            and record.message == normalized["message"]
            and record.language == normalized["language"]
            and record.source_product_id == source_product
        )

    @api.model
    def fu_create_from_public(self, payload):
        """Create one append-only public enquiry under a narrow sudo service boundary."""
        if not self.env.is_superuser():
            raise AccessError(_("Public enquiry intake may only use the controlled service."))
        normalized = self._fu_public_normalize_payload(payload)
        source_product = self._fu_public_source_product(normalized["source_product_slug"])
        lock_key = f"fu-public-enquiry:{self.env.company.id}:{normalized['idempotency_key']}"
        self.env.cr.execute(
            "SELECT pg_advisory_xact_lock(hashtextextended(%s, 0))", [lock_key]
        )
        existing = self.search(
            [
                ("company_id", "=", self.env.company.id),
                ("idempotency_key", "=", normalized["idempotency_key"]),
            ],
            limit=1,
        )
        if existing:
            if not self._fu_public_matches(existing, normalized, source_product):
                raise FuPublicEnquiryConflict(
                    _("This enquiry retry key is already bound to different data.")
                )
            return existing, False

        values = {
            "reference": f"ENQ-{uuid.uuid4().hex[:12].upper()}",
            "idempotency_key": normalized["idempotency_key"],
            "contact_name": normalized["contact_name"],
            "organization_name": normalized["organization_name"],
            "email": normalized["email"] or False,
            "phone": normalized["phone"] or False,
            "sector": normalized["sector"],
            "message": normalized["message"],
            "language": normalized["language"],
            "source_product_id": source_product.id or False,
            "company_id": self.env.company.id,
        }
        record = self.with_context(fu_public_intake=True).create(values)
        return record, True

    @api.model_create_multi
    def create(self, vals_list):
        if not (self.env.is_superuser() and self.env.context.get("fu_public_intake")):
            raise AccessError(_("Public enquiries can only be created by the controlled intake service."))
        return super().create(vals_list)

    def write(self, values):
        if not (self.env.is_superuser() and self.env.context.get("fu_public_maintenance")):
            raise AccessError(_("Submitted public enquiries are append-only."))
        return super().write(values)

    def unlink(self):
        if not (self.env.is_superuser() and self.env.context.get("fu_public_maintenance")):
            raise AccessError(_("Submitted public enquiries are append-only."))
        return super().unlink()
