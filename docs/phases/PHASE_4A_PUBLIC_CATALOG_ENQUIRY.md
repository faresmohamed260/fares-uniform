# Phase 4A — Public catalog and enquiry

Status: **COMPLETE / VERIFIED.**

Branch: `phase-4a/public-catalog-enquiry`.

Starting lineage: Phase 3B documentation closure head `cb42c8017629d8d5011df82bf6033b91a25f91ac`.

Authoritative inherited application authority: Phase 3B `d6efa76a99c0732423b354d2d9f787f6ccbdebec`.

Authoritative Phase 4A application/test SHA: **`76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`**. Later documentation-only closure commits do not supersede it.

No merge, production deployment, live domain/resource mutation, paid service use or real customer-data migration was performed.

## Goal and result

Phase 4A converted the public-surface prototype into a bounded production-oriented catalog/enquiry slice while preserving the hybrid architecture:

- Odoo remains operational truth;
- anonymous/public access is restricted to a narrow Fares-owned API;
- public catalog output is an explicit allowlist and exposes no price, stock, cost, balances, private customer/staff data or internal notes;
- `apps/public-web` is the bilingual Next.js public presentation surface;
- public enquiry submission uses a strict same-origin/server boundary rather than arbitrary Odoo RPC;
- public enquiry does not automatically create CRM, sale, payment or stock operations;
- WhatsApp/phone remain optional runtime contact routes rather than invented committed values.

## Delivered scope

### A. `fu_public_api`

Implemented:
- opt-in publication metadata on `product.template`;
- Owner/Admin-only publication mutation;
- published catalog list/detail/image routes;
- fail-closed unpublished/missing slugs;
- append-only `fu.public.enquiry` intake;
- per-company retry/idempotency protection;
- Sales/BD and Owner/Admin read scope for enquiry follow-up;
- no anonymous direct model access;
- no operational side effect from enquiry submission.

### B. Exact public catalog DTO

Only these keys are public:

```text
slug
name
summary
sector
image_url
```

`name` and `summary` are localized before serialization. The API/browser contract does not expose database IDs, SKU/barcode, price/currency, cost, stock quantity/state/location, taxes/accounting, customer/supplier, payment/balance, staff/security or internal operational fields.

### C. Exact public enquiry boundary

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

Rules:
- `idempotency_key`, `contact_name`, `organization_name`, `sector` and `message` are required;
- at least one of `phone` or `email` is required;
- language is only `en` or `ar`;
- source product slug is optional and must resolve through the public boundary;
- unknown keys are rejected rather than ignored;
- lengths/types are validated in both the Next.js proxy and Odoo service boundary;
- exact retry is idempotent; conflicting retry fails closed;
- public response does not echo private enquiry contents.

The earlier web draft used unsupported `source_url` and omitted required `sector`. Manual integration review caught this after a fixture-green run. Commit `76eb20a...` fixed the real production contract and added regressions so fixture mode cannot mask that mismatch again.

### D. `apps/public-web`

Implemented:
- `/en` and `/ar` public experiences;
- catalog list/detail presentation;
- public enquiry form;
- bilingual EN/AR copy and true RTL behavior;
- same-origin image/enquiry proxies;
- responsive desktop/narrow layouts;
- keyboard focus/navigation checks;
- reduced-motion checks;
- no document-level horizontal overflow;
- explicit synthetic CI fixture provider.

Production data provider:
- requires `ODOO_BASE_URL` outside fixture mode;
- browser receives no Odoo staff credential or generic RPC endpoint.

CI fixture provider:
- enabled only by `FU_PUBLIC_PROVIDER=fixture`;
- implements the exact five-field catalog DTO;
- enquiry route still validates the exact Odoo request contract before returning a fixture response;
- absence of `ODOO_BASE_URL` outside fixture mode fails closed.

## Explicit exclusions retained

Phase 4A does not include:
- public cart/checkout/purchasing;
- public prices or stock availability;
- customer login/account/order tracking portal;
- public payment collection;
- automatic outbound WhatsApp/SMS/email campaigns;
- paid WhatsApp integration;
- broad CMS or direct Odoo RPC;
- operational reporting;
- production deployment/secrets/domain setup;
- real customer-data migration;
- B2B refund/credit policy or post-confirmation amendments.

## Validation authority

Final exact-head workflow:
- run `34645790055`;
- Odoo job `103416127166` — success;
- public-web job `103416127191` — success;
- combined Phase 1–4A Odoo suite: **132 tests, 0 failures, 0 errors**;
- repeatable six-addon upgrade succeeded;
- public-web gate: **8/8 Playwright tests passed** after clean install, typecheck, production build and Chromium setup;
- EN/AR/RTL desktop+narrow screenshots manually reviewed and passed;
- server and rendered evidence confirmed no forbidden price/stock/private/internal ERP leakage.

See `docs/validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md` for chronology and artifact digests.

## Exit criteria

All Phase 4A exit criteria are satisfied. Closure records application SHA `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`; later docs-only commits are bookkeeping only.

No merge or deployment is implied by closure.
