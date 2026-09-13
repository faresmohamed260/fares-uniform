# Phase 6 deployment architecture

Status: **PHASE 6 PROVIDER-NEUTRAL BASELINE VERIFIED; VERCEL DIRECTION SUPERSEDES THE ORIGINAL VPS RECOMMENDATION; PHASE 7 VERCEL REPOSITORY/CI TOPOLOGY VERIFIED, 2026-09-13.**

Inherited application authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Verified Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Decision evolution

Phase 6 originally recommended a single x86-64 EU Linux VPS for Odoo + PostgreSQL + persistent filestore, with Hetzner leading the dated 2026-09-12 cost/value comparison. That was a recommendation only; no provider was selected or created.

On 2026-09-13 the client selected **Vercel**, following the existing RenderLab/SAGA deployment direction. That client decision supersedes the VPS/Hetzner recommendation for the intended deployment path.

The Phase 6 proof remains valid and preserved. It proves the provider-neutral Docker/Odoo/PostgreSQL security, persistence, coordinated PostgreSQL+filestore backup and destructive restore mechanics for the filesystem-backed topology. It remains a verified fallback/reference package.

Phase 7 then proved a separate stateless Vercel topology. See `../phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md` and `../validation/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

## Accepted system constraints

- Fares is a small business; numeric production load and launch date remain unknown.
- Odoo Community remains the private operational/domain authority.
- Production addons remain `fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api,fu_reporting`.
- The public site is a separate Next.js surface consuming only the narrow Fares public API.
- Public browser code must never receive broad Odoo/database credentials.
- Offline checkout correctness and server-side role/location boundaries remain mandatory.
- Production/staging must have separate state and secrets.
- No live or paid Fares deployment has been authorized yet.

## Verified Vercel topology

The source-controlled project mapping in `vercel.json` uses Vercel Services:

```text
                              Vercel project

Internet ───────────────────► public_web (Next.js)
       │                         │
       │                         └── private ODOO_BASE_URL binding
       │                                      │
       │                                      ▼
       │                                odoo_http
       │                                stateless container
       │                                      │
       │                                      ├──────────────┐
       │                                      │              │
       │                                      ▼              ▼
       │                               managed PostgreSQL   external cron
       │                               business data       bearer-authenticated
       │                               DB attachments      /fares/internal/cron/run
       │                               shared sessions
       │
       └── /websocket ───────────────► odoo_websocket
                                       stateless evented container
                                       reconnect/cursor replay
