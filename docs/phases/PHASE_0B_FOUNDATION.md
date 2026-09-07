# Phase 0B — Foundation architecture and UX direction

Status: HOSTED TECHNICAL UI GATES PASS / CLIENT VISUAL REVIEW OPEN, 2026-09-07.
Authorization: client instructed "keep going" after receiving the completed Phase 0A technical-proof report. This authorizes continuation under the already accepted MVP direction; it does not silently approve unresolved business rules, production deployment or spending.

## Goal
Turn the Phase 0A conditional Odoo GO into an implementation-ready foundation without prematurely building the full ERP. Lock the architecture boundaries that are already evidence-backed, resolve only architecture-critical rules, and produce representative bilingual UI surfaces good enough for the client to judge the final design direction before broad implementation.

## Verified starting evidence
- Phase 0 discovery is still open; MVP scope is broadly accepted in principle.
- Phase 0A implementation commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9` passed 15/15 hosted tests in run `34068805602`.
- Odoo Community 19.0 is viable for the tested operational scope with the isolated offline-restore compatibility shim documented in `docs/validation/ODOO_PROOF.md`.
- English/Arabic, RTL, narrow layouts and reduced-motion compatibility were proven at smoke-test level, but the proof UI is not client-approved premium design.
- No production application, host, customer data, service purchase or deployment exists.

## Architecture direction to formalize
1. Odoo Community is the operational/domain core for products, finished stock, customers, operational orders, recorded payments and Fares-owned workflow addons.
2. Keep native POS mechanics where they provide value. Extend through addons/Owl and design tokens rather than replacing checkout with a parallel React implementation.
3. Build the public business/catalog experience as a separate Vercel-targeted web application. Public integration exposes only explicitly publishable data and restricted enquiry writes.
4. Do not create a Supabase mirror of operational stock, balances or orders by default. A separate service needs a concrete reason and an explicit contract.
5. Keep the Odoo offline compatibility patch isolated, version-pinned and removable when an upstream fix is adopted and revalidated.
6. GitHub remains the source of truth; all builds, tests and render evidence are remote/hosted.

These are implementation directions for this phase. Final platform adoption remains conditional on the client visual checkpoint and the documented Phase 0A limitations.

## In scope
### Architecture and data contracts
- Write the foundation architecture document and ADRs for Odoo ownership, public-frontend boundary, integration direction, persistence, environments and source ownership.
- Define a configurable product/variant convention suitable for independently stocked designs and size-specific demand. Do not hardcode the business's size labels, colors, schools or customers without client evidence.
- Define internal identifiers/barcodes as system-managed identifiers; exact printed label layout and any human-readable code convention remain reviewable design decisions.
- Define the minimum finished-stock location/movement contract using the confirmed store/storage facts while keeping any unconfirmed factory staging location explicitly proposed rather than factual.
- Define offline transaction states, idempotency keys, reconciliation visibility and conflict categories. Do not reduce the mandatory offline-checkout requirement; offline behavior beyond proven ordinary sale scenarios stays explicitly unresolved until specified and tested.
- Define audit/event requirements for privileged changes and queued offline activity.

### Representative UX foundation
Create a reusable design direction rather than one-off screens.
- Shared semantic design tokens: typography, spacing, radii, surfaces, status semantics, focus states, motion principles and RTL behavior.
- Public web: source-owned accessible components, with shadcn/ui as a preferred component source and Motion for deliberate spring/layout/shared-element interaction where useful. Exact dependency versions are selected only when the hosted project is initialized and verified.
- Internal Odoo/POS: Owl/Odoo-compatible components and tokens. No React checkout shell.
- Representative review surfaces, using synthetic data only:
  - retail POS product/cart/payment state;
  - preorder/order detail with balance, collection and status context;
  - production queue/task state;
  - public catalog/large-client landing and product detail/enquiry path.
- English and Arabic/RTL variants at desktop and narrow widths.
- Reduced-motion, keyboard/focus and checkout responsiveness checks.

### Hosted verification
- GitHub-hosted lint/type/build/test gates for any new frontend code.
- Hosted rendered screenshot/interaction evidence for representative routes.
- Odoo-side tests for any foundation addon changes.
- Record exact tested commits and failures; compilation alone is not UI acceptance.

## Hosted UI outcome

The disposable representative frontend at `prototype/review-ui` now has exact-head hosted technical evidence at implementation commit `670dd9999788ee01f6df6e000675054ef0153a6a`.

Run `34070644678` / job `101587223017` passed typecheck, optimized Next.js production build and all 12 Playwright browser tests. Eight English/Arabic desktop/mobile screenshots were produced. Tests also covered representative POS state changes, the public no-price/no-stock/cart wording boundary, visible keyboard focus and browser-native reduced-motion suppression. Detailed evidence and the earlier reduced-motion failure/fix are in `docs/validation/UI_FOUNDATION.md`.

This closes the **hosted technical UI gate only**. It does not satisfy the required client visual checkpoint. Final color/type/assets and agency-level visual quality remain open to review.

## Explicitly outside this phase
- Production deployment or production Odoo hosting.
- Real customer/business records.
- Live InstaPay/bank integration, cards, wallets or automated payment verification.
- Full inventory/POS/preorder/production/business-client implementation.
- Raw-material/WIP accounting, payroll, procurement planning or general-ledger product work.
- Real hardware integration.
- Automated WhatsApp/customer messaging.
- Advanced analytics.
- Final migration/onboarding, backups, disaster recovery or staff training.

## Architecture-critical unknowns that stay explicit
These are not silently decided by implementation:
- Exact garment design/template boundaries where the same garment differs by school/client/design.
- Exact size labels and which attributes are stock-bearing variants for each product family.
- Human-readable item-code format and printed label content.
- Whether a physical factory-finished staging location should exist in stock or remain a workflow state before transfer.
- Offline support for preorders, collection, refunds and exchanges beyond ordinary checkout.
- Missing/delayed InstaPay notification handling during an outage.
- Refund/exchange eligibility and approval rules.
- Business-order final-payment timing and partial shipment policy.
- Applicable legal/tax receipt identity requirements.

Routine technical choices may be proposed and documented by the developer; business-policy choices remain proposals until client-confirmed.

## Validation / acceptance gates
This phase is complete only when:
1. Architecture ownership and persistence boundaries are documented without contradictory sources of truth.
2. Representative data contracts can express the accepted MVP without hardcoding unknown business values.
3. New code, if any, passes exact-head hosted build/tests.
4. Representative POS/order/production/public UI renders are produced in English/Arabic, desktop/narrow, with reduced-motion and basic keyboard evidence.
5. The client explicitly accepts or rejects the representative visual direction; generated screenshots alone are not acceptance.
6. Remaining business-policy unknowns are clearly separated into blocking versus later-phase decisions.
7. PROJECT.md, DECISIONS.md and the documentation index accurately hand off the next implementation phase.

Gates 1–4 have technical evidence. Gate 5 remains open. Gate 6 is partially complete and must be resolved only to the extent needed for the next implementation slice. Gate 7 remains a completion/handoff gate.

## Expected outputs
- `docs/architecture/FOUNDATION_ARCHITECTURE.md`
- focused ADR/decision entries in `docs/DECISIONS.md`
- `docs/ui/DESIGN_SYSTEM.md`
- `docs/ui/CONCEPT_BRIEF.md`
- `docs/validation/UI_FOUNDATION.md`
- representative hosted UI source and validation evidence
- an updated immediate implementation-phase contract after client visual review

## Next dependency
The first production-grade implementation phase should start with products, finished-stock movements, access controls and inventory onboarding only after this foundation is reviewable, the client visual direction is decided and architecture-critical product/stock rules are sufficiently resolved.
