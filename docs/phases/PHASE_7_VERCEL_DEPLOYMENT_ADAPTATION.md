# Phase 7 — Vercel deployment adaptation

Status: **ACTIVE / AUTHORIZED, 2026-09-13.**

Branch: `phase-7/vercel-deployment-adaptation`.

Starting documentation lineage: `b14cc8320530ed91c807696d7d329a01811c445b`.

Inherited authoritative business-application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited verified provider-neutral deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authorization: after Phase 6 closure the client explicitly instructed: **use Vercel, following the same deployment direction used for RenderLab and SAGA**. This selects Vercel as the deployment-platform direction and supersedes the earlier Phase 6 Hetzner/single-VPS recommendation. It authorizes repository design, compatibility implementation and hosted CI proof for a Vercel-native architecture. It does **not** authorize upgrading the Vercel plan, purchasing services, creating paid staging/production resources, adding production secrets, domains/DNS changes, real-data migration or production cutover.

## Goal

Adapt the verified Fares Uniform runtime to Vercel's stateless service model without weakening Odoo correctness, security, offline checkout behavior, or recovery guarantees.

The target follows the RenderLab/SAGA operating pattern: Vercel is the application/deployment control surface; durable state lives in managed backing services rather than in an application container's local filesystem.

## Platform facts that constrain the design

Current Vercel documentation supports container-runtime services and multi-service projects, but Vercel-hosted application compute must be treated as stateless. Docker Compose named volumes are not the deployment persistence model. Persistent databases/files therefore require managed backing services.

Current Vercel capabilities relevant to this phase include:
- container runtime services (`runtime: container`) inside Vercel Services;
- private service routing/rewrites between services;
- managed storage/database integrations through the Vercel Marketplace;
- Cron Jobs, Workflows and Queues for trigger-driven background work;
- WebSocket support with reconnect-safe client design required across function/container lifecycle boundaries.

Official references checked 2026-09-13:
- https://vercel.com/docs/services
- https://vercel.com/docs/functions/container-images
- https://vercel.com/docs/marketplace-storage
- https://vercel.com/docs/cron-jobs
- https://vercel.com/docs/workflows
- https://vercel.com/docs/queues
- https://vercel.com/docs/functions/websockets

## Odoo compatibility facts

Pinned Odoo currently assumes local durable filesystem state in two important places:
1. `ir.attachment` defaults to filestore-backed binary storage, although native Odoo also supports database-backed attachment storage through `ir_attachment.location = db`.
2. HTTP sessions default to a filesystem session directory under Odoo's data directory.

Therefore the verified Phase 6 Compose image cannot simply be uploaded unchanged to Vercel and called production-safe. Phase 7 must remove or externalize every correctness-critical local-disk dependency first.

## Target architecture to prove

1. **Public web:** existing Next.js `apps/public-web` remains Vercel-native and continues consuming only the narrow Fares public API.
2. **Private Odoo HTTP runtime:** package pinned Odoo + the seven production addons as a Vercel container/Service candidate.
3. **PostgreSQL:** use a managed external PostgreSQL service; Supabase is the preferred first candidate because it is already an accepted/available service family and mirrors the established project pattern. No database resource is created in this phase without separate live-resource authorization.
4. **Attachments:** first proof uses Odoo's native database attachment storage (`ir_attachment.location = db`) so attachment truth survives stateless Odoo instance replacement without a mounted filestore. Any future external object-storage implementation must preserve the same `ir.attachment` security semantics and requires its own proof.
5. **Sessions:** replace Odoo's local filesystem session store with a shared server-side persistence mechanism. Prefer PostgreSQL-backed sessions for the first proof to avoid adding another state service unless evidence shows that unsuitable. Session state must remain private and server-side.
6. **Background scheduling:** built-in always-on cron assumptions must not be relied on. Map required scheduled work to a Vercel-triggered mechanism (Cron Jobs/Workflows/Queues) with server-side authentication, locking/idempotency and no duplicate business mutation.
7. **Realtime/bus:** prove Odoo WebSocket/bus behavior with reconnect across runtime lifecycle boundaries; do not assume one container instance is permanent.
8. **Recovery:** if attachment truth is fully database-backed, the Vercel-native recovery authority becomes PostgreSQL plus exact application/Odoo SHA metadata rather than the Phase 6 PostgreSQL+filestore pair. This simplification must be proven before the filestore requirement is retired for this topology.

