# Astra 10K / Scrollcraft workflow for Fares Uniform

**Status:** mandatory public-site design-authority workflow  
**Accepted by Fares:** 2026-09-22  
**Decision:** D-060  
**Paid design SaaS required:** no  
**Generated fake client/product imagery permitted:** no

## Pinned sources

The repository pins the public design sources used for this workflow rather than relying on memory or a transient web page.

| Source | Pinned commit | Role |
|---|---|---|
| Nate Herk `scroll-craft` | `0b816225945e45380397d6a0487efa3c98916858` | Primary premium scroll-design skill, device engine, taste/hero-depth/verification rules |
| Barty-Bart `gpt-6-astra-10k-websites` | `e05e451ecd1e371536ef3c310fa273e12b98db7a` | Public GPT-6 Astra Desktop Build + Mobile Refinement workflow reference |

Read `.agents/skills/fares-scrollcraft/SKILL.md` first. It points to the pinned upstream files.

The GPT-6 Astra repository is reference-only. Its prompt text is not copied into Fares-owned documentation; use the pinned upstream source directly.

## What the public workflow actually requires

The $10k-style workflow is not “large serif text plus some Motion.” The required design process is:

1. establish the business brief and Pain / Person / Promise;
2. inspect concrete high-signal references rather than asking for a generic “premium” look;
3. write the customer journey before layout;
4. choose a page grammar;
5. define the emotional/energy curve;
6. engineer one clear peak moment;
7. invent one signature interaction specific to this brand;
8. score the scroll using several device families rather than repeating one effect;
9. design the hero as independent depth planes;
10. build real semantic browser content around the motion;
11. art-direct mobile separately;
12. verify intermediate scroll states visually, not only the first and final viewport.

Scrollcraft is the mechanism and design discipline. It must not be reduced to a CSS theme.

## Fares-specific tool matrix

### Mandatory

- pinned Scrollcraft skill and engine;
- exact repository brief, grammar, feeling curve, visual story and scroll score;
- concrete reference research from Godly, 21st.dev and Awwwards or an equivalent current source;
- current real review-authorized Fares/KGC media;
- semantic HTML/React rather than rendered text baked into images;
- browser-native animation and Scrollcraft device attributes;
- Playwright/browser validation at intermediate scroll states;
- desktop, mobile, Arabic RTL and reduced-motion review;
- protected Vercel review deployment;
- explicit Fares approval of an exact design Git SHA.

### Allowed when the chosen interaction earns them

- CSS transforms/masks/blend modes;
- Motion for component-local interaction not supplied by Scrollcraft;
- GSAP/ScrollTrigger only when a selected reference or interaction requires behavior Scrollcraft does not provide cleanly;
- WebGL/Three.js only when there is a real spatial requirement, never as decoration.

### Explicitly optional / disabled by current client constraints

The public Astra prompt uses Higgsfield MCP for image/video generation. Fares has real assets and explicitly does not want a paid-tool dependency or generated fake client/product media. Therefore:

- Higgsfield is **not required** for the Fares build;
- generated people/garments/client scenes/logos are prohibited;
- the Scrollcraft real-asset path is the default;
- generation may only be reconsidered after a new explicit Fares authorization for a specific non-deceptive asset.

The quality target comes from composition, art direction, interaction, typography, depth, pacing and verification—not from fabricating more media.

## Model boundary

The public examples were built with GPT-6 Astra. The current ChatGPT engineering session uses GPT-5.6 Sol and must not claim otherwise.

We can and will use the same pinned prompt/skill/workflow/reference system. Model identity is not a substitute for the workflow, and the design is not accepted until Fares approves the browser result.

## Implementation rule

Do not iterate the rejected first D-059 candidate into compliance.

Rebuild the review surface from its design floor:

- reuse factual content/data and real review assets;
- replace the layout/interaction system with the Scrollcraft score;
- copy the pinned upstream Scrollcraft engine into the hosted build without modifying the engine;
- keep Fares-specific behavior in page code and tokens;
- keep `apps/public-web` untouched until a new exact design SHA is explicitly approved.
