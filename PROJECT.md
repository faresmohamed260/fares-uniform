# Fares Uniform — current handoff

## Start here

Work remotely in `faresmohamed260/fares-uniform` on active branch `phase-9/public-site-kinetic-prototype`; `main` remains the unchanged production/integration baseline for this prototype. The completed `phase-8/commercial-staging-readiness` branch and all earlier phase branches remain preserved. Read this file, `AGENTS.md`, `docs/README.md`, `docs/DECISIONS.md`, the Phase 8/8A contracts and the active Phase 9 contract. Resolve the target branch HEAD through GitHub before each write. Never infer current state from an old chat.

This file owns current status and the next task. Phase contracts own scope and exit criteria; validation documents own historical evidence. Do not copy a second current-status log into the documentation index.

## Active Phase 9 visual authority

The current rendered implementation authority is `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256` on `phase-9/public-site-kinetic-prototype`. Push run `35529953588`, job `106128675433`, passed locked install, TypeScript typecheck, optimized production build, private R2 review-media staging and **8/8 Playwright journeys**. Review artifact `10610259627` has digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`.

D-054 selects Cloudflare R2 as the object-storage layer. Bootstrap run `35525401012`, job `106116558010`, created and verified three private Standard buckets: `fares-uniform-media-public`, `fares-uniform-media-private` and `fares-uniform-backups`; public `r2.dev` access remained disabled and no custom domain was attached. One-shot transfer run `35528055553`, job `106123589186`, copied only the six D-053-authorized KGC originals into `fares-uniform-media-private/kgc/review/` with exact byte-count/SHA-256 checks. Temporary ingest infrastructure was removed by GREEN cleanup run `35528399852`, job `106124509690`.

The active KGC review uses only manifest-backed original worn/model anchors and original High/Summer front/back packshots. Synthetic KGC people, garments and fabricated construction layers are absent. Where the approved boards depict construction that the source media does not actually contain, D-048/D-053 require the truthful annotated flat/front-back fallback instead of invented layers. Harbor House remains the clearly synthetic non-school generalization fixture.

The preserved Pattern in Motion boards remain the visual design authority. Fresh desktop, English mobile, Arabic RTL and inspector captures from artifact `10610259627` were compared directly against those boards after the final geometry pass. Composition, typography, color, responsive behavior, RTL, keyboard focus, touch targets, reduced-motion information parity and the D-053 original-media boundary are GREEN for this isolated prototype. The intentional flat-packshot construction fallback is a source-truth constraint, not an unresolved synthetic-media substitution.

PR #7 remains draft pending Fares's explicit visual approval. Production `apps/public-web`, public KGC publication, launch and Gate D remain NO-GO. The broad repository secret `CLOUDFLARE_API_TOKEN` is currently confined to hosted provider/review staging; any production object data plane must replace it with a narrowly scoped R2 credential before production GO.

Continuation order: verify current branch HEAD and latest Phase 9 run, then use this checkpoint as the current prototype handoff. Do not revive the superseded Google service-account path. Further changes should be driven by Fares's design feedback or a separately authorized production/public-media phase.

## Public-site production architecture audit

A professional architecture audit is complete at branch baseline `257a26dcf2c9b42e718238023b0264c6f30fda2a`: [Public site production architecture review](docs/architecture/PUBLIC_SITE_PRODUCTION_ARCHITECTURE_REVIEW.md).

The audit preserves the approved Pattern in Motion goal but concludes that the Phase 9 prototype must **not** be promoted wholesale into `apps/public-web`. The current production app and the visual prototype are separate Next.js architectures, the production five-field catalog contract cannot express the approved multi-organization project model, and the prototype contains review-only KGC branching, append-only CSS overrides, query-state/i18n shortcuts and no real enquiry integration.

The recommended productionization direction is:
- keep `apps/public-web` as the single production frontend;
- add a versioned Odoo public editorial/showcase contract rather than hard-coding projects in frontend source;
- keep Odoo as business/editorial publication authority and R2 as media-byte authority;
- promote only rights-approved derivatives from private to public R2;
- use canonical `/en` and `/ar` server-rendered routes;
- render static story content as Server Components and hydrate only interaction islands;
- remove organization-ID branching and drive inspection/motion from content capabilities;
- rebuild the final settled visual CSS into semantic tokens/component-scoped styles while preserving `4120c33…` as the visual authority;
- integrate contextual enquiry, abuse/error hardening, SEO, cache/resilience, accessibility and performance gates before cutover.

A proposed execution-ready contract is recorded at [Phase 10 public-site productionization](docs/phases/PHASE_10_PUBLIC_SITE_PRODUCTIONIZATION.md). Its status is **PROPOSED / NOT YET AUTHORIZED**. No production runtime code was changed by this audit.

Next decision: Fares reviews/accepts or revises the architecture plan. After explicit acceptance and Phase 9 visual sign-off, close/merge Phase 9 only if separately authorized, then execute Phase 10 on a dedicated branch. Production launch/Gate D remain NO-GO.

## Delivery state

Phases 0–7 are complete within their documented repository/CI scope. This covers product/stock/access, offline POS, preorders/collection, returns/exchanges, production queues, business orders, public catalog/enquiry, reporting, integrated synthetic UAT, Arabic polish, recovery packaging and stateless Vercel adaptation.

Historical business-application authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`, run `34700625051`: 149 tests, repeatable seven-addon upgrade and 8 public browser tests. Phase 7 final authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`; runtime checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

**Phase 8 Gate C live staging technical acceptance is PASS and release integration is complete. Production remains NO-GO.** Gate D remains separate from the completed staging proof and default-branch integration.

## Release integration checkpoint

PR [#6](https://github.com/faresmohamed260/fares-uniform/pull/6) merged the complete linear Phase 0–8 stack into `main` with history-preserving merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`. All phase branches remain preserved; none was deleted.

