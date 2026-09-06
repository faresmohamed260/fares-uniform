# Fares Uniform project

## Confirmed brief

- Product: ERP for the client's father's small clothing factory.
- Client: Fares. The assistant gathers requirements and develops the system.
- Project title: Fares Uniform.
- Public repository: https://github.com/faresmohamed260/fares-uniform
- Initial deployment target: Vercel.
- Available stack services: Supabase and Cloudflare.
- Source of truth: repository code and docs; no reliance on session memory or local files.
- Execution: remote only.
- Process reference: RenderLab's work and documentation instructions, adapted to this independent ERP.

## Current state — 2026-09-06

**Phase 0 — Discovery: IN PROGRESS. Phase 0A — Hosted Odoo proof: AUTHORIZED / IN PROGRESS.**

The starting repository contained only README.md at commit 95631c568893c43fa4c3688e485c82d683afb5b7. The foundation change establishes instructions, documentation ownership, a decision log and discovery contract.

A disposable Odoo proof addon and hosted GitHub Actions workflow exist on proof/odoo-community (PR #1). The first exact-head run passed seven tests; see docs/validation/ODOO_PROOF.md. Offline and visual extensions are in progress. No production application or deployment exists; external infrastructure has not been audited.

Discovery rounds 1–8 are recorded in docs/requirements/DISCOVERY.md. The consolidated first-release proposal is docs/requirements/MVP_SCOPE.md, broadly accepted in principle; Odoo/reuse and premium UI direction now under evaluation. Confirmed direction covers finished stock, bilingual offline POS, preorder/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics is future work.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes are unavailable; do not invent them. Launch date and service budget will be decided before deployment.

## Roadmap

1. Phase 0: discover current operations, problems and success criteria; agree the first release scope.
2. Define architecture, UI direction and hosted development/validation setup from accepted requirements.
3. Implement and verify prioritized end-to-end workflows in bounded phases.
4. Prepare data onboarding, user acceptance and an authorized deployment.

Items 2–4 are provisional direction, not approved implementation contracts.

## Next session / next actions

1. Read AGENTS.md and indexed documentation, including MVP_SCOPE.md.
2. Documentation/source Odoo assessment is complete: read docs/architecture/PLATFORM_EVALUATION.md. Candidate is Community operational core/customized native POS plus bespoke public website; not yet adopted; initial runtime evidence is recorded in docs/validation/ODOO_PROOF.md. Client authorized the hosted proof; follow docs/phases/PHASE_0A_ODOO_PROOF.md.
3. Resolve architecture-critical workflow details listed in the proposal, using developer proposals for routine design choices.
4. Prepare and commit the immediate next-phase contract before implementation.
5. Keep Phase 0 open until its exit criteria are met.

## Current blockers / unknowns

MVP broadly accepted; Odoo Community is conditionally recommended after source assessment. Platform selection remains open pending hosted offline/workflow and internal visual proof. Premium modern UI with physics/morphing effects is a client requirement. No numeric capacity estimate, budget or launch date is available; the client deferred budget/timing until before deployment. These do not block current planning. Product variants, offline reconciliation policies and other detailed workflow decisions remain explicit in the scope proposal.

## Evidence policy

Repository existence and public visibility were checked through GitHub. This documentation foundation is not an application release. Future work must record actual hosted verification and deployment evidence separately.
