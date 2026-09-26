# Phase 10 validation — public-site productionization

Status: **WORKSTREAMS 10.1–10.8 ENGINEERING-GREEN — PRIOR IMAGE/PARITY EVIDENCE RETAINED HISTORICALLY — D-059 BROWSER-NATIVE UI/UX AUTHORITY RESET ACTIVE.**

Branch: `phase-10/public-site-productionization`.

Draft review: PR #8 is stacked against `phase-9/public-site-kinetic-prototype`; PR #7 remains draft and unmerged.

Production status: **NO-GO.** Phase 10 authorization covers repository engineering, hosted CI and provider work required by the accepted contract. It does not authorize production launch/cutover, Gate D approval, public KGC/client publication, price/stock exposure or merging PR #7/#8.

## Workstream 10.1 — V2 public contract

### Preserved RED

- commit `dceb1b5f35dcd6837cf6509d6e2a24eb98b3a435` — `test: define Phase 10 V2 public contract`;
- run/job `35535262459` / `106143034778`;
- result: **RED**, `4 failed, 0 error(s) of 12 tests`;
- root cause: the contract correctly required the new public editorial graph before those models/routes existed;
- artifact `10612795839`, digest `sha256:88a248d91dacb1af36ee6458875fbfc80b8ab76e4d79218ff1c904b8a32ec6c9`.

### GREEN

Implementation commit `1d53cb0aa6d26cc8753db3af7f122fb1b5b46e3d`, run `35535480047`, job `106143624278`, passed the exact source-controlled V2 OpenAPI contract, V1 regressions and repeatable `fu_core,fu_public_api` upgrade. Odoo reported 12 post-test methods / `fu_public_api: 22 tests` and `0 failed, 0 error(s)`. Artifact `10612715734` has digest `sha256:1227670137d266e016e6c925d54d529347cf9526df0d04d228934c7f0c2974a9`.

Contract coverage includes strict EN/AR locale behavior, unpublished/unknown 404 behavior, organization/program/cohort/look/garment/media relationships, no operational IDs, no price/cost/stock, no SKU/barcode and no private R2/admin metadata in public payloads.

## Workstream 10.2 — R2 publication boundary

### Preserved provider RED

- commit `874a32e5bc9304df8aa8b67ddda4086f24513e23`;
- publication run/job `35537516748` / `106149079993`;
- result: **RED before mutation** because no narrow R2 credentials existed;
- artifact `10612704649`, digest `sha256:e3e1d3b4e2db25a8b430f146ac3857609100458d6951fcc0842252747f1f96d6`.

The broad Cloudflare token was not substituted into the object data-plane step to obtain GREEN.

### Synthetic private-source seed

Commit `5ca8dfea51bc52160a64d1a8471c47e33b925cd6`, run `35538270515`, job `106151129369`, wrote and read back the deterministic synthetic source at `phase10/synthetic/source/media-publication-proof-v1.svg`, verified SHA-256 `9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb`, and reconfirmed the private bucket has no managed public delivery or custom domain. Artifact `10613679190` has digest `sha256:8e9663769797259e1620f8fb7241447476853e379adec0f870edcf5784627003`.

### Exact-head GREEN

Implementation authority: `758cf5889e25e62e46db4e2c3c9cacd46105c6ab`.

R2 publication run `35538533822`, job `106151844125`, is **GREEN**:

- minted one-hour private-read and public-write Cloudflare account tokens scoped to exactly one R2 bucket each;
- derived masked S3 credentials on-runner;
- object data-plane step had no `CLOUDFLARE_API_TOKEN`;
- private-read credential fetched only the private source and received HTTP `403` against the public bucket;
- public-write credential wrote/read the public derivative and received HTTP `403` against the private bucket;
- public derivative was 507 bytes and hash-addressed at `projects/synthetic-phase10/publication-proof/media-9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb.svg`;
- SHA-256, content type, immutable cache control and object metadata matched;
- both ephemeral account tokens were revoked in the unconditional cleanup step;
- artifact `10613846012`, digest `sha256:cdead7ddffa0ba393600e2b674bd0da872ee652f0a2f2ae1f408610084905bf2`.

The same exact head passed Odoo public-contract run `35538533842`, job `106151844070`:

