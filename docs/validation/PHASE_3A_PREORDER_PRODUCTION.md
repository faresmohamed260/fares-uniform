# Phase 3A validation — preorder production queue

Status: **COMPLETE — AUTHORITATIVE PHASE 1 THROUGH PHASE 3A HOSTED GATE PASS; REPEATABLE FOUR-ADDON UPGRADE PASS; EN/AR/RTL EVIDENCE REVIEWED.**

Branch: `phase-3a/preorder-production-queue`.

Starting documentation lineage: `06ac7787392bbd63081fe22f23dcbbb603f1b398`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Authoritative Phase 3A application evidence

The authoritative tested **application SHA** is:

`ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`

Hosted evidence:

- workflow: `Phase 3A preorder production`;
- run: **`34601274874`**;
- job: **`103268897396`**;
- run conclusion: **SUCCESS**;
- combined Phase 1 through Phase 3A result: **93 tests, 0 failures, 0 errors**;
- repeatable upgrade: **SUCCESS** for `fu_core,fu_retail,fu_preorder,fu_production` on the same database and exact application SHA;
- evidence artifact ID: **`10264163466`**;
- artifact name: `phase3a-production-ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`;
- artifact digest: **`sha256:0e94e65beaa25c92c27337c200186dd765c2a5f1c1ee9b5735130a0fc60770d5`**.

The artifact runtime evidence independently records:

- Fares exact head `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc`;
- Odoo exact head `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`;
- Python 3.12.14;
- Google Chrome 152.0.7977.82;
- rtlcss 4.3.0.

Later documentation-only commits on this branch are **not** newer application proof. The application authority remains `ff12c22e...` unless a later application SHA passes a new authoritative gate.

## What the final gate proves

The final hosted gate covers the inherited Phase 1–2C behavior plus the new Phase 3A production slice. Phase 3A proof includes:

1. production lead time defaults to seven days;
2. quantity trigger defaults to zero/inactive rather than inventing a numeric threshold;
3. positive configured threshold triggers production demand at the accepted boundary;
4. below-threshold/unconfigured quantity demand does not trigger early;
5. deadline-triggered demand is created at the configurable pickup lead-time boundary;
6. demand remains separate per exact `product.product` variant/size;
7. quantities already Ready for collection or collected are excluded;
8. non-cancelled production coverage is source-linked to preorder lines and cumulative coverage cannot exceed uncovered source demand;
9. repeated evaluation does not duplicate covered demand;
10. cancelled queued work releases coverage for later reevaluation without cancelling/refunding the preorder;
11. Production Manager/Owner authorization controls queue evaluation, settings and explicit `queued -> in_production -> finished` transitions;
12. unauthorized direct task creation/state mutation is rejected server-side;
13. production completion is workflow-only and creates no production stock move, quant or factory-finished inventory location;
14. Phase 2B Retail Store physical receipt/allocation remains authoritative for Ready for collection;
15. representative English and Arabic/RTL production UI, keyboard focus, desktop and narrow layouts pass;
16. the combined Phase 1, 2A, 2B and 2C regressions remain green;
17. repeatable upgrade succeeds for all four installed Fares addons.

## Final rendered evidence review

Representative final production screenshots:

- English desktop: `production_queue_en_desktop_20260911_125930_120249_test_production_queue_english.png`;
- English narrow/reduced-motion: `production_queue_en_narrow_reduced_20260911_125930_263434_test_production_queue_english.png`;
- Arabic/RTL desktop: `production_queue_ar_desktop_20260911_125927_627268_test_production_queue_arabic_rtl.png`;
- Arabic/RTL narrow/reduced-motion: `production_queue_ar_narrow_reduced_20260911_125927_761856_test_production_queue_arabic_rtl.png`.

Manual evidence review confirms:

