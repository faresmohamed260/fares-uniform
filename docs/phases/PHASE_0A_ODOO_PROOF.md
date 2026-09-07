# Phase 0A — Hosted Odoo proof of fit

Status: TECHNICAL PROOF PASS / CLIENT VISUAL REVIEW OPEN, 2026-09-07.
Authorization: client "I approve, go ahead" to the proposed hosted proof and preceding contract. This technical spike runs alongside remaining Phase 0 discovery; it does not declare discovery complete or authorize production deployment.

## Goal
Prove whether pinned Odoo Community can support the factory's offline POS and small custom workflows while preserving its native mechanics and meeting a premium bilingual UI direction.

## Verified starting point
Documentation-only project main; source assessment at Odoo commit 1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf. No existing application or runtime tests. GitHub writes/read access verified; hosted Actions execution was subsequently proven.

## Scope
1. Disposable hosted GitHub Actions runner with PostgreSQL and pinned Odoo Community; no customer resources.
2. Narrow native POS offline/synchronization and sales/deposit tests using upstream test infrastructure where suitable.
3. Minimal isolated proof addon demonstrating size-specific demand batching, deadline trigger, explicit staff production start and full-payment collection guard. Synthetic scenarios; no production schema migration.
4. Native POS visual styling proof and order/task presentation, screenshots and responsive/RTL/reduced-motion evidence where hosted execution permits.
5. Record exact tested head, environment, checks, failure evidence and limitations in docs/validation/ODOO_PROOF.md.

## Boundaries
No Vercel/Odoo production host, paid resource, external messaging, actual payment integration or real data. No local work. No core fork or unrelated module implementation. A demonstration balance is not a production financial ledger; integrations must be labelled unproven when not exercised.

## Architecture/data/security
Keep prototype addons under proof/addons and scripts under proof/scripts. Use core Community dependencies only. Run a temporary PostgreSQL service, synthetic users and data, and loopback-only application access on the hosted runner. Minimal Actions token permissions, no repository/application secrets. Artifacts contain only synthetic screenshots/logs. Disposable runner teardown removes test database/files.

Pin upstream source; record interpreter/browser and container/runtime versions in evidence. Test tags must be bounded to avoid the whole upstream suite. Use a focused implementation branch/PR. Capture failures without classifying missing checks as passing.

## Validation matrix
- Community install and module dependencies.
- Native POS offline order persistence/reload/reconnect and retry behavior supported by inspected upstream tests; identify omitted real multi-hour/device-loss scenarios.
- Native Sales/POS deposits/settlement where supported by inspected tests.
- Custom task trigger: separate variants, below/at threshold, deadline, repeated invocation, start/finish/readiness transitions.
- Collection: incomplete balance blocks, paid partial collection leaves remaining quantities, overcollection fails.
- Visual: native POS and custom order/task screens in English/Arabic with desktop/narrow screenshots; keyboard/reduced-motion checks.
- Publication: no screenshot equals user approval. Client review is the final visual checkpoint.

## Technical outcome
The exact proof implementation at commit `1ad528e02ed1a709d34620731d182c5e1cbdebe9` passed all 15 bounded tests in hosted run `34068805602`. Cash and generic Bank offline checkouts survived API-offline payment, browser reload while still offline, reconnect and repeated synchronization; backend assertions required exactly one paid order, exactly one payment and full settlement.

The proof exposed an Odoo 19.0 restore defect: paid orders are persisted to IndexedDB, but `PosData.missingRecursive()` returns an empty accumulator when startup is offline before adding the already-read local records, so they are not hydrated into the in-memory POS model. The proof addon contains an isolated compatibility patch at `proof/addons/fu_proof/static/src/offline_restore_patch.js`. It changes only that offline path and delegates online behavior to upstream Odoo. Odoo core remains unmodified.

Verdict for the tested scope: **conditional GO for Odoo Community as the ERP/domain core**, with Fares-owned addons/UX and a maintained offline compatibility layer. This is not a claim that stock Odoo is sufficient unchanged, nor that production offline reliability is proven.

## Exit and decisions
The technical spike has exact-head checks and reviewable outputs. Platform adoption remains conditional on the documented limitations and client UI review. The current proof UI demonstrates compatibility only and is not the final premium interface.

Before production, real network isolation, multi-hour/device-loss behavior, browser-storage loss handling, conflict/retry behavior, actual InstaPay/payment verification, inventory/financial integration, returns, hardware and deployment architecture still require dedicated validation.

## Next dependencies
Production foundation contracts depend on this proof plus remaining Phase 0 discovery. Host costs, business rule details, production-grade payment/stock integration and onboarding remain future scoped work.
