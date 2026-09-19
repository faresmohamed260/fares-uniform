# Public site redesign governance

Status: **CLIENT-AUTHORIZED DESIGN GOVERNANCE / RESEARCH PHASE, 2026-09-17.**

This document governs the complete visual and interaction redesign of the public Fares Uniform website. It adapts the strongest process, fidelity and motion rules from RenderLab into Fares Uniform's own product and marketing context. RenderLab remains a process reference only: its brand identity, color system, product schemas, dark creative-app styling and runtime choices are not Fares Uniform requirements.

This document authorizes design research, visual concepting, interaction prototyping and documentation. It does **not** by itself authorize production implementation, application redeployment, provider mutation, real customer data, a paid dependency/service, Gate D closure or production launch.

## 1. Redesign boundary

The client explicitly reopened the public website's visual and interaction treatment for a complete redesign.

### Reopened for design

- public landing-page composition and storytelling;
- public navigation presentation and responsive behavior;
- brand presentation on the website, including wordmark treatment around the existing business name;
- public typography, palette, spacing, layout rhythm, image treatment and surface depth;
- public catalog browsing presentation;
- catalog-card to program/detail continuity;
- public program/detail-page visual storytelling;
- public enquiry presentation and conversion flow without changing its accepted data contract;
- public-site motion, physics, scroll choreography, shared-element transitions and bounded spatial/3D presentation;
- mobile/narrow and Arabic RTL composition as first-class designed states;
- visual hierarchy for direct contact, large-client credibility, process/manufacturing capability and calls to action.

### Not reopened by the redesign

The following remain authoritative unless separately changed by an explicit client decision:

- Odoo remains operational/domain truth;
- the public Next.js surface remains a narrow allowlisted public experience;
- the public catalog exposes **no price and no stock availability**;
- website enquiry, WhatsApp and phone remain the accepted public contact routes;
- existing enquiry idempotency, validation, persistence and response semantics remain product contracts;
- broad Odoo login/backoffice/direct public-API exposure remains prohibited;
- English and Arabic are required, including correct RTL behavior;
- accessibility, keyboard operation, visible focus, touch reachability and reduced-motion behavior remain mandatory;
- synthetic/redacted content remains the only permitted source-controlled/staging design evidence unless real-data use is separately authorized;
- current Gate C evidence remains staging evidence; production remains Gate D **NO-GO**;
- internal ERP/POS visual direction remains the practical operational SaaS direction in `DESIGN_SYSTEM.md`; this document governs the expressive public site only.

## 2. Marketing objective

The website is not primarily an ecommerce storefront. Its first marketing job is to make a serious prospective client believe that Fares Uniform can translate an organization's identity, operational needs, fit requirements and daily use into a coherent uniform program and deliver it reliably.

The accepted marketing priority remains large-client credibility first, catalog discovery second. The public experience should therefore communicate:

1. **identity** — uniforms should feel specific to the organization, not generic garments;
2. **craft and material confidence** — fabric, fit, construction and finish should feel tangible;
3. **program capability** — Fares can move from understanding the team through design/sample review into manufacture and delivery;
4. **professional reliability** — the presentation should feel suitable for schools, hospitality groups, restaurants, hospitals and other organizations without pretending every audience has the same needs;
5. **human partnership** — the path to enquiry should feel like starting a serious design/manufacturing conversation, not adding a commodity to a cart.

Do not invent customer logos, client testimonials, order volumes, certifications, manufacturing statistics, delivery claims or brand partnerships for visual credibility. Until real proof is explicitly approved for publication, concepts use synthetic or generic evidence structures only.

## 3. Experience thesis

Target character:

**Tactile materials + confident manufacturing + editorial fashion presentation + precise B2B professionalism.**

The public site should feel like a presentation coming to life rather than a stack of conventional website sections. It should be authored, cinematic where useful, physical in its treatment of garments/material, and restrained enough that the visitor can still understand the offer immediately.

Emotional rule:

> **Calm and premium at rest; memorable when the product story moves.**

The site must not become a futuristic AI demo, a generic luxury-fashion clone, a template-like SaaS landing page, or an effects reel with a uniform business hidden underneath.

## 4. Public-surface expressiveness

