# SBFinance Homepage Repositioning Plan

Date: 2026-07-25

## Baseline

- Repository: `https://github.com/SatykenovEmir/sbfinance/`
- Branch: `master`
- Starting HEAD: `e7c4b09c27ef386c287ab8c19a63219eb1898ebe`
- Worktree before evidence capture: clean
- Deployment: GitHub Pages from the `Deploy SBFinance Landing to GitHub Pages` workflow on pushes to `master`
- Last deployed HEAD: `e7c4b09c27ef386c287ab8c19a63219eb1898ebe`
- Baseline CI: deploy and SEO workflows passed
- Baseline automated check: `node scripts/seo-check.mjs` -> 79 passed, 0 failed
- Baseline homepage title: `SBFinance — Local-First AI-CFO for Small Businesses`
- Baseline H1: `The local-first AI-CFO that finds cash gaps before they hit.`
- Baseline hero CTAs: `#cta` and `/sample-report.html`
- Baseline screenshots: `screenshots/homepage-repositioning/old-desktop-hero.png` and `old-mobile-hero.png`

## Source Of Truth

- Product proof: existing `/protection-gap`, `/protection-gap/demo`, `/sample-protection-report`, and `protection-gap/demo/data/protection-demo-fixture.json`
- Programme relevance: official Global FinTech Hackcelerator 2026 programme page at `https://www.fintechfestival.sg/global-fintech-hackcelerator`
- Public copy will not name or imply affiliation with Zurich Insurance, MAS, GFTN, SFF, or the programme.
- No `real-time`, authoritative coverage, underwriting, actuarial accuracy, partnership, customer, revenue, or validation claims will be introduced.

## Implementation

1. Replace the AI-CFO-first hero with the approved SME financial risk and protection positioning and three verified conversion paths.
2. Reorder the homepage around protection workflow, supported risk categories, fixture-backed interactive proof, coverage gaps, cash-flow impact, evidence, privacy, and then the AI-CFO foundation.
3. Load all public demo metrics, coverage rows, policy evidence, and simulator states from the existing deterministic demo fixture. Do not copy calculated values into the homepage.
4. Add clear paths for the free browser demo, SME pilot, broker/insurer design partnership, and AI-CFO private beta.
5. Replace the generic request form with a protection-oriented, minimal enquiry form. Preserve Web3Forms, honeypot protection, success/error handling, and the warning not to send sensitive files.
6. Update navigation, metadata, JSON-LD, manifest, social preview, sitemap timestamp, privacy-policy field disclosure, and zero-dependency checks.
7. Preserve truthful desktop-download access as a secondary AI-CFO path and keep release links tied to the live GitHub release API.

## Verification

- Static checks: expanded homepage/CTA/form/SEO/accessibility assertions, JSON validation, secret-pattern scan, dependency audit status, deploy-allowlist checks, and link checks.
- Browser checks: local HTTP server plus Chromium at desktop, tablet, 390px, and 320px; keyboard/mobile menu; demo interaction; form validation/success/error with mocked endpoint; direct navigation and refresh; console and failed requests.
- Evidence: required after screenshots under `docs/gfh-2026/screenshots/homepage-repositioning/`.
- Review: SME founder, broker/insurer, and Hackcelerator-judge passes; claims matrix updated before commit.
- Release: inspect full diff, commit only relevant landing files on the existing branch, push without force, wait for CI, then verify rendered production content and routes independently of CI status.
