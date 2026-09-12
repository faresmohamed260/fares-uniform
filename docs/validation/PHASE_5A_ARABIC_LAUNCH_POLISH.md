# Phase 5A validation — Arabic launch-quality polish

Status: **ACTIVE / EVIDENCE PENDING, 2026-09-12.**

Branch: `phase-5a/arabic-launch-polish`.

Starting documentation lineage: `70a6c39570df50d8460715daf173ad3ce0fd2f48`.

Inherited Phase 5 application/UAT authority: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

No Phase 5A application/test SHA is authoritative yet.

## Finding being closed

`P2-001` from Phase 5: selected Fares-owned field/help/connectivity labels on internal Arabic preorder, returns/exchange and production screens render in English even though the workflows remain usable and RTL.

## Required evidence

The final record must include:
- exact candidate SHA and workflow/job IDs;
- total Odoo/UAT tests/failures/errors;
- seven-production-addon upgrade result;
- public-web typecheck/build/Playwright result;
- affected Arabic assertion results;
- artifact IDs/names/digests;
- representative screenshot names and manual review;
- exact translation/root-cause changes;
- explicit confirmation that no workflow/security/public/offline semantics changed and no deployment occurred.

## Manual review targets

At minimum inspect Arabic evidence for:
- preorder create/collection online-connectivity banner and cancel/action controls;
- returns/exchanges source/store/policy fields and connectivity banner;
- production queue metadata/trigger/workflow labels;
- one unaffected Arabic operational screen/report to confirm no general RTL regression.

A green process alone is not sufficient.
