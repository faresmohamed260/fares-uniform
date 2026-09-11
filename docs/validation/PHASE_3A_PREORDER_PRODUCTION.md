# Phase 3A validation — preorder production queue

Status: **NOT YET VERIFIED. CONTRACT/ARCHITECTURE ONLY.**

Branch: `phase-3a/preorder-production-queue`.

Starting documentation lineage: `06ac7787392bbd63081fe22f23dcbbb603f1b398`.

Inherited last green application authority: Phase 2C application/test SHA `62369e62dd1e5d2505e089c6a5ede296a24bcb3b`, workflow `Phase 2C retail returns`, run `34596450064`, job `103253225096`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Validation ownership

This document owns the exact-hosted chronology for Phase 3A and must distinguish:

- implemented code;
- hosted-tested application SHAs;
- browser/rendered evidence;
- repeatable upgrade evidence;
- later documentation-only closure commits.

Do not promote a parent phase's green status to a newer implementation SHA by implication.

## Required final gate

The authoritative Phase 3A application SHA must pass a hosted exact-head gate that installs/tests all bounded Fares addons on pinned Odoo Community 19 and proves a repeatable addon upgrade on the same database/SHA.

Expected coverage includes:

1. production config default lead time is 7 days;
2. quantity threshold has no invented positive default;
3. threshold-triggered task creation after explicit configuration;
4. no quantity-triggered task below/unconfigured threshold;
5. deadline-triggered task creation at the lead-time boundary;
6. exact product-variant/size separation;
7. exclusion of quantities already Ready for collection or collected;
8. task-line/source-preorder attribution and bounded cumulative coverage;
9. repeated/concurrent evaluation cannot duplicate coverage;
10. explicit `queued -> in_production -> finished` authorization and audit;
11. queued cancellation releases coverage without cancelling/refunding the preorder;
12. unauthorized direct create/write/state mutation is denied;
13. finishing a task creates no stock move/quant/factory-finished location;
14. Phase 2B Retail Store allocation remains required for readiness;
15. representative English and Arabic/RTL production workspace, desktop/narrow and keyboard focus;
16. Phase 1, 2A, 2B and 2C regressions remain green;
17. repeatable upgrade succeeds for every installed Fares addon.

## Evidence to pin at closure

Record exactly:

- tested application SHA;
- workflow name;
- run ID;
- job ID;
- total tests/failures/errors;
- repeatable-upgrade conclusion;
- artifact ID/name/digest;
- representative screenshot names;
- relevant browser-console outcome;
- any retained red-run chronology and root-cause fixes;
- final docs-only branch HEAD separately from the application authority.

## Current chronology

### Contract commit

`638cacdfd8c29cc8aae8879bf845f060d93ee9cf` — `docs(phase3a): define preorder production contract`.

Defines the bounded preorder-production slice, quantity/deadline trigger semantics, state/security boundaries and final hosted gate.

### Architecture commit

`181bb4fbd93fc857352d60aae8c74f36db0cd2f0` — `docs(phase3a): record production model boundary`.

Records why pinned native Odoo `mrp.production` is not the correct owner for this no-raw/WIP/no-factory-stock slice and selects bounded `fu_production` workflow metadata linked to authoritative preorder/product/stock records.

No Phase 3A application implementation or runtime validation has been completed yet.
