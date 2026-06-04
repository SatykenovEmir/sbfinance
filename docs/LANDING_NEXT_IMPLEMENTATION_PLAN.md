# SBFinance Landing — Next Implementation Plan

Plan date: May 28, 2026
Scope: landing repo only

## Sprint Update (May 28, 2026)

Completed in current safe static sprint:
- Added/verified GitHub Pages workflow for static artifact deployment.
- Added `robots.txt` and `sitemap.xml` with explicit domain TODO placeholders.
- Improved form trust messaging while keeping Web3Forms integration intact.
- Added visible privacy notice next to demo form.
- Kept download cards in private-beta placeholder state (no fake links).

Still pending manual/external actions:
- Set Pages source to `GitHub Actions` in repository settings.
- Configure Web3Forms dashboard hardening (domain allowlist, anti-spam, routing).
- Replace `https://YOUR_DOMAIN/` placeholders once final domain is confirmed.

## P0 — Make Current Landing Deploy Reliably

### Task P0.1 — Enable/verify GitHub Pages Actions deployment
- Affected files:
  - `.github/workflows/deploy-pages.yml`
- What to change:
  - Keep workflow as source of truth.
  - In GitHub repo settings, set Pages source to GitHub Actions.
  - Confirm trigger branch (`master`) is intended.
- Why:
  - Removes manual deployment drift.
- Acceptance criteria:
  - Push to `master` publishes latest landing.
  - Workflow run is green.
  - Published site includes `index.html` + policy pages.
- Suggested tests/manual checks:
  - Trigger `workflow_dispatch`.
  - Open deployed URL and verify footer legal links return HTTP 200.

### Task P0.2 — Add technical SEO baseline files
- Affected files:
  - `robots.txt` (new)
  - `sitemap.xml` (new)
  - `index.html`
- What to change:
  - Add `robots.txt` allowing crawl.
  - Add `sitemap.xml` for core pages.
  - Add canonical tag once final domain is confirmed.
- Why:
  - Improves indexability and crawler clarity.
- Acceptance criteria:
  - `/<robots.txt>` and `/<sitemap.xml>` resolve.
  - Search Console can read sitemap.
- Suggested tests/manual checks:
  - Open files in browser.
  - Validate sitemap format with an XML validator.

### Task P0.3 — Repo hygiene for web artifact scope
- Affected files:
  - root asset organization (new `assets/docs/` or separate collateral repo)
- What to change:
  - Move non-site collateral files out of root web artifact path when appropriate.
- Why:
  - Keeps deployment payload focused and reduces accidental public file exposure.
- Acceptance criteria:
  - Landing repo root contains only site/runtime essentials.
- Suggested tests/manual checks:
  - Run `find . -maxdepth 2 -type f` and verify expected layout.

## P1 — Fix Request Demo Form

### Task P1.1 — Harden Web3Forms configuration
- Affected files:
  - `index.html`
  - external Web3Forms dashboard/config (outside repo)
- What to change:
  - Enable domain allowlist.
  - Enable CAPTCHA/Turnstile if available.
  - Confirm recipient routing and notification templates.
- Why:
  - Reduce spam and submission abuse.
- Acceptance criteria:
  - Legitimate form submits succeed.
  - Obvious bot submissions are blocked.
- Suggested tests/manual checks:
  - Submit valid form.
  - Submit with honeypot filled (should fail).
  - Stress-test with repeated submissions.

### Task P1.2 — Add explicit form privacy notice
- Affected files:
  - `index.html`
- What to change:
  - Add short note under form: what data is collected and why, with link to privacy policy.
- Why:
  - Better trust and compliance posture.
- Acceptance criteria:
  - Notice is visible and readable on desktop/mobile.
- Suggested tests/manual checks:
  - Manual responsive review at 375px and 1440px widths.

### Task P1.3 — Optional migration path to backend intake
- Affected files:
  - `index.html` (future)
  - backend repo/service (future)
- What to change:
  - Introduce `POST /api/demo/request` as landing-owned integration target.
  - Keep Web3Forms as fallback during migration.
- Why:
  - Needed for controlled automation and license workflows.
- Acceptance criteria:
  - Demo requests can be processed through backend without exposing secrets.
- Suggested tests/manual checks:
  - API integration test + frontend submit flow test.

## P2 — Add Download Section

### Task P2.1 — Replace placeholder buttons with real release links
- Affected files:
  - `index.html`
- What to change:
  - Add real links for Windows/macOS/Linux installers.
  - Include architecture labels.
- Why:
  - Converts traffic to install trials.
- Acceptance criteria:
  - All OS buttons download valid files.
