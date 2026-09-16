# Phase 2C — Refund/exchange policy research

Status: **EXTERNAL POLICY RESEARCH RECORDED; CLIENT CHOICES STILL REQUIRED WHERE LAW DOES NOT DECIDE THE WORKFLOW.**

Research date: 2026-09-11.

This document records current public guidance that constrains Phase 2C. It is implementation research, not legal advice and not a substitute for professional legal review before production launch.

## Egypt Consumer Protection Agency baseline

Primary source consulted: Egypt Consumer Protection Agency (CPA), current public return/exchange guidance:
- https://cpa.gov.eg/ar-eg/%D8%AA%D8%B9%D8%B1%D9%8A%D9%81%D8%A7%D8%AA
- https://cpa.gov.eg/ar-EG/%D8%A7%D8%B3%D8%A6%D9%84%D8%A9-%D9%85%D8%AA%D9%83%D8%B1%D8%B1%D8%A9
- https://cpa.gov.eg/ar-eg/%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA-%D8%A7%D8%B9%D9%84%D8%A7%D9%85%D9%8A%D8%A9/ArtMID/654/ArticleID/6773

The CPA describes the protected consumer as a natural or legal person receiving a product for needs that are not professional, craft or commercial. Phase 2C's consumer-retail flow therefore must not be assumed to define later B2B contract returns.

The CPA guidance states two principal consumer periods:

1. **14 days from receipt, without giving a reason** — the consumer may exchange or return a product and recover its cash value without expense, subject to exceptions.
2. **30 days from receipt for a defective product** — the consumer may exchange or return it and recover its value.

For defective goods, the CPA guidance further states that, on the consumer's request, the supplier must replace the product or accept the return/refund without additional cost within one week of the consumer approaching the supplier, and that the paid amount is returned using the same purchase method.

## Published 14-day exceptions relevant to clothing

The CPA lists exceptions to the no-reason 14-day right, including where:
- the nature, characteristics, packaging or wrapping prevents return/exchange or restoration to the original contractual condition;
- the product is perishable;
- the product is no longer in the same condition due to the consumer;
- the product was made to special specifications set by the consumer and conforms to those specifications;
- specified media/publication categories apply;
- jewelry or equivalent applies;
- underwear or wedding dresses have had their packaging removed.

### Fares Uniform implication

Do not label every school/client uniform as legally "custom" merely because it has a school/client design. The published exception is specifically for goods made according to special specifications set by the consumer and conforming to them.

A stocked standard school-uniform variant sold to an individual should therefore remain in the ordinary consumer-retail eligibility path unless a competent legal/business review establishes another exception. A genuinely made-to-order item using customer-selected special specifications can be represented separately and evaluated under the custom-specification exception.

This distinction should be data-driven rather than inferred from product name.

## Receipt/invoice implications

CPA guidance states that the supplier must provide an invoice and lists required information including transaction date, price, product type/specification/quantity, deferred delivery date where applicable, and return/exchange periods plus CPA contact information.

The ERP should therefore retain the original transaction and receipt/delivery date used to calculate statutory periods. The Phase 2C automated flow should prefer a recorded source transaction rather than anonymous negative sales.

This does not establish that a consumer loses a statutory right merely because they cannot present the paper receipt; disputed proof cases may require manager/Owner handling or CPA resolution. The Fares automated path can still require locating the original recorded transaction while exceptional proof disputes remain outside routine Cashier execution.

## Payment-method implication

The CPA's defective-goods guidance explicitly states that the amount is returned using the same purchase method.

For the current Fares methods this means the implementation must be capable of preserving at least:
- original Cash -> Cash refund settlement;
- original confirmed InstaPay -> InstaPay refund settlement/evidence.

Because the business currently verifies InstaPay through bank mobile notifications and has no bank API, the software cannot claim to execute or verify a bank transfer automatically. The exact outbound-transfer confirmation workflow remains P2C-03 business policy.

For transactions containing multiple payment events/methods, the inspected CPA page does not define a software allocation algorithm. Phase 2C must not invent one without an accepted policy or further authoritative guidance.

## Item-condition and stock implication

The statutory financial right and the ERP's sellable-stock decision are not the same thing.

Even when a refund is required, a defective/damaged garment may be unsuitable for resale. Therefore financial refund approval must not automatically imply that the returned unit becomes available Retail Store stock.

The pinned Odoo POS refund path can complete a return picking immediately, so Fares must choose one of two safe operational models:
- inspect first, then execute the refund/return directly into sellable Retail Store stock only if accepted as sellable; or
- return into a dedicated non-sellable/inspection location, then move to sellable stock only after a later explicit inspection decision.

The second model is safer if refunds can be completed before final condition classification.

## Recommended Phase 2C policy package

Subject to client approval and later production legal review, the implementation recommendation is:

- apply the CPA statutory minimum to ordinary consumer retail: 14-day no-reason path subject to published exceptions and a 30-day defective path;
- treat genuinely made-to-special-specification compliant garments as the published custom-goods exception, not all uniforms globally;
- require the automated workflow to identify the original recorded transaction; exceptional proof disputes require Manager/Owner handling;
- preserve the original payment and create an explicit native refund settlement; refund through the original method, with InstaPay outbound confirmation recorded manually until a bank integration exists;
- for an exchange, settle the exact positive or negative price difference explicitly;
- inspect before sellable-stock re-entry; use a non-sellable inspection location if refund can precede final condition classification;
- keep uncollected-preorder cancellation/refund outside this phase initially;
- require connectivity for refund/exchange request approval and execution.

Only the statutory constraints above are treated as external requirements. The remaining workflow choices are recommendations until the client accepts them.
