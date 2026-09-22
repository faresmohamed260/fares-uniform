# D-062 homepage illustrative-media generation specification

**Status:** active implementation contract  
**Geometry authority:** `APPROVED_HOME_VIEW_COMPONENT_MAP.md`  
**Slot authority:** `APPROVED_HOME_MEDIA_MANIFEST.md`

## Rule

Generated homepage media is temporary **illustrative design media**, not evidence of Fares customers, products, facilities or delivered work.

Every generated asset must:
- match the approved slot's aspect ratio and subject placement;
- preserve the D-062 navy / white / electric-blue composition;
- contain no readable fake client logos;
- contain no price/stock/product claims;
- avoid presenting a generated garment as an actual Fares product;
- be replaceable by a real Odoo/R2 asset without moving the wrapper/component.

## Batch A — hero

### `home.hero.people-group`
Target frame: 689 × 399.

Current generated review asset:
- path: `prototype/public-site-design-authority/public/generated/home-hero-people-group.webp`;
- SHA-256: `3921291dac7db38c6c8834f5e3413aee2df93393157059b48011ba09407761ed`;
- source: generated non-product design media, then cropped exactly from the generated 1024×1536 composition at the approved slot coordinates;
- status: D-062 fidelity GREEN at `1af694a7...` (run `35782149846`); retained for review.

Composition:
- five diverse adult/young-adult people grouped shoulder-to-knee;
- school/education representative, healthcare professional, chef/hospitality worker, corporate/front-of-house worker, industrial/logistics worker;
- clean contemporary generic uniforms, no client logos;
- confident, approachable expressions;
- strong overlap and depth like the approved board;
- group weighted toward right half, enough negative space at left for handwritten annotation;
- white/light-blue studio environment with strong electric-blue diagonal graphic field;
- commercial campaign photography, energetic rather than luxury/editorial;
- not British heritage styling; modern Mediterranean/MENA business tone.

Do not:
- use actual KGC identity;
- copy a real institution;
- show identifiable brand logos;
- make the uniforms look like catalog product claims.

### `home.hero.quality-thumb`
Target frame: 60 × 67.
- monochrome/navy textile macro;
- weave/seam/detail only;
- no branded garment.

## Batch B — industry rail

All six are 158–159 × 137 reference slots. Framing must survive a wide, compact crop.

### Education
- generic school-age/young student context;
- bright modern campus/classroom atmosphere;
- no real school logos;
- navy/blue uniform feeling.

### Hospitality
- chef or front-of-house service worker;
- warm but clean restaurant/hotel environment;
- generic uniform, no venue branding;
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-industries-hospitality.webp`;
- SHA-256: `c96db206981ceb504f2ae5aeee8223829a5536574459dd38cfda41fc90144cef`;
- status: D-062 fidelity GREEN at `89e75685...` (run `35785139365`, job `106940014250`, artifact `10719609173`); global mean error `21.9822`, H02 mean error `15.1410`; accepted for protected review.

### Healthcare
- healthcare worker in modern clinic/hospital environment;
- blue/white palette;
- generic scrubs/medical uniform, no hospital branding;
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-industries-healthcare.webp`;
- SHA-256: `5dbe74ffbd8ce363a4e0acaaed170690b43e1a87d60bd7206c4eec4e21a1a6ee`;
- status: D-062 fidelity GREEN at `1eec5e1d...` (run `35786015245`, job `106942891651`, artifact `10720326136`); global mean error `22.0506`, H02 mean error `15.4361`; accepted for protected review.