Use these as ambition targets and ceilings, not requirements to animate every element.

| Surface | Level | Direction |
| --- | ---: | --- |
| Landing / first impression | 4 / 4 | Highest-expression brand storytelling. Rich photography/materials, scroll choreography, spatial composition, kinetic typography or bounded 3D/WebGL may be explored. |
| Catalog / program discovery | 3 / 4 | Editorial and tactile. Product/media continuity, purposeful hover/pointer depth, filtering/discovery clarity and strong mobile/touch behavior. |
| Program / product detail | 4 / 4 | Showcase surface. Material, fit, identity and program story may use immersive image sequencing, shared geometry, 3D/detail inspection and strong narrative transitions. |
| Enquiry / conversion | 2 / 4 | Trust and clarity dominate. Motion may preserve continuity from the selected program and make form state feel polished, but never impede submission. |
| Header / global navigation | 2 / 4 | Compact, clear and tactile. Navigation remains subordinate to the story. |
| Footer / utility | 1 / 4 | Calm and useful. No spectacle needed. |

Dense internal ERP screens remain governed by the lower-expression operational direction in `DESIGN_SYSTEM.md`.

## 5. Core visual and interaction principles

### 5.1 Media and material lead

Garments, fabric, stitching, silhouettes, teams, samples and production detail should carry the emotional weight. Interface decoration must not become the site's visual hero.

Where final real photography is not yet authorized/available, concept work may use generated or licensed-reference imagery solely as design evidence. Production asset licensing, client permission and truthful representation are separate acceptance requirements.

### 5.2 One clear creative idea

Each approved concept needs one coherent visual thesis and one or two signature interaction ideas. Do not assemble an unrelated catalog of trendy effects.

### 5.3 Preserve origin and destination

When a visitor opens a program, focuses a garment, moves from story to enquiry, expands detail or changes language/state, prefer continuity that makes the relationship understandable.

Examples worth exploring:

- catalog media resolving into the same visual object on detail;
- garment/material frames expanding rather than being replaced by an unrelated page;
- process stages changing the same scene or material object rather than becoming four disconnected cards;
- selected program context carrying into the enquiry surface.

Literal cross-route shared-element implementation is not mandatory if it creates brittle routing/state. Perceptual continuity is the requirement.

### 5.4 Transform before replace

For important state changes, explore geometry, scale, clipping, masking, layout, depth, image sequencing, shared geometry and spatial movement before relying on a plain fade or `translateY` entrance.

Opacity remains useful as support. A repeated fade-up language is not sufficient for a signature public redesign.

### 5.5 Physical response belongs to physical ideas

Fabric, garments, swatches, imagery and draggable/spatial objects may use believable spring, inertia, resistance, snap, displacement, tilt or limited pointer depth when the interaction benefits from it.

Do not make ordinary links, form fields or every button magnetic/elastic simply to advertise motion.

### 5.6 Quiet chrome, expressive content

Navigation, language switching, enquiry fields and utility controls should remain clear and stable. Visual ambition belongs primarily in storytelling, product/media continuity and deliberate brand moments.

### 5.7 Avoid generic startup shorthand

Reject by default:

- decorative hero badges/eyebrows/kickers used only because landing-page templates use them;
- generic bento/card grids as the dominant page structure;
- card-within-card-within-card layouts;
- floating gradient blobs with no material/product relationship;
- glassmorphism on every surface;
- large meaningless glows;
- sparkle/AI iconography;
- fake metrics or unsupported social proof;
- every card scaling to `1.02` on hover as the main interaction language;
- staggered entrance animation with no relationship to user action;
- a decorative Three.js object behind an otherwise conventional page;
- component-registry demos pasted unchanged into the design.

## 6. Brand and content direction

The redesign must make Fares Uniform recognizable as a clothing/uniform business before a visitor reads long copy.

Preferred themes:

- material tactility;
- garment silhouette and construction;
- team identity;
- sampling and iteration;
- repeatable manufacturing/program consistency;
- editorial product photography;
- Alexandria/Egypt context only when it is truthful and useful, not as a decorative stereotype;
- confident concise copy rather than inflated luxury or technology language.

The site should not imitate another fashion brand's identity, logo, proprietary typography, campaign art or exact layout. References supply principles and mechanics, not a skin to copy.

