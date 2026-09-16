# Phase 7 Vercel deployment-adaptation validation

Status: **COMPLETE / VERIFIED — repository/CI scope green; commercial staging and production remain separately unauthorized.**

Branch: `phase-7/vercel-deployment-adaptation`.

Final Phase 7 repository/CI authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Final runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Phase 7 repository/CI scope is complete. This document preserves exact hosted RED/GREEN chronology rather than rewriting failed candidates as green history. No Vercel plan upgrade, paid/live Fares project, real Supabase database, production secret, domain/DNS change, real business data, or production deployment was created by this phase.

## Slice A — stateless durable state, sessions and database-only recovery

The Vercel-target runtime removes correctness-critical local-disk persistence:

1. Odoo binary attachments use native database storage (`ir_attachment.location = db`) rather than a mounted filestore.
2. Odoo HTTP sessions use a deployment-only PostgreSQL session store rather than `data_dir/sessions`.
3. The Vercel-target image declares no persistent Docker volume and uses disposable `/tmp` runtime state.
4. Shared-session infrastructure is provisioned at a privileged bootstrap boundary; routine stateless runtimes perform no session-schema DDL.
5. Database-only backup/recreate/restore is sufficient for the proven attachment + shared-session topology.

The runtime preserves exact Odoo pinning, the seven production addons, fixed non-root UID/GID `10001:10001`, `workers = 0`, disabled built-in Odoo cron threads and runtime port derivation from `PORT`.

### RED A1 — runtime session DDL and bootstrap race

Candidate `599ea8ab9e8c4c3b9c928285dd1e6a37b9e2e148`.

Workflow `Phase 7 Vercel adaptation`, run `34728347979`, job `103646452349`: **RED / NON-AUTHORITATIVE**.

The workflow passed exact-head checkout, inherited application-source authority, synthetic credentials, image builds, no-persistent-volume checks and initial PostgreSQL least-privilege checks. It then failed when the deployment-only server-wide adapter attempted `CREATE TABLE IF NOT EXISTS fares_http_session (...)` through the routine `fares_app` connection during `post_load`; PostgreSQL rejected runtime DDL with `psycopg2.errors.InsufficientPrivilege`.

The same failure exposed that a `pg_isready`-only gate could run ahead of full Fares database bootstrap. The correction moved shared-session schema creation/ownership to an explicit privileged bootstrap operation and made hosted CI wait for that complete boundary.

### RED A2 — deployment-addon manifest boolean type mismatch

Candidate `d67d9a16d39ee10f5cf0c93a0c98a61ad757d685` passed the corrected database/session boundary but failed while initializing production addons.

Temporary diagnostic commits retained exact evidence:
- `150a6a03d91194fcd25bbb29363148dd3a51f2ef` — retain addon-init failure evidence;
- `5025b8d245fe6447d43e0f5128cf0104c159ff1d` — capture install and upgrade diagnostics.

Diagnostic artifact `10316896344`, digest `sha256:fe0c19b346aa1d5aa289e092f5abd8967b438b4dca65aa8c19516f5fe6fbdf4b`, showed Odoo 19 inserting integer `0` for deployment-addon manifest boolean fields and PostgreSQL rejecting that value for `application`. Candidate `52bd809facb2a701e7d61db777ff018fa2f8778b` replaced those manifest values with Python `False` booleans. The temporary init-diagnostic workflow was later removed; its historical evidence remains authoritative for the RED chronology.

### GREEN A — stateless state/session/recovery proof

Initial implementation proof SHA: `52bd809facb2a701e7d61db777ff018fa2f8778b`.

Workflow `Phase 7 Vercel adaptation`:
- run `34754781691` — **SUCCESS**;
- job `103717216101` — **SUCCESS**;
- artifact `10316318863` — `phase7-vercel-52bd809facb2a701e7d61db777ff018fa2f8778b`;
- digest `sha256:37bc11aff6d652b256e283a6ac9132c3ba11f023e4158da780d48ef4d9815191`.

That hosted proof established inherited application source unchanged, seven production addons install/repeatable upgrade, no declared persistent Odoo volume, database-backed attachments, PostgreSQL-backed authenticated sessions, least-privileged shared-session DML, runtime replacement continuity, database-only backup/recreate/restore continuity, and built-in Odoo cron disabled.

