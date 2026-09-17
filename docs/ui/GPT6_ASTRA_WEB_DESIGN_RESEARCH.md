# GPT-6 Astra web-design research and adoption plan

Status: **RESEARCH BASELINE / WORKFLOW ADOPTION, NOT A DESIGN APPROVAL, 2026-09-17.**

Related Fares documents:
- [Public site redesign governance](PUBLIC_SITE_REDESIGN_GOVERNANCE.md)
- [Public site research and reference matrix](PUBLIC_SITE_RESEARCH_AND_REFERENCE_MATRIX.md)
- [Public site showcase and historical-work requirements](PUBLIC_SITE_SHOWCASE_CONTENT_REQUIREMENTS.md)

This document records verified public GPT-6 Astra web-design examples, the tools/skills/prompts that produced them, and the parts of those workflows that Fares Uniform should adopt. The objective is not to imitate an “Astra look.” The repeatable value is the combination of strong research, explicit visual-story design, layered spatial composition, purpose-built media, product-specific motion, responsive art direction and browser-based refinement.

## 1. What is verified about Astra

OpenAI describes GPT-6 Astra as having stronger visual judgment for websites, games, applications and renderings, and exposes Sites in ChatGPT for creating/hosting/sharing web experiences. That capability should not be confused with a secret visual style or one magic prompt.

Public examples show that the strongest results generally add a serious creative workflow around the model:

1. research the real brand/product and references;
2. state audience, conversion goal, emotional promise and hard constraints;
3. establish a creative direction before code;
4. design a visual story / feeling curve;
5. create product-specific media rather than placeholder gradients;
6. define explicit spatial layers, occlusion and scroll states;
7. implement a small number of signature interactions;
8. art-direct mobile independently;
9. provide reduced-motion/static fallbacks;
10. inspect rendered intermediate states and iterate.

The model is an execution engine inside that process, not a replacement for the process.

## 2. Actual Astra reference: LARK — The Private Theatre

Public repository:
- https://github.com/az9713/gpt-6-astra-web-design

The repository compares two real browser-built luxury sites for the same fictional mechanical music automaton. Version II was built with GPT-6 Astra after Version I, with an explicit request for more Scrollcraft/layering. The repository correctly warns that this is not a controlled model benchmark because Astra inherited the first build, brand, imagery and conversation context.

Useful Astra-version characteristics:

- the product sits between foreground curtains rather than on a flat hero;
- large LARK typography occupies its own depth plane behind the focal object;
- foreground silk, product shell, typography and scenery visibly occlude one another;
- separated shell elements expose the songbird while the world remains continuous;
- a circular/aperture transition moves into a mechanism/detail view;
- collection/material moments change composition instead of repeating card grids;
- reduced motion remains a coherent reading experience.

Fares lesson:

**The garment, type, material and environment should be independent planes with deliberate contact/occlusion rules.** Depth is not several cards translated by different amounts.

## 3. The public LARK prompt structure

The repository preserves the generic prompt that preceded the builds. It is not Nate Herk's proprietary historical prompt; it is a public prompt record produced in the experiment.

Its strongest reusable rules are now adopted for Fares concept work:

### Product and commercial inputs before visual design

Record:

- product / program;
- category;
- target buyer;
- buyer tension/desire;
- transformation/promise;
- primary action;
- material/craft/performance/provenance truths;
- variants/collection;
- brand character and prohibited character;
- available real assets;
- reference sites;
- technical environment.

For Fares the primary action is normally **start an enquiry / conversation**, not purchase.

### Explicit creative concept before code

Before implementation define:

- one-sentence creative concept;
- emotional journey;
- visual metaphor;
- restrained colour system;
- typography system;
- one memorable signature interaction;
- why it fits this buyer and product.

### Explicit layer system

For immersive scenes consider, only where needed:

- background/environment plane;
- midground/context plane;
- typography plane;
- focal product/garment plane;
- near foreground/material plane;
- interface plane.

Write z-order and occlusion behavior. At least one important scene should produce real, meaningful overlap; essential content remains legible.

### Scroll choreography

Use one coherent narrative rather than unrelated effects. Candidate transformations especially relevant to Fares include:

- material macro → complete garment;
- garment → exploded construction/detail;
- assembled look → role/team lineup;
- organization identity/context → uniform program;
- vertical scroll controlling a horizontal collection when it is genuinely clearer;
- oversized typography moving behind/in front of the focal garment.

Animations should reverse cleanly when scrolling backward and should not trap visitors in long pinned sequences.

### Quiet intervals

Do not make every section cinematic. Alternate signature spatial scenes with calm editorial content. Contrast is what makes the expressive moments feel expensive.

## 4. Nate Herk Scrollcraft — verified public skill

Public repository:
- https://github.com/nateherkai/scroll-craft

The current public Scrollcraft material is particularly relevant because several Astra design discussions explicitly reference Nate Herk's layering approach.

Fares adopts these workflow principles:

### Research intermediate states

Do not collect only hero screenshots. Inspect what a reference does while the user scrolls, opens a menu, changes a product or reaches the handoff between scenes. For each reference record:

