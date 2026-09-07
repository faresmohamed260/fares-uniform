# Phase 1 — Products, finished stock and access validation

Status: **PRODUCT IDENTITY + FINISHED-STOCK CUSTODY + ROLE/ACCESS VERIFIED; BILINGUAL INTERNAL UI IN IMPLEMENTATION**  
Date: 2026-09-07

## Scope proven so far

The hosted evidence covers the production `fu_core` addon on pinned Odoo Community 19 (`1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`). Odoo remains the source of truth for products, variants, locations, quants, pickings, stock moves and native user/group authorization.

Verified behavior includes:

- inventory-tracked variants receive permanent sequential `FU-000001`-style identifiers and initial matching barcodes;
- Fares-owned FU codes are database-unique and cannot be routinely rewritten;
- product design separation and garment-specific configurable size systems remain native product/variant data rather than hardcoded enums;
- exactly the confirmed Retail Store and Storage locations are marked as Fares finished-stock custody locations;
- there is no tracked Factory Finished stock location;
- opening counts use native Odoo inventory adjustments with reason/batch evidence;
- receipts and Store↔Storage transfers use native `stock.picking` / `stock.move` mechanics;
- insufficient-source transfers and untracked finished-stock destinations are rejected;
- a stable request key is serialized with a PostgreSQL advisory transaction lock and database uniqueness so retries do not duplicate stock effects;
- reusing an idempotency key with a changed payload is rejected;
- Fares roles are independent groups and can be combined on one user;
- Owner/Admin inherits native product/stock/user administration needed for this phase;
- Cashier cannot edit product master data or execute the finished-stock service;
- Inventory Staff can execute the Fares receipt/transfer/opening-count service within assigned locations but cannot directly create native Odoo pickings or inventory quants;
- assigned-location quant visibility is enforced server-side for location-scoped roles;
- Inventory Staff cannot operate on an unassigned source or destination;
- Store Manager can read movement evidence for an assigned location while Sales/BD cannot read the stock movement ledger;
- staff cannot self-promote into Owner/Admin or self-add a stock location;
- Owner/Admin can administer Fares roles and stock-location assignments;
- the addon can be upgraded immediately after install/test without registry failure.

## Current exact-head role/access evidence

Implementation head: `6f55ea20dca7a6fde4641d9d9f11d991fd896597`  
GitHub Actions run: `34097747757`  
Job: `101665046254` (`product-stock-foundation`)  
Runner: Ubuntu 24.04 / Python 3.12.14 / PostgreSQL 16 / Odoo Community 19 pinned SHA above.

Odoo's result line reports **0 failed, 0 errors of 22 loaded tests**; its stats counter reports `fu_core: 28 tests`. Expected ACL-denial log entries are assertions in the security suite, not unexpected errors. The repeatable `-u fu_core` upgrade step also completed successfully.

Evidence artifact: `phase1-product-stock-6f55ea20dca7a6fde4641d9d9f11d991fd896597`  
Artifact ID: `10009320987`  
SHA-256: `9b5d5b943003a7708cdede04dbdc06648a788b9a44522d10861b482ab5da70c9`

## Earlier corrected stock-only evidence

Implementation head: `ccf05a804300d4f64ccd0d259c5881f7954d356c`  
GitHub Actions run: `34096704800`  
Job: `101661859926`  
Result: **0 failed, 0 errors of 13 loaded tests**; Odoo stats `fu_core: 17 tests`.  
Artifact ID: `10008932412`  
SHA-256: `74830a62249fd2ce5bfcf311c1444dc00371b827cb88fe8bc2d24174bbf1e636`

## Failure retained as evidence

Stock run `34095642996` at `a37b3861cd9146777fc11beda6242c98b689aa44` was not green. It exposed two Odoo-19 API errors because the first implementation supplied the removed `stock.move.name` field. The other product/stock cases passed. The fix removed that legacy field and added an explicit movement-ledger access policy; the corrected runs above passed. This failure remains part of project history.

## Not yet claimed by this evidence

This document does **not** yet claim Phase 1 complete. Remaining Phase 1 gates include:

- bilingual Odoo-native product/stock internal views and Arabic RTL/render evidence;
- final Phase 1 integrated handoff/exit review.

Later retail/offline security still needs separate validation for expired offline authorization, role revocation while transactions are queued, replay handling and synchronization reconciliation. Production hosting, real opening inventory, device/hardware tests and live business data remain outside this hosted synthetic validation.
