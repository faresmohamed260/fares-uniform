# Phase 0B UI foundation evidence

Status: **REVISED PREBUILT-FIRST BUILD / RENDER / INTERACTION GATES PASS; CLIENT VISUAL REVIEW OPEN**, 2026-09-07.

This document records technical evidence for the disposable representative UI. Technical pass is not client taste/brand approval and does not make the prototype a production application.

## Client correction to the first baseline

The first exact-head baseline (`670dd9999788ee01f6df6e000675054ef0153a6a`, run `34070644678`) passed its 12/12 browser gate, but the client explicitly rejected that direction as insufficient: ordinary controls were still substantially hand-built and the physics/morphing effects were too subtle compared with the requested modern Claude/GPT-demo style.

That baseline remains historical technical evidence only. It is **superseded for visual review**. D-031 now makes maintained prebuilt components a hard default and requires conspicuous representative physics/morphing.

## Maintained component migration

The existing Next.js review app was migrated remotely rather than recreated locally. The first official shadcn initialization attempt failed because the pre-existing app had no Tailwind foundation; hosted CI then added the official Tailwind v4 Next.js/PostCSS setup and reran the official shadcn CLI.

The resulting project uses:
- shadcn `4.21.0`;
- Base UI foundation;
- `rtl: true` in `components.json`;
- official generated Button, Card, Badge, Tabs, Dialog, Sheet, Progress, Separator and Input primitives;
- Motion `13.1.1` for Fares-specific spring/layout/shared-element/ambient behavior.

Generic controls are composed from maintained primitives; Motion does not replace them with a second custom control library.

## Revised visual/motion implementation

The revised representative screens add deliberately visible motion rather than tiny tap-only feedback:
- morphing ambient background forms;
- morphing public hero shape;
- spring/perspective product-card response;
- shared spring payment selection;
- sync-pill shape/content transition;
- cart/total layout transitions;
- shared order-stage spring transition;
- expanding production-task cards;
- public catalog-card → maintained accessible Dialog shared-element morph.

High-frequency checkout actions remain immediately usable. Browser-native reduced-motion CSS removes non-essential spatial transforms/animation.

## Final exact-head successful run

- Implementation commit: `fa9ef2413177a54e566c5505e1e858696c8a9bfb` on `foundation/phase-0b`.
- Workflow: `Phase 0B UI review`.
- Run: `34073833275`.
- Job: `101596052081`.
- Runner: Ubuntu 24.04.4 hosted runner.
- Node: `v24.20.0`.
- npm: `11.19.0`.
- Next.js: `16.3.4` with Turbopack.
- Browser: Chrome for Testing `153.0.8010.12` through Playwright `1.63.0`.
- Result: typecheck passed, optimized production build passed, **15/15 browser tests passed**.
- Artifact: `phase0b-ui-fa9ef2413177a54e566c5505e1e858696c8a9bfb`, ID `10001375991`.
- Artifact digest: `sha256:7872baafe8a9fee34beae63c24f4dfa3d05dbce0177f024a5e23f744ae218dc8`.
- Artifact retention: seven days from the run.

The successful workflow checked out the exact branch head `fa9ef2413177a54e566c5505e1e858696c8a9bfb`.

## Final 15-test gate

The hosted browser suite proved:
1. POS English desktop render.
2. POS Arabic RTL mobile render.
3. Order English desktop render.
4. Order Arabic RTL mobile render.
5. Production English desktop render.
6. Production Arabic RTL mobile render.
7. Public English desktop render.
8. Public Arabic RTL mobile render.
9. POS actually uses maintained Input/Button/Card primitives and keeps add-to-cart, payment and pending-sync interaction working.
10. Mobile POS uses the maintained Tabs primitive and switches to cart/payment correctly.
11. Public catalog keeps commercial availability private and opens the maintained Dialog primitive.
12. Catalog Dialog opens by keyboard and dismisses with Escape.
13. Keyboard focus remains visibly styled.
14. Under normal motion preference, the representative morph element computes a non-`none` transform.
15. Under `prefers-reduced-motion: reduce`, the same spatial physics transform computes exactly to `none`.

Every screenshot route also checks intended document direction and no document-level horizontal overflow beyond a one-pixel tolerance.

## Defects found during the redesign

The stronger gate found real integration/test issues before the final pass:
- redesigned run `34073432534` exposed four failures: responsive duplicate-DOM locator assumptions, public copy containing the literal protected word `stock`, and residual reduced-motion transform;
- the following correction made public availability language private and added strict browser-native reduced-motion suppression;
- run `34073734452` then passed 14/15, leaving only a responsive duplicate product locator in the POS interaction test;
- the final test scopes interaction to the visible responsive surface, after which run `34073833275` passed 15/15.

These failures were fixed rather than weakening the prebuilt/motion requirements.

## Boundaries and limitations

- The review app contains synthetic data only and is not wired to Odoo, a real database, payments, enquiries or real stock.
- The React POS-looking surface demonstrates design/state language only; production checkout remains Odoo/Owl.
- No real InstaPay verification or hardware integration is implemented.
- Garment artwork remains synthetic placeholder art rather than approved product photography.
- Final palette, typography, brand assets and the overall rendered direction remain client-reviewable.
- Automated screenshots/tests cannot substitute for the client's visual-quality judgment.

## Current verdict

The revised Phase 0B frontend foundation now technically demonstrates the requested implementation strategy: maintained prebuilt components are actually used, normal mode contains conspicuous physics/morphing behavior, RTL/mobile/accessibility checks pass, and reduced motion removes spatial physics.

**Revised technical UI foundation gate: PASS. Client visual direction gate: OPEN.**