Exact integrated candidate `de85450cf1c1774a432c5dfd600b6d4596bc2450` passed the current Phase 5A, Phase 6 and all four Phase 7 hosted workflows. The Phase 5A run passed 149/149 Odoo tests, the repeatable seven-production-addon upgrade and 8/8 public browser tests. Phase 6 passed package, persistence and destructive clean-volume restore. Phase 7 passed stateless runtime, external cron, WebSocket continuity and Vercel project configuration. Exact run/job/artifact evidence is recorded in [release integration validation](docs/validation/RELEASE_INTEGRATION.md).

The integration correction only aligned stale pre-deployment workflow source guards with deployed application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`; it did not change application source or deploy anything. Superseded one-off Phase 8 diagnosis/repair/preflight workflows and their patch payload were removed after their immutable RED/GREEN history had been recorded. The permanent proof workflows and documentation remain.

Release integration is complete. The default-branch observability schedule is active. Manual run `35099333740`, job `104804477793`, and the first observed native scheduled run `35129331378`, job `104906119150`, are GREEN. The first scheduled run used exact `main` source `c2a93d8d693f47ebc7b286af5eaebb485895d8c0`, observed zero Vercel runtime errors/HTTP 5xx, retained the 19-job known cron backlog with zero failing crons and zero stuck transactions, and required managed recovery `35068971581` to remain GREEN. Later native scheduled run `35146487731`, job `104963791652`, is also GREEN at source `d236ec30c59521278d86fcb5abc59abcf25361a3`. Phase-branch deletion, Gate D and production cutover remain separately authorized boundaries.
## Accepted production direction

The client reconfirmed the intended platform split on 2026-09-16:

- **Vercel** owns application hosting/runtime;
- **Cloudflare** owns authoritative DNS and the selected edge/proxy direction;
- **Supabase** owns managed PostgreSQL/durable database state;
- **`faresuniform.uk`** is the selected owned public domain.

After explicit client authorization on 2026-09-16, custom-domain wiring completed against the existing Vercel project `fares-uniform` and immutable deployed application `2a74e93b1828c16839ba7cede336caa4ca374306`.

- Cloudflare apex and `www` web records are CNAMEs to Vercel's exact target `35dfccfeeca04397.vercel-dns-017.com`, with proxying disabled.
- Vercel reports **Valid Configuration** for both hostnames.
- `https://faresuniform.uk/` returns HTTP `200` from Vercel with HSTS.
- `https://www.faresuniform.uk/` returns HTTP `308` to the apex.
- English and Arabic home/catalog/detail rendering passed with no price or stock fields exposed.

The Cloudflare zone remained at 59 records and only the existing apex and `www` web records were changed; mail/TXT and unrelated records were not edited. No application redeploy, database mutation, ordinary-cron execution or production cutover occurred. See [production domain plan](docs/operations/PRODUCTION_DOMAIN_PLAN.md).

This closes the technical DNS/Vercel-verification/TLS portion of GD-02. Production plan/spending, final Cloudflare proxy policy, DNS/certificate and private-access owner roles, remaining Gate D decisions and explicit production GO remain open.
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