## In scope

- add Vercel deployment/service configuration needed for hosted compatibility proof;
- add deployment/runtime adapters required for stateless operation;
- use native Odoo database-backed attachment storage in synthetic proof;
- implement and test a shared Odoo session store without altering business authorization semantics;
- implement safe trigger-driven cron/background execution boundaries;
- validate WebSocket/bus reconnect behavior relevant to POS/internal use;
- prove app/container replacement while session, attachment and database truth survives;
- prove backup/restore of the Vercel-target database-backed state using synthetic data;
- preserve exact Odoo pinning and Phase 5A application behavior;
- retain the Phase 6 provider-neutral deployment package as a valid historical/recovery baseline rather than deleting it.

## Explicitly out of scope

- Vercel Hobby-to-Pro upgrade or any paid-plan mutation;
- creating Fares Uniform staging or production Vercel resources;
- creating managed Supabase/Postgres/Blob/Redis resources for real use;
- production environment variables or secrets;
- custom domains, DNS, certificates or Cloudflare changes;
- real customer, staff, stock, order, bank or payment data;
- production cutover;
- changing business workflows merely to fit Vercel;
- replacing Odoo Community with a bespoke ERP backend;
- weakening database role permissions, public API allowlists, offline fail-closed rules or existing server-side role enforcement.

## Commercial-plan boundary

The currently connected Vercel team is on the Hobby plan. Fares Uniform is a commercial/business workload. Repository/CI work may proceed without changing that account, but a real business staging/production deployment must use an appropriate commercial Vercel plan and requires separate explicit authorization before any upgrade or billable resource creation.

## Validation contract

Before the Vercel adaptation can be called technically ready:
1. exact application/Odoo authority is recorded and unchanged unless an evidence-backed compatibility change is required;
2. Vercel-target Odoo image/service starts without depending on a durable local volume;
3. synthetic attachment binary survives complete Odoo runtime replacement and is readable through Odoo;
4. authenticated user session survives runtime replacement and does not rely on local filesystem continuity;
5. cron/background execution is trigger-driven, authenticated, idempotent and does not require an immortal process;
6. required realtime/bus client behavior reconnects cleanly after runtime lifecycle interruption;
7. seven production addons install/upgrade and inherited application tests remain green;
8. public-web typecheck/build/Playwright remains green if configuration changes affect it;
9. a database-only backup/restore rehearsal recovers application facts, attachment content and any shared-session schema that is intended to be recoverable;
10. no paid/live resource or real business data is used for the repository/CI proof.

If any of these assumptions fails, retain the Phase 6 provider-neutral package and redesign the Vercel mapping based on evidence rather than weakening the gate.

## Documentation outputs

- this phase contract;
- updated `docs/architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md` marking the VPS recommendation as superseded by the client-selected Vercel direction while retaining historical Phase 6 evidence;
- updated `docs/operations/DEPLOYMENT_READINESS.md`;
- a Phase 7 validation document once implementation evidence exists;
- `PROJECT.md`, `docs/README.md` and the durable decision log.

## Exit criteria

Phase 7 repository/CI scope is complete only when the stateless Vercel-target runtime assumptions above are exact-head green and documented. That result means **ready for an explicitly authorized Vercel commercial staging deployment**, not production GO.

Production remains NO-GO until commercial-plan authorization, actual backing-service resources, secret/domain/access ownership, real store hardware acceptance, staff/data cutover, monitoring/backup policy and launch timing are separately resolved.