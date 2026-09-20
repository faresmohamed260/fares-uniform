# Fares Uniform — current handoff

## Start here

Work remotely in `faresmohamed260/fares-uniform` on active branch `phase-10/public-site-productionization`. Phase 10 is stacked on the unmerged `phase-9/public-site-kinetic-prototype` branch so the accepted visual/audit history remains in ancestry without merging PR #7; `main` remains the production/integration baseline. Read this file, `AGENTS.md`, `docs/README.md`, `docs/DECISIONS.md`, the Phase 10 contract/validation record and the Phase 9 visual authority before changing public-site work. Resolve the target branch HEAD and newest hosted evidence through GitHub before each write. Never infer current state from an old chat.

This file owns current status and the next task. `docs/PROJECT_TRACKS.md` owns the durable separation and checklist index for the public-site and ERP/Odoo tracks. Phase contracts own scope and exit criteria; validation documents own historical evidence. Do not copy a second current-status log into the documentation index.

## Delivery-track split

- **Track A — Public website:** active now. Phase 10 Workstreams 10.1–10.3 are GREEN; Workstream 10.4 functional migration slices A–D are GREEN. Workstream 10.5 accessibility/motion hardening is next; final visual compare-and-correct remains open. This track covers the Fares-led public site, KGC/future client showcases, product catalog, public enquiry, EN/AR, Pattern in Motion and public R2 media.
- **Track B — ERP/Odoo:** core MVP engineering, Gate C staging acceptance and Phase 0–8 release integration are complete. Remaining work is Gate D, production ownership/operations, real-business configuration/onboarding and controlled launch readiness.

Do not treat progress or authorization in one track as progress or authorization in the other. See [docs/PROJECT_TRACKS.md](docs/PROJECT_TRACKS.md) for both checklists.

## Active Phase 9 visual authority

