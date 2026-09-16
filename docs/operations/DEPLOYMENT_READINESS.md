# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PHASE 6/7 VERIFIED; PHASE 8 GATE C LIVE STAGING GREEN; RELEASE INTEGRATED ON `main`; GATE D / PRODUCTION NO-GO.**

Authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Verified Phase 7 implementation SHA: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Phase 7 final runtime checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Phase 8 managed-database/runtime checkpoint: `b7a661bf70c2468b006bf971cba10172cf810e7d`.

Phase 8 Vercel control-plane checkpoint: `884aedc9465122d25639ca24954f154dfa72dc70`.

Current deployed staging application: `2a74e93b1828c16839ba7cede336caa4ca374306`.

Release integration merge: `29a6835f1e542119f50aa800ddec7fe57f1cf704`; current documented `main` checkpoint before this update: `c2a93d8d693f47ebc7b286af5eaebb485895d8c0`.

Native scheduled observability authority: run `35129331378`, job `104906119150`, GREEN.

## Readiness gates

### Application authority
- [x] Phase 5A exact-head application/test SHA recorded.
- [x] Inherited Phase 1–5 plus Phase 5A gate green: **149 tests, 0 failures, 0 errors**.
- [x] Seven production addons pass repeatable upgrade on the same database/SHA.
- [x] Public web `npm ci`, typecheck, production build and Playwright green: **8/8** at Phase 5A, with a fresh Phase 7 final-mapping regression also green.
- [x] No open release-candidate P0/P1/P2 defects.

### Phase 6 provider-neutral repository/CI proof
- [x] Reproducible PostgreSQL/Odoo/nginx deployment package committed.
- [x] Production-safe Odoo/proxy templates committed with no embedded secrets.
- [x] Runtime synthetic credentials excluded from rendered Compose evidence.
- [x] Database and Odoo filestore persistence separated from application image/container lifecycle.
- [x] PostgreSQL app role is non-superuser/non-createdb/non-createrole; database ownership remains `postgres`.
- [x] File-backed secret access proven with restrictive modes/ownership.
- [x] HTTPS edge, HTTP→HTTPS redirect and blocked database-management routes proven.
- [x] PostgreSQL/Odoo persistence survives application-container replacement.
- [x] Quiesced PostgreSQL + filestore backup with manifest/checksums is created and verified.
- [x] Incomplete/tampered backup set fails closed.
- [x] Destructive `down -v` clean-volume restore succeeds.
- [x] Restored database marker and stored attachment are verified through Odoo.
- [x] Fresh Odoo data-volume ownership is initialized to fixed non-root UID/GID `10001:10001` at the privileged operations boundary.

Final Phase 6 proof: SHA `e337315684c62d69ad75ba56a5867098da17489c`, run `34726690763`, job `103641932057`, artifact `10307809040`, digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`.

### Provider/platform selection
- [x] Deployment-platform direction selected by client: **Vercel**, 2026-09-13.
- [x] Earlier Hetzner/single-VPS recommendation marked superseded rather than treated as a selected resource.
- [x] RenderLab/SAGA-style direction adopted: replaceable application surface + managed durable backing services.
- [x] Managed PostgreSQL selected for Phase 8 staging: **Supabase**.
- [x] Client explicitly authorized new Fares Uniform staging resources on Vercel/Supabase under a hard **stay free** condition.
- [x] Actual Fares Uniform Supabase project/database/region established in an isolated dedicated project.
- [x] Actual isolated Fares Uniform Vercel project shell created in the authorized team.
- [x] Isolated free-tier staging application deployment is authorized and technically instantiated.
- [ ] Production application-hosting plan/provider path is suitable for commercial use and within an explicitly approved spending boundary.
- [ ] Production deployment is separately authorized.

The authorized Vercel team remains on **Hobby**. The isolated synthetic-data staging deployment is live and technically accepted under the explicit free-tier rehearsal authorization, but that does not establish a production-commercial hosting entitlement or spending approval. Gate D must select and authorize the production plan/path explicitly.

Current Vercel staging:
- project: `fares-uniform`;
- project id: `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`;
- team id: `team_r09C6RLmb2acHapENECQIn9T`;
- deployed application SHA: `2a74e93b1828c16839ba7cede336caa4ca374306`;
- exact READY deployment: `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg`;
- canonical staging: `https://fares-uniform.vercel.app`.

