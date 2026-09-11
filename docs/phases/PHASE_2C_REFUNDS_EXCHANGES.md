# Phase 2C — Retail refunds and size exchanges

Status: **IMPLEMENTATION ACTIVE; CLIENT POLICY CLOSED; PINNED ODOO MODEL BOUNDARY COMPLETE; EGYPT CONSUMER-POLICY BASELINE RECORDED.**

Branch: `phase-2c/refunds-exchanges`.

This phase starts from the verified Phase 2B closure commit `5f341fb4aa5eacb12191dd41afa43c02000abcd4`. No merge, deployment or real-data migration is authorized by starting this phase.

## Why this phase exists

The accepted MVP explicitly includes refunds and size exchanges. Discovery confirmed both needs and intentionally deferred detailed eligibility, settlement and returned-stock behavior to this retail phase.

The goal is to implement returns without erasing or rewriting original sale/payment/stock history and without granting routine checkout staff broad native Odoo accounting or stock authority.

## Starting evidence and inherited constraints

Authoritative repository requirements establish:
- refunds and size exchanges are part of first-release retail scope;
- completed transactions remain preserved; reversals/corrections are explicit records rather than silent edits;
- Cash and positively manually confirmed InstaPay are the current payment methods;
- Cashier may request returns/exchanges but cannot approve refunds;
- Store Manager may approve refund/exchange actions within store scope; Owner/Admin retains administrative authority;
- server-side authorization is required; hiding a UI button is not authorization;
- Odoo records remain operational truth; no parallel refund/payment/stock ledger is allowed;
- ordinary offline checkout is proven, but refunds/exchanges are explicitly online-only under P2C-07;
- English/Arabic/RTL and brand-independent hardware constraints continue to apply.

Phase 2B is complete at application authority `af64b858cf6f2be6a143bb19e836721abc216221`, run `34547236245`, job `103102402060`. Its later cleanup and documentation lineage does not replace that tested application SHA.

## Accepted Phase 2C policy

`docs/requirements/PHASE_2C_POLICY_DECISIONS.md` is authoritative for P2C-01 through P2C-07. Client approval was received on 2026-09-11.

Accepted policy:
1. routine refunds/exchanges require the original recorded retail transaction; no anonymous refund path is exposed;
2. ordinary consumer retail follows the researched Egypt CPA baseline of 14 days from receipt/physical delivery without reason, subject to published exceptions, and 30 days for defective goods; no longer voluntary Fares window is added here;
3. normal stocked school uniforms are not treated as custom solely because they carry a school/client design; genuinely made-to-special-specification compliant items may use the published custom-goods exception;
4. Cash refunds settle as Cash; positively confirmed InstaPay refunds settle by outbound InstaPay with staff-recorded positive bank evidence; original payment history is never rewritten;
5. the automated initial path is limited to source sales paid entirely by one supported method; mixed-method refund allocation is deferred rather than invented;
6. size exchanges settle the exact difference: customer pays a positive difference, receives a negative difference under the accepted refund method, and equal price creates no money movement;
7. returned garments enter a dedicated non-sellable `Returns / Inspection` location until explicit inspection accepts them back into sellable Retail Store stock;
8. uncollected-preorder cancellation/refund is excluded from Phase 2C;
9. request, approval and execution require connectivity and fail closed offline.

## External consumer-policy baseline

`docs/requirements/PHASE_2C_POLICY_RESEARCH.md` records current Egypt Consumer Protection Agency guidance researched on 2026-09-11.

For consumer retail, the researched CPA guidance states:
- a 14-day return/exchange period from receipt without reason, subject to published exceptions;
- a 30-day return/exchange right for defective goods;
- for defective returns, replacement/refund without extra cost and refund by the same purchase method;
- exceptions to the no-reason path include compliant goods made to special consumer specifications, consumer-caused condition changes, and certain clothing categories such as underwear/wedding dresses when packaging is removed.

This is an implementation constraint, not final legal certification. B2B/customer-commercial transactions remain a later contract-policy slice.

## Odoo-native technical direction

