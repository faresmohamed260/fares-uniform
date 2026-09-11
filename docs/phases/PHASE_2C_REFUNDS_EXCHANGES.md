# Phase 2C — Retail refunds and size exchanges

Status: **PLANNING ACTIVE; PINNED ODOO MODEL BOUNDARY COMPLETE; EGYPT CONSUMER-POLICY BASELINE RESEARCHED; CLIENT POLICY GATES OPEN; IMPLEMENTATION NOT STARTED.**

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

## External consumer-policy baseline

`docs/requirements/PHASE_2C_POLICY_RESEARCH.md` records current Egypt Consumer Protection Agency guidance researched on 2026-09-11.

For consumer retail, the CPA guidance states:
- a 14-day return/exchange period from receipt without reason, subject to published exceptions;
- a 30-day return/exchange right for defective goods;
- for defective returns, replacement/refund without extra cost and refund by the same purchase method;
- exceptions to the no-reason path include compliant goods made to special consumer specifications, consumer-caused condition changes, and certain clothing categories such as underwear/wedding dresses when packaging is removed.

This is an implementation constraint, not a final legal opinion. B2B/customer-commercial transactions are outside the CPA consumer definition cited by the research and remain a later contract-policy slice.

## Odoo-native technical direction

The exact pinned Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` has been inspected. The authoritative analysis is `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`.

Pinned findings:
1. native POS refund lines are linked to their original POS line through `refunded_orderline_id` and Odoo computes cumulative `refunded_qty`;
2. native POS rejects refund quantity beyond the outstanding source quantity;
3. a delivered POS refund's negative line creates the return stock effect and links its stock move to the original done outgoing move through `origin_returned_move_id`;
4. refund-before-delivery cancels/reduces the still-open outbound effect instead of manufacturing a false customer return;
5. generic `stock.return.picking` creates a separate reverse picking and is appropriate for non-POS delivery reversal, not as an additional stock effect on top of a POS refund;
6. pinned `sale_stock` preserves `sale_line_id` and `sale_id` through generic returns;
7. mixed positive/negative POS lines are processed as separate outgoing/return stock effects, giving a sound native basis for a different-variant size exchange plus explicit net settlement.

Implementation direction:
1. use native order-linked POS refund records rather than editing/deleting the original POS order;
2. let the POS refund own its native return stock effect; never double-return the same quantity through the generic reverse-transfer wizard;
3. use `stock.return.picking` only where a non-POS/native delivery reversal is actually the owning workflow;
4. model a size exchange as an attributable native return of the original variant plus a positive sale/release of the replacement variant, with any price difference handled explicitly;
5. preserve links among original sale, refund, payment settlement and stock movement;
6. keep replay/idempotency guards around every Fares-owned approval/execution boundary;
7. do not execute a return into sellable Retail Store stock until P2C-05 determines whether inspection occurs before refund or requires a non-sellable/inspection location.

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

## Blocking client policy gates

Statutory consumer constraints are recorded above. The remaining choices below determine how the software operationalizes them. Recommendations are proposals until the client accepts them.

### P2C-01 — Proof/source transaction

**Recommended:** require selection of the original recorded sale for the automated flow. Exceptional proof disputes are Manager/Owner-only and remain outside routine Cashier execution. Do not expose native anonymous standalone refunds initially.

### P2C-02 — Eligibility and condition implementation

The consumer-retail implementation must not undercut the researched CPA baseline: 14-day no-reason path subject to published exceptions, plus 30-day defective path.

**Recommended:** use receipt/physical-delivery date as the eligibility clock; distinguish genuinely made-to-special-specification compliant items from normal stocked uniforms; require the item to satisfy the applicable statutory condition rule. The client still needs to decide whether Fares offers any better/longer voluntary policy than the statutory baseline.

### P2C-03 — Refund payment execution

For defective consumer goods, researched CPA guidance requires refund by the same purchase method.

**Recommended:** Cash purchase -> Cash refund; confirmed InstaPay purchase -> outbound InstaPay refund with staff manually recording positive bank evidence until automation exists. Preserve original payment; create a new explicit refund record. Multi-method allocation requires a separate accepted rule if the use case exists.

### P2C-04 — Size-exchange price difference

**Recommended:** settle the exact difference explicitly. Customer pays a positive difference; a negative difference is refunded under P2C-03. Equal price produces no money movement.

### P2C-05 — Returned-stock disposition

**Recommended:** inspect before sellable re-entry. If refund can occur before final condition classification, return to a dedicated non-sellable `Returns / Inspection` location and move to Retail Store sellable stock only after explicit acceptance. Damaged/non-sellable returns never inflate sellable stock.

### P2C-06 — Uncollected preorder cancellation

**Recommended:** exclude uncollected-preorder cancellation/refund from Phase 2C. It interacts with deposits, reservations and production demand and should receive its own bounded policy path.

### P2C-07 — Connectivity

**Recommended:** require connectivity for request, approval and execution. Eligibility, prior refunded quantity, payment history and authorization are server-authoritative; Phase 2A ordinary offline-sale proof does not generalize to refunds.

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
- delivered POS refund creates exactly one native return stock effect and never a duplicate generic reverse transfer;
- refund-before-delivery cancels/reduces the open delivery without a fabricated customer return;
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
- keep `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md` as the exact pinned-Odoo refund/return boundary;
- keep `docs/requirements/PHASE_2C_POLICY_RESEARCH.md` as external research rather than silently treating recommendations as client decisions;
- update role/permission detail only if the accepted workflow changes the already-delegated approval design.

Before phase closure:
- record exact tested application SHA, workflow run/job, artifact/digest and representative UI evidence;
- distinguish tested application SHA from later cleanup/docs commits;
- remove temporary diagnostic workflows;
- update `PROJECT.md` and `docs/README.md`.

## Exit criteria

Phase 2C can close only when:
1. P2C-01 through P2C-07 are accepted or explicitly deferred without leaving unsafe ambiguity;
2. researched statutory constraints are represented without claiming final legal certification;
3. original sale/payment history is preserved and all reversals are linked/attributable;
4. refund/exchange quantity and payment effects are bounded and idempotent;
5. returned-stock disposition cannot silently inflate sellable stock;
6. exchange variant and price-difference handling are explicit and tested;
7. role/store-scope boundaries are server-enforced;
8. connectivity behavior is explicit and tested;
9. EN/AR/RTL representative UI passes;
10. Phase 1 + Phase 2A + Phase 2B regressions and repeatable upgrades remain green;
11. no B2B, tax/legal, card/wallet, repair or deployment policy is smuggled into the result.

Implementation must not start by guessing the open client policies above.