- Suggested tests/manual checks:
  - Click each link and verify HTTP 200 + expected filename.

### Task P2.2 — Add release metadata and checksums
- Affected files:
  - `index.html`
  - optional `downloads.json` (new)
- What to change:
  - Display latest version, release date, checksum links.
- Why:
  - User trust and integrity verification.
- Acceptance criteria:
  - Metadata reflects latest published desktop release.
- Suggested tests/manual checks:
  - Validate displayed checksums match published artifacts.

### Task P2.3 — Define installer hosting policy
- Affected files:
  - documentation (`docs/`)
- What to change:
  - Standardize on GitHub Releases (or alternative) and naming convention.
- Why:
  - Stable, predictable download URLs.
- Acceptance criteria:
  - Policy documented and followed per release.
- Suggested tests/manual checks:
  - Dry-run one full release upload and landing link update.

## P3 — Add Terms/Privacy/Refund Pages

### Task P3.1 — Replace placeholder legal copy with reviewed version
- Affected files:
  - `terms.html`
  - `privacy-policy.html`
  - `refund-policy.html`
- What to change:
  - Replace provisional text with legally reviewed policy set.
- Why:
  - Required for production/legal credibility.
- Acceptance criteria:
  - Legal reviewer signs off on all policy pages.
- Suggested tests/manual checks:
  - Legal QA pass and final date stamps.

### Task P3.2 — Keep policy links globally available
- Affected files:
  - `index.html`
- What to change:
  - Ensure policy links remain visible in footer and optionally in form area.
- Why:
  - Accessibility and compliance expectations.
- Acceptance criteria:
  - Policy links visible on desktop/mobile and not broken.
- Suggested tests/manual checks:
  - Manual click-through testing.

## P4 — Prepare License Server Integration

### Task P4.1 — Define demo-to-license workflow contract
- Affected files:
  - `docs/` (architecture doc)
  - backend/service repo (future)
- What to change:
  - Specify how demo requests become license records.
  - Decide manual approval vs auto-issuance.
- Why:
  - Prevents ad-hoc integration and insecure shortcuts.
- Acceptance criteria:
  - Written API contract and approval flow exists.
- Suggested tests/manual checks:
  - Review sequence diagram with app+backend stakeholders.

### Task P4.2 — Keep license endpoints backend-only
- Affected files:
  - `index.html` (guardrails only)
- What to change:
  - Do not call `/api/licenses/activate|verify|deactivate` directly from landing for issuance.
  - Use dedicated backend intake endpoint for lead processing.
- Why:
  - Protects licensing logic from abuse.
- Acceptance criteria:
  - No secret-bearing or license-admin calls in frontend source.
- Suggested tests/manual checks:
  - Grep check for forbidden endpoints/keys in frontend.

### Task P4.3 — Add abuse controls in backend integration
- Affected files:
  - backend/service repo
- What to change:
  - Add rate limiting, IP heuristics, request validation, and logs.
- Why:
  - Stops scripted mass key requests.
- Acceptance criteria:
  - Abuse scenarios are throttled and logged.
- Suggested tests/manual checks:
  - Load and abuse simulation in staging.

## P5 — Product Polish / SEO / Analytics

### Task P5.1 — Add real product proof
- Affected files:
  - `index.html`
  - assets folder (new screenshots/video)
- What to change:
  - Replace/augment simulated visuals with real app screenshots.
- Why:
  - Increases trust and demo conversions.
- Acceptance criteria:
  - At least three authentic screenshots visible and responsive.
- Suggested tests/manual checks:
  - Mobile/desktop visual QA.

### Task P5.2 — Improve conversion messaging
- Affected files:
  - `index.html`
- What to change:
  - Add concise “Who this is for” and “What happens after submit” blocks near CTA.
- Why:
  - Reduces friction and uncertainty.
- Acceptance criteria:
  - Clear workflow explanation in <= 3 bullets.
- Suggested tests/manual checks:
  - Quick user test (5-second clarity test).

### Task P5.3 — Add non-invasive analytics (optional)
- Affected files:
  - `index.html`
- What to change:
  - Add privacy-friendly analytics only if explicitly approved.
- Why:
  - Track CTA funnel without heavy tracking.
- Acceptance criteria:
  - Pageview + CTA + form-submit events are visible.
- Suggested tests/manual checks:
  - Verify events fire once and no console errors.

## Recommended Execution Order (Sprint-ready)
1. P0.1 + P0.2 (deployment + crawlability baseline)
2. P1.1 + P1.2 (form reliability + trust)
3. P2.1 + P2.2 (real downloads)
4. P3.1 (legal finalization)
5. P4.1 (license flow contract)
