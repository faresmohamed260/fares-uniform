# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Initial deployment target: Vercel for the public web application; Odoo requires a separate compatible persistent host.
- Available stack services: Supabase and Cloudflare, neither selected as an operational mirror by default.
- Source of truth: repository code and docs; no reliance on session memory or local files.
- Execution: remote only.
- Process reference: RenderLab's work and documentation instructions, adapted to this independent ERP.

## Current state — 2026-09-07

**Phase 0 — Discovery: IN PROGRESS. Phase 0A — Hosted Odoo proof: TECHNICAL PASS / CLIENT VISUAL REVIEW OPEN. Phase 0B — Foundation architecture and UX direction: HOSTED TECHNICAL UI GATES PASS / CLIENT VISUAL REVIEW OPEN.**

Discovery rounds 1–8 are recorded in `docs/requirements/DISCOVERY.md`. The first-release proposal in `docs/requirements/MVP_SCOPE.md` is broadly accepted in principle. Confirmed scope covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

The hosted Odoo proof on `proof/odoo-community` passed its exact-head test suite at implementation commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9`: run `34068805602` completed 15 tests with 0 failures/errors. The proof established a conditional technical GO for Odoo Community as the operational/domain core, with Fares-owned addons and UX. It also exposed an Odoo 19.0 offline-startup restore defect; the proof carries an isolated addon-level compatibility shim rather than a core fork. Full evidence and limitations are in `docs/validation/ODOO_PROOF.md`.

Phase 0B has now formalized the hybrid architecture and semantic design-system direction and added a disposable synthetic review app under `prototype/review-ui`. Exact implementation head `670dd9999788ee01f6df6e000675054ef0153a6a` passed hosted run `34070644678`, job `101587223017`: typecheck and production build succeeded and all 12 Playwright browser tests passed. The run generated eight baseline English/Arabic desktop/mobile screenshots and verified representative POS interactions, no public price/stock/cart wording, keyboard focus and rendered reduced-motion behavior. See `docs/validation/UI_FOUNDATION.md`.

This technical UI pass is **not** client visual approval. The palette/type/assets remain review candidates, the synthetic vector garment artwork is not final photography and the current connector evidence surface does not substitute for a human visual-quality review. The Odoo proof UI likewise remains compatibility evidence only.

A separate stacked branch, `foundation/phase-0b`, owns the current bounded foundation work; draft PR #2 targets `proof/odoo-community`. Its contract is `docs/phases/PHASE_0B_FOUNDATION.md`.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget will be decided before deployment.

## Roadmap

1. Phase 0: finish discovery, confirm important business-policy boundaries and first-release success criteria.
2. Phase 0A: prove the Odoo reuse candidate remotely — technical proof passed; final design remains outside the proof UI.
3. Phase 0B: formalize foundation architecture/data/offline contracts and representative premium bilingual UX direction — hosted technical UI gates passed; client visual decision remains open.
4. Implement and verify prioritized end-to-end workflows in bounded phases, beginning with products/finished stock/access controls.
5. Prepare data onboarding, user acceptance and an explicitly authorized deployment.

## Next actions

1. Review the Phase 0B representative visual direction; acceptance/rejection must remain explicit rather than inferred from passing browser tests.
2. Resolve only the business-policy choices required before the first production-grade implementation slice, beginning with real product/design/variant identity and finished-stock handoff/staging semantics.
3. Keep unresolved offline preorder/collection/refund/exchange, delayed InstaPay confirmation, refund/exchange eligibility and business final-payment/shipment rules explicit until their affected implementation phase.
4. After sufficient product/stock rules and client visual direction are accepted, write the next immediate implementation-phase contract for products, finished-stock movements, access controls and inventory onboarding.
5. Keep Phase 0 open until its exit criteria are actually met; do not equate hosted technical gates with completed discovery or deployment approval.

## Current blockers / unknowns

The hosted architecture/UI prototype itself has no failing technical gate. Phase 0B cannot be declared complete until the client visual checkpoint is resolved. Before affected production implementation, resolve the product/design variant convention in business terms, exact item/label presentation as needed, factory-finished stock staging/handoff choice, and any other business policy specifically required by that slice. Budget/timing and actual hosting resource selection remain deferred until before deployment.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; no credentials or real private business records belong in this public repository.
