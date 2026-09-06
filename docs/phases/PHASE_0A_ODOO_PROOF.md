# Phase 0A — Hosted Odoo proof of fit

Status: AUTHORIZED / IN PROGRESS, 2026-09-06.
Authorization: client "I approve, go ahead" to the proposed hosted proof and preceding contract. This technical spike runs alongside remaining Phase 0 discovery; it does not declare discovery complete or authorize production deployment.

## Goal
Prove whether pinned Odoo Community can support the factory's offline POS and small custom workflows while preserving its native mechanics and meeting a premium bilingual UI direction.

## Verified starting point
Documentation-only project main; source assessment at Odoo commit 1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf. No existing application or runtime tests. GitHub writes/read access verified; Actions execution availability remains to be established.

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

## Exit and decisions
Complete only after exact-head checks and reviewable outputs exist. Document red/blocked gates explicitly. If remote execution is unavailable, preserve concrete implementation and report the exact blocker without local fallback. Final platform adoption remains conditional on the findings and client UI review.

## Next dependencies
Production foundation contracts depend on this proof. Host costs, business rule details, production-grade payment/stock integration and onboarding remain future scoped work.