- desktop and narrow layouts remain usable without document-level horizontal overflow;
- Arabic renders right-to-left;
- localized Start Production/state/core production labels are visible;
- production quantity, exact product/variant, earliest pickup and trigger reason are visible;
- keyboard focus on the primary production action passed;
- the form clearly states that factory `Finished` is workflow status only and `Ready for collection` still requires physical Retail Store receipt and preorder allocation.

The production Chrome logs end with `test successful` in both English and Arabic paths. They contain expected headless-Linux Chrome environment noise (D-Bus/UPower/GCM messages), but no application JavaScript/test exception was observed in the production paths.

## Red/green chronology

### Contract and architecture

- `638cacdfd8c29cc8aae8879bf845f060d93ee9cf` — `docs(phase3a): define preorder production contract`.
- `181bb4fbd93fc857352d60aae8c74f36db0cd2f0` — `docs(phase3a): record production model boundary`.
- `353ab6fa5659a588b198120b457198469319187d` — initial `fu_production` workflow foundation.
- `7f13759a5e32ace95f03f72eb78de22cebef4293` — guarded Phase 3A test/UI/CI gate.

### First red hosted gate

Application SHA `7f13759a5e32ace95f03f72eb78de22cebef4293`, run **`34599314279`**, job **`103262463579`**: **RED — 2 failures, 0 errors of 93 tests**.

Artifact:
- ID `10263179652`;
- name `phase3a-production-7f13759a5e32ace95f03f72eb78de22cebef4293`;
- digest `sha256:bb0e684ac3ca14e9367093e70170913edb2d80f539bb648095c3c6a96d841a62`.

Root causes were test-harness defects, not weakened business rules:

1. the expected cumulative over-coverage rejection correctly raised `ValidationError`, but the deliberately failing nested create was not rolled back before the cleanup assertion;
2. the English browser test asserted a brittle form group heading instead of a stable localized business field label.

### Intermediate concurrency cancellation

Commit `d7c6925462003b2463d21b0f0e1b957d265242f6` adjusted the expected-rejection savepoint, but its run `34600581874` was cancelled by the workflow's branch concurrency policy when the next test-fix commit landed. It is not application authority.

### Second red hosted gate

Application SHA `bfda41b9c8be3514d01359491080aa49727087e3`, run **`34600613670`**, job **`103266726428`**: **RED — 1 failure, 0 errors of 93 tests**.

Artifact:
- ID `10264616899`;
- name `phase3a-production-bfda41b9c8be3514d01359491080aa49727087e3`;
- digest `sha256:cd9de688f105c92efc89e2d720469ed78fe51e9f826ae3679452311a8c3e5e22`.

The English and Arabic/RTL browser paths were green in this run. The remaining failure was savepoint context-manager ordering: `assertRaisesRegex` swallowed the expected exception inside the savepoint, so the savepoint did not observe the exception and did not roll back the rejected nested create.

### Final green hosted gate

Commit `ff12c22e82b3e191f8b0d0b6f2badd1ddf9763bc` reverses the context-manager nesting so PostgreSQL sees the expected exception, rolls back the rejected create, and the test assertion catches it outside the savepoint.

Run **`34601274874`**, job **`103268897396`**: **GREEN — 93 tests, 0 failures, 0 errors; repeatable four-addon upgrade GREEN; evidence upload GREEN.**

No production/business assertion was weakened to achieve the green result.

## Closure boundary

Phase 3A is closed for the accepted bounded preorder-production scope.

This closure does **not** add or authorize:

- raw-material, trims or WIP inventory accounting;
- Bills of Materials/native Manufacturing Order stock posting;
- factory-finished inventory custody;
- automatic Retail Store receipt or Ready-for-collection state from task completion;
- preorder cancellation/refund policy;
- automatic customer notifications;
- business-client/B2B workflow rules;
- business final-payment/partial-shipment policy;
- production deployment or real-data migration;
- merge of the stacked branch.

No merge, deployment or real-data migration occurred during Phase 3A.