# SBFinance Landing: P0/P1 Deployment + Form Hardening Report

Date: May 28, 2026
Scope: Static landing repository only

## What Was Changed

### 1) Deployment hardening
- Verified workflow exists and is static-site compatible: `.github/workflows/deploy-pages.yml`
- Verified trigger branch currently matches repository branch:
  - Repo branch: `master`
  - Workflow trigger: `push` on `master`
- Confirmed workflow supports manual runs via `workflow_dispatch`.
- Added crawl/indexing baseline files:
  - `robots.txt`
  - `sitemap.xml`

### 2) SEO baseline hardening
- Kept/verified core tags in `index.html`:
  - `title`
  - `meta description`
  - `og:title`
  - `og:description`
  - `og:type`
  - `twitter:card`
  - `robots`
- Added explicit TODO comments for:
  - canonical URL (when domain is finalized)
  - `og:image` asset (recommended `/assets/og/sbfinance-og.png`, 1200x630)
- No fake image links were added.

### 3) Form trust/reliability hardening (Web3Forms kept)
- Kept form provider and endpoint unchanged:
  - `POST https://api.web3forms.com/submit`
- Kept hidden `access_key` and honeypot `botcheck`.
- Added form implementation comment clarifying:
  - Web3Forms is current MVP intake
  - future backend intake should be `POST /api/demo/request`
  - license generation must remain server-side
- Improved success copy:
  - from generic response to explicit review flow: "We’ll review your request and contact you with demo access."
- Added visible privacy/trust note below form:
  - states collected fields and purpose
  - links to `privacy-policy.html`
- No license-server calls were introduced in frontend.

### 4) Download section safe state
- Kept downloads as non-clickable placeholders (no fake links).
- Updated copy to private-beta framing:
  - "Desktop apps are currently in private beta"
  - Request demo access for installer delivery
- Added TODO note for future GitHub Releases strategy:
  - include version/release date/SHA-256 checksums

## GitHub Pages Deployment Status

Current state: **Ready in repo, pending GitHub repo settings confirmation**

Workflow behavior:
- Copies static files into `site/` artifact
- Includes `index.html`, policy pages, `robots.txt`, `sitemap.xml` (if present), optional assets dirs
- Deploys using official Pages actions

## Required GitHub Repo Settings (Erbol action)
1. Open GitHub repo settings for the landing repo.
2. Go to `Settings -> Pages`.
3. Set source to `GitHub Actions`.
4. Keep default branch aligned with workflow trigger (`master`) or update workflow if branch changes.

## SEO Files Added
- `robots.txt` with TODO domain placeholder
- `sitemap.xml` with TODO domain placeholder

Important TODO:
- Replace `https://YOUR_DOMAIN/` with final production domain in both files.

## Form / Web3Forms Behavior (Current)
- Endpoint: `https://api.web3forms.com/submit`
- Method: `POST`
- Fields:
  - hidden: `access_key`, `subject`, `from_name`, `botcheck`
  - visible: `name`, `company`, `email`, `role`, `message`
- UX behavior:
  - shows loading state
  - success message on provider success
  - error message fallback with `mailto:hello@sbfinance.me`

## What Erbol Must Configure in Web3Forms Dashboard
1. Domain allowlist for your production domain.
2. Spam protection settings (captcha/anti-spam options supported by provider).
3. Recipient inbox routing and subject formatting.
4. Optional webhook (future) if you want backend automation later.
5. Confirm submissions from GitHub Pages domain and custom domain (if any) are accepted.

## Download Section Current Behavior
- Windows/macOS/Linux cards are visible.
- Buttons are intentionally disabled and labeled `Private beta`.
- No fake download URLs are present.

## Repo Hygiene Note
- Root currently contains collateral and outreach files (`.pptx/.pdf/.docx`, LinkedIn scripts).
- No files were deleted in this sprint.
- Recommended future organization:
  - public web assets under `assets/`
  - private collateral moved out of landing deploy repo or clearly separated under `assets/docs/`

## Remaining Blockers
1. Final production domain not confirmed in `robots.txt`/`sitemap.xml`/canonical.
2. Real social preview image (`og:image`) not yet added.
3. Legal pages are placeholders pending legal review.
4. Installer links/checksum publishing flow not wired yet.
5. Web3Forms dashboard hardening still requires manual configuration.

## Manual Test Checklist
- [ ] Open `/` and verify page renders.
- [ ] Open `/terms.html`.
- [ ] Open `/privacy-policy.html`.
- [ ] Open `/refund-policy.html`.
- [ ] Open `/robots.txt`.
- [ ] Open `/sitemap.xml`.
- [ ] Verify footer legal links navigate correctly.
- [ ] Verify no important `href="#"` placeholders remain.
- [ ] Submit test form and verify success state.
- [ ] Submit invalid form or simulate error and verify error message.
- [ ] Confirm `botcheck` field exists in form source.
- [ ] Validate mobile layout around 375px width in browser.

