# Phase 1 — Products and finished-stock validation

Status: **PRODUCT IDENTITY + FINISHED-STOCK CUSTODY VERIFIED; ROLE/ACCESS SLICE IN IMPLEMENTATION**  
Date: 2026-09-07

## Scope proven so far

The hosted evidence covers the production `fu_core` addon on pinned Odoo Community 19 (`1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`). Odoo remains the source of truth for products, variants, locations, quants, pickings and stock moves.

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
- the addon can be upgraded immediately after install/test without registry failure.

## Corrected exact-head evidence

Implementation head: `ccf05a804300d4f64ccd0d259c5881f7954d356c`  
GitHub Actions run: `34096704800`  
Job: `101661859926` (`product-stock-foundation`)  
Runner: Ubuntu 24.04 / Python 3.12.14 / PostgreSQL 16 / Odoo Community 19 pinned SHA above.

Odoo's result line reports **0 failed, 0 errors of 13 loaded tests**; its stats counter reports `fu_core: 17 tests`. The repeatable `-u fu_core` upgrade step also completed successfully.

Evidence artifact: `phase1-product-stock-ccf05a804300d4f64ccd0d259c5881f7954d356c`  
Artifact ID: `10008932412`  
SHA-256: `74830a62249fd2ce5bfcf311c1444dc00371b827cb88fe8bc2d24174bbf1e636`

## Failure retained as evidence

The immediately preceding stock run `34095642996` at `a37b3861cd9146777fc11beda6242c98b689aa44` was not green. It exposed two Odoo-19 API errors because the first implementation supplied the removed `stock.move.name` field. The other product/stock cases passed. The fix removed that legacy field, added an explicit access policy for the movement ledger, and the corrected exact-head run above passed. This failure is retained rather than rewritten out of project history.

## Not yet claimed by this evidence

This document does **not** yet claim Phase 1 complete. Remaining Phase 1 gates include:

- the full Fares role matrix and direct server/API denial tests;
- assigned-location security behavior for staff roles;
- bilingual Odoo-native product/stock internal views and RTL/render evidence;
- final Phase 1 integrated handoff/exit review.

Production hosting, real opening inventory, device/hardware tests and live business data remain outside this hosted synthetic validation.
