# Phase 3B policy decisions — business-client orders

Status: **OPEN COMMERCIAL POLICY GATES; POLICY-NEUTRAL ENQUIRY/SAMPLE SLICE MAY PROCEED.**

Branch: `phase-3b/business-client-orders`.

These questions were intentionally deferred from discovery because they change customer-balance and stock-release enforcement. They must not be guessed from convention or from Odoo defaults.

## Confirmed baseline

Already accepted:
- business-client flow begins with contact/enquiry, design discussion, samples and sample approval;
- a deposit is collected after sample approval in the current described workflow;
- production/delivery is tracked against a delivery date;
- goods are shipped and the remaining balance is collected;
- some business customers buy available stock rather than requiring manufacture-to-order;
- Cash and positively confirmed InstaPay are the current payment methods;
- Sales/Business Development owns customer follow-up and commercial preparation but does not automatically gain stock/payment-verification/admin authority;
- native Odoo sale/payment/stock records remain operational truth.

## P3B-01 — Remaining-balance due point

Status: **OPEN.**

Need a client rule for when the remaining balance becomes mandatory.

Candidate policies, not decisions:
1. full remaining balance before any shipment leaves Fares custody;
2. remaining balance collected on/after full shipment/delivery;
3. an explicit due date/payment term agreed per business order.

Why this matters: the rule determines whether shipment must be server-blocked for an outstanding balance and how an overdue balance is computed.

Until resolved: the Phase 3B safe slice cannot confirm a Fares business order or release shipment.

## P3B-02 — Partial shipments

Status: **OPEN.**

Need a client rule for whether part of a business order may be shipped before all goods are shipped.

If partial shipment is allowed, the client must also select how payment and shipment interact. Candidate approaches, not decisions:
- allow shipment while an outstanding balance remains;
- require a proportional payment against shipped value;
- require the full remaining balance before the first partial shipment;
- record explicit order-specific terms.

Why this matters: native Odoo can represent partial delivery, but Fares still needs the business rule that authorizes release.

Until resolved: the safe slice creates no shipment authorization path.

## P3B-03 — Deposit rule

Status: **OPEN.**

Need a client rule for the amount/percentage required after sample approval.

Candidate policies, not decisions:
1. any negotiated positive amount up to the order total;
2. a default percentage staff may override within authorization;
3. a mandatory minimum percentage/amount.

No percentage or amount is currently accepted. Odoo's native prepayment percentage field must not be treated as a Fares default.

Until resolved: the safe slice records no Phase 3B customer deposit.

## P3B-04 — Change/cancellation after approval/deposit

Status: **OPEN.**

Need initial client rules for:
- whether agreed quantities/prices may change after sample approval or deposit;
- who approves such changes;
- whether an unshipped order may be cancelled;
- what happens to an already-recorded deposit after cancellation.

Why this matters: these actions can require reversal/credit/refund policy and stock consequences.

Until resolved: the safe slice does not permit confirmed-business-order cancellation, deposit reversal or post-deposit commercial mutation.

## Authorized policy-neutral first slice

The user's instruction to continue development authorizes progress that does **not** choose any P3B-01 through P3B-04 outcome.

The first slice may implement:
- business enquiry/contact workflow;
- meeting/design requirements;
- sample preparation/sent/revision/approval/rejection workflow;
- actor/time audit for sample decisions;
- native-linked draft quotation preparation after sample approval;
- server guard preventing Fares business-order confirmation while these policy gates remain open;
- bilingual/RTL operational UI and hosted regression/upgrade evidence.

The first slice must not implement or imply:
- deposit collection;
- remaining-balance due logic;
- partial/full shipment authorization;
- confirmed-order cancellation/refund/credit;
- any default payment term or deposit percentage.

## Closure rule

Full Phase 3B cannot close until P3B-01 through P3B-04 are either:
- explicitly decided by the client and implemented/validated; or
- explicitly excluded from Phase 3B with an agreed fail-closed operational behavior.
