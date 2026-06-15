# SBFinance SEO Content Roadmap

> **Status:** Planning document — this is a roadmap and spec, **not** the articles or pages themselves.
> **Product:** SBFinance — a **local-first AI-CFO** desktop app for small businesses. It turns messy CSV/XLSX financial exports into dated cash-gap forecasts (deterministic math you can verify, not an AI guess), financial leak detection (duplicate payments, runaway recurring costs), anomaly detection, dashboards, decision simulations (hiring/marketing/loans), grounded data chat, and executive PDF reports.
> **Positioning wedge:** *"SBFinance tells a profitable-looking small business the exact date it runs out of cash, computed from its own ledger with deterministic math you can verify, not an AI guess."*
> **Tagline:** *"ChatGPT explains finance. SBFinance understands your finance."*
> **Production domain:** https://sbfinance.me/
> **Last updated:** 2026-06-15

### Repo facts this roadmap depends on (verify before shipping)

- The live homepage is `index.html`. Its anchor sections include `#hero`, `#features`, `#pipeline`, `#comparison`, `#risk`, `#who`, `#team`, `#faq`, `#downloads`, `#cta`, and `#privacy`.
- **There is currently NO `#cash-gap` anchor on the homepage.** Several internal-link targets in this roadmap reference `#cash-gap`. Before linking to it, **add an `id="cash-gap"` anchor** to the relevant homepage section (likely inside `#features` or `#pipeline`), or relink to `#features`.
- Sitemap lives at root: `sitemap.xml` (currently lists `/`, `/sample-report.html`, `/terms.html`, `/privacy-policy.html`, `/refund-policy.html`).
- Deploy is GitHub Pages via `.github/workflows/deploy-pages.yml`. **The build step copies an explicit file allowlist** (the `for file in ... ; do` loop, ~lines 35-39) and a directory allowlist (`for dir in ...`). **Any new `.html` page or new directory of pages MUST be added to that allowlist or it will not deploy.**
- `robots.txt` already allows all and points at the sitemap.

---

## 1. Content principles

Finance is a **YMYL ("Your Money Your Life")** topic. Google holds YMYL pages to a higher bar on accuracy, authoritativeness, and trust because bad financial advice can directly harm a reader's livelihood. Everything below is written to that bar.

| Principle | What it means for SBFinance content |
|---|---|
| **People-first, not search-engine-first** | Write to genuinely help an SMB founder or finance manager solve a real problem (e.g. "is my profitable business about to run out of cash?"). If a reader leaves having learned how to do the thing — even partly by hand — the article succeeds, whether or not they buy. |
| **First-hand experience (the "E" in E-E-A-T)** | Show how SBFinance *actually* computes a result. Real (anonymized/synthetic) CSV snippets, the actual deterministic formula, a screenshot of the dated cash-gap output. This is content a wrapper-around-ChatGPT competitor literally cannot write. |
| **Non-commodity / unique** | No generic "10 tips for cash flow" filler that 10,000 sites already have. Every piece must contain something only SBFinance can say — its method, its verification, its local-first architecture, its specific outputs. |
| **No AI-spam / no scaled content abuse** | Do not mass-generate near-duplicate posts. Each article is hand-shaped, fact-checked, and editorially distinct. AI may assist drafting, but a human owns accuracy and tone. |
| **Accuracy & verifiability (YMYL core)** | Every financial claim must be defensible. Prefer "here is the exact formula and the assumptions" over hand-wavy advice. Show the math; let the reader verify. This is also the product's wedge, so content and product reinforce each other. |
| **Authoritativeness & trust** | Bylines from real people on the team (link `#team`), a clear "how we compute this" methodology, transparent limitations ("this is a forecast under stated assumptions, not a guarantee"), and visible privacy/local-first stance (link `#privacy`). |
| **No unsupported claims** | Never promise a feature SBFinance doesn't ship. Never imply guaranteed outcomes, regulatory/tax/legal advice, or "AI that's always right." Frame forecasts as forecasts. When in doubt, soften and cite assumptions. |
| **Honest comparisons** | Comparison content (e.g. Excel vs AI-CFO, ChatGPT vs SBFinance) must fairly state what the alternative *does* do well, then show the specific gap SBFinance fills. No strawmen. |
| **Helpful even without the product** | Each article should leave a reader able to attempt the task manually. The product is the faster, verifiable, private way — not the only way. This earns trust and links. |
| **Privacy-forward framing** | The audience handles sensitive client financial exports. Lead with local-first / no-cloud-upload wherever relevant; it is both a real differentiator and a trust signal for a YMYL audience. |

