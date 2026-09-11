# Phase 3B — Business-client enquiry, sample, order, shipment and balance tracking

Status: **POLICY-GATED — EXECUTION CONTRACT ESTABLISHED; APPLICATION IMPLEMENTATION MUST WAIT FOR P3B-01 THROUGH P3B-04.**

Branch: `phase-3b/business-client-orders`.

Starting lineage: Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Inherited application authority: Phase 3A application/test SHA `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`, run `34601274874`, job `103268897396`.

No merge, deployment or real-data migration is authorized by starting this phase.

## Why this is the next bounded phase

The accepted MVP includes business-client tracking after production automation. Current large-client practice is known at a high level:

1. client contacts the business;
2. a meeting gathers design/details;
3. the factory prepares and sends samples;
4. approved samples lead to a deposit;
5. production proceeds against a delivery date;
6. goods are shipped and the remaining payment is collected.

The repository deliberately deferred final-payment timing, partial-shipment behavior and change/cancellation rules to this phase. Those choices affect stock release, customer balance, overdue state and financial authorization, so they must be resolved before implementation rather than guessed.

## Confirmed inherited rules

The following are already authoritative and must not be re-asked unless new evidence conflicts:

- Business clients include schools, restaurants, cafes, hotels, hospitals and other organizations.
- Some business clients buy available stock; not every business order is made-to-order.
- Sales/Business Development owns enquiry/contact, draft quotation/contract, sample progress and business-order tracking.
- Large-client workflow uses a **deposit after sample approval**; D-005 must not be interpreted as mandatory full prepayment.
- Exact deposit percentage is not fixed and must not be invented.
- A delivery date is tracked.
- Cash and InstaPay are currently supported payment methods; cards/wallets remain future work.
- InstaPay continues to mean positive manual confirmation from the bank notification, not bank API automation.
- Odoo-native sale, payment and stock records remain operational truth; do not create a second order/payment/shipment ledger.
- Finished stock is tracked only at Retail Store/Storage custody. Factory `Finished` remains workflow-only.
- Public catalog never exposes price or stock.
- English/Arabic/RTL, named accounts, server-side authorization and attributable history remain mandatory.
- Owner/Admin retains broad authority; Sales/BD receives only bounded business-order permissions and does not gain stock/payment-verification/role-admin authority by implication.

## Goal

Replace the current paper/manual large-client follow-up with an attributable Odoo-owned workflow that can:

1. capture a business enquiry and customer/contact identity;
2. record meeting/design requirements and notes;
3. track samples through preparation/sent/approval/rejection or revision without pretending sample approval is an order shipment;
4. convert an approved commercial agreement into one authoritative business sale/order identity;
5. record agreed item variants, quantities, unit prices/discounts within authorized commercial permissions;
6. record deposit events without rewriting posted payment history;
7. track agreed delivery date and remaining customer balance;
8. track shipment through native Odoo stock records rather than custom shipment ledgers;
9. expose commercial/sample progress, payment state and physical shipment state as separate dimensions;
10. preserve actor/time attribution and bounded Sales/BD vs Manager/Owner permissions;
11. remain compatible with later operational reports and public enquiry handoff;
12. preserve every Phase 1–3A invariant and repeatable addon upgrades.

## Domain ownership direction

Phase 3B should reuse native Odoo concepts wherever their semantics match:

- `res.partner` for customer/company/contact identity;
- `sale.order` and `sale.order.line` for the agreed commercial order/lines;
- native payment/account records for deposits and remaining-balance receipts;
- `stock.picking`/`stock.move` for physical shipment;
- Fares-owned bounded fields/models only for workflow state that Odoo does not natively represent cleanly, such as enquiry/design/sample approval context and Fares-specific authorization/audit rules.

A Fares business-client workflow must not duplicate native order totals, posted payment history, delivered quantities or stock custody in independent truth fields.

The exact pinned-Odoo assessment belongs in `docs/architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md` before application implementation.

## State separation

Commercial/sample progress, payment state and physical shipment state are separate dimensions. Do not collapse them into one misleading status.

At minimum staff must be able to distinguish:

- enquiry/design discussion;
- sample preparing/sent/revision/approved/rejected;
- commercial order draft/agreed;
- deposit/balance state;
- delivery deadline state;
- shipment state derived from authoritative stock operations;
- settlement state derived from authoritative payments.

Production tracking may link to the business order later only through a bounded approved rule. Phase 3B must not silently reuse school-preorder production semantics for all B2B orders because some clients buy available stock.