### Corporate
- modern office/front-desk/team environment;
- polished practical business uniform;
- no company logo;
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-industries-corporate.webp`;
- SHA-256: `3a9fe5915143492a9c7a465e7ca947bf3297745ab120fc6614d7e7f00a2abe45`;
- source: generated illustrative corporate media cropped to the exact 159×137 approved slot;
- status: D-062 fidelity GREEN at `fdbe429e...` (run `35786609574`, job `106944834397`, artifact `10720562061`); global mean error `22.1926`, H02 mean error `16.0491`; accepted for protected review.

### Industrial
- warehouse/light-industry/logistics environment;
- workwear/PPE context;
- safety-conscious but not dramatic;
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-industries-industrial.webp`;
- SHA-256: `d4eccd016b0fd89fba2bf8a5f05379eef5e045b36316540ecf573aae349497f1`;
- source: generated illustrative industrial media cropped to the exact 159×137 approved slot;
- status: pending D-062 fidelity gate.

### Security
- professional security/front-gate role;
- neutral urban/business environment;
- generic navy uniform;
- no insignia copied from real agencies;
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-industries-security.webp`;
- SHA-256: `2a80f1ebefc67f375841a32acde6bef2316f7ac27f11524147918df97a2cd91f`;
- source: generated illustrative security media cropped to the exact 158×137 approved slot; any insignia-like marks are synthetic/non-agency detail;
- status: pending D-062 fidelity gate.

## Batch C — feature band

### `home.feature.fabric-blue`
Target: 498 × 263.
- abstract dark navy fabric macro;
- folds/waves with enough tonal range to support white copy;
- subtle texture;
- no garment silhouette.

### `home.feature.design-sketch`
Target: 519 × 263.
- warm cream pattern/design desk;
- generic polo/work-shirt technical sketch;
- hand with black pencil;
- measurement/pattern lines;
- no real client logo or product claim;
- leave left third visually quiet because semantic heading/copy overlays there;
- allow handwritten checklist/annotation region at right.
- current generated review asset: `prototype/public-site-design-authority/public/generated/home-feature-design-sketch.svg`;
- SHA-256: `b59109dda178910b8805c711a5226af3c4e12e9c8804a43c8497cb3e832121a1`;
- source: independently vector-generated decorative technical-uniform sketch at the exact 519×263 slot ratio;
- status: D-062 fidelity GREEN at `2a68f1e34f436ec63078d8702f0b376dd437efc0` (run `35790380861`, job `106957170942`, artifact `10722045945`); global mean error `23.4380`, high-difference pixels `11.7007%`, H03 mean error `31.0147`.

## Batch D — selected-work placeholders

### `home.work.kgc`
Do **not** generate a fake KGC project image.
Use the current protected review crop/authorized real media until explicit public publication rights are recorded.

### `home.work.hospitality`
Target: 169 × 149.
- illustrative restaurant/hospitality team fragment;
- clearly generic;
- no real venue identity;
- current protected-review placeholder: reuses `prototype/public-site-design-authority/public/generated/home-industries-hospitality.webp` so no additional fake client scene is introduced;
- source SHA-256: `c96db206981ceb504f2ae5aeee8223829a5536574459dd38cfda41fc90144cef`;
- status: D-062 fidelity gate pending.

### `home.work.healthcare`
Target: 169 × 149.
- illustrative clinic/healthcare team fragment;
- clearly generic;
- no real facility identity.

These two remain capability placeholders and must not be labelled as completed Fares client projects in production content.

## Batch E — closing architecture

### `home.cta.building`
Target: 1024 × 172.
- bright modern low-rise garment-company/industrial-office exterior;
- strong blue sky;
- architecture concentrated right side;
- left 40% quiet/light enough for CTA copy;
- modest, credible small-to-medium manufacturing/business scale;
- no implication that the generated building is the actual Fares facility;
- no fake address, certification, employee count or manufacturing claim;
- optional generic `FARES` brand sign only if the asset is explicitly marked illustrative in review metadata.

## Generation acceptance

For each generated replacement:
1. record source/generator and slot key;
2. commit under a design-review-only media path;
3. keep the old authority sprite as regression reference;
4. replace one slot at a time;
5. run D-062 browser + visual-difference gates;
6. accept only if the overall page remains compositionally faithful and the slot reads as illustrative rather than factual evidence.
