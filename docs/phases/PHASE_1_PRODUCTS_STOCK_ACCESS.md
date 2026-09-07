# Phase 1 — Products, finished stock and access foundation

Status: PREPARED / EXECUTION BLOCKED BY PHASE 0B CLIENT VISUAL GATE, 2026-09-07.

Authorization state: the client authorized continued Phase 0B foundation work and confirmed the product/stock business rules needed by this phase. The repository workflow requires Phase 0B's explicit client visual decision before this production-grade implementation starts. This contract is therefore execution-ready but not yet active.

## Goal
Build the first durable Odoo operational foundation: product/design identity, configurable garment variants, permanent item identifiers, finished-stock custody at Retail Store/Storage, attributable stock movements, controlled opening-stock onboarding and server-enforced role boundaries.

This phase establishes trusted inventory identity and movement contracts that later POS/preorder/production features can build on without redesign.

## Starting evidence
- Phase 0 discovery complete for the accepted MVP boundary.
- Odoo Community 19 technical proof: implementation `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, hosted run `34068805602`, 15/15 passed.
- Foundation architecture: `docs/architecture/FOUNDATION_ARCHITECTURE.md`.
- Client-confirmed product/stock rules: `docs/requirements/PRODUCT_AND_STOCK_RULES.md`.
- Role/access design: `docs/requirements/ROLES_AND_PERMISSIONS.md`.
- UI foundation technical gate: implementation `670dd9999788ee01f6df6e000675054ef0153a6a`, hosted run `34070644678`, 12/12 browser tests passed; client visual acceptance remains open.

## In scope

### 1. Odoo addon foundation
Implement only the project-owned pieces that native Odoo does not already satisfy cleanly.

Preferred ownership:
- `fu_core`: stable item-code sequencing, common audit/security helpers and shared Fares configuration required by this slice;
- use native Odoo Inventory/product models for product templates, variants, locations, receipts/transfers and on-hand computation wherever they meet the contract.

Do not fork Odoo core. Do not create custom stock tables that duplicate Odoo Inventory.

### 2. Product/design master
Support:
- separate product templates for non-interchangeable school/client designs;
- product-family-specific attribute sets;
- size as a stock-bearing variant where applicable;
- color/other attributes only when that garment actually stocks them independently;
- bilingual-safe names/content without hardcoded school, garment, color or size enums.

The implementation must not provide a generic "same base polo for every school" shortcut that merges distinct client-design stock.

### 3. Permanent variant identifiers
For every stock-bearing variant:
- assign a unique system-managed sequential item code using `FU-000001` style;
- keep the identifier stable after normal creation;
- enforce uniqueness at the server/database-validatable layer;
- support manual code lookup and Odoo barcode lookup resolving the same variant;
- keep mutable business meaning out of the identifier.

Initial barcode payload may reuse the permanent item code if compatible with Odoo's tested barcode path. Printed barcode symbology/label dimensions remain a hardware-facing decision; no printer brand is selected here.

Any exceptional identifier correction must require owner/administrator authority and create an attributable audit record. Routine users cannot freely edit assigned codes.

### 4. Finished-stock locations and custody
Configure/test only:
- Retail Store;
- Storage.

Do not create a tracked factory-finished inventory location.

Production task `Finished` is not an inventory receipt. Later production integration must explicitly receive goods into Store or Storage before they become on-hand stock. `Ready for collection` remains a retail-store receipt concept.

### 5. Finished-stock movements
Use native Odoo stock mechanics for:
- receipt into Store/Storage;
- Store ↔ Storage transfer;
- opening-stock adjustment/count onboarding;
- approved stock-count correction.

Every privileged correction must be attributable. Where native Odoo reason/audit detail is insufficient for the accepted audit contract, add the smallest Fares-owned extension rather than replacing native moves/quants.

Retry/idempotency behavior must not produce duplicate transfer effects under the tested server workflow.

### 6. Roles and security
Map the accepted role design to Odoo security groups/record rules for this phase.

Minimum behavior:
- Owner/Administrator: product-master authority, stock correction approval, all locations;
- Store Manager: operational stock visibility for assigned store and allowed store workflows, but no role administration;
- Cashier: read/lookup products needed for checkout preparation; no product-master creation/edit, stock adjustment or transfer approval;
- Inventory Staff: receipts/transfers/counts and label lookup/printing capability within assigned locations; cannot alter prices/refunds/financial reports;
- Production Manager: product/variant read needed for production context; no retail stock correction authority;
- Sales/Business Development: product/catalog read as needed; no stock mutation.

Permissions must be enforced server-side/direct-API as well as in UI visibility.

### 7. Inventory onboarding mechanism
Provide a controlled path to establish opening finished stock:
- create/verify product templates and variants;
- assign stable codes/barcodes;
- count Store and Storage separately;
- record opening adjustment with actor/date/batch/reason context;
- surface invalid/duplicate identifiers and negative/impossible quantities before acceptance.

Use synthetic fixtures/tests only. No real business import is part of this phase.

## Explicitly outside this phase
- POS checkout implementation or replacement.
- Offline sales synchronization changes beyond keeping Phase 0A compatibility code intact.
- Preorder/payment/collection logic.
- Production task automation.
- Customer returns/exchanges.
- Business-client order tracking.
- Public API/site implementation beyond the existing disposable design prototype.
- Raw material/WIP stock.
- Accounting/general ledger/procurement.
- Real label printing/scanner validation.
- Production deployment, persistent production host, backup/DR or real data migration.

## Data invariants
1. One real non-interchangeable client/design identity maps to one product template, not a shared generic template by accident.
2. Each stock-bearing variant has exactly one permanent sequential Fares item code.
3. Item code uniqueness is server-enforced; display-name changes do not affect it.
4. Size/attribute values are data attached to relevant product families, not code enums.
5. Only Retail Store and Storage contribute to initial tracked finished on-hand quantities.
6. Production `Finished` state alone never increments tracked stock.
7. Stock movement history remains attributable; posted movement evidence is not silently deleted.
8. Unauthorized users cannot mutate product identity or stock through direct API calls.

## UI requirements
Internal implementation remains Odoo/Owl-native.

Once Phase 0B visual direction is accepted:
- apply shared Fares semantic design tokens/patterns to the product/stock views touched by this phase;
- support EN/AR/RTL;
- preserve keyboard operation and visible focus;
- do not add decorative motion to high-frequency inventory operations;
- do not build React versions of Odoo product/inventory screens merely for styling.

No UI styling work should start before the visual gate is resolved if doing so would lock an unapproved visual direction.

## Hosted validation plan
All verification is remote/hosted and must target the exact implementation head.

At minimum prove:

### Install/upgrade
- pinned Odoo Community source installs with the Phase 1 addon(s);
- addon upgrade is repeatable against a disposable database.

### Product identity
- School A and School B synthetic navy polos remain different templates and stock identities;
- one template can use letter-size variants while another synthetic garment uses numeric/age-style values, proving there is no hardcoded global size enum;
- variant codes allocate sequentially and uniquely;
- normal product rename does not change an assigned code;
- duplicate/manual collision attempts are rejected;
- barcode and manual-code lookup resolve the same variant.

### Stock/custody
- only Store and Storage are configured as initial Fares finished-stock locations;
- a synthetic receipt changes the intended location once;
- a Store↔Storage transfer changes source and destination correctly;
- repeated/retried server request cannot silently create a duplicate transfer effect under the implemented idempotency boundary;
- marking a synthetic production-style record Finished, if represented in the test fixture, does not create stock;
- opening count establishes per-variant/per-location quantities with attributable adjustment evidence.

### Security
For each relevant role, test direct model/API access rather than only hidden menus:
- forbidden product create/write denied;
- forbidden stock correction denied;
- location scope enforced;
- owner/inventory authorized paths succeed;
- attempted privilege/self-escalation remains outside granted access.

### Bilingual/UI
After the visual gate is accepted and styling is applied:
- representative product lookup/list and stock-transfer/count views render in English and Arabic RTL;
- no primary-action horizontal overflow at agreed narrow viewport;
- keyboard focus smoke check;
- screenshot evidence is reviewed separately from compile/test results.

## Documentation/evidence outputs
During implementation keep current:
- `docs/validation/PHASE_1_PRODUCTS_STOCK.md` with exact commits/runs/failures/limitations;
- `docs/DECISIONS.md` for any durable technical choices;
- `PROJECT.md` status/handoff;
- phase contract if evidence forces a scope correction.

## Exit criteria
Phase 1 is complete only when:
1. product/design/variant identities meet the confirmed rules;
2. permanent sequential identifiers are server-enforced and lookup-tested;
3. Store/Storage stock movements and opening-stock onboarding work with attributable evidence;
4. role/security tests deny unauthorized direct access;
5. exact-head hosted Odoo tests pass;
6. affected internal views meet the accepted bilingual visual direction with hosted render evidence;
7. no production deployment or real-data claim is made;
8. the next retail/POS/preorder phase can rely on these contracts without redefining product or stock identity.

## Execution gate
**BLOCKED until the client explicitly accepts or rejects/revises the Phase 0B representative visual direction.**

If accepted, activate this contract on a focused implementation branch without reopening already-confirmed product/stock questions. If rejected, revise the design system/prototype first; the underlying product/stock data rules remain valid unless the client changes them explicitly.
