import json
from pathlib import Path

from odoo import Command
from odoo.tests import HttpCase, tagged
from odoo.tests.common import TransactionCase


FORBIDDEN_PUBLIC_KEYS = {
    "id",
    "product_id",
    "list_price",
    "standard_price",
    "qty_available",
    "virtual_available",
    "free_qty",
    "default_code",
    "barcode",
    "private_object_key",
    "public_object_key",
    "content_hash",
    "source_classification",
    "credit",
    "rights_state",
    "publication_state",
}


def _all_keys(value):
    if isinstance(value, dict):
        for key, child in value.items():
            yield key
            yield from _all_keys(child)
    elif isinstance(value, list):
        for child in value:
            yield from _all_keys(child)


def _contract_path():
    return Path(__file__).resolve().parents[3] / "contracts" / "public-api-v2.openapi.json"


@tagged("post_install", "-at_install")
class TestFaresPublicV2Schema(TransactionCase):
    def test_openapi_contract_is_source_controlled_exact_and_forbidden_field_free(self):
        contract = json.loads(_contract_path().read_text(encoding="utf-8"))
        self.assertEqual(contract["openapi"], "3.1.0")
        self.assertEqual(
            set(contract["paths"]),
            {
                "/fu/public/v2/home",
                "/fu/public/v2/work",
                "/fu/public/v2/work/{organization}/{program}",
            },
        )
        schemas = contract["components"]["schemas"]
        for name in (
            "Organization",
            "ProgramSummary",
            "WorkSummary",
            "HomeResponse",
            "WorkResponse",
            "VisualSkin",
            "Program",
            "Cohort",
            "Look",
            "PublicMedia",
            "Garment",
            "ProjectResponse",
        ):
            self.assertFalse(
                schemas[name].get("additionalProperties", True),
                f"{name} must reject extra public fields",
            )
        serialized = json.dumps(contract, sort_keys=True)
        for forbidden in (
            "list_price",
            "standard_price",
            "qty_available",
            "virtual_available",
            "free_qty",
            "default_code",
            "barcode",
            "private_object_key",
            "public_object_key",
            "content_hash",
            "source_classification",
            "credit",
            "rights_state",
            "publication_state",
        ):
            self.assertNotIn(forbidden, serialized)