- 13 post-test methods;
- `fu_public_api: 23 tests`;
- `0 failed, 0 error(s)`;
- repeatable `fu_core,fu_public_api` upgrade GREEN;
- runtime identity `fares_sha=758cf5889e25e62e46db4e2c3c9cacd46105c6ab`, pinned Odoo `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- artifact `10613553442`, digest `sha256:889da64179b041005c92a832dae10e818db4de394ff3b8fa01efc9c25e12ab6e`.

The Odoo contract now requires a hash-addressed public object identity for published media, forbids private/public R2 object identity and hashes from the public DTO, and rejects `*.r2.cloudflarestorage.com` as a browser-facing public media URL.

No KGC or other real-client asset was published. The public R2 bucket still has no browser delivery hostname/custom domain enabled by this work.

## Workstream 10.3 — production public-web foundation

### Preserved RED

- contract commit `9189c80ab8a603c19bfd735df3652e2d380220c1` — `test: define Phase 10 public foundation`;
- exact push run/job `35540594733` / `106157401728`;
- result: **RED**, five of six new browser checks failed while the existing app still lacked canonical locale routing/document attributes/production shell behavior;
- artifact `10614960527`, digest `sha256:cbb782525ab7e32eb89709fda1640a45621721b97056309f767678f1ccdd97ea`.

### Implementation and harness correction

Commit `8421610dc2cc2806a4a2a270284c888092e4d956` built the production foundation: canonical locale routes, SSR `lang`/`dir`, deterministic Inter/Noto Sans Arabic fonts, canonical/hreflang/OpenGraph metadata, Fares-led shell, branded localized routes/404, strict V2 runtime parsing and canonical work discovery. Typecheck and optimized build were GREEN. The remaining browser failure was not a product defect: the selector `getByRole("link", { name: "Explore our work" })` matched both the hero CTA and a selected-work link. Commit `4584dea94e1850a64923be1ce2e25d712e31d258` scoped the contract to the hero CTA without weakening the navigation requirement. Exact push run `35542018665` then passed 6/6 foundation checks; artifact `10614932515`, digest `sha256:d5d60cfabc38fd087590c8e24067916eaaf6a5c84e21b697609b27c6d7199ba9`.

### Exact-head GREEN

Final implementation authority: `df1d9741087466edead5c358556b91ca4371f910`.

Exact push run `35542111158`, job `106161514846`, is **GREEN**:

- locked dependency install passed;
- TypeScript typecheck passed;
- optimized Next.js production build passed;
- 6/6 Phase 10 foundation Playwright checks passed in 4.0s;
- root redirects canonically to `/en`;
- `/en` and `/ar` return server-rendered document `lang`/`dir`;
- canonical and EN/AR alternate metadata is present;
- the English homepage is Fares-led rather than KGC-led;
- keyboard focus and Arabic mobile RTL/no-overflow checks pass;
- canonical work discovery passes;
- rendered/RSC/JSON response capture remains free of price, stock, inventory, barcode, SKU, cost and EGP leakage terms;
- unknown locale/route requests fail closed;
- localized branded 404 and recoverable error boundaries are present;
- artifact `10614518679`, digest `sha256:963b9e1585202ccae9c34f15e91f3eecb3d3c53ab6c6712a0d18a0969241d9f8`.

No KGC or other real-client media was published and no production deployment/cutover occurred.

## Workstream 10.4 — Pattern in Motion production migration

### Slice A — Fares introduction + selected-work/project entry

#### Preserved RED

- contract commit `50e518e2366b4b268ca15a43dbc9f3a7687038cd` — `test: define first Pattern in Motion production slice`;
- exact push run/job `35542377221` / `106162244837`;
- typecheck and optimized production build passed before the focused browser contract;
- focused result: **4 failed, 1 passed of 5**;
- failures were the intended missing production behavior: selected-work/project cards had no canonical project destination and `/en|ar/work/harbor-house/service-program` returned 404;
- RED artifact `10615062850`, digest `sha256:63a7d3f78896f5f627766a2710a69c6c0d63c7522318c08b5ba55b4c4799b60e`, retained traces/failure captures and the committed Phase 9 landing boards.

#### GREEN

Implementation authority: `18fe61434ae5aa9781d8433e9aefc0ecfb2cd1e6` — `feat: migrate Pattern intro and project entry`.

Exact Pattern push run `35542574565`, job `106162789534`, is **GREEN**:

- locked dependency install, typecheck and optimized Next production build passed;
- 5/5 focused Playwright checks passed in 4.0s;
- Fares introduction retains the approved “Designed as one. Worn together.” hierarchy and supporting copy;
- a reduced-motion-aware Motion material-study island supplies the first bounded kinetic production element without copying the prototype architecture;
- selected work and work discovery link to canonical `/[locale]/work/[organization]/[program]` routes;
- synthetic Harbor House resolves in EN and AR, with canonical/hreflang metadata and RTL/no-overflow checks;
- unknown/unpublished project identity fails closed with 404;
- project skin comes from validated V2 `visual_skin` values through controlled CSS variables rather than organization-ID branching;
- no KGC/client asset is used or published;
- rendered/RSC/JSON response capture remains free of price, stock, inventory, barcode, SKU, cost and private publication metadata terms;
- artifact `10615636464`, digest `sha256:63d55b84618639b6a16c6cdbf96e232d68138d5e1953614a986774399161bd3e`, contains fresh EN desktop/AR mobile captures and the approved Phase 9 landing reference boards.

Companion exact foundation regression run `35542573884`, job `106162787065`, is GREEN with artifact `10614559213`, digest `sha256:c39fd9a7473a96d175e0f53acb7ab3db536b23d66d46bd135b65d9d763828aa3`.

This closes engineering acceptance for Slice A only. Final visual parity is not claimed yet; the full compare-and-correct/sign-off boundary remains open through the remaining 10.4 slices.

### Slice B — generic cohort/role lineup + look continuity

#### Preserved RED

- contract commit `f653e64915c4a233ccaec8019f7a3ad38b2f68e6` — `test: define generic cohort and look continuity`;
- exact push run/job `35542784351` / `106163354327`;
- result: **5 passed, 2 failed of 7**; all Slice A checks stayed GREEN;
- the two new checks failed because the project route had no generic role rail, no role/look controls and no addressable direct-entry state;
- artifact `10615432669`, digest `sha256:3d38a7c415cfa8c2c47f9cc4e4b8c6052049308586f2807e54bae3c420f8c363`.

#### GREEN

Implementation authority: `0eda6bcd6611b8790081ea90491c339efe1fa1b4` — `feat: add generic role and look continuity`.

Exact Pattern push run `35543416489`, job `106165042260`, is **GREEN**:

- locked install, typecheck and optimized production build passed;
- 7/7 focused migration checks passed in 5.1s;
- the synthetic hospitality fixture exposes three generic roles rather than school stages;
- the shared `service` look persists from Front desk to Kitchen because the V2 look contract declares both cohorts;
- switching to Facilities replaces the unsupported shared look with its first valid `utility` look;
- addressed `role=facilities&look=outerwear` direct entry resolves in Arabic RTL;
- active garment names follow the selected V2 look;
- role/look state is reflected in the URL without introducing organization-specific branches;
- no horizontal overflow or KGC/default school-stage assumptions are present;
- artifact `10615691405`, digest `sha256:3eeda14a7e3d35d7383a8be0f39922eb288519c6f07e3624315573ae4937175c`.

Exact foundation regression run `35543416418`, job `106165042091`, is GREEN with artifact `10615129214`, digest `sha256:1ecfc8b27d8dac861137ea7bef26ed65ecd35272a434581b49efe88c4d54f940`.

### Slice C — truthful garment detail/inspection

#### Preserved RED

- contract commit `0e6ee64bed055e1b333d25bec8fa005c3209760c` — `test: define truthful garment inspection`;
- exact push run/job `35543546283` / `106165415096`;
- result: **8 passed, 2 failed of 10**; all prior Pattern slices remained GREEN;
- EN failed because the active garment had no canonical inspection link;
- AR failed because the garment route did not exist, so the localized document attributes were absent on the 404 surface;
- unknown garment 404 already passed;
- artifact `10615646955`, digest `sha256:65990e5784583f11b89d7251d5a95a7fb39ab5f4d47e55f2cc896332a0b02946`.

#### GREEN

Implementation authority: `204b7ce0bf82e1f6a32fbb739ac93e3559598324` — `feat: add truthful flat garment inspection`.

Exact Pattern push run `35543688161`, job `106165752586`, is **GREEN**:

- locked install, typecheck and optimized Next production build passed;
- 10/10 Pattern migration checks passed in 7.4s;
- active garments link to canonical locale/project/garment routes while preserving valid role/look context;
- EN inspection exposes the synthetic Utility overshirt in truthful flat mode and returns to the same Facilities/Utility state;
- AR mobile inspection exposes the synthetic field jacket in RTL and preserves Facilities/Outerwear context;
- unknown garment identity fails closed;
- canonical/hreflang metadata is emitted on garment routes;
- `data-inspection-mode` and `data-exploded` expose truthful capability state for browser verification;
- no explode control is rendered when separated published layers are unavailable;
- implementation only permits exploded presentation when the V2 garment says `inspection_mode=exploded` **and** published `view=layer` media exists;
- no KGC/real-client media is used or published;
- artifact `10615144689`, digest `sha256:66d84f155f99ce60ee8d98e6fe3995a9f5478226d2d3dbbfc06ecd9d6e1e0c5c`.

Exact foundation regression run `35543688160`, job `106165752798`, is GREEN with artifact `10615780599`, digest `sha256:c203f1d2d447b7dafebf259d2a79e05ecb3e5feb7f0a9749e1edd81fa3b50916`.

## Workstream 10.4 Slice D — contextual enquiry handoff

### Preserved RED

- contract commit `670b37261ae7904214d88f6b9b217b783c897726` — `test: define contextual enquiry handoff`;
- exact Pattern push run/job `35543839523` / `106166197034`;
- typecheck and optimized production build passed;
- first 10 migration checks remained GREEN;
- the two new enquiry-context journeys failed because project/look and garment views did not yet expose context-preserving enquiry links;
- RED artifact `10615199878`, digest `sha256:d33a9f986b6e4ea5294b3621def84bb069a3b8bb9faf5b6a319de84c0630ef0f`.

### GREEN

Implementation authority: `ea13f40a7897b51994066e2a0be011e559d3056d` — `feat: preserve project context into enquiries`.

Exact Pattern push run `35544749528`, job `106168556671`, is **GREEN**:

- locked dependency install, typecheck and optimized Next production build passed;
- 12/12 Pattern migration Playwright checks passed in 9.7s;
- selected role/look state produces a canonical contextual enquiry link;
- the homepage validates organization/program/role/look/garment slugs through the V2 public project boundary before prefilling any form state;
- EN project/look handoff prefills the public organization, sector and human-readable role/look description;
- AR garment handoff preserves organization/program/role/look/garment context and prefills the localized garment description;
- the submitted request retains the exact existing nine-field public intake schema;
- showcase context does not misuse the catalog-only `source_product_slug` field;
- no new private IDs, operational fields, price, stock or storage metadata enter the browser or POST payload;
- existing idempotency generation/submission remains unchanged;
- artifact `10616606046`, digest `sha256:5578394a2b9f43165942e1dfe3bada34593134d10dea07e38a40c96125bb4c0a`.

Exact foundation regression run `35544749469`, job `106168556339`, is also **GREEN** with 6/6 foundation checks. Artifact `10615896677`, digest `sha256:0a3e4b35957883bc8fdf491a0f5df0bf757bfea037104d3bed906eba4f67acff`.

This closes the functional context-handoff slice only. Rate limits, body-size enforcement, timeout/error mapping and privacy-safe logging remain Workstream 10.6.

## Workstream 10.5 — accessibility and motion hardening

### Preserved RED

- contract commit `fda94d17891a662cabee45838284196583b41442` — `test: define Phase 10 accessibility and motion gate`;
- exact push run/job `35544957759` / `106169106750`;
- typecheck and optimized build passed before browser validation;
- focused result: **1 passed, 3 failed of 4**;
- mobile skip target measured 40px high against the 44px minimum;
- Motion material-study evidence stayed `data-reduced-motion=false` under a browser reduced-motion preference;
- degraded synthetic garment presentation had an aria-label but no semantic image role;
- RED artifact `10616451586`, digest `sha256:d328c59136d4a24e75649f4256135eb4754923d5bbf4f84408f02421b1227602`.

### GREEN

Implementation authority: `c0163d43d6003dd56c8431e1f865a1524c9e5646` — `feat: harden accessibility and reduced motion`.

Exact accessibility/motion push run `35545089864`, job `106169454594`, is **GREEN**:

- locked install, typecheck and optimized Next production build passed;
- 4/4 focused Playwright checks passed in 3.9s;
- skip/navigation/role/look/garment/enquiry touch targets meet the tested 44px minimum on the representative mobile path;
- focus-visible styling remains keyboard-observable;
- EN and Arabic role/look controls activate from the keyboard and preserve the same state/information;
- a browser-native media-query bridge makes reduced-motion preference deterministic and leaves the same project/look/garment information available;
- synthetic degraded garment fallback is exposed as a named image role instead of an unlabeled visual-only shape;
- representative semantic scan reports no duplicate IDs, missing `img[alt]`, positive tabindex or unnamed interactive controls;
- representative mobile and reduced-motion captures are retained in the evidence artifact;
- artifact `10616402000`, digest `sha256:b1972ebd65d745607616a44bf3756a92f1d72e8e47d8367641f41984fdf0a6f3`.

Exact regressions on the same SHA are GREEN:

- Pattern migration run/job `35545089857` / `106169454628`: 12/12, artifact `10616327131`, digest `sha256:d907acab5200b4151830968189e3a4c4380ec90b46f724480b808f5840c34a5a`;
- public foundation run/job `35545089859` / `106169454615`: 6/6, artifact `10616716330`, digest `sha256:6700fa4128038edb75ca7ffb332cdaf9e67b08ddb182ddcb8d518452ce5e5c8d`.

## Workstream 10.6 — public enquiry hardening

### Preserved RED

- contract commit `f333b7789cb9812a2ed51fe0c69c81b938b7c9af`;
- exact run/job `35545407380` / `106170291685`;
- optimized build passed, then all 6 hardening browser checks failed because the production route did not yet expose the required form-proof/body/rate/timeout/privacy behavior;
- RED artifact `10616432546`, digest `sha256:35012b9563f518dccea76d2d670507a2859f18dfb0120d998b65a170b6b3ac31`.

### Iteration evidence

Implementation `fbb6183f4e09dcc2885d16d4b3c502abe8d91109` improved exact run/job `35545612786` / `106170837881` to 3/6 and exposed a reverse-proxy origin mismatch. Artifact `10616846568`, digest `sha256:7f63045ab695dd4e768dacbad2e5195b664d5ade2f3a5e5c4a78346b0bdf07be`.

Commit `0ef73122ae4d952bf4b21dbef2ecd1fcb58a6951` moved probes to real browser-origin fetches without bypassing the guard; run `35545724752` stayed 3/6, confirming the remaining defect was product-side origin validation. Artifact `10616477828`, digest `sha256:17778fae7177512636da542867b1ccc0b719a1d1e05bf284e02914301ce44c4b`.

### Exact-head GREEN

Final authority: `408a381032736b62ab44d4eefd31782839c68512`.

Exact enquiry run `35545824164`, job `106171404548`, is **GREEN** with 6/6 checks:

- unchanged nine-field public business payload;
- signed short-lived form proof carried only in a request header;
- same-origin validation through trusted forwarded host/proto boundaries;
- JSON content-type enforcement and 16 KiB body limit;
- per-runtime rate safety net with stable 429 and `Retry-After`;
- stable 400/403/413/415/429/503/504 public errors;
- 8-second production Odoo upstream timeout;
- privacy-safe event/status logging without customer or payload fields;
- Odoo idempotency/append-only handling remains unchanged;
- artifact `10616248547`, digest `sha256:d86381373a2bca8306bcad6e935740f680f48988db740f652de8234ea9580130`.

Same-SHA regressions are GREEN:
- Pattern migration `35545824166` / `106171404365`, artifact `10616802155`, digest `sha256:e95463bee21cea1c3e3c2fbee44b375726496b84163905b9771351b26245bcf2`;
- public foundation `35545824177` / `106171404378`, artifact `10616527864`, digest `sha256:8a82a666218515ef3ea1da10b0dc619a72acddf0d9cceb1ef7f6777662575791`;
- accessibility/motion `35545824174` / `106171404358`, artifact `10616343370`, digest `sha256:9a6701d65eb1f59d594d69fee9721033c14e418a656bf558f1c0a38ef5cdd07b`.

The in-process limiter is a safety net, not a claim of globally distributed edge-rate enforcement.

## Workstream 10.7 — cache, resilience, SEO, performance and browser media

### Application RED -> GREEN

Meaningful product RED authority:
- commit `93e3731825f307b5d865f660121a62adedaf1348`;
- run/job `35547637216` / `106176328338`;
- typecheck/build passed;
- 2/4 browser checks were GREEN (canonical route metadata and resource budget);
- 2/4 were RED: `robots.txt` returned 404 and repeated homepage requests performed two upstream reads instead of one cached read;
- artifact `10617840194`, digest `sha256:0d5440c53ff623ebc8a27d7909d5c0381d5f80c701a241c47bc4676c879ea188`.

Implementation `b19d4bc375c9cfc02bd5d8cd1ba21ab642fbaa5b` added Next public-content caching/revalidation plus canonical sitemap/robots. Later failures isolated fixture-state visibility across route workers rather than weakening cache assertions. Commits `29df2262c34348686538caf91a085a9b75ff1f8b` and `30005261389023eb13e8dbef914326f5781ab916` shared the synthetic control state and expired the one-second CI cache before outage proof.

Exact application GREEN:
- commit `30005261389023eb13e8dbef914326f5781ab916`;
- run/job `35549416991` / `106181267052`;
- **4/4 passed in 4.7s**;
- first and second EN-home requests reuse one V2-home and one V1-catalog upstream read;
- after the one-second revalidation window, synthetic upstream 503s occur while the previously published Harbor House/home content remains HTTP 200 and visible;
- `robots.txt` and `sitemap.xml` expose canonical public routes only;
- Arabic project canonical/hreflang/OpenGraph URL remains correct;
- representative 390x844 homepage is bounded at <=700 KiB JS, <=140 KiB CSS, <=1.6 MiB images and <=45 requests; at most one image is eager and all catalog images are lazy;
- artifact `10617014586`, digest `sha256:90c8571accd3c0abbcf4ec9b4a9df25b60f3e1aa7e3fc88fb1c7f1be939f92de`.

### R2 browser-origin RED -> GREEN

Provider RED:
- contract commit `164beaad01d2c30bbbcc232ddf940e7614cace93`;
- run/job `35549546604` / `106181611340`;
- failed closed at the browser-origin contract because enabled custom domain `media.faresuniform.uk` was absent from `fares-uniform-media-public`;
- private bucket was already verified to have zero custom domains and managed delivery disabled;
- artifact `10618071489`, digest `sha256:756e81763607ba934049ac66827d6b2274b46d1838441711c387efd8c3b8ccc2`.

Provider implementation `ed0986cff6d6930f189cc664dd7bb7f7f43f90f7` introduced controlled attach/verify logic but run `35549628907` exposed a credential-expression defect before mutation completion. Final correction `c41a5afcfcf2801a230ce46aa1b1c8d06134fddc` is the exact provider authority.

Exact provider GREEN:
- run/job `35549656743` / `106181910393`;
- public-bucket read proof first confirmed the bucket inventory is exactly the one deterministic synthetic object;
- `media.faresuniform.uk` was attached to `fares-uniform-media-public` and ownership/SSL reached active state;
- fetched bytes matched SHA-256 `9410b68878003a749c5b45e1cb217ebfc90f4538b28ac69cb8f178fc6a9159eb`;
- browser response retained `Cache-Control: public, max-age=31536000, immutable`;
- repeated fetch reached Cloudflare `HIT` or `REVALIDATED`;
- public managed `r2.dev` delivery remains disabled;
- private bucket still has zero custom domains and managed public delivery disabled;
- ephemeral public-bucket read token was revoked;
- artifact `10617767603`, digest `sha256:b0c7f20c7618155dea0798c7f2c943e92837772196449456db9fd39b5529978a`.

No KGC or other real-client object entered the public bucket.

## Workstream 10.8 — full hosted candidate

### Preserved RED

- contract commit `633523683f73a6a74e75577ce01582350268fcf4` — `test: define Phase 10 full hosted candidate`;
- exact push run/job `35566791616` / `106230128427`;
- static-quality, typecheck, optimized build, foundation 6/6, Pattern 12/12, accessibility 4/4, enquiry 6/6, rendered-candidate 4/4 and cache/SEO 4/4 all passed;
- the job remained RED because its evidence-staging step referenced nonexistent `approved-desktop-inspector.png` instead of the committed `approved-garment-inspector.png`;
- RED artifact `10624089408`, digest `sha256:cec4c3be7260b68c4746ec1b7543d0060e2da8219a6339ade4a553ae5af620ee`.

### GREEN

Workflow correction: `0f5f3528a4eb67953bcb14c5740433a2e2d2bb80` — `fix: stage approved inspector visual authority`.

A follow-up cleanup `cef36c8f3acec7748ffeb3d955ad1186edf8b57f` removed a redundant resilience proof harness added after the authoritative Workstream 10.7 gate; no production behavior was weakened or removed.

Exact push run `35609594487`, job `106365093566`, is **GREEN** on `cef36c8f3acec7748ffeb3d955ad1186edf8b57f`:

- source/static-quality gate passed;
- TypeScript typecheck and optimized Next production build passed;
- foundation matrix: 6/6;
- Pattern migration matrix: 12/12;
- accessibility/motion matrix: 4/4;
- enquiry-hardening matrix: 6/6;
- rendered full-candidate matrix: 4/4;
- cache/SEO/resilience/performance matrix: 4/4;
- candidate evidence covers EN desktop, AR mobile, truthful flat inspector and reduced-motion paths;
- cache evidence covers transient upstream 503 with retained published content;
- accepted Phase 9 desktop landing, EN mobile landing, AR mobile landing and garment-inspector boards were staged beside the production captures;
- artifact `10643791534`, digest `sha256:e5cd1f2cb3bbd0efc09a109a73e0f51b58f8788f5223d267e816b29048c902ff`.

No KGC or other real-client media was published. No production cutover, PR merge or ERP/Gate-D action occurred.

## Rendered parity engineering checkpoint

The direct engineering compare-and-correct pass against visual authority `4120c33fff9ac7ee6a400a7e51e2e8cbf17ce256` is complete.

Corrections:
- `5b1929abb6bca3ce695a12e25bf0b11d07027587` corrected Fares shell/editorial geometry, homepage/project/catalog/process composition and the truthful garment inspector;
- `7d756ae904fd3c34364cc17cf9120db22a7c0281` restored dedicated mobile Pattern navigation;
- `ae7f2230b9255cd3d5c3272f767744534762df23` preserved the mobile project/enquiry CTA semantics.

Exact latest-head push evidence at `ae7f2230b9255cd3d5c3272f767744534762df23`:
- full candidate run/job `35615691978` / `106385683974` — GREEN;
- foundation: 6/6;
- Pattern migration: 12/12;
- accessibility/motion: 4/4;
- enquiry hardening: 6/6;
- rendered candidate: 4/4;
- cache/SEO/resilience/performance: 4/4;
- full-candidate artifact `10646012719`, digest `sha256:46991f2354ffe7cd285b99aeac5502c4c958ab4702a501e876d2cde1d08c8c4c`;
- same-head Pattern run `35615691966`, foundation `35615691851`, accessibility/motion `35615691899`, enquiry `35615691876` and cache/SEO `35615692133` are GREEN.

The artifact contains current production captures and the preserved Phase 9 desktop/mobile/RTL/inspector authority boards. No KGC or real-client media was published.

## Superseded visual-acceptance boundary — D-059

The earlier checkpoint asked Fares to accept the production rendering against static Phase 9 boards. On 2026-09-21 Fares explicitly rejected image-led UI implementation. D-059 therefore supersedes that acceptance model before client visual approval occurred.

The recorded parity runs remain valid historical engineering evidence, but neither the Phase 9 boards nor the current Phase 10 preview is the current design specification. The next UI/UX validation sequence is:

1. repository UX/page contracts and source-controlled tokens;
2. reusable coded component/state review surface;
3. responsive EN/AR/RTL browser-native page compositions and coded motion behavior;
4. explicit Fares approval of an exact Git commit as the UI authority;
5. production reconciliation/promotion from that coded authority;
6. exact-SHA Playwright, accessibility, responsive, RTL, performance and visual-regression evidence against the approved coded authority.

Do not call Phase 10 visually accepted or implementation-complete, retire historical evidence, merge PR #7/#8, publish KGC/real-client media or launch production until the new authority/acceptance sequence and the separately gated authorizations are satisfied.


## Visual-acceptance review deployment

Fares requested a browser-accessible review deployment at the Phase 10 visual-acceptance checkpoint. The deployment boundary is deliberately separate from the production project and client-publication boundary.

Review deployment evidence:
- isolated Vercel project: `fares-uniform-phase10-review`, project `prj_KOtSJDZbngMRU4lZEqmwXjIgnkRj`;
- source-controlled workflow: `.github/workflows/phase10-review-preview.yml`;
- GREEN workflow run/job: `35624066871` / `106413950164`;
- exact READY review deployment: `dpl_38WagekDQv8ieFi9MdWDuonUtpGv`;
- review hostname: `fares-uniform-phase10-review-6k85j638v.vercel.app`;
- deployment workflow commit: `d8f130db4579ac1c41bae3303d38c0c983194ebe`;
- visual application baseline: `2dbd586d15d940aac7d78c09273c1ab46a3b31a0`; the workflow refuses deployment when `apps/public-web` differs from that baseline;
- target is non-production and the isolated project receives only `FU_PUBLIC_PROVIDER=fixture` for preview;
- rendered English review route returned HTTP 200 with `lang=en`, `dir=ltr`, the approved Fares hero and the synthetic Harbor House/program/catalog content;
- Vercel marks the preview `noindex`.

The existing real `fares-uniform` Vercel project remains on Phase 8 deployment `dpl_Ba34KhzW7AZ6aBY7poz1DeaQa3rg` / application SHA `2a74e93b1828c16839ba7cede336caa4ca374306`. No `faresuniform.uk` cutover occurred. No KGC or real-client media was published. This review deployment supplies the human visual-acceptance surface only and does not satisfy or bypass the explicit acceptance requirement.
## Homepage H04 — Selected Work exact-source review

Implementation authority: `31377df0ec019cb43bd0c41ef364c8e091ff025e`.

Exact design-authority push run `36196331054`, job `108272906752`, is **GREEN**:

- locked dependency install, TypeScript typecheck and optimized production build passed;
- browser design gate passed **13/13** checks in 42.9s;
- the homepage contains one truthful editorial KGC National feature instead of the illustrative Hospitality/Healthcare pseudo-project rail;
- the protected original High/Summer worn/model anchor and protected campus context remain two independent images, with browser-native title, description and actions;
- English desktop and 390x844 mobile render the editorial composition without horizontal overflow;
- Arabic renders `lang=ar`, `dir=rtl`, mirrors the image order and retains the localized project action;
- interaction proof followed the Arabic `استكشف المشروع` action to canonical `/ar/work/kgc/national` without a framework error overlay;
- no relevant H04 browser error was observed; the existing Scrollcraft warning for the earlier Process stage remains a separate H03 concern;
- exact protected deployment: `https://fares-uniform-design-authority-4pdpc9okg.vercel.app`;
- artifact `10889832855`, digest `sha256:c73e5e2d1652a3c62eb3f6ce4b569cd6cd97ef7101b3f2cddc4dae947c2a0980`.

