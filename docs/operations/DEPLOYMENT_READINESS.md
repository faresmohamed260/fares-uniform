# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PHASE 6 READINESS PROOF ACTIVE; PRODUCTION DEPLOYMENT NO-GO PENDING PRODUCTION-SPECIFIC DECISIONS.**

Authoritative application/test SHA: Phase 5A `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Phase 5 proved integrated MVP release-readiness. Phase 5A closed the remaining documented Arabic launch-quality finding. Phase 6 now prepares and proves provider-neutral deployment/persistence/restore mechanics without creating paid/live resources.

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
- [ ] Reproducible provider-neutral Odoo deployment package committed.
- [ ] Production-safe Odoo/proxy configuration templates committed with no embedded secrets.
- [ ] Database and Odoo filestore persistence separated from application image/container lifecycle.
- [ ] Backup tooling creates one manifest-bound PostgreSQL + filestore backup set.
- [ ] Restore tooling validates manifest/checksums and fails closed on incomplete/mismatched sets.
- [ ] Hosted CI proves backup and clean-target restore with synthetic database facts and stored-file recovery.
- [ ] Hosted CI proves persistence across application-container replacement.
- [ ] Phase 6 exact-head validation evidence recorded.

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
- [ ] A provider-specific restore procedure rehearsed against non-production infrastructure.

### Environments and secrets
- [ ] Paid staging strategy/lifetime explicitly selected.
- [ ] Production/staging separation confirmed for selected architecture.
- [ ] Secret owners and rotation process documented.
- [x] No broad Odoo/database credential belongs in the public browser.
- [x] Application integration remains the narrow Fares public API contract.
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

## Current architecture recommendation — not a provider decision

See `../architecture/PHASE_6_DEPLOYMENT_ARCHITECTURE.md`.

Current recommendation is an initial single x86-64 EU Linux VPS for private Odoo + PostgreSQL + persistent filestore, reverse proxy/TLS, coordinated database+filestore backup sets copied off-host to S3-compatible object storage, and Vercel remaining the separate public Next.js host.

Dated official pricing/capability research on 2026-09-12 currently favors Hetzner Cloud for cost/value, with DigitalOcean as the principal alternative and Render as a materially more expensive split-state option. **This has not been accepted as the production provider.**

## Latest application proof

Phase 5A workflow `Phase 5A Arabic polish`, run `34700625051`:
- Odoo/UAT job `103571619120`: success, 149 tests / 0 failures / 0 errors, seven-production-addon repeatable upgrade success;
- Odoo artifact `10300402418`, digest `sha256:650fd702f12d0e042ec1761401b7a039778a973ab797d2c77f01d76c5eede701`;
- public job `103571619062`: success, typecheck/build and 8/8 Playwright;
- web artifact `10300486494`, digest `sha256:9658f4e094bd65292634d30f99e8020c5a1ce278644c30c0c7077b95722ff104`;
- fresh Arabic/RTL/narrow manual review: pass;
- open release-candidate P0/P1/P2: 0/0/0.

## Go / no-go rule

Current production state: **NO-GO**.

Application/UAT/localization blockers are closed. Phase 6 may prove repository/CI deployment mechanics without live resources, but production-specific provider, persistence, restore target, access, hardware, staff, data-cutover, monitoring, budget and launch ownership remain deliberately unresolved.

A green Phase 6 repository/CI proof will mean **deployment package ready for paid staging evaluation**, not production GO.

## Rollback planning baseline

Before launch, the selected deployment design must support:
- restoring a consistent pre-cutover PostgreSQL database + matching Odoo filestore pair;
- restoring onto a replacement host rather than depending on one VM surviving;
- reverting Fares application code to the last authoritative tested application SHA;
- reverting the public web to the last authoritative tested deployment;
- disabling public traffic/integration without corrupting private Odoo operational truth;
- preserving/reconciling evidence for transactions accepted after cutover rather than silently discarding them.

Provider-native VM backup/snapshot is secondary. Application-aware database+filestore backup/restore remains required.

## Next actions allowed now

Without further live-resource authorization, continue with:
1. provider-neutral deployment/container package;
2. Odoo/proxy config templates;
3. database + filestore persistence boundaries;
4. backup-set/manifest/checksum tooling;
5. restore tooling;
6. hosted synthetic backup/restore and persistence CI;
7. exact evidence documentation.

Do **not** create paid staging/production resources, domains, DNS records, certificates, provider secrets, real staff/customer/order/inventory data or production integrations until separately authorized.
