# Phase 1 — Products, finished stock and access validation

Status: **COMPLETE — PRODUCT / STOCK / ACCESS / BILINGUAL ODOO UI TECHNICAL GATES PASS**  
Date: 2026-09-07

## Scope proven

The authoritative hosted evidence covers the production `fu_core` addon on pinned Odoo Community 19 (`1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`). Odoo remains the source of truth for products, variants, locations, quants, pickings, stock moves and native user/group authorization.

Verified behavior includes:

- inventory-tracked variants receive permanent sequential `FU-000001`-style identifiers and initial matching barcodes;
- Fares-owned FU codes are database-unique and cannot be routinely rewritten;
- distinct non-interchangeable school/client designs remain separate stock identities;
- product-family-specific size/attribute systems remain configurable data rather than hardcoded enums;
- exactly Retail Store and Storage are Fares finished-stock custody locations; no Factory Finished stock location is tracked;
- opening counts use native Odoo inventory mechanics with actor/reason/batch evidence;
- receipts and Store↔Storage transfers use native `stock.picking` / `stock.move` mechanics;
- insufficient-source transfers and untracked finished-stock destinations are rejected;
- stable request keys, PostgreSQL advisory locking and database uniqueness prevent duplicate stock effects on retries;
- changed-payload reuse of an idempotency key is rejected;
- Fares roles are independent, combinable groups with server-side enforcement;
- Owner/Admin has the product/stock/user administration needed by this phase;
- Cashier cannot edit product master data or execute the finished-stock service;
- Inventory Staff can execute controlled receipts/transfers/opening counts only within assigned locations and cannot directly bypass the service with native pickings/quants;
- assigned-location quant visibility is server-enforced;
- Store Manager can read relevant movement evidence while Sales/BD cannot read the stock movement ledger;
- staff cannot self-promote into Owner/Admin or self-add stock locations;
- Owner/Admin can administer Fares roles and stock-location assignments;
- native Odoo Product Lookup, On-hand Stock, Stock Operation and Movement History surfaces are present without a parallel frontend;
- representative Product Lookup and Stock Operation flows render in English and Arabic/RTL in real Chrome;
- the hosted browser checks cover loaded product data/permanent item code, localized Fares labels/actions, keyboard focus, narrow-view overflow, RTL state and reduced-motion behavior, with screenshots captured by the test harness;
- the addon upgrades successfully immediately after the complete test run.

## Authoritative exact-head Phase 1 evidence

Tested implementation head: `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`  
GitHub Actions run: `34110346764`  
Job: `101704871502` (`product-stock-foundation`)  
Result: **SUCCESS**. The full `fu_core` install/test step, repeatable `-u fu_core` upgrade, evidence summary and artifact upload all completed successfully.

Hosted gate definition:
- GitHub-hosted Ubuntu 24.04;
- PostgreSQL 16 service;
- Python 3.12 setup;
- pinned Odoo Community 19 SHA above;
- real Chrome through Odoo `HttpCase` / `browser_js`;
- `websocket-client` for browser execution;
- pinned `rtlcss@4.3.0` for real RTL asset compilation.

Evidence artifact: `phase1-product-stock-eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3`  
Artifact ID: `10014163050`  
Size: `275902` bytes  
SHA-256: `4e2e1a01b7516d0e7a1b93ef77d4ae48f430ff723098c04981033b96fda71fbc`  
Created: `2026-09-07T10:16:42Z`  
Expires: `2026-09-14T10:16:41Z`.

The later Phase 1 closure/docs commit is not substituted for this tested implementation SHA. Any later application-code change requires new exact-head evidence.

## Bilingual UI defect and correction retained as evidence

The first real-browser UI gate at head `37b6dd9664e400be812d5045f1aedec0619c1f59` was not green. A temporary isolated diagnostic workflow at `d782d826559464446754369dd5418c6bbcdc1889` showed that one English stock-operation browser case passed while the English product readiness and Arabic localized-label cases failed.

The diagnosis established three concrete harness/integration defects:

1. the original `ar.po` contained translated text but lacked Odoo resource occurrence references, so view/action/model translations were not loaded as intended;
2. the product browser readiness condition waited for the list shell rather than seeded row data;
3. the hosted environment lacked `rtlcss`, so real RTL asset generation was not part of the gate.

Implementation `eb7b4aaf7f180b15d9f5e593f84f0cfe34bb8df3` corrected all three: the Arabic catalog uses Odoo-native resource references, the product test waits for the seeded garment plus permanent FU code, and the workflows install `rtlcss@4.3.0`.

A narrow corroborating diagnostic run `34110346750`, job `101704870878`, also completed successfully at that same implementation head. The temporary diagnostic workflow is removed in the subsequent closure-only commit and is not part of the durable CI surface.

## Earlier backend/security evidence

Security-complete backend head: `6f55ea20dca7a6fde4641d9d9f11d991fd896597`  
Run: `34097747757`; job: `101665046254`.  
Odoo reported 0 failures/errors across 22 loaded tests (stats counter `fu_core: 28 tests`), with repeatable addon upgrade.  
Artifact ID: `10009320987`; SHA-256 `9b5d5b943003a7708cdede04dbdc06648a788b9a44522d10861b482ab5da70c9`.

Corrected stock-only head: `ccf05a804300d4f64ccd0d259c5881f7954d356c`; run `34096704800`; job `101661859926`; 0 failures/errors across 13 loaded tests (stats `fu_core: 17 tests`).

The failed stock run `34095642996` at `a37b3861cd9146777fc11beda6242c98b689aa44` remains historical evidence: it exposed removed Odoo-19 `stock.move.name` API usage, which was then corrected rather than hidden.

## Phase boundary / limitations

This evidence closes the **Phase 1 technical contract**; it does not claim production deployment or live-business readiness. All fixtures are synthetic. No real opening inventory, printer/scanner/device test, production host, backup/DR or private business data is included.

Technical screenshot/render evidence is distinct from a separate client visual review. The operational visual direction was already approved under Phase 0B/D-033; these Phase 1 screenshots prove implementation conformance checks, not a new visual-approval event.

Later retail/offline security still requires its own validation for queued transactions, expired/revoked authorization, replay/idempotency and synchronization reconciliation. POS, preorders, payments, returns/exchanges and production automation remain outside this phase.
