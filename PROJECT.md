# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Initial public-web deployment target is Vercel; no production deployment is authorized yet.

## Current state — 2026-09-12

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED.**

Current branch: `phase-4a/public-catalog-enquiry`.

Authoritative Phase 4A application/test SHA: **`76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`**. Later documentation-only commits do not supersede this application authority.

Final Phase 4A hosted authority:
- workflow: `Phase 4A public catalog and enquiry`;
- run: `34645790055`;
- Odoo job: `103416127166` — success;
- public-web job: `103416127191` — success;
- Odoo combined Phase 1–4A suite: **132 tests, 0 failures, 0 errors**;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api` — success;
- Odoo artifact ID: `10282160116`;
- Odoo artifact digest: `sha256:db028329872a2b0cc5bf26047a1ba010176d3e8ee2f39470fa0e821d3330cb74`;
- public-web Playwright: **8/8 tests passed** after `npm ci`, typecheck, production build and Chromium setup;
- web artifact ID: `10281873247`;
- web artifact digest: `sha256:d25b710795ed46e53cde5b2fd22162f54402077bc3d3eee1fcdff73577d9ebe8`;
- final EN/AR/RTL desktop+narrow screenshots manually reviewed — pass.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

Odoo Community remains private operational truth. Public presentation is a separate Next.js surface that consumes only a narrow Fares-owned HTTP API. The browser receives no staff credentials, arbitrary Odoo RPC, direct database access, price, stock or private operational data.

Confirmed product/stock rules remain:
- school/client-specific designs are distinct stocked products when units are not interchangeable;
- sizes remain configurable per product family;
- permanent variant codes use `FU-000001` style;
- one retail store and one storage location are currently confirmed;
- Cash and InstaPay are current payment methods; cards/wallets are future work;
- public catalog exposes neither price nor stock;
- numeric volumes, service budget and launch date remain unknown and must not be invented.

## Completed implementation phases

### Phase 1 — products, finished stock and access
Authoritative tested application: `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`. See `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

### Phase 2A — ordinary retail checkout/offline
Complete under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md` and `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

### Phase 2B — preorder, balance and partial collection
Authoritative application/test SHA `af64b858cf6f2be6a143bb19e836721abc216221`.

### Phase 2C — retail refunds and size exchanges
Authoritative application/test SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`; 82/82 tests plus repeatable three-addon upgrade.

### Phase 3A — preorder production queue/workflow
Authoritative application/test SHA `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`; 93 tests plus repeatable four-addon upgrade.

### Phase 3B — business-client workflow
Authoritative application/test SHA `d6efa76a99c0732423b354d2d9f787f6ccbdebec`; 118 tests plus repeatable five-addon upgrade. Native CRM/Sales/payment/stock records remain truth. Negotiated deposit, full balance before release, no partial shipment, post-payment change approval and bounded Cash/InstaPay payment workflows are implemented. B2B refund/credit and post-confirmation amendment policy remain deferred.

### Phase 4A — public catalog and enquiry

Contract: `docs/phases/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md`.

Architecture: `docs/architecture/PHASE_4A_PUBLIC_INTEGRATION.md`.

Validation: `docs/validation/PHASE_4A_PUBLIC_CATALOG_ENQUIRY.md`.

Delivered and verified:
- `fu_public_api` with opt-in Owner/Admin publication metadata on `product.template`;
- public DTO allowlist exactly `slug`, `name`, `summary`, `sector`, `image_url`;
- anonymous list/detail/image endpoints that fail closed for unpublished products;
- append-only, retry-safe public enquiry intake with no automatic CRM/order/payment/stock side effects;
- `apps/public-web` Next.js bilingual EN/AR surface with true RTL, responsive layouts, keyboard/reduced-motion checks and same-origin API proxies;
- production provider requires `ODOO_BASE_URL`; CI fixture mode is explicit through `FU_PUBLIC_PROVIDER=fixture` and must obey the same DTO/enquiry contract;
- enquiry proxy allowlist: `idempotency_key`, `contact_name`, `organization_name`, `phone`, `email`, `sector`, `message`, `source_product_slug`, `language`;
- contact name, organization name, sector and message are required, and at least phone or email is required;
- unknown fields such as the previously used `source_url` are rejected;
- no public price, cost, stock quantity/location, SKU/barcode, customer/payment/staff data or internal ERP controls;
- no public purchasing, checkout, account portal or payment collection.

A manual integration review after an earlier green fixture run caught that the web proxy sent unsupported `source_url` and omitted required `sector`. Commit `76eb20a...` corrected the real schema and added fixture-mode regressions so synthetic CI cannot mask this class of mismatch again.

## Roadmap

1. Phase 0 discovery — complete.
2. Phase 0A hosted Odoo proof — pass.
3. Phase 0B architecture/data/UI foundation — complete.
4. Phase 1 products/stock/access — complete.
5. Phase 2A retail checkout/offline — complete.
6. Phase 2B preorder/balance/collection — complete.
7. Phase 2C consumer retail refunds/size exchanges — complete.
8. Phase 3A preorder production — complete.
9. Phase 3B business-client workflow — complete.
10. Phase 4A public catalog/enquiry — **complete**.
11. Phase 4B operational reporting — **next bounded product work; execution contract not yet written**.
12. Integrated UAT, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Preserve `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497` as the Phase 4A application authority despite later docs-only commits.
3. Start Phase 4B by deriving an execution contract from accepted reporting requirements before writing report code.
4. Accepted report categories already include daily sales, Cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances. Exact formulas, date/time semantics, source records, role visibility, currency/unit treatment, refund/exchange/deposit/cancellation treatment, filters and exports must be defined from repository requirements and pinned Odoo behavior before implementation; do not invent them.
5. Preserve all Phase 1–4A behavior and role/security boundaries with exact-head hosted regression gates.
6. Do not reopen Phase 4A unless evidence demonstrates a regression or a new explicitly approved requirement requires it.
7. No merge, deployment, domain/secret mutation or real-data migration without explicit client authorization.

## Later explicit decisions

Resolve only when their affected work starts:
- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendments;
- any future partial shipment or customer-credit terms;
- operational report formulas/filters/exports and stock-warning thresholds;
- tax/legal receipt/business identity details when legally relevant;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed, merged and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
