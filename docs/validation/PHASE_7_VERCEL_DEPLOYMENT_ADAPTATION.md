# Phase 7 Vercel deployment-adaptation validation

Status: **ACTIVE — durable state/session/recovery GREEN; external cron GREEN; WebSocket continuity GREEN; final Vercel service/routing/security configuration pending.**

Branch: `phase-7/vercel-deployment-adaptation`.

Latest verified WebSocket implementation SHA: `ec7c2b7b6c7a67daeb5477a188e3acb081783075`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Phase 7 is not complete. This document records exact hosted evidence and preserves failed candidates as RED evidence rather than rewriting history.

## Slice A — stateless durable state, sessions and database-only recovery

The first Phase 7 slice removes correctness-critical local-disk persistence from the Vercel-target Odoo runtime:

1. Odoo binary attachments use native database storage (`ir_attachment.location = db`) rather than a mounted filestore.
2. Odoo HTTP sessions use a deployment-only PostgreSQL session store rather than `data_dir/sessions`.
3. The Vercel-target image declares no persistent Docker volume and uses disposable `/tmp` runtime state.
4. Shared-session infrastructure is provisioned at a privileged bootstrap boundary; normal stateless runtimes perform no session-schema DDL.
5. Database-only backup/recreate/restore is sufficient for the proven attachment + shared-session topology.

The candidate runtime preserves exact Odoo pinning, the seven production addons, fixed non-root runtime UID/GID `10001:10001`, `workers = 0`, disabled built-in Odoo cron threads and runtime HTTP port derivation from `PORT`.

### RED A1 — runtime session DDL and bootstrap race

Candidate `599ea8ab9e8c4c3b9c928285dd1e6a37b9e2e148`.

Workflow `Phase 7 Vercel adaptation`, run `34728347979`, job `103646452349`: **RED / NON-AUTHORITATIVE**.

The workflow passed exact-head checkout, inherited application-source authority, synthetic credential generation, image builds, no-persistent-volume checks and initial PostgreSQL least-privilege checks. It then failed when the deployment-only server-wide adapter attempted `CREATE TABLE IF NOT EXISTS fares_http_session (...)` through the routine `fares_app` connection during `post_load`; PostgreSQL rejected runtime DDL with `psycopg2.errors.InsufficientPrivilege`.

The failure also proved that a `pg_isready`-only gate could run ahead of full Fares database bootstrap. The correction moved shared-session schema creation/ownership to an explicit privileged bootstrap operation and made hosted CI wait for that complete boundary.

### RED A2 — deployment-addon manifest boolean type mismatch

Candidate `d67d9a16d39ee10f5cf0c93a0c98a61ad757d685` passed the corrected database/session boundary but failed while initializing production addons.

Temporary diagnostic commits retained exact evidence:
- `150a6a03d91194fcd25bbb29363148dd3a51f2ef` — retain addon-init failure evidence;
- `5025b8d245fe6447d43e0f5128cf0104c159ff1d` — capture install and upgrade diagnostics.

Diagnostic artifact `10316896344`, digest `sha256:fe0c19b346aa1d5aa289e092f5abd8967b438b4dca65aa8c19516f5fe6fbdf4b`, showed Odoo 19 inserting integer `0` for deployment-addon manifest boolean fields and PostgreSQL rejecting that value for `application`. Candidate `52bd809facb2a701e7d61db777ff018fa2f8778b` replaced those manifest values with Python `False` booleans. The resolved temporary init-diagnostic workflow was later removed; its historical evidence remains authoritative for the RED chronology.

### GREEN A — exact-head stateless state/session/recovery proof

Implementation SHA: `52bd809facb2a701e7d61db777ff018fa2f8778b`.

Workflow `Phase 7 Vercel adaptation`:
- run `34754781691` — **SUCCESS**;
- job `103717216101` — **SUCCESS**;
- artifact `10316318863` — `phase7-vercel-52bd809facb2a701e7d61db777ff018fa2f8778b`;
- digest `sha256:37bc11aff6d652b256e283a6ac9132c3ba11f023e4158da780d48ef4d9815191`.

Hosted evidence establishes:
- inherited business/public application source unchanged;
- seven production addons install and repeatable upgrade PASS;
- no declared persistent Odoo volume and fixed non-root runtime;
- native database-backed attachments with synthetic binary continuity;
- PostgreSQL-backed authenticated Odoo sessions;
- shared session table owned by `postgres`, no `PUBLIC` grants and only `DELETE, INSERT, SELECT, UPDATE` for the routine app role;
- app role remains `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`;
- replacement Odoo runtime with no mounts preserves session and attachment truth;
- database-only logical backup, clean recreation and restore preserve application state, attachment content and authenticated session;
- built-in Odoo cron threads remain disabled.

Slice A is **GREEN / VERIFIED**.

## Slice B — authenticated external cron/background execution

