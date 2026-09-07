# Product identity and finished-stock rules

Status: CLIENT-CONFIRMED FOUNDATION RULES, 2026-09-07.

Purpose: define the product identity, finished-stock and identifier rules required for the first production-grade implementation slice. These rules are now confirmed by the client unless a later explicit instruction supersedes them.

## Confirmed constraints

- Initial inventory covers **finished garments**, not raw materials or work-in-progress accounting.
- The business has one retail store and one storage location.
- School-uniform demand can become a preorder when store stock is unavailable.
- Production demand is aggregated separately per item size; the configurable quantity/deadline rule creates a production task rather than claiming work started.
- `Finished` means factory work is complete; `Ready for collection` means the finished garment has been received at the retail store.
- The business currently has no item codes/barcodes; the ERP introduces them.
- Scanner/printer support is capability-based rather than tied to a hardware brand.
- English/Arabic support is required.
- Numeric product volume is unknown and must not be invented.

## 1. Product identity model

### Product template / design boundary

One product template represents one garment design whose stock and production demand are allowed to mix.

**Client-confirmed rule:** school/client-specific garments are stocked as different products. A visually similar garment for two different schools/clients does not share finished stock when the branding/design is different.

Examples:
- School A navy polo and School B navy polo are separate product templates when their branding/design differs;
- the same approved garment sold in several sizes remains one template with size variants;
- color is a variant when the same design is genuinely offered/stocked in multiple colors;
- if two items must never share finished stock or production demand, they must not be collapsed merely because staff use the same informal base name.

Logo/client/school identity therefore normally belongs to the product-template/design boundary rather than becoming one global variant axis.

### Stock-bearing variants

Use variants only for attributes that produce separately selectable/stockable finished units.

- Size is stock-bearing whenever the garment has sizes.
- Color is stock-bearing when that product family is held in multiple colors.
- Other attributes such as sleeve style, fit or gender cut become variants only if the business actually treats those options as separately stocked units.
- Production aggregation uses the exact template plus every stock-bearing attribute that must not mix.

**Client-confirmed rule:** size systems differ by garment. Do not define one universal size enum. Size values and attribute sets are configurable per product family.

Synthetic tests may use letter, age or numeric sizes to prove configurability, but those examples must not be presented as a measured list of the factory's real products.

## 2. Stable identifiers and barcodes

Every stock-bearing variant requires:
- Odoo's immutable database identity;
- a unique human-readable internal item code (`default_code`/SKU);
- a unique scannable barcode value.

Names, prices, customers, school names and stock locations are not encoded as required semantics in the identifier.

### Internal code format

**Client-confirmed rule:** use simple permanent sequential variant codes:
- `FU-000001`
- `FU-000002`
- and so on.

The sequence is system-managed. Product name, design/client, color and size remain explicit fields rather than being parsed from the code.

The code must remain stable when display names, prices or locations change. Any exceptional administrative correction mechanism must be explicit and audited rather than ordinary free editing.

### Barcode baseline

Use a unique barcode value compatible with ordinary keyboard-emulating scanners. Code 128 remains the initial technical candidate because it can encode the accepted alphanumeric `FU-000001` style without a vendor-specific dependency.

The implementation phase may use the permanent item code itself as the initial barcode payload if this remains compatible with the tested Odoo/scanner path. Exact printed symbology, label dimensions and final bilingual label layout are not business blockers for the product/stock schema and remain hardware/UX validation work.

Labels will eventually show at least the readable item code plus enough product/variant text to identify a loose label.

## 3. Finished-stock location model

The only initial tracked physical finished-stock locations are:
1. **Retail Store**
2. **Storage**

**Client-confirmed rule:** knowing that finished pieces are physically still at the factory is not operationally useful, so do **not** introduce a `Factory Finished / Awaiting Transfer` inventory location.

Factory completion stays a workflow state:
- `Finished` records completion of factory work;
- finished pieces do not become tracked on-hand stock merely because the task was marked Finished;
- stock enters a tracked location when Store or Storage records physical receipt;
- `Ready for collection` still requires receipt at the Retail Store.

This keeps production state and inventory custody separate without inventing an unnecessary stock location.

## 4. Finished-stock movement rules

Finished-stock changes use attributable stock movements/corrections rather than silent edits to on-hand quantity.

Initial movement families:
- opening stock onboarding;
- receipt into Store or Storage;
- transfer Store ↔ Storage;
- POS/customer fulfillment deduction in the later retail phase;
- customer return/exchange movement once the return policy is defined;
- approved count correction with actor, reason and before/after evidence.

The first products/stock implementation phase establishes the product and movement foundation without implementing every later retail movement at once.

## 5. Demand and production linkage

Preorder/customer lines remain individually attributable even when production demand is aggregated.

- Aggregate by exact stock-bearing variant/design identity, never display-name text alone.
- Preserve originating preorder lines and promised pickup dates.
- One production task can cover several customer lines only when they share the exact aggregation key.
- Re-running a trigger must not duplicate demand already covered by an open/active task.
- Completing a production task does not mark customer items collected or balances paid.

Formal reservation/allocation of finished stock to customer orders is deferred to the preorder/retail phase. The product/stock schema must not prevent it later.

## 6. Opening-stock onboarding

Initial migration uses a controlled physical count rather than invented historical movements.

For each real finished garment:
1. establish/confirm the product template/design;
2. establish its stock-bearing variants using that garment's own size/attribute system;
3. assign permanent sequential item code/barcode identity;
4. count quantity separately at Store and Storage;
5. enter an opening-balance stock adjustment with actor/date/import-batch identity;
6. review exceptions before treating the opening count as operational truth.

Outstanding paper preorders are onboarded separately from opening free stock so promised customer quantities are not mistaken for uncommitted inventory.

No real migration data is authorized yet.

## 7. First-slice acceptance examples

The products/finished-stock implementation must prove at least:

1. School A and School B variants remain separate stock even if both are navy polos in the same size.
2. Different sizes of one design have separate stock and can use different configurable size systems on different garment families.
3. Sequential codes are unique, permanent and variant-level.
4. Changing display text does not change stable item identity.
5. Barcode/manual item-code lookup resolves the same variant.
6. Only Store and Storage are initial tracked finished-stock locations.
7. Marking production Finished does not itself create on-hand inventory.
8. Store and Storage quantities change only through attributable movements/corrections.
9. A transfer changes source/destination quantities exactly once under retry-safe server behavior.
10. Unauthorized users cannot create product identities or approve stock corrections through UI or direct API calls.
11. Opening stock can be reconciled per variant/location without pretending historical paper activity was digitally recorded.

## 8. Decisions intentionally deferred

These are not blockers for the first products/stock/access implementation slice:
- final printed label dimensions/layout;
- actual scanner/printer models and interfaces;
- return/exchange eligibility;
- offline preorder/collection/refund behavior;
- delayed/missing InstaPay confirmation policy;
- raw materials/WIP inventory;
- purchasing/accounting;
- production machine/worker scheduling;
- preorder reservation/allocation policy;
- final public/internal visual approval.

Affected later phases must resolve them before implementing those behaviors.
