# Fares Uniform Scrollcraft reference board

**Status:** implementation reference, not copy authority  
**Rule:** borrow mechanisms and art-direction principles; never copy brand artwork, proprietary photography or another site's identity.

## Godly references

### TRUE
Source: `https://godly.website/website/true-699`

Useful signals:
- fashion + construction crossover is directly relevant to Fares;
- light palette with large editorial type;
- background imagery, parallax, 3D/WebGL and transitions used as composition rather than a dashboard effect;
- GSAP is evidence that higher-complexity motion is acceptable when the interaction earns it.

Borrow:
- confidence in scale;
- image/type overlap;
- construction/fashion duality;
- choreography quality.

Do not borrow:
- brand identity;
- exact font pair;
- WebGL merely because TRUE uses it.

### Pam
Source: `https://godly.website/website/pam-969`

Useful signals:
- black/white restraint;
- large type;
- minimal/light presentation.

Borrow:
- reduction and negative space;
- willingness to let typography and image placement carry luxury.

Do not borrow:
- ecommerce structure.

### The Pop Manifesto
Source: `https://godly.website/website/the-pop-manifesto-520`

Useful signals:
- horizontal composition;
- scrolling animation;
- transitions and full-background moving media.

Borrow:
- lateral movement as a purposeful change of rhythm;
- deliberate route between scenes.

Do not borrow:
- its colourful music/editorial brand language.

## 21st.dev references

### Layer Parallax Hero
Source: `https://21st.dev/@erikvalencia1/components/layer-parallax-hero`

Borrow:
- independent visual planes;
- foreground/subject/background movement with controlled depth.

Use as a reference for Scrollcraft hero-depth implementation, not as a drop-in final hero.

### Scroll media expansion / Scroll Morph family
Source overview: `https://news.21st.dev/blog/react-hero-section-examples`

Borrow:
- the opening gesture can transform the hero into the next content state;
- scroll itself becomes the transition.

Constraint:
- native scrolling remains in control;
- no long pin whose payoff is only text fading.

### Image Stream Hero
Source: `https://mcp.21st.dev/@ruixen.ui/components/image-stream-hero`

Borrow selectively:
- a media collection can have spatial perspective rather than a standard grid;
- useful inspiration for Work/Garments collection movement.

Do not copy:
- stock imagery;
- generic “image tunnel” behavior as the Fares signature.

## Awwwards fashion references

Research set:
- Polène;
- P448;
- Richard George Tailoring;
- other current fashion/editorial entries in `https://www.awwwards.com/websites/fashion/`.

Borrow:
- product material as hero;
- sparse factual copy near products;
- confident editorial framing;
- fashion-level photographic scale;
- strong mobile composition.

Do not borrow:
- retail price/cart/storefront conventions;
- invented luxury claims;
- any proprietary photography.

## Existing Fares/Pattern context

Keep the creative intelligence that produced Pattern in Motion:
- tactile material/construction;
- people and garments as the actual visual heroes;
- meaningful occlusion;
- transformations rather than unrelated scene replacement;
- cinematic chapters alternating with quiet editorial intervals;
- organization/program → people/roles → looks → garments → construction/detail → enquiry.

Do **not** use the old generated boards as pixel targets.

## Chosen synthesis

The new design should feel like:

**fashion editorial art direction + patternmaking/manufacturing logic + Scrollcraft cinematic pacing + real Fares/KGC media.**

It should not look like:

**a Next.js template with luxury typography placed on top.**