Hosted staging observability is GREEN at workflow source `9d65d93c8ce7ff638de61dd4c8c15f2d7c879215`, run `35071292407`, job `104713180912`. It proved the exact READY deployment and EN/AR public surface, retained the narrow Odoo exposure boundary, observed zero Vercel runtime error/fatal records and zero HTTP 5xx in its one-hour window, retained the sealed database/provider facts, kept the known 19-job ordinary cron backlog visible without executing or rescheduling it, observed zero active cron failures and zero idle-in-transaction sessions older than five minutes, and required the latest managed recovery run to remain GREEN. Vercel's project alert-rule API was available and returned one existing rule. The privacy-safe GitHub issue alert transport was self-tested by creating and immediately closing synthetic issue `#5`.

The monitoring contract is documented in `docs/operations/PHASE_8_STAGING_OBSERVABILITY.md`. The source-controlled twice-hourly GitHub schedule is active on `main`. Native scheduled run `35129331378`, job `104906119150`, reconfirmed the exact deployment/public/private boundary, zero aggregate Vercel runtime errors and HTTP 5xx, one available native alert rule, the sealed database/cron facts and latest recovery authority without mutation. Later scheduled run `35146487731`, job `104963791652`, is GREEN at source `d236ec30c59521278d86fcb5abc59abcf25361a3`. Named people, production recipients/escalation and production retention remain Gate D decisions.

The final recovery correction replaced an invalid cross-time raw count equality for `ir_cron_trigger`. Pinned Odoo treats that table as a mutable scheduler wake-up queue, while `ir_cron` is the durable schedule definition. Recovery therefore snapshots the trigger set immediately after `pg_restore`, before the seven-addon upgrade, then proves that complete archive-restored set remains afterward and that no orphan triggers exist; legitimate upgrade-created trigger rows are allowed. This preserves the recovery invariant instead of weakening it.

The connector did not expose sealed stdout for final recovery run `35068971581`, so current backup byte/hash/list-count values are intentionally not copied from older runs. The successful hosted steps, exact run/job/SHA and zero retained artifacts are the authoritative evidence recorded here.

Live production-model business UAT is GREEN at workflow source `48316711e4939e4a2e99f2708093930d430cf602`, run `35081126154`, job `104745121818`, against immutable deployed application `2a74e93b1828c16839ba7cede336caa4ca374306` and database epoch `34892811053:1:2fc625f45bcc6c4bbc3ffc47e3efa58bc8089d7a`. It proved Store/Storage custody and idempotent stock movement; cashier POS through the real `pos.order.sync_from_ui` path with cash payment, picking and posted session accounting; offline authorization revalidation after cashier-role revocation; business sample/quotation, confirmed InstaPay deposit, balance gate/payment, delivery and reporting. Every synthetic fact was rolled back; independent postflight matched business counts and exact ordinary-cron snapshots while retaining the provider/session/extension and least-privilege seals. GitHub reports zero retained artifacts.

Preserved RED run `35078985169`, job `104738120056`, isolated an `AccessError` caused by the harness using Odoo's backend `pos.make.payment` wizard as a cashier. The accepted fix changed the harness to the real POS UI-sync server path; no cashier ACL or production business rule was widened.

Preserved RED evidence:
- live business-UAT run `35074919114`, job `104724933423`: transaction RED with independent exact rollback/postflight GREEN;
- live business-UAT run `35078985169`, job `104738120056`: manager-only `pos.make.payment` harness shortcut rejected for cashier; rollback/postflight GREEN;
- fixture run `34963582581`: runtime database authentication failed before fixture execution, then repeated attempts triggered the pooler's authentication circuit breaker;
- smoke run `34964093451`: immutable deployment HTTP 200 passed, synthetic catalog entry remained invisible for 48 attempts, later bilingual/exposure checks were skipped;
- cron run `35023213198`, job `104563848220`: exact-image/deployment/secret/runtime checks passed, then the live preflight stopped before synthetic mutation; subsequent read-only diagnostics isolated the Odoo 19 raw-SQL field issue and the independent 19-job due backlog;
- recovery run `35062507713`, job `104685620618`: application facts, privilege seal, all business/session counts and durable `ir_cron` count passed; only raw source-preflight versus post-upgrade `ir_cron_trigger` count equality failed, isolating the invalid mutable-queue invariant later corrected at `01824eba60dc55382a614178df3edd4d88997f61`.

