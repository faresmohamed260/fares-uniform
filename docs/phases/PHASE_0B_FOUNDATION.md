# Phase 0B — Foundation architecture and UX direction

Status: IMPLEMENTATION FOUNDATION READY / CLIENT VISUAL REVIEW OPEN, 2026-09-07.
Authorization: client instructed "keep going" after Phase 0A and subsequently confirmed the product/stock rules blocking the first implementation slice. This does not authorize paid resources, production deployment or bypass the explicit visual checkpoint.

## Goal
Turn the Phase 0A conditional Odoo GO into an implementation-ready foundation without prematurely building the full ERP. Lock architecture/data boundaries and produce representative bilingual UI surfaces good enough for the client to judge the design direction before broad implementation.

## Verified evidence
- Phase 0 business discovery is now complete for the accepted MVP boundary.
- Phase 0A implementation commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9` passed 15/15 hosted tests in run `34068805602`.
- Odoo Community 19.0 is viable for the tested operational scope with the isolated offline-restore compatibility shim in `docs/validation/ODOO_PROOF.md`.
- The first Phase 0B UI baseline at `670dd9999788ee01f6df6e000675054ef0153a6a` technically passed 12/12 but was explicitly rejected by the client as too custom-built and too visually restrained; it is superseded for visual review.
- Revised prebuilt-first implementation `fa9ef2413177a54e566c5505e1e858696c8a9bfb` passed hosted run `34073833275`, job `101596052081`: typecheck, optimized production build and **15/15 browser tests passed**, producing a refreshed eight-screen EN/AR desktop/mobile set. The tests prove actual shadcn/Base UI primitive use, responsive POS interaction, accessible Dialog behavior, visible keyboard focus, a non-zero normal-motion physics transform and exact reduced-motion suppression.
- Product/design identity, per-garment size systems, permanent sequential item codes and the absence of a tracked factory-finished stock location are client-confirmed in `docs/requirements/PRODUCT_AND_STOCK_RULES.md`.
- No production host, real customer data, service purchase or deployment exists.

## Architecture decisions established
1. Odoo Community is the operational/domain core for products, finished stock, customers, operational orders, recorded payments and Fares-owned workflow addons.
2. Native POS mechanics remain the transaction runtime; extend through addons/Owl rather than replacing checkout with React.
3. Public business/catalog experience is a separate Vercel-targeted web application behind a narrow Fares-owned Odoo projection/enquiry API.
4. Operational truth is not mirrored into Supabase by default.
5. The Odoo offline compatibility patch remains isolated/version-pinned and is retired only after an upstream fix is adopted and revalidated.
6. GitHub remains source of truth; execution/verification stays remote/hosted.

## Product/stock foundation now locked
- School/client-specific designs that are not interchangeable are separate product templates.
- Size systems and attribute sets are configurable per garment/product family.
- Stock-bearing variants receive permanent sequential `FU-000001`-style codes.
- Initial tracked finished-stock locations are only Retail Store and Storage.
- `Finished` is production state; it does not create tracked on-hand inventory.
- `Ready for collection` requires Retail Store receipt.
- Opening stock is onboarded by controlled per-variant/per-location count rather than invented history.

See `docs/requirements/PRODUCT_AND_STOCK_RULES.md` for the complete contract.

## Representative UX foundation
The reusable design direction now enforces D-031:
- **prebuilt-first is mandatory** for generic UI; the public prototype uses official shadcn/Base UI generated with RTL support, while internal ERP/POS must prefer maintained Odoo/Owl primitives;
- semantic tokens cover typography, spacing, shape, surfaces, status, focus, motion and RTL;
- Motion is reserved for Fares-specific composition and conspicuous spring/morph/shared-layout behavior rather than reimplementing generic controls;
- representative POS, preorder/order, production and public catalog surfaces include visible physics/morphing examples;
- English/Arabic, desktop/narrow, normal-motion, reduced-motion and keyboard-focused behavior is hosted-tested.

The disposable prototype lives under `prototype/review-ui`. Detailed evidence is in `docs/validation/UI_FOUNDATION.md`. Client visual taste approval is still open.

## Explicitly outside this phase
- Production deployment or production Odoo hosting.
- Real customer/business records.
- Live InstaPay/bank integration, cards, wallets or automated payment verification.
- Full inventory/POS/preorder/production/business-client implementation.
- Raw-material/WIP accounting, payroll, procurement planning or general ledger.
- Real hardware integration.
- Automated customer messaging.
- Advanced analytics.
- Final migration/onboarding, backups, DR or staff training.

## Remaining policy unknowns — deferred to affected phases
These no longer block the products/stock/access contract:
- quantity-trigger default/configuration semantics beyond the already accepted configurable behavior;
- preorder stock reservation/allocation;
- offline support for preorder, collection, refunds and exchanges beyond ordinary checkout;
- missing/delayed InstaPay notification handling;
- refund/exchange eligibility and approval rules;
- business-order final-payment timing and partial shipment policy;
- legal/tax receipt identity requirements;
- final report formulas/settings;
- real printer/scanner compatibility and printed label dimensions.

They remain explicit and must be resolved before the phases that implement them.

## Validation / acceptance gates
This phase is complete only when:
1. Architecture ownership and persistence boundaries are documented without contradictory sources of truth. **PASS**
2. Representative data contracts can express the accepted MVP without hardcoding unknown business values. **PASS**
3. New code passes exact-head hosted build/tests. **PASS** for the representative UI and Phase 0A technical proof.
4. Representative POS/order/production/public UI renders exist in EN/AR desktop/narrow with reduced-motion and keyboard evidence. **PASS**
5. The client explicitly accepts or rejects the representative visual direction. **OPEN**
6. Remaining business-policy unknowns are separated into blocking vs later-phase decisions. **PASS**
7. PROJECT.md, DECISIONS.md and the documentation index accurately hand off the next implementation phase. **PASS**

**Only Gate 5 remains open.** Passing screenshots/tests do not infer client taste approval.

## Expected outputs
Completed:
- `docs/architecture/FOUNDATION_ARCHITECTURE.md`
- focused decisions in `docs/DECISIONS.md`
- `docs/ui/DESIGN_SYSTEM.md`
- `docs/ui/CONCEPT_BRIEF.md`
- `docs/validation/UI_FOUNDATION.md`
- `docs/requirements/PRODUCT_AND_STOCK_RULES.md`
- representative hosted UI source/evidence
- prepared Phase 1 contract in `docs/phases/PHASE_1_PRODUCTS_STOCK_ACCESS.md`

## Next dependency
The first production-grade phase is now contractually prepared. **Do not execute it until the client resolves the Phase 0B visual direction gate.**
