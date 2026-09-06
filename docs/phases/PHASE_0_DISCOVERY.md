# Phase 0 — Business discovery and scope

Status: IN PROGRESS. Discovery is authorized by the client's project brief; the detailed product scope is not yet agreed.

## Goal and user value

Understand how the factory works and agree the smallest useful first release around its actual problems.

## Verified starting point

New public GitHub repository with an initial README; client supplied the ERP goal, project name, remote-only workflow and initial hosting direction. No business workflow has been specified.

## In scope

- Establish repository instructions and documentation ownership.
- Interview the client progressively.
- Capture confirmed current workflows and desired outcomes.
- Identify roles, records, exceptions, scale and operating constraints.
- Propose a prioritized initial release with acceptance criteria for client review.
- Record unknowns, dependencies and material risks grounded in answers.

## Outside this phase

Application implementation, schema migrations, provisioning, resource reuse, purchases and deployment. No generic ERP module checklist becomes scope without client confirmation.

## Architecture, UI, data and security outputs

Capture requirements that constrain architecture and UI, including devices, language, permissions and connectivity. Determine which data types the system needs without committing private records. Infrastructure and concrete schemas remain undecided.

## Validation

Read back documentation from GitHub and check internal links and consistency. Confirm business understanding with the client using representative examples. No build or application test is applicable to this documentation-only foundation.

## Exit criteria

- Representative business workflows and important exceptions are documented.
- Users, main records and practical operating constraints are understood.
- Client agrees priorities, first-release boundaries and success/acceptance criteria.
- Unresolved questions are explicit, with blocking questions identified.
- The next immediate phase contract can be written from evidence.

## Documentation outputs

PROJECT.md, docs/requirements/DISCOVERY.md and docs/DECISIONS.md remain current. Add more focused requirement documents only when discovery justifies them.

## Next dependency

The architecture/design phase depends on accepted initial release scope. Do not mark Phase 0 complete merely because the repository documentation structure exists.
