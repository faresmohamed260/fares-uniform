# Phase 4A architecture — public catalog and enquiry boundary

Status: **ACTIVE IMPLEMENTATION ARCHITECTURE.**

Branch: `phase-4a/public-catalog-enquiry`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## 1. Ownership

Phase 4A preserves the hybrid ownership selected in the foundation architecture.

### Odoo owns
- the operational `product.template` record;
- explicit Fares publication metadata attached to that product template;
- immutable public enquiry intake records;
- server-side publication and enquiry validation;
- the allowlisted public catalog serializer;
- the narrow public HTTP endpoints.

### Next.js owns
- public routing and localized presentation;
- server-side calls to the narrow Odoo endpoints;
- public contact-route configuration;
- browser form interaction, accessibility and motion;
- public SEO/metadata generated from already-public catalog DTOs.

### The browser does not own
- Odoo credentials;
- arbitrary Odoo RPC;
- direct database connectivity;
- operational product records;
- price, stock, payment, balance or customer-private data.

## 2. `fu_public_api` model boundary

### `product.template` extension

Fares-owned fields:
- `fu_public_published` — Boolean, default false;
- `fu_public_slug` — stable public slug, unique when set;
- `fu_public_name_en` — required for publication;
- `fu_public_name_ar` — optional Arabic public title;
- `fu_public_summary_en` — required for publication;
- `fu_public_summary_ar` — optional Arabic public summary;
- `fu_public_sector` — bounded public-facing sector/use-case text, not an operational category replacement;
- `fu_public_sequence` — display ordering only.

Existing Odoo product image data remains the image source. Phase 4A does not duplicate binary media into a second persistence system.

Publication controls are Owner/Admin-only. The API never auto-publishes an operational product.

Publication validation:
- published record requires a non-empty slug;
- published record requires English public name and summary;
- slug is normalized to lowercase ASCII URL-safe tokens by the controlled workflow or rejected;
- duplicate slug is denied;
- publication metadata cannot be mutated by unrelated roles through direct ORM/API writes.

### `fu.public.enquiry`

Fields:
- `idempotency_key` — required unique retry identity;
- `contact_name`;
- `organization_name`;
- `email`;
- `phone`;
- `sector`;
- `message`;
- `language` (`en` / `ar`);
- `source_product_id` — optional Many2one to a currently published product template;
- `submitted_at`;
- `company_id` — company receiving the enquiry.

The intake record is append-only in Phase 4A. Sales/BD and Owner/Admin may read it for follow-up. Public users receive only the response identifier generated for their own submission; there is no public enquiry-list or enquiry-detail endpoint.

No automatic CRM conversion is implemented in this phase. Qualification/handoff can be added later as an explicit staff action without changing the public intake contract.

## 3. Exact public DTO

Catalog list/detail responses expose only:

```text
slug
name
summary
sector
image_url | null
```

`name` and `summary` are localized by the requested language before serialization. The public DTO deliberately omits:
- database IDs;
- internal SKU/barcode;
- publication-control fields;
- price/currency;
- standard cost;
- on-hand/forecast/reserved stock;
- stock locations;
- customer/supplier links;
- taxes/accounting fields;
- sales/purchase metadata;
- staff/user/company-security fields;
- operational notes.

This is an allowlist serializer, not a filtered `read()` result.

## 4. HTTP contract

All routes are Fares-owned controllers. They use ordinary HTTP JSON rather than exposing the deprecated/general Odoo RPC surface.

### `GET /fu/public/catalog`

Query:
- `lang=en|ar`, default `en`.

Response `200`:

```json
{
  "items": [
    {
      "slug": "school-polo",
      "name": "School Polo",
      "summary": "...",
      "sector": "Schools",
      "image_url": "/fu/public/catalog/school-polo/image"
    }
  ]
}
```

Only published records are searched. Ordering is `fu_public_sequence`, then product id for deterministic output.

### `GET /fu/public/catalog/<slug>`

Query:
- `lang=en|ar`, default `en`.

Returns the same single DTO. Missing/unpublished slug returns `404` with a generic error and does not distinguish private-record existence.

### `GET /fu/public/catalog/<slug>/image`

