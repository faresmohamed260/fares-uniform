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

## Current state — 2026-09-09

**Phase 0 — Discovery: COMPLETE. Phase 0A — Hosted Odoo proof: TECHNICAL PASS. Phase 0B — Foundation architecture/UX: COMPLETE / VISUAL DIRECTION APPROVED. Phase 1 — Products/stock/access: COMPLETE / HOSTED TECHNICAL GATES PASS. Phase 2A — Retail checkout/offline: COMPLETE / HOSTED TECHNICAL GATES PASS. Phase 2B — Preorder/balance/collection: AUTHORIZED PLANNING / TARGETED POLICY GATES OPEN.**

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

Phase 2A is complete on `phase-2a/retail-checkout-offline` under `docs/phases/PHASE_2A_RETAIL_CHECKOUT_OFFLINE.md`. It deliberately covers only ordinary finished-stock checkout, Cash, positively manually confirmed InstaPay and durable offline reconciliation. Preorders, balance collection, refunds/exchanges and unresolved payment policies remain later retail work.

The authoritative application/test implementation is `d8e5ffbac2dddcdc6776a708e079ab7b24f38497`. Normal run `34298578791` and diagnostic run `34298578820` are green. The diagnostic run passed all eight isolated slices, including offline Cash, confirmed InstaPay, Arabic/RTL, revoked-cashier Review retention and retained Phase 1 regression. The application artifact is ID `10084165232`, digest `sha256:2569cdd306a5f3802fcdde6f37137dfc54183f58ebbd22b046fbc2152439dddd`.

Phase 2A validates:
- native Odoo POS/Owl ordinary checkout using Phase 1 finished-stock variants;
- Cash and positive manual bank-notification confirmation for InstaPay, with no bank API claim;
- production-owned Odoo 19 offline restore compatibility behavior;
- durable paid sale across offline browser reload;
- native Odoo UUID identity across retry/replay;
- visible Pending sync, Syncing, Synced, Review required and Retryable failure states;
- EN + Arabic/RTL receipt-state behavior;
- server-side current-role revalidation on synchronization;
- revoked-role semantic rejection retained locally for Review required;
- transient online-start transport failure retained as Retryable failure;
- same-UUID lost-ack replay without duplicate order, payment or stock effects;
- exactly one done stock picking and one executed stock move at the sold quantity;
- repeatable `fu_core + fu_retail` upgrade;
- retained Phase 1 regressions.

Native Odoo `pos.order`, `pos.payment`, products and stock records remain authoritative. Fares does not own a second offline sales ledger or synchronization queue.

The production restore shim is isolated in `addons/fu_retail/static/src/offline_restore_patch.js`, pinned to Odoo Community `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`. Its source documents the upstream offline-startup defect and retirement rule: remove the patch only after an adopted upstream revision no longer drops the already-read local record map and the hosted offline-reload regression passes without the patch.

Temporary failure-signature instrumentation was removed at `6113edcf8d7f27c69e85f4061e0dc6d31b09cc46`; run `34300005169` remained green. The temporary standalone Phase 2A diagnostic workflow was then retired at `538b65ea581e67b40d396a0a60960c9b94382921`.

Final authoritative closeout validation head: `dcdfd827a740ecff4a0f3be99077ed820694607b`. GitHub Actions run `34356830980`, job `102483531903`: **SUCCESS**, including combined `/fu_core,/fu_retail` tests, repeatable upgrade and evidence upload. Artifact `phase2a-retail-dcdfd827a740ecff4a0f3be99077ed820694607b` is ID `10106267198`, digest `sha256:753732d04f42ecc74f65e89eb755a3994147b96640d1c227fde435d56fe54dea`.

Documentation commits after `dcdf...` are closure/planning-only and must not be mistaken for newer tested application code. Detailed history, including retained red diagnostic runs, is in `docs/validation/PHASE_2A_RETAIL_CHECKOUT.md`.

The stacked Phase 2A pull request is PR #4, **open and draft**, from `phase-2a/retail-checkout-offline` onto `phase-1/products-stock-access`. Do not merge without explicit client authorization.

## Phase 2B planning

