# Phase 0 — Business discovery and scope

Status: COMPLETE, 2026-09-07.

## Goal and user value

Understand how the factory works and agree the smallest useful first release around its actual problems.

## Verified starting point

The project began as a new public repository with an ERP goal, project name, remote-only workflow and initial hosting direction but no documented business workflows.

## Completed scope

- Established repository instructions and documentation ownership.
- Interviewed the client through progressive discovery rounds rather than a generic ERP checklist.
- Captured current school-retail, production, large-client, payment, stock and communication practices.
- Identified roles, operating constraints, one-store/one-storage topology, one checkout per store and the few-hours offline envelope.
- Defined a broadly accepted first-release boundary and representative acceptance scenarios.
- Separated advanced analytics, raw-material/WIP accounting and other future work from the MVP.
- Recorded remaining business-policy decisions explicitly and assigned them to the implementation phase they affect.
- Confirmed the product/design, size-system, item-code and factory-finished custody rules needed by the first production-grade slice.

## Outside this phase

Application implementation, schema migrations, provisioning, resource purchases and production deployment remained outside discovery.

## Architecture, UI, data and security outputs

Discovery established the requirements that constrain architecture and UI: bilingual English/Arabic + RTL, role-based access, offline checkout, brand-independent scanner/printer support, finished-stock scope, public no-price/no-stock catalog behavior and the required operational records.

Architecture/platform validation then continued in Phase 0A/0B without reopening the business-discovery boundary.

## Validation

Repository documentation was read back and reconciled as discovery progressed. Client answers were recorded as accepted decisions rather than inferred from session memory.

## Exit criteria result

- **Representative workflows/exceptions documented:** PASS. See `docs/requirements/DISCOVERY.md` and focused requirement documents.
- **Users, records and operating constraints understood:** PASS to the level needed for the accepted MVP; actual staff assignments and numeric volumes remain intentionally unknown.
- **Priorities, first-release boundary and acceptance scenarios agreed:** PASS at the documented broad-MVP level under D-020; targeted implementation details are resolved phase-by-phase.
- **Unresolved questions explicit:** PASS. Remaining payment/refund/offline/business-shipment/tax/report details are listed against affected later phases.
- **Next immediate phase can be written from evidence:** PASS. The products/finished-stock/access implementation contract is prepared in `docs/phases/PHASE_1_PRODUCTS_STOCK_ACCESS.md`.

Phase 0 is therefore closed. Later targeted discovery does not reopen it unless new client information changes the accepted release boundary.

## Documentation outputs

`PROJECT.md`, `docs/requirements/DISCOVERY.md`, `docs/requirements/MVP_SCOPE.md`, focused requirement documents and `docs/DECISIONS.md` hold the durable result.

## Next dependency

Phase 0B remains the active foundation/design gate because client visual acceptance is still open. Phase 1 implementation starts only after the Phase 0B visual gate is explicitly resolved.
