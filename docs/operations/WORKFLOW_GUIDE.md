# Workflow guide

## Routine continuation

Read `PROJECT.md` first and verify the remote active branch HEAD. Workflow files are source; historical Actions runs remain evidence, not safe retry buttons. Never rerun an old live writer: it retains its old workflow/source identity.

| Workflow | Purpose |
| --- | --- |
| `phase8-staging-public-fixture.yml` | Bounded synthetic catalog fixture through native Odoo, exact deployed image and current epoch |
| `phase8-public-staging-smoke.yml` | Exact immutable deployment, EN/AR catalog/detail and exposure boundary |
| `phase8-live-public-enquiry.yml` | Fixed synthetic enquiry acceptance/replay/conflict, injected price/stock rejection, rendered no-leak checks and read-only persistence/side-effect proof |
| `phase8-live-db-diagnostics.yml` | Read-only runtime/connection facts; no SQL query text in logs |
| `phase8-public-schema-preflight.yml` | Read-only schema/provider ownership inventory |
| `phase8-public-db-routing-regression.yml` | Private Odoo database-selection regression |
| `phase8-restore-boundary-preflight.yml` | Historical isolated restore regression; pinned candidate is intentional evidence |
| `phase8-seal-runtime-privileges.yml` | Revoke runtime schema CREATE after an authorized deployment |
| `phase8-vercel-control-plane.yml` | Isolated provider control-plane checks |
| `phase8-vercel-live-deploy-v2.yml` | Epoch-bound bootstrap/deploy; not an ordinary redeploy or fixture repair |
| `phase8-managed-odoo-reset.yml` | Destructive bounded reset; only for a separately approved reset/recovery plan |
| `phase8-live-db-recovery.yml` | Explicit emergency fail-closed runtime disable; not normal startup |

Phase 0–7 validation workflows remain for their bounded regression/evidence purposes. Source changes require appropriate hosted checks; docs-only changes require remote read-back and links/consistency checks.

## Retired one-off workflows

Removed from the current tree after the September 15 cleanup:
- `phase8-clean-boundary-diagnostic.yml`: duplicate one-off preflight; current fixture/schema checks supersede it.
- `phase8-dispatch-live-deploy.yml`: obsolete wrapper that could launch live deployment merely from a workflow-file push.
- `phase8-patch-retained-deployment-boundary.yml`: one-time source patch/dispatch; its change is already incorporated.
- `phase8-vercel-exposure-diagnostic.yml`: pinned to an old deployment.
- `phase8-vercel-exposure-fix.yml`: one-time protection/deletion operation against a historical deployment.

Historical files and run IDs remain available in Git history. Removing current workflow files does not revoke access to historical reruns; operators must still not rerun stale writers.

## Source hygiene

Generated `node_modules`, `.next` and TypeScript build metadata are not source. They are rebuilt from committed source and lockfiles on hosted runners. No phase source, tests, lockfiles, branch or PR is removed by this cleanup.

## Release integration

The default branch and four early draft PRs do not represent the active release. Preserve the phase stack until a separately reviewed integration plan establishes ancestry, scope and exact-head validation. No merge authorization is implied by cleanup.
