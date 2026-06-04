# LANDING READINESS AUDIT — SBFinance

Audit date: May 28, 2026 (Asia/Omsk)
Scope: landing repository only (`sbfinance_landing`), not the desktop app repository.

## Executive Summary
SBFinance landing is a static single-page site built in one large `index.html` with inline CSS/JS and a third-party form integration (Web3Forms). The marketing content is strong and fairly complete, but the repository originally lacked legal pages, a download section, and deployment automation. In this audit pass, safe fixes were applied to add production scaffolding (policy placeholders, download placeholder section, and GitHub Pages workflow).

Current production readiness: **partial**.

What now works:
- Public marketing page exists and is visually polished.
- Request Demo form posts to Web3Forms.
- Footer legal links now point to actual policy placeholder pages.
- Download section placeholder is now present.
- GitHub Pages workflow is now present.

Main remaining blockers:
- No backend/license-request orchestration path yet (expected for static landing).
- No real installer links/version metadata/checksums yet.
- Legal pages are placeholders and require legal review.
- SEO/technical basics still incomplete (`og:image`, `canonical`, `robots.txt`, `sitemap.xml`, analytics strategy).

## Phase 1 — Repository Structure Inspection

### Stack and Tooling
- Framework/stack: Plain static HTML/CSS/JS (single-file landing)
- Package manager: None (`package.json` absent)
- Build step: None
- Runtime: Browser only

### Deployment Signals
- Existing repo includes root `index.html`, suitable for static hosting.
- During this audit, deployment workflow was added: `.github/workflows/deploy-pages.yml`.
- No `vercel.json`, `netlify.toml`, `wrangler.toml`, or similar configs found.
- No `CNAME` found in repo.

### Key Files Found
- `index.html` (single-page site with inline styles/scripts)
- `privacy-policy.html` (added safe placeholder)
- `terms.html` (added safe placeholder)
- `refund-policy.html` (added safe placeholder)
- `.github/workflows/deploy-pages.yml` (added safe deploy workflow)
- `linkedin_bot.py`, `linkedin_script.js`, `linkedin_instructions.md` (non-landing outreach scripts)
- Pitch/collateral binaries (`.pptx`, `.pdf`, `.docx`, `qrcode.png`) currently not referenced by site

### Integrations and External Services
- Google Fonts via `fonts.googleapis.com`
- Web3Forms form endpoint: `https://api.web3forms.com/submit`

### Environment Variables / Secrets
- No `.env` files or build-time env handling.
- Web3Forms `access_key` present in frontend hidden input (`index.html:4206`).

### Build/Lint/Test Commands
- `npm` exists on machine, but repo has no `package.json`.
- Therefore `npm install`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm audit` are not applicable.

## Phase 2 — Current Landing Content Audit

Pages currently present:
- `index.html` (main landing)
- `terms.html` (placeholder)
- `privacy-policy.html` (placeholder)
- `refund-policy.html` (placeholder)

Main sections in landing:
- Hero, pipeline, privacy, features, chat demo, risk, use cases, comparison, FAQ, downloads placeholder, CTA form, footer.

| Area | Current status | File(s) | Problem | Recommended fix |
|---|---|---|---|---|
| Public marketing page | Implemented | `index.html` | Monolithic single-file architecture; maintainability risk | Split into partials/components or section-based files over time |
| Hero section | Implemented | `index.html:3377` | CTA “See Sample Report” points to pipeline, not real sample file | Add real sample report link or relabel CTA |
| Value proposition clarity | Good | `index.html:3382` onward | Dense copy can feel long before first trust proof | Add concise proof block (pilot users, metrics, testimonials) |
| Primary CTA | Implemented | `index.html:3395`, `index.html:4198` | No explicit SLA/response expectation | Add expected response time (e.g., “within 24h”) |
| Request Demo form | Implemented | `index.html:4205` | No server-owned logic for routing/scoring/automation | Keep Web3Forms for MVP, add backend webhook/API path later |
| Email collection | Implemented via Web3Forms | `index.html:4205`, `index.html:4351` | Relies on third-party configuration outside repo | Document owner account + webhook behavior |
| Download section | Placeholder implemented | `index.html:4168` | No real installer links/version/checksums | Add release-backed download metadata and signed links |
| App screenshots/real product visuals | Partially simulated UI | `index.html` hero/chat/risk blocks | Mostly mock terminal/cards; no real app screenshots | Add authentic screenshots/video GIFs |
| Links to pitch deck / LinkedIn / PDFs | Not exposed from landing UI | root files only | Collateral exists but unreachable from page | Add dedicated “Resources” section if desired |
| Unused/bulk assets | Present | root `.pptx/.pdf/.docx/.png` | Repository clutter and accidental public artifact risk | Move collateral to `/assets/docs` or separate private repo |
| Policy pages | Placeholder pages now exist | `terms.html`, `privacy-policy.html`, `refund-policy.html` | Not legal-reviewed production text | Replace with legally reviewed policies |
| Footer links | Fixed (no broken `#` docs link now) | `index.html:4283-4288` | Still no dedicated product docs portal | Add docs URL when ready |
| Overall design quality | High prototype / near marketing-ready | `index.html` | Content-heavy single page; no trust badges/pricing clarity | Add trust proof, concise ICP messaging, demo flow clarity |