The current rendered implementation authority is `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256` on `phase-9/public-site-kinetic-prototype`. Push run `35529953588`, job `106128675433`, passed locked install, TypeScript typecheck, optimized production build, private R2 review-media staging and **8/8 Playwright journeys**. Review artifact `10610259627` has digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`.

D-054 selects Cloudflare R2 as the object-storage layer. Bootstrap run `35525401012`, job `106116558010`, created and verified three private Standard buckets: `fares-uniform-media-public`, `fares-uniform-media-private` and `fares-uniform-backups`; public `r2.dev` access remained disabled and no custom domain was attached. One-shot transfer run `35528055553`, job `106123589186`, copied only the six D-053-authorized KGC originals into `fares-uniform-media-private/kgc/review/` with exact byte-count/SHA-256 checks. Temporary ingest infrastructure was removed by GREEN cleanup run `35528399852`, job `106124509690`.

The active KGC review uses only manifest-backed original worn/model anchors and original High/Summer front/back packshots. Synthetic KGC people, garments and fabricated construction layers are absent. Where the approved boards depict construction that the source media does not actually contain, D-048/D-053 require the truthful annotated flat/front-back fallback instead of invented layers. Harbor House remains the clearly synthetic non-school generalization fixture.

The preserved Pattern in Motion boards remain the visual design authority. Fresh desktop, English mobile, Arabic RTL and inspector captures from artifact `10610259627` were compared directly against those boards after the final geometry pass. Composition, typography, color, responsive behavior, RTL, keyboard focus, touch targets, reduced-motion information parity and the D-053 original-media boundary are GREEN for this isolated prototype. The intentional flat-packshot construction fallback is a source-truth constraint, not an unresolved synthetic-media substitution.

PR #7 remains draft pending Fares's explicit visual approval. Production `apps/public-web`, public KGC publication, launch and Gate D remain NO-GO. The broad repository secret `CLOUDFLARE_API_TOKEN` is currently confined to hosted provider/review staging; any production object data plane must replace it with a narrowly scoped R2 credential before production GO.

Use this Phase 9 checkpoint as the visual authority while Phase 10 productionization proceeds. Do not revive the superseded Google service-account path, publish KGC by inference or rewrite the prototype merely to simplify production architecture. PR #7 remains draft unless Fares separately authorizes its merge/state change.

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

Fares accepted the execution-ready [Phase 10 public-site productionization](docs/phases/PHASE_10_PUBLIC_SITE_PRODUCTIONIZATION.md) plan on 2026-09-20 and authorized repository engineering, hosted CI and provider work required by that contract. This authorization does **not** merge PR #7, approve production launch/cutover, approve Gate D, publish KGC/other real-client media, expose price/stock or broaden privileges.

## Active Phase 10 productionization

Phase 10 runs on `phase-10/public-site-productionization`; draft PR #8 is intentionally stacked against `phase-9/public-site-kinetic-prototype`. PR #7 remains draft and unmerged.

Workstream 10.1 is GREEN. The contract-only commit `dceb1b5f35dcd6837cf6509d6e2a24eb98b3a435` preserved the required RED at run `35535262459`, job `106143034778`: the V1 tests remained present while the new V2 model tests failed because `fu.public.organization` and the new editorial graph did not yet exist (`4 failed, 0 error(s)`). Artifact `10612795839` has digest `sha256:88a248d91dacb1af36ee6458875fbfc80b8ab76e4d79218ff1c904b8a32ec6c9`.

Implementation commit `1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d` added the smallest dedicated organization/program/cohort/look/garment/media models, strict publication/rights filtering, V2 home/work/project GET routes and exact public serializers while retaining V1. Exact-head push run `35535480047`, job `106143624278`, is GREEN: Odoo executed 12 post-test methods, reported `fu_public_api: 22 tests`, finished with `0 failed, 0 error(s)`, and then completed the repeatable `fu_core,fu_public_api` upgrade. Artifact `10612715734` has digest `sha256:1227670137d266e016e6c925d54d529347cf9526df0d04d228934c7f0c2974a9`.

The V2 boundary is source-controlled in `contracts/public-api-v2.openapi.json`; tests prove strict EN/AR locale behavior, unknown/unpublished slug 404s, rights-private records absent, and no operational IDs, price, stock, SKU/barcode or private R2 object keys in the public payload. Detailed evidence is in [Phase 10 validation](docs/validation/PHASE_10_PUBLIC_SITE_PRODUCTIONIZATION.md).

Workstream 10.2 is GREEN. Synthetic seed commit `5ca8dfea51bc52160a64d1a8471c47e33b925cd6` produced the deterministic private source object in `fares-uniform-media-private` at run `35538270515`, job `106151129369`, while reconfirming the private bucket has no managed `r2.dev` delivery and no custom domain. Artifact `10613679190` has digest `sha256:8e9663769797259e1620f8fb7241447476853e379adec0f870edcf5784627003`.

The required provider RED is preserved at commit `874a32e5bc9304df8aa8b67ddda4086f24513e23`, run `35537516748`, job `106149079993`: the publication workflow failed closed before mutation because no narrow R2 credentials existed. Artifact `10612704649` has digest `sha256:e3e1d3b4e2db25a8b430f146ac3857609100458d6951fcc0842252747f1f96d6`.

Exact-head publication authority is `758cf5889e25e62e46db4e2c3c9cacd46105c6ab`. Run `35538533822`, job `106151844125`, is GREEN using one-hour bucket-scoped Cloudflare account tokens: private-read was denied `403` on the public bucket, public-write was denied `403` on the private bucket, the 507-byte synthetic derivative matched SHA-256 `9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb`, immutable cache metadata was verified, the broad Cloudflare token was absent from the data-plane step, and both ephemeral tokens were revoked in cleanup. Artifact `10613846012` has digest `sha256:cdead7ddffa0ba393600e2b674bd0da872ee652f0a2f2ae1f408610084905bf2`.

The same exact head passed Odoo V1+V2 regression run `35538533842`, job `106151844070`: 13 post-test methods / 23 addon tests, `0 failed, 0 error(s)`, followed by the repeatable public-addon upgrade. Artifact `10613553442` has digest `sha256:889da64179b041005c92a832dae10e818db4de394ff3b8fa01efc9c25e12ab6e`. Public DTOs keep private/public object identity and hashes internal and reject the R2 S3 API hostname as a browser-facing public URL.

Workstream 10.3 is GREEN. Preserved contract RED commit `9189c80ab8a603c19bfd735df3652e2d380220c1` failed exact push run `35540594733`, job `106157401728`, with five of six new foundation checks RED before canonical locale routing and the new production shell existed. Implementation commit `8421610dc2cc2806a4a2a270284c888092e4d956` introduced the canonical `/[locale]` production structure, deterministic Inter/Noto Sans Arabic fonts, server-rendered `lang`/`dir`, metadata/canonical/hreflang, Fares-led shell, strict V2 runtime client and representative work route. Its first browser run exposed only an ambiguous test locator because the page correctly contained two “Explore our work” links; commit `4584dea94e1850a64923be1ce2e25d712e31d258` narrowed the test to the hero CTA and passed exact push run `35542018665`.

Final 10.3 authority is `df1d9741087466edead5c358556b91ca4371f910`, which added the localized fail-safe public error boundary. Exact push run `35542111158`, job `106161514846`, passed locked install, TypeScript typecheck, optimized Next.js production build and **6/6 Phase 10 browser checks** covering root canonical redirect, EN/AR SSR document attributes, Fares-led canonical/hreflang metadata, keyboard focus, Arabic mobile RTL/no overflow, work discovery, payload no-leak checks and fail-closed unknown routes. Artifact `10614518679` has digest `sha256:963b9e1585202ccae9c34f15e91f3eecb3d3c53ab6c6712a0d18a0969241d9f8`.

Workstream 10.4 is ACTIVE. The first production migration slice is GREEN. Contract commit `50e518e2366b4b268ca15a43dbc9f3a7687038cd` preserved a meaningful RED in run `35542377221`, job `106162244837`: 4 of 5 Pattern migration checks failed because selected-work cards were not canonical project links and `/[locale]/work/[organization]/[program]` did not exist. RED artifact `10615062850` has digest `sha256:63a7d3f78896f5f627766a2710a69c6c0d63c7522318c08b5ba55b4c4799b60e` and includes the committed Phase 9 reference boards beside failure captures.

Implementation commit `18fe61434ae5aa9781d8433e9aefc0ecfb2cd1e6` migrated the Fares introduction/selected-work entry and generic project introduction into `apps/public-web`: deterministic editorial display typography, a reduced-motion-aware Motion material-study island, canonical selected-work/project links, generic V2 project routing, controlled project-skin CSS variables, EN/AR canonical metadata and RTL project presentation. It contains no KGC/client-ID branching and uses only the synthetic Harbor House fixture. Exact Pattern push run `35542574565`, job `106162789534`, passed typecheck, optimized build and **5/5 Pattern migration checks**; artifact `10615636464`, digest `sha256:63d55b84618639b6a16c6cdbf96e232d68138d5e1953614a986774399161bd3e`, contains the current EN desktop/AR mobile captures plus the approved Phase 9 landing boards. Exact foundation regression run `35542573884`, job `106162787065`, is also GREEN; artifact `10614559213`, digest `sha256:c39fd9a7473a96d175e0f53acb7ab3db536b23d66d46bd135b65d9d763828aa3`.

Workstream 10.4 Slice B is GREEN. Contract commit `f653e64915c4a233ccaec8019f7a3ad38b2f68e6` preserved RED at run `35542784351`, job `106163354327`: the existing five Slice A checks stayed GREEN while the two new generic cohort/look continuity checks failed because no role rail or addressed look state existed. RED artifact `10615432669` has digest `sha256:3d38a7c415cfa8c2c47f9cc4e4b8c6052049308586f2807e54bae3c420f8c363`.

Implementation commit `0eda6bcd6611b8790081ea90491c339efe1fa1b4` added a generic V2-driven role/look continuity island and a three-role synthetic hospitality fixture. Shared looks persist when valid across roles; role changes replace only unsupported looks; selected role/look state is URL-addressable; active garment identity follows the selected look; Arabic direct-entry and RTL are preserved. No school-stage count or organization identity controls the component. Exact Pattern run `35543416489`, job `106165042260`, passed typecheck, optimized build and **7/7 migration checks**; artifact `10615691405` has digest `sha256:3eeda14a7e3d35d7383a8be0f39922eb288519c6f07e3624315573ae4937175c`. Exact foundation regression run `35543416418`, job `106165042091`, is GREEN; artifact `10615129214`, digest `sha256:1ecfc8b27d8dac861137ea7bef26ed65ecd35272a434581b49efe88c4d54f940`.

Workstream 10.4 Slice C is GREEN. Contract commit `0e6ee64bed055e1b333d25bec8fa005c3209760c` preserved RED at run `35543546283`, job `106165415096`: 8 existing checks passed while the two new inspection journeys failed because active garments were not links and the canonical garment route did not exist. RED artifact `10615646955` has digest `sha256:65990e5784583f11b89d7251d5a95a7fb39ab5f4d47e55f2cc896332a0b02946`.

Implementation commit `204b7ce0bf82e1f6a32fbb739ac93e3559598324` added canonical `/[locale]/work/[organization]/[program]/[garment]` routes, context-preserving garment links, localized metadata, a truthful flat-view fallback and a capability check that permits exploded presentation only when both the V2 garment contract and published layer media support it. The synthetic fixture remains flat, so no unsupported exploded construction is fabricated. Exact Pattern run `35543688161`, job `106165752586`, passed typecheck, optimized build and **10/10 migration checks**; artifact `10615144689` has digest `sha256:66d84f155f99ce60ee8d98e6fe3995a9f5478226d2d3dbbfc06ecd9d6e1e0c5c`. Exact foundation regression run `35543688160`, job `106165752798`, is GREEN; artifact `10615780599`, digest `sha256:c203f1d2d447b7dafebf259d2a79e05ecb3e5feb7f0a9749e1edd81fa3b50916`.

Workstream 10.4 Slice D — contextual enquiry handoff — is GREEN. Contract commit `670b37261ae7904214d88f6b9b217b783c897726` preserved RED at run `35543839523`, job `106166197034`: the first ten migration checks stayed GREEN while the two new enquiry-context journeys failed because project/look and garment views had no contextual enquiry links. RED artifact `10615199878` has digest `sha256:d33a9f986b6e4ea5294b3621def84bb069a3b8bb9faf5b6a319de84c0630ef0f`.

Implementation commit `ea13f40a7897b51994066e2a0be011e559d3056d` added context-preserving project/look and garment enquiry links and server-side validation of organization/program/role/look/garment query state before prefilling the existing enquiry form. The public intake schema remains unchanged: context is represented only through the already-approved organization, sector and message fields, and project/garment handoff does not misuse `source_product_slug`. Exact Pattern run `35544749528`, job `106168556671`, passed typecheck, optimized build and **12/12 migration checks**; artifact `10616606046`, digest `sha256:5578394a2b9f43165942e1dfe3bada34593134d10dea07e38a40c96125bb4c0a`. Exact foundation regression run `35544749469`, job `106168556339`, passed **6/6 foundation checks**; artifact `10615896677`, digest `sha256:0a3e4b35957883bc8fdf491a0f5df0bf757bfea037104d3bed906eba4f67acff`.

Next: Workstream 10.5 — accessibility and motion hardening across the migrated production routes, including keyboard semantics, practical touch targets, reduced-motion parity, media/fallback accessibility and representative EN/AR checks. Workstream 10.6 remains the separate backend enquiry-hardening boundary. Final visual parity/sign-off remains open. Production launch, Gate D, public KGC/client publication and PR #7/#8 merge remain NO-GO.

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
