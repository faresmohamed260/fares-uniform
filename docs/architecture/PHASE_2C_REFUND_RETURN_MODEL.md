# Phase 2C — Pinned Odoo refund, return and exchange model

Status: **PINNED-SOURCE ANALYSIS COMPLETE; IMPLEMENTATION PENDING CLIENT POLICY.**

Pinned upstream authority: Odoo Community commit `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

This document owns the technical model boundary for Phase 2C. It does not decide Fares Uniform's eligibility, approval, settlement or returned-garment policy; those remain the P2C policy gates in `docs/phases/PHASE_2C_REFUNDS_EXCHANGES.md`.

## Sources inspected

Exact pinned source:
- `addons/point_of_sale/models/pos_order.py`
- `addons/point_of_sale/models/stock_picking.py`
- `addons/stock/wizard/stock_picking_return.py`
- `addons/sale_stock/wizard/stock_picking_return.py`

Current Odoo 19 user documentation was used only as behavioral guidance:
- https://www.odoo.com/documentation/19.0/applications/sales/point_of_sale/use.html#return-and-refund-products
- https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/repairs/repair_orders.html#return-order

Moving `19.0` documentation/source does not override the pinned code above.

## 1. Native POS refund identity

The native POS refund model is already source-linked rather than destructive.

`pos.order.line` exposes:
- `refunded_orderline_id`: the original POS line being refunded;
- `refund_orderline_ids`: refund lines linked back to that original line;
- `refunded_qty`: quantity already refunded through non-cancelled linked refund lines.

The refund line is a new negative-quantity line. Pinned `_prepare_refund_data` links it to the source line using `refunded_orderline_id`; the original sale line is not rewritten into a return.

The native quantity guard computes already-refunded quantity and rejects a refund that exceeds the outstanding source quantity. This is useful defense in depth, but Fares-owned policy/authorization must still be server-enforced before a refund is allowed.

`pos.order` derives refund relationships from these line links, including the original refunded order. Native order UUID/replay behavior remains available to Phase 2C, but a Fares-owned request/approval execution boundary still needs its own exact-once/idempotency test.

### Consequence

For ordinary retail POS refunds, **use an order-based native POS refund linked to the original paid line**. Do not implement the refund by editing the paid order, deleting payment history, creating arbitrary negative inventory adjustments, or creating a separate Fares financial ledger.

The native standalone-refund path exists in Odoo, but it lacks the source-line relationship required by the recommended Fares audit boundary. It should not be exposed by the Fares workflow unless P2C-01 explicitly authorizes a controlled exception.

## 2. Native POS stock consequence

Pinned `point_of_sale/models/stock_picking.py` separates stockable POS lines into positive and negative quantities.

For positive sale lines it creates an outgoing picking from the configured POS source to the customer destination.

For negative refund lines it:
1. resolves the original order through `refunded_orderline_id`;
2. handles a refund before physical delivery by cancelling or reducing the still-open outgoing picking rather than manufacturing a false customer return;
3. when the source delivery is already done, creates a return picking from the customer destination back to the configured return destination;
4. creates return moves whose `origin_returned_move_id` points to the matching done outgoing move;
5. completes the return picking through the normal POS stock-processing path.

### Consequence

For an already-delivered ordinary POS sale, the POS refund order itself owns the stock reversal. **Do not additionally invoke `stock.return.picking` for the same returned quantity**, because that would create a second physical return effect.

This distinction is critical:
- POS sale refund -> native negative POS line + POS-created return picking;
- non-POS/native delivery reversal -> `stock.return.picking` reverse-transfer flow where appropriate.

## 3. Generic stock reverse-transfer model

Pinned `stock.return.picking` only allows return of a completed (`done`) picking and creates a new reverse picking rather than rewriting the original one.

Its return move values:
- reverse source/destination custody;
- preserve the product/UoM and returned quantity;
- set `origin_returned_move_id` to the original stock move;
- retain relevant move-chain links;
- create/confirm/assign a new return picking whose `return_id` references the source picking.

The `sale_stock` override preserves `sale_line_id` on the return move and `sale_id` on the return picking.

### Consequence

This is the correct Odoo-native primitive for a later non-POS customer-delivery return, including applicable Sales Order/preorder delivery cases. It is not a reason to double-process POS refunds.

## 4. Native exchange mechanism versus Fares size exchange

Pinned `stock.return.picking` also contains `action_create_exchanges` / `_create_exchange`. That warehouse exchange mechanism creates the reverse leg and a replacement stock flow based on the returned lines. It is useful evidence that Odoo models an exchange as linked physical movements, not mutation of the original delivery.

However, the Fares requirement is specifically a **size exchange**, which usually means replacing one product variant with a different variant. The generic stock wizard's exchange flow is based on its return lines and must not be assumed to implement a different-variant retail price/settlement policy automatically.

For POS size exchange, the preferred Phase 2C design is therefore:
1. create a native source-linked negative refund line for the returned original variant;
2. create a positive normal POS sale line for the replacement variant;
3. keep both legs attributable to the same approved exchange operation;
4. let native POS stock processing create the return and outgoing stock effects separately;
5. settle the resulting net financial difference explicitly under P2C-03/P2C-04.

Pinned POS stock code already supports mixed positive and negative lines by processing them as separate outgoing and return pickings. Odoo 19's documented refund UI also retains a negative refund cart that can accept another product (documented for gift-card settlement), so the model direction is consistent with the native POS workflow. The exact different-variant exchange UI/server orchestration remains a Fares-owned Phase 2C implementation and must be hosted-tested.

## 5. Payment and accounting boundary

A refund is a new negative POS order/payment effect; the original positive payment must remain historical evidence.

Fares must not:
- rewrite or delete the original Cash/InstaPay payment;
- silently reduce the original transaction total;
- represent the refund only as a note or stock movement;
- invent a second accounting ledger outside Odoo.

The selected payment method and real-world money handoff are still business policy. In particular, native Odoo's ability to settle a negative order through a payment method does not decide whether a Fares InstaPay refund means an outbound transfer, Cash repayment, store credit, or another approved policy. P2C-03 must decide that.

If invoicing/credit notes are enabled for the transaction, native Odoo refund/credit-note linkage should be preserved. Phase 2C does not invent final Egyptian tax/legal treatment.

## 6. Returned-stock condition is the main stock-policy gate

A native POS refund for an already-delivered item creates/completes the return stock effect. That means the configured return destination can become available stock immediately.

Therefore Phase 2C must not execute the native stock-return leg until one of these accepted policies is true:
- the garment has already been physically inspected and approved as sellable before refund execution; or
- the return goes to a dedicated non-sellable/inspection location, and a later explicit accepted-stock movement returns it to sellable Retail Store stock.

If damaged/used items can still receive a financial refund, direct return into the normal sellable Retail Store location is unsafe because it can inflate available stock. P2C-05 must resolve this before implementation.

A dedicated `Returns / Inspection` internal location is a technically clean option if the business needs post-refund inspection. It is a developer proposal, not an accepted requirement.

## 7. What Odoo owns versus what Fares owns

### Odoo-native authority

Keep native Odoo authoritative for:
- original POS order/line/payment history;
- source-linked refund order/negative lines;
- cumulative native refunded quantity;
- POS-created stock return/outgoing pickings and moves;
- `origin_returned_move_id` / return-picking lineage;
- native sale/delivery links for non-POS reverse transfers;
- native accounting/credit-note relationships where configured.

### Fares-owned bounded policy/orchestration

Fares must add only the business controls not supplied by native Odoo:
- source-transaction requirement and allowed exceptions;
- eligibility window and garment-condition rule;
- Cashier request versus Store Manager/Owner approval;
- server-side store scope and anti-self-approval boundaries;
- reason/evidence and approver attribution;
- allowed Cash/InstaPay refund settlement semantics;
- size-exchange replacement variant and net price-difference orchestration;
- sellable versus inspection/non-sellable return destination policy;
- online/offline boundary;
- idempotency key/exact-once protection around the approved execution request;
- bilingual/RTL operational UI.

Do not create Fares-owned duplicate order, payment or stock ledgers.

## 8. Recommended service boundary after policy acceptance

The implementation should expose a narrow server-authorized operation rather than broad write access to `pos.order`, `pos.payment`, `stock.picking` or `stock.move`.

Conceptually:
1. load the authoritative source transaction and current refund state;
2. validate actor, store scope, manager approval and policy eligibility;
3. validate requested quantities against native outstanding refundable quantity;
4. validate physical-condition/disposition decision;
5. create the source-linked native POS refund leg;
6. for exchange, add the positive replacement variant leg and calculate the net difference;
7. record the permitted native payment/refund settlement evidence;
8. allow native POS stock processing to create exactly one appropriate return/outgoing effect;
9. persist bounded approval/audit metadata linked to the native records;
10. return the already-created result on replay of the same execution key.

No `sudo()` path may bypass business validation merely because the native records require elevated mutation after checks. Cashier direct native create/write/unlink remains denied.

## 9. Required technical tests

In addition to the policy scenarios in the phase contract, the implementation must prove:
- refund line links to the exact original POS line;
- original order and original payment remain unchanged;
- a second refund cannot exceed remaining refundable quantity;
- delivered-item refund creates exactly one return stock effect linked to the original move;
- refund-before-delivery does not fabricate a customer return and correctly cancels/reduces the open outbound effect;
- no duplicate `stock.return.picking` is created for an ordinary POS refund;
- different-variant size exchange returns the original variant and issues the replacement variant exactly once;
- mixed negative/positive exchange settles the exact accepted price difference;
- rejected/failed/replayed execution does not duplicate payment or stock effects;
- returned non-sellable stock cannot enter normal sellable availability under the accepted P2C-05 rule;
- Cashier cannot bypass approval through native model APIs;
- manager/store scope remains server-enforced;
- Phase 1, Phase 2A and Phase 2B regressions remain green.

## Technical conclusion

The pinned Odoo model is sufficient; Phase 2C does **not** need a custom refund ledger or custom stock-return engine.

The safest architecture is a thin Fares policy/approval/idempotency layer over native source-linked POS refund and stock movement records. The remaining blockers are the explicit business-policy gates P2C-01 through P2C-07, especially eligibility/condition, InstaPay/Cash refund settlement and returned-stock disposition.
