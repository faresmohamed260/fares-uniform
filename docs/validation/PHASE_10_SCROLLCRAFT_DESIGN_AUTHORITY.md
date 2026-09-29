# Phase 10 D-060 Scrollcraft design-authority validation

**Status:** hosted candidate GREEN; awaiting Fares visual approval  
**Design candidate:** `9ca2215bdbdd4455cd00ca94769119605af97952`  
**Date:** 2026-09-22

## Why this validation exists

Fares rejected the first D-059 browser design candidate `fd9732444005bbacc9a2b596e1a8dd6a0464b9eb` as visually cheap and not representative of the referenced GPT-6 Astra / “$10k website” quality. D-060 therefore reset the design process around the actual pinned Scrollcraft + Astra 10K workflow instead of polishing the rejected layout.

This record covers the replacement review candidate only. It does not authorize production integration, KGC/public client publication, PR merge, production cutover or ERP Gate D.

## Pinned workflow evidence

- Scrollcraft upstream pin: `0b816225945e45380397d6a0487efa3c98916858`.
- GPT-6 Astra 10K workflow reference pin: `e05e451ecd1e371536ef3c310fa273e12b98db7a`.
- CI checks both gitlinks before build.
- CI copies the upstream Scrollcraft `scrollcraft.js` and `scrollcraft.css` unmodified into the staged review bundle.
- recorded engine hashes:
  - JS: `sha256:9246fbe4e240a63cdaf33111edd724ee66118da87dc44af86039b0d1619164a1`;
  - CSS: `sha256:e19eb3aa73b0944626ca56e6e427c76f44753481e04d60f4bac20e8cf1d7758a`.

## Candidate design structure

The replacement surface implements the D-060 repository design contract:

- custom **Pattern Assembly** page grammar;
- **Seam Handoff** as the engineered peak/signature move;
- dimensional hero planes using real current review media;
- pinned identity reorganization;
- horizontal real-model program rail;
- quieter transition immediately before the peak;
- long model-to-garment Seam Handoff;
- technical/editorial garment inspection using real front/back packshots only;
- calm manufacturing/process chapter;
- capability rail that is explicitly not fictional client work;
- context-preserving enquiry close;
- separate route grammars for Work, KGC project, Garments, garment detail and enquiry;
- separate mobile art direction;
- Arabic RTL and reduced-motion parity;
- no price, stock, cart or fabricated construction layers.

## First true-Scrollcraft run and correction

Run `35668758868` at `de3c262565823cba83ba8ef70fe9eea139b830fc` proved the pinned engine, real-media staging, typecheck and optimized build, then failed the browser gate on two checks:

1. the device-variety test incorrectly required four individual parallax elements even though the page already used more than five distinct Scrollcraft device families;
2. English mobile exposed 47px document overflow.

Commit `9ca2215bdbdd4455cd00ca94769119605af97952` fixed the real overflow at the root document boundary and corrected the device gate to validate family diversity rather than an arbitrary parallax count. No acceptance criterion was weakened: the same test still requires pinned Scrollcraft, 2 pin acts, 2 pan acts, parallax, reveal, kinetic behavior and >=5 distinct device families.

## Exact hosted GREEN

Push run/job: `35669056914` / `106561193091`.

Result: **10/10 Playwright checks passed** after locked install, pinned-engine staging, real KGC review-media staging, TypeScript typecheck and optimized Next.js production build.

The browser gate covers:

1. desktop home running the pinned Scrollcraft engine, required device variety and real review media;
2. Seam Handoff at three intermediate progress points (early `0.16`, midpoint `0.50`, late `0.86`) rather than endpoint-only checks;
3. Work collection and KGC chaptered-project routes;
4. garment collection and technical atelier inspection with truthful front/back evidence;
5. English 390×844 independent mobile composition, keyboard-closeable mobile menu and no horizontal overflow;
6. Arabic 390×844 RTL composition and no horizontal overflow;
7. reduced-motion information parity;
8. enquiry review state with preserved context;
9. D-060 system/invariant surface;
10. clean 404 behavior.

Evidence artifact: `10670287485`, `phase10-browser-design-9ca2215bdbdd4455cd00ca94769119605af97952`.

The artifact contains the fresh browser captures, including:

- desktop homepage top;
- Seam Handoff early/mid/late frames;
- Work desktop;
- KGC project desktop;
- garment desktop;
- English mobile homepage;
- Arabic RTL mobile homepage;
- reduced-motion homepage;
- Playwright reports/results;
- pinned-engine and review-media provenance.

## Protected review deployment

- Vercel project: `fares-uniform-design-authority`;
- project ID: `prj_NihDUJroYCeAqi6OF8aVAuxi94w0`;
- deployment ID: `dpl_8fE2ypX2ZgqaWwtcy5Tz4KFJV28K`;
- hostname: `fares-uniform-design-authority-k7lntg6hh.vercel.app`;
- target: preview / non-production;
- state: READY;
- deployment metadata commit: `9ca2215bdbdd4455cd00ca94769119605af97952`;
- unauthenticated request returns `302` to Vercel authentication;
- project-wide SSO protection remains enabled;
- Vercel runtime-error query after deployment returned no runtime errors.

Review-media proof remains **review only**. No KGC or other real-client object was promoted to the public R2 bucket.

## Acceptance boundary

This candidate is technically and interaction-wise ready for Fares's visual review. It is **not** an approved UI authority until Fares explicitly approves exact design SHA `9ca2215bdbdd4455cd00ca94769119605af97952`.

The Product Design plugin's screenshot-audit workflow is not available in this standard chat surface, so no separate plugin-based visual critique is claimed here. The accepted evidence boundary is the fresh hosted Playwright capture/test set plus Fares's own live browser review.

If Fares approves the exact SHA, record that approval before moving any D-060 visual implementation into `apps/public-web`.