## 7. Typography and layout

Typography should feel contemporary, editorial and highly legible in both English and Arabic.

Requirements:

- Latin and Arabic families must be evaluated as a pair for weight, rhythm and visual authority;
- Arabic layouts are composed intentionally, not mirrored after desktop English is complete;
- mixed-direction names, phone numbers and identifiers remain readable;
- expressive display scale is welcome on marketing/storytelling surfaces, but body and form content stay easy to read;
- typography should provide much of the premium character before effects are added;
- final fonts require licensing, web-loading, Arabic coverage and performance review before adoption.

Layout should vary rhythm across the page. Avoid repeating the same centered heading + three cards or left-copy/right-image formula section after section. Use full-bleed media, open editorial whitespace, rails, split compositions, controlled overlap, sticky storytelling or spatial scenes only where they serve the narrative.

## 8. Component-source policy

The prebuilt-first rule in `DESIGN_SYSTEM.md` remains mandatory.

Source order for conventional public controls:

1. existing approved Fares component;
2. official shadcn/Base UI or current approved maintained primitive;
3. another maintained accessible source when it materially fits better and its license/dependencies are reviewed;
4. compose a Fares-specific component from maintained primitives;
5. create a new generic interaction primitive only after documenting the gap.

External visual/component catalogs are research and implementation accelerators, not design authority. Normalize any adopted mechanic to the accepted Fares concept, semantic tokens, accessibility and responsive behavior.

## 9. Motion and technology policy

Technology follows the approved interaction. Libraries are not a checklist.

### Default application/public interaction motion

Use the existing approved Motion-for-React direction for ordinary layout/shared-geometry transitions, presence, spring behavior and feature-local gestures when it fits.

### GSAP

May be proposed when an approved concept genuinely needs timeline-heavy sequences, pinned/scroll-linked storytelling, SVG choreography, image sequencing or complex coordinated scenes that would be materially clearer in GSAP/ScrollTrigger.

A second animation runtime needs a dependency, maintenance, performance and reduced-motion rationale.

### Lenis

May be proposed for the public site only when an accepted design benefits from smooth-scroll orchestration or scroll/3D synchronization. Do not add it merely because award sites use it. Native scrolling, keyboard navigation, history behavior, touch behavior and reduced-motion/static use must remain complete.

### Motion Primitives / React Bits / Watermelon UI and similar registries

Use as maintained mechanic/reference sources. Candidate uses include morphing disclosures, image transitions, carousels, media rails, bounded pointer depth, text treatment or unusual gallery mechanics. Do not import a component unchanged and call that the design.

### Canvas / WebGL / Three.js / Spline

May be proposed for the landing or program-detail experience when the approved concept needs true material/spatial behavior. Keep effects isolated and lazy where practical. The site must retain a complete useful experience when reduced motion is requested, GPU capability is weak or WebGL is unavailable.

### Heavy media and image sequences

Require explicit performance budgets, responsive source strategy and loading behavior. Above-the-fold presentation cannot depend on downloading an excessive cinematic asset before the offer becomes understandable.

## 10. Accessibility, RTL and input parity

All concepts and prototypes must account for:

- keyboard-operable primary navigation and actions;
- visible unobscured `:focus-visible` treatment;
- appropriate focus management for dialogs/sheets/disclosures;
- semantic forms and errors that explain the corrective action;
- icon-only controls with accessible names;
- no essential hover-only controls;
- effective touch targets of at least 44×44 px on mobile where practical;
- mobile text inputs at a size that avoids unwanted browser zoom;
- status/meaning never encoded by color alone;
- directional icons mirrored only when direction is semantic;
- long Arabic copy and realistic wrapping tested, not placeholder-short strings;
- no accidental horizontal overflow in either direction;
- no interaction whose meaning exists only during animation.

## 11. Reduced motion and low-capability behavior

Every signature interaction requires a complete static/reduced-motion equivalent.

When `prefers-reduced-motion: reduce` is active:

- remove non-essential parallax, large shared-element travel, scroll scrubbing, cursor-follow motion and physics loops;
- preserve the same content, state changes, navigation and hierarchy immediately;
- avoid replacing motion with a different confusing transition;
- keep media/product meaning intact.

