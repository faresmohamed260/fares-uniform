# Phase 7 Vercel deployment-adaptation validation

Status: **ACTIVE / STATELESS-RUNTIME FIX CANDIDATE PENDING HOSTED PROOF.**

Branch: `phase-7/vercel-deployment-adaptation`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## First implementation slice

The first Phase 7 slice is intentionally narrow. It does not claim full Vercel readiness yet. It proves the two durable-state assumptions that must change before Vercel can replace a volume-backed Odoo runtime:

1. Odoo binary attachments use native database storage (`ir_attachment.location = db`) instead of a local filestore.
2. Odoo HTTP sessions use a deployment-only PostgreSQL session store rather than `data_dir/sessions`.

The candidate also builds a Vercel-style `Dockerfile.vercel` runtime with:
- exact Odoo pinning;
- the same seven production addons as Phase 6;
- no declared Docker volume;
- fixed non-root runtime UID/GID `10001:10001`;
- disposable local `data_dir` under `/tmp`;
- `workers = 0` and built-in Odoo cron threads disabled for the Vercel proof;
- runtime HTTP port derived from `PORT`;
- configurable PostgreSQL SSL mode for managed-database compatibility.

## RED chronology

### Candidate `599ea8ab9e8c4c3b9c928285dd1e6a37b9e2e148`

Workflow `Phase 7 Vercel adaptation`, run `34728347979`, job `103646452349`: **RED / NON-AUTHORITATIVE**.

Passed before failure:
- exact-head checkout;
- Phase 5A source-authority/no-diff check for `addons` and `apps/public-web`;
- synthetic credential generation;
- exact PostgreSQL and Vercel-target Odoo image builds;
- no declared persistent volume in the Vercel-target Odoo image;
- initial PostgreSQL start and least-privileged role/database-owner checks.

Failure occurred before production-addon initialization completed. The deployment-only server-wide runtime adapter tried to execute:

`CREATE TABLE IF NOT EXISTS fares_http_session (...)`

through the normal `fares_app` application connection during `post_load`. PostgreSQL rejected the runtime DDL with `psycopg2.errors.InsufficientPrivilege: permission denied for schema public` in that execution window. Later attachment/session/replacement/restore gates were therefore not reached.

The failure exposed two design problems in the candidate rather than an application defect:
1. shared session infrastructure must not be created opportunistically by every stateless application runtime;
2. the CI startup gate waited only for `pg_isready`, which can become true before the existing database initialization script has completed all extension/schema/bootstrap work.

The fix keeps normal Odoo install/upgrade privileges intact while moving **session-table ownership and creation** to an explicit privileged operations/bootstrap boundary. The runtime adapter now only validates that the shared table exists and that its application role has the required DML. Hosted CI must also wait for the full Fares PostgreSQL bootstrap state before starting Odoo.

This does **not** reinterpret the existing Odoo migration model: the application role still receives the schema `CREATE` capability already required/proven for addon installation and upgrades. The narrower claim is that the shared HTTP-session infrastructure itself is no longer created by runtime `post_load`.

## Hosted proof contract for this slice

Workflow `Phase 7 Vercel adaptation` must:
- verify no `addons` or `apps/public-web` source drift from Phase 5A;
- build exact PostgreSQL and Vercel-target Odoo images;
- prove the Odoo image declares no persistent volume;
- wait for the full PostgreSQL/Fares initialization boundary, not merely socket readiness;
- create the shared HTTP-session table through a privileged bootstrap operation;
- prove the table is owned outside the application role, has no `PUBLIC` grants and grants the app only `SELECT, INSERT, UPDATE, DELETE` on that table;
- initialize and upgrade the seven production addons;
- prove the app database role remains non-superuser/non-createdb/non-createrole and database ownership stays outside the app role;
- configure database-backed attachments and create a synthetic binary attachment;
- authenticate through the real `/web/session/authenticate` route and persist the resulting Odoo session in PostgreSQL;
- destroy the Odoo container with no mounts and start a replacement instance;
- prove the same session cookie remains authenticated through `/web/session/get_session_info`;
- prove the binary attachment remains readable after runtime replacement;
- create a database-only logical backup, recreate the application database cleanly and restore it;
- reassert privileged session-table ownership/grants after restore without deleting restored session data;
- prove the same database marker, binary attachment and authenticated session survive the database-only restore.

No session cookie, synthetic password, database dump or plaintext secret may be retained in the uploaded evidence artifact.

## Still pending after this slice

Even if the state/session candidate is green, Phase 7 remains open until later evidence proves:
- Vercel-triggered cron/background execution with authentication, locking/idempotency and no immortal worker assumption;
- Odoo bus/WebSocket reconnect behavior across runtime lifecycle interruption;
- final Vercel service/project configuration syntax and routing/security boundary;
- inherited regression gates required by any runtime changes;
- commercial staging remains separately authorized before real resource/account mutation.

## Production boundary

No Vercel plan upgrade, Fares Vercel project, managed production database, production secret, domain/DNS change, real business data or production deployment is authorized by this hosted proof. Production remains **NO-GO**.
