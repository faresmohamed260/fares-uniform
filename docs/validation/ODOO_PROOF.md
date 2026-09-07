# Odoo proof evidence

Status: TECHNICAL PROOF PASS / CLIENT VISUAL REVIEW OPEN. Platform adoption is a conditional GO for the tested scope, not production approval.

## Final exact-head proof
- Tested implementation commit: `1ad528e02ed1a709d34620731d182c5e1cbdebe9`.
- Hosted run: `34068805602`, job `101582251955`.
- Odoo Community source: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf` on the 19.0 branch.
- Environment: Ubuntu 24.04 hosted runner, Python 3.12, PostgreSQL 16, Chrome 152.0.7977.64.
- Result: **15 tests, 0 failed, 0 errors**.
- Evidence artifact: `odoo-proof-1ad528e02ed1a709d34620731d182c5e1cbdebe9`.

Passed coverage includes native basic POS order flow, upstream product-screen offline reload, native one-by-one synchronization, Sales/POS down payment and settlement, English/Arabic POS visual checks, English/Arabic task UI checks, four factory rule tests, and separate Cash/Bank offline paid checkout scenarios.

## Offline paid checkout result
The custom Cash and generic Bank scenarios each:
1. opened native POS and switched Odoo's API test transport offline;
2. created and fully paid a synthetic order;
3. reached the receipt screen while the server sync failed with `ConnectionLostError`;
4. reloaded the browser while still offline;
5. restored the same paid order from IndexedDB into the POS model;
6. re-enabled connectivity;
7. invoked synchronization twice; and
8. passed backend assertions requiring exactly one paid `pos.order`, exactly one payment and `amount_paid == amount_total`.

Bank is a generic manual payment fixture. It is **not** an InstaPay integration or bank-notification verification test.

## Odoo 19.0 offline restore defect found
The proof identified a real gap in the pinned/current 19.0 POS restore path. Odoo already persists paid-unsynced orders to IndexedDB after a connection loss, but offline startup calls `getLocalDataFromIndexedDB()` and then `missingRecursive(preLoadData)`. In Odoo 19.0, `missingRecursive()` immediately returns the empty accumulator when `network.offline` is true, before copying the already-read local records into that accumulator. The persisted paid order therefore remains in IndexedDB but is absent from the in-memory `pos.order` model after an offline reload.

Evidence progression:
- run `34068139864` proved both failing orders were present in IndexedDB with `state=paid` and exactly one IndexedDB order record, while the POS model had no matching order;
- run `34068376532` proved this was not a short hydration delay: the order still did not appear in the model within a bounded 10-second window;
- source inspection matched the behavior to the early offline return in `PosData.missingRecursive()`.

The repository now carries an isolated addon-level compatibility shim at `proof/addons/fu_proof/static/src/offline_restore_patch.js`. When offline, it preserves the records already read from IndexedDB; when online, it delegates unchanged to upstream `missingRecursive()`. Odoo core is not forked or modified. Run `34068805602` passed both offline checkout scenarios with this shim.

This dependency must be tracked until an upstream Odoo fix is adopted and revalidated. The platform verdict is therefore **Odoo Community is viable for the proof scope with a small maintained compatibility layer**, not "stock Odoo works unchanged."

## UI / bilingual evidence
English and Arabic POS plus custom production-task screens were captured at desktop and narrow widths. Arabic tests use Odoo's actual RTL mechanism (`body.o_rtl`), not a synthetic CSS-direction assertion. Reduced-motion media behavior is checked on the POS proof styling, and the POS visual tour includes a basic keyboard-focus smoke check.

The generated screenshots confirm bilingual/responsive compatibility, but they do **not** constitute client design approval. The backend task views remain visibly close to stock Odoo, and the POS styling is only a restrained compatibility experiment. The final requirement remains a substantially more polished Fares-owned UX; screenshot capture is not evidence that this requirement is satisfied.

## Factory workflow evidence
The synthetic proof addon passes bounded tests for:
- size-specific demand grouping and repeat trigger behavior;
- configurable deadline trigger behavior;
- collection balance rules including partial collection and overcollection rejection;
- unauthorized creation protection;
- production task state presentation in English and Arabic.

These are proof models, not production accounting, stock, manufacturing or audit ledgers.

## Earlier evidence chain
### Hosted baseline
- Exact commit: `64e57b9094988f9a1212f5dd68560f429e77b2fc`.
- Run `34066424407`, job `101575868225`: success.
- 7 tests, 0 failures/errors.
- Passed native basic POS order, native one-by-one synchronization, Sales/POS down payment, and four factory prototype tests.

### Extension run 2 — harness correction
- Commit `4ba3e572e4f301a66a4dd79a444986c88b3be933`, run `34066761654`.
- 10 tests: 1 failed, 1 error because custom POS tours were declared only in `point_of_sale.assets_debug`.
- Upstream test injection uses `web.assets_tests`; registering the tours there corrected the harness. No failing application assertion was suppressed.

### Extension runs — RTL and offline diagnosis
- Commit `21616f07fc69b1652dabe070da55b0c0e61266ca`, run `34067062584`: Arabic checks used the wrong RTL assertion and offline restore assertions exposed missing in-memory orders.
- Commit `461f0096738143ef6d649fba7618637845309283`, run `34068139864`: RTL was corrected to Odoo's `o_rtl` class; Arabic tests passed. Diagnostic evidence showed `model=missing`, `indexedDB=paid`, `indexedCount=1` for both offline payment methods.
- Commit `6f22b3954a41aa93aeca29788d89f94442d81c1b`, run `34068376532`: a bounded hydration wait still failed both offline restore cases, ruling out a momentary startup race.
- Commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9`, run `34068805602`: addon-level offline restore shim added; 15/15 tests passed.

## Remaining red/unproven areas
- The test helper simulates API connectivity loss while static assets remain locally available; it is not router/Wi-Fi/network-interface isolation.
- No real multi-hour outage, device sleep/reboot, browser-storage eviction/loss, abrupt power loss, lost-server-acknowledgement recovery or multi-register conflict has been proven.
- The compatibility shim needs production hardening, explicit regression tests and an upstream-fix retirement path.
- No actual InstaPay verification, bank-notification ingestion, card/wallet integration or automated reconciliation exists.
- Collection rules are not yet wired to native accounting, inventory reservations, stock transfers, returns or refunds.
- No scanner, printer or other store hardware has been exercised.
- No production host, backup/restore, observability, disaster recovery or deployment process exists.
- Accessibility evidence is only a focused smoke check, not WCAG certification.
- Premium UI/UX and client visual acceptance remain open.

## Platform decision
**Conditional GO:** use Odoo Community as the candidate ERP/domain core and preserve native mechanics where they are strong, while building Fares-owned addons and a substantially customized UX. Do not assume stock Odoo is sufficient. Keep the offline restore compatibility shim isolated and monitored until upstream behavior changes.

This technical proof closes its bounded execution gate. Remaining Phase 0 discovery and the client UI decision still precede production foundation work.