The exact pinned Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` has been inspected. The authoritative analysis is `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`.

Pinned findings:
1. native POS refund lines are linked to their original POS line through `refunded_orderline_id` and Odoo computes cumulative `refunded_qty`;
2. native POS rejects refund quantity beyond the outstanding source quantity;
3. a delivered POS refund's negative line creates the return stock effect and links its stock move to the original done outgoing move through `origin_returned_move_id`;
4. refund-before-delivery cancels/reduces the still-open outbound effect instead of manufacturing a false customer return;
5. generic `stock.return.picking` creates a separate reverse picking and is appropriate for non-POS delivery reversal, not as an additional stock effect on top of a POS refund;
6. pinned `sale_stock` preserves `sale_line_id` and `sale_id` through generic returns;
7. mixed positive/negative POS lines are processed as separate outgoing/return stock effects, giving a sound native basis for a different-variant size exchange plus explicit net settlement;
8. native `pos.order._refund()` creates a linked draft refund order in the current POS session and is the preferred server-side construction primitive for approved returns.

Implementation direction:
1. use native order-linked POS refund records rather than editing/deleting the original POS order;
2. let the POS refund own its native return stock effect; never double-return the same quantity through the generic reverse-transfer wizard;
3. use `stock.return.picking` only where a non-POS/native delivery reversal is actually the owning workflow;
4. model a size exchange as an attributable native return of the original variant plus a positive sale/release of the replacement variant, with the exact price difference handled explicitly;
5. preserve links among original sale, refund, payment settlement and stock movement;
6. keep replay/idempotency guards around every Fares-owned approval/execution boundary;
7. route uninspected returned stock to the accepted non-sellable `Returns / Inspection` location before any later explicit move to sellable Retail Store stock.

## Functional scope

Phase 2C covers:
- locating an eligible original retail transaction;
- selecting one or more returned lines and quantities;
- recording return reason/path and eligibility basis;
- Cashier request with Store Manager/Owner approval;
- manager-approved partial or full refund;
- size exchange from one stocked variant to another;
- explicit calculation and settlement of any exchange price difference;
- attributable Cash/InstaPay refund evidence under the accepted single-method boundary;
- physical return into `Returns / Inspection`;
- explicit inspected acceptance into sellable Retail Store stock where applicable;
- bilingual refund/exchange operational UI/evidence referencing the original transaction;
- idempotent request/approval/execution behavior;
- server-enforced role/store scope and direct-native-mutation denial;
- fail-closed online-only execution.

## Explicit exclusions until separately authorized

- mixed-method automated refund allocation;
- uncollected-preorder cancellation/refund;
- card/wallet refund implementation;
- automated bank or InstaPay API integration;
- chargebacks;
- B2B contract returns/credit policy;
- legal/tax finalization beyond preserving native Odoo accounting/credit-note semantics where applicable;
- repairs/alterations workflows;
- product warranty policy;
- production material/WIP returns;
- production deployment or real-data migration.

## Required invariants

1. A completed original transaction is never silently rewritten or deleted to perform a refund/exchange.
2. Every return/refund is linked to the source transaction and records actor, approver, time, reason, lines, quantities and settlement evidence.
3. Cumulative refunded/returned quantity cannot exceed the eligible quantity from the original line after prior refunds.
4. A replay/retry cannot duplicate refund payment or stock effects.
5. Returned stock does not become sellable merely because a financial refund was approved; it remains in `Returns / Inspection` until explicit accepted inspection.
6. Size exchange preserves both legs: return of the original variant and issue/sale of the replacement variant.
7. Price differences are explicit payment/refund effects, never hidden product-price edits.
8. Cashier cannot approve their own refund/exchange merely by calling a native API directly.
9. Store/location scope remains server-enforced.
10. The workflow must not create a second sales/payment/stock ledger outside native Odoo records and bounded Fares audit/approval metadata.
11. Refund/exchange execution fails closed offline and cannot later replay into an unapproved mutation.
12. Mixed-method source payments are blocked from the routine automated path until a future allocation rule is accepted.

## Role boundary

### Cashier
- may locate the source transaction and prepare/request a return or exchange;
- may perform only manager-approved execution explicitly delegated by the workflow;
- cannot approve refunds, override eligibility, rewrite payment history, alter stock directly or change product master data.

### Store Manager
- may approve eligible store refunds/exchanges within assigned scope;
- approval must be attributable to the approving account;
- cannot bypass system-wide Owner/Admin controls or unrelated stock/accounting boundaries.

### Owner / Administrator
- may approve/administer allowed refund/exchange actions and documented exceptional handling;
- exceptional behavior still requires explicit recorded reason/evidence rather than silent mutation.

## UI direction

Use native Odoo/Owl operational patterns and maintained accessible controls. The workflow should show:
- original receipt/order reference;
- receipt/delivery date and eligibility path;
- original and already-refunded quantities;
- requested return/exchange quantities;
- reason, condition and approval state;
- original and replacement variant for exchanges;
- price difference and exact settlement effect;
- `Returns / Inspection` disposition and later sellable acceptance where applicable;
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
- returned item lands in `Returns / Inspection` and is not sellable until explicit inspection acceptance;
- exchange returns the original variant and issues the replacement variant exactly once;
- price difference settlement follows P2C-04;
- Cash and confirmed-InstaPay refunds preserve original payment and create attributable same-method settlement evidence;
- mixed-method automated refund is rejected/fail-closed;
- original transaction remains unchanged and linked to reversal records;
- online guard fails closed for request/approval/execution;
- representative EN/AR/RTL browser path;
- Phase 1, Phase 2A and Phase 2B regressions remain green;
- repeatable `fu_core + fu_retail + fu_preorder` upgrade remains green unless a later implementation commit adds another bounded addon.

## Documentation outputs

Before implementation starts — **complete**:
- P2C-01 through P2C-07 accepted in `docs/requirements/PHASE_2C_POLICY_DECISIONS.md`;
- exact pinned-Odoo refund/return boundary recorded in `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`;
- external research retained separately in `docs/requirements/PHASE_2C_POLICY_RESEARCH.md`;
- existing role design remains sufficient; implementation may add model ACLs/rules without changing the delegated role responsibilities.

Before phase closure:
- record exact tested application SHA, workflow run/job, artifact/digest and representative UI evidence;
- distinguish tested application SHA from later cleanup/docs commits;
- remove temporary diagnostic workflows;
- update `PROJECT.md` and `docs/README.md`.

## Exit criteria

Phase 2C can close only when:
1. P2C-01 through P2C-07 remain represented exactly as accepted;
2. researched statutory constraints are represented without claiming final legal certification;
3. original sale/payment history is preserved and all reversals are linked/attributable;
4. refund/exchange quantity and payment effects are bounded and idempotent;
5. returned-stock disposition cannot silently inflate sellable stock;
6. exchange variant and price-difference handling are explicit and tested;
7. role/store-scope boundaries are server-enforced;
8. connectivity behavior is explicit and tested;
9. EN/AR/RTL representative UI passes;
10. Phase 1 + Phase 2A + Phase 2B regressions and repeatable upgrades remain green;
11. no B2B, mixed-method, preorder-cancellation, tax/legal, card/wallet, repair or deployment policy is smuggled into the result.