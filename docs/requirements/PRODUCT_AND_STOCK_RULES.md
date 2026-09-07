# Product identity and finished-stock rules — Phase 0B proposal

Status: DEVELOPER PROPOSAL / CLIENT REVIEW REQUIRED, 2026-09-07.

Purpose: make the first production-grade implementation slice concrete without inventing the factory's informal product naming or physical handoff process. Confirmed facts remain owned by `DISCOVERY.md`; this document turns them into a proposed system convention and isolates the few business choices that require client input.

## Confirmed constraints this proposal must preserve

- Initial inventory covers **finished garments**, not raw materials or work-in-progress accounting.
- The business has one retail store and one storage location.
- School-uniform demand can become a preorder when store stock is unavailable.
- Production demand is aggregated separately per item size; the configurable quantity/deadline rule creates a production task rather than claiming work started.
- `Finished` means factory work is complete; `Ready for collection` means the finished garment has been received at the retail store.
- The business currently has no item codes/barcodes; the ERP must introduce them.
- Scanner/printer support must be capability-based rather than tied to a hardware brand.
- English/Arabic support is required.
- Numeric product volume is unknown and must not be invented.

## 1. Proposed product identity model

### Product template / design boundary

**Proposal P-001:** one product template represents one garment design whose stock and production demand are allowed to mix.

Examples of what this means:
- a navy polo for School A and a visually similar navy polo for School B should be separate templates **when their logo, embroidery, trim, fabric specification or other design detail means units cannot be substituted**;
- the same approved garment sold in several sizes remains one template with size variants;
- a color becomes a variant only when colors are genuinely interchangeable members of the same design family and are independently stocked;
- if two items must never share finished stock or production demand, they must not be collapsed merely because staff currently use the same informal name.

This matches the already-documented requirement that production batching never combines demand that should remain distinct. The exact real-world boundary for school/client-specific designs needs client confirmation.

### Stock-bearing variants

**Proposal P-002:** use variants only for attributes that produce separately selectable/stockable finished units.

- Size is stock-bearing whenever the garment has sizes.
- Color is stock-bearing when that product family is made/held in multiple colors.
- Other attributes such as sleeve style, fit or gender cut become variants only if the business actually treats those options as separately stocked units.
- Logo/client/school identity should normally belong to the template/design boundary when it makes units non-substitutable, rather than becoming a giant global variant axis.

No fixed list of size values is baked into code. Size sets remain configurable data by product family.

## 2. Proposed identifiers and labels

### Stable internal identity

**Proposal P-003:** every stock-bearing variant receives:
- an immutable database identity owned by Odoo;
- a unique human-readable internal item code (`default_code`/SKU);
- a unique barcode value.

Names, prices, customers, school names and stock locations must not be encoded as required semantics in the identifier. Those business values can change without forcing a new identity.

### Suggested first code format

**Proposal P-004:** start with a simple sequential internal code such as `FU-000001`, `FU-000002`, ... at the variant level.

Rationale:
- short enough to read/type;
- no mutable business meaning;
- works in English and Arabic contexts;
- does not assume the business already has a coding convention;
- scales without requiring a category/school/size parsing rule.

The display code is not itself the source of truth for size/design. Staff see those fields explicitly in the UI.

### Suggested barcode baseline

**Proposal P-005:** use a broadly supported one-dimensional internal barcode format suitable for keyboard-emulating scanners, with Code 128 as the starting candidate. Barcode symbology and label dimensions remain a review decision until actual printers/scanners are known and remotely verified.

Labels should eventually show at least the readable item code plus enough product/variant text for a person to identify a loose label. Exact Arabic/English arrangement, label size and additional fields are not locked here.

## 3. Proposed finished-stock location model

### Confirmed locations

Initial configured physical stock locations:
1. Retail Store.
2. Storage.

Transfers, receipts and count corrections must be attributable movements rather than silent quantity edits.

### Factory-finished staging decision

There is one unresolved physical fact: what happens after staff mark a production task `Finished` and before the garments are received by the store or storage location.

Two valid models are intentionally kept separate:

**Option A — workflow state only**
- `Finished` records factory completion on the production task.
- The finished units do not enter tracked ERP stock until Store or Storage records physical receipt.
- Best when factory completion and handoff are effectively one controlled process and there is no meaningful finished-goods custody/queue at the factory.

**Option B — tracked Factory Finished staging location**
- finishing production creates/permits receipt into `Factory Finished / Awaiting Transfer`.
- a later stock transfer moves units to Store or Storage.
- `Ready for collection` still requires Store receipt.
- Best when finished garments can physically remain at the factory and the owner needs to know that they exist before transfer.

