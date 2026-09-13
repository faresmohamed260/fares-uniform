# Phase 8A — Free-tier commercial staging execution

Status: **CLIENT AUTHORIZED; PROVIDER EXECUTION BLOCKED BY FREE-TIER CONSTRAINTS.**

Branch: `phase-8/commercial-staging-readiness`.

Parent contract: `docs/phases/PHASE_8_COMMERCIAL_STAGING_READINESS.md`.

Authorization date: 2026-09-13.

Inherited Phase 7 implementation authority: `01ce26d3ef0e16f53aa941b6b5e2318cf797e995`.

Inherited Phase 7 runtime-regression checkpoint: `24850acc029e0e7bbef898d6598d0d8b3f7ce733`.

Inherited business-application/test authority: `cc2656d7529cfd4af396ddd0af6444a0f6600dc8`.

Pinned Odoo Community SHA: `1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf`.

## Client authorization

The client explicitly authorized creating new isolated Fares Uniform staging resources on **Vercel** and **Supabase**, following the same account conventions as the existing RenderLab/SAGA deployments, with one hard condition: **stay on free tiers**.

This authorization permits creating and mutating only new Fares Uniform staging resources required for the Phase 8 live rehearsal. It does not authorize:

- upgrading Vercel or Supabase to a paid plan;
- pausing, deleting, repurposing or mutating RenderLab, SAGA, AI Studio or S.A.G.A.;
- production deployment or production cutover;
- real customer, staff, stock, order, bank or payment data;
- broad Odoo backoffice exposure;
- weakening the Phase 7 database/session/cron/WebSocket/security model.

## Reference account pattern inspected

### Vercel

Connected team: `faresmohamed260-6733's projects`.

Current plan: **Hobby**.

Reference projects inspected:

- `renderlab` — Next.js, GitHub-linked, successful production deployment present;
- `saga` — Next.js, GitHub-linked, successful production deployment present.

No Fares Uniform Vercel project existed at authorization time.

### Supabase

Connected organization: `Fares Home Lab`.

Current organization plan: **Free**.

Reference projects inspected:

- `AI Studio` — active, `eu-west-1`;
- `S.A.G.A.` — active, `eu-central-1`.

The Fares Uniform staging target selected for a new project is `eu-central-1`, matching S.A.G.A. and keeping it isolated from the existing projects.

Supabase quoted a new project in this organization at **$0/month**.

## Provider blockers discovered

### Supabase free-project cap

The attempted creation of a new `Fares Uniform` project in `Fares Home Lab`, `eu-central-1`, was rejected by Supabase because the account already has the maximum **two active free projects**.

Provider error meaning: the user has reached the active-free-project limit through the existing `AI Studio` and `S.A.G.A.` projects.

Because this phase forbids mutating unrelated projects without explicit authorization, neither existing project was paused or deleted.

**Supabase staging status: BLOCKED / NO RESOURCE CREATED.**

To remain free, execution requires an explicit client choice to pause one existing free Supabase project, after which the new isolated Fares Uniform project can be retried. Upgrading is outside this contract.

### Vercel Hobby commercial-use restriction

Current Vercel Terms of Service state that Hobby is for personal or non-commercial use. Fares Uniform is a commercial business ERP, so a Fares Uniform commercial staging deployment on Hobby would conflict with the provider's plan terms.

The client explicitly required staying free, so the project was **not** upgraded to Pro and no Fares Uniform Vercel project/deployment was created under Hobby.

**Vercel staging status: BLOCKED / NO RESOURCE CREATED.**

This is a provider-policy blocker, not an application defect. The project must not disguise a commercial staging workload as personal/non-commercial merely to obtain a green deployment.

## Tooling boundary observed

The connected Vercel account tools can inspect projects/deployments and deploy supplied project files, but the available action in this chat does not provide a safe GitHub-repository project-creation/link workflow for the remote-only Fares Uniform repository. This is secondary to the Hobby commercial-use blocker: even with a project-creation action available, the current free-only requirement would still prohibit the intended commercial Vercel staging use.

## Gate state

### Gate A — repository planning

**PASS.** The Phase 8 staging-readiness contract is present and indexed.

### Gate B — client authorization

**CLIENT AUTHORIZATION RECEIVED, PROVIDER PREREQUISITES NOT SATISFIED.**

Resolved:

- live staging rehearsal authorized;
- free-tier-only spending boundary authorized;
- intended Vercel account/team identified;
- intended Supabase organization identified;
- intended Supabase staging region selected as `eu-central-1`;
- permission to create new isolated Fares Uniform staging resources granted.

Blocked:

- Vercel Hobby cannot be used for the intended commercial workload under current provider terms;
- Supabase cannot create a third active free project while both existing free projects remain active.

Gate B therefore remains **NO-GO for live resource execution** until those provider constraints are resolved without violating the client's free-only boundary.

### Gate C — live staging technical GO

**NOT STARTED.** No Fares Uniform Vercel or Supabase staging resource exists yet, so managed TLS connectivity, bootstrap, addon installation, state replacement, cron, WebSocket, backup/restore and EN/AR smoke tests cannot honestly be claimed.

### Gate D — production

**NO-GO.** Unchanged.

## Next authorized actions

Once the Supabase free-project slot is made available by an explicit client decision, retry creation of a new isolated `Fares Uniform` project in `Fares Home Lab` / `eu-central-1` only if the provider quote remains $0.

Vercel requires a separate resolution because the free Hobby plan is not a valid commercial workload target. Under the current free-only instruction, do not deploy Fares Uniform commercially to Vercel Hobby. If the client later authorizes Vercel Pro, that is a new spending authorization. If the client instead changes the platform requirement, record the new provider decision before implementation.

Until then:

- preserve all Phase 7 green authorities;
- do not mutate the existing RenderLab/SAGA/Vercel projects;
- do not pause/delete AI Studio or S.A.G.A. without explicit client selection;
- do not use real business data;
- do not claim staging or production readiness from synthetic CI alone.
