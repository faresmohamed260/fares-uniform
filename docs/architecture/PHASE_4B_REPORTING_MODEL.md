# Phase 4B architecture — operational reporting model

Status: **ACTIVE DESIGN / IMPLEMENTATION CONTRACT.**

Branch: `phase-4b/operational-reporting`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## 1. Ownership map

Phase 4B does not own a new operational ledger.

| Report fact | Authoritative source |
| --- | --- |
| completed retail sale/refund | native `pos.order` |
| retail Cash/InstaPay movement | native `pos.payment` + Fares payment-method confirmation metadata |
| preorder payment/balance | native `account.payment` linked by `fu_preorder_id` + existing preorder live-balance service |
| B2B payment/balance | native `account.payment` linked by `fu_business_order_id` + existing business live-balance service |
| preorder pickup deadline | `sale.order.commitment_date` on `fu_is_preorder` |
| B2B delivery deadline | `sale.order.commitment_date` on `fu_business_order` |
| preorder completion | native collection stock effects exposed by existing preorder computed state |
| B2B shipment completion | native customer `stock.picking` completion under the Phase 3B one-delivery rule |
| low-stock quantity | native `stock.quant` available quantity |
| low-stock threshold | new Fares reporting configuration only |

The new addon may persist warning configuration and ephemeral presentation records. It must not persist copies of sale/payment/order/stock totals as business truth.

## 2. New addon boundary

Introduce `fu_reporting` with dependencies:
- `fu_core`;
- `fu_retail`;
- `fu_preorder`;
- `fu_production`;
- `fu_business`.

It deliberately does **not** depend on `fu_public_api`. Reporting is private/internal and Phase 4A anonymous endpoints remain unchanged.

Expected internal components:
- `fu.reporting.stock.rule` — persistent low-stock warning configuration;
- `fu.reporting.service` — server-side formula/security/scope boundary;
- `fu.reporting.dashboard` and transient line models — optional ephemeral Odoo-native presentation state only.

## 3. Low-stock rule model

`fu.reporting.stock.rule` fields:
- `company_id` — required/current company;
- `location_id` — required Fares tracked Store/Storage internal location;
- `product_id` — required storable product variant;
- `minimum_available_qty` — required non-negative product-UoM quantity;
- `active` — standard enable/disable;
- attributable last-change actor/time fields if implemented.

Constraint:
- unique active/configuration identity per `(company_id, location_id, product_id)`.

Security:
- Owner/Admin creates/changes/deactivates rules;
- no other role gains direct configuration mutation;
- report service may use controlled `sudo()` only after authenticating the caller and independently applying company/location scope.

Quantity evaluation uses Odoo's native reservation-aware availability (`stock.quant._get_available_quantity(product, location, strict=False)` or an equivalent pinned-native query). A rule triggers when `available <= minimum`.

Returns / Inspection is not a Fares Store/Storage warning location and is excluded.

## 4. Reporting service boundary

The service is the authorization and formula boundary. UI code must not reproduce report formulas client-side.

Required behavior:
- validate role before any `sudo()` read;
- bind all queries to `env.company`;
- resolve selected location against caller-allowed Fares locations;
- compute one stable company reporting timezone;
- accept bounded `limit`/`offset` for list results;
- return plain allowlisted structures, not arbitrary recordsets or generic model-read bridges;
- include report metadata (`report_date`, `timezone`, `as_of`, company/currency identifiers by safe display value rather than operational IDs where not needed by UI);
- include the offline-sync disclosure.

The service is internal authenticated Odoo code, not an HTTP public API.

## 5. Daily POS-sales query

Candidate domain:
- `company_id = env.company`;
- `state in ('paid', 'done')`;
- `date_order >= local_day_start_utc`;
- `date_order < next_local_day_start_utc`;
- POS config belongs to the authorized Fares Store scope.

For each order, convert `amount_total` to company currency using native currency conversion at `date_order.date()` if needed.

Aggregate signed values:
- positive -> gross;
- negative -> refund magnitude;
- signed sum -> net.

Do not derive sales from `pos.payment` because payment movement and sale value are different facts. Do not derive daily sales from preorder/B2B deposits.

## 6. Payment-movement query

### POS payments
Candidate domain:
- current company;
- completed parent POS order;
- authorized POS/store scope;
- `is_change = False`;
- `payment_date` inside selected local-day bounds.

Classification is data-driven:
- Cash: `payment_method_id.is_cash_count`;
- InstaPay: `payment_method_id.fu_confirmation_mode == 'bank_notification'`;
- other: neither rule.

Signed `pos.payment.amount` is authoritative for movement: native refund settlement is negative.

