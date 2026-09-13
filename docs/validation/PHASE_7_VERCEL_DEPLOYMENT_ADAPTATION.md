# Phase 7 Vercel deployment-adaptation validation

Status: **ACTIVE — durable state/session/recovery GREEN; external cron GREEN; WebSocket continuity RED / active blocker.**

Branch: `phase-7/vercel-deployment-adaptation`.

Latest implementation HEAD before this documentation checkpoint: `fcb811f947aa74c0370fd82b83bc0e01e962f07b`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited provider-neutral deployment-package authority: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Phase 7 is not complete. This document records the exact hosted evidence accumulated so far and preserves failed candidates as RED evidence rather than rewriting history.

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

Passed before failure:
- exact-head checkout;
- Phase 5A source-authority/no-diff check for `addons` and `apps/public-web`;
- synthetic credential generation;
- exact PostgreSQL and Vercel-target Odoo image builds;
- no declared persistent volume in the Vercel-target Odoo image;
- initial PostgreSQL start and least-privileged role/database-owner checks.

Failure occurred when the deployment-only server-wide runtime adapter attempted `CREATE TABLE IF NOT EXISTS fares_http_session (...)` through the normal `fares_app` application connection during `post_load`. PostgreSQL rejected that runtime DDL with `psycopg2.errors.InsufficientPrivilege: permission denied for schema public` in that execution window.

The failure also exposed that a `pg_isready`-only CI gate can report socket readiness before the Fares database bootstrap has fully completed. The correction moved shared-session schema creation/ownership to an explicit privileged bootstrap operation and made hosted CI wait for the full application bootstrap boundary.

The normal application role still retains the schema capability required for Odoo addon installation/upgrades; the narrower security boundary is that shared HTTP-session infrastructure is not created by every runtime instance.

### RED A2 — deployment-addon manifest boolean type mismatch

Candidate `d67d9a16d39ee10f5cf0c93a0c98a61ad757d685` moved the session schema to the privileged bootstrap boundary and passed that database/session boundary, but the main workflow still failed while initializing the production addons.

Temporary diagnostic commits preserved the exact addon cycle:
- `150a6a03d91194fcd25bbb29363148dd3a51f2ef` — retain addon-init failure evidence;
- `5025b8d245fe6447d43e0f5128cf0104c159ff1d` — capture install and upgrade diagnostics.

Diagnostic artifact:
- ID `10316896344`;
- digest `sha256:fe0c19b346aa1d5aa289e092f5abd8967b438b4dca65aa8c19516f5fe6fbdf4b`.

The retained install log showed Odoo 19 inserting the deployment-only runtime addon manifest into `ir_module_module` with integer `0` values for boolean fields. PostgreSQL rejected integer `0` for the boolean `application` column with `psycopg2.errors.DatatypeMismatch`.

This was a deployment-addon manifest bug, not a production business-addon or database-privilege defect. Candidate `52bd809facb2a701e7d61db777ff018fa2f8778b` replaced those manifest values with actual Python `False` booleans.

The resolved temporary init-diagnostic workflow was later removed at commit `0ca744f7e5404e4d4dfa248a067d3bd44ff1261c`; its historical runs/artifacts remain part of the RED chronology.

### GREEN A — exact-head stateless state/session/recovery proof

Implementation SHA: `52bd809facb2a701e7d61db777ff018fa2f8778b`.

Workflow `Phase 7 Vercel adaptation`:
- run `34754781691` — **SUCCESS**;
- job `103717216101` — **SUCCESS**;
- artifact `10316318863` — `phase7-vercel-52bd809facb2a701e7d61db777ff018fa2f8778b`;
- digest `sha256:37bc11aff6d652b256e283a6ac9132c3ba11f023e4158da780d48ef4d9815191`.

Exact hosted evidence established:
- `application_source_diff=none` for inherited business/public source authority;
- seven production addons install and repeatable upgrade PASS;
- Vercel-target Odoo image declares no persistent volume;
- fixed non-root runtime;
- `ir_attachment.location = db` and synthetic binary attachment stored in the database;
- shared authenticated Odoo HTTP session stored in PostgreSQL;
- `public.fares_http_session` owned by `postgres`;
- no `PUBLIC` grants on the shared session table;
- app role receives only `DELETE, INSERT, SELECT, UPDATE` on that table;
- app role remains `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`;
- session runtime DDL is disabled;
- replacement Odoo runtime with no mounts preserves the authenticated session and attachment;
- database-only logical backup, clean database recreation and restore preserve application state, attachment content and authenticated session;
- the privileged session-table ownership/grants boundary can be reasserted after restore without deleting restored session data;
- built-in Odoo cron threads are disabled (`0`).

This slice is **GREEN / VERIFIED** and does not need to be redesigned unless a later change can affect it.

## Slice B — authenticated external cron/background execution

The Vercel-target runtime must not depend on an immortal Odoo scheduler process. Phase 7 therefore adds a deployment-only authenticated trigger that invokes Odoo's native due-job processing while built-in cron threads remain disabled.

Relevant implementation/test chain:
- `612e84279be83aa1b9339d15a3f93aab9930ba0d` — authenticated Vercel cron trigger;
- `6583ca672503a4f32f28b2f1b4751886887e45d5` — external cron fixture;
- `963de48c4c044fcf94fbf5715aa1c905647c08d0` — exactly-once verifier;
- `a5b8d737a7ebb52e00c1b012c0006ba35aad5193` — runtime controller registration;
- `8719a6f868813da1f7618200e7ad1036f2214b60` — exact-head hosted proof candidate.

The implementation uses the deployment-only `fares_vercel_runtime` layer rather than modifying business addons. The trigger authenticates a server-side bearer secret, uses a fixed configured database rather than request-selected database input and delegates due-job acquisition/execution to Odoo's native `ir.cron` machinery, whose pinned implementation uses row locking / `SKIP LOCKED` semantics.

