# Phase 5 validation — integrated UAT and onboarding

Status: **COMPLETE / VERIFIED, 2026-09-12.**

Branch: `phase-5/integrated-uat-onboarding`.

Starting documentation lineage: `f71acb24c7cdbd850c0737edf78cf93375490e9a`.

Inherited Phase 4B application authority: `29b2589e7e71271071f97c9de57dfb97b49b100d`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

**Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.** Later documentation-only commits do not supersede this tested authority.

## Exact-head closure authority

Workflow `Phase 5 integrated UAT`, run **`34698087230`**, tested exact Fares SHA `5d23e56e72122014a7f886ee7f4ec24d3153c78a` against the pinned Odoo SHA.

Odoo/UAT job **`103564935283` — SUCCESS**:
- seven production addons plus test-only `fu_uat` installed together;
- combined inherited + integrated result: **148 tests, 0 failures, 0 errors**;
- `fu_uat` statistics: **6 test units**; all four joined release-journey methods ran;
- repeatable upgrade of production addons `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`: **SUCCESS** on the same database/SHA (`Modules loaded.` observed);
- Odoo/UAT artifact ID **`10298859526`**, name `phase5-odoo-uat-5d23e56e72122014a7f886ee7f4ec24d3153c78a`, digest **`sha256:510f57a2f1b8c6cfc9b6627c086240b1e03a069112c8780c0cc51bb78f28c0c5`**.

Public-web job **`103564935388` — SUCCESS**:
- exact-head checkout: success;
- `npm ci`: success;
- typecheck: success;
- production build: success;
- Playwright: **8/8 passed**;
- web artifact ID **`10298634549`**, name `phase5-web-5d23e56e72122014a7f886ee7f4ec24d3153c78a`, digest **`sha256:cabf625930954e29dfd413cbfc24c5c5c4cf95713c15cd754bc3e64b0f44dc5f`**.

Runtime evidence records Python 3.12.14, Chrome 152.0.7977.82, rtlcss 4.3.0, Node 22.23.2, Next.js 16.3.4 and Playwright 1.63.0. These versions are evidence, not production-version commitments.

## Scenario evidence matrix

| # | Release journey | Exact-head proof | Result |
| --- | --- | --- | --- |
| 1 | Product/variant + stock custody | `TestFaresPhase5Uat.test_onboarding_product_stock_and_role_scope_journey`: FU variant identity/barcodes, opening stock, internal transfer, idempotent replay, cashier mutation denial, manager location scope | **PASS** |
| 2 | Retail sale + offline reconciliation | joined retail sale/refund/report journey plus inherited same-SHA Phase 2A offline Cash/InstaPay reload/reconnect/idempotency/revoked-cashier browser tests | **PASS** |
| 3 | Preorder + size-specific production trigger | `test_preorder_production_receipt_collection_and_reporting_journey`: S/M demand creates distinct production tasks under explicit trigger config | **PASS** |
| 4 | Finish → store receipt → partial collection after full balance | same joined journey proves factory finish does not create store stock, explicit receipt/allocation, unpaid collection denial, full-balance partial collection, final closure | **PASS** |
| 5 | Refund / size exchange | joined controlled retail refund/report assertions plus inherited exact-head controlled returns/exchange browser/security/offline tests | **PASS** |
| 6 | Business-client order lifecycle | `test_business_public_and_reporting_boundaries_journey`: enquiry/sample/quotation/deposit/confirm/full balance/release shipment and live-report removal | **PASS** |
| 7 | Public EN/AR catalog + enquiry without leakage | exact five-field model payload + enquiry idempotency/security in UAT; public web typecheck/build + 8/8 EN/AR/browser tests | **PASS** |
| 8 | Operational reports reconcile to UAT facts | joined preorder/retail/B2B reporting assertions plus inherited exact-head reporting browser contract and offline-unsynced disclosure | **PASS** |
| 9 | Role/security + bilingual/capability boundaries | direct role/location denials, inherited server security gates, EN/AR/RTL/narrow browser evidence; P2 partial internal Arabic-label localization noted below | **PASS WITH P2 FINDING** |

## Onboarding rehearsal result

The hosted synthetic setup exercised the release setup sequence without source edits for company-specific values: Fares Store/Storage initialization, named synthetic users/roles/location assignments, configurable size variants with permanent item codes/barcodes, attributable opening/transfer stock, Cash/InstaPay data classification, explicit preorder-production trigger configuration, publishable public catalog/enquiry data, reporting and role-scope smoke checks.

The exact-head inherited test suite additionally covers low-stock warning configuration, POS/offline behavior and full role/security boundaries. No real customer, bank, staff or inventory data was used.

## Manual evidence review

The retained artifacts were downloaded for evidence inspection only. Representative captures inspected manually include:
- `stock_ar_desktop_20260912_140542_983472_test_stock_operation_arabic_rtl.png`;
- `preorder_collection_ar_narrow_reduced_20260912_140722_090829_test_preorder_partial_collection_arabic_rtl.png`;
- `returns_exchange_ar_narrow_reduced_20260912_140641_861589_test_returns_exchange_arabic_rtl_online_guard.png`;
- `business_clients_ar_narrow_reduced_20260912_140748_178370_test_business_clients_arabic_rtl.png`;
- `production_queue_ar_narrow_reduced_20260912_140832_207126_test_production_queue_arabic_rtl.png`;
- `reporting_dashboard_ar_narrow_reduced_20260912_140849_688414_test_reporting_dashboard_arabic_rtl_visual_contract.png`;
- `preorder_create_en_narrow_reduced_20260912_140713_639060_test_preorder_creation_english_online_guard.png`;
- public web `public_en_desktop.png`, `public_en_narrow.png`, `public_ar_desktop.png`, `public_ar_narrow.png`.

Manual result: **PASS for release usability, RTL, narrow layouts, public isolation and reporting disclosure**, with one P2 localization-quality finding below. Public Arabic desktop/narrow is clean and coherent. Reporting Arabic remains correctly localized, including the complete offline-unsynced disclosure. The inspected internal forms remain usable and correctly RTL.

One inherited product-lookup UI test emitted a transient Chrome-headless startup warning before the browser suite continued; the combined result remained 148/148 green and the retained UI captures were produced. It is not classified as an application defect.

## Defect register

### P2-001 — partial English labels/help remain on some internal Arabic forms

Manual inspection found inherited internal Arabic screens where selected field/help text remains English, including examples such as the preorder online-connection guard and some Returns/Production labels. Core Arabic navigation, workflow actions and RTL remain usable, and there is a safe workaround (the meaning is visible in English); no data, authorization or workflow result is affected.

Classification: **P2 non-blocker / localization quality**. It does not block Phase 5 under the accepted severity rule, but should be cleaned up before or alongside a production launch-quality polish pass. This finding must not be erased merely because automated bilingual tests are green.

Open P0: **0**. Open P1: **0**. Open P2: **1**.

## Deployment boundary

No merge, production deployment, live domain/DNS change, secret/resource mutation, paid-resource creation or real-data migration occurred. Phase 5 proves release-readiness of the tested application behavior; it does not turn deployment to GO. Production hosting, restore proof, real hardware compatibility, named staff, actual opening data, cutover, budget and launch timing remain explicit pre-deployment decisions/checks in `docs/operations/DEPLOYMENT_READINESS.md`.
