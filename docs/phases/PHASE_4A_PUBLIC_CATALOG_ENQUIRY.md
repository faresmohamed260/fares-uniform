# Phase 4A — Public catalog and enquiry

Status: **ACTIVE — EXECUTION CONTRACT.**

Branch: `phase-4a/public-catalog-enquiry`.

Starting lineage: Phase 3B documentation closure head `cb42c8017629d8d5011df82bf6033b91a25f91ac`.

Authoritative inherited application authority: Phase 3B `d6efa76a99c0732423b354d2d9f787f6ccbdebec`.

No merge, production deployment, live domain/resource mutation, paid service use or real customer data is authorized by this phase.

## Goal

Turn the existing Phase 0B public-surface prototype into the first bounded production-grade public catalog/enquiry slice while preserving the accepted hybrid architecture:

- Odoo remains operational truth;
- the public browser never receives broad Odoo credentials or general model access;
- public catalog output is explicitly allowlisted and cannot expose prices, stock, costs, balances, private customer/staff data or internal notes;
- a Vercel-targeted Next.js App Router application owns the bilingual public presentation and enquiry UI;
- public enquiry submission uses a narrow validated server boundary rather than arbitrary Odoo RPC;
- WhatsApp and phone remain direct contact routes, configured externally rather than hardcoded from an unconfirmed business number.

## Accepted inherited product rules

This phase does not reopen these decisions:

1. Public catalog shows **no price and no stock availability**.
2. Public presence is bilingual English/Arabic with RTL support.
3. The highest public/marketing priority is acquisition of larger organizations such as schools, restaurant/franchise groups, hotels, hospitals and similar uniform buyers.
4. Product browsing is a secondary public objective; online purchasing is future work.
5. Public contact routes include website enquiry form, WhatsApp and phone.
6. No automated outbound messaging or paid WhatsApp integration is implied.
7. Operational Odoo product/customer/order/payment/stock records remain private server-side truth.
8. Public media/storage/provider choice must not be hardwired into the catalog contract.
9. The accepted public visual direction may use richer motion/morphing than dense ERP screens, while reduced-motion, keyboard accessibility and mobile layouts remain mandatory.

## Bounded Phase 4A scope

### A. Public Odoo projection addon

Create `fu_public_api` as the narrow public integration boundary described by the foundation architecture.

The first catalog projection may expose only explicitly approved public fields. Initial safe schema:
- stable public identifier/slug owned by the Fares addon;
- English public name;
- Arabic public name when provided;
- English public summary/description;
- Arabic public summary/description when provided;
- public category/sector label from a controlled Fares field;
- public hero/product image through a dedicated public-media endpoint or explicitly encoded public image value;
- publish/unpublish state;
- optional display ordering.

The schema must not derive or serialize price, `lst_price`, costs, stock quantities, stock state, locations, customer identities, supplier data, payment data, internal notes, staff/security data or operational identifiers that create unnecessary information disclosure.

### B. Public catalogue curation

Add explicit Fares-owned publication metadata to the Odoo product-template boundary instead of treating every product as public automatically.

Publication is opt-in. An ordinary operational product must remain absent from public responses until an authorized staff member explicitly marks it published and supplies any required public content.

Owner/Admin owns publication controls in this first slice. Do not grant product/publication mutation to Sales/BD merely because Sales/BD handles enquiries.

### C. Public enquiry intake

Create a dedicated enquiry record/endpoint with a strict allowlist. Initial accepted form intent is business acquisition, not public checkout.

Required form inputs:
- contact name;
- organization/business name;
- at least one contact route: phone or email;
- sector/use case;
- free-text requirement/message;
- language/context metadata;
- optional source product public identifier.

Server rules:
- reject arbitrary model/field/method input;
- trim and bound text lengths;
- require positive consent/submit action rather than background capture;
- never accept payment/order/stock instructions from the public payload;
- create one attributable public-enquiry identity using an idempotency key to prevent accidental duplicate submission retries;
- preserve submitted data without silently creating a confirmed sale/order/payment;
- handoff into the existing CRM/business-client workflow must be explicit and controlled; first slice may keep the intake record separate if automatic CRM conversion would broaden authority or invent qualification policy.

### D. Next.js public application

Promote the existing `prototype/review-ui` public visual language into a dedicated public app surface rather than reusing the giant internal review shell as production architecture.

Required first-release public routes:
- landing / large-client value proposition;
- catalog listing;
- catalog detail;
- enquiry form;
- direct WhatsApp/phone actions when corresponding runtime configuration exists;
- language switching for English/Arabic.

