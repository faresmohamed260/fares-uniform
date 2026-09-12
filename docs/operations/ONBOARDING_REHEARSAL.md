# Onboarding rehearsal — Fares Uniform first release

Status: **PHASE 5 REHEARSAL PLAN — SYNTHETIC DATA ONLY.**

This runbook is for disposable UAT and later operator preparation. It is not permission to configure a production database or import real records.

## Objective

Prove that a clean Fares environment can be made operational through configuration and accepted application workflows without editing source for business-specific values.

## Rehearsal order

1. **Company context** — confirm company identity placeholder, company currency and operational timezone. Do not invent legal/tax identity.
2. **Locations** — establish the one Retail Store and one Storage tracked finished-stock locations. Do not create factory-finished inventory custody.
3. **Users and roles** — create named synthetic users for Owner/Admin, Store Manager, Cashier, Inventory Staff, Production Manager and Sales/BD; assign only required Fares roles and allowed stock locations.
4. **Products** — create synthetic school/client-specific garment templates, configurable size attributes and stock-bearing variants. Verify permanent system-managed `FU-...` codes/barcodes remain stable.
5. **Opening stock** — initialize synthetic finished quantities through the controlled opening-count path with actor/reason/idempotency evidence; verify native stock matches Fares movement evidence.
6. **Retail POS** — configure a Retail Store POS and data-driven Cash/InstaPay methods. Verify InstaPay remains staff-confirmed from a mobile-bank notification concept; no bank API is implied.
7. **Preorder and production** — configure the accepted lead-time setting and, only where needed for the rehearsal, an explicit positive quantity threshold. No global default is invented.
8. **Public content** — mark synthetic catalog records publishable and verify the public projection exposes only the accepted allowlist.
9. **Reporting** — configure explicit low-stock warning rules for selected synthetic variants/locations and verify report timezone/as-of context.
10. **Role smoke pass** — each synthetic role signs in/acts only within its accepted scope; direct/server attempts outside scope remain denied.

## Rehearsal dataset

Use clearly synthetic names and values. The minimum dataset should support all integrated journeys without pretending to model real volume:
- at least two garment designs that must not share stock;
- at least two sizes for one design;
- Retail Store and Storage quantities sufficient for sale/transfer/preorder/exchange paths;
- one ordinary retail customer;
- one preorder customer;
- one synthetic business client;
- one public catalog item/enquiry;
- one low-stock warning case and one non-warning case.

## Verification after setup

Before business journeys begin, prove:
- no roleless/routine user has administrative mutation rights;
- Store Manager/Cashier/Inventory scope resolves only to assigned locations;
- product codes/barcodes exist at variant level;
- opening stock is attributable and reconciles to native stock;
- Cash and InstaPay classification is data-driven;
- production trigger configuration is explicit;
- public catalog has no price/stock/private fields;
- reporting sees the configured company/timezone and warning rules.

## Evidence to retain

The hosted rehearsal should retain a machine-readable or text summary of created synthetic configuration IDs/names, role assignments, location setup and verification results. Do not retain passwords, tokens, real phone numbers, bank references or private business data.

## Human decisions still expected before production

This rehearsal must surface rather than invent:
- actual staff names/accounts and final role composition;
- real product families, size values and opening quantities;
- actual printers/scanners/receipt dimensions;
- legal receipt/business identity and tax requirements;
- production hosting/provider/resources/budget;
- public domain/DNS ownership;
- launch date and cutover window.
