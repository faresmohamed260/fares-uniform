# Deployment readiness — planning checklist

Status: **PLANNING ONLY / NO PRODUCTION AUTHORIZATION.**

Phase 5 may prove readiness and identify choices. It may not create or mutate production infrastructure, domains, secrets or real data without a separate explicit client authorization.

## Readiness gates

### Application authority
- [ ] Phase 5 exact-head application/test SHA recorded.
- [ ] All inherited Phase 1–4B and integrated UAT tests green.
- [ ] Seven production addons pass repeatable upgrade.
- [ ] Public web typecheck/build/Playwright green.
- [ ] No open P0/P1 UAT defects.

### Odoo persistence
- [ ] Production Odoo hosting/provider selected by explicit decision.
- [ ] PostgreSQL persistence ownership documented.
- [ ] Odoo filestore persistence ownership documented.
- [ ] Backup schedule selected.
- [ ] A restore procedure has been rehearsed against non-production data.
- [ ] Recovery point/recovery time expectations are decided rather than assumed.

### Environments and secrets
- [ ] Production/staging separation decided.
- [ ] Secret owners and rotation process documented.
- [ ] No broad Odoo credential is exposed to the public browser.
- [ ] Public integration uses the narrow Fares API contract only.

### Public web
- [ ] Vercel production project/resource choice explicitly approved.
- [ ] Odoo public endpoint origin and server-side credential strategy decided.
- [ ] Domain/DNS/TLS ownership decided.
- [ ] EN/AR public smoke test planned after deployment.

### Store/device compatibility
- [ ] Actual checkout computer/browser validated.
- [ ] Scanner capability validated without brand-specific application assumptions.
- [ ] Printer/receipt/label capability and physical dimensions validated.
- [ ] IndexedDB/offline persistence behavior checked on the real checkout browser/device.
- [ ] Power/network outage operating procedure communicated to staff.

### Staff and onboarding
- [ ] Named staff accounts prepared; no shared admin for routine work.
- [ ] Final roles/location assignments approved.
- [ ] Owner/manager/cashier/inventory/production/sales training completed for relevant workflows.
- [ ] Recovery/escalation owner identified for sync/payment/stock discrepancies.

### Data cutover
- [ ] Real product master/variants/sizes/codes reviewed before import/entry.
- [ ] Opening stock count method and responsible people decided.
- [ ] Existing open preorders/business orders/balances reconciliation method decided.
- [ ] Cutover snapshot/reconciliation sign-off defined.
- [ ] Real-data import is separately authorized and performed only in the chosen production environment.

### Observability and operations
- [ ] Basic uptime/error/log monitoring selected.
- [ ] Log retention/privacy policy decided.
- [ ] Backup/restore alerts have an owner.
- [ ] Public enquiry delivery/failure monitoring has an owner.
- [ ] Routine update/upgrade procedure documents the pinned Odoo and Fares exact-version rule.

## Go / no-go rule

Deployment remains **NO-GO** until all application/UAT blockers are closed and every production-specific unchecked item that affects safety, persistence, access, compatibility or cutover has an explicit owner/decision.

A green Phase 5 does not itself flip production to GO; final deployment authorization is a separate client decision.

## Rollback planning baseline

Before launch, the selected deployment design must support:
- restoring the pre-cutover database + filestore pair consistently;
- reverting the Fares application to the last authoritative tested SHA;
- reverting the public web to the last authoritative tested deployment;
- disabling public traffic/integration without corrupting Odoo operational truth;
- preserving evidence for any transactions accepted after cutover rather than silently discarding them.

Exact commands/provider steps belong to the selected deployment architecture, not this provider-neutral plan.
