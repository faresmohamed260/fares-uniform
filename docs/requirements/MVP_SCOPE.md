# First-release proposal — Fares Uniform

Status: BROADLY ACCEPTED IN PRINCIPLE, 2026-09-06; platform/reuse and premium UI direction under evaluation. Not implementation or deployment authorization.
Sources: [Discovery](DISCOVERY.md), [decisions](../DECISIONS.md), [role design](ROLES_AND_PERMISSIONS.md).

## Intended outcome

Replace paper-based stock, checkout and order follow-up with a connected system for the factory, one retail store and one storage location, while presenting the business professionally to large prospective clients.

## Proposed MVP boundary

| Area | Included behavior | Basis |
| --- | --- | --- |
| Products and finished stock | Product/size/color identification, item codes/barcodes, stock by location, receipts/transfers/count corrections and low-stock visibility | Finished-stock and identification needs confirmed; exact variant/movement design proposed |
| Retail POS | Stock sales, preorders, cash/InstaPay records, receipts, refunds and size exchanges, partial collection after full balance settlement | Confirmed |
| Offline checkout | One active checkout per store, continued sales during outages, durable pending transactions and later reconciliation | Offline need/envelope confirmed; synchronization design pending |
| Orders and production | Pickup dates, size-specific demand aggregation, configurable quantity trigger or seven-day configurable deadline trigger; tasks followed by staff-recorded In production → Finished → Ready for collection | Confirmed; quantity default and exceptions pending |
| Business clients | Enquiry and design notes, sample approval tracking, agreed order details, deposit, delivery date, shipment and balance tracking | Existing workflow confirmed; these minimal digital records proposed |
| Public presence | Bilingual business presentation aimed at large clients; product catalog without price or stock; enquiry form, WhatsApp and phone contact | Audience/catalog/contact needs confirmed; page structure/content proposed |
| Owner reports | Daily sales, separate cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances | Confirmed in round 8 |
| Shared foundation | English/Arabic and RTL, roles/permissions, change history, hardware interfaces independent of brands | Requirements confirmed; role/audit design selected under delegation |

The MVP is delivered in increments; this table is a proposed release boundary, not a requirement to implement every area in one phase.

## Future / excluded from this MVP

Client-deferred: advanced decision analytics, online purchasing, card/wallet additions, automated customer notifications and lower-priority marketing expansion.

Outside the selected initial inventory boundary: raw materials and work-in-progress stock accounting.

Developer-proposed exclusions pending scope acceptance: payroll, full accounting/general ledger, procurement planning, detailed machine/worker scheduling, automatic bank integration, electronic contract signing and campaign automation. No prior client instruction requires these in MVP. A business-order record is not a full contract-management platform.

## Representative release acceptance scenarios

1. A staff member identifies a garment variant, records its location and receives/transfers stock with an attributable movement history.
2. A stock sale records items, receipt and payment; offline sales survive a restart and synchronize without duplicate payments or inventory deductions.
3. A preorder retains sizes, payment history and pickup date. Demand remains separate by size; a qualifying trigger creates one attributable task rather than claiming physical production started.
4. Staff record factory completion and store receipt separately. A partial pickup is permitted only after full remaining balance is settled, while uncollected quantities remain open.
5. A refund/exchange changes payment and stock records according to the agreed policy without erasing the original transaction.
6. A large-client order preserves approved sample reference, agreed items, deposit, delivery date, shipment and remaining balance.
7. Public visitors can browse English/Arabic content and contact the business without receiving price or stock data in public responses.
8. Owner reports agree with recorded transactions and distinguish sales, payment receipts and refunds. Central reports disclose pending/stale synchronization rather than claiming disconnected-device totals are current.
9. Each role can perform its assigned work and is denied unauthorized actions, including direct API attempts; Arabic layouts and agreed printer/scanner interfaces are tested.

These are proposed acceptance scenarios, not completed tests. Metrics and evidence belong in implementation phase contracts.

## Remaining decisions and when to resolve them

Before affected design/implementation:
- Product/variant attributes, size labels, school/client-specific designs and code/label format.
- Quantity trigger default, configuration scope, allocation/reservations and cancellation after task creation.
- Offline transaction scope beyond ordinary sales, enrollment/authentication expiry, stock/price conflicts, missing bank confirmation and recovery.
- Refund/exchange eligibility, payment method treatment, partial manufacturing/shipment behavior and business final-payment timing.
- Receipt/business identity, currency and applicable tax/receipt requirements, established from client facts and verified when relevant.
- Report definitions, stock-warning settings and treatment of deposits versus sales.
- Stock location relation to factory completion and readiness; opening stock and outstanding paper-order onboarding.

Before deployment:
- Client-selected launch date/budget; actual service/resource choices and costs.
- Operating device/browser/interface compatibility, staff assignments and training.
- Backup/restore, initial-data reconciliation, hosted acceptance evidence and deployment authorization.

Missing volume estimates are not a discovery blocker. Choose a documented synthetic test envelope during architecture and validate it; never call it measured factory capacity.

## Proposed delivery order

1. Evaluate reusable ERP platforms (starting with Odoo) and their hosting/UI tradeoffs, then define the immediate foundation contract: remaining architecture-critical rules, data model, offline design, design system and representative bilingual POS/order screens, hosted validation strategy.
2. Build products, finished-stock movements, access controls and inventory onboarding.
3. Build retail POS, preorders, payment/collection records and offline reconciliation together.
4. Add production automation and business-order tracking against verified stock/order contracts.
5. Add public catalog/enquiry experience and operational reports.
6. Perform integrated user acceptance, onboarding rehearsal and an explicitly authorized deployment.

This order follows dependencies; it does not change the ranking of marketing goals. Public content preparation can proceed alongside operational work once approved. Expand only the immediate next phase into a detailed execution contract.

## Current review request

Client answered 'yes mainly' and asked to investigate Odoo/reuse plus premium physics/morphing UI. See ../architecture/PLATFORM_EVALUATION.md. This is broad agreement, not unconditional approval of every proposed detail. Scope acceptance is followed by targeted decisions and an immediate phase contract; it does not imply Phase 0 exit criteria or deployment gates are already satisfied.
