# Design QA — H04 option-3 KGC client banner

final result: passed technical review; Fares visual approval pending

## Authority

- Selected direction: option 3 — full-bleed client banner with campus environment, pale story wedge, four-grade student collage, navy diagonal brand field, fixed View Our Catalog action and moving client-logo conveyor.
- Exact implementation/deployment source: `d91d98f8ccc31b4e6a896c4b8e0d99ab794a1e91`.
- Exact protected preview: https://fares-uniform-design-authority-nwyqa8m9t.vercel.app/en#work.
- Design run/job: `36357398573` / `108727740063`.
- Design artifact: `10944720821`, `sha256:1a83e4521e94dab0d763e7937fe1600c10025a7425efc627d63c4347796c0e05`.

## Asset and truth boundary

- Four authorized KGC worn-model sources spanning kindergarten, primary, middle and high school were used as references for one transparent generated collage.
- Generated derivative: `kgc-national-four-grade-collage-v1.png`, SHA-256 `a83d1e7a992cdd1144491355ea33601918e9848ed789f6acb1466d133cccda87`.
- Private R2 object: `kgc/review/kgc-national-four-grade-collage-v1.png`.
- Original sources are unchanged; their backgrounds were not removed.
- The page uses a normal independent image layer. No runtime canvas/background-removal code remains.
- KGC is the only enabled client; placeholder marks do not create fake client routes or claims.

## Visual comparison

- Desktop English: passed. The collage is large, clear and balanced against the story wedge; campus and diagonal geometry remain independent layers.
- Desktop Arabic RTL: passed. Story and collage mirror correctly, CTA remains legible and no content clips.
- Mobile 390×844: passed. All four students remain visible, the story panel follows cleanly and the logo rail stays usable.
- Reduced motion: passed. Automatic decorative motion is suppressed or simplified without removing navigation or content.
- Horizontal overflow: none in hosted checks.

## Interaction and accessibility

- Fixed View Our Catalog action remains available for the active client.
- Conveyor selection uses semantic controls; keyboard behavior is covered by the hosted suite.
- Enabled client selection changes the banner; disabled future entries cannot be activated.
- The banner remains compatible with the existing Scrollcraft section handoff and top-level section focus behavior.

## Verification

- Hosted typecheck: passed.
- Optimized production build: passed.
- Browser suite: 13/13 passed.
- Exact-source full candidate: run `36357401221`, job `108727747052`, passed.
- Deployment: READY, Vercel preview target, protected by unauthenticated HTTP 302 redirect.

Production, PR merge and public KGC/client publication remain NO-GO.