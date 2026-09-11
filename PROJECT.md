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

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / OPERATIONAL VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE / HOSTED GATES PASS. Phase 2A — Retail checkout/offline: COMPLETE / HOSTED GATES PASS. Phase 2B — Preorder/balance/collection: COMPLETE / AUTHORITATIVE COMBINED HOSTED GATE PASS. Phase 2C — Retail refunds/size exchanges: COMPLETE / AUTHORITATIVE COMBINED HOSTED GATE, REPEATABLE UPGRADE, EN/AR/RTL AND EXACT-HEAD EVIDENCE PASS. Phase 3A — Preorder production queue/workflow: COMPLETE / AUTHORITATIVE PHASE 1–3A HOSTED GATE, REPEATABLE FOUR-ADDON UPGRADE AND EN/AR/RTL EVIDENCE PASS.**

Current branch: `phase-3a/preorder-production-queue`, stacked from Phase 2C closure head `06ac7787392bbd63081fe22f23dcbbb603f1b398`.

The authoritative Phase 3A **application/test** SHA is **`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`**. Later Phase 3A closure-documentation commits are docs-only and are not newer application proof.

Final Phase 3A hosted authority:
- workflow: `Phase 3A preorder production`;
- run: **`34601274874`**;
- job: **`103268897396`**;
- conclusion: **SUCCESS**;
- result: **93 tests, 0 failures, 0 errors** across the combined Phase 1 through Phase 3A gate;
- repeatable upgrade: `fu_core,fu_retail,fu_preorder,fu_production` — **SUCCESS** on the same database and exact application SHA;
- artifact ID: **`10264163466`**;
- artifact: `phase3a-production-ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`;
- digest: **`sha256:0e94e65beaa25c92c27337c200186dd765c2a5f1c1ee9b5735130a0fc60770d5`**;
- representative English and Arabic/RTL desktop/narrow production screenshots reviewed; keyboard focus and RTL checks passed; no application JavaScript/test exception observed.

No merge, production deployment or real-data migration occurred.

## Product and architecture direction

The accepted MVP boundary covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

Odoo Community is the operational/domain core. Fares-owned addons extend Odoo rather than duplicating its sales/payment/stock ledgers. The public web remains a separate Vercel-targeted surface through narrow Fares-owned integration boundaries; broad Odoo credentials and operational database access do not belong in public browser code.

Dense operational ERP screens follow D-033: modern, practical, information-dense and task-focused. Native Odoo/Owl controls and extension points are preferred before custom generic widgets. Richer 3D/physics/morphing remains appropriate for expressive public/product-showcase surfaces rather than transaction-critical ERP composition.

Confirmed product/stock rules remain:
- school/client-specific designs are distinct stocked products when units are not interchangeable;
- no tracked `Factory Finished / Awaiting Transfer` stock location exists in the initial model;
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

### Phase 2B — preorder, balance and partial collection

