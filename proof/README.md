# Disposable Community proof

Run through the repository's Odoo Community proof GitHub Actions workflow, on branch proof/odoo-community. Do not run locally.

The addon demonstrates ORM extension seams with synthetic receipt balances. It is not a financial ledger, production stock allocation implementation, or production-ready permission model. Native POS/Sales tests run separately; passing both does not establish integrated collection correctness.

Threshold 5 or 10 in tests is synthetic, not a chosen factory setting. No external services, messages, real payments or business records are used. Native synchronization tests are not a substitute for a true offline/reload experiment.

Initial execution stage: install and bounded backend/native tours. Offline browser and premium visual checkpoints remain pending until recorded in docs/validation/ODOO_PROOF.md.

Hosted baseline passed seven tests. Current extension adds paid API-offline reload/reconnect and a native POS styling/screenshot experiment. Read [evidence and limitations](../docs/validation/ODOO_PROOF.md) before interpreting results. No full UI or offline acceptance is claimed.

The visual extension captures native POS and task screens in English/Arabic at desktop and 390×844, checking RTL, task advancement and reduced POS motion. Synthetic screenshot previews are emitted to Actions logs for remote-only review. Full-resolution images remain workflow artifacts. Browser testing uses Odoo's hosted Chrome harness; no local browser session is used.
