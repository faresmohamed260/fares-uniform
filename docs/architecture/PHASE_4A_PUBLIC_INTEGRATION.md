# Phase 4A architecture — public catalog and enquiry boundary

Status: **FINAL / VERIFIED.**

Branch: `phase-4a/public-catalog-enquiry`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authoritative tested application SHA: `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`.

## 1. Ownership

### Odoo owns
- operational `product.template` truth;
- Fares public-publication metadata;
- immutable/append-only public enquiry intake records;
- publication/enquiry validation;
- the allowlisted public catalog serializer;
- narrow `/fu/public/*` HTTP endpoints.

### Next.js owns
- public localized routing/presentation;
- server-side calls to the narrow Odoo endpoints;
- same-origin image/enquiry proxies;
- browser form interaction/accessibility/motion;
- public metadata derived only from already-public DTOs.

### Browser never owns
- Odoo staff credentials;
- arbitrary Odoo RPC;
- direct database access;
- operational product records;
- price, stock, payment, balance, customer/staff-private or internal ERP data.

## 2. Odoo publication boundary

`fu_public_api` extends `product.template` with Fares-owned publication metadata. Publication is opt-in and Owner/Admin-controlled. Ordinary operational products remain private until explicitly published.

The addon validates stable public slug/content and denies unrelated-role mutation. Existing Odoo image data remains the image source; Phase 4A does not create a second operational product/media ledger.

## 3. Exact catalog DTO

Every public list/detail item is validated as exactly:

```text
slug: string
name: string
summary: string
sector: string
image_url: string | null
```

There are no extra properties. This is an allowlist serializer, not a filtered generic `read()`.

Forbidden/publicly absent classes include:
- database/operational IDs;
- SKU/barcode;
- publication-control fields;
- price/currency/cost;
- on-hand/forecast/reserved quantities;
- stock state/locations;
- customer/supplier/payment/balance data;
- accounting/tax internals;
- staff/users/security/internal notes.

## 4. Public HTTP routes

Fares-owned routes:
- `GET /fu/public/catalog?lang=en|ar`;
- `GET /fu/public/catalog/<slug>?lang=en|ar`;
- `GET /fu/public/catalog/<slug>/image`;
- `POST /fu/public/enquiries`.

Unpublished/missing catalog slugs fail closed and do not reveal private-record existence.

## 5. Exact enquiry contract

Allowed request keys:

```text
idempotency_key
contact_name
organization_name
phone
email
sector
message
source_product_slug
language
```

Required:
- `idempotency_key`;
- `contact_name`;
- `organization_name`;
- `sector`;
- `message`;
- at least one of `phone` or `email`;
- `language` exactly `en` or `ar`.

Current Next.js proxy maximum lengths mirror Odoo’s tested public contract:
- idempotency key 120;
- contact name 120;
- organization name 160;
- phone 60;
- email 254;
- sector 120;
- message 4000;
- source product slug 120.

Unknown top-level keys are rejected. In particular, `source_url` is **not** part of the accepted schema and is rejected.

Successful intake:
- normalizes/validates input;
- uses retry-safe identity per company;
- exact replay returns the existing accepted result;
- same retry key with changed normalized data fails closed;
- optional product source resolves only through the public slug boundary;
- creates no sale order, payment, stock operation or automatic CRM/business-order confirmation;
- returns only an accepted status/reference, not private submitted data.

## 6. Next.js provider boundary

Production provider:
- `apps/public-web/lib/public-data.ts` requires `ODOO_BASE_URL` outside fixture mode;
- requests `lang=en|ar` explicitly;
- rejects catalog responses containing any key outside the exact five-field DTO;
- rewrites public images through same-origin `/api/catalog-image/<slug>` rather than exposing a general Odoo data bridge.

CI fixture provider:
- enabled explicitly with `FU_PUBLIC_PROVIDER=fixture`;
- contains only exact five-field public catalog fixtures;
- does not silently activate when `ODOO_BASE_URL` is missing;
- enquiry fixture path runs the same request validation before returning a synthetic accepted response.

The fixture is a deterministic rendering/test provider, not an alternate production schema.

## 7. Integration defect and durable rule

An earlier web implementation passed fixture browser checks while sending unsupported `source_url` and omitting required `sector`. Manual integration review found the mismatch before Phase 4A closure.

Commit `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497` corrected it and added route regressions for:
- valid exact Odoo enquiry schema;
- required sector;
- rejection of unknown `source_url`.

**Durable rule:** fixture/mock providers must never bypass or replace production contract validation. Contract validation must run before a fixture response whenever possible.

## 8. Frontend structure and UX

`apps/public-web` is the production-oriented public surface; `prototype/review-ui` remains historical design reference only.

Phase 4A verified:
- English LTR and Arabic RTL;
- desktop and narrow/mobile layouts;
- keyboard focus/navigation;
- reduced-motion usability;
- no document-level horizontal overflow;
- catalog/detail/enquiry flows;
- no public price/stock wording or internal ERP navigation/control leakage.

## 9. Security and deployment boundary

Anonymous endpoints are intentionally narrower than staff APIs. Controlled `sudo()` may exist only inside a validated service boundary; anonymous callers never receive a model/environment bridge.

Phase 4A closure does not claim production bot/rate-limit protection, final CDN/media provider, production domain/secrets, deployment, or real-data migration. Those require explicit later authorization/evidence.
