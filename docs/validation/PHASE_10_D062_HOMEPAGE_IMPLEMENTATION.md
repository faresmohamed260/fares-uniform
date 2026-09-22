# D-062 approved homepage carbon-copy implementation evidence

**Status:** component/layout carbon-copy gate GREEN; temporary media replacement remains active  
**Approved visual authority:** `docs/ui/homepage/assets/approved-homepage-reference.webp` + `docs/ui/homepage/APPROVED_HOME_VIEW_COMPONENT_MAP.md`  
**Verified implementation SHA:** `778ea6fadeb88699708b44742ee1bf651c85b0fe`  
**Date:** 2026-09-22

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

## Protected hosted preview

Deployment:
- ID: `dpl_8YykRkaG96einFtrLrbaLmFCzAUx`;
- URL: `fares-uniform-design-authority-1fy9z74kf.vercel.app`;
- exact metadata SHA: `778ea6fadeb88699708b44742ee1bf651c85b0fe`;
- state: READY;
- target: preview / non-production;
- Vercel Authentication fail-closed check: PASS (`302` unauthenticated).

## Remaining work before D-062 homepage implementation is complete

The layout/component map is frozen. Remaining work is media fidelity/replacement only:

1. preserve current media-slot keys from `APPROVED_HOME_MEDIA_MANIFEST.md`;
2. replace reference-sprite placeholders with generated **non-product illustrative** assets where allowed;
3. replace those generated placeholders later with real Odoo/R2 media where the content contract and publication rights permit;
4. never move the surrounding approved component geometry during replacement;
5. rerun the same D-062 visual-difference gate after each replacement batch;
6. do not start the Schools page until the homepage replacement pass is accepted.

The temporary authority crops are therefore an implementation scaffold, not the final media source.
