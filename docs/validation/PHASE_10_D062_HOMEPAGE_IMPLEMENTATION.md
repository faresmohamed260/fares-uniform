# D-062 approved homepage carbon-copy implementation evidence

**Status:** Batches B–E GREEN; protected homepage review preview READY; Fares review pending  
**Approved visual authority:** `docs/ui/homepage/assets/approved-homepage-reference.webp` + `docs/ui/homepage/APPROVED_HOME_VIEW_COMPONENT_MAP.md`  
**Verified implementation SHA:** `42f2b116351a94a7d0c0a2604dd05b686adacf9c`  
**Deployment source SHA:** `1498d32579cf66bee04d38ebd74b854bf65132c5` (workflow-only change; prototype bundle unchanged)  
**Date:** 2026-09-23

## Scope

This evidence covers the D-062 homepage implementation on the isolated design-authority surface only.

It does not authorize:
- production `apps/public-web` integration/cutover;
- public KGC/client publication;
- PR #7/#8 merge;
- Schools/KGC/Garments page visual approval;
- ERP Gate D.

## What is implemented

The approved 1024×1536 homepage board is decomposed into semantic `H00–H06` components:

- H00 global header;
- H01 hero;
- H02 six-industry rail;
- H03 dual feature/process band;
- H04 selected work;
- H05 closing CTA;
- H06 footer.

The browser test asserts every mapped component ID from the D-062 component map and checks the exact major section boundaries at the 1024px reference width with the documented ±8px tolerance.

The implementation includes responsive English, Arabic RTL, keyboard/mobile navigation, reduced-motion preservation, no price/stock/cart leakage and stable media-slot keys.

## Authority asset

The approved image is committed as:

`docs/ui/homepage/assets/approved-homepage-reference.webp`

It is a 512×768 exact 1:2 derivative of the approved 1024×1536 board and is staged to the review app at:

`/authority/approved-homepage-reference.webp`

Committed derivative SHA-256:

`db799d7b8fdb148b79481fbcf41d525aef4667d2190360f4c75ef5dfa91eceef`

The original approved source-image SHA remains recorded in the component-map contract.

## Fidelity progression

The first measured semantic scaffold at `3e87def9781ed6ac4933bba62bf791c3fce4dde6` produced:

- mean absolute RGB-channel difference: **30.1527**;
- pixels with mean per-pixel RGB difference > 48: **18.6671%**.

Regional measurements identified H02 Industries and H04 Selected Work as the largest mismatches:

- H02: **44.5872** mean / **34.3651%** high-difference pixels;
- H04: **42.4671** mean / **29.1542%** high-difference pixels.

The next implementation pass fixed source-crop coordinates, exact industry rail placement, Selected Work card widths/gaps and the H03 `498 / 7 / 519` split.

Exact hosted run/job for `778ea6f…`:

- run: `35750269389`;
- job: `106822270107`;
- artifact: `10705450897` (`phase10-browser-design-778ea6fadeb88699708b44742ee1bf651c85b0fe`).

Final strict-gate result:

- **8/8 browser checks passed**;
- mean absolute RGB-channel difference: **19.2494**;
- pixels with mean per-pixel RGB difference > 48: **9.6657%**.

Regional final values:

| Region | Mean RGB-channel error | Pixels >48 |
| --- | ---: | ---: |
| H00 Header | 21.8042 | 12.3962% |
| H01 Hero | 20.3591 | 10.4688% |
| H02 Industries | **13.2664** | **7.5887%** |
| H03 Feature band | 24.0842 | 11.3210% |
| H04 Selected Work | **19.2270** | **10.2440%** |
| H05 Closing CTA | 25.0860 | 10.4265% |
| H06 Footer | **11.2434** | **5.2734%** |

The strict gate requires:
- global mean error < 25;
- global high-difference pixels < 14%.

Both pass.

## Initial protected hosted preview

Deployment:
- ID: `dpl_8YykRkaG96einFtrLrbaLmFCzAUx`;
- URL: `fares-uniform-design-authority-1fy9z74kf.vercel.app`;
- exact metadata SHA: `778ea6fadeb88699708b44742ee1bf651c85b0fe`;
- state: READY;
- target: preview / non-production;
- Vercel Authentication fail-closed check: PASS (`302` unauthenticated).

## Historical replacement plan after the initial carbon-copy gate

The layout/component map was frozen and the following media-replacement plan was subsequently completed by Batches B–E:

1. preserve current media-slot keys from `APPROVED_HOME_MEDIA_MANIFEST.md`;
2. replace reference-sprite placeholders with generated **non-product illustrative** assets where allowed;
3. replace those generated placeholders later with real Odoo/R2 media where the content contract and publication rights permit;
4. never move the surrounding approved component geometry during replacement;
5. rerun the same D-062 visual-difference gate after each replacement batch;
6. do not start the Schools page until the homepage replacement pass is accepted.

The temporary authority crops are therefore an implementation scaffold, not the final media source.


## Media replacement evidence — Batch C design sketch

Exact implementation commit `2a68f1e34f436ec63078d8702f0b376dd437efc0` replaced only `home.feature.design-sketch` with the independent 519×263 decorative technical-uniform SVG while preserving H00–H06 geometry and the D-062 media-slot contract.

