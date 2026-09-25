# Public-site homepage design brief

**Status:** active homepage design contract / D-061  
**Approved scope direction:** Fares, 2026-09-22  
**Page under design:** public homepage only  
**Current review authority:** D-063 corrected browser-native implementation `460b44f5b167c1f44a3552c1ead57aeaeac9a0a1`  
**Previous browser candidate:** `bfdb85d53a76b3f81b521631e39265fea3fb72e1` — REJECTED after visual review  
**Implementation status:** corrected browser-native candidate is hosted and GREEN; Fares visual acceptance is pending; production `apps/public-web` remains separately gated.

## 1. Why this reset exists

The prior D-060 whole-site candidate `9ca2215bdbdd4455cd00ca94769119605af97952` is rejected as a design direction.

The central problem was not merely styling. The homepage inherited too much school/KGC logic and behaved like a client/program page instead of the master-brand entrance for Fares Uniform.

Fares Uniform serves uniforms broadly across schools, hospitality, restaurants/cafés, healthcare, corporate teams and other work environments. The homepage must therefore establish **Fares as the umbrella brand and manufacturer**, while sector pages and case studies carry their own more specific visual worlds.

D-061 changed the workflow to page-by-page authority. D-062 recorded the static board, but Fares rejected the resulting screenshot-led implementation. D-063 restores browser-native authority: the coded implementation is the review candidate, and screenshots are regression evidence only.

The homepage is first.

## 2. Competitive/business research

Current uniform-company sites consistently make the homepage broad before taking visitors into sectors or projects.

Useful business-structure references:

- Le Patron — https://www.lepatron-eg.com/
  - positions itself as a uniform manufacturer across hospitality, restaurants, schools, industrial, security and corporate;
  - presents one workshop serving many industries;
  - moves from brand promise -> industries -> what they make -> quality/customization -> clients -> enquiry.

- MTEX — https://www.mtex-egypt.com/en
  - frames the business around multiple uniform sectors and manufacturing capability;
  - combines service/product categories with a portfolio/projects layer.

- Halis Yün / Uniform Producer — https://uniformproducer.com/
  - clearly separates sectors, products and different program/order routes;
  - treats a uniform as a managed program rather than one isolated SKU.

- FITGO — https://www.fitgouniforms.com/
  - leads with “every industry” positioning;
  - reinforces manufacturing scale/capability before individual collections.

These sites are useful for **information architecture**, not visual quality. Fares should be substantially more art-directed, kinetic and premium.

## 3. Homepage job

The homepage has five jobs:

1. establish Fares Uniform as a serious multi-sector uniform design/manufacturing brand;
2. communicate that Fares can create a coordinated uniform system around an organization, not merely sell isolated garments;
3. let visitors immediately understand the breadth of sectors served;
4. provide confidence in design, sampling, manufacturing and delivery capability;
5. route visitors into the correct next page: sector, selected work, garments or enquiry.

It is **not** the place to explain one client's complete uniform system in depth.

## 4. Audience

### Primary

Decision makers responsible for organizational uniforms:

- school/international-school leadership;
- restaurant/café/franchise operators;
- hotel/hospitality management;
- hospital/clinic management;
- corporate procurement/operations;
- large-client owners/managers.

They need to answer:

- can Fares understand our brand?
- can Fares design across multiple roles?
- can Fares manufacture consistently?
- can Fares handle a real program rather than one garment?
- how do we start?

### Secondary

Individuals or smaller buyers who want to browse real garments/collections.

The homepage must give them a clear route to Garments without turning the global brand into an ecommerce storefront.

## 5. What the first screen must communicate

Within one viewport, without scrolling, a new visitor should understand:

**Fares designs and manufactures uniforms for organizations across industries.**

The hero must not visually imply:

- “Fares is a school-uniform company”;
- “this is the KGC website”;
- “this is a fashion label selling one collection”;
- “this is an ecommerce store”;
- “this is a generic corporate/SaaS template”.

## 6. Homepage visual territory