---

## 2. Ten article / resource ideas

> These are **blog/resource posts**, not landing pages. Suggested route convention: `/blog/<slug>` (you must add `/blog/` handling to the deploy allowlist and each post to the sitemap). Each must carry an `Article` JSON-LD block and a `BreadcrumbList`.

### Article 1 — Forecast a cash gap from CSV exports

| Field | Value |
|---|---|
| Working title | How to Forecast a Cash Gap From Your CSV Bank & Ledger Exports |
| Search intent | Informational (with strong commercial-investigation tail) |
| Primary keyword | cash gap forecast from CSV |
| Secondary keywords | cash flow forecast spreadsheet, when will my business run out of cash, forecast cash shortfall, csv cash flow analysis |
| Suggested H1 | How to Forecast a Cash Gap From Your CSV Bank and Ledger Exports |
| `<title>` | Forecast a Cash Gap From CSV Exports (Step by Step) |
| Meta description | Turn raw CSV bank and ledger exports into a dated cash-gap forecast. The exact columns, formula, and assumptions — verify the math yourself. |
| Internal links | `#cash-gap`, `/features/cash-gap-forecast`, `#cta` (demo), `/sample-report.html` |
| Angle | Walks through the actual deterministic method SBFinance uses: which CSV columns matter, how opening balance + dated inflows − dated outflows roll forward to the *first day the balance goes negative*. Shows the formula so a reader can reproduce it in a spreadsheet, then shows how SBFinance does it in seconds, verifiably, from a messy export. |

### Article 2 — Detect financial leaks in SMB expenses

| Field | Value |
|---|---|
| Working title | How to Detect Financial Leaks Hiding in Small Business Expenses |
| Search intent | Informational |
| Primary keyword | detect financial leaks small business |
| Secondary keywords | hidden business expenses, wasted recurring spend, expense audit, find money leaks in business |
| Suggested H1 | How to Detect Financial Leaks Hiding in Your Small Business Expenses |
| `<title>` | Detect Financial Leaks in Small Business Expenses |
| Meta description | A repeatable method to surface duplicate payments, zombie subscriptions, and runaway recurring costs in your transaction exports — with the checks to run. |
| Internal links | `/features/financial-leak-detection`, `#features`, `#cta` |
| Angle | Categorizes the leak types SBFinance actually scans for (duplicate payments, creeping recurring charges, vendor drift) and gives the manual heuristic for each (group by vendor + amount + window). Ends by showing how SBFinance runs all checks at once on a raw export and ranks leaks by recoverable amount. |

### Article 3 — Why profit does not always become cash

| Field | Value |
|---|---|
| Working title | Why a Profitable Business Can Still Run Out of Cash |
| Search intent | Informational |
| Primary keyword | profit vs cash flow |
| Secondary keywords | profitable but no cash, why profit isn't cash, accrual vs cash, working capital gap |
| Suggested H1 | Why a Profitable Business Can Still Run Out of Cash |
| `<title>` | Profit vs Cash: Why Profitable Firms Go Broke |
| Meta description | Profit on paper, empty bank account. Learn the timing gaps — receivables, inventory, taxes — that turn a profitable month into a cash crisis. |
| Internal links | `#cash-gap`, `/features/cash-gap-forecast`, `#cta` |
| Angle | Explains accrual-vs-cash timing with a concrete worked example where P&L is green but the bank balance hits zero on a specific date. Directly seeds the wedge: this is exactly the blind spot SBFinance's dated cash-gap forecast catches that a profit report never will. |

### Article 4 — Accounting firms analyzing client exports privately

