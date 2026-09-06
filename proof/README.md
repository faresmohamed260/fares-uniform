# Disposable Community proof

Run through the repository's Odoo Community proof GitHub Actions workflow, on branch proof/odoo-community. Do not run locally.

The addon demonstrates ORM extension seams with synthetic receipt balances. It is not a financial ledger, production stock allocation implementation, or production-ready permission model. Native POS/Sales tests run separately; passing both does not establish integrated collection correctness.

Threshold 5 or 10 in tests is synthetic, not a chosen factory setting. No external services, messages, real payments or business records are used. Native synchronization tests are not a substitute for a true offline/reload experiment.

Initial execution stage: install and bounded backend/native tours. Offline browser and premium visual checkpoints remain pending until recorded in docs/validation/ODOO_PROOF.md.
