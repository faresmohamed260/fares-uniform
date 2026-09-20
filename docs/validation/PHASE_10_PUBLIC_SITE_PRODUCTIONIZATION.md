# Phase 10 validation — public-site productionization

Status: **WORKSTREAM 10.1 RED CONTRACT CANDIDATE — HOSTED EVIDENCE PENDING.**

Branch: `phase-10/public-site-productionization`.

Production status: **NO-GO.** Phase 10 authorization covers repository engineering, hosted CI and provider work required by the accepted contract; it does not authorize production launch/cutover, Gate D approval, public KGC/client publication, price/stock exposure or merging PR #7.

## Workstream 10.1 — V2 public contract

The first candidate deliberately establishes the contract before implementation:

- source-controlled `contracts/public-api-v2.openapi.json`;
- exact V2 home/work/project response shapes;
- strict EN/AR locale behavior;
- organization/program/cohort/look/garment/media relationships;
- strict publication filtering and unknown/unpublished slug fail-closed behavior;
- no database/internal IDs, price, stock, SKU/barcode or private R2 metadata;
- rights-private media absent from public payloads;
- V1 public catalog/enquiry regressions retained in the same addon test run.

The first hosted run is expected to be RED because the new tests specify models/routes that do not exist at this contract-only checkpoint. That failure is required evidence; do not weaken the assertions. The next implementation commit must add only the smallest public editorial models/serializer/controller boundary required to satisfy this contract.

## Evidence

Pending the first exact-head hosted Phase 10 contract run.
