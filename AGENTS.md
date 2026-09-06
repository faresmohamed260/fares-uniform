# Fares Uniform development instructions

## Authority and continuity

The client is Fares; the assistant acts as the professional software developer and gathers requirements from the client.

This repository is the sole persistent project source of truth. At the start of every session read this file, PROJECT.md, docs/README.md, docs/DECISIONS.md, the active phase contract, and the relevant requirements and source files. Verify the current branch and commit before making changes.

Do not use session memory, prior-chat recollections, local files, or other projects to supply missing project facts. A new explicit client instruction can change a repository decision; record that change in the appropriate authoritative document. Record unknowns as unknowns and proposals as proposals.

## Remote-only work — client requirement

Never clone, download, create, edit, build, test, or otherwise work on project files in a local or scratch filesystem. Use remote GitHub operations for source and documentation changes and hosted services for execution and verification. Do not use local git, local CLI workspaces, local previews, or local artifacts as workarounds.

If a required remote capability is unavailable, explain the concrete limitation and request only the necessary client action. Do not silently switch to local work. Hosted CI can check out the repository on its remote runner for builds and tests.

## Planning and scope

Discover the actual business workflows before choosing modules or schemas. Ask manageable groups of plain-language questions; distinguish current practice from desired future behavior. Capture actors, triggers, steps, records, exceptions, approvals, outputs and acceptance criteria as discovery proceeds.

Keep later phases at roadmap level. Before implementation, commit an execution-ready contract for the immediate phase: goal, starting evidence, scope, exclusions, affected contracts, UI decisions, dependencies, data and security implications, validation, documentation outputs and exit criteria. Record client acceptance of product scope; do not invent it.

Complete already-authorized work without repetitive permission requests. Planning or documenting deployment does not by itself authorize a production rollout. Follow explicit client authorization and record it. Do not broaden scope into other projects or infrastructure.

## Change and validation workflow

Batch cohesive remote file changes into as few commits as practical. The initial documentation foundation may be committed directly to main; use focused branches and pull requests for subsequent implementation. Never force-push over others' work.

Validate the exact implementation commit through hosted builds and appropriate tests before claiming it verified. For UI, include relevant interaction, responsive, accessibility and rendered review evidence; compilation alone is insufficient. If checks or visual inspection cannot be performed remotely, record the limitation and do not claim success.

Documentation-only work needs read-back and link/consistency checks, not an application test suite. Keep hosted CI economical without skipping required gates. Record checks, commit references and deployment state accurately; implemented, verified and deployed are different states.

## UI discipline

Use maintained accessible primitives and suitable existing components before custom generic controls. Establish the design system, component sources and representative screen direction before broad UI implementation. Record adopted components and approved visual decisions; preserve them across sessions.

RenderLab supplies process reference, not this ERP's design or product specification. Its creative-app styling, libraries, schemas, resources and runtime decisions are not automatically approved here.

Client visual target: premium modern UI with physics-based/morphing interactions. Apply deliberate motion without delaying checkout; support reduced motion and Arabic RTL. Evaluate platform compatibility before selecting component ecosystems. Read docs/architecture/PLATFORM_EVALUATION.md before architecture/UI selection.

## Public repository and infrastructure

Keep credentials and real private business records out of source, docs, issues, screenshots and logs. Use synthetic/redacted examples. Store runtime records in access-controlled services and credentials in their secret stores.

Vercel is the initial deployment target. Supabase and Cloudflare are available, but resource IDs, service choices, isolation, environments, costs, domains and deployment policy remain undecided. Do not reuse or mutate RenderLab/Saga resources by inference.

## Documentation ownership

- PROJECT.md: current phase, verified state, next actions and handoff.
- docs/requirements/DISCOVERY.md: client-confirmed workflows, open questions and requirements.
- docs/DECISIONS.md: durable decisions, rationale and supersession.
- docs/phases/: phase contracts and completion evidence.
- Add architecture, UI, operations and validation documents when their scope becomes concrete; register them in docs/README.md.

Update authoritative documents in the same cohesive change as the work they describe. Avoid duplicate status logs and competing sources of truth.