### Phase 7 Vercel stateless adaptation
- [x] Vercel-target Odoo container starts without a durable local-volume dependency.
- [x] Provider-compatible PostgreSQL connection model and least-privileged application role are proven in hosted synthetic PostgreSQL.
- [x] Odoo attachment truth survives runtime replacement using database-backed storage.
- [x] Authenticated Odoo session survives runtime replacement using a shared PostgreSQL-backed server-side store.
- [x] Required cron/background work is trigger-driven, authenticated, locked/idempotent and does not depend on an immortal worker.
- [x] Odoo bus/WebSocket client reconnect/replay survives evented-runtime destruction/replacement.
- [x] Seven production addons install/upgrade on the adapted runtime.
- [x] Inherited application source authority remains unchanged by Phase 7 deployment work.
- [x] Public web locked install/typecheck/build/Playwright is green under the final Vercel project mapping.
- [x] Database-backed state backup/clean-restore recovers application facts, attachment content and intended recoverable session state.
- [x] Vercel project configuration validates against the live provider schema and enforces minimal public exposure.
- [x] Phase 7 hosted evidence is green and recorded.

Final Phase 7 runtime checkpoint `24850acc029e0e7bbef898d6598d0d8b3f7ce733`:
- state/session/recovery run `34769858562`, job `103757345079`, artifact `10322245429`, digest `sha256:00da92b64a39a567a3383e02b6c443b891946bb69e51a494fa678f239003f22f`;
- cron run `34769858603`, job `103757345002`, artifact `10321293325`, digest `sha256:01593409ac06c49210bd6fa8b66de3de3cbdacca09f4e61727a5d67496bdc9bb`;
- WebSocket run `34769858556`, job `103757344998`, artifact `10321447830`, digest `sha256:011fe859cde5e9f1bf6014fd629162054f70070a22fc4a9687638659d8d566d5`;
- project config run `34769858553` — success.

Final Phase 7 implementation `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`:
- project/public workflow run `34770228476` — success;
- project-config job `103758364688`, artifact `10322011069`, digest `sha256:6062aefe56ce0fb8fd633033b48f075e9cfbfe67eefb6626c09e53b91da72845`;
- public-web job `103758364506`, artifact `10321902044`, digest `sha256:d2ac4b47173c334f1a61a55040d3b8d1a3056216664688e04b23a3b3ec7e9045`.

Only the project-config CI workflow changed between `24850acc...` and `01ce26d...`; runtime/config/addon/public-web source did not.

### Phase 8A live Supabase proof
- [x] Dedicated Fares Uniform Supabase project exists and is `ACTIVE_HEALTHY`.
- [x] Region recorded as `eu-central-1`.
- [x] Application database is the dedicated project's provider-managed `postgres` database.
- [x] `fares_app` bootstrap role boundary is source-controlled and idempotent.
- [x] `fares_app` is non-superuser/non-createdb/non-createrole/non-replication/noinherit.
- [x] Shared `public.fares_http_session` table exists with public DML revoked and required application DML only.
- [x] `unaccent` and `pg_trgm` are installed.
- [x] Exact runtime image reaches real Supavisor **Session Pooler** on `5432` with `sslmode=require`.
- [x] Supavisor dotted connection username is supported without weakening database-name validation.
- [x] Staging `fares_app` login/runtime credential activated through the sealed runtime path; values remain secret.
- [x] Managed backup/export and destructive restore completed only against a disposable recovery target: run `35068971581`, job `104705729018`.

Authoritative live managed-database/runtime proof: commit `b7a661bf70c2468b006bf971cba10172cf810e7d`, run `34787677724`, job `103806024323` — **SUCCESS**.

### Phase 8A live Vercel control plane
- [x] Repository secret `VERCEL_TOKEN` is configured and masked in Actions.
- [x] Exact team id/slug verified before mutation.
- [x] Existing `studio`, `saga` and `renderlab` projects verified and preserved.
- [x] No pre-existing `fares-uniform` project was present before controlled creation.
- [x] Only `fares-uniform` project shell created.
- [x] Resulting project ownership matches exact authorized team.
- [x] Project shell verified with zero deployments.
- [ ] Git repository linked; intentionally deferred to avoid unintended deployment before plan/provider compliance is resolved.
- [x] Staging runtime environment injected through the bounded secret path.
- [x] Isolated synthetic-data staging deployment completed and Gate C accepted; this is not production authorization.

Authoritative Vercel control-plane proof: commit `884aedc9465122d25639ca24954f154dfa72dc70`, run `34788971298`, job `103809533700` — **SUCCESS**.

