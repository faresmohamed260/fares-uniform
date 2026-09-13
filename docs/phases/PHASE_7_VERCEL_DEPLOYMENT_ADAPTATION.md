# Phase 7 — Vercel deployment adaptation

Status: **COMPLETE / VERIFIED — repository/CI scope, 2026-09-13.**

Branch: `phase-7/vercel-deployment-adaptation`.

Final Phase 7 repository/CI authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Final runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited authoritative business-application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Inherited verified provider-neutral deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Authorization and boundary

After Phase 6 the client explicitly selected **Vercel**, following the same deployment direction used for RenderLab and SAGA. That decision supersedes the earlier Phase 6 single-VPS/Hetzner recommendation as the intended platform direction while preserving the verified Phase 6 provider-neutral package as a fallback/reference baseline.

Phase 7 authorization covered repository design, compatibility implementation and hosted synthetic CI proof only. It did **not** authorize a Vercel plan upgrade, paid/live Fares project, real Supabase/PostgreSQL resource, production secrets, domain/DNS changes, real-data migration or production cutover.

## Goal

Adapt the verified Fares Uniform runtime to Vercel's replaceable/stateless service model without weakening Odoo correctness, security, offline checkout behavior or recovery guarantees.

That goal is now met at repository/CI level.

## Final source-controlled topology

`vercel.json` defines three services using Vercel's current `services` schema:

1. **`public_web`** — Vercel-native Next.js rooted at `apps/public-web/`.
2. **`odoo_http`** — stateless Odoo container built from `Dockerfile.vercel`.
3. **`odoo_websocket`** — stateless evented Odoo container built from the same image.

Routing/bindings are deliberately narrow:
- `public_web` receives `ODOO_BASE_URL` through a private service binding to `odoo_http`;
- `/websocket` is the only public rewrite to `odoo_websocket`;
- `/fares/internal/cron/run` is the only public rewrite to `odoo_http`, and the route itself requires the server-side cron bearer secret;
- all other public traffic goes to `public_web`;
- broad Odoo backoffice routes and direct `/fu/public/**` exposure are not published by `vercel.json`;
- no inline project secrets are committed.

Vercel project environment variables are project-wide, so the HTTP/WebSocket distinction is not encoded as a project-wide `ODOO_RUNTIME_MODE`. Instead `odoo_websocket` receives the service-local binding marker `FARES_ODOO_HTTP_INTERNAL_URL`; `deploy/vercel/runtime-mode.sh` resolves WebSocket mode from that marker on Vercel while preserving explicit `ODOO_RUNTIME_MODE` overrides for CI/local proof.

## Durable-state model

Vercel application compute is treated as disposable. Correctness-critical truth is externalized to PostgreSQL:

- operational Odoo/Fares data remains in PostgreSQL;
- Odoo attachment binary truth uses native database-backed storage (`ir_attachment.location = db`);
- authenticated Odoo HTTP sessions use a shared PostgreSQL-backed server-side store;
- normal runtime instances perform no privileged session-schema DDL;
- built-in Odoo cron threads remain disabled;
- required scheduled work is invoked through the authenticated external trigger;
- evented/WebSocket state is reconnect-safe rather than instance-affine.

The proven Vercel-specific recovery authority is therefore database-backed application/attachment/session state plus exact Fares/Odoo/config authority. The Phase 6 PostgreSQL+filestore recovery package remains preserved for its filesystem-backed topology.

## Managed PostgreSQL target

**Supabase is the preferred managed PostgreSQL target for an authorized commercial staging deployment** because it is already part of the project's development stack. Phase 7 did not create or mutate a real Supabase resource.

Odoo must use PostgreSQL connectivity that preserves session semantics required by `LISTEN/NOTIFY`:
- direct PostgreSQL connection or Supavisor **session mode** is acceptable;
- Supavisor **transaction mode** is not suitable for Odoo bus/WebSocket behavior and must not be used;
- live Odoo connectivity must use TLS (`sslmode=require` at minimum; stronger certificate verification may be used when the CA chain is available);
- the project may retain an isolated `fares` database and least-privileged `fares_app` role rather than placing Odoo tables into Supabase's default managed schema.

Exact real endpoint, region, billing ownership, database creation and backup policy remain live-stage decisions.

## Verified slices

### Stateless state/session/recovery — GREEN

Initial GREEN proof:
- SHA `52bd809facb2a701e7d61db777ff018fa2f8778b`;
- workflow `Phase 7 Vercel adaptation`;
- run `34754781691`;
- job `103717216101`;
- artifact `10316318863`;
- digest `sha256:37bc11aff6d652b256e283a6ac9132c3ba11f023e4158da780d48ef4d9815191`.