The preview remains protected and non-production. This evidence does not authorize public KGC publication, production cutover, PR merge, ERP Gate D or final visual acceptance. The next isolated homepage checkpoint is H05 Garment Universe.
## Homepage H04 — client-program selector exact-source review

Implementation authority: `c76e3e2f24d6da96623f74535319a61a142f1d9e`.

Exact full-candidate pull-request run `36233111722`, job `108379882896`, is **GREEN**:

- static-quality, TypeScript typecheck and optimized production build passed;
- foundation, Pattern migration, accessibility/motion, enquiry hardening, rendered full-candidate and cache/SEO/resilience/performance matrices passed;
- artifact `10903241448`, digest `sha256:17bdcdba20b64c3525d66708c39712a1501102cddc96238f83c478a3cc49e355`.

Exact design-authority push run `36233110268`, job `108379878638`, is **GREEN**:

- typecheck and optimized production build passed;
- browser design gate passed **13/13** checks;
- H04 exposes one truthful KGC National client tab with semantic tab/tabpanel state and keyboard navigation;
- fabricated Client 02/03 and generic pseudo-client cards are absent;
- only the protected KGC campus, worn-model original and real front/back packshots are used;
- English desktop, 390x844 English mobile and Arabic RTL were inspected without horizontal overflow;
- reduced-motion information parity is covered by the hosted accessibility/motion and design gates;
- canonical actions resolve to `/en/work`, `/en/work/kgc/national` and their Arabic equivalents;
- no browser console errors were observed;
- artifact `10903277117`, digest `sha256:0ba3ca3dabd7db7781afcd2d3ca1f32af3bcf1ae6acabd13f9da7a9980bbfba6`;
- exact protected deployment: `https://fares-uniform-design-authority-7gux9v0js.vercel.app`.

The concept was adapted truthfully: the available worn-model original remains an independent browser image blended over the independent campus image rather than being presented as a fabricated transparent cutout. Only the review-authorized KGC program appears; no fake client placeholders or public client publication were introduced.

The preview remains protected and non-production. This evidence does not authorize production cutover, PR merge, public KGC publication, ERP Gate D or final visual acceptance.