| Field | Value |
|---|---|
| Working title | How Accounting Firms Can Analyze Client Financial Exports Without Uploading Them to the Cloud |
| Search intent | Commercial investigation |
| Primary keyword | analyze client financial data privately |
| Secondary keywords | accounting firm data privacy, local financial analysis tool, no-cloud client data, confidential financial analysis |
| Suggested H1 | How Accounting Firms Can Analyze Client Exports Without Sending Data to the Cloud |
| `<title>` | Private Client Financial Analysis for Accounting Firms |
| Meta description | Run cash-gap and leak analysis on sensitive client exports locally — no client data leaves the machine. A workflow built for confidentiality. |
| Internal links | `/use-cases/accounting-firms`, `#privacy`, `#cta` |
| Angle | Frames the real compliance/confidentiality bind: client engagement letters and data-handling obligations often forbid pasting client ledgers into cloud AI. Shows a local-first workflow (export → analyze on-device → deliver PDF) and how SBFinance keeps the data on the analyst's machine. |

### Article 5 — Cash runway vs cash flow

| Field | Value |
|---|---|
| Working title | Cash Runway vs Cash Flow: What Founders Should Actually Monitor |
| Search intent | Informational |
| Primary keyword | cash runway vs cash flow |
| Secondary keywords | how to calculate runway, burn rate, months of runway, what founders should track |
| Suggested H1 | Cash Runway vs Cash Flow: What Founders Should Actually Monitor |
| `<title>` | Cash Runway vs Cash Flow: What to Monitor |
| Meta description | Runway, burn, and cash flow are not the same metric. Learn which one warns you first — and how to compute each from your own numbers. |
| Internal links | `#cash-gap`, `/use-cases/smb-founders`, `#cta` |
| Angle | Defines and contrasts the three metrics with formulas, then argues a dated cash-gap is the most actionable of all because it answers "when," not just "how fast." Connects to SBFinance computing all three from one export and flagging the gap date. |

### Article 6 — Find duplicate payments in transactions

| Field | Value |
|---|---|
| Working title | How to Find Duplicate Payments in Your Business Transactions |
| Search intent | Informational (commercial tail) |
| Primary keyword | find duplicate payments |
| Secondary keywords | duplicate invoice detection, double-paid vendor, payment error audit, recover overpayments |
| Suggested H1 | How to Find Duplicate Payments in Your Business Transactions |
| `<title>` | How to Find Duplicate Payments in Transactions |
| Meta description | Double-paid invoices quietly drain cash. Here are the matching rules to catch duplicate payments in an export — and how to recover the money. |
| Internal links | `/features/financial-leak-detection`, `#features`, `#cta` |
| Angle | Teaches the practical fuzzy-match logic (same vendor + near-identical amount + close dates, accounting for reference-number quirks) and the false-positive traps (legitimate installments, recurring rent). Shows SBFinance applying these rules automatically and surfacing recoverable totals. |

### Article 7 — Excel vs AI-CFO dashboard

| Field | Value |
|---|---|
| Working title | Excel vs an AI-CFO Dashboard: An Honest Comparison for SMB Finance Reporting |
| Search intent | Commercial investigation |
| Primary keyword | excel vs ai cfo dashboard |
| Secondary keywords | spreadsheet financial reporting, automate financial dashboard, smb finance tools, replace excel finance reports |
| Suggested H1 | Excel vs an AI-CFO Dashboard: An Honest Comparison for SMB Finance Reporting |
| `<title>` | Excel vs AI-CFO Dashboard for SMB Finance |
| Meta description | Where spreadsheets win, where they break, and what an AI-CFO adds. A fair, feature-by-feature look for small business finance reporting. |
| Internal links | `#comparison`, `#features`, `#cta` |
| Angle | Honestly credits Excel (flexible, universal, auditable) before showing the specific failure modes at SMB scale: stale links, formula rot, no anomaly detection, manual rebuilds. Positions SBFinance as the verifiable, auto-refreshing layer — not a magic replacement, but a faster path to the dated cash-gap and leak findings. |

### Article 8 — Founder financial report from messy spreadsheets

