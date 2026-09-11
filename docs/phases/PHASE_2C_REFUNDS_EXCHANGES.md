# Phase 2C — Retail refunds and size exchanges

Status: **PLANNING ACTIVE; BUSINESS POLICY GATES OPEN; IMPLEMENTATION NOT STARTED.**

Branch: `phase-2c/refunds-exchanges`.

This phase starts from the verified Phase 2B closure commit `5f341fb4aa5eacb12191dd41afa43c02000abcd4`. No merge, deployment or real-data migration is authorized by starting this phase.

## Why this phase exists

The accepted MVP explicitly includes refunds and size exchanges. Discovery confirms that both are allowed, but intentionally deferred the detailed eligibility, settlement and returned-stock rules until the affected retail phase.

The goal is to implement returns without erasing or rewriting the original sale/payment/stock history and without giving routine checkout staff broad native Odoo accounting or stock authority.

## Starting evidence and inherited constraints

Authoritative repository requirements already establish:
- refunds and size exchanges are part of the first-release retail scope;
- the original transaction must remain preserved; reversals/corrections are explicit records rather than silent edits;
- Cash and positively manually confirmed InstaPay are the current payment methods;
- Cashier may request returns/exchanges but cannot approve refunds;
- Store Manager may approve refund/exchange actions within store scope; Owner/Admin retains administrative authority;
- server-side authorization is required; hiding a UI button is not authorization;
- Odoo records remain operational truth; no parallel refund/payment/stock ledger is allowed;
- ordinary offline checkout is proven, but that proof does not automatically authorize offline refunds or exchanges;
- English/Arabic/RTL and brand-independent hardware constraints continue to apply.

Phase 2B is complete at application authority `af64b858cf6f2be6a143bb19e836721abc216221`, run `34547236245`, job `103102402060`. Its later cleanup and documentation lineage does not replace that tested application SHA.

## Odoo-native technical direction

Current Odoo 19 documentation and upstream source show a native order-based POS refund flow: a paid original order is selected, refundable lines/quantities are chosen, a refund order is created and linked back to the original order, and the refund is settled through the POS payment flow. Odoo also provides native stock return/reverse-transfer mechanisms for customer returns.

References used for planning:
- https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale/use.html#return-and-refund-products
- https://github.com/odoo/odoo/blob/19.0/addons/point_of_sale/models/pos_order.py
- https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/repairs/repair_orders.html#return-order