Returns the existing product-template image only when the slug resolves to a published record with image data. Missing/unpublished/no-image returns `404`. MIME type is detected from decoded bytes using Odoo utilities. The route never exposes the underlying record id.

### `POST /fu/public/enquiries`

Content type: `application/json`.

Request:

```json
{
  "idempotency_key": "opaque-client-generated-key",
  "contact_name": "...",
  "organization_name": "...",
  "email": "...",
  "phone": "...",
  "sector": "...",
  "message": "...",
  "language": "en",
  "source_product_slug": "optional-public-slug"
}
```

Rules:
- `idempotency_key`, contact name, organization, sector and message required;
- at least one of email or phone required;
- accepted language only `en`/`ar`;
- source slug, when supplied, must currently be published;
- all values are scalar strings only;
- server trims whitespace and applies maximum lengths;
- unknown top-level keys are rejected rather than ignored;
- idempotent replay with identical normalized data returns the existing enquiry response;
- replay of the same key with different normalized data returns conflict;
- successful submission creates no `sale.order`, payment, stock move/picking or automatic confirmed CRM/business order.

Response `201` for first creation or `200` for exact retry:

```json
{
  "status": "accepted",
  "reference": "ENQ-..."
}
```

The public response does not echo private contact/message data.

## 5. Controller security

Pinned Odoo 19 supports HTTP routes with `save_session=False` and `request.make_json_response`. Phase 4A uses those mechanics.

Catalog routes:
- `auth='public'`;
- `readonly=True` where supported by the route;
- `save_session=False`;
- GET only.

Enquiry route:
- `auth='public'`;
- POST only;
- `csrf=False` because the endpoint is server-to-server/public API JSON rather than an Odoo browser form session;
- `save_session=False`;
- explicit model/service validation before controlled `sudo()` creation.

The controlled `sudo()` boundary is intentionally narrow: anonymous callers never receive an environment/model bridge and can create only normalized `fu.public.enquiry` values approved by the service method.

## 6. Next.js application boundary

Create `apps/public-web` as the production-oriented public surface. Do not turn `prototype/review-ui` into production architecture; it remains Phase 0B visual reference/evidence.

Routes:
- `/en` and `/ar` — landing / large-client proposition;
- `/en/catalog`, `/ar/catalog`;
- `/en/catalog/[slug]`, `/ar/catalog/[slug]`;
- `/en/enquire`, `/ar/enquire`;
- `/api/enquiries` — same-origin browser form handler that forwards only the public enquiry schema to Odoo.

Data provider:
- `FU_PUBLIC_API_BASE_URL` selects the Odoo public API origin server-side;
- no credential is sent to the browser;
- direct Odoo URLs are not embedded in browser components;
- CI may use `FU_PUBLIC_FIXTURE_MODE=1` with a typed no-price/no-stock fixture implementing the exact DTO;
- fixture mode is explicit; absence of both a base URL and fixture mode must fail closed rather than silently showing synthetic production content.

Contact routes:
- `FU_PUBLIC_PHONE` and `FU_PUBLIC_WHATSAPP_URL` are optional public configuration;
- corresponding actions render only when configured;
- no phone number is invented or committed.

## 7. Public frontend structure

Use Server Components for catalog data and metadata by default. Client Components are reserved for interactions requiring browser state: navigation/menu behavior, catalog detail motion where applicable, and enquiry form submission state.

Use `next/image` for renderable public images. Preserve accessible semantic HTML when images are absent.

No cart, checkout, price, stock badge or availability language is part of the public component vocabulary.

The Phase 0B public concept remains a visual reference for:
- emerald brand system;
- spring/shared-layout motion;
- premium large-client hero treatment;
- product-card/detail continuity;
- richer public motion than internal ERP.

Synthetic names, prices and review-only explanatory copy from the prototype are not production content.

## 8. Validation implications

Odoo tests must exercise model-level bypasses and HTTP routes independently.

Web tests must verify both source/data contract and rendered behavior. Browser assertions alone are insufficient for the no-leak rule; typed public fixtures and server provider tests must contain no price/stock properties at all.

CI must retain exact-head Odoo logs, web build/type logs and representative EN/AR screenshots.
