# Design QA — Homepage H04 client-program selector

Status: **passed for protected review; final Fares visual approval pending**

## Source visual truth

- Accepted concept: `C:\Users\Fares Mohamed\.codex\generated_images\01a0dc39-dca5-7501-b2e1-ae1b691f6717\exec-cac4a8c2-cc05-4e8f-a2fe-01ab1f84eb34.png`
- Implementation authority: `c76e3e2f24d6da96623f74535319a61a142f1d9e`
- Exact protected preview: `https://fares-uniform-design-authority-7gux9v0js.vercel.app/en#work`
- Browser evidence: authenticated direct Browser/CUA review at desktop and 390x844 mobile in English and Arabic RTL. The remote-only rule prohibited downloading a local implementation screenshot; hosted captures are retained in the exact-SHA Actions artifacts.

## Comparison checklist

| Check | Result |
| --- | --- |
| Two-line client-program headline and editorial hierarchy | Pass |
| Compact client selector ribbon with selected state and all-clients action | Pass |
| H03 technical-pattern language continues into H04 | Pass |
| Campus, worn-model anchor and program detail remain distinct browser layers | Pass |
| Real worn/front/back product views and canonical KGC action | Pass |
| Desktop scale and section continuity | Pass |
| 390x844 English mobile, no horizontal overflow | Pass |
| 390x844 Arabic RTL, localized and no horizontal overflow | Pass |
| Keyboard semantics for tabs and links | Pass |
| Reduced-motion information parity | Pass via hosted accessibility/motion gate |
| Browser console errors | Pass: none observed |

## Iterations and corrections

1. The initial implementation wrapped the approved heading to three lines and left a weak blank logo tile.
2. The fidelity pass restored the two-line headline, replaced the blank tile with a code-native KGC National lockup, and blended the real worn image into the campus composition.
3. The final correction removed an entrance-state dependency that could leave the client stage hidden when scroll snapping landed directly on H04.

## Copy diff

- Eyebrow: `SELECTED WORK`
- Headline: `CLIENT PROGRAMS, BUILT AROUND IDENTITY.`
- Introduction: `Choose a client to preview how its identity becomes a coordinated uniform program, then explore the full project.`
- Selector action: `View All Clients`
- KGC description: `A coordinated uniform program designed to express one identity across the school day.`
- Project action: `Explore KGC National`

Arabic equivalents remain localized and route to the Arabic work/project paths.

## Intentional deviations

- Only KGC National is shown because it is the sole real, review-authorized client program; fake client placeholders were not created.
- Source media does not include a truthful transparent KGC people cutout. The worn original stays independent and uses browser-native masking/blending over the independent campus image.
- Conceptual detail crops were replaced with real worn, polo-front and polo-back media.
- The existing header and adjacent homepage sections were preserved.

## Verification evidence

- Full candidate: run `36233111722`, job `108379882896`, artifact `10903241448`, digest `sha256:17bdcdba20b64c3525d66708c39712a1501102cddc96238f83c478a3cc49e355`
- Design authority: run `36233110268`, job `108379878638`, artifact `10903277117`, digest `sha256:0ba3ca3dabd7db7781afcd2d3ca1f32af3bcf1ae6acabd13f9da7a9980bbfba6`
- Browser design gate: 13/13
- Console errors: none
- Preview protection: unauthenticated access fails closed

## Fidelity statement

The exact deployment matches the accepted concept's composition, hierarchy, selector behavior, section continuity and branded technical language while preserving truthful media boundaries. No P0, P1 or P2 design-QA defect remains in this isolated H04 checkpoint.