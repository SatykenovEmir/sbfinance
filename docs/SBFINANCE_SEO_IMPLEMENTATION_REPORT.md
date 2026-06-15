# SBFinance Landing — SEO Implementation Report

**Date:** 2026-06-15
**Scope:** Technical + on-page SEO for the static landing site (`sbfinance_landing/`, deployed to GitHub Pages at https://sbfinance.me/).
**Method:** Best-practice technical SEO only. No guarantees of ranking position were made or implied — SEO cannot promise #1. The goal was crawlability, correct metadata, valid structured data, helpful first-hand content, and measurability.

---

## 1. Summary of what changed

The site was already in good shape (canonical, OG/Twitter tags, favicons, single H1, a 15-item FAQ, accessibility scaffolding). This pass closed the remaining gaps and fixed two correctness issues that could have hurt us:

- **Fixed a Google-policy risk:** the FAQ structured data listed only 5 Q&As and included one question (*"How much does SBFinance cost?"*) that **was not visible on the page**. FAQ schema must mirror visible content — replaced with all **15 visible** Q&As verbatim.
- **Removed invented pricing from structured data:** the old `SoftwareApplication` JSON-LD declared `Offer` `price: 0`. The product is private beta with no public pricing, so per the rules this `Offer` was removed (no invented price).
- **Strengthened metadata:** keyword-aligned `<title>`/description, `theme-color`, `og:locale`, `twitter:image:alt`, `max-image-preview:large` robots directive, web app manifest, and a `fonts.gstatic.com` preconnect.
- **Added missing structured data:** standalone `Organization` + `WebSite` (joined to the existing `SoftwareApplication` via a single `@graph`).
- **Hybrid H1** that keeps the committed cash-gap wedge while front-loading the target search phrase (your decision).
- **Canonical tags** added to the three policy pages (they were in the sitemap without canonicals).
- **Sitemap** now carries `lastmod`/`changefreq`/`priority`; **manifest** added to the deploy allowlist so it actually ships.
- **Added a zero-dependency SEO validation script + CI workflow** so these gains don't silently regress.

A homepage H1/positioning decision and the scope of new pages were confirmed with you before implementing (see §8).

---

## 2. Baseline (Phase 0)

**Framework:** None — hand-authored static HTML. `index.html` (~5,000 lines, inline `<style>`), plus `sample-report.html`, `privacy-policy.html`, `terms.html`, `refund-policy.html`.
**Deploy:** GitHub Pages via `.github/workflows/deploy-pages.yml` on push to `master`. The build copies an **explicit allowlist** of files + directories — anything not listed does not deploy.
**Domain:** `sbfinance.me` (via `CNAME`).

| Area | Baseline state |
|---|---|
| Title / description / canonical / robots / viewport | ✅ Present on homepage |
| OG + Twitter tags, favicons (ico/svg/32/apple-touch), OG image 1200×630 | ✅ Present |
| `font-display: swap`, skip-link, focus-visible, reduced-motion, WCAG-AA contrast notes | ✅ Already implemented |
| Single H1, logical H2s, semantic sections, `<button>` for FAQ, real `<a>` nav | ✅ Already correct |
| robots.txt + sitemap.xml | ✅ Present but minimal (no `lastmod`) |
| `theme-color`, `og:locale`, manifest | ❌ Missing |
| `Organization` + `WebSite` JSON-LD | ❌ Missing (only `SoftwareApplication` + `FAQPage`) |
| FAQ schema vs visible FAQ | ⚠️ Mismatch (5 vs 15; one question not on page) |
| Structured-data pricing | ⚠️ Invented `Offer price: 0` |
| Canonicals on policy pages | ❌ Missing |
| Brand casing | ⚠️ 4× `SBfinance` (should be `SBFinance`) |

**Crawl/index risk:** low — site is fully static, no JS-rendered content, robots allows all.
**Brand-conflict risk:** an unrelated "SB Finance" exists; we standardized on one word, "SBFinance", and lead with long-tail intent (see §3).

---

## 3. Target keywords

Primary: **local-first AI-CFO for small businesses**.

Secondary / long-tail (mapped to existing on-page copy): cash-gap forecast from CSV/XLSX, financial leak detection, AI-CFO dashboard, decision simulator, grounded finance chat, executive PDF reports, private/local financial analysis, Excel alternative for financial reporting, financial analysis software for SMBs, AI tool for accounting firms.

We deliberately **do not** chase the broad ambiguous term "SB Finance" (brand conflict). Keyword tracking targets are listed in `SEO_SEARCH_CONSOLE_SETUP.md` §8.

---

## 4. Files changed

| File | Change |
|---|---|
| `index.html` | Title (+ "Local-First"); refined meta description; `theme-color`; `color-scheme`; `robots` → `max-image-preview:large,max-snippet:-1,...`; `og:locale`, `twitter:image:alt`; manifest link; `fonts.gstatic.com` preconnect; **hybrid H1**; hero tag + subheading keywords; brand casing `SBfinance`→`SBFinance` (×4); JSON-LD reworked to `@graph` (Organization + WebSite + SoftwareApplication, **Offer/price removed**); FAQ JSON-LD expanded **5 → 15** to mirror visible FAQ |
| `privacy-policy.html`, `terms.html`, `refund-policy.html` | Added `canonical`, `robots`, `theme-color` |
| `sitemap.xml` | Added `lastmod` / `changefreq` / `priority` to all 5 URLs |
| `.github/workflows/deploy-pages.yml` | Added `site.webmanifest` to the deploy allowlist |
| `site.webmanifest` *(new)* | Web app manifest with accurate icon sizes (32, 180, scalable SVG), theme/background `#05050a` |
| `scripts/seo-check.mjs` *(new)* | Zero-dependency Node validator (55 checks) |
| `.github/workflows/seo-check.yml` *(new)* | CI job running the validator on push/PR (does not gate deploy) |
| `docs/SBFINANCE_SEO_IMPLEMENTATION_REPORT.md` *(new)* | This report |
| `docs/SBFINANCE_SEO_CONTENT_ROADMAP.md` *(new)* | 10 article ideas + 5 deferred landing-page specs + priorities |
| `docs/SEO_SEARCH_CONSOLE_SETUP.md` *(new)* | GSC verification, sitemap submission, monitoring runbook |

---

## 5. Structured data (JSON-LD)

Block 1 — `@graph`:
- **Organization** (`#organization`): name, url, logo (`apple-touch-icon.png`, 180×180 ≥ Google's 112px min), email `hello@sbfinance.me`, description.
- **WebSite** (`#website`): name, url, `inLanguage: en`, `publisher` → Organization. *(No `SearchAction` — the site has no search; not invented.)*
- **SoftwareApplication** (`#software`): `applicationCategory: FinanceApplication`, `operatingSystem: "Windows, Linux"` (matches the actual download buttons), description, `softwareVersion: "Private beta"`, `publisher` → Organization. **No `Offer`/price, no `aggregateRating`/`review`** (nothing fake).

Block 2 — **FAQPage**: all 15 visible Q&As, text matching the on-page FAQ.

All blocks validated as parseable JSON by `scripts/seo-check.mjs`. For Rich Results, also paste the live URL into https://search.google.com/test/rich-results after deploy (requires the public URL — can't be done from code alone).

---

## 6. robots.txt / sitemap / canonicalization

- **robots.txt:** already correct (`Allow: /` + `Sitemap:` line). No private/admin paths exist; the local `.pptx/.pdf/.docx` are git-ignored and never deployed, so no disallow needed. Left as-is.
- **sitemap.xml:** 5 public URLs, absolute `https://sbfinance.me`, now with `lastmod`. The validator asserts every `<loc>` maps to a real local file that the deploy step ships.
- **Canonical:** homepage → `https://sbfinance.me/`; each policy page → its own URL; `sample-report.html` already had one.
- **Host canonicalization (http/www):** GitHub Pages with a custom domain serves HTTPS and redirects the `www`/apex correctly when "Enforce HTTPS" is enabled in repo settings — **verify this is on** (manual, §8). There is no app server to add redirect rules to.

---

## 7. Performance / Core Web Vitals notes

This is a single static HTML file with **inline CSS** (no render-blocking stylesheet request) and a **text LCP** (the hero H1) — a naturally fast profile. Changes/observations:

- Added `preconnect` to `fonts.gstatic.com` (the actual font-file origin) alongside the existing `fonts.googleapis.com` — speeds first font fetch.
- Fonts already load with `&display=swap` (no invisible-text FOIT).
- No `<img>` elements on the homepage (icons are inline SVG sprites with `aria-hidden`), so there is **no unsized-image CLS risk** on the homepage and no image lazy-load work needed.
- Hero animations use `opacity`/`transform` only (compositor-friendly, no layout shift) and are disabled under `prefers-reduced-motion`.

**Not done (and why):** no Lighthouse/Playwright dependencies were added — the rules said avoid heavy deps without justification, and there is no bundler here. Run Lighthouse manually (Chrome DevTools → Lighthouse, or `npx lighthouse https://sbfinance.me --view`) post-deploy for field-accurate LCP/INP/CLS. The one self-host opportunity (Google Fonts → local `woff2`) is documented as an optional follow-up; the product app already self-hosts fonts, so the assets exist if you want to.

---

## 8. Decisions you confirmed

1. **Homepage H1 → "Hybrid":** kept the committed cash-gap wedge while front-loading the keyword. New H1: *"The local-first AI-CFO that finds cash gaps before they hit."* (Your saved positioning deliberately avoids leading with "AI-CFO" alone; the hybrid satisfies both SEO and the wedge.)
2. **New programmatic pages → "Deferred":** all homepage + technical SEO shipped now; the 5 use-case/feature pages are **fully spec'd** (route, H1, title, meta, unique content blocks) in `SBFINANCE_SEO_CONTENT_ROADMAP.md` to build later as genuinely useful pages — avoiding thin/duplicate content.

---

## 9. Remaining manual steps (cannot be done from code)

1. **Deploy:** commit + push to `master` (the landing repo is its own git repo). Confirm the GitHub Pages "SEO checks" and "Deploy" actions go green.
2. **Verify Enforce HTTPS** is enabled in the landing repo's GitHub Pages settings (handles http→https + apex/www canonicalization).
3. **Google Search Console:** verify `sbfinance.me`, submit `https://sbfinance.me/sitemap.xml`, request indexing of `/`. Full runbook in `SEO_SEARCH_CONSOLE_SETUP.md`.
4. **Rich Results Test** + **Schema Markup Validator** on the live URL after deploy.
5. **Lighthouse** run on the live URL for real CWV numbers.
6. **(Optional) Build the 5 deferred pages** from the roadmap — remember to add each to `sitemap.xml` **and** the deploy allowlist.
7. **(Optional) `#cash-gap` anchor:** the roadmap links to `#cash-gap`, which doesn't exist yet. Add `id="cash-gap"` to the relevant homepage section before using that internal link, or relink to `#features`/`#risk`. (Existing real anchors: `#hero #pipeline #privacy #features #chat-demo #risk #who #comparison #team #faq #downloads #cta`.)

---

## 10. What to monitor (30 / 60 / 90 days)

- **30 days:** indexing status (Pages report), sitemap "Success", impressions starting on branded + long-tail queries, Rich Results / FAQ eligibility. Watch the **"SBFinance" vs "SB Finance"** query split for brand confusion.
- **60 days:** average position + CTR on the target queries; identify which long-tail terms get impressions but low clicks (title/description tuning candidates). Decide which 2–3 roadmap pages to build based on real query demand.
- **90 days:** Core Web Vitals field data (needs traffic to populate); first content pieces / landing pages live and indexed; refine internal linking toward the pages earning impressions.

---

## 11. Honest limitations

- **No ranking guarantee.** This is technical readiness + helpful content structure. Rankings depend on competition, authority/backlinks, and ongoing content — none of which can be fabricated (and we didn't: no fake reviews, logos, ratings, backlinks, or schema).
- **Field CWV, Rich Results eligibility, and indexing** can only be confirmed on the live URL post-deploy — not from the repo.
- The **224-char meta description** will be truncated in SERP (~155–160 chars shown); keywords are front-loaded so the visible portion is strong. Tighten later if you prefer.
