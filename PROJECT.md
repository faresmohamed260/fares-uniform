# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Source of truth: repository code and docs; no reliance on session memory or local project files.
- Execution: remote only through GitHub/hosted CI.
- Initial public-web deployment target: Vercel; Odoo requires a separate compatible persistent host.
- Available stack services: Supabase and Cloudflare, neither selected as an operational mirror by default.

## Current state — 2026-09-11

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / OPERATIONAL VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE / HOSTED GATES PASS. Phase 2A — Retail checkout/offline: COMPLETE / HOSTED GATES PASS. Phase 2B — Preorder/balance/collection: COMPLETE / AUTHORITATIVE COMBINED HOSTED GATE PASS. Phase 2C — Retail refunds/size exchanges: COMPLETE / AUTHORITATIVE COMBINED HOSTED GATE, REPEATABLE UPGRADE, EN/AR/RTL AND EXACT-HEAD EVIDENCE PASS.**

Current branch: `phase-2c/refunds-exchanges`.

The authoritative Phase 2C **application/test** SHA is **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`**. Later commits on this branch are closure documentation only unless explicitly stated otherwise.

Final Phase 2C hosted authority:
- workflow: `Phase 2C retail returns`;
- run: **`34596450064`**;
- job: **`103253225096`**;
- conclusion: **SUCCESS**;
- result: **82/82 tests, 0 failed, 0 errors**;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder` — **SUCCESS** on the same database and application SHA;
- artifact ID: **`10262414135`**;
- artifact: `phase2c-returns-62369e62dd1e5d2505e089c6a5ede296a24bcb3b`;
- digest: **`sha256:de110b0bd73593d7248f396acb1df35c80c5c711edac14b83773b54d86e1a475`**.

Detailed evidence and corrected failure chronology are in `docs/validation/PHASE_2C_REFUNDS_EXCHANGES.md`.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

The accepted MVP boundary covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

Odoo Community is the operational/domain core. Fares-owned addons extend Odoo rather than duplicating its sales/payment/stock ledgers. The public web remains a separate Vercel-targeted surface through narrow Fares-owned integration boundaries; broad Odoo credentials and operational database access do not belong in public browser code.

Dense operational ERP screens follow D-033: modern, practical, information-dense and task-focused. Native Odoo/Owl controls and extension points are preferred before custom generic widgets. Richer 3D/physics/morphing remains appropriate for expressive public/product-showcase surfaces rather than transaction-critical ERP composition.

Confirmed product/stock rules remain:
- school/client-specific designs are distinct stocked products when units are not interchangeable;
- no tracked `Factory Finished / Awaiting Transfer` stock location is needed in the initial model;
- size systems vary by garment/product family and remain configurable;
- permanent system-managed sequential variant codes use the `FU-000001` style;
- one retail store and one storage location are currently confirmed;
- one checkout device per store is the current operating envelope;
- Cash and InstaPay are current payment methods; cards/wallets are future work;
- public catalog exposes neither price nor stock;
- numeric transaction/product volumes, launch date and service budget remain unknown and must not be invented.

## Completed implementation phases

### Phase 1 — products, finished stock and access

Authoritative tested application: `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`.

Run `34110346764`, job `101704871502`, passed the full `fu_core` gate, real Chrome English/Arabic UI checks and repeatable addon upgrade. Artifact `phase1-product-stock-eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`, ID `10014163050`, digest `sha256:4e2e1a01b7516d0e7a1b93ef77d4ae48f430ff723098c04981033b96fda71fbc`.

### Phase 2A — ordinary retail checkout/offline

Phase 2A is complete under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md` and `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

Authoritative application/test implementation: `d8e5ffbac2dddcdc6776a708e079ab7b24f38497`. Final closeout validation head `dcdfd827a740ecff4a0f3be99077ed820694607b`, run `34356830980`, job `102483531903`, is successful with combined `/fu_core,/fu_retail` tests, repeatable upgrade and evidence upload.

The stacked Phase 2A PR remains open/draft and must not be merged without explicit authorization.

### Phase 2B — preorder, balance and partial collection

