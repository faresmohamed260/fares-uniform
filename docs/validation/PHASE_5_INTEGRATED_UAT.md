# Phase 5 validation — integrated UAT and onboarding

Status: **ACTIVE / EVIDENCE PENDING, 2026-09-12.**

Branch: `phase-5/integrated-uat-onboarding`.

Starting documentation lineage: `f71acb24c7cdbd850c0737edf78cf93375490e9a`.

Inherited Phase 4B application authority: `29b2589e7e71271071f97c9de57dfb97b49b100d`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

No Phase 5 application/test SHA is authoritative yet.

## Evidence required

The final record must include:
- exact Fares application candidate SHA;
- workflow run and job IDs;
- inherited Odoo test total/failures/errors;
- integrated UAT test total/failures/errors;
- exact seven-production-addon upgrade result;
- public-web typecheck/build/Playwright result;
- artifact IDs, names and SHA-256 digests;
- representative screenshot names and manual review result;
- the nine release acceptance scenarios mapped to evidence;
- onboarding rehearsal result and discovered operator/client decisions;
- defect chronology and severity classification;
- explicit statement that production deployment/real-data migration did not occur.

## Scenario evidence matrix

| # | Release journey | Required proof | Result |
| --- | --- | --- | --- |
| 1 | Product/variant + stock custody | server journey + stock evidence | pending |
| 2 | Retail sale + offline reconciliation | server/browser offline journey, idempotency | pending |
| 3 | Preorder + size-specific production trigger | cross-module journey | pending |
| 4 | Finish → store receipt → partial collection after full balance | cross-module journey | pending |
| 5 | Refund / size exchange | cross-module journey preserving original sale | pending |
| 6 | Business-client order lifecycle | cross-module journey | pending |
| 7 | Public EN/AR catalog + enquiry without leakage | public web/API/browser | pending |
| 8 | Operational reports reconcile to UAT facts | reporting assertions + browser evidence | pending |
| 9 | Role/security + bilingual/capability boundaries | direct security + representative browser checks | pending |

## Defect register

No Phase 5 defects classified yet.

Use P0/P1/P2/P3 severity from the Phase 5 contract. Phase 5 cannot close with open P0/P1.

## Manual evidence rule

A green browser process alone is insufficient. Inspect retained representative captures for correct content, navigation context, EN/AR/RTL, narrow layout, focus/accessibility affordances and absence of sensitive/public-boundary leakage before closure.
