# Phase 3B policy decisions — business-client orders

Status: **P3B-01 THROUGH P3B-04 ACCEPTED FOR MVP COMMERCIAL EXECUTION.**

Branch: `phase-3b/business-client-orders`.

Accepted by the client on 2026-09-11 after the policy-neutral Phase 3B milestone was hosted-verified.

These decisions govern the initial business-client commercial path. They do not authorize B2B refund/credit behavior, production deployment, or real-data migration.

## Confirmed baseline

- Business-client flow begins with contact/enquiry, design discussion, samples and sample approval.
- A deposit is collected after sample approval before the business order is commercially confirmed.
- Production/delivery is tracked against a delivery date.
- Goods are shipped only after the accepted payment-release rule below is satisfied.
- Some business customers buy available stock rather than requiring manufacture-to-order.
- Cash and positively confirmed InstaPay are the current payment methods.
- Sales/Business Development owns customer follow-up and commercial preparation but does not gain stock/payment-verification/admin authority.
- Native Odoo sale, payment and stock records remain operational truth.

## P3B-01 — Remaining-balance due point

Status: **ACCEPTED.**

**Rule:** the entire remaining balance must be fully paid before any goods leave Fares custody.

Implementation consequences:
- an outstanding business-order balance blocks customer shipment server-side;
- the release check must use live authoritative posted business payments, not a manually writable paid flag;
- paying the deposit is not sufficient for shipment unless the whole order balance is zero;
- ordinary draft/commercial preparation remains separate from physical release.

## P3B-02 — Partial shipments

Status: **ACCEPTED — NOT ALLOWED IN MVP.**

**Rule:** a Phase 3B business order ships as one complete customer delivery. Partial customer shipment/backorder release is not permitted in the MVP.

Implementation consequences:
- the controlled business shipment action must fail closed unless the complete sale-order delivery can be released together;
- a delivery with only part of the ordered customer quantity picked/available must not be validated as a partial shipment;
- multi-delivery/backorder policy is deferred until explicitly reopened by the client.

This does not prohibit internal stock transfers or unrelated ordinary Odoo deliveries.

## P3B-03 — Deposit rule

Status: **ACCEPTED.**

**Rule:** the deposit is a negotiated positive amount per business order. There is no hardcoded percentage, default percentage, or mandatory minimum percentage/amount beyond being greater than zero and not exceeding the order total.

Implementation consequences:
- staff records the actual agreed positive deposit/payment amount;
- a posted positive business payment is required before commercial confirmation;
- subsequent positive payments may reduce the remaining balance up to the whole-order total;
- payment recording remains retry-safe and must not permit overpayment;
- positively confirmed InstaPay remains mandatory where the configured journal uses bank-notification confirmation;
- no Odoo prepayment percentage is treated as a Fares default.

## P3B-04 — Change/cancellation after approval/deposit

Status: **ACCEPTED FOR MVP WITH FAIL-CLOSED CANCELLATION.**

**Rule:** once a business payment has been recorded, commercial changes require Owner/Admin approval in the current role model. There is no separate Business/Sales Manager role yet, so Owner/Admin is the least-privilege approving manager for this MVP slice.

Commercial-change behavior:
- Sales/BD may prepare and revise the draft before the first payment under their existing assigned-enquiry scope;
- after any posted business payment exists, Sales/BD may no longer mutate commercial line/price/quantity, customer reference, or delivery-date terms;
- Owner/Admin may make a controlled approved draft change while the order remains draft, with approving actor/time recorded;
- once the business order is commercially confirmed, the MVP does not permit commercial-line mutation through the Fares workflow.

Cancellation behavior:
- draft business work with no recorded payment may be cancelled through the allowed workflow;
- once money has been recorded, cancellation is blocked rather than inventing forfeiture/refund/credit treatment;
- a confirmed business order therefore cannot be cancelled in this MVP because confirmation itself requires a posted positive deposit;
- deposit reversal, refund, credit note and forfeiture treatment remain a separate later B2B refund/credit policy.

## Payment and release role boundary

Accepted implementation mapping under the existing role model:
- **Sales / Business Development:** assigned enquiry/sample/draft preparation and controlled commercial confirmation after a valid posted deposit exists; no payment verification/posting and no physical shipment validation.
- **Cashier / Store Manager:** bounded recording of Cash or positively confirmed InstaPay business payments; no authority to rewrite commercial terms merely by recording payment.
- **Inventory Staff / Store Manager:** bounded physical customer-shipment execution after the full-balance and whole-delivery checks pass and only within assigned Fares stock-location scope.
- **Owner / Administrator:** may perform the bounded workflow and is the approving authority for post-payment draft commercial changes in the current MVP role model.

These role mappings do not grant broad native accounting, stock, contact, product-master, role-administration or refund authority.

## Mandatory enforcement

The commercial execution slice must enforce these rules on the server and cover direct ORM/API bypass attempts. UI hiding alone is insufficient.

At minimum validation must prove:
- no confirmation before a positive posted business deposit;
- no overpayment and retry-safe payment recording;
- InstaPay requires positive manual bank-notification confirmation when configured;
- Sales/BD cannot spoof internal context to bypass protected state/commercial writes;
- post-payment Sales/BD commercial edits are denied;
- controlled Owner/Admin post-payment draft edits are attributable;
- no customer shipment with any balance due;
- no partial customer shipment/backorder release;
- Sales/BD cannot validate shipment;
- shipment authority remains location-scoped for operational stock roles;
- cancellation with recorded money is blocked;
- ordinary non-business sale/payment/stock behavior and all prior Fares phases remain unaffected;
- EN/AR/RTL operational UI and repeatable five-addon upgrade remain green.

## Still excluded

The accepted policies do **not** define or authorize:
- B2B deposit refund/forfeiture rules;
- B2B credit notes/refunds;
- post-confirmation commercial amendment workflow;
- partial shipments;
- customer credit terms or pay-after-delivery terms;
- cards/wallets;
- automated bank integration;
- production deployment or real-data migration.

## Closure rule

Full Phase 3B may close only after the accepted P3B-01 through P3B-04 rules above are implemented on native Odoo sale/payment/stock truth, direct bypass/security/idempotency regressions pass, EN/AR/RTL evidence is retained, and the exact application SHA passes the combined Phase 1–3B hosted gate plus repeatable five-addon upgrade.
