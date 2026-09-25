# Homepage browser-native media manifest

**Authority:** D-063 browser-native correction  
**Regression reference:** `approved-homepage-reference.webp` (test-only; SHA-256 `36032800b1a79a2fada69cfa87448124d7f81875e59b951bb445f8fd9947334c`)  
**Reference space:** 512 × 768 normalized browser capture

The regression screenshot is retained only as test evidence. Runtime media must use independent generated assets or rights-authorized real media; screenshot crops, textures, overlays, and hidden runtime references are prohibited.

| Slot key | Type | Historical slot bounds (x,y,w,h) | Runtime asset contract |
|---|---|---:|---|
| home.hero.architecture | independent blurred architectural environment | full H01 viewport | **independent generated environment-only asset:** `public/generated/home-hero-architecture-courtyard-v2.png`, 1672×941, SHA-256 `b6d5c7e2ab8ea4f7e27340d691059ec12f7629facd09102e16df1e1f99cb515a`; white/glass building, courtyard, trees and sky only, no people, text or UI; background spans H01 behind separate foreground layers |
| home.hero.people-group | clean illustrative people photograph | 335,55,689,399 | **independent clean asset:** `public/generated/home-hero-people-sharp-v4.png`, SHA-256 `7fcfdd4501bfbb274f8f05864771f0fef9f2a5d75298ce5b9383ce0bcad6cc4c`; transparent photo-only four-profession cutout with no text, annotations, cards, controls, logos or screenshot pixels; generic illustrative media only, not Fares client/product evidence |
| home.hero.quality-thumb | retired decorative detail | 760,352,60,67 | **retired from H01 runtime:** Fares approved the four-benefit row instead of the floating quality card |
| home.industries.education | illustrative sector media | 10,579,158,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-education.webp` |
| home.industries.hospitality | illustrative sector media | 179,579,159,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-hospitality.webp` |
| home.industries.healthcare | illustrative sector media | 348,579,159,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-healthcare.webp` |
| home.industries.corporate | illustrative sector media | 518,579,159,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-corporate.webp` |
| home.industries.industrial | illustrative sector media | 687,579,159,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-industrial.webp` |
| home.industries.security | illustrative sector media | 856,579,158,137 | **browser-native graphic field:** CSS/SVG linework and icon composition in `ApprovedIndustries`; no bitmap runtime asset; retired `home-industries-security.webp` |
| home.feature.fabric-blue | decorative macro | 0,817,498,263 | **independent generated placeholder:** `public/generated/home-feature-fabric-blue-v1.webp`, SHA-256 `df55badf7cf2a6be8062998cb27bad8f096818dc6d476d3887d95285acf9cbb5`; original technical-textile macro generated without the D-062 board as an input, reference, texture or overlay |
| home.feature.design-sketch | decorative illustration | 505,817,519,263 | **generated review asset:** `public/generated/home-feature-design-sketch.svg`, SHA-256 `b59109dda178910b8805c711a5226af3c4e12e9c8804a43c8497cb3e832121a1`; generic decorative technical-uniform sketch only, no client/product claim; D-062 GREEN at `2a68f1e3...` / run `35790380861` |
| home.work.kgc | project proof placeholder | 324,1097,173,149 | **protected real-media placeholder:** `review-media/kgc/kgc-building.webp` from the rights-authorized private KGC review set; campus context only, never published publicly without explicit authorization; participates in the shared Selected Work photographic grade (`brightness(.50) saturate(.70) contrast(.90)`) |
| home.work.hospitality | illustrative project tile | 506,1097,169,149 | **browser-native capability panel:** clearly graphic CSS/SVG sector capability composition; not a client/project photograph and not presented as proof of a named venue |
| home.work.healthcare | illustrative project tile | 682,1097,169,149 | **browser-native capability panel:** clearly graphic CSS/SVG sector capability composition; not a client/project photograph and not presented as proof of a named facility |
| home.cta.building | illustrative brand environment | 0,1263,1024,172 | **browser-native architectural field:** CSS/SVG grid, facade lines and animated thread paths; no bitmap runtime asset; retired `home-cta-building-v3.webp` |

## Rules

- The regression screenshot is test-only evidence. It must never be rendered, cropped, textured or overlaid as runtime page media.
- Generated replacements must be independent assets sized to the media contract; the regression reference may be used only for post-render comparison.
- Real database assets supersede generated placeholders when publication rights and content contracts are satisfied.
- Real product/client media must never be synthesized and presented as factual evidence.

- The rejected `home-hero-people-group.webp` composite and opaque clean-v2 draft were removed. The accepted v3 asset is a transparent people-only cutout. Runtime photographs must be content-only; all labels, notes, cards and controls belong to semantic HTML/CSS.


## D-064 runtime retirement

The D-064 review rejection controls over earlier labels that described the retired portrait/architecture bitmaps as acceptable generated review media. Those files are removed from the design-authority runtime and repository tip. Historical commits retain them only as evidence of the rejected candidate.

Current bitmap/photo runtime is intentionally narrow:
- independent environment-only hero architectural background;
- clean transparent generic hero people cutout;
- independent textile macro;
- protected rights-authorized KGC campus review image.

Sector atmosphere, non-client capability and closing architecture are now browser-native CSS/SVG compositions so they cannot accidentally inherit screenshot pixels or imply undocumented photographic proof.
## H01 three-scene review carousel

The 01/02/03 control switches three illustrative, non-client visual scenes while the headline, supporting copy, scene-specific notes, actions, benefits, geometry and Scrollcraft handoff remain browser-native. It advances automatically only when visible and motion is permitted; keyboard focus pauses it but hover does not; numbered buttons select a scene. Reduced motion disables automatic advancement.

- 01: sharp transparent generic four-role group, public/generated/home-hero-people-sharp-v4.png, 1672×941, SHA-256 7fcfdd4501bfbb274f8f05864771f0fef9f2a5d75298ce5b9383ce0bcad6cc4c, over the independent architectural background.
- 02: illustrative design and fabric-cutting studio, public/generated/home-hero-design-cutting-v1.png, 1672×941, SHA-256 1e81b7d81e744626456f07a94aef7265697ddd15a311a44d716585f03243e522.
- 03: illustrative sewing and quality-finishing studio, public/generated/home-hero-manufacturing-v1.png, 1672×941, SHA-256 430c6cee0df225b68e012d1a8f3bc500b685cfcd4df7c861ba7942f98cd5a7df8.

These scenes are generic editorial illustrations of business activities, not evidence of Fares facilities, clients or manufactured products. The three rejected people-only variants generated during exploration are not used in runtime.
## Fares-supplied brand-mark provenance (2026-09-25)

- Wordmark: user-supplied transparent `ChatGPT Image Sep 25, 2026, 02_19_26 AM.png`, SHA-256 `830b928163a7f8ce642b93bd988c39b96f8da7a54ddb5342a12d956137b53570`; approved review derivative `prototype/public-site-design-authority/public/design-media/fares-uniform-wordmark.png` (1200×404).
- Separate F circle: user-supplied transparent `ChatGPT Image Sep 25, 2026, 02_20_52 AM.png`, SHA-256 `443f8189837e523931d6ba6f3b69ade2881f4bf0e3214a87bd10f542fee112d9`; approved review derivative `prototype/public-site-design-authority/public/design-media/fares-uniform-f-circle.png` and app favicon `app/icon.png` (256×256).
- Processing: crop empty transparent margins, downsample for web, map source dark navy toward `#0b213e` while preserving relative shading and the white F. These are supplied brand assets, not runtime screenshots or generated client evidence. They remain separate browser image assets.