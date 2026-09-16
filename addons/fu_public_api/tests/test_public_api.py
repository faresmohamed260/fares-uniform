import json

from odoo import Command
from odoo.exceptions import AccessError, ValidationError
from odoo.tests import HttpCase, tagged
from odoo.tests.common import TransactionCase

from ..models.public_enquiry import FuPublicEnquiryConflict


@tagged("post_install", "-at_install")
class TestFaresPublicApiModels(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.sales = cls._make_user("sales", cls.env.ref("fu_core.group_fu_sales_bd"))
        cls.cashier = cls._make_user("cashier", cls.env.ref("fu_core.group_fu_cashier"))
        cls.product = cls.env["product.template"].create({"name": "Phase 4A Public Uniform"})

    @classmethod
    def _make_user(cls, suffix, group):
        return cls.env["res.users"].with_context(no_reset_password=True).create(
            {
                "name": f"Phase 4A {suffix}",
                "login": f"phase4a-{suffix}@example.invalid",
                "email": f"phase4a-{suffix}@example.invalid",
                "group_ids": [Command.set([group.id])],
            }
        )

    def _publish(self, product=None):
        product = product or self.product
        product.write(
            {
                "fu_public_slug": "phase-4a-uniform",
                "fu_public_name_en": "Public Uniform Program",
                "fu_public_name_ar": "برنامج زي موحد",
                "fu_public_summary_en": "A synthetic public catalog summary.",
                "fu_public_summary_ar": "وصف عام اصطناعي للكتالوج.",
                "fu_public_sector": "Schools",
                "fu_public_published": True,
            }
        )
        return product

    def _payload(self, **overrides):
        payload = {
            "idempotency_key": "phase4a-model-enquiry-001",
            "contact_name": "Synthetic Buyer",
            "organization_name": "Synthetic Academy",
            "email": "buyer@example.invalid",
            "phone": "",
            "sector": "Schools",
            "message": "We need a synthetic uniform program proposal.",
            "language": "en",
            "source_product_slug": "phase-4a-uniform",
        }
        payload.update(overrides)
        return payload

    def test_publication_is_opt_in_owner_controlled_and_allowlisted(self):
        self.assertFalse(self.product.fu_public_published)
        with self.assertRaises(AccessError):
            self.product.with_user(self.sales).write(
                {
                    "fu_public_slug": "sales-bypass",
                    "fu_public_name_en": "Bypass",
                    "fu_public_summary_en": "Bypass",
                    "fu_public_published": True,
                }
            )

        product = self._publish()
        payload = product._fu_public_payload("en")
        self.assertEqual(
            set(payload), {"slug", "name", "summary", "sector", "image_url"}
        )
        self.assertEqual(payload["slug"], "phase-4a-uniform")
        self.assertEqual(payload["name"], "Public Uniform Program")
        self.assertNotIn("list_price", payload)
        self.assertNotIn("standard_price", payload)
        self.assertNotIn("qty_available", payload)
        self.assertNotIn("default_code", payload)
        self.assertNotIn("id", payload)
        arabic = product._fu_public_payload("ar")
        self.assertEqual(arabic["name"], "برنامج زي موحد")

    def test_publication_validation_fails_closed(self):
        with self.assertRaises(ValidationError):
            self.product.write(
                {
                    "fu_public_slug": "Bad Slug",
                    "fu_public_name_en": "Invalid",
                    "fu_public_summary_en": "Invalid",
                }
            )
        with self.assertRaises(ValidationError):
            self.product.write({"fu_public_published": True})

    def test_enquiry_is_retry_safe_strict_and_side_effect_free(self):
        self._publish()
        tracked_models = [
            name
            for name in ("crm.lead", "sale.order", "account.payment", "stock.picking")
            if name in self.env.registry.models
        ]
        before = {
            name: self.env[name].sudo().search_count([]) for name in tracked_models
        }
        service = self.env["fu.public.enquiry"].sudo()
        enquiry, created = service.fu_create_from_public(self._payload())
        self.assertTrue(created)
        self.assertTrue(enquiry.reference.startswith("ENQ-"))
        replay, replay_created = service.fu_create_from_public(self._payload())
        self.assertFalse(replay_created)
        self.assertEqual(replay, enquiry)
        self.assertEqual(
            service.search_count([("idempotency_key", "=", "phase4a-model-enquiry-001")]),
            1,
        )
        with self.assertRaises(FuPublicEnquiryConflict):
            service.fu_create_from_public(
                self._payload(message="Different data under the same retry identity.")
            )
        for name in tracked_models:
            self.assertEqual(self.env[name].sudo().search_count([]), before[name])

    def test_enquiry_input_and_append_only_guards(self):
        self._publish()
        service = self.env["fu.public.enquiry"].sudo()
        with self.assertRaises(ValidationError):
            service.fu_create_from_public(self._payload(unknown="nope"))
        with self.assertRaises(ValidationError):
            service.fu_create_from_public(self._payload(email="", phone=""))
        with self.assertRaises(ValidationError):
            service.fu_create_from_public(self._payload(language="fr"))
        with self.assertRaises(ValidationError):
            service.fu_create_from_public(
                self._payload(source_product_slug="private-or-missing")
            )
        with self.assertRaises(AccessError):
            service.create(
                {
                    "reference": "ENQ-BYPASS",
                    "idempotency_key": "bypass",
                    "contact_name": "Bypass",
                    "organization_name": "Bypass",
                    "sector": "Bypass",
                    "message": "Bypass",
                    "language": "en",
                }
            )
        enquiry, _created = service.fu_create_from_public(self._payload())
        with self.assertRaises(AccessError):
            enquiry.write({"message": "rewrite"})
        with self.assertRaises(AccessError):
            enquiry.unlink()

    def test_enquiry_staff_visibility_is_read_only_and_bounded(self):
        self._publish()
        enquiry, _created = self.env["fu.public.enquiry"].sudo().fu_create_from_public(
            self._payload()
        )
        self.assertEqual(enquiry.with_user(self.sales).reference, enquiry.reference)
        with self.assertRaises(AccessError):
            enquiry.with_user(self.sales).write({"message": "sales rewrite"})
        with self.assertRaises(AccessError):
            enquiry.with_user(self.cashier).read(["reference"])


@tagged("post_install", "-at_install")
class TestFaresPublicApiHttp(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.env.user.group_ids += cls.env.ref("fu_core.group_fu_owner_admin")
        cls.published = cls.env["product.template"].create({"name": "HTTP Public Product"})
        cls.published.write(
            {
                "fu_public_slug": "http-public-product",
                "fu_public_name_en": "Hospitality Uniform Program",
                "fu_public_name_ar": "برنامج زي للضيافة",
                "fu_public_summary_en": "A public hospitality uniform summary.",
                "fu_public_summary_ar": "وصف عام لزي الضيافة.",
                "fu_public_sector": "Hospitality",
                "fu_public_sequence": 5,
                "fu_public_published": True,
            }
        )
        cls.private = cls.env["product.template"].create({"name": "Private Product"})
        cls.private.write(
            {
                "fu_public_slug": "private-product",
                "fu_public_name_en": "Private",
                "fu_public_summary_en": "Must never serialize.",
            }
        )

    def _http_payload(self, **overrides):
        payload = {
            "idempotency_key": "phase4a-http-enquiry-001",
            "contact_name": "HTTP Buyer",
            "organization_name": "HTTP Synthetic Hotel",
            "email": "http@example.invalid",
            "phone": "",
            "sector": "Hospitality",
            "message": "We need hotel uniforms.",
            "language": "en",
            "source_product_slug": "http-public-product",
        }
        payload.update(overrides)
        return payload

    def _post_json(self, payload):
        return self.url_open(
            "/fu/public/enquiries",
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )

    def test_catalog_http_is_allowlisted_and_hides_unpublished(self):
        response = self.url_open("/fu/public/catalog?lang=en")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        item = next(
            entry for entry in body["items"] if entry["slug"] == "http-public-product"
        )
        self.assertEqual(
            set(item), {"slug", "name", "summary", "sector", "image_url"}
        )
        serialized = json.dumps(body, ensure_ascii=False)
        self.assertNotIn("private-product", serialized)
        for forbidden in (
            "list_price",
            "standard_price",
            "qty_available",
            "virtual_available",
            "default_code",
            "barcode",
        ):
            self.assertNotIn(forbidden, serialized)

        detail = self.url_open("/fu/public/catalog/http-public-product?lang=ar")
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.json()["name"], "برنامج زي للضيافة")
        private = self.url_open("/fu/public/catalog/private-product")
        self.assertEqual(private.status_code, 404)
        missing_image = self.url_open("/fu/public/catalog/http-public-product/image")
        self.assertEqual(missing_image.status_code, 404)

    def test_enquiry_http_retry_conflict_and_validation(self):
        first = self._post_json(self._http_payload())
        self.assertEqual(first.status_code, 201)
        first_body = first.json()
        self.assertEqual(first_body["status"], "accepted")
        self.assertEqual(set(first_body), {"status", "reference"})

        replay = self._post_json(self._http_payload())
        self.assertEqual(replay.status_code, 200)
        self.assertEqual(replay.json()["reference"], first_body["reference"])

        conflict = self._post_json(self._http_payload(message="Changed retry payload"))
        self.assertEqual(conflict.status_code, 409)
        self.assertEqual(conflict.json()["error"], "idempotency_conflict")

        invalid = self._post_json(self._http_payload(unexpected="field"))
        self.assertEqual(invalid.status_code, 400)
        self.assertEqual(invalid.json()["error"], "invalid_request")
