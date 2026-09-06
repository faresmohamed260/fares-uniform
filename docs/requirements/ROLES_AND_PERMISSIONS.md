# Roles and permissions

Status: Initial developer-selected design under the client's delegation on 2026-09-06. Not implemented. Actual user assignments and location access remain unconfigured.

Use named individual accounts with role-based permissions. A person may hold more than one role; roles do not require separate employees. Apply location scope to operational access. Enforce permissions on the server for every action; hiding controls is not authorization.

| Role | Initial access | Limits |
| --- | --- | --- |
| Owner / Administrator | All business areas, reports, user/role assignments, prices, refunds and production settings | Administrative corrections remain recorded; no silent deletion of completed transactions |
| Store Manager | Store sales/orders, customer service, price/discount changes, refund/exchange approvals, receipt and collection management, store reports | Assigned store scope; cannot assign roles or change factory settings |
| Cashier | Create sales/preorders, record payments, print receipts, record collection, view necessary customer/order and stock details; request returns/exchanges | No independent refund approval, price override, stock adjustment or user administration |
| Inventory Staff | Stock receipts/transfers/counts, item lookup and labels, store receipt/readiness confirmation within assigned locations | Stock discrepancy adjustments need owner approval; no prices, refunds or financial reports |
| Production Manager | Production queue, start/completion recording, quantities and pickup/delivery deadlines, production threshold/lead-time settings | No retail refunds, payment edits, role management or unrelated customer financial/contact data |
| Sales / Business Development | Business enquiries, customer contacts, draft quotations/contracts, sample progress and business-order tracking; public catalog content | Commercial price exceptions/terms need owner approval; cannot record payment as verified, alter stock, or see unrelated retail records |

Owner administers product master data; Inventory Staff can print/reprint existing item labels. Catalog content editing does not grant authority to change commercial prices or expose private contracts/customer details.

No separate accountant role or accounting module is committed now. Owner handles financial oversight initially; add narrower finance access when a concrete requirement warrants it.

## Approval and audit design

Record actor, time, target, reason and before/after values for price changes, refunds, stock corrections, production configuration and role changes. Manager approval must be attributable to the approving account. Never share an administrator account for routine checkout.

Preserve posted sales/payment history with explicit reversal/correction entries. Permissions do not determine commercial eligibility: refund windows, amounts, balance allocation and payment verification still require workflow rules.

## Validation required before implementation is accepted

Verify direct API denial for forbidden actions, location boundaries, revoked roles, and attempted self-escalation. Verify that sensitive prices/financial/customer data is excluded from unauthorized responses, not merely hidden in the UI.

Detailed action identifiers, approval mechanics and user acceptance examples belong in the relevant implementation phase contract.
