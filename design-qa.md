# Design QA — H04 crest-led static KGC panel

final result: passed

## Requested change

- Replace the oversized KGC National text with the real KGC crest.
- Place “Kawmeya Girls' College” beneath the crest in small type.
- Remove the rotating client banner completely.
- Preserve the KGC story, imagery and View Our Catalog action.

## Exact authority

- Implementation/deployment source: `f37038b304186c4ef5c126cd223aba0daddae202`.
- Protected preview: https://fares-uniform-design-authority-mw874v7hy.vercel.app/en#work.
- Design run/job: `36469130388` / `109086653189`.
- Design artifact: `10990993044`, `sha256:e3dca6cfdcd64598aae8b743009ef5b398accacc1e99299b59642a37856fb968`.
- Full candidate run/job: `36469135871` / `109086681750`, GREEN.

## Visual comparison

- Desktop: passed. The crest is the first identity element, the full school name is subordinate, and the banner reaches the section bottom without a footer rail.
- Mobile 390×844: passed. Crest, school name, program label, copy and CTA remain readable inside the mobile-specific pale panel.
- The campus, student collage, navy edge, handwritten note and browser-native panel geometry remain unchanged.
- No client tabs, placeholders, arrows, count, progress line or pause control remain in the DOM.

## Checks

| Check | Result |
|---|---|
| Correct protected deployment and SHA | Pass |
| Meaningful H04 content | Pass |
| Framework overlay | Pass |
| Hosted console/browser suite | Pass |
| Full desktop-stage screenshot | Pass |
| Mobile screenshot | Pass |
| View Our Catalog route | Pass |
| Arabic RTL | Pass |
| Reduced motion | Pass |
| Horizontal overflow | Pass |

Browser availability: the in-app browser was available, but the protected deployment redirected to Vercel login. No user credentials were requested or entered; the exact hosted workflow screenshots were used for visual QA.

Production, PR merge and public KGC/client publication remain NO-GO. Final visual approval remains Fares's.