- observed behavior;
- why it works;
- transferable principle;
- what must not be copied.

### Layer contract before asset generation

For each signature scene specify:

| Plane | Fares interpretation | Movement | Contact/occlusion rule |
| --- | --- | --- | --- |
| Far environment | organization context, workshop, textile field or calm background | smallest | must not duplicate focal garment |
| Midground | architecture, team/context media, secondary materials | restrained | establishes place/scale |
| Focal subject | real garment/product/program | deliberate | physical grounding/continuity preserved |
| Near foreground | fabric, pattern, cut piece or framing detail | strongest restrained displacement | may cross the subject/type without blocking key copy |
| Atmosphere | light/shadow/translucent textile detail when justified | slow | creates separation, not generic haze |
| Typography/controls | semantic HTML | stable or staged | remains readable/usable |

### Opening / midpoint / resolved exit

Every major scroll scene must be describable as three meaningful states. Scrolling changes a spatial relationship or the visitor's understanding, not merely opacity.

### Choose rendering method by the product story

- photographic alpha layers for real garments/fabric/context;
- 3D only when rotation/material response/construction separation adds understanding;
- video/image sequence when an authored shot or continuous transformation is the better medium;
- ordinary semantic HTML for reading, navigation, facts and conversion.

### Visitor agency survives into conversion

If a visitor selects a client project, role, product or variation, that context should carry into the case study/showcase and enquiry rather than resetting at each section.

## 5. Astra + Higgsfield cinematic workflow

Public references:
- https://github.com/Barty-Bart/gpt-6-astra-10k-websites
- https://moderncreator.app/2026-09-07-bart-slodyczka-build-a-10k-website-with-gpt-astra-no-code-full-tutorial
- https://moderncreator.app/2026-09-09-paul-j-lipsky-how-to-create-cinematic-websites-using-gpt-6-astra

The strongest repeatable workflow is:

1. establish the business/audience/action;
2. establish identity and references;
3. create a compact style tile/design board;
4. write a **Visual Story** table with Scene / Visual story / Website copy;
5. define transition beats and scroll pacing before producing footage;
6. generate key stills first;
7. use an approved still as the reference/start frame for connected motion;
8. inspect generated media before integrating it;
9. map scroll to purposeful frame/scene progress;
10. keep semantic copy/controls separate from pixels;
11. build a dedicated mobile composition/portrait media pass;
12. provide poster/reduced-motion/loading-failure fallbacks;
13. visually test and refine.

### Required Visual Story artifact for Fares

Before a cinematic prototype, create this exact planning artifact:

| Scene | Visual story | Website copy |
| --- | --- | --- |
| 01 | What changes visually and spatially | Headline/support/action |
| 02 | Next meaningful transformation | Supporting story/fact/action |
| 03 | Resolution / handoff | Proof or conversion copy |

Add rows for transition beats that contain meaningful action. A no-copy visual beat is allowed when the motion carries the story.

### Scroll pacing

Measure scene travel in viewport heights / intentional timeline ranges, not video seconds or mouse-wheel turns. A clip's duration does not define reading time. Use piecewise mapping so important actions, still holds and explanatory copy receive different amounts of scroll space.

## 6. Mobile is a separate art-direction pass

The public `gpt-6-astra-10k-websites` workflow includes a separate mobile-refinement prompt. Fares adopts the underlying requirement:

- mobile navigation is designed, not merely collapsed;
- opening copy is shorter when it competes with the product;
- landscape cinematic media should get a dedicated portrait composition when required;
- mobile scroll timing is tuned independently;
- mobile requests only the media it needs;
- a lightweight poster appears immediately;
- reduced motion does not fetch an unnecessary animation sequence;
- safe areas, 44px-class touch targets, focus behavior and compact devices are tested;
- desktop is rechecked after mobile changes.

Arabic mobile is a first-class composition, not a translated screenshot of English desktop.

## 7. Product visualization examples directly relevant to Fares

### Existing-model exploded product explorer

A public Astra example by Fazal Shah used an existing Aston Martin AMR26 3D asset and Astra to build an interactive browser explorer with eight selectable systems, exploded view, camera presets and reassembly. The creator explicitly notes that the source geometry was existing licensed geometry rather than generated engineering truth.

Fares lesson:
- interactive exploded explanation is valuable when the source model is real;
- interface labels/camera states can be built around a trusted asset;
- the site must state the limits of source geometry rather than implying engineering accuracy.

### VEYRA interactive car

Public Astra case collections describe Amir Mušić's fictional VEYRA product study as combining Astra coordination, GPT Image for visual variants, prepared video transitions and responsive product UI **instead of requiring a 3D model**.

Fares lesson:
- a convincing product configurator/showcase can sometimes use carefully prepared media states and transitions rather than a heavy real-time model;
- this is particularly useful for garments where photographic truth matters more than arbitrary polygon detail.

### Exploded-view media prompts

Public Astra-era examples also demonstrate exploded product films and interactive products constructed from reference images. For Fares, reference-driven exploded media is acceptable only as an illustrative presentation unless the component geometry has been verified from the real garment/sample.

