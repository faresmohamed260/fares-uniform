# Phase 3B — Business-client enquiry, sample, order, shipment and balance tracking

Status: **COMPLETE — ACCEPTED COMMERCIAL POLICY IMPLEMENTED AND HOSTED-VERIFIED.**

Branch: `phase-3b/business-client-orders`.

Starting lineage: Phase 3A closure head `f7ceb2690ad87efa186e553e081d2ff1721660d0`.

Authoritative Phase 3B application/test SHA: **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`**.

Workflow `Phase 3B business clients`, run `34634425338`, job `103378750321`: **118 tests, 0 failures, 0 errors**, successful repeatable five-addon upgrade, and retained EN/AR/RTL evidence.

No merge, deployment or real-data migration is authorized by Phase 3B closure.

## Phase goal

Replace paper/manual large-client follow-up with an attributable Odoo-owned workflow covering:

1. business enquiry and customer/contact context;
2. meeting/design requirements;
3. sample preparation, sent, revision, approval and rejection;
4. one authoritative native commercial order after sample approval;
5. candidate/agreed item variants, quantities, prices, customer reference and delivery date;
6. negotiated deposit and later balance payments;
7. commercial confirmation only after a positive posted deposit;
8. balance state derived from authoritative posted payments;
9. one complete customer shipment only after full settlement and full physical availability;
10. actor/time attribution and bounded role permissions;
11. English/Arabic/RTL operational UI;
12. compatibility with all completed Phase 1–3A behavior and repeatable upgrades.

## Confirmed business rules

The accepted policy ledger is `docs/requirements/PHASE_3B_POLICY_DECISIONS.md`.

### P3B-01 — Remaining balance

**Accepted:** the entire remaining balance must be fully paid before goods leave Fares custody.

The implementation derives this from live authoritative posted business payments. A deposit alone never authorizes shipment unless it happens to settle the full order.

### P3B-02 — Partial shipment

**Accepted:** partial customer shipment/backorder release is not allowed in the MVP.

The controlled business shipment action requires the whole customer delivery to be released together. This does not prohibit unrelated ordinary Odoo deliveries or internal transfers.

### P3B-03 — Deposit

**Accepted:** the deposit is a freely negotiated positive amount per business order. There is no hardcoded/default/minimum percentage or amount beyond being greater than zero and not exceeding the order total.

Payment recording is retry-safe, overpayment fails closed, and configured InstaPay journals require positive staff confirmation that the bank notification was observed.

### P3B-04 — Post-payment change/cancellation

**Accepted:** before payment, assigned Sales/BD may revise the draft through the guarded editor. After any posted business payment, commercial changes require Owner/Admin approval and actor/time attribution while the order remains draft. After confirmation, the Fares workflow does not permit commercial-line mutation.

An unpaid draft may be cancelled. Once money has been recorded, cancellation is blocked rather than inventing deposit forfeiture, refund or credit treatment. B2B refund/credit policy remains later work.

## Domain ownership

Pinned-Odoo assessment remains authoritative in `docs/architecture/PHASE_3B_BUSINESS_ORDER_MODEL.md`.

Native ownership:
- `crm.lead` — enquiry/company/contact/meeting/design context;
- `res.partner` — customer identity;
- `sale.order` / `sale.order.line` — commercial draft/order identity and amounts;
- `account.payment` and native accounting records — payment truth;
- `stock.picking` / `stock.move` — physical customer delivery truth.

Fares code adds only the missing workflow metadata, guarded transitions, audit fields and authorization. It does not create a parallel order, payment, delivered-quantity or stock-custody ledger.

## Delivered workflow

### Enquiry and sample

- dedicated Fares business-client workspace on native CRM;
- assigned Sales/BD scope plus Owner/Admin authority;
- design and meeting/enquiry details;
- sample states `not_started`, `preparing`, `sent`, `revision`, `approved`, `rejected`;
- controlled sample transitions and actor/time audit;
- bounded enquiry phone/email handling without silently granting broad linked `res.partner` mutation;
- no commercial side effect merely from sample approval.

### Commercial draft/order

- one native draft quotation/order linked through `sale.order.opportunity_id` after approved sample;
- retry-safe creation and protection against relinking an ordinary quotation into the business path;
- guarded transient editor for product, quantity, unit price, customer reference and promised delivery date;
- Sales/BD does not receive broad native sale-order/sale-line write ACLs;
- repeated draft saves replace candidate lines rather than duplicating them;
- positive posted deposit required before controlled business confirmation;
- confirmation actor/time attribution;
- ordinary non-business sale confirmation remains unaffected.

### Payment

- bounded Cash and positively confirmed InstaPay business-payment recording for authorized payment roles;
- native posted payment/accounting records remain financial truth;
- stable business payment reference supports retry-safe replay;
- overpayment and zero/negative payments fail closed;
- live paid amount and balance are derived from authoritative business payments;
- posted business payments cannot be silently rewritten/cancelled through the Fares path.

### Shipment

- native customer picking/moves remain shipment truth;
- controlled `Release Complete Shipment` action is restricted to accepted stock roles/Owner and assigned location scope;
- outstanding balance blocks release;
- partial/multi-delivery release blocks;
- all ordered quantities must be physically available in the single customer delivery;
- direct native validation cannot bypass the protected Fares business-delivery path;
- release actor/time is attributable;
- Sales/BD cannot release physical stock.

## Role boundary

### Sales / Business Development

May:
- create/update assigned business enquiries;
- record design/meeting notes;
- progress samples through controlled actions;
- prepare the native-linked commercial draft after sample approval;
- edit candidate commercial terms before payment;
- confirm the business order after a valid posted deposit exists.

Must not gain by role alone:
- broad contact administration;
- broad native sale-order/sale-line mutation outside guarded actions;
- payment posting/verification;
- stock mutation/shipment validation;
- post-payment commercial changes;
- posted-payment rewrite/cancellation;
- refund/credit approval;
- product-master or user/role administration.

### Cashier / Store Manager

May record bounded Cash or positively confirmed InstaPay business payments. This does not grant authority to rewrite commercial terms or accounting generally.

### Inventory Staff / Store Manager

May execute the controlled complete customer shipment only when full-balance, whole-delivery and assigned-location checks pass.

### Owner / Administrator

Retains broad Fares authority and is the approving role for post-payment draft commercial changes in this MVP. Owner rules on shared native models remain non-restrictive so adding the Owner group never removes authority already held through another role.

## Connectivity boundary

The business-client workflow is online-only. No Phase 3B offline mutation requirement was accepted. This does not alter Phase 2A mandatory offline ordinary POS checkout.

## Bilingual/UI boundary

The operational interface uses maintained native Odoo components and the approved modern practical ERP direction. EN/AR/RTL, keyboard focus, desktop and narrow rendering are covered by hosted browser tests. Final evidence includes enquiry, draft-editor, payment and delivery surfaces.

## Validation and exit evidence

Exact evidence is owned by `docs/validation/PHASE_3B_BUSINESS_CLIENT_ORDERS.md`.

Final application/test authority: **`d6efa76a99c0732423b354d2d9f787f6ccbdebec`**.

Hosted proof:
- workflow `Phase 3B business clients`;
- run `34634425338`;
- job `103378750321`;
- **118 tests, 0 failures, 0 errors**;
- successful repeatable upgrade of `fu_core,fu_retail,fu_preorder,fu_production,fu_business`;
- artifact ID `10277960160`;
- artifact name `phase3b-business-d6efa76a99c0732423b354d2d9f787f6ccbdebec`;
- digest `sha256:109ce8fd952f8389caafaf727a75dd3a7b0aed033d1fd5cccb5c661f862281da`.

The final red-to-green fixture correction is intentionally documented: `fu.stock.movement.request` operation `opening` sets an absolute inventory count. The final shipment test therefore seeds count `3`, not `1 + 2`, before proving a three-unit order may be released. No application shipment guard was weakened.

## Explicit exclusions after closure

Phase 3B does not define or authorize:
- B2B refund, credit-note, deposit-forfeiture or deposit-refund policy;
- post-confirmation commercial amendment workflow;
- partial customer shipments/backorders;
- customer credit limits, credit scoring, due-date credit terms or pay-after-delivery;
- automated legal/electronic signatures;
- legal/tax finalization beyond the selected Odoo mechanics;
- automated bank integration;
- cards/wallets;
- raw-material/WIP inventory;
- procurement planning;
- automated customer messaging;
- public online purchasing;
- production deployment or real-data migration.

These remain later bounded work.

## Closure rule

Phase 3B is complete for the accepted MVP business-client scope. Later documentation-only commits do not supersede application authority `d6efa76a...`. Any future change to payment, cancellation, amendment or partial-shipment policy requires a new explicit decision and an equal-or-stronger exact-head hosted gate.