# Phase 5 — integrated UAT, onboarding rehearsal and deployment readiness

Status: **COMPLETE / VERIFIED, 2026-09-12.**

Branch: `phase-5/integrated-uat-onboarding`.

Starting documentation lineage: `f71acb24c7cdbd850c0737edf78cf93375490e9a`.

Inherited authoritative Phase 4B application/test SHA: `29b2589e7e71271071f97c9de57dfb97b49b100d`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

**Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.** Later documentation-only closure commits do not supersede this exact tested authority.

## Closure result

Phase 5 proved that the completed first-release capabilities operate together coherently in a clean synthetic hosted environment without introducing a second business-data authority or expanding public scope.

Exact-head workflow run `34698087230` passed:
- Odoo/UAT job `103564935283`: **148 tests, 0 failures, 0 errors**;
- all four joined Phase 5 release-journey methods plus inherited Phase 1–4B tests;
- repeatable upgrade of the seven **production** addons on the same database/SHA;
- public-web job `103564935388`: typecheck/build and **8/8 Playwright tests**;
- retained Odoo/UAT artifact `10298859526` (`sha256:510f57a2f1b8c6cfc9b6627c086240b1e03a069112c8780c0cc51bb78f28c0c5`);
- retained web artifact `10298634549` (`sha256:cabf625930954e29dfd413cbfc24c5c5c4cf95713c15cd754bc3e64b0f44dc5f`).

The test-only `fu_uat` addon remains evidence infrastructure only; no production addon depends on it and the production upgrade authority remains exactly:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.

Manual screenshot review passed release usability, RTL, narrow layout, public-boundary and reporting-disclosure checks. One inherited **P2** localization-quality finding remains: some internal Arabic forms contain selected English field/help labels. There are no open P0/P1 defects; the P2 is recorded in the validation doc and remains follow-up launch polish rather than being hidden.

## Verified inherited release scenarios

1. Product/variant identification, tracked locations and attributable/idempotent stock custody — **PASS**.
2. Ordinary retail sale plus inherited offline survival/reconciliation/idempotency — **PASS**.
3. Preorder with size-separated demand and production trigger — **PASS**.
4. Factory finish distinct from store receipt; full-balance gate before partial/final collection — **PASS**.
5. Controlled refund/size-exchange behavior preserving source truth — **PASS**.
6. Business-client sample/order/deposit/delivery/shipment/balance lifecycle — **PASS**.
7. Public English/Arabic catalog/enquiry with exact allowlists and no price/stock/private leakage — **PASS**.
8. Operational reports reconcile to synthetic transactions and retain truthful offline-unsynced disclosure — **PASS**.
9. Role/server boundaries and representative EN/AR/RTL/narrow behavior — **PASS WITH P2 LOCALIZATION FINDING**.

## Onboarding result

The synthetic rehearsal proved the application/configuration path for Store/Storage, named roles/location scopes, configurable sizes and permanent variant codes, attributable opening stock, data-driven Cash/InstaPay classification, explicit preorder production trigger configuration, public publishing/enquiry, reporting and staff-scope smoke verification.

Production-specific facts were intentionally not invented. Actual staff, products/sizes/opening quantities, legal receipt identity, printers/scanners/dimensions, hosting/resources/budget, domain/DNS and cutover window remain operator/client inputs before deployment.

## Deployment readiness result

The application/UAT gate is green, but **production deployment remains NO-GO pending production-specific decisions and proofs**. In particular, a real hosting/provider choice, PostgreSQL+filestore persistence design, backup **restore rehearsal**, environment/secrets ownership, real device/browser/scanner/printer compatibility, staff assignments/training, real-data reconciliation/cutover, monitoring ownership, budget and launch date are not implied by Phase 5.

The provider-neutral readiness/rollback checklist is in `docs/operations/DEPLOYMENT_READINESS.md`.

## Defect severity outcome

Open P0: **0**.
Open P1: **0**.
Open P2: **1** (`P2-001`, partial internal Arabic-label localization).

The accepted Phase 5 rule allows closure with documented P2/P3 findings; a P0/P1 would have required a forward fix and full exact-head rerun.

## Explicitly still out of scope / unauthorized

- production deployment or live cutover;
- real customer/order/payment/stock migration;
- paid hosting/resource creation;
- live domains, DNS, certificates or secrets;
- cards/wallets or bank API integration;
- advanced analytics/BI;
- automated customer notifications;
- report export/scheduled delivery;
- raw-material/WIP inventory;
- deferred B2B refund/credit, preorder cancellation/refund, tax/legal revenue recognition or post-confirmation amendment policies.

## Closure evidence

Full evidence mapping, artifact IDs/digests, representative screenshot names, manual-review result and defect register are authoritative in `docs/validation/PHASE_5_INTEGRATED_UAT.md`.

Phase 5 closure is release-readiness evidence only. No merge, deployment, production-resource mutation or real-data migration occurred.
