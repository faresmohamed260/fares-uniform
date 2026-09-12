# Deployment readiness — planning checklist

Status: **APPLICATION/UAT READY; PRODUCTION DEPLOYMENT NO-GO PENDING PRODUCTION-SPECIFIC DECISIONS.**

Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

Phase 5 proved application release-readiness and identified remaining launch choices. It did not create or mutate production infrastructure, domains, secrets or real data.

## Readiness gates

### Application authority
- [x] Phase 5 exact-head application/UAT SHA recorded.
- [x] Inherited Phase 1–4B plus integrated UAT tests green: **148 tests, 0 failures, 0 errors**.
- [x] Seven production addons pass repeatable upgrade on the same database/SHA.
- [x] Public web `npm ci`, typecheck, production build and Playwright green: **8/8**.
- [x] No open P0/P1 UAT defects.
- [ ] P2-001 partial internal Arabic-label localization cleaned up or consciously accepted for launch.

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
- [x] Application integration remains the narrow Fares public API contract; Phase 5 did not broaden it.

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

## Go / no-go rule

Current production state: **NO-GO**.

Application/UAT blockers are closed, but production-specific persistence, restore, access, hardware, staff, data-cutover and operational-ownership items remain deliberately unresolved. A green Phase 5 does not authorize deployment.

## Rollback planning baseline

Before launch, the selected deployment design must support:
- restoring a consistent pre-cutover PostgreSQL database + Odoo filestore pair;
- reverting Fares to the last authoritative tested application SHA;
- reverting the public web to the last authoritative tested deployment;
- disabling public traffic/integration without corrupting private Odoo operational truth;
- preserving/reconciling evidence for transactions accepted after cutover rather than silently discarding them.

Exact commands/provider steps must be written and rehearsed against the selected non-production deployment architecture before launch.

## Next deployment-planning inputs required from the client/operator

The next bounded task is not a blind deployment. It is to resolve the unchecked production choices above—beginning with hosting/persistence, restore strategy, actual store hardware/browser, staff roles, real opening-data/cutover ownership, budget and launch timing—then produce an explicitly authorized staging/deployment plan.
