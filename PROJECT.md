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

## Current state — 2026-09-11

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE / HOSTED TECHNICAL GATES PASS. Phase 2A — Retail checkout/offline: COMPLETE / HOSTED TECHNICAL GATES PASS. Phase 2B — Preorder/balance/collection: COMPLETE / AUTHORITATIVE COMBINED HOSTED GATE, REPEATABLE UPGRADE AND EXACT-HEAD EVIDENCE PASS. Phase 2C — Refunds/exchanges: PLANNING ACTIVE; PINNED ODOO MODEL + EGYPT CONSUMER-POLICY BASELINE RESEARCH COMPLETE; CLIENT POLICY GATES OPEN; IMPLEMENTATION NOT STARTED.**

Active branch: `phase-2c/refunds-exchanges`, stacked from verified Phase 2B closure `5f341fb4aa5eacb12191dd41afa43c02000abcd4`.

The accepted MVP boundary covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

Phase 0A proved the Odoo Community direction at implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, run `34068805602`: 15/15 tests passed. Odoo remains a conditional technical GO with Fares-owned addons/UX and the isolated offline-restore compatibility boundary documented in validation evidence.

Phase 0B formalized the hybrid architecture. The earlier rendered prototypes remain technical evidence only and were rejected as visual baselines. The approved operational visual target remains the **modern and practical ERP** direction under D-033. Dashboard, POS, Products, Production, Sales Orders and Customers stay clean, contemporary, information-dense and task-focused. Prebuilt-first remains mandatory. D-032's richer 3D/physics/morphing ideas remain available for suitable expressive public/marketing and product-showcase surfaces rather than governing dense ERP composition.

Confirmed product/stock rules remain:
- school/client-specific designs are stocked as different products;
- no tracked factory-finished inventory location is useful;
- size systems vary by garment and remain configurable per product family;
- permanent sequential `FU-000001`-style variant codes are accepted.

Phase 1 is complete on `phase-1/products-stock-access`. The production `fu_core` foundation has hosted evidence for product identity, Retail Store/Storage custody, opening counts, native receipts/transfers, idempotent stock effects, the Phase 1 role/location-security matrix and native bilingual Odoo product/inventory workflows.

The authoritative tested Phase 1 implementation is `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`. GitHub Actions run `34110346764`, job `101704871502`, completed successfully, including the full `fu_core` test gate, real Chrome English/Arabic UI checks and repeatable addon upgrade. Artifact `phase1-product-stock-eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3` is ID `10014163050`, SHA-256 `4e2e1a01b7516d0e7a1b93ef77d4ae48f430ff723098c04981033b96fda71fbc`. Detailed evidence is in `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

## Phase 2A closure

Phase 2A is complete on `phase-2a/retail-checkout-offline` under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md`. It deliberately covers only ordinary finished-stock checkout, Cash, positively manually confirmed InstaPay and durable offline reconciliation.

The authoritative application/test implementation is `d8e5ffbac2dddcdc6776a708e079ab7b24f38497`. Normal run `34298578791` and diagnostic run `34298578820` are green. Final closeout validation head `dcdfd827a740ecff4a0f3be99077ed820694607b`, run `34356830980`, job `102483531903`, is successful with combined `/fu_core,/fu_retail` tests, repeatable upgrade and evidence upload. Detailed evidence is in `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

The stacked Phase 2A pull request is PR #4, **open and draft**, from `phase-2a/retail-checkout-offline` onto `phase-1/products-stock-access`. Do not merge without explicit client authorization.

## Phase 2B closure

Phase 2B is complete under `docs/phases/PHASE_2B_PREORDER_COLLECTION.md` and `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

The authoritative final Phase 2B application/test SHA is **`af64b858cf6f2be6a143bb19e836721abc216221`**. GitHub Actions run `34547236245`, job `103102402060`, workflow `Phase 2B preorder balance collection`, is **SUCCESS**. The combined Phase 1 + Phase 2A + Phase 2B test step, repeatable addon upgrade, evidence summary and exact-head evidence upload all completed successfully.

Final artifact `phase2b-preorder-af64b858cf6f2be6a143bb19e836721abc216221` is ID `10179559978`, digest `sha256:750edfe5938d5aa279f2eddfc16bd80504689e885b8ce32d9dd2ed94849bcb29`.

The temporary Phase 2B UI diagnostic workflow was removed at cleanup commit `80c41e68104e0a3274090acf190790eead1aaafc`. Phase 2B documentation closure is `5f341fb4aa5eacb12191dd41afa43c02000abcd4`. These cleanup/docs commits are not newer application proof.

