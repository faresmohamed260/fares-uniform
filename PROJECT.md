# Fares Uniform project

## Confirmed brief

- Product: ERP for Fares Uniform, a small clothing/uniform business.
- Repository: `faresmohamed260/fares-uniform`.
- Source of truth: repository code and documentation; chat memory is secondary.
- Execution: remote-only through GitHub and hosted CI. Do not use a local/scratch project source tree.
- Odoo Community is the operational/domain core; Fares addons extend rather than duplicate native product, POS, CRM, sale, payment and stock truth.
- Initial public-web deployment target is Vercel; no production deployment is authorized yet.

## Current state — 2026-09-12

**Phase 0 Discovery: COMPLETE. Phase 0A Hosted Odoo proof: PASS. Phase 0B Foundation architecture/UX: COMPLETE. Phase 1 Products/stock/access: COMPLETE. Phase 2A Retail checkout/offline: COMPLETE. Phase 2B Preorder/balance/collection: COMPLETE. Phase 2C Retail refunds/size exchanges: COMPLETE. Phase 3A Preorder production: COMPLETE. Phase 3B Business-client workflow: COMPLETE. Phase 4A Public catalog/enquiry: COMPLETE / VERIFIED. Phase 4B Operational reporting: ACTIVE / CONTRACT DEFINED.**

Current branch: `phase-4b/operational-reporting`.

Phase 4B starts from Phase 4A documentation lineage `93e371b663b4013604e78b3ec6d952d3c6eca6ab` and preserves authoritative Phase 4A application/test SHA **`76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`**. Later documentation commits do not supersede the tested Phase 4A application authority.

Final Phase 4A hosted authority remains:
- workflow/run name in GitHub: `Phase 4A public catalog`, run `34645790055`;
- Odoo job: `103416127166` — success;
- public-web job: `103416127191` — success;
- Odoo combined Phase 1–4A suite: **132 tests, 0 failures, 0 errors**;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api` — success;
- Odoo artifact ID: `10282160116`, digest `sha256:db028329872a2b0cc5bf26047a1ba010176d3e8ee2f39470fa0e821d3330cb74`;
- public-web Playwright: **8/8 tests passed**;
- web artifact ID: `10281873247`, digest `sha256:d25b710795ed46e53cde5b2fd22162f54402077bc3d3eee1fcdff73577d9ebe8`.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

Odoo Community remains private operational truth. Public presentation is a separate Next.js surface that consumes only the narrow Fares-owned public API. Internal operational reporting remains inside authenticated Odoo and must not broaden the anonymous Phase 4A surface.

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
Authoritative application/test SHA `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`; 132 Odoo tests plus repeatable six-addon upgrade and 8/8 public-web Playwright tests. Contract and evidence are in the Phase 4A docs. The five-field public DTO and exact enquiry allowlist remain frozen unless evidence/new approved requirements reopen them.

## Active implementation phase

### Phase 4B — operational reporting

Contract: `docs/phases/PHASE_4B_OPERATIONAL_REPORTING.md`.

Architecture: `docs/architecture/PHASE_4B_REPORTING_MODEL.md`.

Validation: `docs/validation/PHASE_4B_OPERATIONAL_REPORTING.md`.

Accepted implementation definitions:
- **daily sales** = completed retail POS gross/refund/net on `pos.order.date_order`; preorder/B2B deposits/order totals are not silently treated as sales because no accepted recognition event exists yet;
- **Cash/InstaPay totals** = dated payment movement from native POS payments plus valid posted preorder/B2B payments, split inflow/refund-outflow/net and with configuration drift surfaced rather than hidden;
- **low stock** = native reservation-aware available quantity at/below an explicit per-product/per-location warning threshold; no numeric default is invented;
- **upcoming/overdue** = live incomplete preorder pickup / confirmed B2B delivery deadlines compared with current `as_of`;
- **customer balances** = existing live preorder/B2B balance logic, with Store Manager restricted to assigned-store preorder scope and Owner/Admin able to see current-company B2B;
- company partner timezone drives day grouping, with explicit UTC fallback;
- live derived queries are authoritative; transient dashboard rows may be used only as ephemeral presentation state;
- no report export is required in the initial bounded slice because no accepted repository requirement currently mandates one.

Role boundary:
- Owner/Admin: all current-company Phase 4B reports and low-stock warning configuration;
- Store Manager: assigned-store operational reporting only, no B2B financial visibility;
- Cashier, Inventory Staff, Production Manager and Sales/BD: no new report access in this slice.

No Phase 4B application SHA is authoritative until exact-head hosted formula/security/browser/public-regression/upgrade evidence passes and retained artifacts are inspected.

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
10. Phase 4A public catalog/enquiry — complete.
11. Phase 4B operational reporting — **active**.
12. Integrated UAT, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Implement `fu_reporting` from the Phase 4B contract without changing Phase 4A's public contract.
3. Add low-stock warning configuration and the server reporting service before UI composition.
4. Add direct formula/security/timezone/location regressions, then EN/AR/RTL native Odoo browser evidence.
5. Add an exact-head Phase 4B hosted gate covering all seven addons and the inherited Phase 4A public-web tests.
6. Prove repeatable seven-addon upgrade, inspect retained logs/screenshots/artifacts, and preserve the exact tested application SHA separately from later docs-only closure commits.
7. Do not merge, deploy, mutate domains/secrets/production resources or migrate real data without explicit authorization.

## Later explicit decisions

Resolve only when their affected work starts:
- B2B deposit refund/forfeiture and credit-note/refund policy;
- post-confirmation business-order amendments;
- any future partial shipment or customer-credit terms;
- tax/legal revenue recognition or invoicing treatment if daily reporting must expand beyond completed retail POS sales;
- report exports/scheduled delivery if requested later;
- tax/legal receipt/business identity details when legally relevant;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed, merged and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
