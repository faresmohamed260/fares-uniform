# Phase 6 deployment architecture

Status: **PHASE 6 PROVIDER-NEUTRAL BASELINE VERIFIED; ORIGINAL VPS RECOMMENDATION SUPERSEDED BY CLIENT-SELECTED VERCEL DIRECTION, 2026-09-13.**

Inherited application authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Decision evolution

Phase 6 originally recommended a single x86-64 EU Linux VPS for Odoo + PostgreSQL + persistent filestore, with Hetzner leading the dated 2026-09-12 cost/value comparison. That was a developer recommendation only and no provider was selected or created.

On 2026-09-13 the client explicitly selected **Vercel** instead, asking to use the same platform direction as RenderLab and SAGA. That client decision supersedes the VPS/Hetzner recommendation for the intended deployment direction.

The Phase 6 exact-head proof remains valid and must not be rewritten: it proves the provider-neutral Docker/Odoo/PostgreSQL security, persistence, coordinated backup and destructive clean-restore mechanics. The verified Compose package remains a recovery/reference baseline and fallback while the Vercel mapping is proven.

Active adaptation contract: `../phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

## Constraints from the accepted system

- Fares is a small business; numeric production load and launch date remain unknown.
- Odoo Community remains the private operational/domain authority.
- Production addons remain `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.
- The public site is a separate Next.js surface consuming only the narrow Fares public API.
- Public browser code must never receive broad Odoo/database credentials.
- Offline checkout correctness and server-side role/security boundaries remain mandatory.
- Production/staging must have separate state and secrets.
- No live or paid deployment has been authorized yet.

## Current selected platform direction — Vercel

The target follows the existing RenderLab/SAGA pattern: Vercel owns application deployment and routing; persistent business truth lives in managed backing services rather than in local application disks.

Current Vercel capabilities relevant to the target, checked from official documentation on 2026-09-13:
- Vercel Services can define multiple project services and set `runtime: container` for Docker/OCI-backed HTTP services;
- Vercel container images can host custom HTTP applications;
- Vercel Marketplace can provision managed storage/database integrations;
- Vercel Cron Jobs, Workflows and Queues provide trigger-driven background execution options;
- Vercel Functions support WebSockets, with client reconnect behavior required across runtime lifecycle boundaries.

Official references:
- https://vercel.com/docs/services
- https://vercel.com/docs/functions/container-images
- https://vercel.com/docs/marketplace-storage
- https://vercel.com/docs/cron-jobs
- https://vercel.com/docs/workflows
- https://vercel.com/docs/queues
- https://vercel.com/docs/functions/websockets

## Why the Phase 6 container cannot be deployed unchanged

The verified Phase 6 package assumes durable local state:
- PostgreSQL data lives on a named volume;
- Odoo attachment filestore lives on a named volume;
- Odoo HTTP sessions use the Odoo data directory by default.

Vercel application compute must be treated as stateless. Therefore the intended Vercel design removes correctness-critical local filesystem dependence instead of attempting to emulate Compose volumes.

Pinned Odoo source supports database-backed binary attachment storage through `ir_attachment.location = db`; the first Vercel proof will use that native mode. Pinned Odoo HTTP sessions are filesystem-backed by default, so Phase 7 must add a shared server-side session-store adaptation before Vercel can be considered safe for authenticated Odoo use.

## Target Vercel topology to prove

```text
                       Vercel project
                 +-----------------------+
Internet --------| public Next.js web    |
                 |                       |
Private users ---| Odoo container/service|----+
                 +-----------------------+    |
                                                |
                                  managed PostgreSQL
                                  - Odoo business data
                                  - DB-backed attachments
                                  - shared session state
                                                |
                                    managed backup/export

Scheduled triggers: Vercel Cron / Workflow / Queue
Realtime: Odoo bus/WebSocket with reconnect-safe clients
```

### Public web

`apps/public-web` remains Vercel-native. It receives only the existing narrow public catalog/enquiry contract; no broad Odoo or PostgreSQL credentials reach browser code.

### Private Odoo runtime

Pinned Odoo + the seven production addons are evaluated as a Vercel container/Service. Runtime instances must be replaceable without losing authenticated-session truth, attachments or business records.

