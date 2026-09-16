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

External cron/native-locking is GREEN at workflow source `59d9553a1f14b6f4a1136ae4089d5289dcefd0e1`, run `35026879234`, job `104575905196`. The proof validated the diagnosed 19-job ordinary backlog, transaction-locked all 20 active ordinary cron rows with `FOR NO KEY UPDATE`, and used Odoo 19 native `SKIP LOCKED` acquisition so two concurrent authenticated external triggers could execute only the synthetic due job. Missing/invalid bearer requests returned `401`; concurrent valid triggers produced exactly one database-backed marker; a repeat trigger produced no duplicate. The synthetic cron and marker were removed, the quarantine transaction rolled back, and exact ordinary-cron and trigger snapshots were unchanged.

Postflight retained epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`, 988 app-owned relations, provider-owned session state/extensions, schema `CREATE=false`, `fu_uat=0`, session rows `5`, and zero sale/payment/stock deltas. No ordinary cron ran, was disabled, rescheduled or otherwise mutated. The deployed application remains `2a74e93b1828c16839ba7cede336caa4ca374306`.

Live WebSocket reconnect/cursor replay is GREEN at workflow source `96e456412495f5b0cb1bb6c20ef00422ed633337`, run `35029061502`, job `104583000465`. An authenticated client received notification `7`, the evented runtime was completely destroyed, a second notification was committed while no evented runtime existed, and a fresh exact-image runtime replayed only the unseen notification from the saved cursor. The 84-character PostgreSQL-backed session remained authenticated. Cleanup removed one synthetic user, partner and session plus two bus rows; postflight proved zero session/sale/payment/stock and ordinary-cron deltas with the provider/privilege seal intact.

Managed backup/export plus destructive isolated restore is GREEN at workflow source `01824eba60dc55382a614178df3edd4d88997f61`, run `35068971581`, job `104705729018`. The hosted run exported the managed `public` schema with PostgreSQL 17.6 tooling, restored only into a disposable PostgreSQL target, repeated the seven-addon upgrade, verified exact application/attachment/session/business facts, retained exact durable `ir_cron` count, preserved every `ir_cron_trigger` row present in the restored archive with zero orphan triggers, resealed provider/runtime privileges, proved the managed source unchanged, published evidence and cleaned up successfully. GitHub reports zero retained workflow artifacts for the run, so no backup archive was retained by Actions.

The final recovery correction replaced an invalid cross-time raw count equality for `ir_cron_trigger`. Pinned Odoo treats that table as a mutable scheduler wake-up queue, while `ir_cron` is the durable schedule definition. Recovery therefore snapshots the trigger set immediately after `pg_restore`, before the seven-addon upgrade, then proves that complete archive-restored set remains afterward and that no orphan triggers exist; legitimate upgrade-created trigger rows are allowed. This preserves the recovery invariant instead of weakening it.

The connector did not expose sealed stdout for final run `35068971581`, so current backup byte/hash/list-count values are intentionally not copied from older runs. The successful hosted steps, exact run/job/SHA and zero retained artifacts are the authoritative evidence recorded here.

Preserved RED evidence:
- fixture run `34963582581`: runtime database authentication failed before fixture execution, then repeated attempts triggered the pooler's authentication circuit breaker;
- smoke run `34964093451`: immutable deployment HTTP 200 passed, synthetic catalog entry remained invisible for 48 attempts, later bilingual/exposure checks were skipped;
- cron run `35023213198`, job `104563848220`: exact-image/deployment/secret/runtime checks passed, then the live preflight stopped before synthetic mutation; subsequent read-only diagnostics isolated the Odoo 19 raw-SQL field issue and the independent 19-job due backlog;
- recovery run `35062507713`, job `104685620618`: application facts, privilege seal, all business/session counts and durable `ir_cron` count passed; only raw source-preflight versus post-upgrade `ir_cron_trigger` count equality failed, isolating the invalid mutable-queue invariant later corrected at `01824eba60dc55382a614178df3edd4d88997f61`.

Do not retry database authentication blindly or rotate a working runtime credential by inference. Fixture execution must use explicit decrypted credentials without printing values, preserve the deployment epoch and sealed schema privileges, and write only the named synthetic fixture.

## Next tasks, in order

1. Live bounded public enquiry/no-price-no-stock, attachment/authenticated-session continuity, external cron/native-locking, WebSocket reconnect/cursor replay, and managed backup/export plus isolated destructive recovery are GREEN. Recovery authority is `01824eba60dc55382a614178df3edd4d88997f61`, run `35068971581`, job `104705729018`.
2. Establish hosted logs/monitoring/alerts with explicit ownership-role labels and privacy/redaction rules. Do not invent staff names or production escalation policy.
3. Complete live synthetic business-flow acceptance for company → branch → warehouse → POS session → order → payment → posting → stock/cash/evidence, plus reorder/supplier/FIFO/credit-customer and offline/outbox/IPC scenarios.
4. Reconcile the branch/PR release stack as a separate reviewable integration task. Only four early-phase draft PRs currently exist. `main` is historical, not the current application. Do not merge or delete phase branches without explicit authorization.
5. Gate D requires named staff/roles/training, device acceptance, real-data cutover/reconciliation, production access/domains/secrets, backup retention/RPO/RTO, monitoring owners and explicit production GO.

## Constraints for every continuation

Remote GitHub source edits and hosted execution only. No local/scratch source, builds or artifacts. No force push, broad Odoo exposure, real business data, `fu_uat` in staging/production, transaction pooling, routine provider-admin Odoo, paid upgrades or production cutover.

Odoo owns operational truth. Public Next.js exposes allowlisted catalog/enquiry only, never price or stock. Cash/confirmed-InstaPay and existing offline/role/location rules remain unchanged. Deferred commercial/accounting policies remain deferred.

Secret names/custody: [inventory](docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md). WANDA is restricted to secret management when necessary; it is not a development workspace or general provider control plane.