**No option is accepted yet.** The current architecture can support either without changing the product model.

## 4. Stock movement rules proposed for the first implementation slice

**Proposal P-006:** represent finished-stock changes with explicit movement reasons rather than editing on-hand quantity directly.

Initial movement families:
- opening stock onboarding;
- receipt into a tracked location;
- transfer Store ↔ Storage (and Factory Finished if Option B is accepted);
- POS/customer fulfillment deduction;
- customer return/exchange movement once the return policy is defined;
- approved count correction with actor, reason and before/after evidence.

The first products/stock implementation phase does not need to implement every later movement family at once. It must establish a ledger-compatible movement model so later POS/returns do not require redesign.

## 5. Demand, reservation and production linkage

**Proposal P-007:** preorder/customer lines remain individually attributable even when production demand is aggregated.

- Aggregate production demand by the exact stock-bearing variant/design key, never display-name text alone.
- Preserve the originating preorder lines and promised pickup dates.
- One production task can cover demand from several customer lines when they share the exact aggregation key.
- Re-running the trigger must not duplicate demand already covered by an open/active task; Phase 0A already proved this bounded idempotency concept.
- Completing a production task does not by itself mark customer items collected or balances paid.

### Reservation policy

Whether completed stock is formally reserved to specific preorder lines before store receipt is still a business-policy choice. The first inventory schema must allow reservation/allocation later without mixing customer ownership with payment status.

## 6. Opening-stock onboarding proposal

**Proposal P-008:** initial migration should use a controlled count, not invented historical movements.

For each real finished garment being onboarded:
1. establish/confirm product template and stock-bearing variant;
2. assign its internal code/barcode;
3. count quantity separately at each tracked location;
4. enter an opening-balance stock adjustment with actor/date/import batch identity;
5. review exceptions before treating the opening count as operational truth.

Outstanding paper preorders should be onboarded separately from opening free stock so already-promised customer quantities are not mistaken for uncommitted inventory.

No actual migration file or count is authorized in Phase 0B.

## 7. Minimum first-slice acceptance examples

Once the client decisions below are resolved, the products/finished-stock implementation contract should include at least:

1. Two non-substitutable school/client designs remain separate even if both are navy polos in size M.
2. Size M and L of the same design have separate stock and separate demand aggregation.
3. Changing a display name does not change the variant's stable internal identity/barcode.
4. Store and Storage quantities change only through attributable movements/corrections.
5. A transfer changes source/destination quantities once, with retry-safe server behavior.
6. Unauthorized users cannot create product identities or approve stock corrections through either UI or direct API calls.
7. English/Arabic item lookup and barcode/manual code lookup resolve the same variant.
8. Opening stock can be reconciled per variant/location without pretending historical paper activity was digitally recorded.

## 8. Client decisions needed before the first production-grade slice

These are the only product/stock questions currently considered blocking enough to ask now:

### Q-PS1 — design identity
When the same basic garment is made for different schools/clients, should units with different logos/embroidery/design details **always remain separate stock**, or are there common cases where the base garment is stocked generically and branding/customization happens later?

Why it matters: this decides whether school/client identity normally defines the product template or whether some stock can remain generic until a later customization step.

### Q-PS2 — factory-finished custody
Can completed garments stay physically at the factory for a meaningful period before being sent to the retail store/storage, such that staff need to know "we have 25 finished pieces still at the factory"?

Why it matters: **yes** favors a tracked `Factory Finished / Awaiting Transfer` location (Option B); **no** favors task state only until Store/Storage receipt (Option A).

### Q-PS3 — real size systems
Which size styles do you actually use today? For example, adult letter sizes (`S/M/L/XL`), school/age sizes (`6Y/8Y/10Y/12Y`), numeric garment sizes (`38/40/42`), or combinations depending on product family.

Why it matters: values remain configurable either way, but real examples are needed to seed/test the first product families and avoid a fake universal size list.

### Q-PS4 — internal code preference
Unless the business wants a meaningful code convention, the developer proposes simple sequential codes such as `FU-000001` and keeps school/category/size visible as separate fields. Is that acceptable?

Why it matters: accepting this avoids building fragile business meaning into identifiers. It does not lock the printed label layout.

## Not decided here

This proposal does not decide:
- return/exchange eligibility;
- offline preorder/collection/refund behavior;
- delayed/missing InstaPay confirmation policy;
- raw materials or WIP inventory;
- purchasing/accounting;
- label printer/scanner brands;
- production machine/worker scheduling;
- final public/internal visual design.

Those remain in their existing Phase 0/Phase 0B boundaries.