### GREEN B — exact-head cron proof

Implementation SHA: `8719a6f868813da1f7618200e7ad1036f2214b60`.

Workflow `Phase 7 Vercel cron trigger`:
- run `34755578761` — **SUCCESS**;
- job `103719261532` — **SUCCESS**;
- artifact `10317405872` — `phase7-vercel-cron-8719a6f868813da1f7618200e7ad1036f2214b60`;
- digest `sha256:5fe902b2788bb35c7220a12f6add36a6544ef072a00bb20aaf4709c3474ae60c`.

Hosted steps prove:
- exact-head checkout and inherited application-source authority;
- exact PostgreSQL and Vercel-target Odoo images;
- shared-session bootstrap and production-addon install/upgrade remain green;
- two stateless Odoo runtimes start with built-in cron disabled;
- one synthetic due cron remains unexecuted in the absence of an external trigger, proving no immortal scheduler dependency;
- unauthenticated and invalid trigger requests are rejected;
- two concurrent authenticated trigger requests execute the due synthetic cron **exactly once**;
- evidence is retained without secrets.

This slice is **GREEN / VERIFIED**.

## Slice C — Odoo bus/WebSocket continuity across runtime replacement

The remaining active runtime blocker is the realtime/bus slice. The intended proof is stricter than a health check: an authenticated client must receive a notification, the evented runtime must be destroyed/replaced, a notification must be published while that runtime is absent, then the client must reconnect using shared session/cursor state and receive only unseen notification state according to the proven contract.

Implementation/scaffolding added after the cron proof includes:
- `44b129a4a74754665025a8079b14d67c91bbc504` — evented WebSocket runtime mode in `deploy/vercel/entrypoint.sh`;
- `bb5c85d49b3ae01d74d557b352fe7a8cf59a1273` — WebSocket continuity client;
- `4288ed5b9b310c6f72b4f1b1adeff5d0ce68ed9e` — synthetic WebSocket notification sender;
- `8cc397a66d93f65fb892b171a90e3a8468a49396` — hosted WebSocket replacement-continuity workflow;
- `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32` — temporary startup diagnostics workflow;
- `fcb811f947aa74c0370fd82b83bc0e01e962f07b` — explicit install/upgrade of Odoo `bus` for the realtime proof.

### RED C1 — preserved evented-startup diagnostic

Diagnostic commit: `8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32`.

Workflow `Phase 7 websocket startup diagnostics`:
- run `34762055023` — **FAILURE BY DESIGN AFTER PRESERVING RED EVIDENCE**;
- job `103736500596`;
- artifact `10319296739` — `phase7-websocket-startup-diagnostics-8c1f70bcf45f748f6baf4c7a16b7b2bf37690f32`;
- digest `sha256:ebf065dccd4ed92bd5704129c4074a2db4a5938b99a92ceb720952aaa527e308`.

The diagnostic workflow reproduces the evented runtime startup, captures container logs/inspect state and `/websocket/health` reachability, uploads that evidence and only then fails the workflow. The temporary workflow `.github/workflows/phase7-diagnose-websocket.yml` intentionally remains on the active branch while this blocker is unresolved.

The next implementation session must inspect this retained artifact/raw job evidence before changing the runtime. Do not infer or invent an exception from the workflow status alone.

### RED C2 — explicit `bus` installation is insufficient

Current implementation candidate before this documentation checkpoint: `fcb811f947aa74c0370fd82b83bc0e01e962f07b`.

Workflow `Phase 7 Vercel websocket continuity`:
- run `34762496143` — **FAILURE**;
- job `103737654226` — **FAILURE**;
- artifact `10319751894` — `phase7-vercel-websocket-fcb811f947aa74c0370fd82b83bc0e01e962f07b`;
- digest `sha256:1a48d06872914fef024e68fdaa68d421218f67f6bb1f5bb2b2ca4dc439cbf8ff`.

The following steps pass at this exact SHA:
- exact-head checkout;
- inherited application-source authority;
- synthetic credentials;
- exact database and dual-mode Odoo image build;
- PostgreSQL and shared-session bootstrap;
- **initialization and upgrade of the seven production addons plus Odoo `bus`**;
- normal HTTP runtime startup and creation of a shared authenticated session.

The first failing step is:

**`Start evented websocket service on its Vercel service port`**.

Therefore `bus` not being installed is no longer a viable explanation for the current failure. The authenticated notification, runtime replacement, absent-runtime publication and reconnect/replay gates are skipped and remain unproven.

This slice remains **RED / ACTIVE BLOCKER**. Phase 7 must not be called complete or Vercel-ready until this exact issue is fixed and the intended continuity proof is green.

## Remaining Phase 7 gates after WebSocket recovery

After the realtime slice is green:
1. remove the temporary `.github/workflows/phase7-diagnose-websocket.yml` workflow while preserving its RED run/artifact references here;
2. verify the exact current Vercel Services/project configuration schema immediately before committing final platform configuration;
3. add/prove final private-service routing and security boundaries, including the authenticated cron route and minimal required Odoo exposure;
4. rerun the already-green state/session and cron gates if later runtime/configuration changes can affect them;
5. rerun inherited application/public regression gates if final platform changes can affect application/public behavior;
6. update exact implementation SHA/run/job/artifact evidence and only then evaluate Phase 7 exit criteria.

## Production boundary

No Vercel plan upgrade, paid Fares Vercel project/resource, managed production database, production secret, domain/DNS change, real business data or production deployment is authorized by these hosted proofs. The connected team remains a development/research context only for this phase. Production remains **NO-GO** until separately authorized commercial staging and all later operational launch gates are satisfied.