class V2FixtureMixin:
    def _model(self, name):
        self.assertIn(name, self.env.registry.models, f"Phase 10 requires model {name}")
        return self.env[name].sudo()

    def _build_v2_fixture(self):
        organization = self._model("fu.public.organization").create(
            {
                "slug": "synthetic-academy",
                "name_en": "Synthetic Academy",
                "name_ar": "أكاديمية تجريبية",
                "sector_en": "Education",
                "sector_ar": "التعليم",
                "sequence": 10,
                "publication_state": "published",
            }
        )
        program = self._model("fu.public.program").create(
            {
                "organization_id": organization.id,
                "slug": "national-program",
                "title_en": "National Uniform Program",
                "title_ar": "برنامج الزي الوطني",
                "summary_en": "A synthetic published project summary.",
                "summary_ar": "ملخص اصطناعي لمشروع منشور.",
                "brief_en": "A synthetic brief for contract validation only.",
                "brief_ar": "موجز اصطناعي لاختبار العقد فقط.",
                "skin_accent": "#163A5F",
                "skin_accent_secondary": "#A84646",
                "skin_motif": "diagonal-panel",
                "sequence": 10,
                "publication_state": "published",
            }
        )
        public_cohort = self._model("fu.public.cohort").create(
            {
                "program_id": program.id,
                "slug": "senior",
                "label_en": "Senior",
                "label_ar": "المرحلة العليا",
                "tagline_en": "Synthetic cohort",
                "tagline_ar": "مجموعة اصطناعية",
                "sequence": 10,
                "publication_state": "published",
            }
        )
        self._model("fu.public.cohort").create(
            {
                "program_id": program.id,
                "slug": "private-cohort",
                "label_en": "Private Cohort",
                "label_ar": "مجموعة خاصة",
                "sequence": 20,
                "publication_state": "draft",
            }
        )
        product = self.env["product.template"].create(
            {"name": "Operational Synthetic Product", "list_price": 9876.54, "default_code": "INTERNAL-P10"}
        )
        public_garment = self._model("fu.public.garment").create(
            {
                "program_id": program.id,
                "product_id": product.id,
                "slug": "polo",
                "name_en": "Program Polo",
                "name_ar": "قميص بولو البرنامج",
                "category_en": "Polo",
                "category_ar": "بولو",
                "inspection_mode": "flat",
                "sequence": 10,
                "publication_state": "published",
            }
        )
        self._model("fu.public.garment").create(
            {
                "program_id": program.id,
                "slug": "private-garment",
                "name_en": "Private Garment",
                "name_ar": "قطعة خاصة",
                "category_en": "Private",
                "category_ar": "خاص",
                "inspection_mode": "flat",
                "sequence": 20,
                "publication_state": "draft",
            }
        )
        self._model("fu.public.look").create(
            {
                "program_id": program.id,
                "slug": "summer",
                "label_en": "Summer",
                "label_ar": "الصيف",
                "cohort_ids": [Command.set([public_cohort.id])],
                "garment_ids": [Command.set([public_garment.id])],
                "sequence": 10,
                "publication_state": "published",
            }
        )
        self._model("fu.public.media").create(
            {
                "program_id": program.id,
                "role": "hero",
                "view": "worn",
                "public_url": "https://media.example.invalid/projects/synthetic-academy/national-program/hero-a1b2c3.png",
                "private_object_key": "synthetic/private/source/hero.png",
                "public_object_key": "projects/synthetic-academy/national-program/hero-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.png",
                "content_hash": "9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb",
                "width": 1600,
                "height": 2000,
                "decorative": False,
                "alt_en": "Synthetic uniform program hero.",
                "alt_ar": "صورة اصطناعية لبرنامج الزي.",
                "caption_en": "Synthetic fixture.",
                "caption_ar": "بيانات اختبار اصطناعية.",
                "rights_state": "approved",
                "publication_state": "published",
                "sequence": 10,
            }
        )
        self._model("fu.public.media").create(
            {
                "program_id": program.id,
                "garment_id": public_garment.id,
                "role": "garment",
                "view": "front",
                "public_url": "https://media.example.invalid/projects/synthetic-academy/national-program/polo-front-a1b2c3.png",
                "private_object_key": "synthetic/private/source/polo-front.png",
                "public_object_key": "projects/synthetic-academy/national-program/polo-front-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.png",
                "content_hash": "9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb",
                "width": 1200,
                "height": 1500,
                "decorative": False,
                "alt_en": "Synthetic program polo front.",
                "alt_ar": "واجهة قميص بولو اصطناعي.",
                "caption_en": "",
                "caption_ar": "",
                "rights_state": "approved",
                "publication_state": "published",
                "sequence": 10,
            }
        )
        self._model("fu.public.media").create(
            {
                "program_id": program.id,
                "garment_id": public_garment.id,
                "role": "detail",
                "view": "detail",
                "public_url": "https://media.example.invalid/projects/synthetic-academy/national-program/private-detail.png",
                "private_object_key": "synthetic/private/source/rights-private-detail.png",
                "width": 900,
                "height": 900,
                "decorative": False,
                "alt_en": "Must not publish.",
                "alt_ar": "يجب ألا ينشر.",
                "rights_state": "private",
                "publication_state": "draft",
                "sequence": 20,
            }
        )
        private_program = self._model("fu.public.program").create(
            {
                "organization_id": organization.id,
                "slug": "private-program",
                "title_en": "Private Program",
                "title_ar": "برنامج خاص",
                "summary_en": "Must stay private.",
                "summary_ar": "يجب أن يبقى خاصا.",
                "brief_en": "",
                "brief_ar": "",
                "skin_accent": "#222222",
                "skin_accent_secondary": "#444444",
                "skin_motif": "none",
                "sequence": 20,
                "publication_state": "draft",
            }
        )
        return organization, program, private_program


