# Fares Uniform — current handoff

## Start here

Work remotely in `faresmohamed260/fares-uniform`, branch `phase-8/commercial-staging-readiness`. Read this file, `AGENTS.md`, `docs/README.md`, `docs/DECISIONS.md`, and the active Phase 8/8A contracts. Resolve the branch HEAD through GitHub before each write. Never infer current state from the default branch or an old chat.

This file owns current status and the next task. Phase contracts own scope and exit criteria; validation documents own historical evidence. Do not copy a second current-status log into the documentation index.

## Delivery state

Phases 0–7 are complete within their documented repository/CI scope. This covers product/stock/access, offline POS, preorders/collection, returns/exchanges, production queues, business orders, public catalog/enquiry, reporting, integrated synthetic UAT, Arabic polish, recovery packaging and stateless Vercel adaptation.

Historical business-application authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, run `34700625051`: 149 tests, repeatable seven-addon upgrade and 8 public browser tests. Phase 7 final authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`; runtime checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

**Phase 8A live staging remains in progress. Production remains NO-GO.** The remaining staging acceptance work is not a regression to earlier phase completion.

## Current staging identity

- Vercel project: `fares-uniform`, `prj_DlKEwDdJZBgfTyaej5hP65Z9NSvS`, team `team_r09C6RLmb2acHapENECQIn9T`.
- Deployed application SHA: `2a74e93b1828c16839ba7cede336caa4ca374306`.
- Exact READY deployment observed by smoke: `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg`.
- Canonical staging: https://fares-uniform.vercel.app
- Supabase project: `urqlxisivowkmsfisjek`; provider database `postgres`; Session Pooler `aws-0-eu-central-1.pooler.supabase.com:5432`.
- Runtime role: `fares_app`; pooler username `fares_app.urqlxisivowkmsfisjek`; TLS required.
- Expected database epoch: `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`.
- Runtime privilege seal: run `34898140110` passed with 988 app-owned relations, LOGIN enabled, schema CREATE revoked, provider extensions/session table intact.

Branch HEAD, deployed application SHA and historical full-suite authority are different identities. A documentation/workflow commit does not redeploy the application or become a new full business-suite proof.

## Current repair evidence

See [staging repair and cleanup evidence](docs/validation/PHASE_8_HANDOFF_REPAIR.md) for the exact new results.

Bounded live public enquiry proof is GREEN at workflow source `cc056ee19ece534990b2d8885b6bd843e4324fbc`, run `34990008655`, job `104451908443`. The immutable deployed application remains `2a74e93b1828c16839ba7cede336caa4ca374306`.

Live attachment/authenticated-session continuity is GREEN at workflow source `f3c8243d034d4cd6f15e2187d12957bf704a8f9e`, run `35005403008`, job `104503776621`. Two fresh exact-image runtimes proved an 84-character authenticated cookie and database-backed attachment survive complete runtime replacement; the epoch/provider/privilege seal remained intact with zero sale/payment/stock deltas.

The bounded external-cron proof harness was introduced at `c8d201c6b498cb53de0133c1fd2ecf2201e00af9`. Its first hosted RED is run `35023213198`, job `104563848220`; it stopped before synthetic mutation. Read-only diagnosis then established the Odoo 19 storage detail that raw SQL must use stored `ir_cron.cron_name` rather than the delegated ORM `name` field. The final diagnostic source `81c55b914abae3468b05456fa45545fe505c095f`, run `35024524146`, job `104568215429`, is GREEN and reconfirms the exact database epoch and privilege/provider seal with session rows `5`, sale orders `0`, payments `0`, pickings `0`, `fu_uat=0`, database-backed attachments, schema `CREATE=false`, 988 app-owned relations and no synthetic cron/marker residue.

That diagnostic also found a genuine fail-closed staging blocker: `19` active non-synthetic cron jobs are already due, all with `lastcall = NULL`. They include ordinary Odoo/Fares work such as mail/SMS queues, accounting auto-post, procurement, stock valuation, CRM IAP and `Fares Uniform: Evaluate preorder production demand`. Do not run, disable, reschedule or otherwise drain these jobs merely to make the proof green. The cron/native-locking mutation proof remains blocked until there is an explicitly authorized treatment for this pre-existing ordinary cron backlog.

Preserved RED evidence:
- fixture run `34963582581`: runtime database authentication failed before fixture execution, then repeated attempts triggered the pooler's authentication circuit breaker;
- smoke run `34964093451`: immutable deployment HTTP 200 passed, synthetic catalog entry remained invisible for 48 attempts, later bilingual/exposure checks were skipped;
- cron run `35023213198`, job `104563848220`: exact-image/deployment/secret/runtime checks passed, then the live preflight stopped before synthetic mutation; subsequent read-only diagnostics isolated the Odoo 19 raw-SQL field issue and the independent 19-job due backlog.

Do not retry database authentication blindly or rotate a working runtime credential by inference. Fixture execution must use explicit decrypted credentials without printing values, preserve the deployment epoch and sealed schema privileges, and write only the named synthetic fixture.

## Next tasks, in order

1. Live bounded public enquiry/no-price-no-stock proof is GREEN at `cc056ee19ece534990b2d8885b6bd843e4324fbc`, run `34990008655`, job `104451908443`; live attachment/authenticated-session continuity is GREEN at `f3c8243d034d4cd6f15e2187d12957bf704a8f9e`, run `35005403008`, job `104503776621`.
2. External cron/native-locking proof is the active Gate C blocker. Preserve the fail-closed rule: no synthetic mutation while any ordinary cron is due. Current read-only evidence is `81c55b914abae3468b05456fa45545fe505c095f`, run `35024524146`, job `104568215429`, with 19 ordinary due jobs and no synthetic residue. Resolve that backlog only through an explicitly authorized staging policy; do not drain or reschedule it by inference.
3. Once the cron boundary is safely GREEN, complete WebSocket reconnect/replay, managed backup/destructive restore in the authorized rehearsal boundary, monitoring/alert ownership, and live synthetic business-flow acceptance.
4. Reconcile the branch/PR release stack as a separate reviewable integration task. Only four early-phase draft PRs currently exist. `main` is historical, not the current application. Do not merge or delete phase branches without explicit authorization.
5. Gate D requires named staff/roles/training, device acceptance, real-data cutover/reconciliation, production access/domains/secrets, backup retention/RPO/RTO, monitoring owners and explicit production GO.

## Constraints for every continuation

Remote GitHub source edits and hosted execution only. No local/scratch source, builds or artifacts. No force push, broad Odoo exposure, real business data, `fu_uat` in staging/production, transaction pooling, routine provider-admin Odoo, paid upgrades or production cutover.

Odoo owns operational truth. Public Next.js exposes allowlisted catalog/enquiry only, never price or stock. Cash/confirmed-InstaPay and existing offline/role/location rules remain unchanged. Deferred commercial/accounting policies remain deferred.

Secret names/custody: [inventory](docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md). WANDA is restricted to secret management when necessary; it is not a development workspace or general provider control plane.