### Preorder/B2B payments
Candidate domain:
- current company;
- `move_id.state = 'posted'`;
- `state not in ('canceled', 'rejected')`;
- payment `date = report_date`;
- linked through exactly the existing Fares preorder/business fields.

Classification:
- Cash journal: `journal.type == 'cash'`;
- InstaPay: `journal.type == 'bank'` plus `journal.fu_confirmation_mode == 'bank_notification'`;
- otherwise other/unclassified.

Store Manager receives only assigned-store preorder payments. B2B payment rows/totals are Owner/Admin-only.

## 7. Timezone conversion

Use `env.company.partner_id.tz` when configured; otherwise use `UTC` and expose that fallback.

A local report date is converted to half-open UTC boundaries `[start, next_start)` using a timezone-aware library supported by Odoo. Avoid `23:59:59` end bounds and DST assumptions.

`account.payment.date` is already a Date business field and is matched directly.

The dashboard's deadline state is live and compares `commitment_date` to `fields.Datetime.now()` rather than reusing the daily-sales date.

## 8. Order-deadline queries

### Preorder candidate set
- current company;
- `fu_is_preorder = True`;
- non-cancelled;
- `commitment_date != False`;
- authorized collection-store scope.

Existing computed collection state determines completion. Fully collected orders are removed from live upcoming/overdue lists.

### Business candidate set
Owner/Admin only:
- current company;
- `fu_business_order = True`;
- `state = 'sale'`;
- `commitment_date != False`.

A business order is complete when its controlled customer delivery is done. Phase 3B forbids partial/multi-delivery release, so report code must use native customer-picking state instead of introducing a new “shipped” flag.

Combined open candidates are sorted deterministically by deadline then stable record key before pagination.

## 9. Customer-balance queries

Reuse existing Fares live balance methods/fields rather than recomputing payment eligibility differently.

Preorder balance candidates:
- current company;
- active Fares preorder;
- authorized store;
- live balance > zero.

Business balance candidates, Owner/Admin only:
- confirmed active business order with live balance > zero; or
- draft business order with valid recorded business payment and balance > zero.

Return per-order/customer rows with source workflow, customer display name, order reference, deadline, amount due and currency display code. Do not sum different currencies into one unlabeled number.

## 10. Security implementation

Allowed reporting readers:
- `fu_core.group_fu_owner_admin`;
- `fu_core.group_fu_store_manager` under assigned-store scope.

Denied by default:
- Cashier;
- Inventory Staff;
- Production Manager;
- Sales/Business Development;
- users with no Fares reporting role.

Owner-only configuration uses model ACL plus explicit method guards. Reporting-service methods also reject unauthorized callers directly so RPC bypass cannot rely on menu visibility.

Store Manager B2B exclusion is enforced by service code, not by omitting a UI tab alone.

## 11. Presentation architecture

Prefer native Odoo form/list/card primitives under D-033.

A reliable initial implementation may use a `TransientModel` dashboard:
- opening/refreshing calls the reporting service;
- scalar cards and transient line rows are rebuilt from the returned live snapshot;
- transient rows carry no authority and expire normally;
- drill-through may open the already-authorized operational record/view rather than duplicating edit forms.

If a client action is used instead, it must consume the same service and cannot move formulas into JavaScript.

UI must present:
- Daily sales: gross / refunds / net;
- Cash: inflow / refunds-outflow / net;
- InstaPay: inflow / refunds-outflow / net;
- an explicit other/unclassified indicator when nonzero;
- low-stock rows;
- upcoming and overdue rows;
- customer-balance rows;
- report date, timezone/as-of and offline-sync disclosure.

## 12. Offline truth disclosure

Phase 2A deliberately allows a paid ordinary sale to exist only in browser IndexedDB during an outage. The server has no authoritative count of those local records until synchronization.

Therefore Phase 4B must not fabricate a pending-offline amount/count. It must state that server totals exclude not-yet-synchronized local POS sales and become authoritative after reconciliation. Once synchronized, native `pos.order`/`pos.payment` records enter reporting normally.

## 13. Performance/index notes

Existing native/Fares indexes already cover core identities and several dates/flags. New warning rules should index company/location/product and enforce uniqueness.

The implementation should:
- restrict candidate domains by company/date/state/flag before Python filtering;
- prefetch related payment methods/journals/configs;
- avoid searching one query per report row;
- evaluate only configured low-stock rules;
- cap list page size server-side;
- avoid introducing materialized snapshots until measured production volume proves a need.

Unknown volumes are not justification for speculative warehouse/ETL infrastructure.

## 14. Phase 4A isolation

`fu_public_api` and `apps/public-web` remain unchanged unless an inherited regression is exposed. No reporting value is added to the five-field public catalog DTO or anonymous enquiry response. Public visitors receive no sales, payment, stock, balance, customer or deadline data.