The client reported the current Vercel token has full-account control. That is broader than the desired steady-state credential. Exact team/project assertions are therefore mandatory now; once setup no longer needs account-wide project creation, replace it with the narrowest project/team-scoped token that supports required env/deployment operations, prove it in CI, then revoke the broad token.

### Durable state target
- [x] PostgreSQL remains authoritative operational persistence.
- [x] Replaceable/stateless application compute remains the architecture rule.
- [x] Database-backed attachment mode is proven for the Phase 7 topology.
- [x] Shared server-side session schema/store is proven.
- [x] Vercel-specific repository recovery authority is proven as database-backed application/attachment/session state + exact Fares/Odoo/config authority.
- [x] Supabase is the selected managed PostgreSQL target for the authorized staging rehearsal.
- [x] Actual Supabase resource created and real managed Session Pooler connection proven.
- [x] Managed staging backup/export + isolated destructive restore rehearsal completed without restoring over the populated source.
- [ ] Production backup frequency/retention selected.
- [ ] Production RPO/RTO explicitly decided.

The Phase 6 PostgreSQL+filestore recovery model remains preserved for its verified filesystem topology. Phase 7 proves the database-only stateless topology in synthetic hosted CI; Phase 8 must independently prove managed backup/restore against the live Supabase resource before production.

### Supabase connection rule
- [x] Odoo requires PostgreSQL session semantics for bus `LISTEN/NOTIFY`.
- [x] Direct PostgreSQL or Supavisor **session mode** is the accepted connection class.
- [x] Supavisor **transaction mode** is prohibited for Odoo.
- [x] Live managed connectivity requires TLS (`sslmode=require` at minimum).
- [x] Routine Odoo role remains least privileged; managed hosting does not justify superuser/createdb/createrole.
- [x] Actual staging endpoint/region/provider connection class tested through exact runtime image.
- [x] Staging runtime credential activated atomically with the application host and retained behind the least-privilege seal.
- [ ] Production runtime credential and custody/rotation ownership separately approved.

### Environments and secrets
- [x] Live staging rehearsal authorized under the explicit `$0` spending boundary.
- [x] No-value staging secret inventory created at `docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md`.
- [x] Control-plane token custody/rotation procedures documented.
- [x] Runtime DB/Odoo/cron secret names, purpose, injection and rotation rules documented without values.
- [x] No broad Odoo/database credential belongs in public browser code.
- [x] Public-web integration remains the narrow Fares public API through a private service binding in the accepted Vercel topology.
- [x] Repository deployment templates contain no production credentials.
- [x] `SUPABASE_ACCESS_TOKEN` and `VERCEL_TOKEN` control-plane credentials are configured as GitHub Actions repository secrets and proven without exposure.
- [x] Staging `ODOO_DB_PASSWORD`, `ODOO_ADMIN_PASSWD` and `CRON_SECRET` are injected without values in source/logs and proven by hosted checks.
- [ ] Production equivalents, custodians and rotation window explicitly approved.
- [ ] Production/staging separation confirmed in actual deployed application environments.

### Public web and routing
- [x] Source-controlled `vercel.json` defines `public_web`, `odoo_http` and `odoo_websocket` services.
- [x] Public web → Odoo HTTP is a private service binding through `ODOO_BASE_URL` in the accepted topology.
- [x] `/websocket` is the only public evented-service rewrite.
- [x] `/fares/internal/cron/run` is the only public Odoo HTTP rewrite and the route is bearer-authenticated.
- [x] Broad Odoo backoffice and direct `/fu/public/**` rewrites are absent.
- [x] Final public web typecheck/build/browser gate is green.
- [x] Isolated Fares Uniform Vercel project shell created and owned by the authorized team.
- [x] Authorized isolated free-tier staging deployment exists; it is not production hosting approval.
- [ ] Production domain/DNS/TLS/internal-access ownership decided and configured.
- [x] Post-deployment EN/AR public smoke verification passed on the actual staging URL.

### Repository and production release controls
- [x] Default Actions token permission is read-only; Actions cannot approve pull requests.
- [x] Secret scanning and push protection are enabled.
- [x] Read-only audit found zero open Dependabot, code-scanning and secret-scanning alerts.
- [ ] `main` protection/ruleset policy approved and applied; currently none exists.
- [ ] Required pull-request checks/review count and bypass policy approved.
- [ ] Protected GitHub `production` environment created with an approved reviewer role and `main`-only deployment policy; currently no environments exist.
- [ ] Dependabot security-update policy approved; automatic security updates are currently disabled.
- [ ] Production deployment workflow proves an ordinary push cannot deploy without the approved environment gate.