### PostgreSQL

Use managed external PostgreSQL rather than a local container volume. **Supabase is the preferred first candidate** because it is already an accepted/available project service family and mirrors the established project deployment pattern. This is a design target, not authorization to create a database resource.

Least privilege from Phase 6 still applies: routine Odoo credentials must not become superuser/createdb/createrole merely because the database is managed.

### Attachments

First proof uses native Odoo database attachment storage (`ir_attachment.location = db`). The objective is to eliminate the mandatory mounted filestore for the Vercel topology while preserving `ir.attachment` authorization and content integrity.

A later object-store adapter is optional, not assumed. If introduced it must preserve Odoo access/security semantics and receive its own migration/recovery proof.

### Sessions

Filesystem session persistence is incompatible with replaceable stateless instances. Phase 7 must provide a shared server-side session store, with PostgreSQL preferred for the first proof to avoid another state service. Session cookies/tokens must remain private, server-side validated and consistent across runtime replacement.

### Cron and background work

Do not depend on a permanently running Odoo cron worker. Required scheduled jobs must be invoked through authenticated trigger-driven execution compatible with Vercel Cron Jobs/Workflows/Queues, with locking/idempotency so duplicate invocation cannot duplicate business mutation.

### WebSocket/bus

Realtime behavior must be tested under Vercel lifecycle constraints. Clients must reconnect safely; correctness must live in PostgreSQL/application state rather than one instance's memory.

## Recovery model under Vercel

Phase 6 established PostgreSQL + filestore as one recoverable pair for the filesystem-backed topology.

If Phase 7 successfully proves that all required attachment truth is database-backed and shared session state is database-backed, the Vercel topology can reduce the durable application recovery authority to:
1. managed PostgreSQL backup/export containing business data, attachment binary data and intended recoverable session schema;
2. exact Fares application SHA;
3. exact pinned Odoo SHA;
4. deployment configuration and secrets restored separately from source-controlled templates.

This database-only simplification is **not yet authoritative**. Phase 7 must prove it with destructive replacement/restore evidence before the filestore requirement is retired for Vercel.

The Phase 6 database+filestore backup tooling remains preserved for its verified topology.

## Security boundary

The Vercel adaptation must retain:
- fixed database selection / no public database manager;
- least-privileged database application role;
- server-side role and location enforcement;
- existing public API allowlists;
- no broad credential in public browser code;
- production/preview/staging secret separation;
- runtime secret injection rather than committed values;
- no real private business data in source, CI artifacts or preview environments without explicit authorization.

## Environment separation

- **CI proof:** synthetic, disposable hosted state; authorized now.
- **Vercel preview/technical staging:** not created until the plan/resource mutation is separately authorized.
- **Production:** separate managed database/state/secrets and real data; production cutover requires explicit authorization after staging proof.

## Commercial-plan boundary

The currently connected Vercel team is on Hobby. Fares Uniform is commercial. The Vercel provider selection authorizes repository/CI adaptation work, not commercial account mutation. Before real business staging/production, the client must explicitly authorize an appropriate commercial Vercel plan and any billable managed backing services.

## Historical Phase 6 VPS recommendation

The 2026-09-12 comparison of Hetzner, DigitalOcean and Render is retained as historical architecture research. It is no longer the selected deployment direction. If Vercel compatibility fails a non-negotiable correctness/security requirement, that verified provider-neutral/VPS path remains a fallback rather than being rediscovered from scratch.

## Remaining decisions before live deployment

Vercel is selected, so provider selection is no longer open. Still unresolved before live production:
- commercial Vercel plan/ownership and spending authorization;
- exact managed PostgreSQL resource/region and billing ownership;
- production backup frequency/retention and RPO/RTO;
- domain/DNS/TLS/internal-access model;
- secret ownership/rotation;
- monitoring/logging/alert ownership;
- actual store browser/scanner/printer acceptance;
- named staff/training/recovery ownership;
- real opening-data/cutover/reconciliation procedure;
- launch timing.

Production remains **NO-GO** until Phase 7 technical proof and those live operational decisions are closed.