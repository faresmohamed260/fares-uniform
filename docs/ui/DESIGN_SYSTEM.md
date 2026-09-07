# Fares Uniform design system direction

Status: PHASE 0B DESIGN FOUNDATION / CLIENT VISUAL APPROVAL PENDING, 2026-09-07.

## Goal
Create a premium modern bilingual system that feels deliberate and high quality without sacrificing the speed and predictability needed at checkout. Physics/morphing effects are a client requirement, but motion must communicate structure and state rather than decorate every interaction.

The Phase 0A proof UI is compatibility evidence only and is not the visual reference for this system.

## 1. Design principles

### Premium, not ornamental
Use strong spacing, typography, material depth and clear state hierarchy first. Motion enhances transitions after the static hierarchy works.

### Operational speed wins at POS
Scanning, adding products, entering quantity, choosing payment and validating must never wait on a decorative animation. High-frequency controls stay stable and predictable.

### Expressive public experience
The public site can use richer layout transitions, image reveals, shared-element product transitions and spring-based section interactions because it is not the transaction-critical checkout surface.

### One brand, two runtimes
Public web uses React components; internal Odoo uses Owl/Odoo components. Share token meanings, visual grammar and motion principles—not implementation code.

### Bilingual by construction
Every representative layout is designed for both LTR and RTL. Arabic is not a late mirrored stylesheet pass.

## 2. Component-source strategy

### Public web
Preferred order:
1. shadcn/ui maintained/source-owned components;
2. accessible primitives already used by shadcn where appropriate;
3. composed project components;
4. custom generic primitives only when no maintained component fits.

Use semantic tokens and component variants instead of raw page-specific colors. Compose existing Button, Card, Dialog/Sheet/Drawer, Field/Form, Tabs, Table, Badge, Tooltip, Skeleton and navigation primitives before inventing replacements.

Motion is used for layout/shared-element/spring interaction. Exact dependency versions are recorded by the actual hosted scaffold.

### Internal Odoo
Use native Odoo/Owl components, services and extension points. Style through Fares semantic variables/classes and small focused patches. Do not create a parallel React component tree inside POS.

## 3. Token model

Do not lock final brand colors before visual review. Define semantic roles first.

### Color roles
- `background`: primary application/page canvas;
- `surface`: cards/panels;
- `surface-raised`: overlays/active working panels;
- `foreground`: primary text;
- `muted`: secondary text/background affordance;
- `border`: structural separation;
- `accent`: Fares primary interaction/brand emphasis;
- `accent-foreground`: content on accent;
- `success`, `warning`, `danger`, `info`: operational state semantics;
- `focus-ring`: keyboard focus independent of hover/selection.

No status should rely on color alone.

### Typography
Requirements:
- highly legible numerals for quantities, money and order identifiers;
- Arabic and Latin families with compatible visual weight/x-height where practical;
- tabular numerals where alignment matters;
- restrained heading scale in operational apps, more expressive scale allowed on public marketing pages.

Exact font families remain a prototype decision and must be remotely licensed/load-tested before adoption.

### Shape
Use a small radius scale rather than arbitrary radii. Interactive controls, cards and overlays can differ by one or two deliberate steps; avoid every container becoming a pill.

### Spacing
Use a consistent density scale. POS density should support rapid scanning without becoming cramped; public pages can use substantially more whitespace.

### Elevation
Prefer border/surface contrast and restrained shadow. Elevation communicates layering; it is not a glow effect.

## 4. Motion system

Motion levels:

### Level 0 — state feedback
Press, focus, selection and validation feedback. Very short and never blocking.

### Level 1 — local layout
Cart line addition/removal, panel resize, status progression, list reordering. Spring/layout animation allowed when it preserves orientation.

### Level 2 — navigation/shared element
Product card → detail, order row → order detail, public gallery transitions. Use shared-element/morphing concepts where they clarify continuity.

### Level 3 — ambient/hero
Public-site decorative/physics effects only. Must not reduce readability, introduce scroll jank or become the main navigation mechanism.

Rules:
- no motion gate before payment validation;
- no layout animation that makes barcode-driven item insertion hard to track;
- no infinite attention-seeking motion in operational screens;
- motion should be interruptible;
- `prefers-reduced-motion: reduce` removes non-essential transforms/shared-element travel and preserves instant state changes;
- transitions must not be required to understand what changed.

## 5. Layout grammar

### POS desktop
- stable product/search region;
- persistent cart/order region;
- totals/payment actions visually dominant when relevant;
- large touch targets without tablet-only assumptions;
- connection/sync status always visible but not alarming when healthy.

### POS narrow
- intentional pane switching rather than simply shrinking desktop columns;
- cart/payment remains one predictable action away;
- no horizontal scrolling for primary checkout controls.

### Order/preorder
Prioritize:
1. customer + promise date;
2. balance/payment state;
3. fulfillment/collection quantities;
4. production/readiness state;
5. detailed line/history context.

Do not conflate paid, produced and collected into one progress indicator.

### Production queue
Optimize for next action:
- what needs work;
- size/design grouping;
- threshold/deadline reason;
- promised date risk;
- current production state.

Do not turn this into a generic analytics dashboard.

### Public catalog
- photography/product story leads;
- no price or stock affordance;
- clear path to enquiry/WhatsApp/phone;
- large-client credibility and manufacturing capability are higher-priority than ecommerce conventions.

## 6. RTL and Arabic rules

- Use logical CSS properties/flow rather than left/right assumptions.
- Mirror navigation/layout direction when appropriate, not imagery/text meaning blindly.
- Numbers, codes and mixed-direction content must remain readable.
- Icons with directional meaning mirror; neutral icons do not automatically mirror.
- Ensure receipt/order identifiers and phone numbers preserve expected reading order.
- Test Arabic strings long enough to expose truncation/line-wrap problems.

## 7. Accessibility baseline

Representative surfaces must demonstrate:
- keyboard reachable primary actions;
- visible focus;
- accessible names for icon-only controls;
- dialog/sheet titles and focus management;
- semantic form fields/errors;
- sufficient text/control contrast;
- status conveyed by text/iconography as well as color;
- reduced-motion behavior;
- touch targets suitable for store use.

This is an implementation baseline, not a claim of formal WCAG certification.

## 8. Required visual-review set

Client visual approval should be based on one coherent set, not isolated hero screens:

1. POS — product grid + cart, desktop English.
2. POS — same state, narrow Arabic RTL.
3. Payment/confirmation — online and pending-offline state.
4. Preorder/order detail — balance + partial collection + readiness context.
5. Production queue/task — threshold/deadline reason and state progression.
6. Public landing/catalog — desktop English.
7. Public catalog/product detail — narrow Arabic RTL.
8. Reduced-motion equivalents for one public morph and one internal layout transition.

Synthetic content only.

## 9. Rejection criteria

Reject a visual direction if it:
- looks like lightly recolored stock Odoo across primary internal workflows;
- hides native operational state behind decorative layers;
- requires a React rewrite of native POS mechanics solely for appearance;
- treats Arabic as an afterthought;
- uses physics/morphing on every interaction;
- causes checkout controls to move unpredictably;
- depends on inaccessible custom controls when maintained primitives exist;
- cannot produce a credible reduced-motion mode.

## 10. Approval state

No color palette, typography family, final component preset or screenshot is client-approved yet. Phase 0B must produce rendered options/evidence before these become durable visual decisions.