Low-performance/WebGL-unavailable fallback must also preserve the core story and enquiry path.

## 12. Performance is part of design quality

Prefer:

- compositor-friendly transforms/opacity where appropriate;
- event-driven motion instead of permanent high-frequency loops;
- lazy loading and code splitting for heavy public-only systems;
- responsive image sources and deliberate crop strategy;
- isolated WebGL/shader scenes;
- one ordinary motion runtime unless the accepted concept proves the value of another;
- instant usable navigation and enquiry controls even while expressive media loads.

Any smooth-scroll layer, second animation runtime, continuous pointer loop, large image sequence, video background, canvas/WebGL scene or 3D asset needs an explicit performance and fallback rationale before production adoption.

## 13. Reference-driven design requirement

A complete redesign cannot be approved from adjectives alone. Build a reference matrix before final concepting.

For each important interaction or compositional idea, record:

- Fares Uniform user/marketing task;
- exact external source or internal prototype;
- property to borrow (for example editorial rhythm, material physics, image masking, card-to-detail continuity, kinetic typography, scroll choreography, gesture response or navigation behavior);
- properties that must **not** be copied (brand, logo, content, exact layout, proprietary imagery/identity);
- desktop/pointer behavior;
- narrow/touch behavior;
- keyboard/focus behavior when interactive;
- Arabic/RTL implication;
- reduced-motion/static equivalent;
- likely performance/dependency cost;
- whether the idea materially supports conversion, credibility or product understanding.

Different references may guide different parts of the experience. The result must still read as one Fares Uniform system.

## 14. Design-before-code workflow

For the public redesign, follow this sequence:

1. **Re-establish reality.** Inspect current repository contracts and actual rendered public site at representative English/Arabic desktop and narrow viewports.
2. **Define the boundary.** Record what visual treatment is reopened and which product/security/data contracts remain fixed.
3. **Research.** Study high-end clothing/fashion sites, experimental designer demos and relevant interaction/component systems; capture concrete mechanics, not vague mood-board labels.
4. **Build the reference matrix.** Map references to Fares tasks and reject copied brand identity.
5. **Define the marketing narrative/information hierarchy.** Decide what the visitor must understand in the first viewport and how the story builds toward enquiry.
6. **Create complete visual directions.** Produce multiple genuinely different, coherent concepts for the full public experience, not only hero shots. Include desktop and narrow/mobile, English and representative Arabic RTL states.
7. **Write interaction choreography.** Define origin, movement/transformation, response, settled state, interruption/reversal and reduced-motion behavior before choosing implementation libraries.
8. **Prototype signature temporal behavior.** Build reviewable interactive evidence for the interactions that cannot be judged from static frames.
9. **Obtain explicit human design approval.** A plausible mock or static screenshot does not approve kinetic behavior.
10. **Record the accepted concept as the production visual specification.** Only then make the implementation slice execution-ready.
11. **Implement faithfully.** Do not reinterpret an approved concept into an easier conventional UI.
12. **Validate function and fidelity separately.** Engineering GREEN is necessary but does not prove design fidelity.
13. **Keep production deployment separate.** Gate D and explicit production GO remain independent.

## 15. Concept requirements

A concept set must cover the requested experience sufficiently to make implementation unambiguous.

At minimum review:

1. landing first viewport, desktop English;
2. landing continuation/storytelling rhythm, desktop English;
3. catalog/program discovery, desktop English;
4. program/detail showcase, desktop English;
5. enquiry/conversion state, desktop English;
6. representative narrow/mobile landing + catalog/detail flow;
7. representative Arabic RTL landing + catalog/detail state with realistic text lengths;
8. reduced-motion/static equivalent for each signature kinetic idea;
9. navigation/menu open/closed behavior if the design introduces a nontrivial navigation treatment;
10. loading/degraded-media state for any important 3D/video/image-sequence surface.

Do not approve a full-site direction from a hero-only mockup.

## 16. Kinetic approval gate

Any interaction described as signature, physical, cinematic, morphing, physics-based, scroll-choreographed or spatial must have temporal evidence before it is called approved.

Acceptable evidence includes a repository-backed interactive prototype, deterministic browser capture or other reviewable motion artifact that shows:

