# Homepage H00–H06 component map and D-062 historical geometry

**Decision:** D-062 historical map, amended by D-063  
**Status:** component/content map retained; static-board implementation authority withdrawn  
**D-063 correction:** Fares, 2026-09-23  
**Reference canvas:** 1024 × 1536 px  
**Repository reference asset:** `docs/ui/homepage/assets/approved-homepage-reference.webp`  
**Historical source SHA-256:** `d3cecc6a20f6dd29af6db55d84d35f970d2e866e96a503a795f6a96451f94492` (original generated board; historical only)  
**Current regression-reference SHA-256:** `36032800b1a79a2fada69cfa87448124d7f81875e59b951bb445f8fd9947334c` (512×768 WebP captured from corrected browser-native implementation `460b44f5b167c1f44a3552c1ead57aeaeac9a0a1`; test-only)

## Authority rule

D-063 supersedes the D-062 screenshot exception. This document retains the useful H00–H06 component IDs, content order and historical geometry; it does not authorize the static board as an implementation specification.

The implementation may use independent generated **non-product** media and rights-authorized real media according to the slot manifest. It must use semantic HTML/CSS/components for all copy, labels, annotations, cards, controls and interactions.

The implementation must not:
- render, crop, sprite, texture, overlay, trace or hide any portion of the historical/reference screenshot at runtime;
- embed UI, copy, annotations, cards or controls inside runtime photographs;
- restyle the page into another aesthetic without review;
- remove required sections/components without review;
- use generated fake Fares product imagery as real product evidence;
- expose prices or stock.

## Canvas map

Coordinates below preserve the historical 1024 × 1536 board decomposition. They are content/geometry context, not instructions to crop the board or fixed browser pixels.

| ID | Section | Reference bounds | Component |
|---|---|---:|---|
| H00 | Global header | x 0–1024, y 0–64 | `ApprovedHomepageHeader` |
| H01 | Hero | x 0–1024, y 64–454 | `ApprovedHero` |
| H02 | Industries | x 0–1024, y 454–810 | `ApprovedIndustries` |
| H03 | Dual feature band | x 0–1024, y 810–1085 | `ApprovedFeatureBand` |
| H04 | Selected work | x 0–1024, y 1085–1263 | `ApprovedSelectedWork` |
| H05 | Closing CTA | x 0–1024, y 1263–1436 | `ApprovedClosingCta` |
| H06 | Footer | x 0–1024, y 1436–1536 | `ApprovedHomepageFooter` |

---

## H00 — Global header

### H00.01 Brand lockup
- left aligned;
- blue geometric Fares mark;
- `FARES` wordmark;
- small `UNIFORM` line below;
- approximate reference bounds: x 29–177, y 12–50.

### H00.02 Primary navigation
Seven semantic links:
1. Home — active underline;
2. Industries;
3. Collections;
4. Our Process;
5. About;
6. Work;
7. Contact.

Approximate baseline: y 30–34.

### H00.03 Utility search
- search icon button;
- no visible input in default state.

### H00.04 Locale control
- globe icon;
- `EN`;
- chevron;
- Arabic must preserve the same component location while applying RTL semantics.

### H00.05 Primary header CTA
- dark navy rounded rectangle;
- `Get in Touch`;
- arrow icon;
- right aligned.

### H00 interaction
- header remains visually quiet;
- link underline animates;
- CTA arrow translates slightly on hover/focus;
- mobile collapses navigation without changing the desktop authority.

---

## H01 — Hero

### H01.01 Eyebrow
`UNIFORMS FOR A BRIGHTER TOMORROW`

Approximate reference: x 40–268, y 94–104.

### H01.02 Display headline
Four lines:
- PEOPLE
- BUSINESSES
- COMMUNITIES
- IN UNIFORM

The final line is electric blue.

Approximate bounds: x 39–326, y 116–256.

### H01.03 Intro paragraph
Copy intent:
`We design and manufacture uniforms for schools, hospitality, healthcare, corporate and more — helping people look professional, feel confident, and move forward together.`

Approximate bounds: x 40–323, y 274–341.

### H01.04 Primary hero CTA
- dark navy rounded rectangle;
- `Explore Our Industries`;
- arrow.

### H01.05 Secondary hero CTA
- circular play icon;
- `Watch Our Story`.

### H01.06 Hero pagination
- labels `01 02 03`;
- `01` active;
- thin progress/segment rules.

### H01.07 Hero people composition
Temporary media slot:
`home.hero.people-group`

