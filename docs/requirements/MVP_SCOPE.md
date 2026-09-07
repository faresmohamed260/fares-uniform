# First-release proposal — Fares Uniform

Status: BROADLY ACCEPTED FIRST-RELEASE BOUNDARY; TARGETED POLICIES RESOLVED BY AFFECTED PHASE, updated 2026-09-07. Not production/deployment authorization.
Sources: [Discovery](DISCOVERY.md), [decisions](../DECISIONS.md), [role design](ROLES_AND_PERMISSIONS.md), [product/stock rules](PRODUCT_AND_STOCK_RULES.md).

## Intended outcome

Replace paper-based stock, checkout and order follow-up with a connected system for the factory, one retail store and one storage location, while presenting the business professionally to large prospective clients.

## MVP boundary

| Area | Included behavior | Current basis |
| --- | --- | --- |
| Products and finished stock | Product/design/size/color identification, permanent codes/barcodes, stock by location, receipts/transfers/count corrections and low-stock visibility | Confirmed; product/design/size/code/location rules locked in PRODUCT_AND_STOCK_RULES.md |
| Retail POS | Stock sales, preorders, cash/InstaPay records, receipts, refunds and size exchanges, partial collection after full balance settlement | Confirmed; detailed refund/offline policies resolve in retail phase |
| Offline checkout | One active checkout per store, continued sales during outages, durable pending transactions and later reconciliation | Required; ordinary fully paid sale proof passed, broader reconciliation implementation remains later |
| Orders and production | Pickup dates, size-specific demand aggregation, configurable quantity trigger or seven-day configurable deadline trigger; staff-recorded In production → Finished → Ready for collection | Confirmed; threshold defaults/exceptions resolve in production phase |
| Business clients | Enquiry/design notes, sample approval, agreed order details, deposit, delivery date, shipment and balance tracking | Current workflow confirmed; detailed final-payment/partial-shipment rules deferred |
| Public presence | Bilingual large-client-focused presentation; catalog without price/stock; enquiry form, WhatsApp and phone | Confirmed; representative technical UI gate passed, client visual approval remains open |
| Owner reports | Daily sales, cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances | Confirmed; exact formulas/filters deferred |
| Shared foundation | EN/AR + RTL, roles/permissions, change history, brand-independent hardware interfaces | Confirmed; role design delegated and documented |

The MVP is delivered incrementally; this table does not require every area in one implementation phase.

## Product/stock decisions resolved for Phase 1

Client-confirmed 2026-09-07:
- different school/client designs are different stocked products;
- size systems differ by garment and are configurable data;
- permanent sequential variant codes such as `FU-000001` are accepted;
- only Retail Store and Storage are initial tracked finished-stock locations; factory `Finished` is workflow state, not an inventory location.

## Future / excluded from MVP

Client-deferred: advanced decision analytics, online purchasing, card/wallet additions, automated customer notifications and lower-priority marketing expansion.

Outside initial inventory boundary: raw materials and work-in-progress stock accounting.

Not required by current scope: payroll, full accounting/general ledger, procurement planning, detailed machine/worker scheduling, automatic bank integration, electronic contract signing and campaign automation. Add any only after a concrete client requirement.

## Representative release acceptance scenarios

1. Staff identifies a garment variant, records its location and receives/transfers stock with attributable movement history.
2. A stock sale records items, receipt and payment; offline sales survive restart and synchronize without duplicate payments/inventory deductions.
3. A preorder retains sizes, payment history and pickup date. Demand remains separate by size; a qualifying trigger creates one task without falsely starting production.
4. Factory completion and store receipt remain separate. Partial pickup is permitted only after full remaining balance is settled, while uncollected quantities remain open.
5. A refund/exchange changes payment/stock records according to the agreed later policy without erasing the original transaction.
6. A large-client order preserves approved sample reference, agreed items, deposit, delivery date, shipment and remaining balance.
7. Public visitors browse English/Arabic content and contact the business without receiving price or stock data.
8. Owner reports agree with recorded transactions and disclose pending/stale synchronization where relevant.
9. Each role performs assigned work and is denied unauthorized actions including direct API attempts; Arabic and agreed hardware interfaces are validated.

Implementation evidence belongs to the bounded phase contracts.

## Remaining decisions and when to resolve them

Before affected later implementation:
- production threshold default/configuration scope, allocation/reservations and cancellation after task creation;
- offline transaction scope beyond ordinary sales, authorization expiry, stock/price conflicts, missing bank confirmation and recovery;
- refund/exchange eligibility/payment treatment;
- business partial manufacturing/shipment and final-payment timing;
- receipt/business identity, currency/tax requirements when legally relevant;
- report definitions, stock-warning settings and deposit-vs-sale treatment;
- actual printer/scanner compatibility and final printed label layout.

Before deployment:
- launch date/budget and actual service/resource choices;
- operating device/browser/interface compatibility, staff assignments and training;
- backup/restore, initial-data reconciliation, UAT and explicit deployment authorization.

Missing numeric volume estimates are not a blocker and must not be invented.

## Delivery order

1. Odoo reuse/platform proof and Phase 0B architecture/data/design foundation — technically complete except client visual decision.
2. Products, finished-stock movements, access controls and inventory onboarding — Phase 1 contract prepared.
3. Retail POS, preorders, payments/collection and offline reconciliation.
4. Production automation and business-order tracking.
5. Public catalog/enquiry and operational reports.
6. Integrated user acceptance, onboarding rehearsal and explicitly authorized deployment.

Expand only the immediate next phase into an execution contract.