See [Gate D release-control plan](GATE_D_RELEASE_CONTROL_PLAN.md). No repository protection or environment setting was changed by the audit.

Client direction on 2026-09-16: do not apply the proposed branch protection, Dependabot or production-environment changes. GD-10 is deferred/not approved and remains a production NO-GO condition.
### Store/device compatibility
- [ ] Actual checkout computer/browser validated.
- [ ] Scanner capability validated without brand-specific application assumptions.
- [ ] Printer/receipt/label capability and physical dimensions validated.
- [ ] IndexedDB/offline persistence checked on the real checkout browser/device.
- [ ] Power/network outage operating procedure communicated to staff.

### Staff and onboarding
- [ ] Named real staff accounts prepared; no shared admin for routine work.
- [ ] Final role/location assignments approved.
- [ ] Owner/manager/cashier/inventory/production/sales training completed for relevant workflows.
- [ ] Recovery/escalation owner identified for sync/payment/stock discrepancies.

### Data cutover
- [ ] Real product master/variants/sizes/codes reviewed before import/entry.
- [ ] Opening-stock count method and responsible people decided.
- [ ] Existing open preorders/business orders/balances reconciliation method decided.
- [ ] Cutover snapshot/reconciliation sign-off defined.
- [ ] Real-data migration separately authorized.

### Observability and operations
- [x] Staging public/Odoo health, Vercel runtime-error/HTTP-5xx, database-seal, cron and recovery monitoring is active twice hourly on `main`.
- [x] Native scheduled authority run `35129331378`, job `104906119150`, passed at exact source `c2a93d8d693f47ebc7b286af5eaebb485895d8c0`.
- [x] Cron backlog/failure and long idle-in-transaction visibility is established without executing or rescheduling ordinary jobs.
- [ ] Named production monitoring owner and recipients recorded privately.
- [ ] Production severity thresholds, coverage hours and escalation procedure approved.
- [ ] Managed backup/restore failure owner and escalation path approved.
- [ ] Public enquiry delivery/failure owner and escalation path approved.
- [ ] Production log/alert retention and privacy policy decided.
- [x] Repository process requires pinned Odoo and exact Fares application authority for update/upgrade evidence.

## Current architecture direction

Repository-proven target properties:
- public Next.js surface;
- private/stateless Odoo HTTP service;
- separate stateless Odoo evented/WebSocket service;
- managed Supabase PostgreSQL through session semantics + TLS;
- native database-backed attachments;
- shared PostgreSQL-backed sessions;
- authenticated external cron trigger with native Odoo locking;
- reconnect-safe realtime/bus behavior;
- no correctness-critical local filesystem state;
- minimal public Odoo routing.

Vercel remains the selected direction in the repository, but the actual application deployment is paused because the user's hard free-only constraint and the current Hobby commercial-use boundary cannot both be satisfied. A provider change must be explicit and must preserve the above properties rather than silently reverting architecture.

The earlier single-EU-VPS/Hetzner recommendation is historical and superseded but remains a verified fallback through the Phase 6 package.

## Go / no-go rule

**Phase 7 technical repository/CI state: PASS.**

**Phase 8 Gate C isolated staging state: PASS.** Live Supabase/Vercel staging, application deployment, privilege seal, public/no-leak behavior, continuity, cron locking, WebSocket replay, recovery, monitoring and production-model synthetic UAT are GREEN.

**Release integration state: COMPLETE on `main`.**

**Current production state: NO-GO.**

There is no known application or Gate C engineering blocker. Remaining work is Gate D policy and real-world acceptance: production-suitable hosting/spending, device validation, named staff/training, data cutover/reconciliation, production domains/access/secrets, backup retention/RPO/RTO, named monitoring recipients/escalation, retention/privacy and explicit production GO.

## Next actions allowed now

1. Preserve the integrated application and staging evidence; do not delete phase branches without explicit authorization.
2. Use `docs/operations/GATE_D_DECISION_REGISTER.md` to collect the unresolved production decisions without putting staff names, secrets or real customer/business data in GitHub.
3. Reversible repository/CI preparation is complete. Further work requires an explicit Gate D choice or private/physical acceptance evidence.
4. Do not purchase a production plan, create production resources, activate production secrets, migrate real data, change DNS/domains or cut over by inference.
5. Do not run, disable, postpone or drain the known ordinary-cron backlog merely to obtain proof.

Production remains **NO-GO** until every required Gate D decision/evidence item is explicitly resolved and the client gives a separate production GO.