## Phase 3 — Form / Email Collection Audit

## Form Integration Found
- Provider: Web3Forms
- File: `index.html`
- Form action / endpoint: `https://api.web3forms.com/submit` (`index.html:4205`)
- Method: `POST`
- Fields sent:
  - hidden: `access_key`, `subject`, `from_name`, `botcheck`
  - user: `name`, `company`, `email`, `role`, `message`
- Success state:
  - Form hidden and success box shown (`index.html:4254`)
- Error state:
  - Error box shown with fallback contact email (`index.html:4260-4262`)
- Spam/rate-limit protection:
  - Basic hidden `botcheck` honeypot now present (`index.html:4209`)
  - No CAPTCHA/Turnstile seen
- Does it expose secrets? **No high-privilege backend secret found**, but public Web3Forms access key is visible in frontend (expected pattern for this provider)
- Is it safe for production? **MVP-safe with caveats**, not enterprise-safe without stronger anti-spam and provider hardening
- Can it later trigger license key generation? **Not directly in current code**. Possible only if provider supports webhook/automation to backend

Questions for Erbol (form ops):
1. Which Web3Forms account/email currently receives submissions?
2. Is domain allowlisting enabled on Web3Forms?
3. Do you want CAPTCHA/Turnstile enabled now?
4. Do you want demo requests to auto-create license records or stay manual approval first?
5. If auto, should a middleware endpoint be introduced (`POST /api/demo/request`)?

## Phase 4 — GitHub Pages / Deployment Audit

## Deployment Status
- Current deploy target: Likely GitHub Pages (static site pattern)
- Current deploy method: Previously manual/unknown; workflow now added in repo
- Can it deploy to GitHub Pages now? **Yes** (with workflow and GitHub Pages settings enabled)
- Required fixes:
  - Enable Pages source to GitHub Actions in repo settings
  - Confirm target branch (`master`) is correct
  - Add `CNAME` if custom domain is used
- Recommended deployment option: GitHub Pages + Actions for current static scope

Why GitHub Pages alone is not enough for license generation:
- GitHub Pages is static-only hosting.
- It cannot securely issue or store license keys.
- Any direct license generation logic in frontend would be insecure and forgeable.
- Automated key issuance must run on a backend/service you control.

## Phase 5 — License Flow Readiness

Current repo fit: **Option A (Static landing + third-party form only)**
- User submits demo form via Web3Forms.
- Team follows up manually (or via external automation) with license process.

## Recommended License Request Architecture
- Recommended option: **Option A now, evolve to Option B**
- Reason:
  - Current repo is static and already integrated with a third-party form service.
  - Secure licensing automation requires server-side control.
- What can be done now:
  - Collect leads and qualify manually.
  - Optionally route Web3Forms webhook to automation (if available).
- What requires backend/license server:
  - Key generation, activation policy checks, verification and deactivation orchestration.
  - Anti-abuse/rate-limiting, IP/device heuristics, audit logs.
- What should not be done in static frontend:
  - Generating keys client-side
  - Embedding admin credentials
  - Trusting client-only validation for license state

Future integration note:
- Your app endpoints are already defined (`/api/licenses/activate`, `/verify`, `/deactivate`).
- Landing should eventually call a separate demo-request backend endpoint (e.g., `POST /api/demo/request`) that decides if/when to issue trial credentials.

## Phase 6 — Download Section Readiness

