# Onboarding rehearsal — Fares Uniform first release

Status: **SYNTHETIC REHEARSAL EXECUTED / VERIFIED, 2026-09-12.**

This runbook records the Phase 5 disposable-hosted rehearsal. It is not permission to configure a production database or import real records.

Authoritative Phase 5 application/UAT SHA: `5d23e56e72122014a7f886ee7f4ec24d3153c78a`.

## Rehearsal outcome

The exact-head UAT environment proved that a clean Fares installation can establish and exercise the accepted configuration/business boundaries using synthetic data without source edits for company-specific values.

The rehearsal covered:
1. Fares Retail Store and Storage initialization under the current synthetic company.
2. Named synthetic users for Store Manager, Cashier, Inventory Staff, Production Manager and Sales/BD with role/location scope checks; Owner/Admin test authority remained separate.
3. Configurable synthetic size attribute values and two stock-bearing variants with stable system-managed `FU-######` code/barcode identity.
4. Attributable opening stock plus storage→store transfer and idempotent replay reconciliation.
5. Data-driven Cash and InstaPay journals/payment methods, with InstaPay classified by bank-notification confirmation mode rather than hardcoded brand/provider behavior.
6. Explicit preorder-production trigger configuration for the synthetic scenario; no positive global default was invented.
7. Preorder production, explicit store receipt/allocation, full-balance collection gate and partial/final collection.
8. Business-client synthetic lead/sample/quotation/payment/shipment flow.
9. Synthetic public publishable catalog payload/enquiry with exact public-field allowlist and enquiry idempotency/security.
10. Operational-report and role-scope smoke verification; inherited exact-head tests additionally cover low-stock rules, offline POS and broader server security.

## Configuration ownership

### Application-supported and proven
- Fares tracked Store/Storage roles and custody controls;
- role composition and allowed-location enforcement;
- configurable product sizes/variants and permanent item identifiers;
- attributable opening/internal/receipt stock movement paths;
- data-driven Cash/InstaPay classification;
- configurable preorder production lead-time/quantity trigger;
- public publishable content and narrow enquiry projection;
- configurable low-stock reporting rules and operational reporting;
- offline retail checkout/reconciliation under the inherited Phase 2A contract.

### Ordinary Odoo/operator setup, not hardcoded business truth
- company name/address/legal details;
- currency/timezone selection;
- actual POS device/configuration assignment;
- user accounts and passwords;
- real product descriptions/images/prices;
- real journals/payment-account configuration as deployment/accounting requires;
- final public content.

### Human decisions still required before production
- actual staff names/accounts and final role/location assignments;
- real product families, sizes, prices and opening quantities;
- actual printers/scanners/receipt/label dimensions and compatibility;
- legal receipt/business identity and tax requirements;
- production hosting/provider/resources/budget;
- backup schedule, restore objectives and operational owner;
- public domain/DNS ownership;
- monitoring/log/privacy ownership;
- launch date and cutover window;
- handling/reconciliation of any existing real open orders/balances at cutover.

## Synthetic data rule

The Phase 5 evidence used synthetic contacts, products, transactions and configuration only. No real bank references, customer records, staff secrets or business-private production records were committed or required.

## Verification result

Exact-head workflow run `34698087230` produced **148 tests, 0 failures, 0 errors**, including the joined UAT journeys, and the public web remained 8/8 green. See `docs/validation/PHASE_5_INTEGRATED_UAT.md` for exact job/artifact authority.

Manual review found one non-blocking P2 localization-quality item: some internal Arabic field/help labels remain English. This should be cleaned up during launch-quality polish but did not prevent successful synthetic operation or role/security verification.