Do not retry database authentication blindly or rotate a working runtime credential by inference. Fixture execution must use explicit decrypted credentials without printing values, preserve the deployment epoch and sealed schema privileges, and write only the named synthetic fixture.

## Public-site asset research checkpoint

The connected KGC Google Drive folder was audited on 2026-09-18 and its complete 66-PNG inventory is now documented in the [KGC National media manifest](docs/ui/KGC_MEDIA_MANIFEST.md). The canonical split is 20 authoritative worn/model anchors, 36 visually matched/used packshots, 8 extra/unmatched packshots and 2 supporting references. All current uniform looks are National; no American Diploma content is present.

The manifest preserves Drive file IDs, filenames and direct links without copying image binaries into GitHub. Future concept/content work must treat worn/model images as the current-look authority, use only matched packshots with those anchors, and leave extra packshots unassigned. This audit does not establish publication, school-logo, location-image or other rights approval and does not authorize implementation, deployment or production changes.

## Phase 9 public-site kinetic prototype

Fares authorized the isolated Pattern in Motion implementation on `phase-9/public-site-kinetic-prototype`. The current exact rendered authority is `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256`, run `35529953588`, job `106128675433`, artifact `10610259627` (`sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`), with 8/8 hosted journeys GREEN.

D-053 KGC content truth is now backed by D-054 Cloudflare R2 storage. The six approved originals are private R2 objects, staged ephemerally into the runner and hash-verified before render. The final desktop/mobile/RTL/inspector evidence was compared against the four preserved boards. KGC uses original media only; construction views that lack real separated source layers use the D-048 flat/front-back fallback. Harbor House remains synthetic and proves the organization-agnostic shell.

The implementation checkpoint is ready for Fares's explicit visual sign-off. PR #7 stays draft; production `apps/public-web`, public client-media publication, deployment and Gate D remain excluded.

## Next tasks, in order

1. Keep PR #7 draft. Start the next checkpoint by selecting only the exact original KGC assets needed for the approved High/Summer hero, four-stage progression and inspector from `docs/ui/KGC_MEDIA_MANIFEST.md`; choose and document the smallest review-only delivery mechanism needed by the isolated hosted prototype without turning GitHub or Google Drive into the production asset platform; replace synthetic KGC imagery; use the D-048 annotated flat/front-back fallback where truthful exploded layers do not exist; keep Harbor House synthetic; rerun hosted validation and continue side-by-side board comparison. Update `PROJECT.md`, the Phase 9 contract/validation and `prototype/public-site-motion/design-qa.md` at each verified checkpoint. Do not merge, deploy or begin production `apps/public-web` work without separate authorization.
2. All currently authorized repository, hosted-CI, release-integration and isolated-staging technical work is complete. Preserve `main`, merge commit `29a6835f1e542119f50aa800ddec7fe57f1cf704`, latest scheduled authority run `35146487731` / job `104963791652`, and all phase branches.
3. The client declined the proposed GD-10 repository/environment control changes on 2026-09-16. Do not enable branch protection, Dependabot security updates or a GitHub `production` environment unless later explicitly authorized.
4. Vercel + Cloudflare + Supabase and `faresuniform.uk` are selected. Apex/`www` DNS, Vercel verification, TLS and the canonical redirect are GREEN. Remaining GD-01/GD-02 work is production Vercel plan/spending, final Cloudflare proxy policy, DNS/certificate and private-access owner roles. GD-03 through GD-09 still require client/operator choices or physical/private evidence; GD-10 is deferred. Production remains NO-GO.
5. Do not create production resources, purchase services, activate production secrets, migrate real data, make further domain/DNS changes, assign staff, invent hardware results or cut over without the corresponding explicit Gate D decisions and final production GO.
6. Procurement planning/Purchase/MRP and `stock_valuation_layer` remain outside the accepted first-release scope.
## Constraints for every continuation

Remote GitHub source edits and hosted execution only. No local/scratch source, builds or artifacts. No force push, broad Odoo exposure, real business data, `fu_uat` in staging/production, transaction pooling, routine provider-admin Odoo, paid upgrades or production cutover.

Odoo owns operational truth. Public Next.js exposes allowlisted catalog/enquiry only, never price or stock. Cash/confirmed-InstaPay and existing offline/role/location rules remain unchanged. Deferred commercial/accounting policies remain deferred.

Secret names/custody: [inventory](docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md). WANDA is restricted to secret management when necessary; it is not a development workspace or general provider control plane.