The Vercel-target runtime must not depend on an immortal Odoo scheduler process. Phase 7 therefore adds a deployment-only authenticated trigger that invokes Odoo's native due-job processing while built-in cron threads remain disabled.

Relevant implementation chain:
- `612e84279be83aa1b9339d15a3f93aab9930ba0d` — authenticated Vercel cron trigger;
- `6583ca672503a4f32f28b2f1b4751886887e45d5` — external cron fixture;
- `963de48c4c044fcf94fbf5715aa1c905647c08d0` — exactly-once verifier;
- `a5b8d737a7ebb52e00c1b012c0006ba35aad5193` — runtime controller registration;
- `8719a6f868813da1f7618200e7ad1036f2214b60` — exact-head proof candidate.

The deployment-only `fares_vercel_runtime` trigger authenticates a server-side bearer secret, uses the fixed configured database and delegates due-job acquisition/execution to pinned Odoo `ir.cron`, retaining Odoo's locking / `SKIP LOCKED` behavior.

### GREEN B — exact-head cron proof

Implementation SHA: `8719a6f868813da1f7618200e7ad1036f2214b60`.

Workflow `Phase 7 Vercel cron trigger`:
- run `34755578761` — **SUCCESS**;
- job `103719261532` — **SUCCESS**;
- artifact `10317405872` — `phase7-vercel-cron-8719a6f868813da1f7618200e7ad1036f2214b60`;
- digest `sha256:5fe902b2788bb35c7220a12f6add36a6544ef072a00bb20aaf4709c3474ae60c`.

Hosted evidence proves exact-head source authority, shared-session bootstrap, production-addon install/upgrade, two stateless runtimes with built-in cron disabled, no spontaneous execution without an external trigger, rejection of unauthenticated/invalid triggers and exactly-once mutation under two concurrent authenticated trigger requests.

Slice B is **GREEN / VERIFIED**.

## Slice C — Odoo bus/WebSocket continuity across runtime replacement

The realtime proof is deliberately stronger than a health check: an authenticated client must receive a notification, the evented runtime must be destroyed, a second notification must be committed while that service is absent, then a fresh evented runtime must accept a reconnect using the shared session/cursor and replay only unseen notification state.

Implementation/scaffolding chain:
- `44b129a4a74754665025a8079b14d67c91bbc504` — evented WebSocket runtime mode in `deploy/vercel/entrypoint.sh`;
- `bb5c85d49b3ae01d74d557b352fe7a8cf59a1273` — WebSocket continuity client;
- `4288ed5b9b310c6f72b4f1b1adeff5d0ce68ed9e` — synthetic notification sender;
- `8cc397a66d93f65fb892b171a90e3a8468a49396` — replacement-continuity workflow;
- `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32` — initial startup diagnostics;
- `fcb811f947aa74c0370fd82b83bc0e01e962f07b` — explicit Odoo `bus` install/upgrade;
- `0592b9524239992d91e6b5ac609dd7e01aaba52e` — post-`bus` startup diagnostics;
- `d11354b16f229d4a89b7a415964ee18e5328a926` — database-selected readiness probe;
- `ec7c2b7b6c7a67daeb5477a188e3acb081783075` — sender-stdin correction and GREEN proof.

### RED C1 — diagnostic workflow disproved an evented-startup failure

Initial diagnostic commit `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32`, workflow `Phase 7 websocket startup diagnostics`, run `34762055023`, job `103736500596`, artifact `10319296739`, digest `sha256:ebf065dccd4ed92bd5704129c4074a2db4a5938b99a92ceb720952aaa527e308` intentionally failed only after retaining evidence.

A stronger diagnostic at `0592b9524239992d91e6b5ac609dd7e01aaba52e`, run `34764766048`, job `103743665977`, artifact `10319859719`, digest `sha256:cec5483ea2929326f985f8245bb8a6429138e98ead04617d6dd9338a8ce1f325`, proved:
- Odoo `bus` is installed;
- the registry loads successfully;
- the gevent process remains healthy and reports `Evented Service (longpolling) running on 0.0.0.0:8069`;
- the apparent readiness failure is a database-selection error, not a gevent startup exception;
- `/websocket/health` without a database selector returns Odoo's explicit `No database is selected` response.

The correction was therefore to send `X-Odoo-Database: fares` on the readiness probe, not to alter Odoo/gevent runtime behavior.

### RED C2 — database-selected readiness exposed a sender harness defect

Candidate `d11354b16f229d4a89b7a415964ee18e5328a926`.

Workflow `Phase 7 Vercel websocket continuity`:
- run `34765161001` — **FAILURE**;
- job `103744717213` — **FAILURE**;
- artifact `10320790746`;
- digest `sha256:0cddb9b826f0a38d162f17dfbcec0161819142b15c9a2407ed58fb71a36184ae`.

This candidate passed the image, PostgreSQL/session boundary, seven production addons plus `bus`, authenticated HTTP session and evented WebSocket service startup. It then failed waiting for the first notification. `websocket-first-send.txt` was empty while the client timed out.

