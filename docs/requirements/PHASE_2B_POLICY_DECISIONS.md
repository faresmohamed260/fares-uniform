# Phase 2B — preorder/balance/collection policy decisions

Status: **ACCEPTED FOR IMPLEMENTATION, 2026-09-09.**

This document closes the five targeted policy gates in `docs/phases/PHASE_2B_PREORDER_COLLECTION.md`.

The client was presented with the five recommended defaults immediately before instructing the developer to **keep going**. Under the established project continuation convention (see D-025), that continuation is treated as approval of the immediately stated bounded defaults below. These decisions authorize Phase 2B implementation only within the existing contract; they do not authorize refund/exchange policy, bank integration, production deployment, real-data migration or paid resources.

## P2B-01 — New preorder creation during an outage

**Decision: server connectivity required.**

Do not allow creation of a new preorder while offline, including taking its initial Cash or positively confirmed InstaPay payment.

Rationale:
- Phase 2A offline proof applies to ordinary POS checkout only;
- Phase 2B does not create a second preorder/payment offline queue;
- preorder customer, pricing and payment state remain server-authoritative.

The UI must fail closed and explain that preorder creation requires connectivity.

## P2B-02 — Additional payment and collection during an outage

**Decision: server connectivity required for both.**

Staff may not record an additional preorder payment or release/collect preorder items while offline.

Collection especially requires live server checks for:
- D-014 whole-order balance settlement;
- current ready/eligible quantity;
- prior collection quantity;
- current role/store scope.

The UI must fail closed rather than trust stale cached state.

## P2B-03 — Deposit amount rule

**Decision: any staff-entered positive amount up to the current whole-order total is allowed.**

No minimum percentage or fixed minimum deposit is imposed in Phase 2B.

Server validation must require:
- amount > 0;
- amount <= remaining balance;
- the resulting accepted payment event is attributable and append-only/reversal-based rather than silently rewriting prior payments.

A customer may still pay the full amount at preorder creation.

## P2B-04 — Stock reservation/allocation

**Decision: reserve preorder units when they physically become available at the Retail Store, not at preorder creation.**

Consequences:
- accepting a preorder or deposit must not itself reserve stock;
- do not use native POS/Sales down-payment behavior unchanged because it auto-confirms a draft Sales Order and launches stock rules;
- a preorder may remain technically unconfirmed in native Sales while its Fares business state is accepted/awaiting readiness;
- allocation occurs only against units physically present at the Retail Store;
- allocated units must not remain simultaneously available for ordinary POS sale.

The exact reservation implementation may use the smallest native Odoo stock mechanism that enforces this rule without creating a parallel stock ledger.

## P2B-05 — Partial readiness and collection

**Decision: allowed after the entire preorder balance is settled.**

Once remaining balance for the whole preorder is zero, the customer may collect any subset of quantities that are currently Ready for collection at the Retail Store while the rest remains outstanding.

Server rules:
- D-014 is enforced before the first and every later collection;
- released quantity cannot exceed ready/allocated uncollected quantity;
- cumulative collection is derived from authoritative completed stock moves;
- remaining uncollected quantities persist for later visits;
- payment completion remains independent from physical collection completion.

## Implementation boundary unlocked by these decisions

Phase 2B may now proceed server-first on `phase-2b/preorder-balance-collection` using the technical boundary in `docs/architecture/PHASE_2B_PREORDER_MODEL.md`:

- `sale.order` / `sale.order.line` as preorder identity;
- native Odoo payment records for online payment events;
- native stock records for reservation/release/collection;
- narrow Fares-owned linkage/state/idempotency fields/services where native models do not express the business contract;
- no parallel order/payment/stock ledger;
- no new offline queue.

Implementation should begin with hosted server tests for preorder creation, deposit/full-payment validation, derived balance, D-014 rejection, reservation-at-store, partial/final collection, exact-once replay and role/store enforcement before broad UI work.