Visual contents in approved reference:
- school student;
- healthcare professional;
- chef;
- industrial/logistics worker;
- overlapping group composition.

This is **illustrative non-product media**, not a real-client claim.

Reference crop anchor: x 337–1024, y 56–454.

### H01.08 Blue geometry
- large electric-blue diagonal field entering from upper-right;
- lighter blue diagonal layer behind;
- geometry sits behind people and annotation.

### H01.09 Handwritten annotation A
`Different People / Same Purpose`
with hand-drawn arrow into the people group.

### H01.10 Handwritten annotation B
`Real Uniforms / Real People / Real Impact.`
with hand-drawn curved arrow.

### H01.11 Floating quality card
- white translucent/soft card;
- small monochrome fabric/detail thumbnail;
- three-line copy:
  - Quality
  - People
  - Lasting Partnerships
- dark circular arrow button.

### H01 motion
- people/media group enters from right with shallow depth;
- blue diagonal geometry expands/morphs behind it;
- handwritten paths draw on;
- quality card floats in after the people group;
- CTAs keep conventional pointer/keyboard behavior;
- no scroll trap.

---

## H02 — Industries

### H02.01 Section eyebrow
`OUR INDUSTRIES`

### H02.02 Display title
Two lines:
- `Uniform Solutions`
- `for Every Sector`

`Every Sector` is electric blue.

### H02.03 Intro copy
`From classrooms to kitchens, hospitals to hotels — we create uniform solutions that fit your people, your brand, and your day-to-day needs.`

### H02.04 `View All Industries` link
- small link;
- blue arrow.

### H02.05 Carousel controls
- previous circular outline button;
- next circular outline button.

### H02.06 Industry card rail
Six visible cards on desktop:
1. Education — SCHOOL UNIFORMS;
2. Hospitality — HOTELS & RESTAURANTS;
3. Healthcare — HOSPITALS & CLINICS;
4. Corporate — BUSINESS & OFFICES;
5. Industrial — WORKWEAR & SAFETY;
6. Security — SECURITY UNIFORMS.

Each card contains:
- media slot;
- lower white information panel;
- black sector icon;
- title;
- uppercase micro-subtitle;
- circular arrow button.

Temporary media slots:
- `home.industries.education`
- `home.industries.hospitality`
- `home.industries.healthcare`
- `home.industries.corporate`
- `home.industries.industrial`
- `home.industries.security`

### H02 interaction
- real horizontal carousel behavior;
- arrows update position;
- pointer drag/touch swipe allowed;
- card media subtly scales on hover;
- no fake client claim.

---

## H03 — Dual feature band

Two equal-width blocks separated by a narrow white gutter.

### H03A — More Than Uniforms

#### H03A.01 Background
Temporary decorative media:
`home.feature.fabric-blue`

Approved reference is a dark navy fabric macro.

#### H03A.02 Heading
`MORE / THAN UNIFORMS`

#### H03A.03 Supporting copy
Quality fabrics, practical design and reliable production; uniforms that work as hard as the people wearing them.

#### H03A.04 CTA
White rounded button:
`Discover Our Collections` + arrow.

#### H03A.05 Benefit row
Four compact benefit items:
1. Durable Fabrics;
2. Comfort in Every Detail;
3. Practical Design;
4. Made for Real Life.

Each has its own white line icon.

### H03B — From Idea to Uniform

#### H03B.01 Background
Temporary decorative media:
`home.feature.design-sketch`

Approved reference:
- cream paper;
- polo/work-shirt fashion/technical sketch;
- hand holding black pencil;
- handwritten annotations.

#### H03B.02 Heading
`FROM / IDEA TO UNIFORM`

#### H03B.03 Supporting copy
Concept to final product — designing, sampling and manufacturing uniforms that bring the client's vision to life.

#### H03B.04 Process checklist
Handwritten/right-side:
- Design;
- Sample;
- Produce;
- Deliver.

#### H03B.05 Handwritten note
`Your Vision. / Our Expertise.` plus arrow.

#### H03B.06 CTA
Outlined light button:
`Our Process` + arrow.

### H03 motion
- left fabric crop moves at a slower parallax rate;
- right sketch lines/pencil can subtly translate;
- checklist marks draw/reveal;
- no heavy pinning.

---

## H04 — Selected Work

### H04.01 Eyebrow
`SELECTED WORK`

### H04.02 Heading
`Real Partnerships. / Real Results.`