## Download Strategy
- Recommended host: **GitHub Releases** (best early-stage simplicity and versioning)
- Download URL structure:
  - `https://github.com/<org>/<desktop-repo>/releases/download/vX.Y.Z/SBFinance-Setup-x64.exe`
  - `.../SBFinance-macOS-universal.dmg`
  - `.../SBFinance-linux-x86_64.AppImage` or `.deb`
- Version metadata needed:
  - Version, build date, platform, architecture, file size, checksum, signature status
- Security/checksum recommendation:
  - Publish SHA-256 checksums per file
  - Code-sign where applicable (Windows/macOS)
- What to add to landing:
  - Real download buttons per OS
  - Release notes link
  - Checksums/signature info
  - “Latest version” label and changelog link

## Phase 7 — Product/UX Audit

Strengths:
- Clear local-first privacy messaging
- Strong section depth for features/use-cases/FAQ
- Demo form visible and easy to understand

Gaps:
- Too much copy before hard trust proof
- No pricing or access model clarity (free beta vs paid later)
- No live customer proof/testimonials/pilot logos
- No explicit data handling note near form
- No real product screenshots/download proof yet

Concrete improvements:
1. Add “How demo access works” 3-step block near CTA.
2. Add trust strip: pilot count, response SLA, support email, data policy short note.
3. Add “Product Reality” assets: 3 actual desktop screenshots.
4. Add compact “Is this for me?” ICP mini-grid above fold.
5. Add lightweight release/channel badge (Private Beta / Public Beta).

## Phase 8 — SEO / Meta / Analytics Audit

Current state:
- `title`: present
- `meta description`: present
- OpenGraph: `og:title`, `og:description`, `og:type` present
- Twitter metadata: basic tags now present
- favicon: missing
- `robots.txt`: missing
- `sitemap.xml`: missing
- canonical URL: missing
- structured data (JSON-LD): missing
- analytics: none detected
- social preview image: missing `og:image`

Recommendations:
1. Add `og:image` and `twitter:image`.
2. Add canonical URL once domain is final.
3. Add `robots.txt` and `sitemap.xml`.
4. Add optional privacy-friendly analytics (Plausible/Umami) only if needed.

## Phase 9 — Security Audit

Findings:
- No backend/API secrets found in JS.
- Public Web3Forms access key in HTML (`index.html:4206`), expected for provider but should be domain-restricted in provider settings.
- No custom backend endpoints exposed in frontend.
- No inline third-party executable scripts besides Google Fonts.
- Basic spam mitigation improved with `botcheck` honeypot, but CAPTCHA/rate controls still external.
- Legal links were previously incomplete; now resolved with placeholder pages.

Dependency/security tooling:
- `npm` present on machine, but repository has no `package.json`; no `npm audit` scope available.

## Safe Fixes Applied During Audit

1. Added deployment workflow for GitHub Pages:
   - `.github/workflows/deploy-pages.yml`
2. Added legal policy placeholder pages:
   - `terms.html`
   - `privacy-policy.html`
   - `refund-policy.html`
3. Added download section placeholder in landing:
   - `index.html:4168`
4. Removed broken placeholder footer docs link and replaced with valid links:
   - `index.html:4283-4286`
5. Added lightweight SEO metadata (`og:type`, Twitter tags, robots)
6. Added basic anti-spam honeypot field in form (`botcheck`)
7. Improved nav accessibility state handling (`aria-expanded` sync)

## Exact Questions for Erbol

1. Is the production domain confirmed as `sbfinance.me`, or another domain?
2. Should demo requests remain manual approval, or auto-issue trial licenses later?
3. Do you want Web3Forms kept as primary intake, or migrate to your own backend intake endpoint?
4. Which repository (desktop app repo) will host installer binaries/releases?
5. Do you want legal policy text finalized by counsel before launch?
6. Do you want analytics at launch (yes/no, and preferred tool)?

## Prioritized Implementation Plan

Short version:
- P0: Finish deployment hardening (domain, robots/sitemap, smoke checks)
- P1: Form reliability and anti-spam hardening
- P2: Real download publishing flow wired to release artifacts
- P3: Replace policy placeholders with reviewed legal copy
- P4: Introduce backend demo-request + license orchestration
- P5: Product polish + SEO + measured analytics

Detailed actionable plan is in:
- `docs/LANDING_NEXT_IMPLEMENTATION_PLAN.md`
