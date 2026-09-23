# Fares Uniform — current handoff

## Start here

Work remotely in `faresmohamed260/fares-uniform` on active branch `phase-10/public-site-productionization`. Phase 10 is stacked on the unmerged `phase-9/public-site-kinetic-prototype` branch so the accepted visual/audit history remains in ancestry without merging PR #7; `main` remains the production/integration baseline. Read this file, `AGENTS.md`, `docs/README.md`, `docs/DECISIONS.md`, the Phase 10 contract/validation record and the Phase 9 visual authority before changing public-site work. Resolve the target branch HEAD and newest hosted evidence through GitHub before each write. Never infer current state from an old chat.

This file owns current status and the next task. `docs/PROJECT_TRACKS.md` owns the durable separation and checklist index for the public-site and ERP/Odoo tracks. Phase contracts own scope and exit criteria; validation documents own historical evidence. Do not copy a second current-status log into the documentation index.

## Delivery-track split

- **Track A — Public website:** active now. Phase 10 engineering remains GREEN. D-062 homepage authority is approved and H00–H06 geometry remains frozen. Batches B–E are complete. The exact staged homepage implementation from `42f2b116351a94a7d0c0a2604dd05b686adacf9c` was deployed through workflow-only source commit `1498d32579cf66bee04d38ebd74b854bf65132c5`, which leaves the prototype bundle byte-for-byte unchanged. Push run/job `35801988018` / `106994178255` passed TypeScript, production build and **10/10 D-062 browser checks**; artifact `10726561210` has digest `sha256:ce9e9c4571380d22fc5639648cf12eb33efb1bc1a1eaaa6c88c3a14340c6892f`. Global strict fidelity is GREEN at mean RGB-channel error `24.9517` and high-difference pixels `12.9257%`. The isolated deployment `fares-uniform-design-authority-80gw6ngid.vercel.app` is READY, target `preview`, and Vercel Authentication fails closed with anonymous HTTP `302`. The active next action is Fares review of this exact protected implementation; production remains NO-GO.
- **Track B — ERP/Odoo:** core MVP engineering, Gate C staging acceptance and Phase 0–8 release integration are complete. Remaining work is Gate D, production ownership/operations, real-business configuration/onboarding and controlled launch readiness.

Do not treat progress or authorization in one track as progress or authorization in the other. See [docs/PROJECT_TRACKS.md](docs/PROJECT_TRACKS.md) for both checklists.

## Active UI/UX authority rule

D-059 remains the general public-site design workflow, but D-062 is an explicit homepage exception: Fares approved the committed homepage image itself as the exact visual implementation authority. For the homepage, use [Approved homepage component map](docs/ui/homepage/APPROVED_HOME_VIEW_COMPONENT_MAP.md) and the committed authority asset, implement every mapped component one-to-one, and use screenshot-difference evidence to converge on a carbon copy.

The previous browser homepage candidate `bfdb85d53a76b3f81b521631e39265fea3fb72e1` is now rejected historical evidence. D-062 replaces it with the approved bright modern corporate board and exact component map. The approved page is commercial and content-rich rather than sparse/luxury: navy/white/electric-blue, multi-profession hero, six industry cards, dual capability/process feature band, selected work, building CTA and full footer. Temporary non-product media may be derived from the authority image or generated, but real product/client evidence remains truth-grounded.

## Historical Phase 9 visual reference

The current rendered implementation authority is `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256` on `phase-9/public-site-kinetic-prototype`. Push run `35529953588`, job `106128675433`, passed locked install, TypeScript typecheck, optimized production build, private R2 review-media staging and **8/8 Playwright journeys**. Review artifact `10610259627` has digest `sha256:852ddd4842b562d18bc233bcc0e1db9df8a1497053e98aa5c5974738966971ac`.

D-054 selects Cloudflare R2 as the object-storage layer. Bootstrap run `35525401012`, job `106116558010`, created and verified three private Standard buckets: `fares-uniform-media-public`, `fares-uniform-media-private` and `fares-uniform-backups`; public `r2.dev` access remained disabled and no custom domain was attached. One-shot transfer run `35528055553`, job `106123589186`, copied only the six D-053-authorized KGC originals into `fares-uniform-media-private/kgc/review/` with exact byte-count/SHA-256 checks. Temporary ingest infrastructure was removed by GREEN cleanup run `35528399852`, job `106124509690`.

