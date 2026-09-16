# Workflow guide

## Routine continuation

Read `PROJECT.md` first and verify the remote active branch HEAD. Workflow files are source; historical Actions runs remain evidence, not safe retry buttons. Never rerun an old live writer: it retains its old workflow/source identity.

| Workflow | Purpose |
| --- | --- |
| `phase8-staging-public-fixture.yml` | Bounded synthetic catalog fixture through native Odoo, exact deployed image and current epoch |
| `phase8-public-staging-smoke.yml` | Exact immutable deployment, EN/AR catalog/detail and exposure boundary |
| `phase8-live-public-enquiry.yml` | Fixed synthetic enquiry acceptance/replay/conflict, injected price/stock rejection, rendered no-leak checks and read-only persistence/side-effect proof |
| `phase8-live-state-continuity.yml` | Exact-image attachment and authenticated PostgreSQL-session continuity across complete runtime replacement; bounded synthetic state and sealed postflight |
| `phase8-live-cron-locking.yml` | Exact-image external cron/native `SKIP LOCKED` proof; temporarily transaction-locks the diagnosed ordinary backlog without mutation, then removes all synthetic state |
| `phase8-live-websocket-replay.yml` | Exact-image authenticated WebSocket delivery, complete evented-runtime replacement, cursor replay/no-duplicate proof and full run-scoped cleanup |
| `phase8-managed-backup-restore.yml` | Managed PostgreSQL 17.6 export plus destructive restore only into a disposable hosted target; exact deployed image/seven-addon upgrade, provider seal, recovered business/session/attachment/durable-cron proof, archive-anchored trigger continuity, source postflight and no retained backup artifact |
| `phase8-live-cron-diagnostic.yml` | Read-only Odoo 19 cron inventory and stored-field diagnostics; no mutation |
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

## Managed recovery invariant

`phase8-managed-backup-restore.yml` must never destructively restore the populated managed source. It exports the managed `public` schema, recreates only a disposable hosted PostgreSQL target, pre-provisions provider-owned session/extension infrastructure, restores the filtered archive, repeats the exact seven-production-addon upgrade, reseals runtime/provider privileges, verifies the managed source remained unchanged and destroys all runner-local backup state during cleanup. Do not upload the backup as a workflow artifact.

Treat `ir_cron` and `ir_cron_trigger` differently. `ir_cron` is durable schedule definition state and remains an exact source-to-restored-target count invariant. Pinned Odoo treats `ir_cron_trigger` as a mutable scheduler wake-up queue, so a live source count sampled before `pg_dump` is not comparable to a post-upgrade target count. The accepted proof snapshots the exact trigger set immediately after `pg_restore`, before the seven-addon upgrade, and requires that complete archive-restored set to remain afterward with zero orphan triggers. Legitimate upgrade-created trigger rows may increase the queue. Do not replace this with a raw cross-time count equality.

Current recovery authority: workflow source `01824eba60dc55382a614178df3edd4d88997f61`, run `35068971581`, job `104705729018`, result GREEN. GitHub reports zero retained workflow artifacts. Production remains NO-GO; this is staging recovery evidence only.

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