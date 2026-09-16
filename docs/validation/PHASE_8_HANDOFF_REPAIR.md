# Phase 8 staging repair and handoff evidence — 2026-09-16

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

## Live WebSocket reconnect and cursor replay — GREEN

Workflow source `96e456412495f5b0cb1bb6c20ef00422ed633337` adapted the Phase 7 replacement/replay contract to the populated managed staging database without redeploying the application. GREEN [run 35029061502](https://github.com/faresmohamed260/fares-uniform/actions/runs/35029061502), job `104583000465`, verified immutable application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`, deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` and database epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.

One fixed synthetic internal user authenticated through the HTTP runtime and produced an 84-character PostgreSQL-backed session. A no-mount gevent runtime received the first channel notification (`id=7`). The proof then destroyed that runtime completely, confirmed its endpoint was absent, and committed the second notification while no evented runtime existed. A fresh exact-image gevent runtime reconnected with the same shared session and saved cursor, delivered the unseen second notification, and did not duplicate the first.

Cleanup removed exactly one synthetic user, one partner, one shared-session row and two run-scoped bus rows. Postflight found no synthetic residue, zero session/sale/payment/stock deltas, and an unchanged ordinary-cron snapshot. The provider-owned session table/extensions, effective runtime session DML, revoked PUBLIC/session exposure, schema `CREATE=false`, 988 app-owned relations, installed `bus`, and absent `fu_uat` all remained intact. Built-in cron threads remained disabled throughout.

## Managed backup/export and isolated destructive recovery — RED→GREEN

The recovery workflow is `.github/workflows/phase8-managed-backup-restore.yml`. Its destructive action is restricted to a disposable hosted PostgreSQL target; it never resets the populated managed source. Backup files remain runner-local and are destroyed during cleanup rather than uploaded as Actions artifacts.

Preserved RED progression:

- run `35031853074`, job `104591923750`: safely failed before target creation because the runner's PostgreSQL 16 client could not dump the managed PostgreSQL 17.6 source;
- run `35031940049`: cancelled while `--serializable-deferrable` waited; no target was created;
- run `35032216272`, job `104593091927`: PostgreSQL `17.6-bookworm` export, exact image, disposable target, restore and seven-addon upgrade passed; final verifier invocation wiring failed; cleanup passed;
- run `35060302526`, job `104679016480`: verifier reached the recovered database but failed inside the combined post-restore assertion boundary; cleanup passed and no workflow artifact was retained;
- run `35061384154`, job `104682245023`: recovered application facts, database fact capture and privilege seal all passed; only aggregate restored-count verification failed;
- run `35062507713`, job `104685620618`: ten restored count categories plus durable `ir_cron` passed; only raw `ir_cron_trigger` source-preflight versus post-upgrade equality failed. Source state was not mutated and cleanup passed.

The final mismatch was not treated as a reason to suppress an assertion. Pinned Odoo source at `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` establishes that `ir_cron_trigger` is a mutable scheduler wake-up queue: trigger APIs insert rows, due triggers are removed during cron startup/processing, and stale/inactive triggers are garbage-collected. Durable schedule definitions are stored in `ir_cron`. Comparing a live source preflight queue count taken before `pg_dump` with a restored target after a seven-addon upgrade was therefore a cross-time comparison of derived scheduler state, not a durable recovery invariant.

Commit `01824eba60dc55382a614178df3edd4d88997f61` anchored the trigger invariant to the archive itself. Immediately after `pg_restore`, before the seven-addon upgrade, the workflow snapshots every restored `{id, cron_id, call_at}` trigger. Post-upgrade it proves that the entire archive-restored trigger set is still present, that there are zero trigger rows whose cron no longer exists, and that the final queue contains at least the archive-restored rows. Legitimate new rows created by the required upgrade are allowed. Exact source-to-target equality remains required for durable `ir_cron` rows. Managed-source postflight also uses `if: !cancelled()` so a target assertion cannot hide source-boundary evidence.

GREEN [run 35068971581](https://github.com/faresmohamed260/fares-uniform/actions/runs/35068971581), job `104705729018`, exact workflow source `01824eba60dc55382a614178df3edd4d88997f61`, completed successfully. Step metadata proves managed-source preflight, PostgreSQL 17.6 export, exact-image/disposable-target recreation, restore plus seven-addon upgrade, recovered application facts, recovered database facts, privilege seal, all attachment/session/business counts, exact durable cron count, archive-trigger continuity/no-orphan proof, managed-source postflight, evidence publication and cleanup all passed. `fetch_workflow_run_artifacts` returned `total_count=0`, so no backup archive or other workflow artifact was retained.

The connector did not expose sealed stdout for the final GREEN job, so the final run's backup byte count, SHA-256 and filtered-list count are intentionally not reconstructed from older runs. Exact run/job/source identity, step conclusions and zero retained artifacts are the verified completion evidence.

## Hosted staging observability and alert transport — GREEN

Workflow source `9d65d93c8ce7ff638de61dd4c8c15f2d7c879215` introduced `.github/workflows/phase8-staging-observability.yml` and is GREEN in [run 35071292407](https://github.com/faresmohamed260/fares-uniform/actions/runs/35071292407), job `104713180912`.

The run resolved exact deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` at application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`. Immutable EN and canonical AR public checks returned `200`; unauthenticated cron returned `401`; broad `/web/login` and direct `/fu/public/catalog` returned `404`.

Vercel runtime-log checks used pinned CLI `59.17.0`, captured log records only into runner-local temporary files, emitted aggregate counts only and observed `0` error/fatal records plus `0` HTTP 5xx over the preceding hour. The Vercel project alert-rule API was accessible and returned one existing rule. The proof does not assume that rule's recipients or semantics.

The read-only Supabase Management API check retained epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, non-elevated `fares_app`, `CREATE=false`, 988 app-owned relations, provider-owned session table with exact runtime DML and zero PUBLIC grants, both required extensions, `fu_uat=0`, attachment location `db` and the fixed live synthetic enquiry. It observed the same 19 ordinary due cron rows without executing/rescheduling them, `failing_crons=0`, zero synthetic cron-locking residue and zero idle-in-transaction sessions older than five minutes. Latest managed recovery remained run `35068971581` / exact source `01824eba...` / success.

The workflow proved its source-controlled failure transport on first execution: synthetic GitHub issue `#5` (`[staging alert self-test] Phase 8 observability transport`) was created by `github-actions[bot]` and immediately closed with `state_reason=completed`. Repository read-back confirms its body contains only the synthetic self-test statement and owner-role label, with no runtime logs, customer data, secrets, request bodies, database rows or staff names.

Ownership is role-based (`technical-operations-owner`, `business-operations-owner`) until Gate D supplies named people. `docs/operations/PHASE_8_STAGING_OBSERVABILITY.md` defines the privacy/redaction boundary and current monitored invariants. The workflow contains a twice-hourly schedule but GitHub scheduled workflows execute only from the default branch; because the current workflow remains on the Phase 8 branch, recurring GitHub polling is not yet active. Current staging evidence is push/manual hosted proof plus native Vercel/Supabase observability. This limitation does not authorize early release integration.

## Live production-model business UAT — RED→GREEN

Workflow source `401960c3ead20f511065b22cd3bb0484365015bb` introduced the rollback-safe live production-model harness. Preserved RED run `35074919114`, job `104724933423`, failed in the transaction step while independent exact rollback/postflight passed. After shell invocation repair, preserved RED run `35078985169`, job `104738120056`, reached the POS payment path; recovered hosted evidence identified `odoo.exceptions.AccessError` on cashier creation of backend `pos.make.payment`.

That was a harness defect, not a reason to widen cashier permissions. Commit `48316711e4939e4a2e99f2708093930d430cf602` switched the synthetic cashier checkout to the real POS frontend server path, `pos.order.sync_from_ui`, without changing production ACLs or business rules.

GREEN run `35081126154`, job `104745121818`, exact workflow source `48316711e4939e4a2e99f2708093930d430cf602`, passed fresh deployment authority, managed baseline, restricted secrets, exact deployed image, live transaction, explicit rollback, independent postflight, evidence publication and cleanup. Against application `2a74e93b1828c16839ba7cede336caa4ca374306` and epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, it proved Store/Storage stock custody/idempotency; cash POS payment/picking/accounting; offline role-revocation revalidation; business sample/quotation, confirmed InstaPay deposit, balance/delivery guard, final payment/delivery and owner reporting. Postflight matched all captured business counts and exact ordinary-cron snapshots and retained the provider/session/extensions/988-relations/`CREATE=false`/`fu_uat=0` seals. GitHub reports zero retained artifacts.

This closes Gate C staging technical acceptance. Production remains Gate D NO-GO. Purchase/MRP/procurement planning and `stock_valuation_layer` were not added because they are outside the accepted first-release staging boundary.

## Cleanup

PROJECT.md owns current handoff; root README and docs index point there. Phase 8 contracts retain scope and historical evidence while current repair results live here. Workflow guide identifies retained and retired entry points. Five obsolete diagnostic/one-time mutation workflows removed from the current tree; history preserved. Generated prototype `node_modules`, `.next` and `tsconfig.tsbuildinfo` removed from the tracked tree, with root ignore rules to prevent recurrence. Source and lockfiles retained. Read-only DB diagnostics omit SQL query text.

No business logic changed. The historical 149-test/8-browser-test authority remains `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` / run `34700625051`; this maintenance work is not a new full-suite proof. Phase 8 Gate C remains incomplete only for live synthetic business-flow acceptance; production remains NO-GO. Phase branches and draft PRs remain unmerged.

## Cleanup verification

Remote read-back matched all 12 written files at `289731278043c2b01cf1305e2580fa6c02a66819`. The complete untruncated Git tree has 428 entries; all relative Markdown links in the changed documents resolve, the five retired workflow files and three generated paths are absent, and prototype source/lockfiles remain.

Read-only diagnostics [run 34988776124](https://github.com/faresmohamed260/fares-uniform/actions/runs/34988776124), job `104447662507`, exact source `289731278043c2b01cf1305e2580fa6c02a66819`, passed runtime-role/activity, schema ownership, ACL/default privilege and installed-module inspection. SQL query text is omitted from diagnostic output.

The following documentation-only evidence commits do not alter validated application code. Their verification is remote read-back and consistency review; no new full application-suite or redeployment claim is made.