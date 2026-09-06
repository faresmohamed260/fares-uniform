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

Application code, schema, UI, test workflows and deployments have not been created by this project work. Existing external infrastructure has not been audited. Discovery rounds 1–3 are recorded in docs/requirements/DISCOVERY.md: uniform sectors and casual wear, manufacture-to-order and stock production, business stock sales, individual retail sales and school-uniform stockout preorders. Priority areas are inventory/order tracking, POS and marketing/exposure. Round 2 confirms one store, one storage location, paper records, full/deposit preorder payments and dated receipt copies sorted at the factory for item batching or approaching pickup dates. Marketing prioritizes large upfront-paying contracted clients, then catalog browsing; other discussed marketing outcomes are future work. Round 3 limits initial inventory to finished garments and requests user-tunable automatic production triggering, with In production, Finished and Ready for collection statuses. The large-client workflow is contact → meeting/design → samples → approval/deposit → production with delivery date → shipment and remaining payment. Trigger semantics, status meanings, users and full initial release scope remain open.

## Roadmap

1. Phase 0: discover current operations, problems and success criteria; agree the first release scope.
2. Define architecture, UI direction and hosted development/validation setup from accepted requirements.
3. Implement and verify prioritized end-to-end workflows in bounded phases.
4. Prepare data onboarding, user acceptance and an authorized deployment.

Items 2–4 are provisional direction, not approved implementation contracts.

## Next session / next actions

1. Read AGENTS.md and the current indexed docs.
2. Gather discovery round 4: production threshold/grouping/deadline rules, physical status transitions, and product identification.
3. Record answers in docs/requirements/DISCOVERY.md; resolve workflow details progressively.
4. Then complete preorder allocation/collection and ordinary stock checkout, including payment balances and exceptions.
5. Continue discovery before proposing the first release boundary.

## Current blockers / unknowns

Awaiting discovery round 4 answers. No technical blocker to continuing discovery. Deployment configuration, service resource selection, user roles, language, devices, scale and budget remain unconfirmed.

## Evidence policy

Repository existence and public visibility were checked through GitHub. This documentation foundation is not an application release. Future work must record actual hosted verification and deployment evidence separately.
