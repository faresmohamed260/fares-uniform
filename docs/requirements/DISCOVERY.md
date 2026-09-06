# Business discovery

Status: In progress. Initial business model and priority areas are client-confirmed; detailed workflows and release scope remain open.

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
| B-006 | Uses both manufacture-to-order and manufacture-for-stock models. Details of manufacture-to-order are still open. |
| B-007 | Some business clients, for example restaurants, buy available stock. Do not assume every business order is custom manufacturing. |
| B-008 | Has one retail store serving individual customers and one storage location (count clarified in round 2). |
| B-009 | School uniforms are manufactured for stock and sold through the retail store; preorders are taken when stock runs out. |

Source for B-004–B-009: client's discovery round 1 answers. Legal entity details and location remain unconfirmed.

### Stated priorities

| ID | Client priority area | Discovery still needed |
| --- | --- | --- |
| R-001 | Inventory and order tracking | Stock scope, locations, movements, reservations, order stages and current problems |
| R-002 | Point of sale | Checkout, payments, receipts, returns, hardware, users and connectivity |
| R-003 | Marketing and exposure | Target audiences, acquisition goals, current channels and desired public-facing experience |

These are confirmed needs, not approved feature specifications or a committed release order. Marketing/exposure ranking is clarified below; a website implementation, CRM, campaigns and integrations are not yet selected. Online purchasing is lower-priority future work.

## Round 2 — client-confirmed, 2026-09-06

- B-010: One retail store and one storage location. Their relationship to the factory and whether factory work-in-progress needs separate location tracking remain open.
- B-011: Current stock, sales and order records are on paper.

### W-001 — School-uniform preorder to production

Status: current practice client-confirmed through production entry; completion/collection details remain open.
Source: client discovery round 2, 2026-09-06.

1. When the requested school-uniform item is unavailable, staff write a paper receipt with items, sizes and details.
2. The customer pays the full price or sometimes a deposit.
3. The receipt specifies a pickup date.
4. A retained copy is sent to the factory.
5. The factory collects and sorts orders.
6. An item enters production when orders for it accumulate, or when the pickup date is close.

No numeric batch threshold or deadline window has been specified. Do not turn current human judgement into automatic production dispatch by inference.

Open: receipt identifiers and customer/contact data; product/variant grouping; who sets pickup dates and starts production; quantities; stock reservations; partially available orders; production stages; allocation of completed units to receipts; transfer to store; readiness notification; balance collection; partial pickup; cancellations/returns.

Candidate system implications (developer analysis, not approved specifications): preserve individual customer orders and payment balances while aggregating outstanding item demand for production planning; retain promised pickup dates when batching demand. Acceptance criteria and automation level remain to be agreed.

### Marketing/exposure priorities

Client-confirmed ranking within marketing/exposure:
1. Highest: attract large clients such as international schools and franchise restaurants that order shipments under contracts and pay upfront.
2. Second: customers browsing the product catalog.
3. Lower priority / future work: other discussed exposure outcomes, including online purchasing and store discovery.

This ranking is within marketing/exposure; it does not rank marketing above inventory/order tracking or POS. Upfront payment describes the priority target client profile, not a universal rule for every business customer. Website features, inquiry handling, contract management and public pricing remain undecided.

## Round 3 — awaiting client answers

1. Should inventory initially cover finished garments only, or also fabric, trims/accessories and work in progress?
2. Who groups preorders and decides when production starts, and which production stages need tracking?
3. Walk through a typical large-client order from first contact to shipment: specifications/samples, quotation, contract, payment and delivery arrangements.

## Follow-up discovery agenda

Ask relevant questions progressively rather than sending this entire agenda as a questionnaire.

- Walk through a typical order: request, quotation, specifications, approvals, materials, production, delivery, invoicing and payment. These are prompts to verify, not assumed existing steps.
- Identify current tools, paper records and duplicate data entry.
- Identify workers/users, responsibilities, permissions and approval boundaries.
- Map products, sizes, colors, units, materials, stock movements and outsourced work if applicable.
- Understand partial deliveries, changes, returns, waste, rework and cancellations where applicable.
- Establish costing, purchases, receivables/payables, payroll and accounting needs without assuming all belong in the first release.
- Confirm locations, approximate transaction volume, seasonality and concurrent usage.
- Confirm language, currency, devices, printers/barcodes, connectivity and offline needs.
- Confirm reports and measurable outcomes needed by the owner and other roles.
- Establish data migration, integrations, budget, timeline, backup/recovery and operational ownership.

## Requirement recording format

For each discovered workflow record: ID; client source/date; current process; pain point; desired outcome; actors; steps and exceptions; records; permissions; priority; acceptance examples; status (open/proposed/client-confirmed).

No answers, priorities, metrics or deadlines have been inferred. Use synthetic examples in this public document.
