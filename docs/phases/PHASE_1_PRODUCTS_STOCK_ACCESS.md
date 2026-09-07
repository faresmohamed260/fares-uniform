# Phase 1 — Products, finished stock and access foundation

Status: **COMPLETE, 2026-09-07.**

Authorization state: Phase 0B is complete. The client confirmed the product/stock business rules and explicitly approved the modern/practical operational ERP visual direction on 2026-09-07. Phase 1 was implemented remotely within this contract. Paid resources, production deployment and real-data migration remain unauthorized.

## Goal
Build the first durable Odoo operational foundation: product/design identity, configurable garment variants, permanent item identifiers, finished-stock custody at Retail Store/Storage, attributable stock movements, controlled opening-stock onboarding and server-enforced role boundaries.

This phase establishes trusted inventory identity and movement contracts that later POS/preorder/production features can build on without redesign.

## Starting evidence
- Phase 0 discovery complete for the accepted MVP boundary.
- Odoo Community 19 technical proof: implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, hosted run `34068805602`, 15/15 passed.
- Foundation architecture: `docs/architecture/FOUNDATION_ARCHITECTURE.md`.
- Client-confirmed product/stock rules: `docs/requirements/PRODUCT_AND_STOCK_RULES.md`.
- Role/access design: `docs/requirements/ROLES_AND_PERMISSIONS.md`.
- Revised UI foundation technical gate: implementation `fa9ef2413177a54e566c5505e1e858696c8a9bfb`, hosted run `34073833275`, 15/15 browser tests passed. The client subsequently approved a modern/practical operational ERP paradigm (D-033); richer 3D/physics is reserved for suitable expressive surfaces rather than imposed on dense operational views.

## Delivered scope

### 1. Odoo addon foundation
`fu_core` owns only the Fares-specific sequencing, audit, security and controlled stock-service behavior required by this slice. Native Odoo product and Inventory models remain authoritative for product templates, variants, locations, quants, receipts and transfers. Odoo core was not forked and no parallel stock tables were created.

### 2. Product/design master
The implemented/tested contracts support:
- separate product templates for non-interchangeable school/client designs;
- product-family-specific attribute sets;
- size as a stock-bearing variant where applicable;
- color/other attributes only when independently stocked;
- bilingual-safe product data without hardcoded school, garment, color or size enums.

### 3. Permanent variant identifiers
Stock-bearing variants receive unique system-managed sequential `FU-000001`-style item codes with matching initial barcode payloads. Normal mutable product data does not alter the assigned identifier. Collision, lookup and authority rules are server-tested.

### 4. Finished-stock locations and custody
Only Retail Store and Storage are tracked as initial Fares finished-stock custody locations. No Factory Finished stock location is created. Production `Finished` state alone does not create tracked on-hand stock.

### 5. Finished-stock movements
Native Odoo mechanics back:
- receipt into Store/Storage;
- Store ↔ Storage transfer;
- opening-stock counts/adjustments;
- attributable movement evidence.

Fares-owned request/audit logic provides stable idempotency keys and retry protection around privileged stock effects.

### 6. Roles and security
The accepted Phase 1 role matrix is implemented with native Odoo groups, ACLs/record rules and Fares service authorization. Direct-model/API tests cover denied product/stock mutation, assigned-location scope, owner/inventory authorized paths and attempted self-escalation.

### 7. Inventory onboarding mechanism
The controlled opening-stock path uses native Odoo inventory effects while preserving actor, batch/reason and per-location/per-variant attribution. Tests use synthetic fixtures only; no real business import occurred.

### 8. Bilingual native internal UI
The phase provides native Odoo surfaces for:
- Product Lookup;
- On-hand Stock;
- Stock Operation;
- Movement History;
- user stock-location assignments.

English and Arabic/RTL browser tests run in real Chrome. The gate verifies loaded seeded product/code data, localized Fares labels/actions, keyboard focus, RTL state, narrow-view overflow and reduced-motion behavior, and captures hosted screenshots. No React/Owl-parallel dashboard was introduced.

## Explicitly outside this phase
- POS checkout implementation or replacement.
- Offline sales synchronization changes beyond preserving Phase 0A compatibility code.
- Preorder/payment/collection logic.
- Production task automation.
- Customer returns/exchanges.
- Business-client order tracking.
- Public API/site implementation beyond existing design/foundation work.
- Raw material/WIP stock.
- Accounting/general ledger/procurement.
- Real label printing/scanner validation.
- Production deployment, persistent production host, backup/DR or real data migration.

## Data invariants established
1. One real non-interchangeable client/design identity maps to one product template, not a shared generic template by accident.
2. Each stock-bearing variant has exactly one permanent sequential Fares item code.
3. Item code uniqueness is server-enforced; display-name changes do not affect it.
4. Size/attribute values are data attached to relevant product families, not code enums.
5. Only Retail Store and Storage contribute to initial tracked finished on-hand quantities.
6. Production `Finished` state alone never increments tracked stock.
7. Stock movement history remains attributable; posted movement evidence is not silently deleted.
8. Unauthorized users cannot mutate product identity or stock through direct API calls.

## UI implementation rules retained
Internal implementation remains Odoo/Owl-native and follows D-033:
- modern/practical operational ERP grammar;
- maintained native Odoo/Owl controls first;
- custom code only for Fares-specific workflow/composition needs;
- EN/AR/RTL support;
- keyboard operation and visible focus;
- reduced-motion support for non-essential spatial behavior;
- no React copies of Odoo product/inventory screens.

## Hosted validation result
Authoritative tested implementation: `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`.

GitHub Actions run `34110346764`, job `101704871502`, completed **SUCCESS** on the full Phase 1 gate:
- checkout of the exact Fares head and pinned Odoo Community 19;
- dependency installation including real RTL compilation support;
- `fu_core` install and complete Phase 1 test execution;
- real Chrome bilingual browser checks;
- repeatable `-u fu_core` addon upgrade;
- evidence summary and artifact upload.

Evidence artifact:
- name `phase1-product-stock-eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`;
- ID `10014163050`;
- SHA-256 `4e2e1a01b7516d0e7a1b93ef77d4ae48f430ff723098c04981033b96fda71fbc`.

Detailed history, including failed runs and the Arabic/RTL correction, is in `docs/validation/PHASE_1_PRODUCTS_STOCK.md`.

The subsequent closure/docs commit is not presented as the tested implementation head. Any later application-code change requires fresh exact-head hosted evidence.

## Exit review
All Phase 1 exit criteria are satisfied within the synthetic hosted-test boundary:
1. product/design/variant identities meet the confirmed rules — **PASS**;
2. permanent sequential identifiers are server-enforced and lookup-tested — **PASS**;
3. Store/Storage movements and opening-stock onboarding work with attributable evidence — **PASS**;
4. role/security tests deny unauthorized direct access — **PASS**;
5. exact-head hosted Odoo tests pass — **PASS**;
6. affected internal views meet the accepted bilingual direction with hosted render evidence — **PASS**;
7. no production deployment or real-data claim is made — **PASS**;
8. later retail/POS/preorder work can rely on these product/stock contracts without redefining identity — **PASS**.

## Execution state
**COMPLETE.** Phase 1 application work is closed at tested implementation `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`. The next implementation must begin from a new bounded phase contract; do not extend this phase with POS/preorder/payment/offline behavior.
