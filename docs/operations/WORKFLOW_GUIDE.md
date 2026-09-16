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
| `phase8-live-business-uat.yml` | Rollback-safe production-model staging UAT: stock custody/idempotency, cashier POS via `sync_from_ui`, offline role revalidation, business deposit/balance/delivery/reporting, exact rollback/postflight and cron/epoch/privilege seals |
| `phase8-managed-backup-restore.yml` | Managed PostgreSQL 17.6 export plus destructive restore only into a disposable hosted target; exact deployed image/seven-addon upgrade, provider seal, recovered business/session/attachment/durable-cron proof, archive-anchored trigger continuity, source postflight and no retained backup artifact |
| `phase8-staging-observability.yml` | Read-only staging monitor for exact deployment/public exposure, aggregate Vercel error/5xx counts, sealed database/provider state, known cron backlog/failure visibility, latest recovery health and privacy-safe GitHub issue alerts |
| `phase8-cron-preflight-diagnostics.yml` | Read-only Odoo 19 cron inventory and stored-field diagnostics; no mutation |
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

## Live business UAT boundary

`phase8-live-business-uat.yml` is the Gate C production-model proof. Current authority: `48316711e4939e4a2e99f2708093930d430cf602`, run `35081126154`, job `104745121818`, GREEN against immutable application `2a74e93b1828c16839ba7cede336caa4ca374306`. It uses production addons only; `fu_uat` stays absent. Synthetic facts must remain inside one explicit rollback transaction, with an independent exact-count/cron-snapshot postflight and unchanged epoch/provider/least-privilege seal.

Cashier checkout must use the real POS server path through `pos.order.sync_from_ui`. Do not substitute manager-only backend `pos.make.payment` or widen cashier ACLs to make a harness pass. Do not run/reschedule ordinary cron backlog. Purchase/MRP/procurement planning, `sale_management` and `stock_valuation_layer` are outside this staging proof. Production remains Gate D NO-GO.

## Managed recovery invariant

`phase8-managed-backup-restore.yml` must never destructively restore the populated managed source. It exports the managed `public` schema, recreates only a disposable hosted PostgreSQL target, pre-provisions provider-owned session/extension infrastructure, restores the filtered archive, repeats the exact seven-production-addon upgrade, reseals runtime/provider privileges, verifies the managed source remained unchanged and destroys all runner-local backup state during cleanup. Do not upload the backup as a workflow artifact.

Treat `ir_cron` and `ir_cron_trigger` differently. `ir_cron` is durable schedule definition state and remains an exact source-to-restored-target count invariant. Pinned Odoo treats `ir_cron_trigger` as a mutable scheduler wake-up queue, so a live source count sampled before `pg_dump` is not comparable to a post-upgrade target count. The accepted proof snapshots the exact trigger set immediately after `pg_restore`, before the seven-addon upgrade, and requires that complete archive-restored set to remain afterward with zero orphan triggers. Legitimate upgrade-created trigger rows may increase the queue. Do not replace this with a raw cross-time count equality.

Current recovery authority: workflow source `01824eba60dc55382a614178df3edd4d88997f61`, run `35068971581`, job `104705729018`, result GREEN. GitHub reports zero retained workflow artifacts. Production remains NO-GO; this is staging recovery evidence only.

## Staging observability boundary

`phase8-staging-observability.yml` is read-only with respect to the live application/database. It emits aggregate counts/status only and must not persist raw runtime logs, request bodies, customer/staff data, database rows, SQL text or secret values into Actions summaries or GitHub alert issues.

Current observability authority: source `9d65d93c8ce7ff638de61dd4c8c15f2d7c879215`, run `35071292407`, job `104713180912`, result GREEN. The run observed zero Vercel runtime error/fatal records, zero HTTP 5xx, the unchanged 19-job ordinary cron backlog, zero active cron failures, zero long idle transactions and latest managed recovery success. Synthetic issue `#5` proved the GitHub issue alert transport and was closed immediately.

The workflow contains a twice-hourly `schedule`, and PR #6 placed it on default branch `main`; scheduled staging polling is active. Manual default-branch authority is run `35099333740`, job `104804477793`, GREEN at merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`. Native scheduled authority is run `35129331378`, job `104906119150`, GREEN at exact `main` source `c2a93d8d693f47ebc7b286af5eaebb485895d8c0`. Schedule activation does not authorize production monitoring policy or cutover. See `PHASE_8_STAGING_OBSERVABILITY.md`.

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

PR #6 completed the reviewed release integration into `main` at merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`. Preserve all phase branches unless deletion is explicitly authorized. The historical early draft PRs remain evidence only; default branch now owns the integrated release source. Production remains Gate D NO-GO.