After final runtime-mode/project changes, Slice A was re-run at checkpoint `24850acc029e0e7bbef898d6598d0d8b3f7ce733`:
- workflow `Phase 7 Vercel adaptation`;
- run `34769858562` — **SUCCESS**;
- job `103757345079` — **SUCCESS**;
- artifact `10322245429` — `phase7-vercel-24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- digest `sha256:00da92b64a39a567a3383e02b6c443b891946bb69e51a494fa678f239003f22f`.

Every state/session/recovery step remained green after the final runtime changes. Slice A is **GREEN / VERIFIED**.

## Slice B — authenticated external cron/background execution

The Vercel-target runtime does not depend on an immortal Odoo scheduler. The deployment-only `fares_vercel_runtime` trigger authenticates a server-side bearer secret, fixes database selection and delegates due-job acquisition/execution to pinned Odoo `ir.cron`, retaining native locking / `SKIP LOCKED` behavior.

Relevant implementation chain:
- `612e84279be83aa1b9339d15a3f93aab9930ba0d` — authenticated Vercel cron trigger;
- `6583ca672503a4f32f28b2f1b4751886887e45d5` — external cron fixture;
- `963de48c4c044fcf94fbf5715aa1c905647c08d0` — exactly-once verifier;
- `a5b8d737a7ebb52e00c1b012c0006ba35aad5193` — runtime controller registration;
- `8719a6f868813da1f7618200e7ad1036f2214b60` — initial GREEN proof.

### GREEN B — cron proof

Initial proof at `8719a6f868813da1f7618200e7ad1036f2214b60`:
- run `34755578761` — **SUCCESS**;
- job `103719261532` — **SUCCESS**;
- artifact `10317405872` — `phase7-vercel-cron-8719a6f868813da1f7618200e7ad1036f2214b60`;
- digest `sha256:5fe902b2788bb35c7220a12f6add36a6544ef072a00bb20aaf4709c3474ae60c`.

After final runtime-mode/project changes, the exact runtime checkpoint `24850acc029e0e7bbef898d6598d0d8b3f7ce733` also passed:
- workflow `Phase 7 Vercel cron trigger`;
- run `34769858603` — **SUCCESS**;
- job `103757345002` — **SUCCESS**;
- artifact `10321293325` — `phase7-vercel-cron-24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- digest `sha256:01593409ac06c49210bd6fa8b66de3de3cbdacca09f4e61727a5d67496bdc9bb`.

Hosted evidence proves built-in cron remains disabled, a due job does not execute without the external trigger, unauthenticated/invalid requests are rejected, and concurrent authenticated requests execute the due synthetic job exactly once. Slice B is **GREEN / VERIFIED**.

## Slice C — Odoo bus/WebSocket continuity across runtime replacement

The realtime proof is stronger than a health check: an authenticated client receives a notification, the evented runtime is destroyed, a second notification is committed while that service is absent, then a fresh evented runtime accepts a reconnect using shared session/cursor state and replays only unseen notification state.

Implementation/scaffolding chain:
- `44b129a4a74754665025a8079b14d67c91bbc504` — evented WebSocket runtime mode;
- `bb5c85d49b3ae01d74d557b352fe7a8cf59a1273` — continuity client;
- `4288ed5b9b310c6f72b4f1b1adeff5d0ce68ed9e` — synthetic sender;
- `8cc397a66d93f65fb892b171a90e3a8468a49396` — replacement-continuity workflow;
- `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32` — initial startup diagnostics;
- `fcb811f947aa74c0370fd82b83bc0e01e962f07b` — explicit Odoo `bus` install/upgrade;
- `0592b9524239992d91e6b5ac609dd7e01aaba52e` — post-`bus` diagnostics;
- `d11354b16f229d4a89b7a415964ee18e5328a926` — database-selected readiness probe;
- `ec7c2b7b6c7a67daeb5477a188e3acb081783075` — sender-stdin correction and first GREEN proof.

### RED C1 — diagnostics disproved an evented-startup failure

Initial diagnostic commit `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32`, run `34762055023`, job `103736500596`, artifact `10319296739`, digest `sha256:ebf065dccd4ed92bd5704129c4074a2db4a5938b99a92ceb720952aaa527e308`, intentionally failed only after retaining evidence.

A stronger diagnostic at `0592b9524239992d91e6b5ac609dd7e01aaba52e`, run `34764766048`, job `103743665977`, artifact `10319859719`, digest `sha256:cec5483ea2929326f985f8245bb8a6429138e98ead04617d6dd9338a8ce1f325`, proved Odoo `bus` was installed, the registry loaded, gevent stayed healthy and the apparent readiness failure was only missing database selection. `/websocket/health` without a database selector returned Odoo's explicit `No database is selected` response.

