# Phase 5 — integrated UAT, onboarding rehearsal and deployment readiness

Status: **ACTIVE / AUTHORIZED, 2026-09-12.**

Branch: `phase-5/integrated-uat-onboarding`.

Starting documentation lineage: `f71acb24c7cdbd850c0737edf78cf93375490e9a`.

Inherited authoritative Phase 4B application/test SHA: `29b2589e7e71271071f97c9de57dfb97b49b100d`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authorization: after Phase 4B closure the client explicitly instructed the developer to continue with the next task. Under the accepted MVP delivery order this starts integrated UAT/onboarding rehearsal and deployment-readiness planning. It does **not** authorize production deployment, real-data migration, paid resources, domain/DNS changes, secrets, or mutation of live services.

## Goal

Prove that the already implemented first-release capabilities work together as one coherent Fares Uniform operating system, then rehearse the setup sequence a real store/factory rollout would require and produce an evidence-backed go/no-go checklist for a later explicitly authorized deployment.

Phase 5 is primarily a release-readiness and acceptance phase. It does not add new business scope. Production-addon behavior stays frozen unless UAT exposes a concrete defect or missing requirement that prevents an already accepted release scenario.

## Inherited release acceptance scenarios

Phase 5 owns integrated proof of all nine scenarios accepted in `docs/requirements/MVP_SCOPE.md`:

1. Product/variant identification, tracked location and attributable receipt/transfer/opening-stock history.
2. Ordinary retail stock sale with receipt/payment plus offline survival/reconciliation without duplicate sale/payment/stock effects.
3. Preorder with sizes, payment history and pickup date; size-separated demand; qualifying production trigger creates one task without falsely starting production.
4. Factory completion remains distinct from store receipt; partial collection is allowed only after full balance settlement while uncollected quantities remain open.
5. Refund/size exchange preserves the original sale and creates the accepted payment/stock consequences.
6. Business-client order preserves sample approval, agreed items, deposit, delivery date, shipment and remaining balance under accepted Phase 3B policy.
7. Public visitors can browse English/Arabic catalog content and submit enquiries without price/stock/private leakage.
8. Owner operational reports agree with the recorded synthetic transactions and truthfully disclose offline-unsynced POS exclusion.
9. Each role can perform its accepted work and is denied unauthorized direct/server actions; Arabic/RTL and agreed capability-based interfaces remain valid.

## In scope

### A. Clean integrated UAT environment

Use a disposable hosted PostgreSQL/Odoo environment built from the exact Fares commit under test and the pinned Odoo Community SHA. Install the seven production addons together:

`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.

All data must be synthetic. No production credentials, customer records, bank data or business-private records may enter repository, logs, screenshots or artifacts.

### B. Cross-phase UAT harness

Add the smallest maintainable acceptance harness needed to exercise the nine scenarios above as joined business journeys rather than only isolated phase tests.

Preferred shape:
- a test-only Odoo addon/harness that depends on the production modules but owns no production business truth;
- direct server assertions for cross-workflow invariants and security;
- browser/UI acceptance checks only where a real rendered interaction or navigation boundary matters;
- keep all existing per-phase tests unchanged and green.

A test harness must never become a runtime dependency of the seven production addons.

### C. Onboarding rehearsal

Rehearse, with synthetic configuration, the order a real implementation would follow:

1. company operational timezone/currency context;
2. Fares Retail Store and Storage tracked locations;
3. named users, role composition and location assignments;
4. configurable product families/size attributes and permanent variant codes/barcodes;
5. opening finished-stock quantities with attributable opening-count evidence;
6. POS configuration and data-driven Cash/InstaPay methods, including manual notification-confirmation behavior;
7. preorder production lead time/quantity-trigger configuration without inventing a default threshold;
8. public catalog publishable content and enquiry path;
9. low-stock warning rules;
10. smoke verification of reports and each staff role after setup.

The rehearsal must identify which steps are system-supported, which are ordinary Odoo administration, and which still require a human deployment/operator decision.

### D. Deployment-readiness planning

Produce a provider-neutral deployment checklist covering only decisions/evidence needed before launch:
- Odoo hosting and persistent PostgreSQL/filestore placement;
- backup and **restore proof**, not backup existence alone;
- environment separation and secret ownership;
- public-web Vercel configuration and narrow Odoo integration endpoint;
- TLS/domain/DNS plan without changing live DNS;
- observability/log retention and basic recovery ownership;
- actual checkout device/browser/scanner/printer capability checks;
- staff account/role assignment and training;
- opening-data reconciliation/cutover procedure;
- rollback/go-no-go criteria;
- launch date, budget and resource choices remain explicit client decisions.

Planning does not select or create a production resource by inference.

### E. Evidence and defect handling

Classify UAT findings:
- **P0 blocker** — risk of data loss/corruption, security boundary failure or unusable core release journey;
- **P1 blocker** — accepted release scenario cannot be completed correctly without a workaround unsuitable for launch;
- **P2 non-blocker** — quality/usability defect with a safe documented workaround;
- **P3/deferred** — enhancement outside accepted first-release scope.

Phase 5 cannot close with an open P0 or P1. A P0/P1 discovered in inherited functionality must receive the narrowest evidence-backed fix and the entire exact-head UAT gate must be rerun.

## Explicitly out of scope

- production deployment or live cutover;
- real customer/order/payment/stock import;
- paid hosting/resource creation;
- live domains, DNS, certificates or secrets;
- new cards/wallets or bank API integration;
- advanced analytics/BI;
- automated customer notifications;
- report export/scheduled delivery;
- raw-material/WIP inventory;
- policies previously deferred for B2B refunds/credits, preorder cancellation/refund, tax/legal revenue recognition or post-confirmation order amendments;
- redesigning completed workflows solely because UAT is a later phase.

## Exact-head validation contract

The Phase 5 hosted workflow must pin and record the exact Fares SHA and exact Odoo SHA and retain artifacts.

Minimum gate on the same application candidate:
1. clean install of the seven production addons plus test-only UAT harness, if used;
2. all inherited Phase 1–4B Odoo tests: **144 or newer, 0 failures, 0 errors**;
3. all new integrated UAT tests: 0 failures/errors;
4. repeatable upgrade of the **seven production addons** on the same database;
5. public-web `npm ci`, typecheck, production build and existing **8/8 or newer** Playwright regression;
6. integrated public/UAT checks must preserve the exact Phase 4A public allowlists;
7. retained runtime metadata, logs and representative screenshots;
8. manual inspection of representative browser evidence rather than trusting exit status alone.

The UAT harness is evidence infrastructure; it is not added to the production upgrade authority.

## Onboarding acceptance

The rehearsal is successful only when:
- a clean synthetic company can be configured without modifying source for company-specific values;
- role/location assignments can be made without shared admin credentials for routine work;
- product sizes/codes/stock can be initialized with attributable stock evidence;
- payment/POS/preorder/production/public/reporting configuration has an explicit documented owner;
- setup order and verification checks are reproducible from repository documentation;
- unknown production choices remain called out rather than guessed.

## Phase 5 exit criteria

Phase 5 may be marked COMPLETE / VERIFIED only when:
1. all nine inherited release acceptance scenarios have exact-head hosted evidence;
2. all inherited automated gates remain green;
3. no open P0/P1 UAT defect remains;
4. onboarding rehearsal is documented and executed with synthetic data;
5. EN/AR/RTL and narrow/accessibility evidence remains sound for representative release journeys;
6. deployment-readiness checklist clearly separates proven facts, required client decisions and unverified real hardware/provider assumptions;
7. backup/restore, cutover and rollback responsibilities are documented at plan level;
8. exact workflow/job/artifact IDs and digests are recorded in `docs/validation/PHASE_5_INTEGRATED_UAT.md`;
9. any later documentation-only closure commit is explicitly not treated as a newer application authority;
10. no production deployment, resource mutation or real-data migration occurred without separate authorization.

## Documentation outputs

- this contract;
- `docs/validation/PHASE_5_INTEGRATED_UAT.md`;
- `docs/operations/ONBOARDING_REHEARSAL.md`;
- `docs/operations/DEPLOYMENT_READINESS.md`;
- `PROJECT.md`, `docs/README.md` and the decision log updated as evidence matures.
