# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PHASE 6 PROVIDER-NEUTRAL DEPLOYMENT/RESTORE VERIFIED; PHASE 7 VERCEL REPOSITORY/CI ADAPTATION COMPLETE / VERIFIED; PRODUCTION STILL NO-GO.**

Authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Verified Phase 7 implementation SHA: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Phase 7 final runtime checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

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
- [x] Deployment platform selected by client: **Vercel**, 2026-09-13.
- [x] Earlier Hetzner/single-VPS recommendation marked superseded rather than treated as a selected resource.
- [x] RenderLab/SAGA-style pattern adopted: Vercel application surface + managed durable backing services.
- [x] Preferred managed PostgreSQL family selected for the next authorized staging step: **Supabase**.
- [ ] Appropriate commercial Vercel plan explicitly authorized for Fares Uniform business staging/production.
- [ ] Actual Fares Uniform Vercel project/resource creation explicitly authorized.
- [ ] Actual Supabase project/database/region/billing ownership explicitly authorized.

The currently connected Vercel team is on Hobby. Fares Uniform is a commercial workload. Repository/CI proof is complete, but real commercial staging/production must not be placed on Hobby or created by inference.

### Phase 7 Vercel stateless adaptation
- [x] Vercel-target Odoo container starts without a durable local-volume dependency.
- [x] Provider-compatible PostgreSQL connection model and least-privileged application role are proven in hosted synthetic PostgreSQL; Supabase direct/session-mode compatibility is documented. **Actual Supabase connectivity remains a staging gate.**
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

### Durable state target
- [x] PostgreSQL remains authoritative operational persistence.
- [x] Vercel compute is treated as replaceable/stateless.
- [x] Database-backed attachment mode is proven for the Phase 7 topology.
- [x] Shared server-side session schema/store is proven.
- [x] Vercel-specific repository recovery authority is proven as database-backed application/attachment/session state + exact Fares/Odoo/config authority.
- [x] Supabase is the preferred managed PostgreSQL target for an authorized staging rehearsal.
- [ ] Actual Supabase resource created/authorized and real managed connection proven.
- [ ] Production backup frequency/retention selected.
- [ ] Production RPO/RTO explicitly decided.

The Phase 6 PostgreSQL+filestore recovery model remains preserved for its verified filesystem topology. Phase 7 proves the database-only Vercel topology in synthetic hosted CI; the first real managed-database staging rehearsal must independently verify backup/restore against the selected Supabase resource before production.

### Supabase connection rule
- [x] Odoo requires PostgreSQL session semantics for bus `LISTEN/NOTIFY`.
- [x] Direct PostgreSQL or Supavisor **session mode** is the accepted connection class.
- [x] Supavisor **transaction mode** is prohibited for Odoo.
- [x] Live managed connectivity requires TLS (`sslmode=require` at minimum).
- [x] Routine Odoo role remains least privileged; managed hosting does not justify superuser/createdb/createrole.
- [ ] Actual staging endpoint/region/credentials configured and tested after explicit authorization.

### Environments and secrets
- [ ] Commercial staging strategy/lifetime authorized.
- [ ] Production/staging separation confirmed in actual Vercel/Supabase resources.
- [ ] Secret owners and rotation process documented.
- [x] No broad Odoo/database credential belongs in public browser code.
- [x] Public-web integration remains the narrow Fares public API through a private Vercel service binding.
- [x] Repository deployment templates contain no production credentials.
- [ ] Vercel/Supabase/Cloudflare runtime credentials configured only after explicit live-resource authorization.

### Public web and routing
- [x] Platform direction is Vercel.
- [x] Source-controlled `vercel.json` defines `public_web`, `odoo_http` and `odoo_websocket` services.
- [x] Public web → Odoo HTTP is a private service binding through `ODOO_BASE_URL`.
- [x] `/websocket` is the only public evented-service rewrite.
- [x] `/fares/internal/cron/run` is the only public Odoo HTTP rewrite and the route is bearer-authenticated.
- [x] Broad Odoo backoffice and direct `/fu/public/**` rewrites are absent.
- [x] Final public web typecheck/build/browser gate is green.
- [ ] Actual Fares Uniform Vercel commercial project creation/staging deployment authorized.
- [ ] Domain/DNS/TLS/internal-access ownership decided and configured.
- [ ] Post-deployment EN/AR public smoke verification on the actual staging URL.

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
- [ ] Vercel/Odoo/database uptime and error monitoring selected.
- [ ] Log retention/privacy policy decided.
- [ ] Database backup/restore alerts have an owner.
- [ ] Public enquiry delivery/failure monitoring has an owner.
- [x] Repository process requires pinned Odoo and exact Fares application authority for update/upgrade evidence.

## Current architecture direction

Selected and repository-proven:
- public Next.js on Vercel;
- private stateless Odoo HTTP container service;
- separate stateless Odoo evented/WebSocket container service;
- managed external PostgreSQL target, with Supabase preferred for live staging;
- native database-backed attachments;
- shared PostgreSQL-backed sessions;
- authenticated external cron trigger with native Odoo locking;
- reconnect-safe realtime/bus behavior;
- no correctness-critical local filesystem state in Vercel compute;
- minimal public Vercel rewrite surface.

The earlier single-EU-VPS/Hetzner recommendation is historical and superseded but remains a verified fallback through the Phase 6 package.

## Go / no-go rule

**Phase 7 technical repository/CI state: GO for separately authorized commercial staging.**

**Current production state: NO-GO.**

There is no remaining Phase 7 repository engineering blocker. Remaining blockers are live/operational: commercial Vercel plan/project authorization, actual Supabase resource and managed-connection proof, secrets/domains/access, backup retention/RPO/RTO, monitoring/logging, store hardware, named staff/training, real-data cutover/reconciliation and launch timing.

A staging deployment is not authorized merely because technical readiness is green.

## Next actions allowed now

Without live-resource authorization:
1. preserve Phase 7 implementation authority `01ce26d...` and its evidence;
2. prepare a bounded commercial-staging plan/checklist covering Vercel plan/project ownership, Supabase project/database/region, connection mode, secrets/access, backups and monitoring;
3. keep production/device/staff/cutover decisions explicit rather than inventing them;
4. do not create or mutate paid/live resources, production secrets/domains/DNS or real data.

If the client explicitly authorizes commercial staging later, the first live stage must prove the actual Vercel↔Supabase connection using direct/session mode + TLS, bootstrap/migrations, attachment/session continuity, cron/WebSocket behavior, backup/restore, access controls, logs/monitoring and public EN/AR smoke behavior before production is considered.