# Repo-first browser-native UI/UX workflow

**Status:** mandatory / client-approved  
**Authority:** D-059, accepted by Fares on 2026-09-21  
**Applies to:** all future public-site UI, UX, layout, component, responsive, RTL and motion work  
**Paid design-tool dependency:** none

## Purpose

Fares Uniform does not use generated website images, static mockups or screenshots as implementation specifications. The public UI is designed in repository-owned artifacts and in the browser so the thing Fares approves is materially the thing engineering ships.

Required chain:

`UX contract -> design tokens -> coded components/states -> coded browser pages/motion -> Fares approves exact Git commit -> production promotion/reuse -> regression evidence`

Do not use the old chain:

`generated/static image -> interpretation -> prototype -> reinterpretation -> production`

## Authority hierarchy

For public-site UI/UX, use this order:

1. client-confirmed product/UX requirements and durable decisions;
2. UX, information-architecture and page contracts in the repository;
3. source-controlled design tokens and component/state contracts;
4. repository-owned browser-native design implementation;
5. the exact Git commit explicitly approved by Fares as the current UI authority;
6. production implementation derived by reuse/promotion from that authority;
7. hosted interaction/accessibility/regression evidence proving the implementation.

Generated images, concept art, moodboards, screenshots and old prototype captures may provide inspiration or evidence only. They are not UI specifications.

## Tooling

No Figma or other paid/proprietary design SaaS is required.

Preferred repository-owned/open tooling:
- GitHub for contracts, decisions, tokens, code, approvals and exact commit identity;
- React/Next.js for browser-native page composition;
- Storybook, or an equivalent open-source repository-owned component review surface, for isolated components and states;
- Playwright for browser journeys, viewport/RTL checks and rendered regression evidence;
- source-controlled CSS/TypeScript/JSON design tokens;
- Motion or another justified maintained code library for interactions that cannot be truthfully specified statically.

Self-hosted/open-source visual editors such as Penpot are optional aids only. They never become the sole source of truth.

## Required design sequence

### UX and information architecture

Before visual implementation, define audiences/goals, navigation, page purposes, content hierarchy, key journeys, desktop/mobile behavior, EN/AR + RTL behavior, loading/empty/degraded/error states, keyboard/touch/reduced-motion expectations and publication/privacy boundaries.

### Design tokens

Represent reusable visual decisions as source-controlled tokens: color roles, typography, spacing, layout widths/grids, radii/borders/elevation when used, breakpoints, motion timing/springs and focus/accessibility treatment. Avoid unexplained one-off values.

### Components and states

Design reusable components in code before duplicating page-specific variants. Review meaningful states including default/hover/focus/pressed/disabled, loading/empty/error/degraded, desktop/mobile, English/Arabic RTL, reduced motion, long content and missing media.

Prefer maintained accessible primitives before custom generic controls.

### Browser-native page composition

Compose representative pages from the tokens/components in a non-production design-review surface using real HTML/CSS/JS behavior, realistic content shapes and the actual responsive system.

At minimum, review the active homepage, work/project, catalog/garment, garment inspection and enquiry surfaces in representative desktop/mobile and EN/AR/RTL states.

### Motion and physics

Motion-heavy ideas are designed in code. Each exceptional interaction defines its trigger/end state, interruption/reversal, keyboard/touch behavior where relevant, reduced-motion behavior with information parity, performance/fallback and whether behavior is generic or content-capability-driven.

Do not adopt heavy animation/3D libraries merely to imitate a concept image.

## Client approval gate

Fares reviews the browser-native design environment, not a generated/static design image.

Approval is recorded against an **exact Git commit SHA** and states the surfaces/states included. That commit becomes the current UI authority. Approval of a concept image, screenshot, moodboard, production preview or isolated screenshot does not substitute for this gate.

Material post-approval design changes must update the browser-native authority first and receive a new explicit approved SHA before production promotion.

## Production implementation

Minimize translation between approved design and production:
- reuse the same tokens;
- reuse/promote the same component implementations where architecture permits;
- preserve component/state contracts;
- do not rebuild from screenshots;
- do not hand-copy geometry from visual captures;
- do not silently simplify motion/responsive/RTL behavior.

If architecture requires a different implementation, document the reason and prove behavior against the coded authority rather than against a screenshot.

## Validation after approval

Screenshots become useful after browser-native authority exists. Hosted validation covers exact-source build/type/static checks, component interactions, canonical desktop/mobile viewports, EN/AR RTL, keyboard/focus/touch, reduced motion, loading/error/degraded states, accessibility, resource/performance budgets, visual regression against approved rendered states from the authoritative commit, and all existing no-price/no-stock/private/publication/security boundaries.

A screenshot difference is a regression signal to inspect, not a source from which to derive the design.

## Existing Pattern in Motion material

The four PNG boards under `docs/ui/assets/approved-pattern-in-motion/`, the Phase 9 prototype and its hosted captures are retained as historical creative/reference and engineering evidence. They may inform discussion of editorial composition, garment-centered storytelling and purposeful kinetic interaction.

They are not current implementation authority. Do not pixel-match against them and do not ask Fares to approve a production rewrite merely because automated screenshot parity passes.

The current Phase 10 preview likewise remains useful as a record of the production architecture and existing implementation, but it is not a replacement for this browser-native design approval gate.

## Current Phase 10 transition

Phase 10's Odoo/R2/publication/security/enquiry/cache/SEO foundations remain valid unless subsequent UI work changes those contracts. The visual/interaction completion boundary is reopened.

Next public-site design work must establish UX/page contracts, design tokens, component/state review surfaces and browser-native pages; prove desktop/mobile + EN/AR/RTL + reduced-motion behavior; obtain Fares approval on an exact Git SHA; reconcile/promote `apps/public-web` from that authority; rerun exact-SHA hosted validation; and only then return to Phase 10 visual completion/closure.

Production cutover, PR merges and KGC/real-client publication remain separately gated.