The correction was `X-Odoo-Database: fares` on readiness probes, not an Odoo/gevent runtime change.

### RED C2 — database-selected readiness exposed a sender harness defect

Candidate `d11354b16f229d4a89b7a415964ee18e5328a926`:
- run `34765161001` — **FAILURE**;
- job `103744717213` — **FAILURE**;
- artifact `10320790746`;
- digest `sha256:0cddb9b826f0a38d162f17dfbcec0161819142b15c9a2407ed58fb71a36184ae`.

This candidate passed image, PostgreSQL/session, seven production addons + `bus`, authenticated HTTP session and evented startup, then timed out waiting for the first notification. `websocket-first-send.txt` was empty. Both sender commands redirected the Python sender into `docker exec` without `-i`, so stdin never reached `odoo-bin shell`. No application, Odoo, bus-channel or database-permission change was justified.

### GREEN C — replacement/reconnect/replay proof

First GREEN implementation SHA: `ec7c2b7b6c7a67daeb5477a188e3acb081783075`.

The only change from the prior RED harness was `docker exec -i` on both notification-sender invocations.

Workflow `Phase 7 Vercel websocket continuity`:
- run `34767531559` — **SUCCESS**;
- job `103751067780` — **SUCCESS**;
- artifact `10320313179` — `phase7-vercel-websocket-ec7c2b7b6c7a67daeb5477a188e3acb081783075`;
- digest `sha256:9b974465b13e72fd75201600a14bcfb89172bffcc45f7cacecbf7a4b29e0d0aa`.