| Field | Value |
|---|---|
| Working title | How to Build a Founder Financial Report From Messy Spreadsheets |
| Search intent | Informational (commercial tail) |
| Primary keyword | founder financial report |
| Secondary keywords | financial report from spreadsheet, board financial report template, clean up messy financial data, executive finance summary |
| Suggested H1 | How to Build a Founder Financial Report From Messy Spreadsheets |
| `<title>` | Build a Founder Financial Report From Messy Data |
| Meta description | Turn inconsistent CSV/XLSX exports into a clear, board-ready financial report. The cleanup steps, the must-have sections, and a sample. |
| Internal links | `/sample-report.html`, `#features`, `#cta` |
| Angle | Gives the cleanup checklist (normalize dates, dedupe, categorize, reconcile to balance) and the sections a founder/board report needs (cash position, runway, gap date, leaks, anomalies). Links to SBFinance's actual sample executive PDF report as a concrete reference output. |

### Article 9 — Simulate hiring costs before committing

| Field | Value |
|---|---|
| Working title | How to Simulate the True Cost of a Hire Before You Commit |
| Search intent | Informational |
| Primary keyword | simulate hiring cost |
| Secondary keywords | true cost of an employee, can I afford to hire, hiring decision cash flow, headcount affordability |
| Suggested H1 | How to Simulate the True Cost of a Hire Before You Commit |
| `<title>` | Simulate Hiring Costs Before You Commit |
| Meta description | A new hire is more than salary. Model the full loaded cost against your runway — and see the date it changes — before you sign. |
| Internal links | `#cash-gap`, `/use-cases/smb-founders`, `#cta` |
| Angle | Breaks down the fully loaded cost of a hire (salary + taxes + tools + ramp) and shows how to fold it into a runway model so you see how the cash-gap date *moves*. Connects to SBFinance's decision simulation: change the inputs, watch the dated gap shift, before committing real money. |

### Article 10 — Local-first AI for sensitive financial data

| Field | Value |
|---|---|
| Working title | Local-First AI for Sensitive Financial Data: Why On-Device Analysis Matters |
| Search intent | Informational / commercial investigation |
| Primary keyword | local-first AI financial data |
| Secondary keywords | on-device financial analysis, private AI for finance, no-cloud financial AI, keep financial data local |
| Suggested H1 | Local-First AI for Sensitive Financial Data: Why On-Device Analysis Matters |
| `<title>` | Local-First AI for Sensitive Financial Data |
| Meta description | Cloud AI means your ledgers leave your machine. Here's why local-first, on-device financial analysis matters — and how the trade-offs work. |
| Internal links | `#privacy`, `/use-cases/accounting-firms`, `#cta` |
| Angle | Explains the concrete data-exposure risk of pasting client financials into cloud chatbots (retention, training, breach surface) and the trade-offs of local-first (privacy and control vs. convenience). Positions SBFinance's on-device architecture as the answer for teams that *cannot* upload client data — honest about what local-first does and doesn't change. |

---

## 3. Five landing page ideas (deferred programmatic SEO pages)

> These were **intentionally not built yet** — this roadmap specs them. Each is a distinct page with its own value blocks, **not** a clone of the homepage. Each requires its own canonical, a sitemap entry, an entry in the deploy allowlist, an internal link to the demo CTA, and (where applicable) `BreadcrumbList` + relevant JSON-LD (`WebPage`/`SoftwareApplication`/`FAQPage`).
>
> **Deploy note for all five:** these live under `/use-cases/` and `/features/` directories. The deploy workflow currently copies a **flat file allowlist plus a directory allowlist**. You must either (a) add `use-cases` and `features` to the `for dir in ...` directory list in `.github/workflows/deploy-pages.yml`, or (b) add each `.html` file explicitly to the `for file in ...` list. **Without this, the pages will not deploy.**

### Page 1 — SMB Founders

| Field | Value |
|---|---|
| Route / path | `/use-cases/smb-founders` (`/use-cases/smb-founders.html` or `/use-cases/smb-founders/index.html`) |
| H1 | An AI-CFO for SMB Founders Who Need to Know the Date, Not a Guess |
| `<title>` | AI-CFO for SMB Founders \| SBFinance |
| Meta description | See the exact date your business runs out of cash, find money leaks, and simulate big decisions — from your own exports, on your machine. |
| Primary keyword | ai cfo for small business founders |
| Secondary keywords | small business cash flow tool, founder financial dashboard, when will my startup run out of cash |
| Target audience | SMB founders / owner-operators without a full finance function |
| Unique value blocks (not on homepage) | (1) Founder-specific pain framing: "profitable on paper, anxious about payroll." (2) The three founder questions SBFinance answers — *When do I run out? Where am I leaking? Can I afford this move?* (3) A founder-flavored walkthrough of the dated cash-gap output. (4) Decision-simulation mini-examples (hire / marketing spend / loan). (5) Founder FAQ distinct from the homepage FAQ. (6) Trust strip: local-first + verify-the-math. |
| Canonical | `https://sbfinance.me/use-cases/smb-founders` |
| Sitemap + deploy | Add `<loc>https://sbfinance.me/use-cases/smb-founders</loc>` to `sitemap.xml`; add `use-cases` dir (or the file) to the deploy allowlist. |

