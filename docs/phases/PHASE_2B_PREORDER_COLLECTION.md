# Phase 2B — School-uniform preorder, balance and collection

Status: **SERVER FOUNDATION AND RESERVATION/SECURITY BOUNDARY / HOSTED GATE PASS; NATIVE UI IMPLEMENTED; FINAL HOSTED UI GATE RED; PHASE INCOMPLETE, 2026-09-11.**

The policy questions below are retained as historical planning context. Their accepted answers are authoritative in [Phase 2B policy decisions](../requirements/PHASE_2B_POLICY_DECISIONS.md). Current client direction explicitly authorizes continued remote development and hosted debugging of the existing branch, without merge.

Authorization state: the recorded Phase 2B policy decisions close the bounded planning questions and authorize implementation. The current client instruction explicitly renews actual remote development and hosted validation. Production deployment, real data migration, bank integration, refund/exchange rules and merging remain outside this authorization.

## Why this is a separate retail slice

The accepted MVP includes school-uniform preorders, deposits/balances, partial collection and refunds/exchanges. The confirmed preorder workflow is mature enough to plan, but refund/exchange settlement and returned-stock rules remain materially unresolved.

Phase 2B therefore targets:

**school-uniform preorder creation + deposit/balance tracking + full-balance-before-any-collection + partial collection tracking.**

Refund/exchange execution remains a later retail slice. This is sequencing, not scope removal.

## Inherited confirmed rules

The following are already decided and must not be re-asked:

- School/client designs are separate stocked products; size remains a product variant attribute.
- Preorders are used when requested school-uniform stock is unavailable.
- Current paper receipt records items, sizes/details and pickup date.
- Customer may pay the full price or a deposit at preorder creation.
- Production demand aggregates separately by item size.
- A production task is created when a configurable quantity threshold is reached or the configurable pickup lead time is reached; current accepted lead-time default is seven days.
- Staff explicitly mark `In production` when work actually starts.
- `Finished` means factory completion.
- `Ready for collection` means the item has physically reached the Retail Store.
- Partial preorder collection is required.
- **D-014 is mandatory:** before releasing even part of a preorder, collect the entire remaining balance for the whole preorder. Payment completion and physical collection completion are tracked independently.
- Cash and InstaPay are the initial payment methods. InstaPay confirmation remains manual positive bank-notification observation; no bank API is implied.
- Customer readiness notification is manual initially.
- Cashier may create preorders, record payments and record collection; Store Manager oversees store orders/collection. Refund approval is not part of this slice.
- Native Odoo records remain the operational source of truth; do not create a parallel order/payment/stock ledger.

## Goal

Replace the current paper preorder/collection flow with an attributable Odoo-owned workflow that can:

1. create a customer preorder for unavailable school-uniform variants;
2. record promised pickup date and ordered quantity by variant/size;
3. record full payment or an allowed deposit and calculate the remaining balance;
4. preserve attributable Cash/InstaPay payment history without rewriting posted payments;
5. expose remaining balance clearly to staff;
6. prevent any collection while a preorder balance remains due;
7. allow partial physical collection after the entire balance is settled;
8. track collected versus still-uncollected quantities independently;
9. hand production-demand information to the later/adjacent production workflow without inventing raw-material accounting;
10. retain server-enforced role and location boundaries.

## Proposed domain boundary

Prefer standard Odoo sale/order/payment/stock concepts where they fit, but do not force ordinary `pos.order` semantics onto a workflow that needs future pickup, deposits and staged collection if that creates misleading accounting or stock truth.

The pinned Odoo Community 19 model inspection is recorded in `docs/architecture/PHASE_2B_PREORDER_MODEL.md`. Implementation must preserve:
- one authoritative preorder identity;
- immutable/attributable payment events;
- explicit ordered, ready and collected quantities;
- stock effects only when physical custody actually changes;
- no duplicate preorder/payment/collection effects under retry;
- future compatibility with production-demand aggregation.

Do not introduce Supabase or another database as an operational mirror.

## Intended state semantics

The native Sales/payment/stock model is selected in `docs/architecture/PHASE_2B_PREORDER_MODEL.md`; but staff must be able to distinguish at least these business conditions without conflating them:

- preorder accepted / awaiting production or readiness;
- balance due;
- fully paid;
- partially ready versus fully ready where line quantities differ;
- ready for collection at Retail Store;
- partially collected;
- fully collected.

`In production` and `Finished` remain production workflow states, not retail stock locations.

