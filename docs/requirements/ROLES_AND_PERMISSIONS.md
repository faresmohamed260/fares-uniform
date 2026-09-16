# Roles and permissions

Status: **Phase 1 server-side foundation implemented and hosted-verified on 2026-09-07. Later-phase workflow permissions remain intentionally deferred. Actual business user assignments are not configured.**

Use named individual accounts with role-based permissions. A person may hold more than one role; roles do not require separate employees. Apply location scope to operational access. Enforce permissions on the server for online actions and synchronization; hiding controls is not authorization. Mandatory offline checkout requires a bounded previously authorized device/session policy, with recorded actor identity and server revalidation at sync. Offline access expiry, revocation delays and conflict handling belong to the retail/offline phase; do not claim live server authorization during an outage.

| Role | Intended access | Phase 1 implemented foundation | Limits |
| --- | --- | --- | --- |
| Owner / Administrator | All business areas, reports, user/role assignments, prices, refunds and production settings | Native product/stock/user administration; Fares role and stock-location assignment; unrestricted Fares stock evidence | Administrative corrections remain recorded; no silent deletion of completed transactions |
| Store Manager | Store sales/orders, customer service, price/discount changes, refund/exchange approvals, receipt and collection management, store reports | Product read; assigned-location stock visibility; assigned-location movement-evidence read | Assigned store scope; later retail permissions are not granted early; cannot assign roles or change factory settings |
| Cashier | Create sales/preorders, record payments, print receipts, record collection, view necessary customer/order and stock details; request returns/exchanges | Product read; assigned-location stock visibility | No Phase 1 stock mutation; cannot edit product master, execute Fares stock service, self-assign roles/locations, approve refunds or override prices |
| Inventory Staff | Stock receipts/transfers/counts, item lookup and labels, store receipt/readiness confirmation within assigned locations | Product read; assigned-location stock visibility; controlled Fares receipt/transfer/opening-count service with actor/reason/idempotency evidence | Does not receive broad native Odoo stock-user mutation authority; source/destination must be assigned; discrepancy approval workflow remains later where applicable |
| Production Manager | Production queue, start/completion recording, quantities and pickup/delivery deadlines, production threshold/lead-time settings | Product/variant read only in Phase 1 | Production mutation arrives in its bounded phase; no retail refunds, payment edits, role management or unrelated customer financial/contact data |
| Sales / Business Development | Business enquiries, customer contacts, draft quotations/contracts, sample progress and business-order tracking; public catalog content | Product/catalog read only in Phase 1 | Cannot read the Fares stock movement ledger, alter stock, verify payments or receive later business permissions before that phase |

Owner administers product master data. Inventory Staff will be able to print/reprint existing item labels when label UI/hardware-independent output is implemented; Phase 1 does not hardcode a printer or label brand. Catalog content editing does not grant authority to change commercial prices or expose private contracts/customer details.

No separate accountant role or accounting module is committed now. Owner handles financial oversight initially; add narrower finance access when a concrete requirement warrants it.

## Phase 1 enforcement design

Fares roles are independent `res.groups`, so a person may hold multiple roles rather than being forced into an exclusive privilege level. Inventory Staff deliberately do **not** inherit Odoo's broad `stock.group_stock_user`. Instead, the Fares stock service validates role and assigned locations, records the business actor, and only then performs the approved native Odoo stock effect with elevated technical execution. This keeps Odoo quants/moves/pickings as stock truth without allowing staff to bypass reason/idempotency/location rules through direct ORM/API calls.

A user's `fu_stock_location_ids` stores the explicit Retail Store/Storage custody locations they may see or operate within. Staff can read their own assignment but cannot self-edit it. Owner/Admin may administer assignments.

Hosted exact-head validation at `6f55ea20dca7a6fde4641d9d9f11d991fd896597`, run `34097747757`, proves direct ORM denial for native stock creation by Inventory Staff, Cashier product-master mutation, Cashier stock-service execution, unassigned-location stock operations, unauthorized ledger access and attempted self-escalation/location reassignment. It also proves positive Owner/Admin administration, multi-role composition and assigned-location visibility. See `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

## Approval and audit design

Record actor, time, target, reason and before/after values for price changes, refunds, stock corrections, production configuration and role changes as those workflows are implemented. Manager approval must be attributable to the approving account. Never share an administrator account for routine checkout.

Preserve posted sales/payment history with explicit reversal/correction entries. Permissions do not determine commercial eligibility: refund windows, amounts, balance allocation and payment verification still require workflow rules.

## Later validation still required

Retail/offline validation must cover expired authorization, queued actions after role revocation, replayed transactions and attributable reconciliation without silently losing completed offline sales. Sensitive prices/financial/customer data must be excluded from unauthorized API responses, not merely hidden in the UI.

Detailed action identifiers, approval mechanics and user acceptance examples belong in the relevant implementation phase contract.