## 8. Skills and tools — Fares adoption map

The client asked to use all useful researched skills/tools. This means **use each where it owns a distinct design gate**, not install every animation/rendering library into production simultaneously.

| Skill/tool/source | Fares use | Adoption rule |
| --- | --- | --- |
| GPT-6 Astra reference corpus | creative/workflow benchmark | study actual outputs/prompts, do not imitate one house style |
| Taste / gpt-taste | anti-generic design read; variance/motion/density calibration | concept gate |
| Web Taste principles | extract relationships from real references with approval | reference/taste board gate |
| RenderLab governance | design-before-code, kinetic evidence, fidelity QA | project process |
| Nate Herk Scrollcraft | feeling curve, state/scroll thinking, layer contracts | signature-scene planning |
| Frontend App Builder / concept-first workflow | complete visual concepts before implementation | concept production |
| Image-to-code | accepted concept becomes fidelity target | implementation gate |
| Awesome DESIGN.md | encode approved design language for agents | after direction approval; do not copy another brand wholesale |
| Vercel Web Interface Guidelines | accessibility, forms, focus, media, motion, performance implementation audit | implementation QA |
| Emil Kowalski motion principles | purpose, interruption, feedback, prototype competing motion ideas | interaction review |
| GSAP + ScrollTrigger | complex authored/pinned/scrubbed scroll timelines | only when selected choreography needs it |
| Motion / Motion Primitives | layout/shared-element/state continuity | preferred for component-level motion |
| Lenis | smooth-scroll coordination where it materially improves the chosen experience | optional; never scroll-hijack or make it required for comprehension |
| React Bits | mechanic/reference pool | R&D only unless a component is sufficiently transformed, accessible and appropriate |
| Watermelon UI | mechanic/component composition reference | R&D only; not brand identity |
| Three.js/WebGL | real spatial product/material interaction | only for scenes where 3D materially improves understanding |
| Higgsfield | connected image/video generation workflows seen in Astra builds | optional external provider; connection/credits/purchase require explicit user action/authorization |
| OpenAI image generation / GPT Image workflows | concepts, art-direction assets, controlled product-visual experiments | never fabricate historical proof |
| real browser visual QA | inspect intermediate states, mobile, RTL, reduced motion and failure modes | mandatory before visual acceptance |

## 9. Proposed Fares concept grammar after Astra research

Working concept name:

**Years of Work, One Living Atelier**

This is a concept hypothesis, not an approved design.

### Narrative

1. **Archive / relationships** — years and sectors appear as an authored timeline of real work, not a logo wall.
2. **Choose an organization** — the selected client's context becomes the visual world.
3. **Program resolves** — products/roles from that engagement form a coordinated team lineup.
4. **Choose a garment** — one real item isolates while the rest recedes.
5. **Inspect the product** — clean photography becomes a material/feature inspection or truthful exploded/layered view.
6. **Reassemble** — the garment returns to the complete program/team.
7. **Begin yours** — the selected sector/client-like need/product context carries into enquiry.

This connects the newly required historical-client showcase to the high-end product storytelling language rather than making them separate parts of the website.

## 10. Initial Fares creative dials for exploration

For public-site concept exploration, start approximately at:

- **design variance: 8/10** — authored, asymmetric and distinctive, but not art-school chaos;
- **motion intensity: 8/10 at signature scenes, 2–4/10 elsewhere** — cinematic peaks separated by calm content;
- **visual density: 3/10** — product/media and typography get room to breathe.

These are R&D starting points, not implementation constants.

## 11. Required next concept workflow

Before production public-web code changes:

1. collect the first publishable historical-client candidates and raw product/archive media from Fares;
2. research each approved organization's public facts and build source-backed dossiers;
3. create a current reference board using actual intermediate interaction states, including Astra/Scrollcraft references and high-end fashion/product references;
4. write the Fares Design Read and creative dials;
5. produce at least three genuinely different complete visual directions;
6. each direction covers landing, historical work/client discovery, one case study, product showcase/exploded state, enquiry, desktop, mobile, Arabic RTL and reduced motion;
7. select one direction;
8. produce a Visual Story, layer contracts and interaction choreography for its signature moments;
9. create a kinetic prototype with the minimum correct rendering stack;
10. review temporal behavior, not only screenshots;
11. only after approval, implement faithfully and verify against the accepted concept in a browser.

## 12. Tooling and truth boundary

Do not let generated media blur the difference between concept and history.

- Generated imagery may be used for **concept R&D**, placeholders, abstract material storytelling and clearly fictional design experiments.
- Real historical Fares work requires approved real evidence.
- Retouching may clean presentation without changing garment identity/construction.
- A generated 3D/exploded view is an illustration unless it is built from sufficiently trustworthy product geometry.
- No client logo, testimonial, relationship, product, material property or outcome is fabricated to make a concept look complete.

The project's existing no-price/no-stock, privacy, EN/AR, accessibility, narrow-public-API and Gate D NO-GO contracts remain unchanged.