```

Services:

- **`public_web`** — `apps/public-web/`, framework `nextjs`.
- **`odoo_http`** — container runtime from `Dockerfile.vercel`.
- **`odoo_websocket`** — separate evented container runtime from the same image.

Public exposure is intentionally narrow:

- `/websocket` → `odoo_websocket`;
- `/fares/internal/cron/run` → `odoo_http`, with application-layer bearer authentication;
- all other public traffic → `public_web`;
- no direct `/fu/public/**` rewrite to Odoo;
- no broad Odoo backoffice rewrite.

The public Next.js service receives `ODOO_BASE_URL` from a **private service binding** to Odoo HTTP. Browser code never receives database credentials or a broad Odoo credential.

## Service-local runtime-mode boundary

Vercel project environment variables are shared at project scope, so using a project-wide `ODOO_RUNTIME_MODE=websocket` would incorrectly affect both Odoo services.

The verified design uses a service-local binding marker:

- `odoo_websocket` receives `FARES_ODOO_HTTP_INTERNAL_URL` through its binding to `odoo_http`;
- `deploy/vercel/runtime-mode.sh` resolves WebSocket mode when running on Vercel with that marker;
- `odoo_http` resolves to HTTP mode;
- explicit `ODOO_RUNTIME_MODE` remains available for hosted CI/local proof.

The project-config CI executes all resolution branches and validates `vercel.json` against Vercel's live schema before enforcing the exact semantic routing/binding contract.

## Stateless Odoo runtime

The Phase 6 image could not be deployed unchanged because it assumed durable local Odoo filestore/session state. Phase 7 removes those correctness-critical local-disk assumptions:

- Vercel-target image declares no persistent volume;
- local writable data paths under `/tmp` are disposable;
- fixed non-root Odoo UID/GID remains `10001:10001`;
- `workers = 0` and built-in cron threads remain disabled for this topology;
- database selection is fixed (`fares`) and public database listing remains disabled.

## PostgreSQL and Supabase

The live target is managed external PostgreSQL. **Supabase is the preferred managed PostgreSQL target for an explicitly authorized commercial staging deployment.** No real Supabase resource was created in Phase 7.

Odoo requires PostgreSQL session semantics because its bus/WebSocket implementation uses `LISTEN/NOTIFY`. Therefore:

- direct PostgreSQL connections are acceptable;
- Supavisor **session mode** is acceptable;
- Supavisor **transaction mode** is not acceptable for Odoo;
- live connections require TLS (`sslmode=require` at minimum; stronger certificate verification may be used when the CA chain is available);
- an isolated `fares` application database and least-privileged `fares_app` role may be retained as ordinary PostgreSQL constructs;
- managed hosting does not justify granting the routine Odoo role superuser, createdb or createrole.

Actual project/database creation, region, endpoint, billing owner, secret owner and backup policy remain live-stage decisions.

## Attachments

The verified Vercel topology uses native Odoo database-backed attachment storage (`ir_attachment.location = db`). Hosted proof stores a synthetic attachment in PostgreSQL, destroys/replaces Odoo runtime instances and later performs a database-only clean restore while preserving attachment truth.

This retires a mandatory filestore **for the verified Vercel topology only**. The Phase 6 PostgreSQL+filestore model remains authoritative for its filesystem-backed package.

A later object-store adapter is optional and must receive its own security/migration/recovery proof if introduced.

## Sessions

Filesystem sessions are replaced by a shared PostgreSQL-backed server-side session store implemented in the deployment-only runtime layer.

Security boundary:

- privileged bootstrap creates/owns the session table;
- routine Odoo runtime performs only required DML;
- no `PUBLIC` grants are required on the session table;
- authenticated session continuity survives complete stateless runtime replacement;
- session truth is recoverable in the database-only Phase 7 restore proof.

## Cron/background work

Built-in Odoo cron threads remain disabled. Required scheduled work is invoked through `/fares/internal/cron/run`:

- route is sessionless but requires a server-side bearer secret;
- database selection comes from fixed deployment configuration, not caller input;
- due-job acquisition/execution delegates to pinned Odoo `ir.cron`;
- hosted CI proves two concurrent authenticated triggers execute one due synthetic job exactly once using native Odoo locking semantics;
- unauthenticated/invalid requests fail closed.

Vercel Cron/Workflow/Queue selection for the actual staging trigger remains a live-stage configuration choice; repository correctness does not depend on an immortal scheduler process.

## WebSocket/bus

The evented runtime is separate from normal Odoo HTTP because pinned Odoo requires its gevent server to own the raw WebSocket socket.

Hosted proof establishes:

1. authenticated shared HTTP session is created;
2. evented service receives a first notification;
3. evented runtime is completely destroyed;
4. a second notification is committed while no evented runtime exists;
5. a fresh evented runtime starts with no mounted persistence;
6. the client reconnects using the same shared session plus last-notification cursor;
7. the second unseen notification is replayed;
8. the first notification is not duplicated.

Correctness therefore resides in PostgreSQL/shared application state rather than one evented instance's memory.

## Recovery model under Vercel

Phase 7 proves the following durable authority for the Vercel topology:

1. PostgreSQL backup/export containing operational data, database-backed attachment binary data and intended recoverable shared-session state;
2. exact Fares implementation authority;
3. exact pinned Odoo SHA;
4. source-controlled deployment configuration;
5. secrets restored separately through the authorized platform secret boundary.

The hosted clean database restore proves application facts, attachment content and authenticated session state can be recovered without a matching Odoo filestore volume.

A real managed Supabase staging resource must repeat backup/restore using the actual provider before production. Phase 7 CI proof is not a claim that a live provider backup has already been rehearsed.

## Final Phase 7 evidence

Runtime-sensitive checkpoint `24850acc029e0e7bbef898d6598d0d8b3f7ce733`:

- state/session/recovery run `34769858562`, job `103757345079` — success;
- cron run `34769858603`, job `103757345002` — success;
- WebSocket run `34769858556`, job `103757344998` — success;
- project-config run `34769858553` — success.

Final implementation `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`:

- project/public regression run `34770228476` — success;
- project-config job `103758364688` — live-schema/topology/runtime-mode/application-authority proof green;
- public-web job `103758364506` — typecheck/build/Playwright green.

Only the project-config workflow changes between the runtime checkpoint and final implementation, so runtime proof remains applicable to final source.

## Security boundary

The Vercel adaptation retains:

- fixed database selection / no public database manager;
- least-privileged application database role;
- server-side role/location enforcement;
- narrow public API allowlists;
- no broad credential in public browser code;
- production/preview/staging secret separation requirement;
- runtime secret injection rather than committed values;
- no real private business data in source or CI artifacts;
- minimal public Vercel rewrite surface.

## Environment separation

- **Hosted CI proof:** synthetic/disposable — complete / verified.
- **Commercial Vercel staging:** technically ready but not yet authorized or created.
- **Production:** not authorized; requires separate managed state/secrets/access and operational cutover gates.

## Commercial-plan boundary

The connected Vercel team is on Hobby and Fares Uniform is commercial. Repository/CI completion does not authorize placing real Fares staging/production on Hobby or creating billable resources. A commercial plan/project and actual backing services require explicit client authorization.

## Historical Phase 6 VPS recommendation

The 2026-09-12 Hetzner/DigitalOcean/Render comparison remains historical architecture research. It is no longer the selected deployment direction. The verified Phase 6 package remains a fallback if a future live Vercel/Supabase rehearsal fails a non-negotiable correctness/security requirement.

## Remaining decisions before live deployment

Technical Phase 7 repository work is closed. Still unresolved before live production:

- commercial Vercel plan/project ownership and spending authorization;
- actual Supabase project/database/region and billing ownership;
- staging/production secret ownership/rotation;
- actual managed backup frequency/retention and RPO/RTO;
- domain/DNS/TLS/internal-access model;
- monitoring/logging/alert ownership;
- actual store browser/scanner/printer acceptance;
- named staff/training/recovery ownership;
- real opening-data/cutover/reconciliation procedure;
- launch timing.

**Technically ready for explicitly authorized commercial staging; production remains NO-GO.**