The active KGC review uses only manifest-backed original worn/model anchors and original High/Summer front/back packshots. Synthetic KGC people, garments and fabricated construction layers are absent. Where the approved boards depict construction that the source media does not actually contain, D-048/D-053 require the truthful annotated flat/front-back fallback instead of invented layers. Harbor House remains the clearly synthetic non-school generalization fixture.

The preserved Pattern in Motion boards remain the visual design authority. Fresh desktop, English mobile, Arabic RTL and inspector captures from artifact `10610259627` were compared directly against those boards after the final geometry pass. Composition, typography, color, responsive behavior, RTL, keyboard focus, touch targets, reduced-motion information parity and the D-053 original-media boundary are GREEN for this isolated prototype. The intentional flat-packshot construction fallback is a source-truth constraint, not an unresolved synthetic-media substitution.

PR #7 remains draft pending Fares's explicit visual approval. Production `apps/public-web`, public KGC publication, launch and Gate D remain NO-GO. The broad repository secret `CLOUDFLARE_API_TOKEN` is currently confined to hosted provider/review staging; any production object data plane must replace it with a narrowly scoped R2 credential before production GO.

As of D-059, use this Phase 9 checkpoint only as historical creative/reference and regression evidence. It is no longer the implementation authority and must not be reverse-engineered pixel-for-pixel into future UI. Do not revive the superseded Google service-account path, publish KGC by inference or rewrite the prototype merely to simplify production architecture. PR #7 remains draft unless Fares separately authorizes its merge/state change.

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

Workstream 10.5 is GREEN. Contract commit `fda94d17891a662cabee45838284196583b41442` preserved RED at run `35544957759`, job `106169106750`: 1/4 accessibility/motion journeys passed while three failed on a 40px mobile skip target, reduced-motion preference not reaching the Motion island, and the synthetic flat garment fallback lacking an image role. RED artifact `10616451586` has digest `sha256:d328c59136d4a24e75649f4256135eb4754923d5bbf4f84408f02421b1227602`.

Implementation commit `c0163d43d6003dd56c8431e1f865a1524c9e5646` added a browser-native reduced-motion preference hook, exposes reduced-motion state on the project continuity island, gives degraded flat garment presentation an accessible image role/name, and enforces practical 44px+ navigation/garment touch targets without changing the accepted information hierarchy. Exact accessibility run `35545089864`, job `106169454594`, passed **4/4** checks in 3.9s; artifact `10616402000`, digest `sha256:b1972ebd65d745607616a44bf3756a92f1d72e8e47d8367641f41984fdf0a6f3`. Exact Pattern regression `35545089857`, job `106169454628`, passed 12/12; exact foundation regression `35545089859`, job `106169454615`, passed 6/6.

Workstream 10.6 is GREEN. Contract commit `f333b7789cb9812a2ed51fe0c69c81b938b7c9af` preserved the broad RED at run `35545407380`, job `106170291685`: all six hardening journeys failed before the production route had the required form-proof, bounded-body, rate, timeout and privacy-safe error behavior. RED artifact `10616432546`, digest `sha256:35012b9563f518dccea76d2d670507a2859f18dfb0120d998b65a170b6b3ac31`.

Implementation commit `fbb6183f4e09dcc2885d16d4b3c502abe8d91109` added a signed short-lived form proof, 16 KiB bounded JSON reader, stable public errors, 8-second Odoo upstream timeout, per-runtime rate safety net and privacy-safe event/status logging. Run `35545612786` improved to 3/6 and exposed a real reverse-proxy origin mismatch. Test-only commit `0ef73122ae4d952bf4b21dbef2ecd1fcb58a6951` preserved that RED through real browser-origin fetches. Final fix `408a381032736b62ab44d4eefd31782839c68512` validates Origin against the trusted forwarded host/proto boundary.

Exact 10.6 authority is `408a381032736b62ab44d4eefd31782839c68512`. Enquiry run `35545824164`, job `106171404548`, passed **6/6** hardening checks; artifact `10616248547`, digest `sha256:d86381373a2bca8306bcad6e935740f680f48988db740f652de8234ea9580130`. Same-SHA regressions are GREEN: Pattern run/job `35545824166` / `106171404365`, foundation `35545824177` / `106171404378`, and accessibility/motion `35545824174` / `106171404358`.