Final runtime checkpoint re-proof:
- SHA `24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- run `34769858562`;
- job `103757345079`;
- artifact `10322245429`;
- digest `sha256:00da92b64a39a567a3383e02b6c443b891946bb69e51a494fa678f239003f22f`.

Proven: no durable Odoo volume, database-backed attachments, shared PostgreSQL sessions, complete runtime replacement continuity, least-privileged session-store access and database-only backup/clean-restore continuity.

### External cron/background execution — GREEN

Initial GREEN proof:
- SHA `8719a6f868813da1f7618200e7ad1036f2214b60`;
- run `34755578761`;
- job `103719261532`;
- artifact `10317405872`;
- digest `sha256:5fe902b2788bb35c7220a12f6add36a6544ef072a00bb20aaf4709c3474ae60c`.

Final runtime checkpoint re-proof:
- SHA `24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- run `34769858603`;
- job `103757345002`;
- artifact `10321293325`;
- digest `sha256:01593409ac06c49210bd6fa8b66de3de3cbdacca09f4e61727a5d67496bdc9bb`.

Proven: built-in cron disabled, unauthenticated/invalid requests rejected and concurrent authenticated trigger attempts execute the due synthetic job exactly once using native Odoo locking semantics.

### Realtime/WebSocket continuity — GREEN

First GREEN proof:
- SHA `ec7c2b7b6c7a67daeb5477a188e3acb081783075`;
- run `34767531559`;
- job `103751067780`;
- artifact `10320313179`;
- digest `sha256:9b974465b13e72fd75201600a14bcfb89172bffcc45f7cacecbf7a4b29e0d0aa`.

Final runtime checkpoint re-proof:
- SHA `24850acc029e0e7bbef898d6598d0d8b3f7ce733`;
- run `34769858556`;
- job `103757344998`;
- artifact `10321447830`;
- digest `sha256:011fe859cde5e9f1bf6014fd629162054f70070a22fc4a9687638659d8d566d5`.

Proven: authenticated first notification, complete evented-runtime destruction, publication while no evented runtime exists, fresh evented startup, reconnect using shared session/cursor state, replay of only the unseen second notification and no duplicate of the first.

### Final Vercel project mapping and public regression — GREEN

Final SHA `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Workflow `Phase 7 Vercel project configuration`, run `34770228476` — **SUCCESS**.

- `project-config-proof` job `103758364688` — live Vercel schema validation, exact service/routing exposure contract, service-local runtime-mode resolution and inherited application-authority diff all pass;
- project artifact `10322011069`, digest `sha256:6062aefe56ce0fb8fd633033b48f075e9cfbfe67eefb6626c09e53b91da72845`;
- `public-web-regression` job `103758364506` — locked install, typecheck, production build and Playwright browser gate pass;
- public-web artifact `10321902044`, digest `sha256:d2ac4b47173c334f1a61a55040d3b8d1a3056216664688e04b23a3b3ec7e9045`.

The only change from runtime checkpoint `24850acc...` to final SHA `01ce26d...` is the project-config CI workflow itself; no runtime, mapping, addon or public-web source changed. The GREEN runtime checkpoint therefore remains applicable to the final implementation while `01ce26d...` supplies the exact-head final mapping/public regression evidence.

Full RED/GREEN chronology, including the resolved WebSocket diagnostics and harness defects, is retained in `../validation/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

## Validation contract — result

All repository/CI acceptance criteria are met:

1. exact application/Odoo authority preserved — **PASS**;
2. Vercel-target Odoo image has no durable local-volume dependency — **PASS**;
3. database-backed attachment survives runtime replacement — **PASS**;
4. authenticated shared session survives runtime replacement — **PASS**;
5. scheduled work is external, authenticated and idempotent/exactly-once under the bounded proof — **PASS**;
6. realtime reconnect/replay across runtime interruption — **PASS**;
7. seven production addons install/upgrade on the adapted runtime — **PASS**;
8. final public-web typecheck/build/browser regression — **PASS**;
9. database-only backup/clean-restore recovers proven application/attachment/session state — **PASS**;
10. final Vercel service topology is live-schema-valid and minimally exposed — **PASS**;
11. no paid/live resource or real business data used — **PASS**.

## Exit state

**Phase 7 repository/CI scope: COMPLETE / VERIFIED.**

The project is technically ready for an **explicitly authorized commercial Vercel staging deployment with managed PostgreSQL**. This is not production GO.

Production remains **NO-GO** until commercial-plan authorization, actual Vercel/Supabase resources, secret/domain/access ownership, backup retention/RPO/RTO, monitoring, real store hardware acceptance, named staff/training, real-data cutover/reconciliation and launch timing are separately resolved and authorized.