Phase 2B is complete under `docs/phases/PHASE_2B_PREORDER_COLLECTION.md` and `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

Authoritative application/test SHA: **`af64b858cf6f2be6a143bb19e836721abc216221`**. Run `34547236245`, job `103102402060`, passed the combined Phase 1 + Phase 2A + Phase 2B gate and repeatable addon upgrade.

Artifact `phase2b-preorder-af64b858cf6f2be6a143bb19e836721abc216221`, ID `10179559978`, digest `sha256:750edfe5938d5aa279f2eddfc16bd80504689e885b8ce32d9dd2ed94849bcb29`.

### Phase 2C — retail refunds and size exchanges

Phase 2C is complete under `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md` and `docs/validation/PHASE_2C_REFUNDS_EXCHANGES.md`.

Authoritative application/test SHA: **`62369e62dd1e5d2505e089c6a5ede296a24bcb3b`**. Run `34596450064`, job `103253225096`, passed **82/82 tests**, the repeatable `fu_core,fu_retail,fu_preorder` upgrade and exact-head EN/AR/RTL evidence.

Artifact `phase2c-returns-62369e62dd1e5d2505e089c6a5ede296a24bcb3b`, ID `10262414135`, digest `sha256:de110b0bd73593d7248f396acb1df35c80c5c711edac14b83773b54d86e1a475`.

Accepted Phase 2C policy remains in `docs/requirements/PHASE_2C_POLICY_DECISIONS.md`. Routine returns/exchanges remain source-linked, server-authorized, online-only, stock-quarantined until inspection, and settled through Cash/confirmed-InstaPay according to the accepted rules. Preorder cancellation/refund remains a separate future policy.

### Phase 3A — preorder production queue/workflow

Phase contract: `docs/phases/PHASE_3A_PREORDER_PRODUCTION.md`.

Architecture boundary: `docs/architecture/PHASE_3A_PRODUCTION_MODEL.md`.

Validation authority: `docs/validation/PHASE_3A_PREORDER_PRODUCTION.md`.

Delivered Phase 3A behavior:
- derives unmet production demand from authoritative preorder lines;
- aggregates demand by exact product variant/size;
- quantity trigger is disabled at default `0` until an explicit positive threshold is configured;
- deadline trigger defaults to seven days and remains configurable;
- task creation is `queued`, with explicit Production Manager/Owner start and finish transitions;
- source task lines attribute and bound preorder coverage; repeated evaluation cannot duplicate already-covered demand;
- cancelled queued tasks release coverage without cancelling/refunding the preorder;
- server authorization blocks unauthorized configuration, direct creation and state mutation;
- factory `Finished` remains workflow-only and creates no stock move/quant/factory inventory location;
- `Ready for collection` remains the Phase 2B Retail Store physical-receipt/allocation condition;
- EN/AR/RTL desktop/narrow production UI, keyboard focus and reduced-motion-safe rendering are proven in hosted Chrome.

Pinned Odoo Community `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` remains the technical reference. Phase 3A deliberately does not use native `mrp.production` as operational authority because the accepted MVP excludes raw/WIP and factory-finished inventory accounting while native MRP owns those stock semantics.

## Roadmap

1. Phase 0: business discovery — complete.
2. Phase 0A: hosted Odoo proof — pass.
3. Phase 0B: architecture/data/UI foundation — complete.
4. Phase 1: products, finished-stock movements and access — complete.
5. Phase 2A: ordinary retail checkout, Cash/confirmed-InstaPay and durable offline reconciliation — complete.
6. Phase 2B: school-uniform preorder, balance, reservation and partial collection — complete.
7. Phase 2C: consumer retail refunds and size exchanges — complete.
8. Phase 3A: size-specific preorder production queue, threshold/deadline automation and factory workflow — **complete**.
9. Phase 3B: business-client enquiry/sample/order/deposit/shipment/balance workflow — **next bounded contract; payment/shipment policy must be resolved before implementation**.
10. Public catalog/enquiry and operational reports.
11. Integrated user acceptance, onboarding rehearsal and explicitly authorized deployment planning.

## Immediate next action

1. Keep stacked branches/PRs unmerged until explicit authorization.
2. Treat `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc` as the Phase 3A application authority; later docs-only closure commits are not application proof.
3. Start Phase 3B only from a committed bounded contract that resolves the still-deferred business-client payment/shipment rules before code is written.
4. Reuse native Odoo sales/payment/stock ownership where it fits; do not create a parallel B2B ledger.
5. Preserve existing Phase 1–3A behavior through combined exact-head hosted regression and repeatable-upgrade gates.
6. Do not introduce raw/WIP inventory, automatic bank verification, preorder cancellation/refund, deployment or real-data migration by implication.
7. No merge, deployment or real-data migration without explicit client authorization.

## Later explicit decisions

Resolve only when their affected phase starts:
- mixed-method retail refund allocation if required;
- uncollected-preorder cancellation/refund;
- missing/delayed/ambiguous InstaPay confirmation policy outside already-confirmed positive paths;
- production quantity-threshold numeric default if the client later wants one; current accepted default behavior remains disabled at zero;
- business final-payment/partial-shipment rules;
- B2B return/credit policy;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.