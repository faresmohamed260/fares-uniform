# Public-site design tokens and component contract

**Status:** design-review proposal / not yet client-approved  
**Authority path:** D-059 -> exact browser-native design SHA after Fares review

## Token philosophy

The Fares shell is neutral, bright and editorial. Client colour belongs to project skins.

### Global colour roles
- canvas: warm chalk/ivory;
- paper: clean warm white;
- ink: near-black;
- muted ink: warm graphite;
- hairline: translucent ink;
- tactile neutral: sand/taupe;
- focus: strong accessible blue;
- success/error states remain semantic and restrained.

### KGC project skin
- deep navy;
- KGC red;
- light blue;
- white;
- diagonal garment-panel motif.

KGC tokens never become global Fares brand tokens merely because KGC is the first populated case.

### Typography
- display: high-contrast editorial serif/system fallback for the design review;
- body/control: clean sans/system stack;
- Arabic: Arabic-capable sans/system stack with a display scale tuned independently.

Final licensed typefaces are a separate approval/production decision.

### Spacing/layout
- 4px base spacing rhythm;
- fluid outer gutters;
- wide editorial max width around 1440px;
- text measure kept narrow even inside wide compositions;
- page sections vary rhythm instead of repeating equal cards.

### Motion
- ordinary micro interaction: ~160–240ms;
- layout/selection spring: ~300–600ms equivalent physical response;
- scroll narrative transitions must remain interruptible;
- reduced motion removes spatial travel while preserving state/information.

## Component/state contract

### Global shell
States: desktop, mobile menu, EN, AR/RTL, keyboard focus.

### Editorial hero
States: default, pointer/touch selection, mobile recomposition, reduced motion.

### Project story
States: project entry, cohort/role selection, look selection, garment transition, mobile, RTL.

### Garment media
States: worn context, front, back, detail annotation, missing optional view, reduced motion.

### Work discovery
States: populated project, text-only sector capability, no fabricated project placeholder.

### Enquiry handoff
States: generic, contextual, submit-ready, pending, success, validation error, upstream error.

## Design-review rule

The final visual values live in the coded review surface and its source-controlled CSS tokens. This document explains intent; screenshots do not replace the code authority.