The application must not contain synthetic Phase 0B client names or prices as production content.

Data access:
- browser -> Next.js server boundary;
- Next.js server -> narrow Fares public API;
- no browser-held staff credentials;
- no direct browser-to-general Odoo RPC;
- no public database connection.

For hosted CI before a real Odoo/Vercel integration environment is authorized, a typed synthetic fixture may be used to validate rendering and no-leak contracts, but it must implement the exact same allowlisted public DTO and be clearly test-only.

### E. UI/UX requirements

Reuse the accepted design system and maintained primitives.

Required evidence:
- English LTR desktop and narrow/mobile;
- Arabic RTL desktop and narrow/mobile;
- keyboard navigation and visible focus;
- reduced-motion mode;
- no document-level horizontal overflow;
- catalog detail interaction remains accessible without motion;
- enquiry form validation and success/error states are legible;
- no price or stock wording/data appears in public catalog payloads or rendered pages;
- no internal ERP navigation/synthetic review controls leak onto public pages.

## Explicit exclusions

Phase 4A does not include:
- online purchasing/cart/checkout;
- public prices;
- public stock availability or quantity;
- customer login/account portal;
- order tracking portal;
- automated WhatsApp/SMS/email outbound campaigns;
- paid WhatsApp API integration;
- public payment collection;
- SEO/content-management back office beyond bounded metadata necessary for this slice;
- final production domain, CDN/media vendor, hosting account or secrets configuration;
- real customer/business data migration;
- operational reports (Phase 4B);
- B2B refund/credit policy or post-confirmation order amendments.

## Security boundary

Public endpoints are anonymous by design and therefore must be narrower than ordinary staff APIs.

Mandatory properties:
- allowlisted response DTO; forbidden internal fields do not exist in serializer output;
- publication is explicit opt-in;
- unpublished product IDs/slugs fail closed;
- detail endpoint cannot be used to enumerate private operational products;
- enquiry endpoint validates type/length/required fields server-side;
- stable idempotency identity for duplicate form retries;
- rate-limit/provider integration may be added at deployment, but Phase 4A tests must not claim provider-level bot protection without evidence;
- no arbitrary Odoo model/method bridge;
- no user/session/security data returned publicly.

## Validation contract

The Phase 4A hosted gate must prove the exact application SHA.

### Odoo gate

Install/upgrade:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api`

Run all existing Phase 1–3B regressions plus Phase 4A public API/security tests.

At minimum prove:
- operational products are unpublished by default;
- only explicitly published templates appear;
- public catalog/list/detail response contains only the documented allowlist;
- price/stock/cost/private fields cannot be requested through the public API;
- unpublished/missing items fail closed;
- Owner/Admin can curate publication metadata through the bounded model/UI;
- unrelated roles do not gain product-publication mutation;
- valid enquiry submission is stored once under retry;
- malformed/oversized/under-specified payloads are rejected;
- enquiry submission creates no sale order, payment or stock effect;
- all inherited Phase 1–3B tests remain green;
- repeatable six-addon upgrade succeeds.

### Web gate

On the exact public-app SHA:
- clean dependency install from committed lockfile;
- TypeScript check;
- production `next build`;
- Playwright or equivalent hosted browser checks for EN/AR, desktop/narrow, keyboard focus, reduced motion and enquiry validation;
- source/rendered assertions that public price/stock/internal controls are absent;
- retain rendered screenshots/logs as CI evidence.

## Documentation outputs

Before closure update:
- this phase contract;
- `docs/architecture/PHASE_4A_PUBLIC_INTEGRATION.md` with final Odoo/Next.js ownership and DTO/enquiry schema;
- `docs/validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md` with red/green chronology and exact hosted evidence;
- `PROJECT.md`;
- `docs/README.md`;
- `docs/DECISIONS.md` only when a durable design/architecture decision needs a new decision entry.

## Exit criteria

Phase 4A closes only when:
1. the narrow Odoo public projection and enquiry boundary are implemented;
2. public publication is opt-in and role-bounded;
3. public payload/rendered UI cannot expose price, stock or private operational data;
4. the dedicated bilingual Next.js public catalog/enquiry surface is implemented from the accepted visual direction without synthetic review content;
5. EN/AR/RTL desktop+narrow, keyboard and reduced-motion evidence passes;
6. the exact implementation SHA passes the combined Phase 1–4A Odoo regression and repeatable six-addon upgrade;
7. the public app passes exact-SHA type/build/browser gates;
8. closure documentation records exact evidence and separates tested application SHA from later docs-only lineage.

No merge or deployment is implied by Phase 4A closure.