The homepage is the **master-brand world**.

It must be broad enough to contain schools, hospitality, restaurants, medical and corporate work without visually belonging to any one of them.

### Required qualities

- highly art-directed;
- graphic;
- dimensional;
- kinetic;
- premium;
- modern;
- editorial;
- materially aware;
- capable of dramatic morphing/transitions;
- still understandable at rest.

### Not yet locked

D-061 does **not** lock one final palette, one background treatment or one ornamental motif before the browser design is seen.

The implementation must be allowed to discover the best visual balance during the homepage design pass.

What is locked is the **role** of the visual language:

- global Fares graphics stay organization-neutral;
- client/sector colors remain scoped to deeper pages;
- the homepage can shift atmosphere between chapters, but must remain recognizably one Fares experience.

## 7. Graphic background and generated-media policy

Fares explicitly permits generated **non-product** media for the public design.

Allowed examples:

- abstract fabric/fiber macro fields;
- paper-pattern textures;
- architectural abstractions;
- dimensional geometric fields;
- abstract studio/light environments;
- motion backgrounds;
- mesh/gradient fields;
- thread/seam graphics;
- line art;
- animated diagrams;
- sector-neutral human/workplace atmosphere where it cannot be mistaken for a real Fares client or actual supplied uniform;
- transitional visual effects;
- decorative 2D/3D objects that do not claim to be real products.

These assets can be generated specifically for composition and motion.

### Still prohibited without explicit new approval

- fake Fares customer logos;
- fake client case studies;
- fake testimonials/metrics;
- generated images presented as actual Fares-manufactured garments;
- generated garments used in place of real product media;
- generated people presented as real client/student/staff evidence;
- fabricated garment construction presented as real product evidence.

Actual product/uniform showcase imagery remains grounded in real approved assets.

## 8. Homepage relationship to KGC

KGC is **selected work**, not the homepage identity.

Allowed homepage role:

- one later “Selected Work” chapter;
- one real project example showing that Fares can turn an organization's identity into a coordinated program;
- a link into the KGC case-study/project page.

Not allowed:

- KGC campus in the global hero;
- KGC colors becoming the global Fares palette;
- KGC students dominating the homepage;
- KGC-specific language as the main Fares proposition;
- the homepage explode-view being built around the KGC uniform.

The full KGC visual narrative, stage progression and multi-piece explode-view belong to the **KGC project/case-study page**.

## 9. Explode-view boundary

Explode-view remains an important interaction concept, but it is not the homepage's defining interaction.

For a client/program page with the required real assets, explode-view means:

**complete worn outfit -> transition/morph -> separate actual products that make up that outfit.**

Example pieces:

- shirt;
- skirt/trousers;
- jacket/blazer;
- tie;
- PE piece;
- outer layer;
- other real components belonging to that exact uniform system.

The exploded objects must use the real individual garment assets already available for that uniform.

It is **not** primarily an anatomical construction-layer visualization.

The homepage may tease “systems made of coordinated pieces,” but the detailed explode-view belongs deeper in the information architecture.

## 10. Homepage content architecture

### H01 — Master-brand hero

Purpose:
- establish Fares immediately;
- communicate breadth without a sector-specific image taking over.

Content:
- Fares wordmark/brand;
- concise master-brand proposition;
- primary CTA: **Discuss a uniform program**;
- secondary route: **Explore what we make** or **Explore our work**.

Visual behavior:
- strongest global graphic composition on the page;
- layered background and foreground elements;
- generated non-product graphic/media assets allowed;
- type, geometry, material and motion should carry the brand;
- no KGC/client identity.

Motion:
- dimensional entrance;
- controlled pointer response on desktop;
- background elements can morph/reframe as the visitor begins scrolling;
- transition should flow into the sector universe rather than hard-cut.

### H02 — Uniforms across environments

Purpose:
- prove the business is broad.

Core sectors:
- Education;
- Hospitality;
- Restaurants & Cafés;
- Healthcare;
- Corporate;
- Industrial / operational workwear if confirmed for public positioning.

