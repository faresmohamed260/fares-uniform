# Phase 2B — School-uniform preorder, balance and collection

Status: **COMPLETE — AUTHORITATIVE HOSTED PHASE 1 + PHASE 2A + PHASE 2B GATE PASS; REPEATABLE UPGRADE PASS; FINAL EVIDENCE UPLOADED; TEMPORARY DIAGNOSTIC WORKFLOW REMOVED, 2026-09-11.**

The policy questions below are retained as historical planning context. Their accepted answers are authoritative in [Phase 2B policy decisions](../requirements/PHASE_2B_POLICY_DECISIONS.md). Production deployment, real data migration, bank integration, refund/exchange rules and merging remain outside this authorization.

## Why this is a separate retail slice

The accepted MVP includes school-uniform preorders, deposits/balances, partial collection and refunds/exchanges. The confirmed preorder workflow is mature enough to implement independently, while refund/exchange settlement and returned-stock rules remain materially unresolved.

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

## Domain boundary

Standard Odoo sale/order/payment/stock concepts remain authoritative. Phase 2B does not force ordinary `pos.order` semantics onto the staged preorder workflow and does not create a parallel operational ledger.

The pinned Odoo Community 19 model inspection is recorded in `docs/architecture/PHASE_2B_PREORDER_MODEL.md`. The implementation preserves:
- one authoritative preorder identity;
- immutable/attributable payment events;
- explicit ordered, ready and collected quantities;
- stock effects only when physical custody actually changes;
- no duplicate preorder/payment/collection effects under retry;
- future compatibility with production-demand aggregation.

Do not introduce Supabase or another database as an operational mirror.

## State semantics

Staff can distinguish these business conditions without conflating them:

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

## Offline boundary — resolved

Phase 2A proves durable **ordinary checkout** offline. That result is not generalized to preorders or collection.

The accepted Phase 2B decisions require connectivity for:
- creation of a new preorder;
- recording an additional preorder payment;
- collection/release of items from an existing preorder.

The UI fails these operations closed during connectivity loss rather than relying on stale cached balance/readiness.

## Targeted policy gates — resolved

All five answers are recorded in `docs/requirements/PHASE_2B_POLICY_DECISIONS.md`:
- P2B-01: new preorder creation requires server connectivity;
- P2B-02: additional payment and collection require server connectivity;
- P2B-03: any positive payment up to the remaining balance is allowed; no invented percentage;
- P2B-04: reservation occurs against Retail Store stock independently of preorder acceptance when allocation is performed;
- P2B-05: a fully paid customer may collect ready subsets while the remainder stays outstanding.

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

## Hosted validation contract

The phase was validated remotely and exact-head on pinned Odoo Community 19. The acceptance gate covers:
- authorized Cashier preorder creation with customer, pickup date and size-specific lines;
- full-payment and accepted-deposit positive paths;
- derived remaining balance;
- collection denial while any whole-order balance remains;
- allowed partial collection after full settlement;
- later completion without duplicating stock effects;
- collection replay/idempotency;
- attributable Cash/confirmed-InstaPay evidence;
- unauthorized role/direct mutation denial server-side;
- EN + AR/RTL representative preorder/payment/collection UI;
- Phase 1 and Phase 2A regressions;
- repeatable addon upgrade.

## Exit criteria

Phase 2B closes only when:
1. the five targeted policy gates affecting implemented behavior are resolved;
2. preorder identity, payment history, balance and collection quantities are authoritative and attributable;
3. D-014 is server-enforced, not merely a disabled button;
4. partial collection preserves remaining uncollected quantities;
5. stock release is exact-once and retry-safe;
6. role boundaries are server-enforced;
7. accepted offline behavior is explicitly bounded and tested;
8. EN/AR RTL representative paths pass;
9. Phase 1 + Phase 2A regressions and repeatable upgrades remain green;
10. no refund/exchange or production-deployment policy is smuggled into the result.

**All Phase 2B exit criteria for the approved slice are satisfied.**

## Final execution state — 2026-09-11

**COMPLETE.**

The final UI blocker had two separate causes and fixes:

1. `23e8b42032db3ce68fd8ef49eb11467cbd2720e2` (`test(preorder): wait for native header actions`) aligns browser synchronization with pinned Odoo 19's native form-header `type="action"` rendering. Tests wait on `.o_form_statusbar button[name="<resolved action id>"]` and independently assert the localized label, retaining keyboard-focus, online-guard and RTL coverage.
2. `af64b858cf6f2be6a143bb19e836721abc216221` (`fix(preorder): bind Arabic UI translations`) adds valid Odoo `model`, `model_terms` and `code` occurrence metadata to `fu_preorder/i18n/ar.po`, allowing the runtime Arabic terms to be imported/bound rather than merely existing as unreferenced `msgstr` values.

The authoritative final application/test SHA is **`af64b858cf6f2be6a143bb19e836721abc216221`**.

GitHub Actions run `34547236245`, job `103102402060`, workflow `Phase 2B preorder balance collection`: **SUCCESS**. GitHub records the exact head SHA as `af64b858...`. The job steps `Install addons and run Phase 1 plus Phase 2A plus Phase 2B tests`, `Prove repeatable addon upgrade`, `Summarize evidence`, and `Upload exact-head evidence` all completed successfully.

Final artifact:
- `phase2b-preorder-af64b858cf6f2be6a143bb19e836721abc216221`;
- ID `10179559978`;
- digest `sha256:750edfe5938d5aa279f2eddfc16bd80504689e885b8ce32d9dd2ed94849bcb29`.

The temporary UI diagnostic workflow was removed afterward at cleanup commit **`80c41e68104e0a3274090acf190790eead1aaafc`**, whose direct parent is the green application SHA. That cleanup commit and later documentation commits are not newer application proof.

Detailed red/green chronology is retained in `docs/validation/PHASE_2B_PREORDER_COLLECTION.md`.

No deployment, real-data migration, refund/exchange behavior or merge occurred. No PR merge is authorized without explicit client approval.
