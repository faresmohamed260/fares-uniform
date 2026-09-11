# Phase 4B — operational reporting

Status: **ACTIVE / AUTHORIZED, 2026-09-12. CONTRACT DEFINED BEFORE IMPLEMENTATION.**

Branch: `phase-4b/operational-reporting`.

Starting Phase 4A documentation lineage: `93e371b663b4013604e78b3ec6d952d3c6eca6ab`.

Inherited Phase 4A application authority: `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Goal

Deliver the accepted owner operational reports without creating a second sales, payment, order or stock ledger. Phase 4B is an internal Odoo reporting slice built from live native/Fares operational records and keeps Phase 4A's anonymous/public boundary unchanged.

Accepted MVP report categories are:
- daily sales;
- Cash/InstaPay totals;
- low stock;
- upcoming orders;
- overdue orders;
- customer balances.

Advanced analytics, forecasting and BI remain later work.

## Reporting principles

1. Odoo/Fares operational records remain authoritative; report rows are derived views, not editable business facts.
2. Every metric names its source model, event date and inclusion/exclusion rule.
3. Deposits/receipts are not silently relabeled as sales.
4. Refunds/reversals remain visible and reduce net totals on their own event date.
5. Current-company scope is mandatory. Cross-company totals are not mixed.
6. Store Manager visibility is narrower than Owner/Admin and remains assigned-store scoped.
7. Server reports disclose that locally completed but not yet synchronized offline POS sales are absent until server reconciliation.
8. Phase 4B creates no persisted financial/reporting ledger and no public reporting endpoint.

## Exact metric definitions

### 1. Daily sales

**Meaning in Phase 4B:** net completed retail POS sales for one local calendar day.

Source:
- native `pos.order`;
- `state in ('paid', 'done')`;
- current company;
- selected authorized POS/store scope;
- event timestamp: `pos.order.date_order`.

Formula in company currency:
- gross sales = sum of positive completed POS `amount_total` values whose `date_order` falls inside the selected local day;
- refunds = absolute sum of negative completed POS `amount_total` values in the same local day;
- net sales = signed sum of those completed POS `amount_total` values.

Native Fares refund/exchange execution creates source-linked native negative POS orders, so the reversal is counted on the refund order's own `date_order`. The original sale is not rewritten.

**Deliberate boundary:** preorder and business-client deposits/order totals are not added to daily sales. Those workflows currently own authoritative order/payment/balance records but do not define an accepted accounting/revenue-recognition event. Counting order acceptance, deposit receipt, final payment, collection or shipment as “sale date” would invent a business/accounting policy explicitly left unresolved by earlier scope. Their money appears in Cash/InstaPay receipts and their unpaid amounts appear in customer balances. A later invoicing/accounting policy may expand the daily-sales definition without rewriting Phase 4B history.

This report is an operational sales report, not a tax/legal revenue statement.

### 2. Cash / InstaPay totals

**Meaning:** payment movement recorded on the selected day, separated into inflow, refund/outflow and net.

Retail POS source:
- `pos.payment` attached to completed `pos.order` records;
- event timestamp: `pos.payment.payment_date`;
- exclude `is_change=True` cash-change rows;
- Cash when `payment_method_id.is_cash_count`;
- InstaPay when `payment_method_id.fu_confirmation_mode == 'bank_notification'`;
- positive amount = inflow; negative amount = refund/outflow.

Preorder source:
- `account.payment` linked through `fu_preorder_id`;
- payment journal entry posted and payment not cancelled/rejected;
- event date: `account.payment.date`;
- Cash when `journal_id.type == 'cash'`;
- InstaPay when `journal_id.type == 'bank'` and `journal_id.fu_confirmation_mode == 'bank_notification'`.

Business-client source:
- `account.payment` linked through `fu_business_order_id` under the same posted/date/classification rules;
- Owner/Admin only; Store Managers do not gain B2B financial visibility from reporting.

Any otherwise-valid payment not matching Cash/InstaPay is not silently folded into either category. The report exposes an “other/unclassified payment” warning/count so configuration drift cannot make the requested totals look complete when they are not.

### 3. Low stock

Source truth:
- native Odoo `stock.quant`;
- warning quantity is **available quantity** (`quantity - reserved_quantity`), matching native stock reservation truth and the existing preorder allocation boundary;
- only Fares tracked finished-stock Store/Storage locations are eligible;
- Returns / Inspection and customer/vendor/transit locations are excluded.

Threshold ownership:
- Phase 4B introduces one small configuration record per company + tracked location + storable product variant;
- threshold unit is that product's native UoM;
- threshold must be non-negative;
- absent/inactive rule means no low-stock warning for that product/location;
- **no default numeric warning threshold is invented**;
- Owner/Admin manages warning rules; Store Manager may see warnings only for assigned store scope.

Formula:
- low stock when native available quantity is less than or equal to the configured threshold.

The production quantity trigger is a different business concept and must not be reused as a stock-warning threshold.

### 4. Upcoming orders

This is a live operational list, not a persisted snapshot.

Preorders:
- `sale.order.fu_is_preorder = True`;
- current company;
- not cancelled;
- not fully collected;
- deadline = `commitment_date` (promised pickup);
- upcoming when deadline is greater than or equal to the report `as_of` timestamp.

Business-client orders, Owner/Admin only:
- `sale.order.fu_business_order = True`;
- confirmed `state = 'sale'`;
- not yet completely shipped through the one allowed customer delivery;
- deadline = `commitment_date` (agreed delivery date);
- upcoming when deadline is greater than or equal to `as_of`.

No arbitrary “next 7/30 days” business threshold is invented. The UI sorts nearest deadline first and may accept an optional upper-date filter later; the base category means all open future deadlines.

### 5. Overdue orders

Uses the same source/open-order rules as Upcoming Orders.

Formula:
- overdue when an otherwise-open preorder/business order has `commitment_date < as_of`.

Completing collection/shipment removes the order from the live overdue list; it does not rewrite historical order dates.

### 6. Customer balances

Preorders:
- active Fares preorders in authorized store scope;
- balance is existing live `fu_balance_due`, derived from order total less valid posted preorder payments;
- rows with zero balance are excluded.

Business-client orders, Owner/Admin only:
- confirmed business orders with balance due, plus draft business orders only when valid business money has already been recorded;
- balance is existing live `fu_business_balance_due`;
- rows with zero balance are excluded.

Ordinary POS sales are fully settled in the accepted retail path and therefore do not create a customer-balance row.

B2B refund/credit behavior remains unimplemented and Phase 4B must not invent credits, forfeiture or negative balances.

Balances are displayed in the order currency. Do not add different currencies together into a misleading single total. If a company-currency equivalent is shown in a later view, it must be explicitly labeled and converted with native Odoo currency services at a documented date.

## Time and timezone semantics

- Phase 4B uses the current company's partner timezone as the operational report timezone when configured.
- If company timezone is not configured, reporting falls back explicitly to UTC and displays that fact; it does not silently vary totals by viewer/user timezone.
- `pos.order.date_order` and `pos.payment.payment_date` are Datetimes grouped by the selected local-day UTC bounds.
- `account.payment.date` is Odoo's business Date and is compared directly to the selected report date.
- upcoming/overdue lists are evaluated against a live `as_of = fields.Datetime.now()` timestamp.
- report output must expose the selected date, timezone and `as_of` value.

## Currency and units

- Monetary day totals are converted event-by-event to the current company's currency using native Odoo conversion at the event date.
- Source currencies remain visible in detail where applicable.
- Customer balances remain grouped/displayed by their source order currency.
- Stock quantities and warning thresholds use the product's native UoM; no garment-size quantity conversion is invented.

## Role and security boundary

### Owner / Administrator
May read all Phase 4B reports and manage low-stock warning rules for the current company.

### Store Manager
May read the operational dashboard only for assigned Fares Store locations. Scope includes:
- POS daily sales/payment movement for that store;
- preorder upcoming/overdue/balance rows for that store;
- low-stock warnings for that assigned store.

Store Manager does **not** gain:
- Storage visibility unless separately assigned and allowed by the existing location model;
- business-client/B2B balances or order details;
- role administration;
- raw accounting model access;
- report configuration mutation.

### Other roles
Cashier, Inventory Staff, Production Manager and Sales/Business Development do not gain Phase 4B report access in this slice. Existing workflow-specific access remains unchanged.

Authorization is enforced by the reporting service on the server. Hiding menus/buttons is not sufficient.

## Company/location scope

- All queries bind to `env.company`.
- Owner/Admin may select among current-company Fares tracked Store/Storage locations where the metric supports location filtering.
- Store Manager location scope is the intersection of current company, assigned `fu_stock_location_ids`, and allowed Fares Store locations.
- A crafted location ID outside scope must fail server-side.
- Phase 4B does not aggregate multiple companies into one currency total.

## Filters, grouping, pagination and export

Initial dashboard filters:
- report date for daily sales/payment movement;
- optional authorized location;
- live `as_of` for operational deadline/balance/stock lists.

Initial grouping:
- monetary summary by category (sales; Cash; InstaPay; other/unclassified warning);
- order lists by workflow type and deadline;
- customer balances by customer/order/currency;
- low stock by location/product variant.

Pagination:
- list-producing service methods accept bounded `limit`/`offset` and deterministic ordering;
- the initial operational UI may show a bounded first page with native drill-through rather than materializing an unbounded dataset.

Export:
- **not part of the initial Phase 4B bounded slice** because no accepted repository requirement currently requires CSV/XLSX/PDF export;
- the server DTO/service boundary must remain structured so export can be added later without scraping rendered HTML.

## Data lifecycle and performance

- Report numbers are live derived queries.
- The implementation may use Odoo `TransientModel` records only as ephemeral UI presentation state; those records are not report authority, audit history or a persisted snapshot.
- No reporting warehouse/Supabase mirror is introduced.
- Candidate queries must use indexed company/date/state/Fares flag fields before Python-side business-state filtering.
- Low-stock evaluation iterates configured warning rules, not every product × every location combination.
- Use native grouping/aggregation where it preserves the exact formulas above; avoid N+1 model reads in the final service.
- Unknown production volume means no speculative pre-aggregation/partitioning infrastructure.

## UI requirements

Internal reporting remains native Odoo/Owl under D-033:
- modern practical dashboard hierarchy, not cinematic 3D;
- EN and AR with true RTL;
- native cards, forms, lists and actions before custom generic widgets;
- keyboard-focusable refresh/drill-through controls;
- no horizontal document overflow at representative desktop/narrow widths;
- reduced-motion compatible;
- clear labels distinguishing sales from receipts and gross/refund/net payment movement;
- explicit offline-sync disclosure.

## Explicitly outside Phase 4B

- public/anonymous reporting endpoints;
- changing Phase 4A DTO/enquiry contracts;
- revenue-recognition/accounting policy for preorder/B2B order totals;
- tax/legal financial statements;
- B2B refunds/credits/deposit forfeiture;
- preorder cancellation/refund policy;
- cards/wallets or bank API integration;
- advanced analytics, forecasting, cohort/product profitability or BI warehouse;
- scheduled email/report delivery;
- report exports in the initial slice;
- production deployment, real-data migration or live resource mutation.

## Implementation plan

1. Add internal `fu_reporting` depending on existing operational addons, not on the public API.
2. Add low-stock warning-rule configuration with Owner/Admin mutation only.
3. Add a server reporting service that owns formulas/scope and returns allowlisted structured data.
4. Add an Odoo-native operational dashboard/presentation layer driven by that service.
5. Add direct formula/security/timezone/location regressions.
6. Add EN/AR/RTL browser evidence and accessibility/overflow checks.
7. Add an exact-head Phase 4B hosted workflow covering all inherited addons plus `fu_reporting` and preserving the Phase 4A public-web gate.
8. Prove repeatable seven-addon upgrade.
9. Inspect retained logs/screenshots/artifacts before promoting an application SHA.

## Exit criteria

Phase 4B is complete only when:
1. all six accepted report categories are present under the definitions above;
2. deposits appear in payment/balance reporting but not daily POS sales;
3. completed POS refunds reduce daily sales/payment net on their own event date;
4. low-stock warnings use native available quantity and configured thresholds with no invented default;
5. upcoming/overdue lists use the accepted pickup/delivery deadlines and exclude completed/cancelled work;
6. customer balances match existing live preorder/B2B payment logic;
7. Owner/Admin versus Store Manager scope is enforced server-side and other roles are denied;
8. current-company and location boundaries are regression-tested;
9. timezone/day-boundary behavior is tested;
10. offline-unsynced POS exclusion is truthfully disclosed;
11. EN/AR/RTL dashboard evidence passes keyboard/reduced-motion/overflow checks;
12. inherited Phase 1–4A tests remain green on the exact application SHA;
13. repeatable `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting` upgrade succeeds;
14. retained evidence is inspected rather than relying only on green status;
15. no merge, production deployment or real-data migration occurs without explicit authorization.