This must not be a normal card grid.

Possible interaction families:
- kinetic horizontal field;
- sector words controlling a large background environment;
- graphic masks/morphing compositions;
- sector-neutral generated backgrounds that transform between environments;
- line/icon systems made in code.

Each sector routes to a future dedicated sector page.

### H03 — What Fares actually does

Purpose:
- distinguish custom uniform systems from product resale.

Message:
**identity + role + function + garment + manufacturing**.

Possible visual:
- one continuous graphic diagram that morphs between:
  organization identity -> people/roles -> uniform system -> individual garments -> production.

This is a global abstraction, not a KGC example.

Generated non-product diagrams/background media are allowed.

### H04 — Selected work

Purpose:
- add proof without making one client the global brand.

Initial real case:
- KGC National.

Treatment:
- one strong editorial project feature rather than a generic project card;
- real rights-authorized/review-authorized media only;
- unmistakably labelled as selected work;
- inherits a temporary project-specific visual accent only within this chapter;
- CTA into the KGC case-study page.

Later, additional real projects can join when their media/rights exist.

### H05 — Garment universe

Purpose:
- make the site useful to visitors who want to understand what Fares can make.

Possible categories:
- shirts / polos;
- trousers / skirts;
- jackets / outerwear;
- hospitality/front-of-house;
- medical;
- chef/kitchen;
- sports/PE;
- workwear.

This is **not** an ecommerce grid.

Preferred behavior:
- gallery/rail;
- oversized object or typographic category transitions;
- real garment media where available;
- category names can exist even when no client case study exists, but no fake garment imagery.

CTA: **Explore garments**.

### H06 — Design to manufacturing

Purpose:
- create confidence that Fares can execute.

Narrative:
1. understand;
2. design;
3. sample;
4. refine;
5. manufacture;
6. deliver / support reorder.

Visual behavior:
- calmer than the hero;
- may use generated process diagrams, fabric/pattern graphics and real manufacturing detail media when available;
- motion should clarify sequence rather than simply decorate.

### H07 — Materials / craft / details

Purpose:
- communicate quality without unsupported claims.

Potential content:
- fabric selection;
- embroidery/printing;
- construction/detail;
- fit/size systems;
- durability/use considerations.

Use real evidence when claims become specific.

Generated graphic media may frame the section but must not be used as proof of an actual Fares manufacturing capability that is not documented.

### H08 — Final conversion

Purpose:
- finish with clarity.

Primary:
**Discuss a uniform program.**

Secondary:
**Browse garments.**

The final state should be visually strong but calm enough to act.

## 11. Motion and transition language

The homepage should visibly contain the qualities Fares requested:

- transitions;
- morphing;
- animation;
- graphic backgrounds/elements.

But motion is structured by purpose.

### Global motion vocabulary

Allowed:
- mask/clip morphs;
- geometry transformation;
- layered parallax;
- object continuity;
- text reflow/recomposition;
- background-field transformation;
- path/line drawing;
- image/graphic overlap;
- horizontal chapter transitions;
- scale/depth transitions;
- material/fabric distortion where appropriate;
- section-to-section morphing rather than repeated fade-up blocks.

Avoid:
- every section pinning;
- identical fade/slide animations;
- decorative particle spam;
- hover effects that contain essential information;
- scroll trapping;
- fake-3D objects used solely because they look “AI”;
- animation that makes the page feel like a tech demo instead of a premium manufacturer.

### Mobile

Mobile is separately art-directed.

The goal is not “desktop minus effects.”

Keep:
- graphic identity;
- morphing;
- layered depth;
- cinematic transitions.

Change:
- fewer simultaneous planes;
- one dominant subject at a time;
- shorter hold distances;
- direct touch interaction;
- no horizontal overflow;
- no interaction that assumes a pointer.

### Reduced motion

Same hierarchy, same assets and same information.

Replace long spatial movement with:
- direct state changes;
- short opacity/clip changes;
- static graphic relationships.

## 12. Homepage asset plan

