# Release integration validation

## Status

**REVIEW CHECKPOINT GREEN. MERGE NOT AUTHORIZED. PRODUCTION NO-GO.**

Draft PR [#6](https://github.com/faresmohamed260/fares-uniform/pull/6) presents the complete Phase 0–8 stack from `phase-8/commercial-staging-readiness` to `main`. It is deliberately a draft and has not been merged.

## Identities

- Integrated hosted candidate: `de85450cf1c1774a432c5dfd600b6d4596bc2450`.
- Immutable deployed application: `2a74e93b1828c16839ba7cede336caa4ca374306`.
- Phase 8 live business-UAT authority: `48316711e4939e4a2e99f2708093930d430cf602`, run `35081126154`, job `104745121818`.
- Database epoch: `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.
- Historical Phase 5A authority remains `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`; the integrated candidate supersedes it only for the current accumulated hosted review boundary.

Branch audit before the integration correction proved every retained phase branch is a strict ancestor of the next branch and that the Phase 8 branch is ahead of, never behind, `main`. No history was rewritten, and no branch was merged, closed or deleted.

## Stale-guard diagnosis and correction

The first exact-HEAD dispatch at documentation HEAD `f9f07145dd52b4c1b2cc0417c429fe1a6e4dc5cb` reached the workflow source-authority checks. Phase 6 and the four Phase 7 workflows failed closed before builds because they still compared application source against pre-deployment Phase 5A SHA `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

The only relevant difference was the approved public-web routing work already incorporated into deployed application `2a74e93b1828c16839ba7cede336caa4ca374306`: catalog-image and enquiry routes, private Odoo routing support, and public-data routing. Commit `de85450cf1c1774a432c5dfd600b6d4596bc2450` changed only the five workflow guard constants to that deployed SHA. It did not change `addons`, `apps/public-web`, runtime configuration, the live database or the deployment.

## Exact-candidate hosted evidence

All runs below were manually dispatched against exact head `de85450cf1c1774a432c5dfd600b6d4596bc2450` and completed successfully.

| Gate | Run | Jobs | Result |
| --- | --- | --- | --- |
| Phase 5A Arabic launch polish | `35095651067` | `104792359592`, `104792360020` | 149/149 Odoo tests; repeatable seven-addon upgrade; 8/8 public Playwright tests |
| Phase 6 deployment readiness | `35095654418` | `104792221010` | Package, persistence, backup, incomplete-set rejection, destructive clean-volume restore and restored application checks passed |
| Phase 7 Vercel adaptation | `35095657711` | `104792231056` | Stateless runtime proof passed |
| Phase 7 external cron | `35095660970` | `104792242827` | External trigger/authentication/locking proof passed |
| Phase 7 WebSocket continuity | `35095664558` | `104792254362` | Reconnect and cursor continuity proof passed |
| Phase 7 project configuration | `35095667977` | `104792265697`, `104792266020` | Project configuration and public-web regression passed |

Retained exact-candidate artifacts:

- Phase 5A Odoo/UAT artifact `10446935284`, digest `sha256:f0df5aa6cb4f5d08f53354cbb93b9910db497274ee78bcb44bffa3c4b7768819`.
- Phase 5A public-web artifact `10446740074`, digest `sha256:df9d80df8d9fe05775b159e718f0f5eb86aa3663e9fbeb5f1c906e4c34220fd3`.
- Phase 6 deployment artifact `10446531752`, digest `sha256:d64f048f79e84699457fa02890677b1e817fd81a7ba7de34fa8bde18c842fa7e`.

## Cleanup boundary

The release-record commit removes the superseded `.github/workflows/phase8-diagnose-red-uat.yml`, `.github/workflows/phase8-repair-uat-shell.yml`, `.github/workflows/phase8-live-business-preflight.yml` and `.github/phase8-live-business-uat-shell.patch`. They were temporary entry points used during already-recorded diagnosis/repair. Permanent Phase 8 proof workflows, authoritative validation records, all source and lockfiles, Git history, phase branches and PR history remain intact.

Because that commit changes only documentation and obsolete workflow/patch files, it does not create a new application authority. Any later change under `addons`, `apps/public-web` or deployment/runtime source must rerun the affected hosted gates before review can remain GREEN.

## Remaining boundary

- PR #6 requires explicit review and explicit merge authorization.
- Default-branch merge would activate the twice-hourly GitHub observability schedule; do not merge merely to activate it.
- Gate D still requires named staff/role/training acceptance, device acceptance, production access/domain/secret decisions, real-data cutover and reconciliation, production backup retention/RPO/RTO, named monitoring recipients/escalation and explicit production GO.
- Production remains NO-GO.
