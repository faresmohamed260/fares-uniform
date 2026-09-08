# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Initial deployment target: Vercel for the public web application; Odoo requires a separate compatible persistent host.
- Available stack services: Supabase and Cloudflare, neither selected as an operational mirror by default.
- Source of truth: repository code and docs; no reliance on session memory or local files.
- Execution: remote only.

## Current state — 2026-09-08

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE / HOSTED TECHNICAL GATES PASS. Phase 2A — Retail checkout/offline: ACTIVE / PARTIALLY HOSTED-GREEN / CURRENT REVIEW-STATE DIAGNOSTIC RED.**

The accepted MVP boundary covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

Phase 0A proved the Odoo Community direction at implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, run `34068805602`: 15/15 tests passed. Odoo remains a conditional technical GO with Fares-owned addons/UX and the isolated offline-restore compatibility shim documented in `docs/validation/ODOO_PROOF.md`.

Phase 0B formalized the hybrid architecture. The earlier rendered prototypes remain technical evidence only and were rejected as visual baselines. The final operational visual target is the client-approved **modern and practical ERP** direction under D-033. Dashboard, POS, Products, Production, Sales Orders and Customers stay clean, contemporary, information-dense and task-focused. Prebuilt-first remains mandatory. D-032's richer 3D/physics/morphing ideas remain available for suitable expressive surfaces such as public/marketing and product showcase/detail rather than governing dense ERP composition.

Confirmed product/stock rules remain:
- school/client-specific designs are stocked as different products;
- no tracked factory-finished inventory location is useful;
- size systems vary by garment and remain configurable per product family;
- permanent sequential `FU-000001`-style variant codes are accepted.

Phase 1 is complete on `phase-1/products-stock-access`. The production `fu_core` foundation has hosted evidence for product identity, Retail Store/Storage custody, opening counts, native receipts/transfers, idempotent stock effects, the Phase 1 role/location-security matrix and native bilingual Odoo product/inventory workflows.

The authoritative tested Phase 1 implementation is `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`. GitHub Actions run `34110346764`, job `101704871502`, completed successfully, including the full `fu_core` test gate, real Chrome English/Arabic UI checks and repeatable addon upgrade. Artifact `phase1-product-stock-eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3` is ID `10014163050`, SHA-256 `4e2e1a01b7516d0e7a1b93ef77d4ae48f430ff723098c04981033b96fda71fbc`. Detailed evidence is in `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

Phase 2A is authorized on `phase-2a/retail-checkout-offline` under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md`. It covers ordinary finished-stock checkout, Cash, positively manually confirmed InstaPay and durable offline reconciliation only. Preorders, balance collection, refunds/exchanges and unresolved policies remain later retail work.

The production `fu_retail` foundation now exists. The first trustworthy hosted-green foundation is implementation `70a8bf2908e2a3965dddbf28a5d7c7b55959bb1b`: diagnostic run `34117789110` passed all six isolated slices and normal run `34117789248`, job `101728550021`, passed combined `fu_core + fu_retail` tests plus repeatable upgrade. Subsequent hosted-green work added truthful pending-sync receipt semantics, EN/AR behavior, replay/idempotency hardening and server-side current-role revalidation on reconnect.

The current unresolved Phase 2A defect is deliberately narrow. Implementation `88f433107ae9a2f6b0038098c254093bc7a360d7` introduced a durable local `Review required` classification for semantic/server sync rejection while keeping the native Odoo order in its normal model/IndexedDB. Diagnostic run `34217932758` kept seven existing slices green and failed only the new revoked-cashier review browser path. The branch then added diagnostic observability at `a4297435c67a1ec2fb901f443b6c82217aa653ef` and `66dfdcc879e51e7275e581ee6bbe9ff1dd4e1423`; exact-head runs `34219258246` (diagnostic) and `34219258288` (normal) are red. These are retained evidence, not release candidates.

Detailed Phase 2A evidence and remaining gates are now owned by `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget remain deployment-time decisions.

## Roadmap

1. Phase 0: business discovery and first-release boundary — complete.
2. Phase 0A: Odoo technical proof — pass.
3. Phase 0B: architecture/data/UI foundation — complete; modern/practical operational visual direction approved.
4. Phase 1: products, finished-stock movements, access controls, opening inventory and bilingual native internal UI — complete; hosted technical gates pass.
5. Phase 2A: ordinary retail stock checkout, Cash/confirmed-InstaPay recording and offline reconciliation hardening — active; foundation substantially implemented, final sync-state/review validation incomplete.
6. Later retail subphase: preorder/deposit/balance/collection and refund/exchange behavior after targeted policy resolution.
7. Production/business workflows, public catalog/reports, then integrated onboarding/UAT/deployment in bounded contracts.

## Immediate next action

**Resume from the current Phase 2A review-state diagnostic, not from the beginning.**

1. Read `AGENTS.md`, this file, `docs/README.md`, `docs/DECISIONS.md`, `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md`, `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`, and relevant role/architecture requirements.
2. Verify branch `phase-2a/retail-checkout-offline` and exact head before any write. The implementation/diagnostic lineage recorded here ends at `66dfdcc879e51e7275e581ee6bbe9ff1dd4e1423`; documentation commits may be newer and must not be mistaken for green application evidence.
3. Classify the isolated revoked-cashier browser failure from hosted evidence. Do not guess or broaden production changes while seven neighboring diagnostic slices are already green.
4. Fix only the demonstrated `Review required` browser/runtime defect, then rerun the isolated diagnostic and normal exact-head Phase 2A gate.
5. After review retention is green, complete the contract's remaining visible state semantics: `Syncing` and `Retryable failure`, using native Odoo sync state/queue rather than a parallel ledger.
6. Add/confirm explicit exact-once stock-effect evidence for replay/lost-ack, final EN/AR RTL evidence, repeatable upgrade, and Phase 1 regression.
7. Remove the temporary diagnostic workflow only in a validated series; then update validation evidence and prepare the stacked Phase 2A draft PR. Do not merge without client authorization.

Do not reopen product-design separation, factory-finished custody, size-system variability, sequential item codes, full-balance-before-partial-collection or the operational visual direction unless the client changes those decisions.

## Later explicit decisions

Resolve only when their affected phase starts:
- offline preorder/collection/refund/exchange behavior;
- missing/delayed/ambiguous InstaPay confirmation policy;
- refund/exchange eligibility and returned-stock/payment treatment;
- preorder reservation/allocation;
- production threshold defaults/configuration semantics;
- business final-payment/partial-shipment rules;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim refers to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
