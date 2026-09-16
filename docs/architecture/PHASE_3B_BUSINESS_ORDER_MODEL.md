# Phase 3B architecture — business-client workflow ownership

Status: **ACTIVE ARCHITECTURE CONTRACT — POLICY-NEUTRAL ENQUIRY/SAMPLE SLICE ONLY.**

Branch: `phase-3b/business-client-orders`.

Pinned Odoo Community source: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Starting Phase 3B contract commit: `e1bcfdec0b2597971af8ba2f24daf459dfa8d89d`.

## Decision summary

Use native Odoo CRM + Sales + stock ownership instead of creating a parallel Fares business-order ledger.

The Phase 3B Fares layer owns only the business workflow metadata and authorization that native Odoo does not represent cleanly: design requirements, sample lifecycle, sample decision evidence, and guarded transitions into later commercial processing.

Until P3B-01 through P3B-04 are resolved, the implemented first slice must fail closed before any business-order confirmation, deposit/payment mutation, shipment validation or cancellation/refund behavior.

## Pinned Odoo findings

### `crm.lead` is the enquiry/contact owner

Pinned `addons/crm/models/crm_lead.py` already owns:
- opportunity/enquiry identity;
- assigned salesperson/team;
- company/contact identity and contact details;
- notes/description;
- pipeline stage and expected-close date;
- meetings/calendar linkage;
- partner creation/linking helpers and opportunity conversion.

Therefore Fares must not create a second enquiry/customer/contact table merely to track large-client follow-up.

### `sale_crm` is the native bridge from opportunity to quotation/order

Pinned `addons/sale_crm/models/sale_order.py` adds `sale.order.opportunity_id`.

Pinned `addons/sale_crm/models/crm_lead.py` already:
- exposes linked quotations/orders from the opportunity;
- provides quotation creation actions/context;
- propagates partner/company/source/team/salesperson context;
- distinguishes draft/sent quotations from confirmed sales orders.

Therefore one native `sale.order` remains the commercial order identity when the workflow later reaches an agreed order.

### `sale.order` owns commercial lines/totals and delivery promise

Pinned `addons/sale/models/sale_order.py` already owns:
- customer;
- quotation/sales-order state;
- customer reference;
- promised delivery date (`commitment_date`);
- order lines;
- pricelist/currency;
- totals;
- native payment/accounting relationships and payment-term concepts.

The native `prepayment_percent` field is not permission to invent a Fares deposit default. P3B-03 remains open.

### `sale_stock` owns physical shipment status

Pinned `addons/sale_stock/models/sale_order.py` owns:
- warehouse;
- sale-linked pickings;
- delivery status (`pending`, `started`, `partial`, `full`);
- effective delivery date;
- shipment scheduling based on the sale order commitment date.

Therefore Fares must never duplicate shipped quantity or shipment state as independent truth fields. If Phase 3B later permits shipment, native picking/move lineage remains authoritative.

## Selected Fares addon boundary

Introduce `fu_business` as an extension layer over native CRM/Sales concepts.

Initial dependency direction:
- `fu_core` for Fares roles;
- `sale_crm` for CRM + sale-order linkage.

Do not add broad stock/payment mutation merely by installing the addon. Stock/payment dependencies and guarded actions may be expanded only when the relevant Phase 3B policies are accepted.

## Policy-neutral first slice

The user instructed continued development while P3B-01 through P3B-04 remain unresolved. To avoid inventing commercial rules, the first application slice is strictly limited to pre-order business development work.

### Native owner

`crm.lead` remains the record identity.

Add Fares-specific fields only where needed, such as:
- business-client marker;
- design/meeting requirements;
- sample state;
- sample reference and notes;
- sample sent/decision actor and timestamp evidence.

### Sample lifecycle

The bounded lifecycle is:

`not_started -> preparing -> sent -> approved | revision | rejected`

`revision -> preparing`

Rules:
- transitions are explicit server actions;
- Sales/Business Development or Owner/Admin may perform the approved workflow;
- state/audit fields are not freely writable to bypass actions;
- sample approval/rejection records actor and time;
- approved and rejected are terminal inside this first slice; reopening requires a later explicit rule rather than silent mutation.

### Draft quotation boundary

After sample approval, a controlled action may create one native draft quotation linked through `opportunity_id`.

The draft quotation may contain the agreed candidate item/price details staff are preparing, but this first slice must not claim that a customer deposit, final agreement, stock release or shipment has occurred.

### Mandatory fail-closed guard

For Fares business-client quotations/orders created through this flow, server-side confirmation must be blocked while P3B-01 through P3B-04 remain unresolved.

The guard must apply to direct ORM/API calls, not only to a hidden/disabled UI button.

This intentionally prevents:
- `draft/sent -> sale` confirmation;
- creation of stock delivery consequences that confirmation would trigger;
- any Phase 3B deposit/balance routine;
- shipment validation through a Fares business action;
- cancellation/refund assumptions.

Ordinary non-business Odoo/Fares sale behavior must not be globally blocked by this Phase 3B guard.

## Authorization model

### Sales / Business Development

May:
- create/update assigned business enquiries;
- record design/meeting requirements;
- progress the sample workflow through controlled server actions;
- prepare a draft quotation after an approved sample;
- view the minimum linked quotation state needed for follow-up.

Does not gain by this addon alone:
- stock mutation;
- payment verification/posting;
- sale-order confirmation while policy gates remain open;
- refund/credit approval;
- product-master mutation;
- role administration.

### Owner / Administrator

May perform the same bounded workflow and see all Phase 3B business enquiries.

### Other roles

Cashier, Inventory Staff and Production Manager receive no Phase 3B enquiry/sample mutation merely from their existing role.

## Record scope

Sales/BD access should be limited to business-client leads assigned to that user unless a later explicit team-sharing rule is accepted. Owner/Admin remains unrestricted.

Do not broaden native CRM/Sales visibility to unrelated leads/orders by granting a broad built-in group where a narrower Fares ACL/rule is sufficient.

## UI direction

Use native Odoo operational patterns:
- a dedicated `Business Clients` workspace/action filtered to Fares business enquiries;
- familiar list/form/search composition;
- clear customer/contact, design, sample and linked-draft-quotation sections;
- workflow buttons using maintained Odoo controls;
- explicit banner/help text that commercial confirmation/payment/shipment remain policy-gated in this slice.

English, Arabic/RTL, keyboard focus, desktop and narrow hosted evidence remain required.

## Validation obligations for the first slice

Hosted exact-head validation must prove:
- Sales/BD can create an assigned business enquiry;
- unauthorized Fares roles cannot create/mutate protected business workflow records;
- direct write to protected sample state/audit fields is denied;
- valid sample transitions work and invalid transitions fail;
- approval/rejection is attributable;
- approved sample remains separate from order/payment/shipment state;
- draft quotation creation is unavailable before approval and native-linked after approval;
- business quotation `action_confirm()` fails closed server-side while policy gates remain open;
- no enquiry/sample/draft-quotation action creates payment or stock/picking effects;
- ordinary prior-phase behavior remains green;
- EN/AR/RTL UI, narrow layout and keyboard focus pass;
- repeatable upgrade succeeds for `fu_core,fu_retail,fu_preorder,fu_production,fu_business` on the same exact application SHA.

## Deferred authority

This architecture does not decide:
- remaining-balance due point;
- partial-shipment permission/payment coupling;
- deposit amount/default/minimum;
- editing/cancellation/deposit treatment after approval;
- B2B refunds/credits.

Those remain owned by `docs/requirements/PHASE_3B_POLICY_DECISIONS.md` and must be resolved before the commercial execution slice is enabled.
