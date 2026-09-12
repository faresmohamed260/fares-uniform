# Phase 5A — Arabic launch-quality polish

Status: **ACTIVE / AUTHORIZED, 2026-09-12.**

Branch: `phase-5a/arabic-launch-polish`.

Starting documentation lineage: `70a6c39570df50d8460715daf173ad3ce0fd2f48`.

Inherited authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

Authorization: after Phase 5 closure the client instructed the developer to keep going. The next bounded repository-defined work is the documented `P2-001` launch-quality localization debt. This does **not** authorize production deployment, merge, live resources, DNS, secrets or real-data migration.

## Goal

Close `P2-001` by making representative internal Arabic operational forms fully localized for the Fares-owned labels/help/state text exposed by the Phase 5 manual evidence review, while preserving every accepted workflow, role/security boundary, public API allowlist, offline rule and production-addon ownership contract.

## Evidence basis

Phase 5 manual review found no P0/P1 defects, but retained Arabic captures showed selected English text on otherwise usable RTL screens, including:
- preorder online-connectivity messaging and wizard cancellation text;
- returns/exchanges field labels/state/help such as Source Order, Store Location, Operation, Eligibility Path and Reason, plus mixed English in the connectivity banner;
- production-task metadata labels such as Trigger Reason, Queued by / Queued at / Started by and related Fares-owned field text.

The exact set to fix must be derived from the live source and rendered Arabic evidence, not guessed from chat memory.

## In scope

1. Audit the affected `fu_preorder`, `fu_retail` and `fu_production` Arabic catalogs against their current model/view/JavaScript strings.
2. Add/fix only missing or incorrectly classified Arabic translations needed for the affected Fares-owned UI.
3. Use Odoo 19 translation metadata correctly (`odoo-javascript` / `odoo-python` where the source type requires it) rather than hardcoding Arabic into browser-only logic.
4. Where an inherited generic control is rendered from a Fares view and is not reliably translated, give the Fares view an explicit translatable label rather than changing Odoo core.
5. Strengthen Arabic browser assertions so the representative screens fail if the known English fragments return.
6. Keep the test-only `fu_uat` addon test-only and preserve the exact seven production-addon upgrade authority.

## Explicitly out of scope

- changing business workflows, payment policy, production semantics or permissions;
- widening the anonymous/public API or public DTO/enquiry schemas;
- redesigning the operational UI;
- changing Odoo core or vendoring a fork;
- production deployment/staging resource creation, domains, DNS, secrets or real data;
- translating unrelated Odoo standard screens exhaustively;
- resolving deferred cards/wallets, bank API, B2B refund/credit, preorder cancellation/refund, raw/WIP inventory, advanced analytics or accounting policy.

## Validation contract

The exact candidate SHA must run remotely against the pinned Odoo Community SHA and retain evidence.

Minimum gate:
1. clean install of seven production addons plus `fu_uat` evidence harness;
2. all inherited Phase 1–5 Odoo/UAT tests remain green: **148 or newer, 0 failures, 0 errors**;
3. repeatable upgrade of the **seven production addons** on the same database;
4. public web `npm ci`, typecheck, production build and **8/8 or newer** Playwright regression;
5. strengthened Arabic browser assertions for the affected internal screens;
6. representative Arabic desktop/narrow/reduced-motion screenshots retained;
7. manual review confirms the P2 English fragments are gone without RTL/narrow regressions;
8. no new P0/P1 and no security/public/offline regression.

## Exit criteria

Phase 5A is COMPLETE / VERIFIED only when:
- `P2-001` is closed by exact-head hosted evidence;
- the affected Arabic screens no longer expose the known Fares-owned English labels/help/connectivity text;
- inherited 148+ Odoo/UAT and 8/8+ public browser gates remain green;
- the seven production addons upgrade repeatably;
- representative Arabic evidence is manually inspected;
- `PROJECT.md`, `docs/README.md`, validation evidence and the decision log are updated;
- later docs-only commits are explicitly not treated as newer application authority;
- no deployment or real-data mutation occurred.
