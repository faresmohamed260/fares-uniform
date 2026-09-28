# Design QA — H04 client-logo rail correction

final result: passed

## Target and mismatch ledger

Reference evidence: Fares's rejected screenshot of the first option-3 rail.

- Before: six large generic client-program placeholders dominated the strip. After: no placeholder entries render; the rail maps only real published clients.
- Before: KGC appeared as a tiny crest inside a heavy outlined box. After: the crest and KGC National name form one readable editorial tab with a simple blue underline.
- Before: `01 / 01`, a long progress line and a pause button looked detached and suggested rotation that could not occur. After: the single-client state shows a quiet `01 — 01`; navigation, progress and pause render only when at least two clients exist.
- Before: the rail consumed roughly 188px and competed with the banner. After: desktop is 104–126px, tablet 116px and mobile 100px.

## Exact authority

- Implementation/deployment source: `8152657be622a088a375ccb2aa33b1b6c48776d4`.
- Protected preview: https://fares-uniform-design-authority-jriou7rhj.vercel.app/en#work.
- Design run/job: `36364787001` / `108748924276`.
- Artifact: `10946781994`, `sha256:165c0628f108e341d0df66a620811f6787319af0f6daf01a40eb5eae8512a444`.
- Full candidate run/job: `36364790043` / `108748932161`, GREEN.

## Visual evidence

- `home-client-logo-rail-desktop.png`: passed. The rail is compact, balanced and contains only OUR CLIENTS, the KGC crest/name, active underline and `01 — 01`.
- `home-client-banner-mobile.png`: passed. The crest/name and count fit one clean row without clipping or fake cells.
- The approved H04 banner, campus, four-grade collage, story copy and View Our Catalog action are unchanged.
- In-app browser classification: available, but the protected preview redirected to Vercel login. No credentials were entered; exact hosted screenshots from the sealed workflow artifact were used for visual QA.

## Checks

| Check | Result |
|---|---|
| Page identity and deployed SHA | Pass |
| Meaningful H04 content | Pass |
| Framework error overlay | Pass |
| Hosted console/browser suite | Pass |
| Desktop rail screenshot | Pass |
| Mobile screenshot | Pass |
| KGC tab and catalog interaction contract | Pass |
| Keyboard/focus-visible semantics | Pass |
| Arabic RTL and reduced motion | Pass |
| Horizontal overflow | Pass |

Production, PR merge and public KGC/client publication remain NO-GO. Final visual approval remains Fares's.