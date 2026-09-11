import base64
import binascii

from odoo import http
from odoo.exceptions import ValidationError
from odoo.http import request
from odoo.tools.mimetypes import guess_mimetype

from ..models.public_enquiry import FuPublicEnquiryConflict


class FaresPublicApi(http.Controller):
    @staticmethod
    def _language():
        return "ar" if request.httprequest.args.get("lang") == "ar" else "en"

    @staticmethod
    def _product_domain(slug=None):
        domain = [
            ("fu_public_published", "=", True),
            "|",
            ("company_id", "=", False),
            ("company_id", "=", request.env.company.id),
        ]
        if slug is not None:
            domain.insert(0, ("fu_public_slug", "=", slug))
        return domain

    @staticmethod
    def _find_product(slug):
        return request.env["product.template"].sudo().search(
            FaresPublicApi._product_domain(slug), limit=1
        )

    @http.route(
        "/fu/public/catalog",
        type="http",
        auth="public",
        methods=["GET"],
        readonly=True,
        save_session=False,
    )
    def catalog(self):
        language = self._language()
        products = request.env["product.template"].sudo().search(
            self._product_domain(), order="fu_public_sequence, id"
        )
        return request.make_json_response(
            {"items": [product._fu_public_payload(language) for product in products]}
        )

    @http.route(
        "/fu/public/catalog/<string:slug>",
        type="http",
        auth="public",
        methods=["GET"],
        readonly=True,
        save_session=False,
    )
    def catalog_detail(self, slug):
        product = self._find_product(slug)
        if not product:
            return request.make_json_response({"error": "not_found"}, status=404)
        return request.make_json_response(product._fu_public_payload(self._language()))

    @http.route(
        "/fu/public/catalog/<string:slug>/image",
        type="http",
        auth="public",
        methods=["GET"],
        readonly=True,
        save_session=False,
    )
    def catalog_image(self, slug):
        product = self._find_product(slug)
        if not product or not product.image_1920:
            return request.make_json_response({"error": "not_found"}, status=404)
        try:
            raw = base64.b64decode(product.image_1920)
        except (binascii.Error, TypeError, ValueError):
            return request.make_json_response({"error": "not_found"}, status=404)
        mimetype = guess_mimetype(raw, default="image/png")
        if not mimetype.startswith("image/"):
            return request.make_json_response({"error": "not_found"}, status=404)
        return request.make_response(
            raw,
            headers=[
                ("Content-Type", mimetype),
                ("Cache-Control", "public, max-age=3600"),
                ("X-Content-Type-Options", "nosniff"),
            ],
        )

    @http.route(
        "/fu/public/enquiries",
        type="http",
        auth="public",
        methods=["POST"],
        csrf=False,
        save_session=False,
    )
    def enquiries(self):
        payload = request.httprequest.get_json(silent=True)
        if not isinstance(payload, dict):
            return request.make_json_response(
                {"error": "invalid_request", "message": "JSON object required."},
                status=400,
            )
        try:
            record, created = request.env["fu.public.enquiry"].sudo().fu_create_from_public(
                payload
            )
        except FuPublicEnquiryConflict:
            return request.make_json_response(
                {"error": "idempotency_conflict"}, status=409
            )
        except ValidationError as exc:
            return request.make_json_response(
                {"error": "invalid_request", "message": str(exc)}, status=400
            )
        return request.make_json_response(
            {"status": "accepted", "reference": record.reference},
            status=201 if created else 200,
        )
