# Odoo proof evidence

Status: IN PROGRESS. Platform adoption and client visual review remain open.

## Hosted baseline
- Exact commit: 64e57b9094988f9a1212f5dd68560f429e77b2fc.
- [Run 34066424407](https://github.com/faresmohamed260/fares-uniform/actions/runs/34066424407), job 101575868225: success.
- Odoo Community source: 1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf; Ubuntu 24.04 runner, Python 3.12, PostgreSQL 16, hosted Chrome.
- Log reports **0 failed, 0 errors, 7 tests**, 53.42 seconds of post-install tests.
- Passed: native basic POS order, native one-by-one synchronization, Sales/POS down payment, four factory prototype tests (variant grouping/repeat trigger; configurable deadline; payment/partial collection/overcollection; unauthorized creation).

## Current extension — pending hosted results
Adds a synthetic paid checkout with Odoo's API-offline helper, reload of IndexedDB state, reconnect and repeated synchronization; server asserts one paid order and one payment. Adds the upstream product-screen tour that exercises offline reload. This is not a real network outage: static assets remain accessible and Odoo's test helper overrides fetch/XHR and navigator state.

Adds a native POS style experiment and English desktop/narrow reduced-motion screenshots. Existing Odoo components remain intact. Keyboard evidence is a focus smoke check, not complete keyboard accessibility certification. Screenshot capture is not visual inspection or client acceptance.

## UI direction under test
A restrained deep-ink/teal checkout, warm neutral product surface, rounded native cards and visible focus treatment. Only lightweight press feedback is proposed here. Full physics/morphing design, Arabic translation/RTL, custom order/task rendered review and broader accessibility remain pending. This CSS is a compatibility experiment, not a claim to satisfy the final premium UI requirement.

## Boundaries
- Prototype receipt balances are direct synthetic fields, not an accounting/payment integration.
- Collection rules are isolated from native POS, inventory reservations and stock transfers.
- No scheduler, production ledger, real InstaPay verification, returns or hardware have been integrated.
- No real multi-hour outage, browser storage loss, lost-server-acknowledgement retry, conflict reconciliation or multiple-device behavior has been proven.
- No production hosting or deployment exists. CI database and files are disposable.
- Artifacts are synthetic, retained for seven days; logs and exact source references are the reproducible evidence.

## Continuation
Read PR #1 and the latest branch-head Actions run. Diagnose failing tests before changing gates. Complete remaining visual/RTL and workflow proof gates, then record a platform decision with explicit limitations.
