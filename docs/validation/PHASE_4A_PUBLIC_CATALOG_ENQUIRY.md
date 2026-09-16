# Phase 4A validation — public catalog and enquiry

Status: **COMPLETE / VERIFIED.**

Branch: `phase-4a/public-catalog-enquiry`.

Starting Phase 3B documentation lineage: `cb42c8017629d8d5011df82bf6033b91a25f91ac`.

Inherited Phase 3B application authority: `d6efa76a99c0732423b354d2d9f787f6ccbdebec`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authoritative Phase 4A application/test SHA: **`76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`**.

Later documentation-only commits do not supersede that application authority.

## Final hosted authority

Workflow: `Phase 4A public catalog and enquiry`

Run: **`34645790055`**

Jobs:
- Odoo: **`103416127166`** — success;
- public web: **`103416127191`** — success.

### Odoo result

Combined addon set:
`fu_core,fu_retail,fu_preorder,fu_production,fu_business,fu_public_api`.

Final result:
- **132 tests**;
- **0 failures**;
- **0 errors**;
- all inherited Phase 1–3B regressions green;
- Phase 4A public API/security/enquiry regressions green;
- repeatable six-addon upgrade green on the same SHA;
- pinned Odoo exact SHA checkout green;
- deterministic `rtlcss@4.3.0` setup green.

Artifact:
- ID: **`10282160116`**;
- name: `phase4a-odoo-76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`;
- digest: **`sha256:db028329872a2b0cc5bf26047a1ba010176d3e8ee2f39470fa0e821d3330cb74`**.

### Public-web result

Final hosted steps all passed:
- exact-head checkout;
- Node setup;
- `npm ci` from committed lockfile;
- TypeScript check;
- production Next.js build;
- Chromium setup;
- Playwright browser/API gate;
- evidence summary;
- artifact upload.

Final browser/API result: **8/8 Playwright tests passed**.

Coverage includes:
- English LTR desktop/narrow;
- Arabic RTL desktop/narrow;
- catalog/detail/enquiry flows;
- keyboard focus/navigation;
- reduced-motion usability;
- horizontal-overflow checks;
- no price/stock/internal ERP leakage;
- exact enquiry-proxy schema acceptance;
- missing required `sector` rejection;
- unknown `source_url` rejection.

Artifact:
- ID: **`10281873247`**;
- name: `phase4a-public-web-76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`;
- digest: **`sha256:d25b710795ed46e53cde5b2fd22162f54402077bc3d3eee1fcdff73577d9ebe8`**.

Representative final screenshots retained:
- `public_en_desktop.png`;
- `public_en_narrow.png`;
- `public_ar_desktop.png`;
- `public_ar_narrow.png`.

Manual review passed: coherent desktop/narrow layouts, true Arabic RTL, sector field present, no obvious overflow, and no forbidden price/stock/private/internal ERP data visible.

## Red-to-green chronology

### Contract and architecture

- `ec01f782166805dd5dfdcb40b5fc4245b32ec7f0` — define Phase 4A public catalog/enquiry execution contract.
- `ef7f483706318afb0e525140965b6c3994cb0f90` — record public integration architecture.
- `28e503ab...` — initialize Phase 4A validation gate.

### Odoo boundary

- `ef05b2ff3b3b4710bf0e060b47ee65f970e144c8` — initial `fu_public_api` implementation and six-addon hosted gate.
- Historical server-only run `34637566936`, job `103389090154` passed. This is not final Phase 4A authority because the production public web had not yet joined the same exact-head gate.
- Historical Odoo artifact `10278018810`, digest `sha256:4d4950988057c1b83c3e6f8332ffcec42ea8963e52bdf670f95f1038bfa47156`.

### Public web and CI hardening

- `fe3766b062fad4e18f102b7484b9cc6107e85c70` — initial dedicated `apps/public-web` plus two-job gate.
- `aff98bda66c125c8faea131553b6e24b21a00131` — fix invalid exact-head CI Git command; no application-policy weakening.
- `93113fcb83ece945e8d02df57def1a5a0c5a5573` — fix stale/null form-node reset behavior and pin deterministic `rtlcss@4.3.0`. Web type/build/browser gate became green.

### Integration review correction

The `93113...` web gate was technically green in fixture mode, but manual contract review found a real production mismatch:
- the web enquiry proxy forwarded unsupported `source_url`;
- the web form/proxy omitted Odoo-required `sector`.

That SHA was therefore **not promoted** as final authority.

- `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497` — align web enquiry contract exactly with Odoo, add required sector/use case, reject unsupported keys, and add fixture/API regressions so synthetic mode cannot mask the mismatch.

Final same-SHA run `34645790055` passed both the Odoo and public-web jobs and is the Phase 4A authority.

## Security/no-leak validation

Verified behavior:
1. operational products are unpublished by default;
2. publication is explicit and Owner/Admin-bounded;
3. catalog serializer exposes exactly `slug`, `name`, `summary`, `sector`, `image_url`;
4. price/cost/stock/location/SKU/barcode/customer/payment/staff/internal fields are absent;
5. unpublished/missing products fail closed;
6. enquiry input uses an exact key/type/length allowlist;
7. contact name, organization, sector and message are required, plus at least phone or email;
8. exact retry is idempotent and conflicting retry fails closed;
9. enquiry intake creates no sale/payment/stock/automatic CRM operational side effect;
10. CI fixture mode runs the same enquiry contract validation before returning synthetic success;
11. production data mode requires `ODOO_BASE_URL` and does not silently fall back to fixtures.

## Closure

All Phase 4A exit criteria are satisfied.

Application authority remains `76eb20a5c267e0fa8c8d5ce2bf065ffcd332e497`. This validation closure and any later documentation-only commits are bookkeeping only.

No merge, production deployment, production domain/secret mutation or real-data migration was performed.
