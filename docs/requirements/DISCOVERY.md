# Business discovery

Status: PHASE 0 COMPLETE, 2026-09-07. Rounds 1–9 preserve the discovery history; remaining targeted policies are explicitly deferred to the implementation phase they affect.

## Confirmed facts

| ID | Fact | Source |
| --- | --- | --- |
| B-001 | The business is the client's father's small clothing factory. | Client project brief, 2026-09-06 |
| B-002 | The requested product is an ERP tailored to this business. | Client project brief, 2026-09-06 |
| B-003 | The project is named Fares Uniform. | Client naming instruction, 2026-09-06 |

## Round 1 — client-confirmed, 2026-09-06

| ID | Confirmed current business fact |
| --- | --- |
| B-004 | Manufactures uniforms for schools, restaurants, cafes, hotels, hospitals and other sectors. |
| B-005 | Also manufactures men's and women's casual wear. |
| B-006 | Uses both manufacture-to-order and manufacture-for-stock models. Large-client workflow is described in W-002 below. |
| B-007 | Some business clients, for example restaurants, buy available stock. Do not assume every business order is custom manufacturing. |
| B-008 | Has one retail store serving individual customers and one storage location. |
| B-009 | School uniforms are manufactured for stock and sold through the retail store; preorders are taken when stock runs out. |

Source for B-004–B-009: client's discovery round 1 answers. Legal entity details and exact location identity remain unconfirmed and are deployment/onboarding concerns rather than Phase 0 blockers.

### Stated priorities

| ID | Client priority area | Result |
| --- | --- | --- |
| R-001 | Inventory and order tracking | Included in MVP; finished-stock boundary and Phase 1 product/stock rules now confirmed |
| R-002 | Point of sale | Included in MVP; payments, offline checkout and later refund/exchange policy separated by phase |
| R-003 | Marketing and exposure | Large-client acquisition highest within marketing; catalog second; online purchasing future |

## Round 2 — client-confirmed, 2026-09-06

- B-010: One retail store and one storage location.
- B-011: Current stock, sales and order records are on paper.

### W-001 — School-uniform preorder to production

1. When the requested school-uniform item is unavailable, staff write a paper receipt with items, sizes and details.
2. The customer pays the full price or sometimes a deposit.
3. The receipt specifies a pickup date.
4. A retained copy is sent to the factory.
5. The factory collects and sorts orders.
6. An item enters production when orders for it accumulate, or when the pickup date is close.

Later rounds clarify the digital target: size-specific demand, a configurable quantity trigger or configurable seven-day pickup lead-time trigger, automatic task creation, staff-recorded actual production start, factory Finished state, retail-store Ready for collection state, and full remaining-balance settlement before any partial collection.

Still deferred to the affected retail/production phases: customer/contact field details, reservation/allocation, cancellations, refund/exchange eligibility and some production exception semantics.

### Marketing/exposure priorities

Client-confirmed ranking within marketing/exposure:
1. Highest: attract large clients such as international schools and franchise restaurants that order shipments under contracts.
2. Second: customers browsing the product catalog.
3. Lower priority / future: other exposure outcomes including online purchasing and store discovery.

This ranking does not place marketing above inventory/order tracking or POS. The large-client current workflow uses a deposit after sample approval rather than mandatory full prepayment.

## Round 3 — client-confirmed, 2026-09-06

### R-004 — Initial inventory boundary
Track finished clothes initially. Raw materials, trims and work-in-progress inventory are outside initial inventory scope. Production status tracking remains in scope without implying material accounting.

### R-005 — Production automation and statuses
The client requests automatic triggering using a preset value users can tune. Initial tracked statuses: **In production**, **Finished**, **Ready for collection**.

Round 4 confirms counting pieces per item size separately, a configurable seven-day pickup lead time and automatic task creation rather than marking physical work started. The quantity threshold is configurable but has no accepted starting value yet.

### W-002 — Large-client order
Status: current practice client-confirmed at a high level.

1. Client contacts the business.
2. A meeting gathers design details.
3. The factory makes and sends samples.
4. If samples are approved, a deposit is collected.
5. Production starts with a delivery date.
6. Goods are shipped and the remaining payment is collected.

Final-payment timing, partial shipments and change/cancellation rules remain deferred to the business-order implementation phase.

## Round 4 — client-confirmed, 2026-09-06

### Production rule clarification
- Aggregate the piece threshold separately for each size of an item.
- Trigger even below the quantity threshold seven days before pickup; the lead time is configurable.
- Automatically create a production task; staff mark **In production** when work begins.
- **Finished** means completed at the factory.
- **Ready for collection** means received at the retail store.
- The quantity threshold is user-tunable; initial default still unselected.

