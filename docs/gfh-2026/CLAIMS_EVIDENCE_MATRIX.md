# Homepage Claims Evidence Matrix

Updated: 2026-07-25

Evidence and publishability values:

- **Repository-verified**: the landing repository contains executable behavior and a test for this exact claim.
- **Product evidence pending**: the landing site states an external desktop capability, but this repository cannot independently verify its implementation.
- **Prototype only**: supported only by the synthetic fixture and must remain labelled as unvalidated prototype evidence.
- **Invitation only**: proposed pilot or design scope, not an existing customer, integration, API, or partnership.
- A marketing route or visibility test proves rendering and routing only. It does not independently prove an insurance, calculation, privacy, or product-capability claim.

| Exact public copy | Claimed feature or boundary | Best available evidence | Evidence tier / publishability |
|---|---|---|---|
| "Local-first risk and protection intelligence for SMEs" | Company category joining local financial analysis and protection assessment. | Public desktop release exists; marketing site documents the intended default flow. | Product evidence pending; publishable only with deployment and optional-service qualifiers |
| "Know your cash-flow risks and protection gaps before a loss hits." | Value proposition for scenario-led review before an event. | Synthetic fixture and working browser scenario UI. | Prototype only; publishable as a goal, not an outcome guarantee |
| "Combine financial exports, insurance-policy data and transparent scenario modelling to identify possible uninsured exposure..." | Three-input assessment workflow. | Synthetic fixture contains financial, policy, profile and scenario structures. | Prototype only; "possible" and professional-review qualifiers required |
| "The default desktop design keeps supported raw files in a local or agreed private workflow." | Intended desktop data flow. | Not implemented in this landing repository; privacy policy distinguishes site, desktop, optional services and pilot controls. | Product evidence pending; publishable only as a qualified design claim |
| "Review the inputs behind each material result." | Intended calculation and evidence contract. | Fixture declares a calculation version and stores synthetic policy page/snippet fields; source inputs and generator are absent here. | Prototype only; independent regeneration evidence pending |
| "Financial CSV/XLSX export" | Desktop financial ingestion. | Existing public desktop release and release notes; no ingestion implementation in this repository. | Product evidence pending |
| "Insurance-policy PDF" | Text-policy extraction. | Synthetic extracted facts and page snippets; no source policy, generator or broad benchmark in this repository. | Prototype only; text-based-PDF and validation qualifiers required |
| "Cyber disruption" | User-selected outage scenario. | Fixture risk family `cyber`; browser renderer test. | Prototype only; modelled scenario, not probability |
| "Supply-chain interruption" | Supplier concentration and interruption scenario. | Fixture risk family `supply_chain`; synthetic supplier share. | Prototype only; business criticality requires confirmation |
| "Asset / property loss" | Stated-asset-value scenario and limit comparison. | Fixture risk family `property`. | Prototype only; value is supplied, not inferred |
| "Business interruption" | Downtime and policy sub-limit scenario. | Fixture risk family `business_interruption`. | Prototype only; policy applicability is not determined |
| "Financial resilience" | Cash, runway and cash-gap context. | Fixture `financial_facts` includes an arithmetic operating-result-to-cash bridge; source export and transaction detail are absent and disclosed. | Prototype only |
| "Growth-related protection changes" | Point-in-time before/after comparison. | Fixture `growth_review`; UI now labels numeric-limit comparison rather than adequacy. | Prototype only; not real-time monitoring or formal adequacy review |
| "Synthetic demonstration data" | Public fixture is not a customer. | `meta.synthetic`, `sme.synthetic`, visible labels and tests. | Repository-verified and required |
| "Every displayed value is read from the versioned demo fixture." | Homepage reuses the full demo JSON. | `DEMO_FIXTURE_URL`, fixture rendering tests. | Repository-verified for homepage display behavior |
| "Possible gaps, with uncertainty intact." | Low-confidence absence does not become zero coverage in the public UI. | Homepage, demo and sample report render "No matching text", unknown coverage and required review. | Repository-verified UI boundary; underlying extraction remains prototype only |
| "The homepage reads the corresponding precomputed result from the deterministic scenario grid; it does not reimplement the engine." | Browser lookup behavior. | `renderScenario` indexes `scenario_grid.cells`; interaction tests. Scenario-impact fields explicitly identify the zero-payout assumption used where matching text is absent. | Repository-verified browser behavior; formulas and fixture provenance pending |
| "Missing is not zero" | Null or low-confidence absence is shown as unknown/review-required. | Homepage and demo renderers plus regression assertions. | Repository-verified UI behavior |
| "Grounded explanation has a bounded role" | AI-CFO can explain reviewed context; deterministic code owns material amounts. | Existing AI-CFO product/release positioning; public Protection Gap demo explicitly runs no AI model. | Product evidence pending; no claim that the public demo demonstrates AI extraction |
| "Financial intelligence powering every protection assessment" | AI-CFO facts supply runway, cash-gap and concentration context. | Existing public desktop release plus synthetic fixture. | Product evidence pending / prototype context |
| "Predict cash-gap dates; calculate runway and burn" | AI-CFO capability. | Desktop-v0.1.4 release notes and public sample report. | Product evidence pending; no independent implementation test here |
| "Find duplicates, unusual expenses and recurring financial leaks" | AI-CFO capability. | Desktop-v0.1.4 release notes and public sample report. | Product evidence pending |
| "Model hiring, marketing, borrowing and revenue shocks" | AI-CFO decision simulator. | Prior public product positioning; implementation not in landing repository. | Product evidence pending; no outcome guarantee |
| "SME Protection Readiness Pilot" | Proposed review scope and intake. | Form routing, validation and payload tests; published pilot boundary. | Invitation only; no duration, price, customer count or production decision use claimed |
| "Broker or Insurer Design Partnership" | Separate broker and insurer enquiry paths. | Both CTA values and form options tested. | Invitation only; no existing partnership claimed |
| "Proposed pilot focus and boundaries" | Singapore/Johor synthetic scenario and excluded production uses. | Fixture locations; public pilot-boundary copy. | Prototype and invitation only |
| "AI-CFO Private Beta" | Existing desktop beta intake. | Public GitHub release and tested CTA path. | Publishable as beta availability |
| "SBFinance provides indicative decision-support analysis, not insurance, legal, underwriting or coverage advice." | Human-review and product boundary. | Visible near outputs, FAQ and limitations; static and browser tests. | Repository-verified copy boundary and required |
| "The public proof is synthetic... validation ... remain incomplete." | Validation maturity disclosure. | `/protection-gap` limitations and homepage disclaimer. | Repository-verified disclosure |
| "A future pilot may validate a versioned protection-assessment JSON export..." | Export/API concept is not live. | `/protection-gap#pilot` explicitly labels it proposed. | Invitation only; no production API claim |
| "Independently developed; no insurer or programme affiliation is implied." | Non-affiliation boundary. | No third-party insurer/programme names, logos or endorsement language in homepage; synthetic insurer is generic. | Repository-verified public representation |

## Claims Intentionally Not Published

- Real-time monitoring or continuous risk detection
- Authoritative or guaranteed coverage determination
- Zero coverage inferred only because matching text was not extracted
- Insurance, brokerage, underwriting, legal or formal risk advice
- Actuarial loss predictions or breach probabilities
- A calibrated or independently validated protection-readiness score
- Independently reproducible "same engine" provenance from the landing repository
- A live protection-assessment API or production insurer integration
- Insurer-approved, enterprise-grade or guaranteed recommendations
- Customer count, revenue, pricing or adoption claims
- Existing broker, insurer or programme partnerships
- Affiliation with, endorsement by, sponsorship from or selection by any insurer, regulator, event or programme
- Logos or trade dress belonging to insurers, regulators or programme organisers