Phase 2B is complete under `docs/phases/PHASE_2B_PREORDER_COLLECTION.md` and `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

Authoritative application/test SHA: **`af64b858cf6f2be6a143bb19e836721abc216221`**. Run `34547236245`, job `103102402060`, passed the combined Phase 1 + Phase 2A + Phase 2B test gate, repeatable addon upgrade and exact-head evidence upload.

Artifact `phase2b-preorder-af64b858cf6f2be6a143bb19e836721abc216221`, ID `10179559978`, digest `sha256:750edfe5938d5aa279f2eddfc16bd80504689e885b8ce32d9dd2ed94849bcb29`.

Documentation closure `5f341fb4aa5eacb12191dd41afa43c02000abcd4` is not a newer application authority.

### Phase 2C — retail refunds and size exchanges

Phase contract: `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md`.

Accepted policy remains authoritative in `docs/requirements/PHASE_2C_POLICY_DECISIONS.md`:
- source retail transaction required for routine automated returns/exchanges;
- researched Egypt CPA baseline: 14-day no-reason path subject to published exceptions and 30-day defective-item path;
- normal stocked school uniforms are not automatically custom; genuinely made-to-special-specification compliant items may use the published no-reason exception;
- Cash refunds settle as Cash;
- InstaPay refund/negative exchange differences require positive manually confirmed outbound evidence/reference;
- original payment history remains immutable;
- mixed-method source payments fail closed in the automated path;
- size exchanges settle the exact positive/negative/zero difference;
- returned garments go to `Returns / Inspection` until explicit sellable acceptance or non-sellable disposition;
- uncollected-preorder cancellation/refund is excluded;
- request, approval and execution are online-only and fail closed offline.

Pinned Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` remains the technical reference. `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md` records the native POS refund/return ownership boundary.

Delivered Phase 2C behavior includes:
- controlled **Returns & Exchanges** backend workspace;
- routine POS `Returns / Exchanges` entry replacing native Refund for Fares staff;
- online POS synchronization then controlled-backend navigation;
- offline warning/fail-closed behavior with no competing native refund path;
- Cashier request vs Manager/Owner approval/execution boundaries;
- server-enforced store scope and direct native refund/negative-line/sync bypass denial;
- full and partial native source-linked refunds;
- cumulative over-refund rejection;
- same-method Cash and confirmed-InstaPay settlement evidence;
- mixed-method fail-closed behavior;
- native return stock lineage and quarantine in `Returns / Inspection`;
- explicit sellable and non-sellable inspection disposition;
- native size exchange with same-template replacement, live stock check and exact difference settlement;
- equal-price, more-expensive and cheaper Cash paths;
- confirmed InstaPay negative exchange-difference path;
- replacement-stock shortage rejection;
- idempotent/exact-once execution;
- representative English and Arabic/RTL browser paths, keyboard focus and desktop/narrow evidence.

Phase 2C is therefore **closed for the accepted consumer-retail scope**.

## Roadmap

1. Phase 0: business discovery — complete.
2. Phase 0A: hosted Odoo proof — pass.
3. Phase 0B: architecture/data/UI foundation — complete.
4. Phase 1: products, finished-stock movements and access — complete.
5. Phase 2A: ordinary retail checkout, Cash/confirmed-InstaPay and durable offline reconciliation — complete.
6. Phase 2B: school-uniform preorder, balance, reservation and partial collection — complete.
7. Phase 2C: consumer retail refunds and size exchanges — complete.
8. Next bounded work: remaining production/business workflows, public catalog/contact/reporting surfaces, then integrated onboarding/UAT/deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Treat `62369e62dd1e5d2505e089c6a5ede296a24bcb3b` as the Phase 2C application authority even though the branch now contains later documentation-only commits.
3. Before starting the next implementation phase, verify the live branch/target lineage and read the repository governance/docs again.
4. Define the next bounded phase from the remaining accepted MVP scope rather than silently extending Phase 2C.
5. Do not introduce deferred Phase 2C policy—mixed-method refund allocation, preorder cancellation/refund, cards/wallets, B2B return policy, bank API integration, repairs/warranty or legal/tax finalization—without an explicit future contract/decision.
6. No merge, deployment or real-data migration without explicit client authorization.

## Later explicit decisions

Resolve only when their affected phase starts:
- mixed-method retail refund allocation if required;
- uncollected-preorder cancellation/refund;
- missing/delayed/ambiguous InstaPay confirmation policy outside already-confirmed positive paths;
- production threshold defaults/configuration semantics beyond the accepted seven-day default where needed;
- business final-payment/partial-shipment rules;
- B2B return/credit policy;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.