### H04.03 Project card 1
KGC:
- media slot `home.work.kgc`;
- label `KGC`;
- subtitle `School Uniform Program`;
- circular arrow.

Real KGC media may replace the temporary crop when public rights are explicitly authorized.

### H04.04 Project card 2
Hospitality:
- temporary media `home.work.hospitality`;
- label `Hospitality`;
- subtitle `Restaurant Uniforms`;
- circular arrow.

### H04.05 Project card 3
Healthcare:
- temporary media `home.work.healthcare`;
- label `Healthcare`;
- subtitle `Clinic Uniforms`;
- circular arrow.

### H04.06 Work CTA tile
- pale gray tile;
- copy `Let's build something great together.`;
- `View All Work` + arrow.

### H04 interaction
- card image darkening/scale on hover;
- arrow button responds independently;
- cards route only to real/authorized project pages when those routes exist.

---

## H05 — Closing CTA

### H05.01 Background
Temporary media:
`home.cta.building`

Approved reference shows a bright Fares-branded industrial/corporate building under blue sky. Until a real Fares exterior exists, this remains clearly **illustrative non-product brand media**, not factual facility evidence.

### H05.02 Eyebrow
`READY TO GET STARTED?`

### H05.03 Display line
`LET'S CREATE / YOUR UNIFORM SOLUTION`

`UNIFORM SOLUTION` is electric blue.

### H05.04 CTA cluster
- dark `Get in Touch` button + arrow;
- supporting copy: help with requirements, ideas, or questions.

### H05.05 Handwritten annotation
`Local Roots / Global Standards` plus arrow.

---

## H06 — Footer

### H06.01 Fares lockup
Same brand mark as header.

### H06.02 Footer navigation
- Home;
- Industries;
- Collections;
- Our Process;
- About;
- Work;
- Contact.

### H06.03 Social icons
- Instagram;
- LinkedIn;
- Facebook;
- YouTube.

Links remain unset/disabled until real destinations are documented.

### H06.04 Locale control
Globe + `EN` + chevron.

### H06.05 Divider
Thin pale rule.

### H06.06 Copyright
Use the current calendar/legal value in implementation; the approved board's `© 2024` is visual placeholder content and not factual authority.

### H06.07 Footer tagline
`Uniforms for a brighter tomorrow.`

---

## Global visual tokens extracted from approved board

### Color roles
- ink/navy: approximately `#0B213E`;
- electric blue: approximately `#1687FF`;
- white: `#FFFFFF`;
- cool off-white/background: approximately `#F8FAFC`;
- pale gray surfaces: approximately `#F2F4F6`;
- muted copy: approximately `#425169`;
- soft sky blue used in hero/CTA atmospheric fields.

Exact implementation values must be tuned against the committed reference, not treated as brand standards for unrelated pages until separately approved.

### Geometry
- low-radius rounded rectangles, not luxury pill-heavy UI;
- 14–18 px card radius at 1024 reference scale;
- large readable sans-serif display type;
- dense but orderly horizontal nav;
- wide image-led cards;
- clean white section separation;
- strong blue accents;
- informal handwritten annotation layer as a supporting graphic device.

### Density
The approved page is intentionally **content-rich and commercial**, not sparse luxury editorial.

## Responsive rule

The approved 1024×1536 board is the desktop/tablet visual authority.

Responsive implementation must preserve:
- ordering;
- component identity;
- color relationships;
- text hierarchy;
- CTA hierarchy;
- all information.

Mobile can reflow cards/people/media but must not invent a different theme.

## Fidelity verification

For the 1024px desktop regression viewport, the 512×768 reference is a normalized capture of the corrected browser-native implementation:
1. capture the rendered page at 1024 CSS px width;
2. compare the full-page screenshot against the committed test-only regression reference;
3. use image-difference evidence plus component bounding-box assertions;
4. iterate component by component until geometry/content/color/media placement are within the documented tolerance;
5. do not declare the homepage implemented merely because tests/build pass.

Initial tolerance target:
- major section boundary: ±8 px;
- header/hero/CTA component bounding boxes: ±8 px;
- card widths/gaps: ±6 px;
- dominant color delta: visually negligible;
- all mapped components present: 100%.

## Replacement invariant

Temporary media is replaced by **slot key**, never by changing surrounding layout.

Example:
`home.industries.healthcare` independent generated atmosphere -> rights-authorized real database asset later.

The wrapper component and approved geometry remain stable.