### R-006 — Product identification
There are currently no item codes or barcodes; staff identify products manually. The client confirms product codes/barcodes are needed.

Round 9 resolves product/design identity, size-system variability and sequential item-code format. Barcode symbology, label layout and actual hardware remain technical/hardware validation decisions rather than Phase 0 blockers.

## Round 5 — client-confirmed, 2026-09-06

- R-007: Initially record cash and InstaPay payments. Card and wallet methods are future additions.
- R-008: Refunds and size exchanges are allowed. Partial preorder collection is allowed; detailed eligibility/settlement rules remain deferred.
- R-009: The client delegates conventional roles/access design to the developer. See `ROLES_AND_PERMISSIONS.md`.
- R-010: Hardware support must not hardcode scanner/printer brands. Specify capabilities/interfaces instead.
- R-011: Support English and Arabic for interface and receipts, including RTL.

## Round 6 — client-confirmed, 2026-09-06

### R-012 — Offline checkout is mandatory
Checkout must continue during internet outages; paper fallback is insufficient.

Architecture implications: durable device-side pending transactions, explicit sync state, retry-safe synchronization without duplicate sales/payments/stock effects and recoverable conflicts. Server records are authoritative after reconciliation.

### R-013 — Full payment before partial collection
A customer collecting any part of a preorder must settle the entire remaining order balance. Uncollected items remain owed independently from payment completion.

### R-014 — Public catalog and contact channels
Do not show prices or stock availability publicly. Use website enquiry form, WhatsApp and phone contact routes. This does not authorize automated outbound messaging or a paid WhatsApp integration.

## Round 7 — client-confirmed, 2026-09-06

- B-012: One checkout device per store; current business has one store.
- B-013: Internet outages last a few hours at most.
- W-003: Staff use bank mobile transaction notifications to confirm InstaPay manually. No bank API is selected.
- R-015: Customer readiness notifications are manual initially; automation is future work.

Delayed/missing bank notification handling and offline preorder/collection/refund behavior remain deferred to the retail/offline phase.

## Round 8 — client-confirmed, 2026-09-06

- B-014: The business is small; product/transaction counts are unavailable. Do not invent measured volumes.
- R-016: MVP reports include daily sales, cash/InstaPay totals, low stock, upcoming/overdue orders and customer balances.
- R-017: Decision-making analytics is future work, not core MVP; operational reporting remains MVP.
- C-001: No launch date/monthly services budget is fixed; decide before deployment.

## Round 9 — product/stock foundation confirmed, 2026-09-07

The client answered the four blocking Phase 0B product/stock questions:

- **R-018 — School/client design identity:** garments for different schools/clients are stocked as different products. Do not model a generic base garment that later receives branding as the normal stock identity.
- **R-019 — Factory-finished custody:** tracking how many finished pieces are still physically at the factory is not useful. Do not create a `Factory Finished / Awaiting Transfer` stock location. `Finished` stays a workflow state; on-hand stock begins when Store or Storage records receipt.
- **R-020 — Size systems:** different size systems are used depending on the garment. Size values/attribute sets therefore remain configurable per product family; no global hardcoded size enum.
- **R-021 — Item codes:** simple permanent sequential variant codes such as `FU-000001` are accepted. School/design/size/color remain separate fields rather than encoded into the SKU.

These are authoritative in `PRODUCT_AND_STOCK_RULES.md` and decisions D-028/D-029.

## Discovery consolidation

The first-release boundary in `MVP_SCOPE.md` is broadly accepted and all Phase 0 exit criteria are now satisfied. Phase 0 is closed under D-030.

Remaining policy questions are intentionally assigned to later phases rather than treated as unfinished generic discovery:
- production threshold default/configuration exceptions and reservation/allocation;
- offline scope beyond ordinary checkout and conflict/recovery policy;
- missing/delayed InstaPay confirmation handling;
- refund/exchange eligibility and returned-stock treatment;
- business-order final-payment/partial-shipment details;
- receipt/tax identity and exact report formulas;
- real hardware/label compatibility;
- deployment resources, budget, launch timing, backups and staff onboarding.

Do not repeat already answered questions unless the client changes a decision or implementation evidence exposes a concrete conflict.

## Requirement recording rule

For new targeted discovery, record: ID; client source/date; current process; desired outcome; actors; steps/exceptions; records; permissions; priority; acceptance examples; status. New targeted questions do not reopen Phase 0 unless they change the accepted first-release boundary.
