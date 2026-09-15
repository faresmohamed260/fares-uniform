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
## Cleanup

PROJECT.md owns current handoff; root README and docs index point there. Phase 8 contracts retain scope and historical evidence while current repair results live here. Workflow guide identifies retained and retired entry points. Five obsolete diagnostic/one-time mutation workflows removed from the current tree; history preserved. Generated prototype `node_modules`, `.next` and `tsconfig.tsbuildinfo` removed from the tracked tree, with root ignore rules to prevent recurrence. Source and lockfiles retained. Read-only DB diagnostics omit SQL query text.

No business logic changed. The historical 149-test/8-browser-test authority remains `cc2656d7529cfd4af396ddd0af6444a0f6600dc8` / run `34700625051`; this maintenance work is not a new full-suite proof. Phase 8 Gate C remains incomplete and production remains NO-GO. Phase branches and draft PRs remain unmerged.

## Cleanup verification

Remote read-back matched all 12 written files at `289731278043c2b01cf1305e2580fa6c02a66819`. The complete untruncated Git tree has 428 entries; all relative Markdown links in the changed documents resolve, the five retired workflow files and three generated paths are absent, and prototype source/lockfiles remain.

Read-only diagnostics [run 34988776124](https://github.com/faresmohamed260/fares-uniform/actions/runs/34988776124), job `104447662507`, exact source `289731278043c2b01cf1305e2580fa6c02a66819`, passed runtime-role/activity, schema ownership, ACL/default privilege and installed-module inspection. SQL query text is omitted from diagnostic output.

The following documentation-only evidence commit does not alter the validated workflow code. Its verification is remote read-back and link/consistency review; no new full application-suite or redeployment claim is made.
