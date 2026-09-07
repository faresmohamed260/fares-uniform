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

**Phase 0 — Discovery: IN PROGRESS. Phase 0A — Hosted Odoo proof: TECHNICAL PASS / CLIENT VISUAL REVIEW OPEN. Phase 0B — Foundation architecture and UX direction: AUTHORIZED / IN PROGRESS.**

Discovery rounds 1–8 are recorded in `docs/requirements/DISCOVERY.md`. The first-release proposal in `docs/requirements/MVP_SCOPE.md` is broadly accepted in principle. Confirmed scope covers finished stock, bilingual offline POS, preorders/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics remains future work.

The hosted Odoo proof on `proof/odoo-community` passed its exact-head test suite at implementation commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9`: run `34068805602` completed 15 tests with 0 failures/errors. The proof established a conditional technical GO for Odoo Community as the operational/domain core, with Fares-owned addons and UX. It also exposed an Odoo 19.0 offline-startup restore defect; the proof carries an isolated addon-level compatibility shim rather than a core fork. Full evidence and limitations are in `docs/validation/ODOO_PROOF.md`.

The proof UI demonstrates compatibility only. It is not the premium client-approved UI. The backend remains visibly close to stock Odoo and the POS styling is only a restrained experiment. Client visual review therefore remains open.

A separate stacked branch, `foundation/phase-0b`, owns the next bounded foundation work. Its contract is `docs/phases/PHASE_0B_FOUNDATION.md`.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes remain unavailable and must not be invented. Launch date and service budget will be decided before deployment.

## Roadmap

1. Phase 0: finish discovery, confirm important business-policy boundaries and first-release success criteria.
2. Phase 0A: prove the Odoo reuse candidate remotely — technical proof passed; client visual checkpoint remains open.
3. Phase 0B: formalize foundation architecture/data/offline contracts and representative premium bilingual UX direction.
4. Implement and verify prioritized end-to-end workflows in bounded phases, beginning with products/finished stock/access controls.
5. Prepare data onboarding, user acceptance and an explicitly authorized deployment.

## Next actions

1. Follow `docs/phases/PHASE_0B_FOUNDATION.md` on `foundation/phase-0b`.
2. Write the foundation architecture and design-system documents from accepted evidence; keep unresolved business rules marked as proposals/unknowns.
3. Establish representative public and internal UI direction using maintained accessible component sources and Odoo-compatible primitives.
4. Produce hosted English/Arabic desktop/narrow evidence with reduced-motion and keyboard checks.
5. Obtain explicit client visual acceptance before treating the design direction as locked.
6. Keep Phase 0 open until its exit criteria are actually met; do not equate the Odoo technical pass with completed discovery.

## Current blockers / unknowns

No blocker prevents the architecture/UI foundation spike. Before affected implementation, resolve the product/design variant convention in business terms, exact item/label presentation, offline scope beyond ordinary sale checkout, missing InstaPay-confirmation handling, refund/exchange policy, factory-finished stock staging choice, and business-order payment/shipment details. Budget/timing and actual hosting resource selection remain deferred until before deployment.

## Evidence policy

Implemented, hosted-tested, visually reviewed and deployed are separate states. Every implementation claim must refer to exact remote evidence. Synthetic proof data only; no credentials or real private business records belong in this public repository.