### Page 2 — Accounting Firms

| Field | Value |
|---|---|
| Route / path | `/use-cases/accounting-firms` |
| H1 | Local-First Financial Analysis for Accounting Firms |
| `<title>` | Local-First Financial Analysis for Accounting Firms \| SBFinance |
| Meta description | Analyze sensitive client exports without sending data to the cloud. Cash-gap, leak detection, and client-ready PDF reports — on your machine. |
| Primary keyword | financial analysis tool for accounting firms |
| Secondary keywords | private client data analysis, local financial analysis software, accounting firm cash flow tool, confidential client reporting |
| Target audience | Accounting firms, bookkeepers, outsourced/fractional finance teams |
| Unique value blocks (not on homepage) | (1) Confidentiality-first framing tied to client engagement obligations. (2) Multi-client workflow: standardize messy exports across clients fast. (3) Deliverable angle — branded/executive PDF report you hand to the client. (4) "Why local-first matters for your duty of care" block. (5) Firm-oriented FAQ (data residency, no-cloud, per-machine use). (6) CTA framed as "try it on one client export." |
| Canonical | `https://sbfinance.me/use-cases/accounting-firms` |
| Sitemap + deploy | Add loc to `sitemap.xml`; ensure `use-cases` dir in deploy allowlist. |

### Page 3 — Finance Managers

