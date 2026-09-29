# Design QA — H04 natural-proportion cohort correction

final result: passed

## Requested correction

Fares reported that the four-student cutout was not full-height and appeared vertically squeezed.

## Root cause and fix

The desktop cohort layer applied scaleX(1.5), widening the transparent 1122×1402 source without increasing its height. Exact UI source 50138a8486e3875618290aafbb743649b5665a92 removes that horizontal-only transform and increases the layer height from 83% to 92%. The students now retain their natural proportions and use the available vertical stage.

## Exact authority

- Protected preview: https://fares-uniform-design-authority-lob7tc0gt.vercel.app/en#work
- Design authority run/job: 36513025649 / 109229352289; 13/13 browser checks passed.
- Design artifact: 11010302114, digest sha256:8128f09a9b56c8aa0ef9a83bec59336ba5df1a07af38c900c49066ecd8516668.
- Full candidate run/job: 36512869284 / 109228672712, GREEN.
- Full candidate artifact: 11010435973, digest sha256:58bb2f82f510055b4a4a28910a90e40ada32b3c5dcac00ef154af111a82e2aca.

## Visual and runtime verification

- 2560×1440: natural tall cohort proportions, full-height placement, no horizontal stretch.
- 1672×941: composition remains balanced and matches the approved KGC banner structure.
- 390×844: mobile-specific composition remains intact; horizontal overflow is 0.
- Runtime image: natural dimensions 1122×1402; object-fit contain; object-position 50% 100%; computed transform none.
- Header, pale crest panel, campus, navy edge, copy, CTA, later sections, EN/AR RTL and reduced-motion behavior remain unchanged.
- Console: no errors; the pre-existing Scrollcraft non-sticky process-stage fallback warning is unrelated to H04.

Production, PR merge and public KGC/client publication remain NO-GO. Final visual approval remains Fares's.