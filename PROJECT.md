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

**Phase 0 — Discovery: IN PROGRESS.**

The starting repository contained only README.md at commit 95631c568893c43fa4c3688e485c82d683afb5b7. The foundation change establishes instructions, documentation ownership, a decision log and discovery contract.

Application code, schema, UI, test workflows and deployments have not been created. External infrastructure has not been audited.

Discovery rounds 1–8 are recorded in docs/requirements/DISCOVERY.md. The consolidated first-release proposal is docs/requirements/MVP_SCOPE.md, currently DRAFT FOR CLIENT REVIEW. Confirmed direction covers finished stock, bilingual offline POS, preorder/production tracking, large-client workflow, public catalog/contact routes and operational reports. Advanced analytics is future work.

One retail store, one storage location and one checkout per store are confirmed. Numeric product/transaction volumes are unavailable; do not invent them. Launch date and service budget will be decided before deployment.

## Roadmap

1. Phase 0: discover current operations, problems and success criteria; agree the first release scope.
2. Define architecture, UI direction and hosted development/validation setup from accepted requirements.
3. Implement and verify prioritized end-to-end workflows in bounded phases.
4. Prepare data onboarding, user acceptance and an authorized deployment.

Items 2–4 are provisional direction, not approved implementation contracts.

## Next session / next actions

1. Read AGENTS.md and indexed documentation, including MVP_SCOPE.md.
2. Obtain client review of the concrete first-release boundary; record changes or acceptance.
3. Resolve architecture-critical workflow details listed in the proposal, using developer proposals for routine design choices.
4. Prepare and commit the immediate next-phase contract before implementation.
5. Keep Phase 0 open until its exit criteria are met.

## Current blockers / unknowns

Awaiting first-release scope review. No numeric capacity estimate, budget or launch date is available; the client deferred budget/timing until before deployment. These do not block current planning. Product variants, offline reconciliation policies and other detailed workflow decisions remain explicit in the scope proposal.

## Evidence policy

Repository existence and public visibility were checked through GitHub. This documentation foundation is not an application release. Future work must record actual hosted verification and deployment evidence separately.
