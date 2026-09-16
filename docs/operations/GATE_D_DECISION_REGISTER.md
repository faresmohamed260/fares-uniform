# Gate D production decision register

Status: **OPEN — PRODUCTION NO-GO.**

This register turns the remaining production boundary into explicit decisions and evidence. It does not authorize production resources, spending, real data, DNS changes, secret activation or cutover. `PROJECT.md` remains the current handoff; `DEPLOYMENT_READINESS.md` remains the readiness checklist.

Do not place staff names, secret values, customer information, product/order exports or other real business data in GitHub. Record only role labels and evidence references here. Named assignments and sensitive operational records belong in a client-approved private system.

## Proven prerequisites

- Phase 8 Gate C live staging acceptance: PASS.
- Release integration: merged PR #6, merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`.
- Deployed staging application: `2a74e93b1828c16839ba7cede336caa4ca374306`.
- Database epoch: `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.
- Native scheduled staging monitor: run `35129331378`, job `104906119150`, GREEN.
- Managed isolated recovery: run `35068971581`, job `104705729018`, GREEN.

These technical proofs do not answer the production decisions below.

## Required decisions

| ID | Decision required from client/operators | Minimum evidence before closure | State |
| --- | --- | --- | --- |
| GD-01 | Production hosting provider/plan, region and spending ceiling | Written provider/plan selection; commercial-use suitability; approved recurring/one-time cost ceiling; account owner role | OPEN |
| GD-02 | Production domain, DNS, TLS and private Odoo access ownership | Domain and DNS owner roles; intended public hostname; private/backoffice access method; certificate renewal ownership | OPEN |
| GD-03 | Production secret custody and rotation | Custodian roles for database, Odoo admin, cron and provider tokens; injection boundary; rotation/revocation procedure; emergency-access owner | OPEN |
| GD-04 | Store devices and outage procedure | Checkout browser/device result; scanner result; receipt/label printer dimensions/result; offline persistence result; power/network outage procedure acknowledged | OPEN |
| GD-05 | Staff roles and training | Private named-user roster; approved role/location mapping; training completion by workflow; recovery/escalation role | OPEN |
| GD-06 | Real-data cutover and reconciliation | Separately authorized source inventory; product/variant/code review; opening-stock count method; open preorder/business balance treatment; snapshot/reconciliation sign-off; rollback boundary | OPEN |
| GD-07 | Backup retention, RPO and RTO | Backup frequency and retention; recovery-point objective; recovery-time objective; restore-test cadence; backup/restore owner and escalation | OPEN |
| GD-08 | Production monitoring and privacy | Named recipients held privately; coverage hours; severity thresholds; escalation path; public enquiry/recovery alert ownership; log/alert retention and redaction policy | OPEN |
| GD-09 | Launch control and explicit production GO | Change-freeze window; cutover window; GO approver; rollback authority; post-launch observation period; explicit client production GO | OPEN |
| GD-10 | Repository and deployment release controls | Client declined applying the proposed controls on 2026-09-16. Reopen only with explicit authorization; production remains NO-GO without an accepted release-control boundary. | DEFERRED / NOT APPROVED |

## Current release-control audit

Read-only GitHub audit at source `3a516288cc8a9b5a65d9a6e529f4ec3d8c8346e4` found:

- public repository; default branch `main`;
- zero repository rulesets and no branch protection on `main`;
- zero GitHub deployment environments;
- default Actions token permission is read-only and Actions cannot approve pull requests;
- secret scanning and push protection are enabled;
- Dependabot security updates are disabled;
- zero open Dependabot, code-scanning or secret-scanning alerts at the audit time;
- only the existing staging control-plane secret names `SUPABASE_ACCESS_TOKEN` and `VERCEL_TOKEN`; no repository variables or production runtime-secret names.

No setting was changed. Enabling branch protection, selecting required checks/reviewers, creating a production environment or enabling automated dependency updates can affect normal repository work and therefore requires an explicit GD-10 decision.

See [Gate D release-control plan](GATE_D_RELEASE_CONTROL_PLAN.md).
## Client direction on GD-10

On 2026-09-16 the client answered **no** to enabling the proposed `main` protection, Dependabot security updates and empty protected `production` environment, and instructed completion of the remaining authorized work. No GitHub setting or environment was changed. GD-10 is therefore deferred, not passed; production cannot become GO while the release-control boundary remains unapproved.
## Evidence rules

For each decision:

1. Record the accepted non-sensitive policy in `docs/DECISIONS.md` or the appropriate operations document.
2. Reference private approval/evidence by opaque identifier only; do not copy names, credentials or real business records into source.
3. Add a hosted fail-closed assertion where the decision can be verified technically without exposing secrets or real data.
4. Re-run the affected exact hosted gate after any source/runtime change.
5. Keep staging and production identities separate. A staging pass never becomes production evidence merely by reuse.

## Fail-closed production boundary

Production remains NO-GO while any GD-01 through GD-09 item is OPEN, while GD-10 is deferred/not approved, while required private evidence is missing, or while a production technical preflight is not GREEN for the exact production candidate.

No agent should infer a provider purchase, domain mutation, production secret activation, staff assignment, migration authorization, launch window or production GO from a generic instruction to continue. Request only the minimum specific decision needed when safe repository/CI preparation is exhausted.
