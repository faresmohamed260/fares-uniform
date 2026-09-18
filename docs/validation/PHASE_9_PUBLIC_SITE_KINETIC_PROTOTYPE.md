# Phase 9 validation — public-site kinetic prototype

Status: **TECHNICAL GREEN / HUMAN KINETIC APPROVAL OPEN, 2026-09-18.**

Branch: `phase-9/public-site-kinetic-prototype`  
Pull request: [#7](https://github.com/faresmohamed260/fares-uniform/pull/7)  
Implementation authority: `04e0036786ad23926765daefd16d80f0ad025e4e`  
Production status: **NO-GO; no deployment performed.**

## Scope proved

The isolated `prototype/public-site-motion` surface proves:

- a stable Fares-led shell that is not KGC-branded;
- typed organization, program, cohort, look and garment fixtures;
- four KGC school cohorts and a distinct three-role synthetic hospitality project;
- project-scoped colors and motifs;
- shared-versus-cohort-specific garment state;
- reversible inspect, explode and reassemble behavior;
- English LTR and Arabic RTL;
- desktop and mobile compositions;
- keyboard focus, practical touch targets and no horizontal overflow;
- reduced-motion information and state parity;
- no price, stock, private Odoo route, client binary or provider dependency.

`apps/public-web`, Odoo addons, public APIs, Vercel, Supabase, Cloudflare and production were not changed.

## RED evidence and repair

Initial pull-request run `35392060535`, job `105752429801`, reached the browser gate after locked install, typecheck and production build passed. Four of five Playwright journeys passed. The reduced-motion journey failed because Motion's media hook remained false under the hosted browser's emulated `prefers-reduced-motion` state.

The test was not weakened. Commit `62c86e4ac088f7edbe9bcee412c0dbda71fb3e0d` replaced the unreliable observation with a direct, subscribed `matchMedia("(prefers-reduced-motion: reduce)")` hook. Run `35392256674`, job `105753049690`, then passed all five journeys.

The initial failure artifact is `10565994428`; its digest is `sha256:dffbc5e14c1c7e2232689f00449e4054f862c4b73d2db7c57e2cf5d234e4001e`.

## Final hosted authority

Run `35392671483`, job `105754360569`, at exact branch head `04e0036786ad23926765daefd16d80f0ad025e4e`:

- exact candidate checkout: PASS;
- locked `npm ci`: PASS;
- TypeScript typecheck: PASS;
- optimized Next.js production build: PASS;
- Chromium installation: PASS;
- Playwright: **5 passed, 0 failed**;
- artifact upload: PASS.

Final artifact:

- ID: `10566840263`;
- name: `phase9-public-site-motion-b421cd0763dd9adb0b1de33a8be8d6dd30d6bebb`;
- digest: `sha256:8d0d98d743955b551a5bee6f587b06543c7bfc2c8b6016608199950aa4a84f60`;
- retention: 14 days.

It contains:

- `phase9-desktop-en.png`;
- `phase9-desktop-en-exploded.png`;
- `phase9-mobile-en.png`;
- `phase9-mobile-ar.png`;
- five browser-interaction WebM videos;
- Playwright HTML report.

## Browser journeys

1. English desktop: select High/puffer, verify shared status, explode, capture, reassemble and check overflow.
2. Multi-organization: switch from KGC to the synthetic Harbor House fixture, verify three roles, select Kitchen/Utility and shared state.
3. Arabic mobile: verify RTL, switch organization/role, explode and check overflow.
4. English mobile: verify all key project/cohort/look/inspect/language controls retain at least 44px height and no overflow.
5. Reduced motion: emulate the OS preference, verify the page observes it, preserve explode state and retain the full layer list.

## Visual fidelity ledger

| Comparison point | Accepted concept | Hosted render | Result |
| --- | --- | --- | --- |
| Hero hierarchy | Large editorial serif headline with quiet chrome | Same hierarchy with generalized approved copy | PASS |
| Above-fold copy | Generalized Fares promise after multi-organization correction | Exact “Designed as one. Worn together.” and approved support copy | PASS |
| Color/motif | Bright paper, navy ink, KGC red/light-blue diagonals | Neutral Fares shell; KGC red/light-blue only inside its fixture | PASS |
| Work navigation | Stage/project continuity rather than generic cards | Editorial two-project rail; variable cohort and look rails | PASS |
| Inspection | Garment remains the focal object and separates into readable parts | Reversible seven-part synthetic garment study | PASS for kinetic structure |
| Responsive | Designed desktop and mobile continuation | Desktop, 390px English and 390px Arabic RTL captures | PASS |
| Motion | Transform/reassemble with reduced-motion alternative | Recorded project, cohort, look and explode/reassemble journeys; direct reduced-motion test | PASS technically |
| Media fidelity | Accepted frame used real KGC model/garment imagery | Synthetic vector garment studies only | INTENTIONAL DEVIATION — publication rights are not approved |

The static accepted concept and the hosted desktop/mobile captures were inspected side by side during validation. No material layout, copy, container, RTL or interaction mismatch remains within the prototype boundary. Synthetic vector media is intentionally not claimed as production visual fidelity.

## Remaining human gate

Technical GREEN does not approve the kinetic direction. Fares must review the hosted videos/captures and explicitly approve or request changes. PR #7 remains draft. Production `apps/public-web` implementation, client-media publication and deployment remain separately gated.
