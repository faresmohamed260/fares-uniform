# Decision log

## D-001 — Independent public repository
Status: Accepted by client, 2026-09-06.

Use faresmohamed260/fares-uniform, titled Fares Uniform, for the clothing-factory ERP. The client created and supplied the repository. Keep project source and documentation here.

## D-002 — Repository authority and remote-only execution
Status: Accepted by client, 2026-09-06.

Repository docs are the ground source of truth. Do not rely on session memory or local files and never work locally. Use remote source changes and hosted execution. Record client decisions so another session can resume from the repository.

## D-003 — Initial hosting and available services
Status: Accepted by client, 2026-09-06.

Vercel is the initial deployment target; Supabase and Cloudflare are available. This does not select a framework, database schema, Cloudflare product, existing resource, domain or subscription. Those decisions follow discovery.

## D-004 — Client-led discovery and documented development
Status: Accepted by client, 2026-09-06.

The assistant acts as developer and gathers information from Fares as client to make the ERP suitable to the factory. Plan and document work in the repository. Use RenderLab's work/documentation instructions as the initial process reference, with this project's explicit remote-only and repository-only rules taking precedence.