Workstream 10.7 is GREEN. The meaningful product RED is commit `93e3731825f307b5d865f660121a62adedaf1348`, run `35547637216`, job `106176328338`: typecheck/build passed, metadata and resource-budget checks were already GREEN, but `robots.txt` was missing and the homepage made two upstream reads instead of one cached read. Artifact `10617840194`, digest `sha256:0d5440c53ff623ebc8a27d7909d5c0381d5f80c701a241c47bc4676c879ea188`.

Implementation commit `b19d4bc375c9cfc02bd5d8cd1ba21ab642fbaa5b` added Next public-content revalidation plus sitemap/robots. Follow-up fixture-state corrections `29df2262c34348686538caf91a085a9b75ff1f8b` and `30005261389023eb13e8dbef914326f5781ab916` made the transient-failure proof deterministic across route workers and expired the cache before the failure revalidation. Exact cache/SEO/performance authority is `30005261389023eb13e8dbef914326f5781ab916`, run `35549416991`, job `106181267052`: **4/4 GREEN**, including one-read cache reuse, stale-published content surviving a synthetic upstream 503 during revalidation, canonical sitemap/robots/metadata, and the mobile resource budget with at most one eager image. Artifact `10617014586`, digest `sha256:90c8571accd3c0abbcf4ec9b4a9df25b60f3e1aa7e3fc88fb1c7f1be939f92de`.

The R2 browser-delivery boundary is also GREEN. Provider RED commit `164beaad01d2c30bbbcc232ddf940e7614cace93`, run/job `35549546604` / `106181611340`, failed closed because `media.faresuniform.uk` was not yet configured on the public bucket. Artifact `10618071489`, digest `sha256:756e81763607ba934049ac66827d6b2274b46d1838441711c387efd8c3b8ccc2`. After the provider-mutation workflow was added and its credential expression corrected, exact authority `c41a5afcfcf2801a230ce46aa1b1c8d06134fddc`, run/job `35549656743` / `106181910393`, attached and verified `media.faresuniform.uk` on `fares-uniform-media-public`, proved the public bucket contained only the synthetic publication object, verified its exact SHA-256 and `public, max-age=31536000, immutable` cache header plus Cloudflare cache HIT/REVALIDATED behavior, kept managed `r2.dev` delivery disabled, and reconfirmed the private bucket has no custom domain and no managed public delivery. Artifact `10617767603`, digest `sha256:b0c7f20c7618155dea0798c7f2c943e92837772196449456db9fd39b5529978a`. No KGC or real-client media was published.

Workstream 10.8 is GREEN at the hosted engineering boundary. Contract commit `633523683f73a6a74e75577ce01582350268fcf4` defined the one-SHA full candidate and preserved RED in push run `35566791616`, job `106230128427`: static quality, typecheck, optimized build and every functional/browser matrix passed, but evidence staging failed because the workflow referenced a nonexistent `approved-desktop-inspector.png` instead of the committed visual-authority file `approved-garment-inspector.png`. RED artifact `10624089408`, digest `sha256:cec4c3be7260b68c4746ec1b7543d0060e2da8219a6339ade4a553ae5af620ee`, retained the successful rendered/test evidence despite that final staging failure.

Workflow fix `0f5f3528a4eb67953bcb14c5740433a2e2d2bb80` corrected the authority filename and passed exact push run `35609231807`. Cleanup commit `cef36c8f3acec7748ffeb3d955ad1186edf8b57f` removed a redundant resilience proof harness while retaining the established Workstream 10.7 gate. Exact full-candidate run `35609594487`, job `106365093566`, is **GREEN**: source/static-quality gate, TypeScript, optimized Next build, 6/6 foundation checks, 12/12 Pattern migration checks, 4/4 accessibility/motion checks, 6/6 enquiry-hardening checks, 4/4 rendered full-candidate checks and 4/4 cache/SEO/resilience checks all passed. Artifact `10643791534`, digest `sha256:e5cd1f2cb3bbd0efc09a109a73e0f51b58f8788f5223d267e816b29048c902ff`, contains the fresh EN desktop, AR mobile, inspector/reduced-motion evidence together with the committed Phase 9 landing and garment-inspector authority boards.

Next: perform the direct rendered parity review against Phase 9 authority `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256` and obtain Fares's visual acceptance. The Phase 9 executable prototype remains non-runtime evidence only until that review resolves the retirement/retention boundary. Do not call Phase 10 implementation-complete before visual acceptance. Production launch, Gate D, KGC/client publication and PR #7/#8 merge remain NO-GO.

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