Inspection showed both workflow sender commands redirected `deploy/ci/phase7_websocket_send.py` into `docker exec` without `-i`. Docker therefore did not keep stdin attached, so the Python sender body never reached `odoo-bin shell`. No application, Odoo, bus-channel or database-permission change was justified by the evidence.

### GREEN C — exact-head replacement/reconnect/replay proof

Implementation SHA: `ec7c2b7b6c7a67daeb5477a188e3acb081783075`.

The only behavioral change from the prior RED harness is `docker exec -i` on both notification-sender invocations.

Workflow `Phase 7 Vercel websocket continuity`:
- run `34767531559` — **SUCCESS**;
- job `103751067780` — **SUCCESS**;
- artifact `10320313179` — `phase7-vercel-websocket-ec7c2b7b6c7a67daeb5477a188e3acb081783075`;
- digest `sha256:9b974465b13e72fd75201600a14bcfb89172bffcc45f7cacecbf7a4b29e0d0aa`.

Every acceptance-critical step is GREEN:
- exact candidate checkout and inherited application-source authority;
- exact database and dual-mode Odoo image build;
- PostgreSQL/shared-session bootstrap;
- seven production addons plus Odoo `bus` install/upgrade;
- authenticated shared HTTP session creation;
- stateless evented WebSocket service readiness on its own service port;
- first authenticated WebSocket notification received;
- evented runtime completely destroyed;
- second notification committed while no WebSocket runtime exists;
- fresh evented runtime started with no mounts;
- client reconnects with the same shared session and last-notification cursor;
- second unseen notification is replayed after reconnect;
- first notification is not duplicated;
- HTTP authenticated session remains valid after evented-runtime replacement;
- built-in Odoo cron threads remain disabled.

Slice C is **GREEN / VERIFIED**. The temporary startup-diagnostic workflow is no longer required and may now be removed; its historical runs/artifacts above remain the preserved RED evidence.

## Managed PostgreSQL / Supabase compatibility facts

Supabase remains the preferred managed PostgreSQL candidate for the live Vercel topology, without authorizing a live resource mutation in this phase.

Current provider facts checked 2026-09-13:
- Supabase is full PostgreSQL and supports normal PostgreSQL client connections;
- Odoo bus depends on session-level PostgreSQL behavior including `LISTEN/NOTIFY`;
- Supabase direct connections and Supavisor **session mode** preserve session semantics; Supavisor **transaction mode** does not preserve `LISTEN/NOTIFY` and therefore must not be used for Odoo;
- session-pooler connections use port `5432`; transaction pooling uses `6543`;
- live Odoo configuration must require TLS (`sslmode=require` at minimum; certificate verification can be tightened where the deployment supplies the CA chain);
- a Supabase project can technically host an additional PostgreSQL database such as `fares`; such additional databases are used as ordinary PostgreSQL databases and are not managed by Supabase Dashboard/Auth/PostgREST integrations.

This lets the intended topology retain an isolated `fares` application database and the routine least-privileged `fares_app` role instead of placing Odoo tables into the default Supabase-managed `postgres` schema. A real staging/production project/database remains separately authorized work.

Official references checked:
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI
- https://supabase.com/docs/guides/troubleshooting/manually-created-databases-are-not-visible-in-the-supabase-dashboard-4415aa

## Remaining Phase 7 gates after WebSocket recovery

Realtime is no longer the blocker. Remaining repository/CI work is:
1. remove `.github/workflows/phase7-diagnose-websocket.yml` now that its RED history is preserved here;
2. finish the source-controlled Vercel Services/project mapping using the current `services` schema rather than the superseded `experimentalServices` form;
3. prove private service bindings/routing and minimal public exposure, including the authenticated cron path and browser-required WebSocket path;
4. encode the HTTP/WebSocket runtime distinction without relying on unsupported per-service environment overrides — current Vercel service configuration maps ordinary environment variables at project scope;
5. preserve the public Next.js server-side narrow API integration using an internal service binding rather than exposing broad Odoo/database credentials to browser code;
6. use Supabase direct or session-mode PostgreSQL connectivity, never transaction pooling, when a real managed resource is later authorized;
7. rerun already-green state/session and cron gates if final runtime/configuration changes can affect them;
8. rerun inherited application/public regression gates if final platform changes can affect application/public behavior;
9. update exact final SHA/run/job/artifact evidence and then evaluate Phase 7 exit criteria.

Current Vercel references checked 2026-09-13:
- https://vercel.com/kb/guide/vercel-services
- https://vercel.com/i/can-you-run-docker-compose-on-vercel
- https://vercel.com/changelog/secure-internal-communication-between-services
- https://openapi.vercel.sh/vercel.json

## Production boundary

No Vercel plan upgrade, paid Fares Vercel project/resource, managed production database, production secret, domain/DNS change, real business data or production deployment is authorized by these hosted proofs. Production remains **NO-GO** until separately authorized commercial staging and later operational launch gates are satisfied.