| Field | Value |
|---|---|
| Route / path | `/use-cases/finance-managers` |
| H1 | Financial Export Analysis for Finance Managers |
| `<title>` | Financial Export Analysis for Finance Managers \| SBFinance |
| Meta description | Turn ERP and bank exports into cash-gap forecasts, leak findings, and anomaly alerts in minutes — verifiable math, no cloud upload. |
| Primary keyword | financial export analysis tool |
| Secondary keywords | finance manager dashboard, erp export analysis, anomaly detection finance, monthly close analysis tool |
| Target audience | In-house finance managers / controllers at SMBs |
| Unique value blocks (not on homepage) | (1) Workflow framing around the monthly close and variance review. (2) Anomaly-detection emphasis (what's unusual this period vs baseline). (3) "Bring your own export" — works with messy ERP/bank/accounting CSV/XLSX. (4) How to present findings up the chain (report + verifiable numbers). (5) Manager FAQ (reconciliation, assumptions, auditability). (6) CTA: run last month's export through it. |
| Canonical | `https://sbfinance.me/use-cases/finance-managers` |
| Sitemap + deploy | Add loc to `sitemap.xml`; ensure `use-cases` dir in deploy allowlist. |

### Page 4 — Cash-Gap Forecast (feature)

| Field | Value |
|---|---|
| Route / path | `/features/cash-gap-forecast` |
| H1 | Cash-Gap Forecast From Your CSV/XLSX Financial Data |
| `<title>` | Cash-Gap Forecast from CSV/XLSX Financial Data \| SBFinance |
| Meta description | Get the exact date your cash runs negative, computed from your own ledger with deterministic math you can verify — not an AI guess. |
| Primary keyword | cash gap forecast |
| Secondary keywords | cash shortfall forecast, dated cash gap, when will I run out of cash, cash runway calculator from csv |
| Target audience | All segments; highest-intent buyers researching the core capability |
| Unique value blocks (not on homepage) | (1) Deep "how the math works" methodology section — opening balance, dated inflows/outflows roll-forward, first-negative date — explicitly verifiable. (2) Worked example with a sample export → sample gap date. (3) Assumptions & limitations stated plainly (it's a forecast under inputs). (4) "Verify it yourself" callout (the wedge). (5) Feature FAQ. (6) Links to `/sample-report.html` and decision-simulation. This is the **canonical wedge page** — strongest single asset. |
| Canonical | `https://sbfinance.me/features/cash-gap-forecast` |
| Sitemap + deploy | Add loc to `sitemap.xml`; add `features` dir to deploy allowlist. |

### Page 5 — Financial Leak Detection (feature)

| Field | Value |
|---|---|
| Route / path | `/features/financial-leak-detection` |
| H1 | Financial Leak Detection for Small Businesses |
| `<title>` | Financial Leak Detection for Small Businesses \| SBFinance |
| Meta description | Automatically surface duplicate payments, zombie subscriptions, and runaway recurring costs in your exports — ranked by recoverable amount. |
| Primary keyword | financial leak detection |
| Secondary keywords | duplicate payment detection, find wasted spend, recurring cost audit, recover overpayments |
| Target audience | All segments; founders/managers focused on stopping waste |
| Unique value blocks (not on homepage) | (1) Taxonomy of leak types SBFinance detects, each with its detection rule. (2) Ranked-by-recoverable-amount output explanation. (3) False-positive handling (installments vs duplicates). (4) Before/after worked example. (5) Feature FAQ. (6) Cross-link to `/features/cash-gap-forecast` (plugging leaks moves the gap date). |
| Canonical | `https://sbfinance.me/features/financial-leak-detection` |
| Sitemap + deploy | Add loc to `sitemap.xml`; ensure `features` dir in deploy allowlist. |

---

## 4. Recommended priority order

Ranked across **both** articles and landing pages. Difficulty = build/research effort. Intent value = how close the searcher is to buying / how qualified. Strategic fit = alignment to the dated-cash-gap wedge.

| Rank | Item | Type | Difficulty | Intent value | Wedge fit | Rationale |
|---|---|---|---|---|---|---|
| 1 | `/features/cash-gap-forecast` | Page | Medium | High | **Highest** | The wedge made into a page. Highest-intent keyword, the strongest single asset, the destination most other content should link to. Build this first so everything else can point at it. |
| 2 | Article 1 — Forecast a cash gap from CSV exports | Article | Medium | High | **Highest** | First-hand, method-driven informational piece that proves the wedge and feeds Page 1 link equity. Demonstrates E-E-A-T with real formula + sample. |
| 3 | Article 3 — Why profit ≠ cash | Article | Low | High | High | High-volume, evergreen, low effort. Perfectly seeds the wedge ("profitable but out of cash") and links into Page 1. Easy win to publish early. |
| 4 | `/features/financial-leak-detection` | Page | Medium | High | Medium-High | Second core capability page; pairs with Page 1 (plugging leaks moves the gap date). Concrete, demoable value. |
| 5 | `/use-cases/accounting-firms` | Page | Medium | High | Medium | Highest-LTV, privacy-driven audience that *cannot* use cloud AI — strongest differentiation, but smaller search volume. |
| 6 | Article 4 — Accounting firms analyze exports privately | Article | Medium | High | Medium | Feeds Page 5; doubles down on the local-first moat for a high-value segment. |
| 7 | `/use-cases/smb-founders` | Page | Medium | High | High | Broadest audience; consolidates founder intent and links to the wedge page. |
| 8 | Article 6 — Find duplicate payments | Article | Low | Medium-High | Medium | Concrete, high-intent how-to feeding the leak-detection page. Low effort. |
| 9 | Article 7 — Excel vs AI-CFO | Article | Medium | Medium-High | Medium | Commercial-investigation comparison; captures "is this worth switching" searchers. Must stay honest. |
| 10 | `/use-cases/finance-managers` | Page | Medium | Medium | Medium | Solid segment page; lower urgency than founders/firms. |
| 11 | Article 5 — Runway vs cash flow | Article | Low | Medium | High | Definitional evergreen; supports founder page and the wedge. |
| 12 | Article 9 — Simulate hiring costs | Article | Medium | Medium | Medium | Showcases decision-simulation; ties to runway. Build once simulation messaging is settled. |
| 13 | Article 2 — Detect financial leaks | Article | Low | Medium | Medium | Pillar-ish overview feeding the leak page; partly overlaps Article 6, so sequence after it. |
| 14 | Article 8 — Founder financial report from messy data | Article | Medium | Medium | Low-Medium | Useful, links to the live sample report, but less wedge-central. |
| 15 | Article 10 — Local-first AI for sensitive data | Article | Low | Medium | Medium | Strong trust/privacy piece; evergreen, supports the firms page and `#privacy`. |

### Build these first (2-3)

1. **`/features/cash-gap-forecast`** — the wedge as a page; the hub everything links to.
2. **Article 1 — "How to forecast a cash gap from CSV exports"** — the first-hand proof piece that links into Page 1.
3. **Article 3 — "Why profit ≠ cash"** — low-effort, high-volume, seeds the wedge and links into both above.

This trio establishes the cash-gap topic cluster (one strong commercial page + two supporting informational articles) before broadening into segments and the leak-detection cluster.

---

## 5. Production checklist for each new page/article

Run this for **every** new article or landing page before merge.

### Content & on-page SEO

- [ ] **Unique H1** — exactly one `<h1>`, distinct from every other page, matching searcher intent.
- [ ] **Unique `<title>`** — ideally ≤ 60 chars, ends with `| SBFinance` for landing pages.
- [ ] **Unique meta description** — ≤ 155 chars, action-oriented, not duplicated from another page.
- [ ] **No homepage duplication** — the page contains value blocks that do **not** exist on `index.html`. If a section is near-identical to the homepage, rewrite or remove it.
- [ ] **No unsupported claims** — every feature mentioned actually ships; forecasts are framed as forecasts; no guarantees; no tax/legal/financial advice positioning. Re-read against the YMYL bar in §1.
- [ ] **First-hand / unique value present** — at least one thing only SBFinance can say (method, sample output, local-first detail).

### Technical SEO

- [ ] **Canonical tag** — `<link rel="canonical" href="https://sbfinance.me/...">` with the exact production URL (decide trailing-slash convention and keep it consistent site-wide).
- [ ] **Added to `sitemap.xml`** — new `<url><loc>...</loc></url>` entry at root sitemap.
- [ ] **Added to deploy allowlist** in `.github/workflows/deploy-pages.yml` — either the file in the `for file in ...` list or its parent directory (`blog`, `use-cases`, `features`) in the `for dir in ...` list. **If skipped, the page silently will not deploy.**
- [ ] **`robots.txt`** — confirm the path is not disallowed (current `robots.txt` allows all; no action unless that changes).
- [ ] **Mobile + performance** — page is responsive and loads fast (static HTML; keep it lean).
- [ ] **Open Graph / Twitter meta** — `og:title`, `og:description`, `og:url`, `og:image` for shareability.

### Structured data (JSON-LD)

- [ ] **Articles** — `Article` (or `BlogPosting`) with `headline`, `author` (real team member, link `#team`), `datePublished`, `dateModified`, `publisher`.
- [ ] **Landing/feature pages** — `WebPage` and/or `SoftwareApplication` as appropriate.
- [ ] **All pages** — `BreadcrumbList` (e.g. Home → Use Cases → SMB Founders).
- [ ] **Pages with a Q&A section** — `FAQPage` for the page-specific FAQ (do not reuse the homepage FAQ markup).
- [ ] Validate every JSON-LD block (Rich Results Test) before merge.

### Internal linking & conversion

- [ ] **Link back to the demo CTA** — every page links to `#cta` (or the dedicated demo form), ideally above the fold and at the end.
- [ ] **Link into the wedge** — link to `/features/cash-gap-forecast` and/or the homepage cash-gap section. **Note:** add an `id="cash-gap"` anchor on `index.html` first, or link to `#features` until it exists.
- [ ] **Link to `#privacy`** on any privacy/local-first-themed content.
- [ ] **Cluster cross-links** — articles link to their related landing page and to sibling articles in the same cluster; avoid orphan pages.
- [ ] **Descriptive anchor text** — keyword-relevant, never "click here."

### Editorial / trust (YMYL)

- [ ] **Named author + reviewer** — a real person owns the page's accuracy.
- [ ] **Stated assumptions & limitations** wherever a number, forecast, or method appears.
- [ ] **Fact-check pass** — every financial claim is defensible and the math (if shown) is correct and reproducible.
- [ ] **`dateModified` refreshed** on any future edit.