No merge, production deployment or real-data migration occurred.

## Phase 2C planning — refunds and size exchanges

The active Phase 2C contract is `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md`. The exact pinned-Odoo technical boundary is `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`. Current external consumer-policy research is `docs/requirements/PHASE_2C_POLICY_RESEARCH.md`.

Discovery and MVP scope already confirm that refunds and size exchanges are allowed, while detailed eligibility, payment treatment and returned-stock behavior were intentionally deferred to this retail phase. Existing role design already places refund/exchange approval with Store Manager/Owner and limits Cashier to requesting/routine execution rather than approval.

Pinned Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` has been inspected for POS refund lines, POS stock effects and generic stock returns. Native POS refunds preserve source-line identity, cap cumulative refund quantity, and create the appropriate return stock effect for delivered goods. Generic `stock.return.picking` preserves move/picking lineage and is reserved for workflows where it owns the delivery reversal; it must not be layered on top of an ordinary POS refund. Different-variant size exchange can use a source-linked negative refund leg plus a positive replacement sale leg, with policy-controlled net settlement.

Egypt Consumer Protection Agency guidance researched on 2026-09-11 establishes a consumer-retail baseline that the software must not undercut: 14-day no-reason returns/exchanges subject to published exceptions, 30 days for defective goods, and same-purchase-method refund language for defective returns. The custom-specification exception is not treated as a blanket exception for every stocked school uniform. This research is implementation guidance, not final legal certification.

No custom refund ledger or custom stock-return engine is required. Fares should own only the bounded eligibility/approval/audit/idempotency layer and the policy-driven settlement/stock-disposition decisions.

Phase 2C implementation is now blocked only by client choices on how to operationalize the statutory baseline: source/proof exception handling, whether to offer rights beyond the baseline, exact InstaPay outbound-refund confirmation, multi-method settlement if needed, exchange price differences, returned-stock inspection/disposition, uncollected-preorder cancellation scope, and offline/online behavior. Recommended defaults are recorded in the phase contract.

One retail store, one storage location and one checkout per store remain confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget remain deployment-time decisions.

## Roadmap

1. Phase 0: business discovery and first-release boundary — complete.
2. Phase 0A: Odoo technical proof — pass.
3. Phase 0B: architecture/data/UI foundation — complete; modern/practical operational visual direction approved.
4. Phase 1: products, finished-stock movements, access controls, opening inventory and bilingual native internal UI — complete; hosted technical gates pass.
5. Phase 2A: ordinary retail stock checkout, Cash/confirmed-InstaPay recording and durable offline reconciliation — complete; hosted technical gates pass.
6. Phase 2B: school-uniform preorder, deposit/balance and partial collection — complete; authoritative combined hosted gate, repeatable upgrade and exact-head evidence pass at `af64b858cf6f2be6a143bb19e836721abc216221`.
7. Phase 2C: refund/exchange policy and execution — planning active; pinned technical and consumer-policy research complete; client policy gates open; implementation not started.
8. Production/business workflows, public catalog/reports, then integrated onboarding/UAT/deployment in bounded contracts.

## Immediate next action

1. Keep existing stacked PRs unmerged until explicit authorization.
2. Use the Phase 2C contract, pinned model analysis and policy research as the active planning authority.
3. Resolve the remaining P2C client choices as one bounded approval round; record accepted answers before implementation.
4. After policy acceptance, implement a thin server-authorized approval/execution layer over native source-linked POS refund and stock records; do not create a parallel ledger or duplicate POS return with a generic reverse transfer.
5. Preserve server-enforced Store Manager approval, store scope, idempotency, EN/AR/RTL and prior-phase regressions.
6. Validate statutory-window boundaries, custom-spec exception handling, refund-before-delivery/delivered-return stock semantics, different-variant exchange, price difference, replay and direct-native-mutation denial in hosted CI.
7. No merge, deployment or real-data migration without explicit client authorization.

Do not reopen product-design separation, factory-finished custody, size-system variability, sequential item codes, full-balance-before-partial-collection, Phase 2A offline-sale semantics or the resolved Phase 2B selector/Arabic-binding bugs unless the client or contradictory hosted evidence changes them.

## Later explicit decisions

Resolve only when their affected phase starts:
- missing/delayed/ambiguous InstaPay confirmation policy outside the already-confirmed positive path, except where Phase 2C refund settlement directly requires a bounded answer;
- production threshold defaults/configuration semantics beyond the accepted seven-day default where needed;
- business final-payment/partial-shipment rules;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim refers to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