Before implementation, inspect the exact pinned Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`; the moving `19.0` branch/documentation is architectural guidance, not exact-code authority.

Preferred implementation direction unless pinned-source evidence contradicts it:
1. use native order-linked refund records rather than editing/deleting the original POS order;
2. use native stock return effects or a bounded service over them rather than positive inventory adjustments masquerading as returns;
3. model a size exchange as an attributable return of the original variant plus a new sale/release of the replacement variant, with any price difference handled explicitly;
4. preserve links among original sale, return/refund, payment reversal/settlement and stock movement;
5. keep replay/idempotency guards around every Fares-owned mutation boundary.

## Proposed functional scope

Subject to the policy gates below, Phase 2C should cover:
- locating an eligible original retail transaction;
- selecting one or more returned lines and quantities;
- manager-approved partial or full refund;
- size exchange from one stocked variant to another;
- explicit calculation and settlement of any exchange price difference;
- attributable Cash/InstaPay refund or adjustment evidence according to the accepted payment policy;
- physical return into an accepted stock disposition only after the item is actually received;
- bilingual refund/exchange receipt or evidence referencing the original transaction;
- idempotent retry/replay behavior;
- server-enforced role/store scope and direct-native-mutation denial.

## Explicit exclusions until separately authorized

- card/wallet refund implementation;
- automated bank or InstaPay API integration;
- chargebacks;
- B2B contract returns/credit policy;
- legal/tax finalization beyond preserving native Odoo accounting/credit-note semantics where applicable;
- repairs/alterations workflows;
- product warranty policy;
- production material/WIP returns;
- production deployment or real-data migration.

Uncollected preorder cancellation/refund is not silently included; see P2C-06.

## Required invariants

1. A completed original transaction is never silently rewritten or deleted to perform a refund/exchange.
2. Every return/refund is linked to the source transaction and records actor, approver, time, reason, lines, quantities and settlement evidence.
3. Cumulative refunded/returned quantity cannot exceed the eligible quantity from the original line after prior refunds.
4. A replay/retry cannot duplicate refund payment or stock effects.
5. Returned stock does not become sellable merely because a financial refund was approved; physical receipt and accepted item condition control stock disposition.
6. Size exchange preserves both legs: return of the original variant and issue/sale of the replacement variant.
7. Price differences are explicit payment/refund effects, never hidden product-price edits.
8. Cashier cannot approve their own refund/exchange merely by calling a native API directly.
9. Store/location scope remains server-enforced.
10. The workflow must not create a second sales/payment/stock ledger outside native Odoo records and bounded Fares audit metadata.

## Role boundary

Inherited role design is binding unless the client changes it:

### Cashier
- may locate the source transaction and prepare/request a return or exchange;
- may perform only manager-approved execution that the final workflow explicitly delegates;
- cannot approve refunds, override eligibility, rewrite payment history, alter stock directly or change product master data.

### Store Manager
- may approve eligible store refunds/exchanges within assigned scope;
- approval must be attributable to the approving account;
- cannot bypass system-wide Owner/Admin controls or unrelated stock/accounting boundaries.

### Owner / Administrator
- may approve/administer allowed refund/exchange actions and later documented exceptional corrections;
- exceptional behavior still requires explicit recorded reason/evidence rather than silent mutation.

## Blocking business policy gates

These gates must be resolved before production behavior is implemented. Recommendations are developer proposals only, not client decisions.

### P2C-01 — Proof of purchase / source transaction
What source evidence is required to use the automated refund/exchange flow?

**Recommended default:** require selection of the original recorded sale/preorder collection. Do not support anonymous standalone refunds in the Fares workflow initially; exceptional no-receipt cases require Owner/Manager handling under a later explicit rule.

### P2C-02 — Eligibility window and item condition
How long after sale/collection may an item be returned or exchanged, and what item condition is required?

Need an explicit business rule for time window plus conditions such as unused/unworn, original condition/tags, manufacturing defect exceptions, or other accepted criteria. Do not invent a legal/business return window.

### P2C-03 — Refund payment treatment
For an approved refund, how is money returned for:
- original Cash payment;
- original confirmed-InstaPay payment;
- transactions paid using more than one payment event where applicable?

**Recommended technical rule:** preserve the original payment record and create explicit reversal/refund evidence. Do not edit posted payment history.

### P2C-04 — Size-exchange price difference
If the replacement variant/product has a different selling price, should the customer:
- pay the positive difference;
- receive the negative difference as a refund;
- or should another store policy apply?

**Recommended default:** settle the exact difference explicitly in the exchange transaction using the accepted payment/refund policy.

### P2C-05 — Returned-stock disposition
When a returned garment is physically received, when does it become sellable stock again?

**Recommended default:** staff must explicitly confirm it is sellable before it returns to available Retail Store stock. Damaged/used/non-sellable items must not inflate sellable stock; the implementation may need a bounded non-sellable/inspection disposition rather than a generic inventory adjustment.

### P2C-06 — Preorder cancellation versus post-collection return
Should this phase also support cancellation/refund of an **uncollected** preorder, or only returns/exchanges of items already physically released to the customer?

**Recommended scope control:** implement returns/exchanges for physically completed/released retail transactions first. Treat cancellation/refund of an uncollected preorder as a separate policy path because it interacts with deposits, reservations and production demand.

### P2C-07 — Connectivity
May refund/exchange actions be executed during an internet outage?

**Recommended default:** require connectivity for request approval and execution. Refund eligibility, prior refunded quantity, payment history and current authorization are server-authoritative, so Phase 2A ordinary-offline-sale proof should not be generalized here.

## UI direction

Use native Odoo/Owl operational patterns and maintained accessible controls. The workflow should show:
- original receipt/order reference;
- original and already-refunded quantities;
- requested return/exchange quantities;
- reason and eligibility/approval state;
- original and replacement variant for exchanges;
- price difference and exact settlement effect;
- stock disposition of returned items;
- approving manager and execution actor;
- EN/AR + RTL parity.

Do not add decorative motion that delays checkout/customer-service work. Preserve the project's modern/practical operational visual direction and reduced-motion support.

## Security and audit validation

Hosted validation must include at least:
- Cashier cannot approve or directly mutate native refund/payment/stock records;
- Store Manager can approve only within assigned store scope;
- repeated request/approval/execution does not duplicate financial or stock effects;
- cumulative partial refund cannot exceed original eligible quantity;
- returned item is not made sellable until the accepted stock-disposition condition is satisfied;
- exchange returns the original variant and issues the replacement variant exactly once;
- price difference settlement follows the accepted P2C-04 rule;
- original transaction remains unchanged and linked to reversal records;
- online guard fails closed if P2C-07 remains online-only;
- representative EN/AR/RTL browser path;
- Phase 1, Phase 2A and Phase 2B regressions remain green;
- repeatable `fu_core + fu_retail + fu_preorder + <Phase 2C addon/change>` upgrade remains green as applicable.

## Documentation outputs

Before implementation starts:
- record accepted P2C-01 through P2C-07 decisions in an authoritative requirements/decision document;
- inspect and record the exact pinned-Odoo refund/return model boundary;
- update role/permission detail only if the accepted workflow changes the already-delegated approval design.

Before phase closure:
- record exact tested application SHA, workflow run/job, artifact/digest and representative UI evidence;
- distinguish tested application SHA from later cleanup/docs commits;
- remove temporary diagnostic workflows;
- update `PROJECT.md` and `docs/README.md`.

## Exit criteria

Phase 2C can close only when:
1. P2C-01 through P2C-07 are accepted or explicitly deferred without leaving unsafe ambiguity;
2. original sale/payment history is preserved and all reversals are linked/attributable;
3. refund/exchange quantity and payment effects are bounded and idempotent;
4. returned-stock disposition cannot silently inflate sellable stock;
5. exchange variant and price-difference handling are explicit and tested;
6. role/store-scope boundaries are server-enforced;
7. connectivity behavior is explicit and tested;
8. EN/AR/RTL representative UI passes;
9. Phase 1 + Phase 2A + Phase 2B regressions and repeatable upgrades remain green;
10. no B2B, tax/legal, card/wallet, repair or deployment policy is smuggled into the result.

Implementation must not start by guessing the open client policies above.