- starting state;
- transition;
- settled state;
- interruption/reversal where important;
- pointer behavior where relevant;
- touch/narrow equivalent;
- keyboard/focus behavior for interactive elements;
- reduced-motion equivalent;
- no clipped primary content or horizontal overflow;
- no fabricated business/product state.

Static frames remain required for composition but cannot close the kinetic gate.

## 17. Implementation fidelity gate

After human design approval, the accepted concept/prototype becomes the visual specification.

Production implementation must be compared against it for at least:

- visible copy and information hierarchy;
- first-viewport balance and section order;
- typography and line breaks;
- palette and material/surface treatment;
- spacing, grid and container model;
- media crop/framing and asset quality;
- icon style;
- component geometry;
- motion origin/destination;
- timing/easing/spring character and settled geometry;
- desktop and narrow layouts;
- English and Arabic RTL;
- keyboard/touch/focus parity;
- reduced-motion equivalence;
- loading/degraded-media behavior.

A build passing, links working or screenshots existing is not proof of visual fidelity.

### Mandatory compare-and-correct loop

Fares explicitly requires every visual implementation iteration to be compared with the approved design until the goal design is reached. Each loop must:

1. render the exact implementation at the approved desktop and mobile/RTL review sizes;
2. inspect the approved design and current renders side by side;
3. write a concrete mismatch ledger covering composition, copy, typography, palette, imagery, spacing, component geometry, motion states and responsive behavior;
4. correct all material mismatches that are within the authorized scope;
5. rerun hosted functional and rendered checks;
6. repeat the comparison after the correction.

A technical GREEN run, a partially faithful prototype or an intentional temporary substitute cannot close the visual gate. Any unresolved difference must be named precisely with its blocker or required approval. The loop ends only with Fares's explicit visual/kinetic approval or a genuine documented blocker that requires Fares.

## 18. Research/toolbox policy

The following are approved **research inputs/candidate mechanics**, not automatic dependencies or design authority:

- the project's RenderLab process references;
- high-quality current clothing/fashion/manufacturing sites and designer demos;
- Taste/high-taste frontend design guidance;
- Vercel Web Interface Guidelines;
- DESIGN.md / `awesome-design-md` design-system references;
- image-to-code workflows for faithful implementation of an accepted concept;
- Emil Kowalski's animation/design-engineering guidance;
- Lenis;
- GSAP / ScrollTrigger;
- React Bits;
- Watermelon UI;
- Kaikei.app if a stable authoritative source can be identified;
- Motion Primitives;
- Awwwards, FWA, Codrops and comparable curated interaction references.

Before adopting any runtime library or component, verify current maintenance, license, accessibility behavior, touch/keyboard semantics, RTL fit, reduced-motion support, bundle/runtime cost and compatibility with the repository's actual Next.js/React stack.

If a named reference cannot be verified, record that fact rather than inventing its capabilities.

## 19. Rejection criteria

Reject a concept or implementation if it:

- looks like a generic fashion Shopify/Webflow template with nicer colors;
- looks like a generic SaaS/AI landing page;
- could represent almost any clothing brand after replacing the logo;
- makes abstract effects more memorable than the garments/material/capability;
- depends on unsupported testimonials, customer logos, statistics or claims;
- treats Arabic as a mirrored afterthought;
- turns every section into cards;
- uses motion everywhere rather than designing a few meaningful kinetic moments;
- depends on hover for an essential path;
- cannot provide a credible reduced-motion or WebGL-unavailable version;
- sacrifices loading speed, text clarity, focus behavior or enquiry conversion for spectacle;
- copies another brand's identity, campaign art or exact composition;
- uses a component demo unchanged from a registry;
- is approved only because engineering checks pass without a separate browser fidelity review.

## 20. Current phase

The active public-redesign work is **research and design governance only**.

Next design outputs are:

1. a source-grounded market/design research report;
2. an interaction-level reference matrix;
3. a proposed Fares Uniform marketing narrative and content hierarchy;
4. multiple complete visual directions for client review;
5. interactive prototypes for the selected direction's signature motion before any production UI rewrite.

No public-web implementation or deployment should begin merely because this governance document exists.