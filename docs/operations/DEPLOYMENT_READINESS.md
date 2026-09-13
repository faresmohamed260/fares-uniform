# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PHASE 6 PROVIDER-NEUTRAL DEPLOYMENT/RESTORE PROOF COMPLETE / VERIFIED; PRODUCTION DEPLOYMENT STILL NO-GO PENDING OPERATOR-SPECIFIC DECISIONS.**

Authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Verified Phase 6 deployment-package SHA: `e337315684c62d69ad75ba56a5867098da17489c`.

Phase 5/5A proved integrated MVP release-readiness and closed the documented Arabic launch-quality finding. Phase 6 has now proved the provider-neutral deployment, persistence, security, backup and clean-restore mechanics in hosted CI with synthetic data only. This does not authorize or constitute a live deployment.

## Readiness gates

### Application authority
- [x] Phase 5A exact-head application/test SHA recorded.
- [x] Inherited Phase 1–5 plus Phase 5A gate green: **149 tests, 0 failures, 0 errors**.
- [x] Seven production addons pass repeatable upgrade on the same database/SHA.
- [x] Public web `npm ci`, typecheck, production build and Playwright green: **8/8**.
- [x] No open release-candidate P0/P1/P2 defects.

### Phase 6 repository/CI proof
- [x] Phase 6 contract defines a no-live-resource boundary.
- [x] Provider comparison/topology recommendation documented without selecting a provider.
- [x] Reproducible provider-neutral PostgreSQL/Odoo/nginx deployment package committed.
- [x] Production-safe Odoo/proxy configuration templates committed with no embedded secrets.
- [x] Runtime synthetic credentials generated during CI and excluded from rendered Compose evidence.
- [x] Database and Odoo filestore persistence separated from application image/container lifecycle.
- [x] PostgreSQL application role initialized as non-superuser/non-createdb/non-createrole; database ownership remains `postgres`.
- [x] File-backed secret access proven with restrictive modes/ownership.
- [x] HTTPS edge, HTTP→HTTPS redirect and blocked database-management routes proven.
- [x] PostgreSQL/Odoo persistence survives application-container replacement.
- [x] Quiesced PostgreSQL + filestore backup set with manifest/checksums is created and verified.
- [x] Incomplete backup set fails closed.
- [x] Destructive `down -v` clean-volume restore succeeds.
- [x] Restored database marker and stored attachment are verified through Odoo.
- [x] Fresh Odoo data-volume ownership is initialized to fixed non-root UID/GID `10001:10001` by the privileged operations restore boundary.
- [x] Phase 6 exact-head validation evidence is green and recorded.

Final exact-head proof:
- deployment-package SHA `e337315684c62d69ad75ba56a5867098da17489c`;
- workflow `Phase 6 deployment readiness`;
- run `34726690763`;
- job `103641932057` — success;
- artifact `10307809040`, `phase6-deployment-e337315684c62d69ad75ba56a5867098da17489c`;
- digest `sha256:4367f4fd3085aa38b6381ef9cca0168bef0951b7e2d63cce67cd5b390fb0ae38`.

See `../validation/PHASE_6_DEPLOYMENT_READINESS.md` for the full RED-to-green chronology and exact evidence.

### Odoo persistence — production/operator decisions
- [ ] Production Odoo hosting/provider explicitly selected.
- [ ] Provider region explicitly selected.
- [ ] Initial server size and budget ceiling accepted.
- [ ] PostgreSQL persistence ownership documented for selected provider.
- [ ] Odoo filestore persistence ownership documented for selected provider.
- [ ] Provider-native backup/snapshot choice accepted as secondary recovery layer.
- [ ] Off-host S3-compatible backup target/bucket ownership selected.
- [ ] Production backup schedule/retention selected.
- [ ] Production RPO/RTO explicitly decided.
- [ ] Provider-specific restore procedure rehearsed against authorized non-production infrastructure.

### Environments and secrets
- [ ] Paid staging strategy/lifetime explicitly selected.
- [ ] Production/staging separation confirmed for selected architecture.
- [ ] Secret owners and rotation process documented.
- [x] No broad Odoo/database credential belongs in the public browser.
- [x] Application integration remains the narrow Fares public API contract.
- [x] Provider-neutral repository package uses file-backed runtime secrets and avoids committed production credentials.
- [ ] Provider/Vercel/Cloudflare runtime credentials configured only after explicit live-resource authorization.