Hosted push evidence:
- run: `35790380861`;
- job: `106957170942`;
- artifact: `10722045945`;
- **10/10 D-062 browser checks passed**;
- global mean RGB-channel error: **23.4380**;
- global pixels >48: **11.7007%**;
- H03 Feature Band mean error: **31.0147**;
- H03 pixels >48: **15.2216%**;
- protected review preview: `fares-uniform-design-authority-3rutxlsf6.vercel.app`;
- fail-closed verification: unauthenticated HTTP **302**, target **preview**.

The strict global limits remain GREEN (mean <25; high-difference pixels <14%). The active replacement sequence therefore advances to Batch D Selected Work placeholders, one slot at a time.


## Media replacement evidence — Batch D Hospitality

Exact implementation commit `161c14eb02b16d98e4f3f9c943e1cea7af109f47` replaced only `home.work.hospitality` with the already-approved generic Hospitality illustrative media, keeping it explicitly non-client capability placeholder content.

Hosted push evidence:
- run: `35790791853`;
- job: `106958493631`;
- artifact: `10722255587`;
- **10/10 D-062 browser checks passed**;
- global mean RGB-channel error: **24.2709**;
- global pixels >48: **12.3807%**;
- H04 Selected Work mean error: **35.0168**;
- H04 pixels >48: **24.2670%**;
- protected review preview: `fares-uniform-design-authority-7ghl88uxu.vercel.app`;
- fail-closed verification: unauthenticated HTTP **302**, target **preview**.

The global gate remains GREEN but is now close to the `<25` mean threshold. Healthcare replacement must therefore pass without relaxing the acceptance limit.


## Media replacement evidence — Batch D Healthcare

Healthcare was first integrated at `320dc00255efbd76e458edab11d16ecfc4cf5de2`; hosted validation correctly exposed an exhaustive-union TypeScript issue before browser execution. Follow-up commits repaired the branch structure, then the untreated Healthcare media reached the browser gate at `0edfb2b22a73f20c31b7a168242b1219ec897267` and failed the strict global mean at **25.1480**.

Hosted treatment sweeps preserved that RED and measured the Healthcare tile against the approved H04 region. The selected treatment was `object-position:75% 50%` with `brightness(.80) saturate(.40)`, which reduced H04 mean error from **42.5854** to **40.6666** without changing geometry.

Final accepted implementation:
- commit: `5b89a6ccb04d0eb256a5ac9ca091110dc5223a90`;
- run: `35792530022`;
- job: `106964161096`;
- artifact: `10722173310`;
- **10/10 D-062 browser checks passed**;
- global mean RGB-channel error: **24.9256**;
- global pixels >48: **12.9097%**;
- H04 Selected Work mean error: **40.6666**;
- H04 pixels >48: **28.8316%**;
- protected review preview: `fares-uniform-design-authority-kcedrtuzu.vercel.app`;
- fail-closed verification: unauthenticated HTTP **302**, target **preview**.

Batch D is complete. The remaining homepage media replacement is Batch E `home.cta.building`.

## Media replacement evidence — Batch E closing architecture

The generated generic architecture candidate was integrated at exact branch commit `42f2b116351a94a7d0c0a2604dd05b686adacf9c` as a low-opacity facade/color treatment over the D-062 temporary H05 architecture crop. This preserves the approved composition while keeping the added vector structure explicitly illustrative; it is not evidence of a real Fares facility.

Hosted PR validation run/job `35801320352` / `106992069953` completed the lean final suite with **10/10 browser checks**, TypeScript typecheck and optimized production build GREEN. Artifact `10725594588` preserves the evidence.

- global mean RGB-channel error: **24.9517** (<25);
- global pixels over 48: **12.9257%** (<14%);
- H04 Selected Work mean / pixels over 48: **40.6591 / 28.8316%**;
- H05 Closing CTA mean / pixels over 48: **25.3272 / 10.5696%**.

Batches B–E are complete without weakening D-062.

## Final protected homepage review deployment

The exact staged prototype bundle from implementation `42f2b116351a94a7d0c0a2604dd05b686adacf9c` was deployed through workflow-only source commit `1498d32579cf66bee04d38ebd74b854bf65132c5`. The trigger commit changes only the workflow comment and leaves the implementation bundle byte-for-byte unchanged.

Hosted push evidence:
- run: `35801988018`;
- job: `106994178255`;
- artifact: `10726561210`;
- artifact digest: `sha256:ce9e9c4571380d22fc5639648cf12eb33efb1bc1a1eaaa6c88c3a14340c6892f`;
- **10/10 D-062 browser checks passed**;
- global mean RGB-channel error: **24.9517** (<25);
- global pixels over 48: **12.9257%** (<14%);
- H04 Selected Work mean / pixels over 48: **40.6591 / 28.8316%**;
- H05 Closing CTA mean / pixels over 48: **25.3272 / 10.5696%**.

Deployment verification:
- project: `fares-uniform-design-authority` (`prj_NihDUJroYCeAqi6OF8aVAuxi94w0`);
- preview URL: `https://fares-uniform-design-authority-80gw6ngid.vercel.app`;
- state: **READY**;
- target: **preview / non-production**;
- Vercel Authentication: **PASS**, anonymous `/en` request returns HTTP **302** and opens the Vercel login boundary.

The active next action is Fares visual review of this exact protected implementation. This does not authorize public KGC publication, PR merge, production cutover or launch. Production remains **NO-GO**.