@tagged("post_install", "-at_install")
class TestFaresPublicV2Models(V2FixtureMixin, TransactionCase):
    def test_v2_model_graph_and_project_payload_is_exact(self):
        _organization, program, _private_program = self._build_v2_fixture()
        payload = program._fu_public_payload("en")
        self.assertEqual(set(payload), {"organization", "program", "cohorts", "looks", "garments", "media"})
        self.assertEqual(set(payload["organization"]), {"slug", "name", "sector"})
        self.assertEqual(set(payload["program"]), {"slug", "title", "summary", "brief", "visual_skin"})
        self.assertEqual(set(payload["program"]["visual_skin"]), {"accent", "accent_secondary", "motif"})
        self.assertEqual(set(payload["cohorts"][0]), {"slug", "label", "tagline", "order"})
        self.assertEqual(set(payload["looks"][0]), {"slug", "label", "cohorts", "garments", "order"})
        self.assertEqual(set(payload["garments"][0]), {"slug", "name", "category", "inspection_mode", "media"})
        self.assertEqual(set(payload["garments"][0]["media"][0]), {"url", "role", "view", "width", "height", "decorative", "alt", "caption"})

    def test_v2_locale_and_strict_publication_filtering(self):
        _organization, program, _private_program = self._build_v2_fixture()
        english = program._fu_public_payload("en")
        arabic = program._fu_public_payload("ar")
        self.assertEqual(english["organization"]["name"], "Synthetic Academy")
        self.assertEqual(arabic["organization"]["name"], "أكاديمية تجريبية")
        self.assertEqual([item["slug"] for item in english["cohorts"]], ["senior"])
        self.assertEqual([item["slug"] for item in english["garments"]], ["polo"])
        self.assertEqual(len(english["garments"][0]["media"]), 1)
        serialized = json.dumps(english, ensure_ascii=False)
        self.assertNotIn("private-cohort", serialized)
        self.assertNotIn("private-garment", serialized)
        self.assertNotIn("rights-private-detail", serialized)
        self.assertNotIn("private-detail.png", serialized)

    def test_v2_payload_forbids_operational_ids_price_stock_and_private_r2_metadata(self):
        _organization, program, _private_program = self._build_v2_fixture()
        payload = program._fu_public_payload("en")
        public_keys = set(_all_keys(payload))
        self.assertFalse(public_keys.intersection(FORBIDDEN_PUBLIC_KEYS))
        serialized = json.dumps(payload, sort_keys=True)
        self.assertNotIn("INTERNAL-P10", serialized)
        self.assertNotIn("9876.54", serialized)
        self.assertNotIn("synthetic/private/source/", serialized)
        self.assertNotIn("r2.cloudflarestorage.com", serialized)

    def test_published_media_requires_immutable_public_object_identity_and_public_delivery_url(self):
        organization, program, _private_program = self._build_v2_fixture()
        del organization
        media_model = self._model("fu.public.media")
        with self.assertRaises(ValidationError):
            media_model.create(
                {
                    "program_id": program.id,
                    "role": "hero",
                    "view": "worn",
                    "public_url": "https://9b0bf4a19a68badb653f984151b62fd2.r2.cloudflarestorage.com/fares-uniform-media-private/private.svg",
                    "private_object_key": "phase10/synthetic/source/private.svg",
                    "public_object_key": "projects/synthetic-academy/national-program/private-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.svg",
                    "content_hash": "9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb",
                    "width": 1200,
                    "height": 1500,
                    "decorative": False,
                    "alt_en": "Must not expose the private R2 API endpoint.",
                    "rights_state": "approved",
                    "publication_state": "published",
                }
            )


@tagged("post_install", "-at_install")
class TestFaresPublicV2Http(V2FixtureMixin, HttpCase):
    def test_v2_http_published_routes_locale_and_unknown_slugs_fail_closed(self):
        self._build_v2_fixture()
        home = self.url_open("/fu/public/v2/home?lang=en")
        self.assertEqual(home.status_code, 200)
        self.assertEqual(set(home.json()), {"featured_work"})
        self.assertEqual(home.json()["featured_work"][0]["organization"]["slug"], "synthetic-academy")

        work = self.url_open("/fu/public/v2/work?lang=ar")
        self.assertEqual(work.status_code, 200)
        self.assertEqual(set(work.json()), {"items"})
        self.assertEqual(work.json()["items"][0]["organization"]["name"], "أكاديمية تجريبية")
        self.assertNotIn("private-program", json.dumps(work.json(), ensure_ascii=False))

        detail = self.url_open("/fu/public/v2/work/synthetic-academy/national-program?lang=en")
        self.assertEqual(detail.status_code, 200)
        self.assertFalse(set(_all_keys(detail.json())).intersection(FORBIDDEN_PUBLIC_KEYS))

        missing = self.url_open("/fu/public/v2/work/synthetic-academy/does-not-exist?lang=en")
        self.assertEqual(missing.status_code, 404)
        self.assertEqual(missing.json(), {"error": "not_found"})

        private = self.url_open("/fu/public/v2/work/synthetic-academy/private-program?lang=en")
        self.assertEqual(private.status_code, 404)
        self.assertEqual(private.json(), {"error": "not_found"})

        invalid_locale = self.url_open("/fu/public/v2/work?lang=fr")
        self.assertEqual(invalid_locale.status_code, 400)
        self.assertEqual(invalid_locale.json(), {"error": "invalid_locale"})

        missing_locale = self.url_open("/fu/public/v2/work")
        self.assertEqual(missing_locale.status_code, 400)
        self.assertEqual(missing_locale.json(), {"error": "invalid_locale"})
