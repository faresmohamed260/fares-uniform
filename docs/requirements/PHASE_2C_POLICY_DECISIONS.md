# Phase 2C — Refund/exchange policy decisions

Status: **ACCEPTED BY CLIENT, 2026-09-11. IMPLEMENTATION AUTHORIZED WITHIN THIS BOUNDED PHASE.**

Source: client approval in the Fares Uniform project conversation on 2026-09-11 after review of the Phase 2C recommendations, pinned Odoo 19 model analysis, and Egypt Consumer Protection Agency baseline research.

This document closes P2C-01 through P2C-07 for the initial consumer-retail refund/size-exchange implementation. It does not authorize a merge, production deployment, real-data migration, B2B return policy, card/wallet refunds, automated bank integration, or uncollected-preorder cancellation.

## P2C-01 — Source transaction required

Accepted:
- the routine automated refund/exchange flow requires selection of the original recorded retail transaction;
- do not expose anonymous/native standalone refunds in the normal Fares workflow;
- exceptional proof-of-purchase disputes are Manager/Owner handling and remain outside routine Cashier execution.

The original sale remains immutable history. Refund/exchange records must link back to it.

## P2C-02 — Consumer eligibility window and condition

Accepted initial policy:
- ordinary consumer-retail returns/exchanges follow the researched Egypt CPA statutory baseline: **14 days from receipt/physical delivery without reason**, subject to the published statutory exceptions;
- defective consumer goods follow the researched **30-day** path;
- use the recorded receipt/physical-delivery date as the eligibility clock;
- do not add a longer voluntary Fares return window in this phase;
- a normal stocked school-uniform variant is not treated as custom merely because it belongs to a school/client design;
- a genuinely made-to-special-specification item that conforms to the consumer's requested specifications may use the published custom-goods exception;
- consumer-caused condition changes and other published exceptions remain ineligible for the no-reason path where applicable.

This is an implementation baseline from current public CPA guidance, not final legal certification. Production launch still requires the normal legal/compliance review appropriate to the business.

## P2C-03 — Refund settlement method

Accepted:
- preserve the original payment record; never rewrite it to simulate a refund;
- original **Cash** payment -> refund by **Cash**;
- original positively confirmed **InstaPay** payment -> outbound **InstaPay** refund;
- until bank automation exists, staff manually record/confirm the positive bank evidence for the outbound InstaPay transfer;
- refund settlement is a new explicit reversal/payment record linked to the source transaction and approval.

The approved package did not define a mixed-method allocation algorithm. Therefore the initial automated flow is bounded to source retail sales paid entirely by one supported method: Cash or confirmed InstaPay. Mixed-method refund allocation is not guessed in Phase 2C and remains Manager/Owner exception handling until explicitly specified.

## P2C-04 — Size-exchange price difference

Accepted:
- exchange uses an attributable return of the original variant plus issue/sale of the replacement variant;
- if the replacement costs more, the customer pays the exact positive difference;
- if the replacement costs less, the exact negative difference is refunded under P2C-03;
- equal price means no money movement;
- never hide the difference by editing the original sale price.

## P2C-05 — Returned-stock disposition

Accepted:
- returned garments must be physically received and inspected before they become sellable Retail Store stock;
- items not yet approved as sellable go to a dedicated non-sellable **Returns / Inspection** inventory location;
- damaged, used, defective, or otherwise non-sellable returns must not inflate sellable store availability;
- moving an inspected acceptable unit from Returns / Inspection into sellable Retail Store stock must be an explicit attributable stock movement.

Because pinned Odoo POS refund processing can complete its return picking immediately, Phase 2C must configure or wrap the native return destination so the financial refund cannot accidentally make an uninspected item sellable.

## P2C-06 — Uncollected preorder cancellation

Accepted scope boundary:
- do **not** implement cancellation/refund of an uncollected preorder in Phase 2C;
- that path interacts with deposits, reservations, production demand and cancellation timing and requires its own bounded policy/implementation slice.

Phase 2C covers returns/exchanges of retail goods already physically released/delivered to the customer.

## P2C-07 — Connectivity

Accepted:
- refund/exchange request, approval and execution require connectivity;
- eligibility, prior refunded quantity, payment history, current authorization and approval are server-authoritative;
- Phase 2A's ordinary offline-sale capability does not generalize to refunds/exchanges;
- offline attempts must fail closed and must not later replay into an unapproved refund.

## Role and authorization consequence

Existing role design remains binding:
- Cashier may locate the source transaction and prepare/request a return or exchange, but cannot approve a refund/exchange or bypass eligibility;
- Store Manager may approve eligible actions within assigned store scope;
- Owner/Admin may approve/administer allowed actions and exceptional handling;
- approval and execution actors must be attributable;
- hiding a UI control is never the authorization boundary.

## Technical consequence

The accepted policy is implemented on the pinned Odoo model boundary documented in `docs/architecture/PHASE_2C_REFUND_RETURN_MODEL.md`:
- native order-linked POS refund records own the financial/return relationship;
- the POS refund owns its native return stock effect; do not double-return through generic reverse transfer;
- returned stock routes to Returns / Inspection until explicitly accepted as sellable;
- exchanges preserve both the negative return leg and positive replacement leg;
- Fares-owned request/approval/execution boundaries must be idempotent and server-enforced.

## Acceptance summary

P2C-01 through P2C-07 are closed for implementation. Any behavior outside these rules is deferred rather than inferred.