## Payment invariants

1. Every recorded payment is attributable to actor, preorder and payment method.
2. InstaPay paid evidence means only that staff positively observed the bank mobile notification.
3. Remaining balance is derived from authoritative preorder total minus valid recorded payments; do not maintain a conflicting manually editable balance field as financial truth.
4. Before the first collection event, remaining balance must equal zero under D-014.
5. Once fully paid, later partial collection does not reopen a balance merely because items remain uncollected.
6. Corrections/refunds are explicit future reversal workflows, not silent edits of historical payments.

## Collection invariants

1. Collection quantity is recorded per preorder line/variant.
2. Cumulative collected quantity cannot exceed the ordered/eligible ready quantity.
3. Remaining uncollected quantity survives across multiple collection visits.
4. A collection event is attributable to staff, time, preorder and quantities released.
5. Collection must not silently rewrite the original preorder lines.
6. Physical stock consequence must occur exactly once per released quantity under the selected Odoo-native custody mechanism.
7. A retry/replayed collection command must be idempotent.

## Role boundary

### Cashier
May, within assigned store scope:
- create a preorder;
- select/read needed customer and product data;
- record allowed preorder payments;
- view balance/readiness;
- record an allowed collection after server-side eligibility checks.

Cannot:
- bypass the full-balance collection gate;
- alter product master or raw stock;
- approve refunds/exchanges;
- rewrite historical payments;
- change production configuration;
- self-elevate permissions.

### Store Manager
May oversee store preorder/payment/collection records and resolve later manager-authorized retail actions when their policies exist. Phase 2B does not invent refund/exchange resolution policy.

### Inventory Staff / Production Manager
Their existing scopes remain. `Ready for collection` requires Retail Store receipt; production mutation belongs to the bounded production workflow rather than giving Cashier broad stock authority.

## Offline boundary — resolved; historical questions

Phase 2A proves durable **ordinary checkout** offline. That result must not be silently generalized to preorders or collection.

The accepted decision requires connectivity for all three actions below; these were evaluated separately:
- creation of a new preorder;
- recording an additional preorder payment;
- collection/release of items from an existing preorder.

Collection is higher risk than ordinary checkout because staff must know the whole-order balance is settled and the quantity is actually eligible/ready. If collection remains online-only, the UI must fail closed and explain why rather than relying on stale cached balance/readiness.

## Targeted policy gates — resolved

All five answers are recorded in `docs/requirements/PHASE_2B_POLICY_DECISIONS.md`. The questions below document what was decided; they are not open gates.

### P2B-01 — Offline preorder creation
During an internet outage, should staff be allowed to create a **new preorder** and take an initial Cash/confirmed-InstaPay payment, or should preorder creation require the server?

### P2B-02 — Offline additional payment / collection
Treat these separately:
- may staff record an additional payment against an existing preorder while offline?
- may staff release/collect preorder items while offline?

Recommended conservative default if the client has no operational need: allow ordinary Phase 2A stock checkout offline, but require server connectivity for existing-preorder payment/collection because current balance, readiness and prior collection state are server-authoritative.

### P2B-03 — Deposit amount rule
When the customer does not pay in full at preorder creation, what deposit rule applies?

Need one accepted behavior, for example:
- any staff-entered positive amount up to the total;
- a configurable minimum percentage/amount;
- another explicit rule.

Do not invent a percentage.

### P2B-04 — Stock reservation/allocation
When stock becomes available for a customer preorder, when does it become reserved against that preorder?

Possible business choices include reservation at preorder creation if stock exists, reservation when production/store receipt makes units available, manager/manual allocation, or no hard reservation until collection. This must be explicit because it controls whether the same piece may still be sold through ordinary POS.

### P2B-05 — Partial readiness and collection
If only some ordered lines/quantities are Ready for collection at the store, may the fully paid customer collect those ready quantities immediately while the rest remains outstanding?

D-014 already requires the entire remaining **financial** balance first; this question concerns physical readiness only.

## Explicitly outside Phase 2B

- refund execution or size-exchange execution;
- refund/exchange eligibility, approval window or returned-stock/payment treatment;
- preorder cancellation/refund policy;
- missing/delayed/ambiguous InstaPay notification resolution;
- automated bank verification;
- card/wallet payments;
- production material/WIP inventory;
- business-client contract workflow;
- automated customer notifications;
- legal/tax receipt finalization;
- production deployment, hardware certification or real data migration.

## Hosted validation plan