After the final service/runtime-mode changes, checkpoint `24850acc029e0e7bbef898d6598d0d8b3f7ce733` re-proved the full continuity contract:
- run `34769858556` — **SUCCESS**;
- job `103757344998` — **SUCCESS**;
- artifact `10321447830` — `phase7-vercel-websocket-24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- digest `sha256:011fe859cde5e9f1bf6014fd629162054f70070a22fc4a9687638659d8d566d5`.

The checkpoint proves first authenticated delivery, complete evented-runtime destruction, publication while absent, fresh evented startup, same shared-session/cursor reconnect, replay of only the unseen notification, no duplicate of the first notification, and continued authenticated HTTP session validity. Slice C is **GREEN / VERIFIED**.

The temporary diagnostic workflow was removed after the first GREEN proof; its historical runs/artifacts above remain preserved.

## Slice D — final Vercel project/service mapping and public regression

The final repository topology is source-controlled in `vercel.json` using the current `services` schema:

- `public_web`: Vercel-native Next.js rooted at `apps/public-web/`;
- `odoo_http`: stateless container service from `Dockerfile.vercel`;
- `odoo_websocket`: stateless evented container service from the same image;
- `public_web` receives `ODOO_BASE_URL` through a private service binding to `odoo_http`;
- `odoo_websocket` receives a service-local binding marker `FARES_ODOO_HTTP_INTERNAL_URL`; `deploy/vercel/runtime-mode.sh` resolves that service to WebSocket mode without relying on unsupported per-service project environment overrides;
- public rewrite `/websocket` targets only `odoo_websocket`;
- public rewrite `/fares/internal/cron/run` targets only `odoo_http`, where the route itself requires the server-side bearer secret;
- catch-all traffic targets `public_web`;
- broad Odoo HTTP/backoffice and direct `/fu/public/**` exposure are deliberately absent;
- no project-inline secrets or Supabase transaction-pool marker (`6543`) are committed.

`deploy/ci/phase7_verify_vercel_project.py` enforces this exact exposure contract and the CI workflow validates `vercel.json` against Vercel's live schema document before running the semantic assertions.

### GREEN D1 — final runtime/config checkpoint

Checkpoint SHA: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

All four runtime/config workflows triggered on the same candidate and completed successfully:
- `Phase 7 Vercel project configuration` run `34769858553` — **SUCCESS**;
- `Phase 7 Vercel adaptation` run `34769858562` — **SUCCESS**;
- `Phase 7 Vercel cron trigger` run `34769858603` — **SUCCESS**;
- `Phase 7 Vercel websocket continuity` run `34769858556` — **SUCCESS**.

This checkpoint is the final runtime-sensitive authority because the only subsequent source change was to the project-config CI workflow itself.

### GREEN D2 — exact-head final mapping + public web

Final Phase 7 SHA: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Workflow `Phase 7 Vercel project configuration`, run `34770228476`: **SUCCESS**.

Jobs:
- `public-web-regression` job `103758364506` — **SUCCESS**: locked install, typecheck, production build and Playwright browser gate all passed under the final project mapping;
- `project-config-proof` job `103758364688` — **SUCCESS**: live Vercel schema validation, exact service binding/exposure assertions, service-local runtime-mode resolution and application-authority diff all passed.

Artifacts:
- project evidence `10322011069`, `phase7-vercel-project-01ce26d3ef0e16f53aa941b6b5e2318cf797e995`, digest `sha256:6062aefe56ce0fb8fd633033b48f075e9cfbfe67eefb6626c09e53b91da72845`;
- public-web evidence `10321902044`, `phase7-public-web-01ce26d3ef0e16f53aa941b6b5e2318cf797e995`, digest `sha256:d2ac4b47173c334f1a61a55040d3b8d1a3056216664688e04b23a3b3ec7e9045`.

`git diff` from runtime checkpoint `24850acc...` to final SHA `01ce26d...` changes only `.github/workflows/phase7-vercel-project-config.yml`; no runtime, Vercel mapping, business addon or public-web source changed after the runtime checkpoint. Therefore the four GREEN runtime proofs at `24850acc...` remain applicable to the final repository implementation while `01ce26d...` supplies the exact-head mapping/public-web proof.

Slice D is **GREEN / VERIFIED**.

## Managed PostgreSQL / Supabase compatibility facts

Supabase is the preferred managed PostgreSQL target for authorized Vercel staging/production because it is already part of the project's development stack. This phase does not create or mutate a real Supabase database.

Provider facts checked 2026-09-13:
- Supabase is PostgreSQL and supports ordinary PostgreSQL client connections;
- Odoo bus depends on session-level PostgreSQL behavior including `LISTEN/NOTIFY`;
- Supabase direct connections and Supavisor **session mode** preserve session semantics; Supavisor **transaction mode** must not be used for Odoo;
- live Odoo configuration must use TLS (`sslmode=require` at minimum; stronger certificate verification may be used when the deployment supplies the CA chain);
- an isolated application database such as `fares` can be retained as an ordinary PostgreSQL database, preserving the project model rather than mixing Odoo tables into Supabase's default managed schema.

The routine Odoo role remains least-privileged; moving PostgreSQL to Supabase is not permission to grant superuser/createdb/createrole. A real database, region, billing owner, connection endpoint and backup policy remain live-stage decisions.

Official references checked:
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI
- https://supabase.com/docs/guides/troubleshooting/manually-created-databases-are-not-visible-in-the-supabase-dashboard-4415aa

Vercel references checked 2026-09-13:
- https://vercel.com/kb/guide/vercel-services
- https://vercel.com/i/can-you-run-docker-compose-on-vercel
- https://vercel.com/changelog/secure-internal-communication-between-services
- https://openapi.vercel.sh/vercel.json

## Phase 7 exit evaluation

Repository/CI acceptance criteria are met:
1. exact Fares application and Odoo authority are preserved;
2. the Vercel-target Odoo image has no durable local-volume dependency;
3. database-backed attachments survive complete runtime replacement;
4. authenticated session state survives runtime replacement in PostgreSQL;
5. scheduled work is externally triggered, authenticated and exactly-once under concurrent trigger proof;
6. realtime clients reconnect safely and replay only unseen notification state across evented-runtime destruction;
7. seven production addons install/upgrade successfully on the adapted runtime;
8. final public-web typecheck/build/browser regression is green;
9. database-only backup/clean-restore recovers the proven application/attachment/session state;
10. the final Vercel service mapping is schema-valid, minimally exposed and source-controlled;
11. no paid/live resource or real business data was used.

**Phase 7 repository/CI result: COMPLETE / VERIFIED.**

This means the codebase is technically ready for a separately authorized **commercial Vercel staging deployment** with a managed PostgreSQL backing service. It does **not** mean production GO.

## Production boundary

Production remains **NO-GO** until separately resolved/authorized items include an appropriate commercial Vercel plan and project ownership, actual Supabase/PostgreSQL resource and region, runtime secrets, domain/DNS/TLS/internal access, backup retention/RPO/RTO, monitoring/log ownership, actual store browser/scanner/printer acceptance, named staff/training, real data migration/cutover/reconciliation and launch timing.