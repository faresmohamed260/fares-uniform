# Phase 0B UI foundation evidence

Status: HOSTED BUILD / RENDER / INTERACTION GATES PASS; CLIENT VISUAL REVIEW OPEN, 2026-09-07.

This document records technical evidence for the disposable Phase 0B representative UI. It does not make the prototype a production application and does not constitute client approval of the visual direction.

## Exact-head successful run

- Implementation commit: `670dd9999788ee01f6df6e000675054ef0153a6a` on `foundation/phase-0b`.
- Workflow: `Phase 0B UI review`.
- Run: `34070644678`.
- Job: `101587223017`.
- Runner: Ubuntu 24.04.4 hosted runner.
- Node: `v24.20.0`.
- npm: `11.19.0`.
- Next.js build: `16.3.4` with Turbopack.
- Browser: Chrome for Testing `153.0.8010.12` through Playwright `1.63.0`.
- Result: typecheck passed, optimized production build passed, **12/12 browser tests passed**.
- Artifact: `phase0b-ui-670dd9999788ee01f6df6e000675054ef0153a6a`, artifact ID `10000345256`.
- Artifact digest: `sha256:97379e0c56b0ed7c0f9ecccd9690f3bd5a46f2c5552e9309f048faf494695e72`.
- Artifact retention in this bounded proof: seven days from the run.

The successful push workflow checked out the exact branch head `670dd9999788ee01f6df6e000675054ef0153a6a`; this is not a claim about an untested later commit.

## Representative routes

The disposable review app lives under `prototype/review-ui` and contains synthetic data only.

Representative routes:
- `/pos`: product/search/cart/payment/synchronization state;
- `/order`: preorder balance, fulfillment and collection context;
- `/production`: size/design demand queue and production state;
- `/public`: large-client landing/catalog/product-detail/enquiry direction.

The prototype is deliberately separate from Odoo runtime code. It demonstrates the shared Fares design language and product information hierarchy; it does not replace native Odoo POS mechanics or establish React as the internal ERP runtime.

## Render evidence

The successful run generated full-page screenshots for all eight required baseline combinations:

1. `pos-en-desktop.png` — English, 1440 × 1000 viewport.
2. `pos-ar-mobile.png` — Arabic RTL, 390 × 844 viewport.
3. `order-en-desktop.png` — English, 1440 × 1000 viewport.
4. `order-ar-mobile.png` — Arabic RTL, 390 × 844 viewport.
5. `production-en-desktop.png` — English, 1440 × 1000 viewport.
6. `production-ar-mobile.png` — Arabic RTL, 390 × 844 viewport.
7. `public-en-desktop.png` — English, 1440 × 1000 viewport.
8. `public-ar-mobile.png` — Arabic RTL, 390 × 844 viewport.

For every capture, the browser test required the intended `html[dir]` value and no document-level horizontal overflow beyond a one-pixel tolerance.

Screenshot creation proves that the routes rendered at the tested dimensions. It does **not** prove client taste/brand approval or a complete professional visual audit. The current GitHub connector can verify the artifact and test evidence but does not provide a suitable remote visual-inspection surface for agency-level screenshot comparison. That limitation remains explicit rather than being replaced by local file inspection, which project rules prohibit.

## Interaction and accessibility-oriented checks

The hosted tests also proved:
- adding another School Polo updates the existing cart line from quantity 2 to quantity 3;
- InstaPay can be selected and exposes the selected state through `aria-pressed`;
- switching the simulated POS to pending synchronization exposes the pending state and explanatory local-device note;
- the public route's rendered copy contains no `EGP`, stock or add-to-cart language and opens an enquiry-oriented product detail state;
- keyboard tab focus lands on an interactive checkout element with a visible computed outline;
- browser `prefers-reduced-motion: reduce` is detected and the representative public spatial transform computes to `none`.

These are focused acceptance checks. They are not a WCAG certification, complete assistive-technology audit or production POS reliability test.

## Bilingual / RTL boundary

Arabic uses the same component and information architecture rather than a separate visual theme. The review layer sets document language/direction and uses logical CSS flow. The mobile Arabic screenshot paths exercise true RTL at the document level and the overflow assertion ensures the tested primary layouts do not require document-level horizontal scrolling.

Mixed-direction identifiers and numbers remain synthetic. Actual receipt printing and real hardware are outside Phase 0B.

## Public-data boundary represented in the UI

The public review surface intentionally shows no price or stock availability. The hosted browser assertion checks the rendered public surface for price (`EGP`), stock and add-to-cart language. This is UI evidence only; production data-leak prevention still requires the narrow `fu_public_api` output schema and server-side tests defined in `docs/architecture/FOUNDATION_ARCHITECTURE.md`.

## Reduced-motion defect found and corrected

The first hosted browser run exposed one failure rather than being accepted as-is:

- head: `89cba2e22292fae979c18021e2f4076d87600a4f`;
- run: `34070456047`;
- job: `101586702367`;
- result: 11 passed / 1 failed.

All eight render captures, POS interaction, public-boundary wording and keyboard-focus tests passed. The failing assertion expected Motion's `useReducedMotion()` hook state to mirror Playwright's media emulation, but the hook remained `false` in that environment.

Commit `670dd9999788ee01f6df6e000675054ef0153a6a` strengthened the behavior instead of weakening the test:
- a browser-native `@media (prefers-reduced-motion: reduce)` override suppresses spatial transforms at CSS priority on the representative animated elements;
- the test verifies that the browser media query itself matches and that the rendered hero transform computes to `none`;
- the repository TypeScript configuration was aligned with Next.js 16's mandatory build settings instead of allowing the build to rewrite it transiently.

Run `34070644678` then passed all 12 tests.

## Prototype limitations

- Visual palette, type family and final component preset are still candidates, not client-approved durable brand decisions.
- Garment artwork is synthetic vector-style placeholder imagery for layout review, not final catalog photography/assets.
- The review app is not wired to Odoo, a database, real customers, stock, payments or enquiry submission.
- The POS surface demonstrates interaction/state language; it is not the Odoo/Owl implementation and does not prove production offline reconciliation beyond Phase 0A.
- No real InstaPay verification exists. InstaPay here is a selectable recorded-payment label only.
- No printer/scanner/hardware integration is exercised.
- No production deployment, domain, host or paid resource is created by this evidence.
- Client visual review remains mandatory before the design direction is locked.

## Current verdict

The Phase 0B representative frontend foundation is technically viable under the tested synthetic envelope: it builds remotely, renders bilingual LTR/RTL desktop/mobile surfaces, avoids tested mobile document overflow, preserves the public no-price/no-stock direction, responds to representative interactions, exposes keyboard focus and respects reduced motion at rendered CSS level.

**Technical UI foundation gate: PASS. Client visual direction gate: OPEN.**