### Real assets that may appear

- Fares brand marks and real general-company media where rights/context are clear;
- real garment packshots;
- selected KGC media only in H04 Selected Work;
- future real project/craft/manufacturing media when documented.

### New generated non-product asset families to create for homepage design

The browser-design phase may generate:

1. **Master Brand Field**
   - abstract textile/pattern/fiber visual;
   - sector-neutral;
   - suitable for hero depth/morphing.

2. **Sector Atmosphere Set**
   - abstract/non-client visual fields for education, hospitality, F&B, healthcare, corporate;
   - visually related as one family;
   - should communicate environments without pretending to document real Fares customers.

3. **Pattern/Thread Graphic Kit**
   - high-resolution line/path/shape elements;
   - usable as masks, transitions and animation layers.

4. **Material Macro Set**
   - stylized fabric/fiber/light compositions;
   - decorative/editorial rather than claimed product evidence.

5. **Manufacturing Diagram Backdrops**
   - abstract pattern-paper, grid, measurement and assembly graphics;
   - no fabricated product detail claims.

All generated media must be recorded as **design/decorative media**, separate from product/client evidence.

## 13. Global shell established by the homepage

The homepage is allowed to establish only the reusable master-brand shell:

- wordmark behavior;
- navigation behavior;
- language switch;
- master type system;
- base spacing/rhythm;
- global CTA behavior;
- focus/keyboard standards;
- global loading/transition behavior;
- base background/ink roles.

It must **not** lock deeper-page visual skins.

Each next page gets its own design brief and browser approval while reusing the approved global shell.

## 14. Page-by-page design authority

Sequence:

1. Homepage.
2. Schools sector page.
3. KGC case-study/program page.
4. Garments/collections page.
5. About/process page.
6. Enquiry/contact page.
7. Additional sector pages.

Each page receives:

- explicit page purpose;
- content architecture;
- asset inventory;
- interaction/motion plan;
- responsive/RTL/reduced-motion plan;
- browser-native review candidate;
- Fares visual feedback/approval.

Approval of one page does not automatically approve the next page.

## 15. Homepage acceptance criteria

The homepage design is ready to present only when all are true:

- a visitor cannot reasonably mistake Fares for a KGC/school-only brand;
- at least five business sectors are legible without relying on fake client work;
- hero is organization-neutral;
- KGC appears only as selected work;
- no price, stock or cart language exists;
- non-product generated media is explicitly decorative/design media;
- real garments are not replaced by generated fake products;
- motion includes meaningful morphing/transition/graphic behavior, not repeated fades;
- desktop and mobile both feel deliberately art-directed;
- English and Arabic RTL both work;
- reduced motion retains the complete hierarchy;
- the page has a clear path to Work, Garments and Enquiry;
- the homepage design is approved by Fares as an exact browser-native Git SHA before any production integration.

## Fares-supplied logo direction (2026-09-25)

Fares supplied two independent transparent logo images: the stacked serif FARES/UNIFORM wordmark and the white serif F inside a navy circle. Use the supplied artwork itself; do not substitute a font approximation, attach the circle to the wordmark, or trace either image into a speculative SVG. Palette adjustment and transparent-canvas cropping are allowed. The wordmark belongs in header/footer brand positions; the circle is the separate favicon/icon. Browser-native page architecture and all H01/H02–H06 content remain unchanged. Integration is not final visual approval.
## H01 copy and annotation refinement (2026-09-25)

Keep the approved PEOPLE / BUSINESSES / COMMUNITIES / IN / UNIFORM headline, CTAs, four benefits, and three-scene rotation. Replace the generic future-facing eyebrow and supporting text with a concrete design-and-manufacturing proposition. The handwritten annotations are scene-specific: the people view connects diverse roles to one organizational identity and the wearer; design/cutting names the move from brief to pattern; manufacturing/finishing names the cut-sew-finish sequence. Hide the people-only right annotation on scenes 02 and 03. English and Arabic carry the same intent. These are review-candidate copy choices, not final visual approval.