## Rendered parity checkpoint

The engineering compare-and-correct pass is complete against Phase 9 visual authority `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256`.

Correction sequence:
- `5b1929abb6bca3ce695a12e25bf0b11d07027587` — restored the editorial Fares shell, Pattern geometry, project/catalog/process composition and truthful garment-inspector presentation without copying prototype-only KGC branches or checkpoint CSS;
- `7d756ae904fd3c34364cc17cf9120db22a7c0281` — restored dedicated mobile Pattern navigation while retaining canonical EN/AR routes;
- `ae7f2230b9255cd3d5c3272f767744534762df23` — preserved the mobile project/enquiry CTA semantics after the navigation correction.

Exact latest-head full-candidate push run `35615691978`, job `106385683974`, is GREEN on `ae7f2230b9255cd3d5c3272f767744534762df23`: foundation 6/6, Pattern 12/12, accessibility/motion 4/4, enquiry hardening 6/6, rendered-candidate 4/4 and cache/SEO/resilience/performance 4/4. Artifact `10646012719`, digest `sha256:46991f2354ffe7cd285b99aeac5502c4c958ab4702a501e876d2cde1d08c8c4c`, contains the latest production captures together with the preserved Phase 9 desktop/mobile/RTL/inspector authority boards. Same-head focused push workflows for Pattern, foundation, accessibility, enquiry and cache/SEO are also GREEN.

This reaches the next human checkpoint: **Fares visual acceptance**. Engineering parity correction is complete; acceptance itself is intentionally not inferred.

### Live visual-review preview

Fares requested a browser-accessible deployment for the visual-acceptance checkpoint. A dedicated, isolated Vercel review project `fares-uniform-phase10-review` was created without changing the real `fares-uniform` project or `faresuniform.uk`.

Review-deployment workflow `.github/workflows/phase10-review-preview.yml` passed at run `35624066871`, job `106413950164`. The workflow proves that `apps/public-web` is byte-for-byte unchanged from visual-review baseline `2dbd586d15d940aac7d78c09273c1ab46a3b31a0`, enables only `FU_PUBLIC_PROVIDER=fixture` for the isolated preview, and refuses a production target. Exact review deployment `dpl_38WagekDQv8ieFi9MdWDuonUtpGv` is READY at `fares-uniform-phase10-review-6k85j638v.vercel.app` from workflow commit `d8f130db4579ac1c41bae3303d38c0c983194ebe`; the deployed public-web source remains the accepted `2dbd586d...` baseline because subsequent commits only add/fix the review workflow.

The review deployment uses synthetic Harbor House/catalog fixture content and publishes no KGC or other real-client media. The real `fares-uniform` Vercel project remains on its prior Phase 8 production deployment; this preview is not a public-site cutover or launch authorization.

## Next tasks, in order

1. **Track A / active — Fares visual review:** review the protected D-062 deployment from implementation `42f2b116351a94a7d0c0a2604dd05b686adacf9c` (deployment source `1498d32579cf66bee04d38ebd74b854bf65132c5`) and record approval or requested corrections against that exact implementation.
2. Preserve frozen H00–H06 geometry and the GREEN `<25` mean / `<14%` high-difference limits; do not reopen completed Batches B–E without new evidence or client direction.
3. Keep the current real KGC campus in protected review only; it does **not** authorize public KGC publication.
4. Do not start Schools/KGC/Garments page design until the D-062 homepage implementation review is resolved.
5. The future KGC case-study explode-view remains whole worn outfit -> separated **real** garment pieces.
6. Keep PR merges, public client publication and production cutover separately gated. Production remains NO-GO.
7. **Track B / ERP:** Gate D remains independent.

## Constraints for every continuation

Remote GitHub source edits and hosted execution only. No local/scratch source, builds or artifacts. No force push, broad Odoo exposure, real business data, `fu_uat` in staging/production, transaction pooling, routine provider-admin Odoo, paid upgrades or production cutover.

Odoo owns operational truth. Public Next.js exposes allowlisted catalog/enquiry only, never price or stock. Cash/confirmed-InstaPay and existing offline/role/location rules remain unchanged. Deferred commercial/accounting policies remain deferred.

Secret names/custody: [inventory](docs/operations/PHASE_8_STAGING_SECRET_INVENTORY.md). WANDA is restricted to secret management when necessary; it is not a development workspace or general provider control plane.
