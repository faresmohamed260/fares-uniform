# Phase 2B — Odoo preorder/payment/collection model analysis

Status: **PLANNING / POLICY-NEUTRAL TECHNICAL BOUNDARY**

This note records the pinned-Odoo model inspection required by `docs/phases/PHASE_2B_PREORDER_COLLECTION.md`. It narrows the implementation architecture without answering the five client policy gates. No Phase 2B application implementation is authorized by this document alone.

Pinned upstream: Odoo Community `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Technical conclusion

Use native Odoo business records as the authoritative operational truth and avoid introducing a separate preorder/payment/collection ledger.

The smallest current boundary is:

- `sale.order` + `sale.order.line` for the preorder/customer/product/price identity;
- native Odoo payment records for actual payment events;
- native `stock.picking` / `stock.move` records for physical collection/release;
- small Fares-owned linkage, policy and status fields/services only where native models do not express the preorder contract;
- no Supabase or other operational mirror;
- no second offline queue.

A new standalone `fu.preorder` order/line ledger is therefore not the preferred starting point. It would duplicate customer/order/line/pricing concepts already owned by `sale.order` without current evidence that `sale.order` is structurally insufficient.

## Why a draft Sales Order is the best preorder identity

Pinned `sale.order` already owns the stable concepts Phase 2B needs:

- customer: `partner_id`;
- order lines: `order_line` / `sale.order.line`;
- computed total: `amount_total`;
- promised date: `commitment_date` is available as a delivery-date concept;
- currency/pricelist/taxes;
- salesperson/company attribution;
- standard chatter/audit history;
- later invoice and stock integration.

Phase 2B can add a narrow Fares marker/status surface such as an `fu_is_preorder` flag plus derived preorder state where needed. The native Sales state must not be misrepresented as the complete Fares preorder state machine.

The order should remain technically unconfirmed while confirmation would violate an unresolved reservation/allocation policy.

## Critical upstream constraint: Sales confirmation launches stock

Pinned `sale_stock` extends `sale.order._action_confirm()` by immediately calling `sale.order.line._action_launch_stock_rule()`.

Therefore a stockable Sales Order confirmation is not just a semantic status change: it launches procurement/stock behavior.

Phase 2B must not equate **preorder accepted** with native Sales confirmation until P2B-04 defines when reservation/allocation should begin.

This is the main reason the preorder needs a Fares business-state surface that can exist while the native Sales Order remains draft/sent.

## Critical upstream constraint: native POS Sales down payment auto-confirms the Sales Order

Pinned `pos_sale` already exposes native POS actions for:

- settling a Sales Order;
- applying a percentage down payment;
- applying a fixed down payment.

However the server `pos.order.sync_from_ui()` implementation also confirms linked draft/sent Sales Orders after a paid POS order is synchronized. This includes the Sales Orders collected through POS down-payment processing.

That means reusing the native POS-Sales down-payment path unchanged would couple these two business events:

1. staff records a preorder deposit;
2. the draft Sales Order becomes confirmed and launches stock rules.

Phase 2B is explicitly not allowed to make that coupling until P2B-04 is answered.

Therefore **do not implement Phase 2B deposits by simply linking the preorder to the standard `pos_sale` down-payment path unchanged.**

## Payment-record boundary

The payment mechanism depends on the offline policy gates, but the authoritative-record rule does not.

### Online-only existing-preorder payment path

Pinned `account.payment` already provides a native attributable payment record with:

- payment date;
- journal;
- payment method line;
- amount/currency;
- inbound customer payment semantics;
- customer (`partner_id`);
- generated journal entry (`move_id`);
- state and reconciliation information;
- chatter/audit support.

If P2B-01/P2B-02 require server connectivity for preorder payments, an Odoo-native `account.payment` linked narrowly to the preorder Sales Order is the preferred financial event candidate. Fares can extend it only with the preorder reference and manual InstaPay-confirmation evidence needed by the accepted business process.

The remaining balance must be computed from authoritative accepted payment records; it must not be maintained as a separately editable numeric ledger field.

### If any preorder payment is approved offline

Do not silently queue `account.payment` through a new Fares ledger.

Offline payment support would require a separately validated durable native-Odoo client path with stable idempotency and reload/replay tests comparable to Phase 2A. Before implementation, reassess whether a bounded POS-owned payment event can be used without triggering the `pos_sale` auto-confirm behavior described above.

This choice remains blocked by P2B-01/P2B-02 and is intentionally not guessed here.

## Collection-record boundary

Use native stock documents for physical release.

`stock.picking.type` supports outgoing operations, configurable reservation methods, partial transfer behavior and backorders. Native picking/move records therefore already provide the authoritative physical custody effect and exact moved quantity.

The preferred Phase 2B collection boundary is:

- collection/release is represented by an outgoing `stock.picking` from the Retail Store custody location to customer custody;
- the picking is linked to the preorder Sales Order through the smallest Fares-owned reference necessary for traceability;
- released quantity is the done `stock.move`/move-line quantity, not a separately maintained stock ledger;
- cumulative collected quantity is derived from completed linked collection pickings/moves;
- retries use a stable collection-command idempotency identity and must resolve to the same stock effect;
- the server checks D-014 (whole-order balance is zero) before creating/validating the release effect;
- the server checks eligible/ready quantity before release;
- cashier UI state is informative only; the server remains authoritative.

Whether stock is reserved earlier than collection remains P2B-04. The collection record design does not require that question to be guessed.

## Partial collection

Native stock transfer behavior already supports partial quantities and backorder concepts. Phase 2B should reuse those stock semantics rather than creating a second collected-quantity ledger.

Fares may expose preorder-level derived values such as:

- ordered quantity;
- ready/eligible quantity;
- collected quantity derived from done linked outgoing moves;
- remaining uncollected quantity.

P2B-05 still decides whether a fully paid customer may collect a ready subset before all preorder lines are ready.

## Candidate Phase 2B addon boundary

Prefer a separate bounded addon (working name `fu_preorder`) rather than growing ordinary-checkout code indiscriminately inside `fu_retail`.

Expected dependency direction after policy closure:

- `fu_core` — product identity, roles and Retail Store/Storage custody;
- `fu_retail` — Cash/InstaPay confirmation conventions and retained Phase 2A retail behavior where reusable;
- Odoo Sales / Sales Stock for preorder identity and stock integration;
- Accounting for online native payment records;
- POS/Sales only if an approved UX path genuinely reuses it without violating the stock-confirmation boundary.

Exact manifest dependencies must be chosen from the implemented path, not added speculatively.

## Server-owned invariants for implementation

Regardless of the answers to P2B-01 through P2B-05, implementation must enforce these server-side:

1. one preorder identity;
2. ordered lines are not silently rewritten by collection events;
3. payment history is attributable and append/reversal based, not silently edited;
4. remaining balance is derived from preorder total and authoritative valid payments;
5. no physical collection while any whole-order balance remains due (D-014);
6. collected quantity cannot exceed server-authoritative eligible quantity;
7. done stock moves are the physical release truth;
8. replay cannot duplicate payment or stock effects;
9. current role/store scope is revalidated on write/release;
10. refund/exchange behavior remains outside Phase 2B.

## Policy gates and their technical effect

### P2B-01 — Offline preorder creation

Determines whether draft preorder creation needs a durable client-side queue/reload path or may remain server-only.

It does **not** change the preferred authoritative preorder identity (`sale.order`).

### P2B-02 — Offline additional payment / collection

Determines whether native server-only payment/stock operations are sufficient.

Offline collection is especially high risk because D-014, readiness and prior collected quantity are server-authoritative. If collection is online-only, the implementation can fail closed without creating a second offline stock ledger.

### P2B-03 — Deposit amount rule

Determines server validation on initial payment amount. No percentage/minimum is selected here.

### P2B-04 — Stock reservation/allocation

Determines when the preorder may safely trigger reservation/allocation. Because Sales confirmation launches stock rules, this policy directly controls when/if the preorder Sales Order leaves draft/sent state or whether reservation is handled through a narrower stock operation.

### P2B-05 — Partial readiness and collection

Determines the server eligibility rule for releasing ready subsets after the whole preorder is fully paid.

## Rejected shortcuts

Do not:

- create a parallel Supabase preorder/payment/collection ledger;
- create a custom order/line model merely to reproduce `sale.order` concepts;
- use standard POS-Sales down payment unchanged before P2B-04 is resolved;
- confirm the Sales Order merely because a deposit was accepted;
- make an editable `balance_due` field financial truth;
- track collection only with a custom integer while stock moves say something else;
- generalize Phase 2A ordinary-sale offline safety to preorder/payment/collection without dedicated proof.

## Next implementation step after policy closure

Once P2B-01 through P2B-05 are answered, create the smallest `fu_preorder` implementation around this native-record boundary and add hosted exact-head tests before broad UI work.

The first server tests should prove:

- preorder creation with multiple size variants and promised pickup date;
- accepted deposit/full-payment rules;
- derived balance;
- D-014 collection rejection while balance is due;
- partial and final collection quantities using native done stock moves;
- collection replay idempotency;
- role/store enforcement;
- no regression to Phase 1 or Phase 2A.
