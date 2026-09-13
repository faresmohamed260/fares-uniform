# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PHASE 6 PROVIDER-NEUTRAL DEPLOYMENT/RESTORE PROOF COMPLETE / VERIFIED; VERCEL SELECTED; PHASE 7 VERCEL ADAPTATION ACTIVE; PRODUCTION STILL NO-GO.**

Authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Active Phase 7 contract: `../phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

## Readiness gates

### Application authority
- [x] Phase 5A exact-head application/test SHA recorded.
- [x] Inherited Phase 1–5 plus Phase 5A gate green: **149 tests, 0 failures, 0 errors**.
- [x] Seven production addons pass repeatable upgrade on the same database/SHA.
- [x] Public web `npm ci`, typecheck, production build and Playwright green: **8/8**.
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

Final Phase 6 proof:
- SHA `e337315684c62d69ad75ba56a5867098da17489c`;
- run `34726690763`;
- job `103641932057` — success;
- artifact `10307809040`, `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`;
- digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`.

See `../validation/PHASE_6_DEPLOYMENT_READINESS.md` for full RED-to-green chronology.

### Provider/platform selection
- [x] Deployment platform selected by client: **Vercel**, 2026-09-13.
- [x] Earlier Hetzner/single-VPS recommendation marked superseded rather than treated as a selected resource.
- [x] Existing RenderLab/SAGA deployment pattern used as the operating analogy: Vercel application surface + managed durable backing services.
- [ ] Appropriate commercial Vercel plan explicitly authorized for Fares Uniform business staging/production.
- [ ] Fares Uniform Vercel project/resource creation explicitly authorized.

The currently connected Vercel team is on Hobby. Repository/CI work can continue without changing it, but real commercial staging/production must not be placed on Hobby by inference.

### Phase 7 Vercel stateless adaptation
- [ ] Vercel-target Odoo container/service starts without a durable local volume dependency.
- [ ] Managed external PostgreSQL connection model is proven with least-privileged Odoo credentials.
- [ ] Odoo attachment truth survives runtime replacement using database-backed storage for the first proof.
- [ ] Authenticated Odoo session survives runtime replacement using a shared server-side session store.
- [ ] Required cron/background work is trigger-driven, authenticated, locked/idempotent and does not depend on an immortal worker.
- [ ] Odoo bus/WebSocket clients reconnect safely across runtime lifecycle interruption.
- [ ] Seven production addons install/upgrade on the adapted runtime.
- [ ] Inherited application tests remain green after any runtime compatibility changes.
- [ ] Public web typecheck/build/8 Playwright remain green if deployment config affects it.
- [ ] Database-backed state backup/restore recovers application facts and stored attachment content.
- [ ] Phase 7 exact-head hosted evidence is green and recorded.

### Durable state target
- [x] PostgreSQL remains authoritative operational persistence.
- [x] Vercel compute is treated as replaceable/stateless.
- [ ] Managed PostgreSQL provider/resource selected and authorized. **Supabase is the preferred first candidate, not yet created.**
- [ ] Database-backed attachment mode fully proven for the required Odoo/Fares attachment paths.
- [ ] Shared server-side session schema/store fully proven.
- [ ] Vercel-native recovery authority formally changed from PostgreSQL+filestore to database-only only after Phase 7 destructive proof.
- [ ] Production backup frequency/retention selected.
- [ ] Production RPO/RTO explicitly decided.

The Phase 6 PostgreSQL+filestore recovery model remains authoritative for its verified filesystem topology until Phase 7 proves that the Vercel topology no longer requires a filestore.

### Environments and secrets
- [ ] Commercial staging strategy/lifetime authorized.
- [ ] Production/staging separation confirmed in actual Vercel/backing-service resources.
- [ ] Secret owners and rotation process documented.
- [x] No broad Odoo/database credential belongs in the public browser.
- [x] Application integration remains the narrow Fares public API contract.
- [x] Repository deployment templates contain no production credentials.
- [ ] Vercel/Supabase/Cloudflare runtime credentials configured only after explicit live-resource authorization.

### Public web
- [x] Platform direction is Vercel.
- [ ] Actual Fares Uniform Vercel project creation/production deployment authorized.
- [ ] Production private-Odoo/public-API origin and server-side credential strategy configured.
- [ ] Domain/DNS/TLS ownership decided and configured.
- [x] Post-deployment EN/AR public smoke verification remains required.

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

See `../architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md` and `../phases/PHASE_7_VERCEL_DEPLOYMENT_ADAPTATION.md`.

Selected direction:
- public Next.js on Vercel;
- private Odoo evaluated as a Vercel container/Service;
- managed external PostgreSQL, with Supabase preferred for the first proof;
- native database-backed Odoo attachments for the first stateless proof;
- shared server-side sessions instead of local filesystem sessions;
- Vercel Cron/Workflows/Queues for trigger-driven scheduled/background work where required;
- reconnect-safe realtime/bus behavior;
- no correctness-critical local filesystem state in Vercel compute.

The earlier single-EU-VPS/Hetzner recommendation is historical and superseded. It remains a fallback because the Phase 6 package for that topology is already proven, but it is not the current client-selected direction.

## Go / no-go rule

Current production state: **NO-GO**.

Application/UAT/localization blockers are closed and the provider-neutral recovery package is proven. Vercel is selected. The remaining technical blocker is the Phase 7 stateless Odoo compatibility proof. The remaining live blockers include commercial-plan authorization, actual managed state resources, secrets/domains/access, hardware, staff, cutover, monitoring, backup policy and launch ownership.

A green Phase 7 repository/CI result will mean **technically ready for explicitly authorized Vercel commercial staging**, not production GO.

## Rollback/recovery baseline

Until Phase 7 proves the database-only Vercel recovery model, preserve the Phase 6 ability to:
- restore a consistent PostgreSQL database + matching Odoo filestore pair;
- start exact Fares/Odoo application authority;
- verify stored attachment truth after destructive replacement.

If Phase 7 proves all attachment and shared-session durable truth lives in managed PostgreSQL, the Vercel-specific restore authority may be simplified to a managed PostgreSQL backup plus exact application/Odoo/config metadata. That change requires exact-head evidence, not assumption.

## Next actions allowed now

Without live-resource authorization, continue with:
1. stateless runtime adapter design/implementation;
2. DB-backed attachment proof;
3. shared Odoo session-store proof;
4. trigger-driven cron/background proof;
5. WebSocket/bus reconnect proof;
6. exact-head hosted CI with synthetic data and runtime replacement;
7. inherited regression gates as required;
8. Phase 7 evidence documentation.

Do **not** upgrade Vercel, create paid staging/production resources, create a real managed database, configure production secrets/domains/DNS, or import real business data until separately authorized.