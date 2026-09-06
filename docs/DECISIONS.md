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

## D-005 — Marketing/exposure priorities
Status: Accepted by client, 2026-09-06.

Within marketing/exposure, prioritize attracting large clients such as international schools and franchise restaurants ordering shipments under contracts with upfront payment. Catalog browsing is second. Other discussed marketing outcomes, including online purchasing and store discovery, are lower-priority future work.

This does not place marketing above operational inventory/order tracking or POS, mandate all business clients pay upfront, or approve a particular website/CRM implementation. Detailed requirements remain in docs/requirements/DISCOVERY.md.

## D-006 — Finished-garment inventory and simple production tracking
Status: Accepted by client, 2026-09-06.

Initial inventory tracks finished clothes. Initial production tracking uses In production, Finished and Ready for collection. Material and work-in-progress stock accounting are outside the initial inventory boundary.

Automatic triggering with a user-tunable preset is requested. Exact threshold, grouping, deadline override, authorization and task/status behavior require clarification before implementation; no defaults have been accepted.

## D-007 — Large-client payment workflow clarification
Status: Client clarification, 2026-09-06.

The described large-client process takes a deposit after sample approval, starts production against a delivery date, then ships and collects the remaining payment. D-005's upfront-payment preference must not be interpreted as mandatory full prepayment. Exact balance timing and payment percentages remain open.