Phase 2B is defined by `docs/phases/PHASE_2B_PREORDER_COLLECTION.md` and targets school-uniform preorder creation, deposit/balance tracking, D-014 full-balance-before-any-collection enforcement and partial physical collection. Refund/exchange execution remains a later retail slice.

Pinned-Odoo technical model inspection is complete and recorded in `docs/architecture/PHASE_2B_PREORDER_MODEL.md` at planning commit `181990ba6999779f98d68b78e711dcfb7092671d`.

Current technical boundary:
- use native `sale.order` / `sale.order.line` as the preorder identity instead of duplicating order/line truth in a new ledger;
- use native Odoo payment records for actual payment events;
- use native `stock.picking` / `stock.move` records for physical collection/release;
- derive balance and collected quantities from authoritative records rather than editable parallel totals;
- keep server-side role, balance and eligible-quantity checks authoritative;
- do not use native POS-Sales down payment unchanged before the reservation policy is resolved, because pinned `pos_sale` auto-confirms linked draft Sales Orders and pinned `sale_stock` confirmation launches stock rules.

Implementation is blocked only by the five targeted policy gates in the Phase 2B contract:
1. P2B-01 — whether new preorder creation/initial payment may occur offline;
2. P2B-02 — separately, whether additional preorder payment and item collection may occur offline;
3. P2B-03 — the allowed deposit amount rule when not paying in full;
4. P2B-04 — when/how stock becomes reserved or allocated to a preorder;
5. P2B-05 — whether a fully paid customer may collect ready subsets before the whole preorder is physically ready.

Do not guess these answers. Once resolved, implement the smallest Odoo-native `fu_preorder` slice supported by them and validate server invariants before broad UI work.

One retail store, one storage location and one checkout per store remain confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget remain deployment-time decisions.

## Roadmap

1. Phase 0: business discovery and first-release boundary — complete.
2. Phase 0A: Odoo technical proof — pass.
3. Phase 0B: architecture/data/UI foundation — complete; modern/practical operational visual direction approved.
4. Phase 1: products, finished-stock movements, access controls, opening inventory and bilingual native internal UI — complete; hosted technical gates pass.
5. Phase 2A: ordinary retail stock checkout, Cash/confirmed-InstaPay recording and durable offline reconciliation — complete; hosted technical gates pass.
6. Phase 2B: school-uniform preorder, deposit/balance and partial collection — authorized planning; technical model analysis complete; five targeted policy gates remain before implementation.
7. Later retail slice: refund/exchange execution and its unresolved settlement/returned-stock policy.
8. Production/business workflows, public catalog/reports, then integrated onboarding/UAT/deployment in bounded contracts.

## Immediate next action

**Do not reopen Phase 2A implementation debugging unless new evidence or a later upstream Odoo change invalidates its green boundary.**

1. Keep Phase 2A PR #4 draft and unmerged until explicit authorization and stacked-base readiness.
2. Do not repeat the Phase 2B pinned-Odoo model investigation; `docs/architecture/PHASE_2B_PREORDER_MODEL.md` owns that result.
3. Resolve only P2B-01 through P2B-05 from the client; do not broaden discovery into refund/exchange or deployment questions.
4. Full-balance-before-partial-collection is already confirmed under D-014 and must not be re-asked.
5. After those answers are recorded durably, start the smallest server-first `fu_preorder` implementation and hosted tests.
6. Continue to use native Odoo/Owl for operational ERP behavior, keep native Odoo records authoritative and follow prebuilt-first UI rules.

Do not reopen product-design separation, factory-finished custody, size-system variability, sequential item codes, full-balance-before-partial-collection or the operational visual direction unless the client changes those decisions.

## Later explicit decisions

Resolve only when their affected phase starts:
- refund/exchange eligibility and returned-stock/payment treatment;
- missing/delayed/ambiguous InstaPay confirmation policy outside the already-confirmed positive path;
- production threshold defaults/configuration semantics beyond the accepted seven-day default where needed;
- business final-payment/partial-shipment rules;
- tax/legal receipt identity and report formulas;
- actual hardware compatibility and label dimensions;
- production hosting/resources, budget and launch timing.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim refers to exact remote evidence. Synthetic proof data only; credentials and real private business records never belong in this public repository.
