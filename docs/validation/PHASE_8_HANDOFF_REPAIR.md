# Phase 8 staging repair and handoff evidence — 2026-09-15

## Scope

Client requested current-state review, issue repair, clutter cleanup and a clean continuation handoff. Active branch: `phase-8/commercial-staging-readiness`. No merge, production rollout, real data or local project work is authorized by this cleanup.

## RED to GREEN: bounded fixture

- Original fixture run [34963582581](https://github.com/faresmohamed260/fares-uniform/actions/runs/34963582581): authentication failed before fixture execution; repeated attempts tripped the pooler circuit breaker.
- Commit `be901ac01c13f64b81b0cdff7b632241efbd1b33` uses Vercel's explicit per-variable decryption endpoint and requires `decrypted=true`, instead of accepting `.value` from the deprecated list/decrypt flow. Secret values remain masked and outside source/logs. Hosted run `34982191908` passed authentication, then exposed a separate Odoo CLI ordering error (`unrecognized parameters: shell`).
- Commit `a2315605154b2739ff43f0d360fdd1cbe51e40e0` initializes configuration through the unchanged deployed runtime entrypoint, then invokes native `odoo-bin shell -c ...` in the same restricted container.
- GREEN [run 34982822944](https://github.com/faresmohamed260/fares-uniform/actions/runs/34982822944), job `104427222729`, exact source `a2315605154b2739ff43f0d360fdd1cbe51e40e0`: fixture created; one published non-sale/non-purchase company-neutral template with slug `phase8-synthetic-program` and its exact external ID. Epoch unchanged; 988 app-owned relations; runtime LOGIN enabled; schema CREATE false; provider session table and both extensions preserved; `fu_uat` absent.

## Public smoke

Preserve RED [run 34964093451](https://github.com/faresmohamed260/fares-uniform/actions/runs/34964093451): immutable HTTP 200 passed, fixture invisible for 48 attempts; bilingual and exposure assertions skipped. The updated workflow retains all content assertions, serializes smoke runs and executes exposure checks after successful readiness even when a content check fails. GREEN [run 34988776192](https://github.com/faresmohamed260/fares-uniform/actions/runs/34988776192), job `104447664334`, exact source `289731278043c2b01cf1305e2580fa6c02a66819`: immutable deployment identity and HTTP readiness, exact synthetic fixture visibility, English/Arabic home/catalog/detail and public exposure checks all passed. Deployed application SHA remains `2a74e93b1828c16839ba7cede336caa4ca374306`; this workflow/source change did not redeploy it.

## Live bounded public enquiry — GREEN

Workflow source `cc056ee19ece534990b2d8885b6bd843e4324fbc` added the fail-closed live proof without redeploying the application or broadening database privileges. GREEN [run 34990008655](https://github.com/faresmohamed260/fares-uniform/actions/runs/34990008655), job `104451908443`, validated immutable deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` / application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`.

The live public Next.js boundary returned `201` for the first fixed synthetic enquiry, `200` with the same reference for an exact replay, `409` for a changed-payload replay, and `400` for payloads injecting either `price` or `stock`. Accepted responses contained exactly `status` and `reference`; EN/AR rendered enquiry surfaces passed the forbidden commercial/inventory wording check. Read-only pre/post database evidence proved zero prior matching rows, exactly one matching persisted row afterward, and zero deltas in sale orders, payments and stock pickings.

Postflight retained epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, 988 application-owned relations, runtime LOGIN, revoked schema `CREATE`, the provider-owned session table, both required extensions and absent `fu_uat`. The populated database was neither reset nor redeployed.

## Live attachment and authenticated-session continuity — GREEN

Workflow source `f3c8243d034d4cd6f15e2187d12957bf704a8f9e` is GREEN in [run 35005403008](https://github.com/faresmohamed260/fares-uniform/actions/runs/35005403008), job `104503776621`, against immutable application SHA `2a74e93b1828c16839ba7cede336caa4ca374306` and deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg`.

The hosted proof activated only exact SELECT/INSERT/UPDATE/DELETE rights on provider-owned `public.fares_http_session`, kept PUBLIC revoked and schema `CREATE=false`, set attachment storage to `db`, and used one fixed synthetic user plus attachment. Authentication produced an 84-character session cookie. The same authenticated UID and exact database-backed attachment survived complete replacement of the first no-mount runtime by a second fresh exact-image runtime. Postflight retained epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, 988 app-owned relations, provider-owned session state/extensions, `fu_uat` absent, effective session DML true, and zero sale/payment/stock deltas.

Preserved RED runs `34990936317`, `34991190169`, `34991794426`, `34992709590`, `34993286866`, `34994089599`, `34994995194`, `34995763111`, `34996425452` and `34997129404` established the activation and harness corrections. The decisive issue was Odoo 19 treating requests with `X-Odoo-Database` as stateless; removing that header only from authentication restored cookie/session persistence. The final provider assertion uses PostgreSQL's effective `has_table_privilege` result because `information_schema.table_privileges` did not report the dotted pooled runtime identity accurately.

## Bounded external cron/native locking — fail-closed blocker

Workflow source `c8d201c6b498cb53de0133c1fd2ecf2201e00af9` introduced a live proof harness using the exact deployed image, two disposable hosted runtimes, built-in cron threads disabled, the configured bearer-secret contract, one synthetic due job and database-backed marker, concurrent valid triggers, repeat-trigger verification, `always()` cleanup, business-delta assertions and the existing privilege/provider seal. Deployed application SHA remained `2a74e93b1828c16839ba7cede336caa4ca374306`.

Preserved RED [run 35023213198](https://github.com/faresmohamed260/fares-uniform/actions/runs/35023213198), job `104563848220`, passed deployed-identity, exact-image, secret-resolution and two-runtime checks, then stopped in the pre-mutation database guard. No synthetic cron was seeded and no authenticated external cron trigger ran.

Read-only diagnostics isolated two distinct facts. First, Odoo 19 delegates ORM `name` from `ir.actions.server` while the stored `ir_cron` column is `cron_name`; raw SQL must therefore use `cron_name`, while ORM `search/create` on `name` remains valid. Second, and independently decisive, final diagnostic source `81c55b914abae3468b05456fa45545fe505c095f` is GREEN in [run 35024524146](https://github.com/faresmohamed260/fares-uniform/actions/runs/35024524146), job `104568215429`, and found 19 active ordinary cron jobs already due. Every one has `lastcall = NULL` and failure count `0`.

The due set includes `Base: Auto-vacuum internal data`, mail/web-push/notification queues, calendar reminders, SMS and snailmail queues, digests, accounting auto-post, automatic invoices, procurement scheduler, stock valuation closing, CRM IAP enrichment, portal-user cleanup, and `Fares Uniform: Evaluate preorder production demand`. The same read-only run reconfirmed database epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, 988 app-owned relations, runtime LOGIN, schema `CREATE=false`, provider-owned session table/extensions, effective session DML, `fu_uat=0`, database-backed attachments, session rows `5`, and zero sale/payment/stock rows. Synthetic cron/marker residue was zero.

The Phase 8 proof contract requires failing closed before mutation when any non-synthetic cron is already due. Therefore this is a real staging-state blocker, not permission to drain the queue. Running, disabling or rescheduling the 19 ordinary jobs merely to make the proof green is explicitly out of bounds because several can create accounting, stock, messaging or IAP side effects. Cron locking remains unproven live until an explicit staging policy authorizes treatment of the pre-existing cron backlog.

## Cleanup

PROJECT.md owns current handoff; root README and docs index point there. Phase 8 contracts retain scope and historical evidence while current repair results live here. Workflow guide identifies retained and retired entry points. Five obsolete diagnostic/one-time mutation workflows removed from the current tree; history preserved. Generated prototype `node_modules`, `.next` and `tsconfig.tsbuildinfo` removed from the tracked tree, with root ignore rules to prevent recurrence. Source and lockfiles retained. Read-only DB diagnostics omit SQL query text.

No business logic changed. The historical 149-test/8-browser-test authority remains `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` / run `34700625051`; this maintenance work is not a new full-suite proof. Phase 8 Gate C remains incomplete and production remains NO-GO. Phase branches and draft PRs remain unmerged.

## Cleanup verification

Remote read-back matched all 12 written files at `289731278043c2b01cf1305e2580fa6c02a66819`. The complete untruncated Git tree has 428 entries; all relative Markdown links in the changed documents resolve, the five retired workflow files and three generated paths are absent, and prototype source/lockfiles remain.

Read-only diagnostics [run 34988776124](https://github.com/faresmohamed260/fares-uniform/actions/runs/34988776124), job `104447662507`, exact source `289731278043c2b01cf1305e2580fa6c02a66819`, passed runtime-role/activity, schema ownership, ACL/default privilege and installed-module inspection. SQL query text is omitted from diagnostic output.

The following documentation-only evidence commits do not alter validated application code. Their verification is remote read-back and consistency review; no new full application-suite or redeployment claim is made.