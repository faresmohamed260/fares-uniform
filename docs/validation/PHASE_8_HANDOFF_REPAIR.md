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

## Bounded external cron/native locking — GREEN

Workflow source `c8d201c6b498cb53de0133c1fd2ecf2201e00af9` introduced a live proof harness using the exact deployed image, two disposable hosted runtimes, built-in cron threads disabled, the configured bearer-secret contract, one synthetic due job and database-backed marker, concurrent valid triggers, repeat-trigger verification, `always()` cleanup, business-delta assertions and the existing privilege/provider seal. Deployed application SHA remained `2a74e93b1828c16839ba7cede336caa4ca374306`.

Preserved RED [run 35023213198](https://github.com/faresmohamed260/fares-uniform/actions/runs/35023213198), job `104563848220`, stopped before synthetic mutation. Read-only diagnostic source `81c55b914abae3468b05456fa45545fe505c095f` then passed in [run 35024524146](https://github.com/faresmohamed260/fares-uniform/actions/runs/35024524146), job `104568215429`, and established two facts: Odoo 19 stores the raw cron label in `ir_cron.cron_name`; and 19 active ordinary cron jobs were already due with `lastcall = NULL` and failure count `0`. The due set included accounting, invoicing, procurement, stock valuation, mail/SMS, CRM IAP and Fares preorder-demand work, so draining or rescheduling it solely for the proof remained prohibited.

The accepted bounded policy in D-043 does not execute or mutate that backlog. Workflow source `59d9553a1f14b6f4a1136ae4089d5289dcefd0e1` first validated the exact 19-job boundary, then held `FOR NO KEY UPDATE` locks on all 20 active ordinary cron rows in a separate transaction. Pinned Odoo 19 acquires each ready job using `FOR NO KEY UPDATE SKIP LOCKED`, so the two proof runtimes skipped every locked ordinary row and could acquire only the newly seeded synthetic job.

GREEN [run 35026879234](https://github.com/faresmohamed260/fares-uniform/actions/runs/35026879234), job `104575905196`, proved missing and invalid bearer requests return `401` with zero execution, two concurrent valid triggers create exactly one database-backed marker, and a repeat valid trigger creates no duplicate. Cleanup removed one synthetic cron and one marker before the quarantine transaction was rolled back.

Pre/post snapshots matched exactly for every ordinary cron row and ordinary `ir_cron_trigger` row (`ordinary_cron_delta=0`, `ordinary_trigger_delta=0`). Postflight also proved zero sale/payment/stock deltas, no synthetic residue, unchanged epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, 988 app-owned relations, provider-owned session state/extensions, effective session DML, schema `CREATE=false`, database-backed attachments and `fu_uat=0`. No ordinary cron ran, was disabled, postponed, rescheduled or otherwise changed.
## Cleanup

PROJECT.md owns current handoff; root README and docs index point there. Phase 8 contracts retain scope and historical evidence while current repair results live here. Workflow guide identifies retained and retired entry points. Five obsolete diagnostic/one-time mutation workflows removed from the current tree; history preserved. Generated prototype `node_modules`, `.next` and `tsconfig.tsbuildinfo` removed from the tracked tree, with root ignore rules to prevent recurrence. Source and lockfiles retained. Read-only DB diagnostics omit SQL query text.

No business logic changed. The historical 149-test/8-browser-test authority remains `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` / run `34700625051`; this maintenance work is not a new full-suite proof. Phase 8 Gate C remains incomplete and production remains NO-GO. Phase branches and draft PRs remain unmerged.

## Cleanup verification

Remote read-back matched all 12 written files at `289731278043c2b01cf1305e2580fa6c02a66819`. The complete untruncated Git tree has 428 entries; all relative Markdown links in the changed documents resolve, the five retired workflow files and three generated paths are absent, and prototype source/lockfiles remain.

Read-only diagnostics [run 34988776124](https://github.com/faresmohamed260/fares-uniform/actions/runs/34988776124), job `104447662507`, exact source `289731278043c2b01cf1305e2580fa6c02a66819`, passed runtime-role/activity, schema ownership, ACL/default privilege and installed-module inspection. SQL query text is omitted from diagnostic output.

The following documentation-only evidence commits do not alter validated application code. Their verification is remote read-back and consistency review; no new full application-suite or redeployment claim is made.