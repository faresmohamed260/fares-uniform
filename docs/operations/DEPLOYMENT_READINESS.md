# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PRODUCTION DEPLOYMENT NO-GO PENDING PRODUCTION-SPECIFIC DECISIONS.**

Authoritative Phase 5A application/test SHA: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Phase 5 proved integrated MVP release-readiness. Phase 5A then closed the remaining documented Arabic launch-quality finding without changing business/security/public contracts. Neither phase created or mutated production infrastructure, domains, secrets or real data.

## Readiness gates

### Application authority
- [x] Phase 5A exact-head application/test SHA recorded.
- [x] Inherited Phase 1–5 plus Phase 5A gate green: **149 tests, 0 failures, 0 errors**.
- [x] Seven production addons pass repeatable upgrade on the same database/SHA.
- [x] Public web `npm ci`, typecheck, production build and Playwright green: **8/8**.
- [x] No open P0/P1 UAT defects.
- [x] P2-001 partial internal Arabic-label localization cleaned up and closed by Phase 5A.

### Odoo persistence
- [ ] Production Odoo hosting/provider selected by explicit decision.
- [ ] PostgreSQL persistence ownership documented for the selected provider.
- [ ] Odoo filestore persistence ownership documented for the selected provider.
- [ ] Backup schedule selected.
- [ ] A restore procedure rehearsed against non-production data for the selected deployment architecture.
- [ ] Recovery point/recovery time expectations explicitly decided.

### Environments and secrets
- [ ] Production/staging separation selected for the deployment architecture.
- [ ] Secret owners and rotation process documented.
- [x] Application architecture/public tests preserve the rule that no broad Odoo credential belongs in the public browser.
- [x] Application integration remains the narrow Fares public API contract; Phase 5A did not broaden it.

### Public web
- [ ] Vercel production project/resource choice explicitly approved.
- [ ] Production Odoo public endpoint origin and server-side credential strategy decided.
- [ ] Domain/DNS/TLS ownership decided.
- [x] Post-deployment EN/AR public smoke verification is required by this checklist; exact live endpoint remains undecided.

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
- [x] Repository process requires pinned Odoo and exact Fares application authority for update/upgrade evidence; provider-specific procedure remains to be written after hosting selection.

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

Application/UAT/localization blockers are closed, but production-specific persistence, restore, access, hardware, staff, data-cutover and operational-ownership items remain deliberately unresolved. A green Phase 5A does not authorize deployment.

## Rollback planning baseline

Before launch, the selected deployment design must support:
- restoring a consistent pre-cutover PostgreSQL database + Odoo filestore pair;
- reverting Fares to the last authoritative tested application SHA;
- reverting the public web to the last authoritative tested deployment;
- disabling public traffic/integration without corrupting private Odoo operational truth;
- preserving/reconciling evidence for transactions accepted after cutover rather than silently discarding them.

Exact commands/provider steps must be written and rehearsed against the selected non-production deployment architecture before launch.

## Next deployment-planning inputs required from the client/operator

The next bounded task is not a blind deployment. Resolve the unchecked production choices above—beginning with hosting/persistence, backup+restore/RPO/RTO, staging/secrets, Vercel/domain/DNS, actual store hardware/browser, named staff/training, real opening-data/cutover ownership, monitoring, budget and launch timing—then produce an explicitly authorized staging/deployment plan.

Do not invent these inputs and do not create production resources, mutate live configuration or migrate real data without explicit authorization.