### Public web
- [ ] Vercel production project/resource choice explicitly approved.
- [ ] Production Odoo public endpoint origin and server-side credential strategy decided.
- [ ] Domain/DNS/TLS ownership decided.
- [x] Post-deployment EN/AR public smoke verification is required; exact live endpoint remains undecided.

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
- [ ] Basic uptime/error/log monitoring selected.
- [ ] Log retention/privacy policy decided.
- [ ] Backup/restore alerts have an owner.
- [ ] Public enquiry delivery/failure monitoring has an owner.
- [x] Repository process requires pinned Odoo and exact Fares application authority for update/upgrade evidence.

## Verified provider-neutral recovery baseline

The Phase 6 CI rehearsal proves the operational mechanics expected from a future Linux host:
1. build exact PostgreSQL/Odoo/ops images from the recorded Fares SHA and pinned Odoo SHA;
2. start PostgreSQL with the restricted application role and database owned by `postgres`;
3. run Odoo as fixed non-root UID/GID `10001:10001` behind nginx;
4. block database-manager routes and expose only the proxy edge;
5. stop Odoo before consistency-critical backup capture;
6. create a manifest-bound `database.dump` + `filestore.tar.gz` backup set with checksums;
7. verify the complete set before restore;
8. reject incomplete/tampered sets;
9. restore only into a clean database/filestore target;
10. skip ownership/comment metadata that would improperly require application-role ownership of PostgreSQL extensions while retaining least privilege;
11. initialize fresh Odoo volume roots to the fixed runtime UID/GID at the privileged operations boundary;
12. restore archived numeric filestore ownership;
13. start non-root Odoo and verify the database marker plus stored attachment through the application.

Provider-native VM snapshots remain a secondary layer only. The application-aware database+filestore set is the recovery authority.

## Current architecture recommendation — not a provider decision

See `../architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md`.

Current recommendation remains an initial single x86-64 EU Linux VPS for private Odoo + PostgreSQL + persistent filestore, reverse proxy/TLS, coordinated database+filestore backup sets copied off-host to S3-compatible object storage, and Vercel remaining the separate public Next.js host.

Dated official pricing/capability research on 2026-09-12 favored Hetzner Cloud for cost/value, with DigitalOcean as the principal alternative and Render as a materially more expensive split-state option. **This is still a recommendation only; no provider/resource is selected.**

## Latest application proof

Phase 5A workflow `Phase 5A Arabic polish`, run `34700625051`:
- Odoo/UAT job `103571619120`: success, 149 tests / 0 failures / 0 errors, seven-production-addon repeatable upgrade success;
- Odoo artifact `10300402418`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`;
- public job `103571619062`: success, typecheck/build and 8/8 Playwright;
- web artifact `10300486494`, digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`;
- fresh Arabic/RTL/narrow manual review: pass;
- open release-candidate P0/P1/P2: 0/0/0.

Phase 6 source-authority evidence confirms `addons` and `apps/public-web` are unchanged from that application authority.

## Go / no-go rule

Current production state: **NO-GO**.

Application/UAT/localization blockers are closed, and the provider-neutral deployment/recovery package is now proven. Production-specific provider, persistence implementation, live access, hardware, staff, data cutover, monitoring, budget, backup policy and launch ownership remain deliberately unresolved.

A green Phase 6 repository/CI proof means **deployment package ready for provider-specific paid-staging evaluation**, not production GO.

## Rollback planning baseline

Before launch, the selected deployment design must support:
- restoring a consistent pre-cutover PostgreSQL database + matching Odoo filestore pair;
- restoring onto a replacement host rather than depending on one VM surviving;
- reverting Fares application code to the last authoritative tested application SHA;
- reverting the public web to the last authoritative tested deployment;
- disabling public traffic/integration without corrupting private Odoo operational truth;
- preserving/reconciling evidence for transactions accepted after cutover rather than silently discarding them.

Phase 6 now proves the first recovery mechanic with synthetic hosted state; provider-specific rehearsal remains required after infrastructure selection.

## Next actions requiring client/operator choices

The repository/CI Phase 6 scope is complete. The next live-infrastructure stage must not begin until the client/operator explicitly selects or accepts the required production/staging choices.

Required decisions include:
1. provider and region;
2. initial server size and budget ceiling;
3. paid staging strategy;
4. provider-native backup plus S3-compatible off-host target;
5. backup retention/frequency and RPO/RTO;
6. domain/DNS/TLS/internal-access model;
7. secret ownership/rotation;
8. actual store hardware/browser acceptance;
9. named staff/training/escalation ownership;
10. real opening-data/cutover/reconciliation process;
11. monitoring/logging/alert ownership;
12. launch timing.

Do **not** create paid staging/production resources, domains, DNS records, production certificates/secrets, real staff/customer/order/inventory data or production integrations until separately authorized.