Implementation validation must remain remote and exact-head on pinned Odoo Community 19.

At minimum prove:
- authorized Cashier creates one preorder with customer, pickup date and multiple size-specific lines;
- full-payment and accepted-deposit positive paths;
- remaining balance derives correctly from recorded payments;
- collection is denied while any whole-order balance remains;
- after full settlement, allowed partial collection records exact per-line quantities;
- later collection completes the remaining quantities without duplicating earlier stock effects;
- collection replay/idempotency cannot release stock twice;
- Cash/confirmed-InstaPay evidence remains attributable;
- unauthorized role/direct mutation attempts are denied server-side;
- EN + AR/RTL representative preorder/payment/collection UI;
- Phase 1 and Phase 2A regressions remain green;
- repeatable addon upgrade remains green.

If any preorder/payment/collection action is approved for offline use, add dedicated durable reload/reconciliation/replay tests for that action. Do not infer Phase 2A offline safety automatically.

## Exit criteria

Phase 2B can close only when:
1. the five targeted policy gates affecting implemented behavior are resolved or explicitly deferred in a way that leaves a safe bounded implementation;
2. preorder identity, payment history, balance and collection quantities are authoritative and attributable;
3. D-014 is server-enforced, not merely a disabled button;
4. partial collection preserves remaining uncollected quantities;
5. stock release is exact-once and retry-safe;
6. role boundaries are server-enforced;
7. accepted offline behavior, if any, is explicitly tested;
8. EN/AR RTL representative paths pass;
9. Phase 1 + Phase 2A regressions and repeatable upgrades remain green;
10. no refund/exchange or production-deployment policy is smuggled into the result.

## Execution state

**SERVER FOUNDATION AND RESERVATION/SECURITY BOUNDARY HOSTED GATE PASS; NATIVE UI IMPLEMENTED; FINAL HOSTED UI GATE RED; PHASE INCOMPLETE.**

The full combined hosted gate at server authority `2816a8cbe1dce703ae0310b242d34ef92f0c6928` closes the direct-native-mutation and allocation/POS boundary issue: 51 tests and repeatable upgrade pass. That server result remains authoritative for those invariants and must not be confused with later red UI diagnostic heads.

### Hosted UI validation status — 2026-09-11

The bounded native Odoo UI now exists: a read-only preorder workspace plus transient create, payment, readiness-allocation and collection wizards. Mutations continue to delegate to guarded server services. The UI includes the online-required guard and an Arabic translation catalog; broad custom frontend state or a second operational ledger was not introduced.

Hosted UI debugging established several important negative findings before the current checkpoint. The owner-context fixture defect was corrected at `db3764e426711cfb4b3c6b80e4d686ff07aa4d2e`. Arabic selection metadata and rendered `Partially collected` state were separately proven, and the collection dialog itself was proven to open; the dialog-footer query was synchronized at `a0941519c268964f0b16f5c2c1451af987b0d3f9`. Later collection-header rendering synchronization is at `434a4f5add4f6acebae31b57a7cd7721f3c353f5`.

The current pre-documentation diagnostic head is `09ac573b639b8d6a36fff15538b138e687313cdd`, run `34536257546`. Its native/core Arabic control comparisons are green for core stock/product UI, while the Phase 2B `payment-ar` and `collection-ar` method jobs are red. Payment-Arabic job `103068452209` fails before opening the payment dialog with the exact browser error `Record payment action missing`. The Arabic PO is loaded and the page is running under `ar_001`; together with the green core control jobs, this rules out a generic Arabic translation/RTL stack failure. Collection-Arabic job `103068452331` still needs one direct log read to record its exact current failure before changing that path.

Do not regress to the earlier translation/footer-race loop. The active blocker is Phase 2B native header method-action discovery/render synchronization. The next implementation/test change should inspect the actual rendered Odoo 19 action control, locate/wait for it by stable semantic/action identity, and keep localization as an independent assertion. Existing keyboard-focus and RTL evidence must remain; solving selector timing must not weaken accessibility or Arabic coverage.

Phase 2B can close only after the corrected isolated paths pass and the **authoritative combined Phase 1 + Phase 2A + Phase 2B suite plus repeatable addon upgrade** is green at one exact application SHA. The final acceptance artifact must preserve the required hosted UI screenshots/evidence. Temporary diagnostic workflow(s) should then be removed, and documentation must record the exact tested application SHA separately from later cleanup/documentation commits. No merge is authorized without explicit client approval.