## Role boundary

### Sales / Business Development

May, once implemented:
- create/update business enquiry and contact records within the allowed commercial workflow;
- record design/meeting notes;
- record sample progress and approval evidence;
- prepare draft quotation/order details;
- view the business order, agreed delivery date and the minimum payment/shipment status needed for follow-up.

Must not gain by Phase 3B role alone:
- direct stock mutation or arbitrary shipment validation;
- Cash/InstaPay verification authority unless separately assigned;
- posted-payment rewrite/cancellation;
- product-master mutation;
- refund/credit approval;
- user/role administration.

### Store Manager / Owner

Manager/Owner approval authority for price/discount or exceptional commercial actions must follow the existing role design and any Phase 3B policy decisions. Do not grant broad owner-equivalent access to Sales/BD.

### Inventory Staff

Physical shipment/stock custody remains through existing controlled stock permissions/native stock consequences. Phase 3B business tracking does not bypass stock authorization.

## Connectivity/offline boundary

No business-client workflow has an accepted offline requirement. Until the client explicitly requires it, Phase 3B business enquiry/order/payment/shipment mutations are online-only and fail closed when the server is unavailable. This does not change the mandatory ordinary POS offline behavior delivered in Phase 2A.

## Policy gates that block implementation

### P3B-01 — Remaining-balance due point

When does the remaining balance become mandatory?

Candidate policies include:
- before any shipment leaves Fares custody;
- on/after full shipment/delivery;
- a manually agreed due date/term per business order.

The current business description only says goods are shipped and the remaining payment is collected; it does not establish ordering or credit terms precisely enough for server enforcement.

### P3B-02 — Partial shipments

Are partial shipments allowed for business-client orders?

If yes, define whether:
- any positive shipment is permitted while a balance remains;
- payment is prorated by shipped value;
- full remaining balance is required before the first partial shipment;
- or terms are explicitly agreed per order.

This choice directly changes stock-release and balance gates.

### P3B-03 — Deposit rule

Is the deposit amount/percentage:
- fully negotiated per order with any positive amount up to the total;
- subject to a default percentage that staff can override;
- or subject to a mandatory minimum?

No numeric percentage is currently accepted and Phase 3B must not invent one.

### P3B-04 — Change/cancellation after approval/deposit

What is allowed after sample approval and/or deposit?

Need at least the initial rule for:
- editing agreed quantities/prices after deposit;
- cancelling an unshipped order;
- treatment of an already-recorded deposit when cancellation occurs.

If cancellation/credit is kept outside Phase 3B, the implemented workflow will fail those actions closed rather than guessing refund/credit behavior.

## Explicit exclusions until separately authorized

- B2B refund/credit-note policy;
- automated legal/electronic contracts or signatures;
- credit limits, credit scoring or automated payment terms;
- tax/legal invoice finalization beyond already selected Odoo accounting mechanics;
- automated bank integration;
- cards/wallets;
- raw/WIP inventory;
- procurement planning;
- automated customer messaging;
- public online purchasing;
- production deployment or real-data migration.

## Hosted validation contract after policy closure

The eventual exact-head Phase 3B gate must prove at least:

- Sales/BD can create and progress allowed enquiry/design/sample records;
- unauthorized roles cannot mutate protected business workflow records directly through ORM/API calls;
- sample approval remains attributable and separate from order/payment/shipment state;
- one authoritative native sale/order identity owns agreed commercial lines/totals;
- deposit records are attributable, posted and replay-safe without rewriting payment history;
- remaining balance is derived from authoritative commercial total/payments;
- shipment uses native Odoo stock lineage and exact-once effects;
- accepted final-payment and partial-shipment gates are server-enforced, not UI-only;
- mixed available-stock vs manufacture-to-order business cases do not conflate stock and production state;
- EN/AR/RTL representative business workflow UI and keyboard focus;
- all Phase 1–3A regressions remain green;
- repeatable upgrade succeeds for every installed Fares addon on the same exact application SHA.

## Exit criteria

Phase 3B can enter application implementation only after P3B-01 through P3B-04 are resolved or explicitly excluded from the first Phase 3B slice.

Phase 3B closes only when the accepted business-client workflow is source-linked, payment/shipment rules are server-enforced, role boundaries are proven, EN/AR/RTL passes, all prior regressions remain green, and the repeatable addon upgrade passes on the exact application SHA.
