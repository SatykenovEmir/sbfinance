# SEO & Google Search Console Setup — SBFinance Landing

Operator runbook for verifying the SBFinance marketing site in Google Search Console (GSC), submitting the sitemap, and monitoring search performance over time.

- **Production domain:** https://sbfinance.me/
- **Sitemap:** https://sbfinance.me/sitemap.xml
- **Contact email:** hello@sbfinance.me
- **Hosting:** Static HTML site (plain `index.html` + a few HTML pages) deployed to GitHub Pages with a custom domain (`CNAME`).
- **Brand:** SBFinance — Local-first AI-CFO for Small Businesses. One word, "SBFinance" (note the brand-conflict warning in section 7).

Console URL: **https://search.google.com/search-console**

---

## 1. Overview & Prerequisites

You will verify ownership of the site, hand Google a sitemap, and then read the reports it produces. Verification proves to Google that you control the site; nothing in GSC works until verification succeeds.

**You need:**
- A Google account (use a shared/team account, not a personal one that could vanish — e.g. an account that also owns `hello@sbfinance.me` or a dedicated ops account).
- One of the following verification abilities:
  - **Add a DNS TXT record** for `sbfinance.me` (at your domain registrar / DNS provider). This is the most robust option for this site — see below.
  - **Commit an HTML verification file** to the GitHub Pages repo and make sure it ships in the deploy.

**Why DNS TXT is preferred here:** This is GitHub Pages with a custom domain. A **Domain property** (verified by DNS TXT) covers every protocol and subdomain variant at once — `http://`, `https://`, `www.`, and bare `sbfinance.me`. That avoids the classic GitHub Pages footgun where you accidentally verify only `https://www.` and miss the non-www URLs Google is actually indexing.

**Why HTML-file verification still works:** GitHub Pages serves whatever is in the deploy artifact. The deploy is built by `.github/workflows/deploy-pages.yml`, which only copies an explicit allowlist of files into the `site/` directory. So an HTML verification file at the repo root will **not** be served unless you add it to that allowlist (see section 2.2). This is the one extra step that makes file verification slightly more fiddly than DNS here.

---

## 2. Verifying sbfinance.me in Google Search Console

GSC has two property types. Set up the **Domain property** as your primary; optionally add a URL-prefix property if you want HTML-file verification as a backup.

| | Domain property | URL-prefix property |
|---|---|---|
| Verification | DNS TXT record | HTML file (also: HTML tag, GA, Tag Manager) |
| Coverage | http + https + www + non-www, all paths | Exactly one origin (e.g. only `https://sbfinance.me/`) |
| Best for | Canonical, complete picture | Quick start, or per-origin reports |
| Recommended | **Yes — primary** | Optional backup |

### 2.1 Domain property via DNS TXT (recommended)

1. Go to **https://search.google.com/search-console** and sign in.
2. Click the property dropdown (top-left) → **Add property**.
3. Choose the **Domain** box (left side). Enter `sbfinance.me` (no `https://`, no `www`).
4. Google shows a **TXT record** value, e.g. `google-site-verification=XXXXXXXX`. Copy the exact value Google gives you — do not reuse one from anywhere else.
5. In your DNS provider, add a record:
   - **Type:** `TXT`
   - **Name/Host:** `@` (or blank, meaning the apex `sbfinance.me`)
   - **Value:** the `google-site-verification=...` string from step 4.
6. Save. DNS can take minutes to a few hours to propagate. You can sanity-check from a terminal:
   ```
   dig TXT sbfinance.me +short
   ```
   You should see the `google-site-verification=...` string in the output.
7. Back in GSC, click **Verify**. If it fails, wait for propagation and retry — the record is real even if Google hasn't seen it yet.
8. **Keep the TXT record forever.** If you delete it, Google eventually un-verifies the property.

### 2.2 URL-prefix property via HTML file (optional backup)

1. In GSC → **Add property** → **URL prefix** box. Enter the exact origin: `https://sbfinance.me/`.
2. Choose the **HTML file** verification method. Download the file Google provides (named like `googXXXXXXXX.html`).
3. Commit that file to the **root** of the GitHub Pages repo.
4. **Critical:** add the filename to the deploy allowlist so it actually ships. In `.github/workflows/deploy-pages.yml`, the "Build static site artifact" step copies a fixed list of files. Add your verification file to that `for file in ...` list, for example:
   ```
   for file in sample-report.html terms.html privacy-policy.html refund-policy.html CNAME robots.txt sitemap.xml favicon.ico googXXXXXXXX.html; do
   ```
5. Commit and push so the deploy runs. Confirm the file is live:
   ```
   curl -I https://sbfinance.me/googXXXXXXXX.html
   ```
   You want `HTTP/2 200`.
6. In GSC, click **Verify**.
7. Leave the file in place permanently; removing it un-verifies the property.

> Trade-off summary: Domain property is more complete and survives URL changes. The URL-prefix property is handy as a redundant verification path and lets you scope some reports to one exact origin, but it only sees the one origin you entered. If you only do one, do the Domain property.

---

## 3. Submitting the Sitemap

The site already publishes a sitemap at **https://sbfinance.me/sitemap.xml** (built and shipped by the deploy workflow). It currently lists the homepage and the sample-report, terms, privacy, and refund pages. Google can find it via `robots.txt`, but submit it explicitly so you get a status report.

1. In GSC, select the `sbfinance.me` property.
2. Left sidebar → **Sitemaps** (under "Indexing").
3. In **Add a new sitemap**, enter `sitemap.xml` (the field already prefixes the domain) and click **Submit**.
4. The row will show a **Status**. Healthy values: **Success** with a "Discovered URLs" count matching the number of `<loc>` entries (currently 5).
5. Click the sitemap row to see per-sitemap details and any parse errors.

**Confirming it was actually read:** "Success" plus a "Last read" date in the past day or two means Google fetched and parsed it. If you see "Couldn't fetch," re-check that `https://sbfinance.me/sitemap.xml` returns `200` and valid XML (`curl https://sbfinance.me/sitemap.xml`). Re-submit whenever you add new pages — and keep `sitemap.xml` in sync with the actual pages you ship.

---

## 4. URL Inspection & Requesting Indexing

Use this to check a single URL's status and nudge Google to (re)crawl it.

1. Click the **search bar at the very top** of GSC (it says "Inspect any URL in ...").
2. Paste the homepage: `https://sbfinance.me/`. Press Enter.
3. Read the verdict:
   - **URL is on Google** — indexed and eligible to appear in results.
   - **URL is on Google, but has issues** — indexed, but with enhancement/coverage warnings worth reading.
   - **URL is not on Google** — not indexed yet. Expand "Page indexing" to see why (e.g. "Discovered – currently not indexed", "Crawled – currently not indexed").
4. To force a fresh look, click **Request indexing**. This queues the URL for crawl; it is a request, not a guarantee, and there's a daily quota. Do it after meaningful content changes, not repeatedly.
5. Use **Test live URL** (top-right of the inspection panel) to see how Googlebot renders the page *right now*, separate from the last indexed version. Useful for confirming a fix is live before requesting indexing.

**Interpreting the common states:**
- **Crawled – currently not indexed:** Google fetched the page but chose not to index it (often thin content or low perceived value). Improve the page; don't just re-request.
- **Discovered – currently not indexed:** Google knows the URL exists but hasn't crawled it yet. Usually resolves with time and a submitted sitemap.
- **Indexed:** done — it can rank.

Inspect each important page after major changes: `/`, `/sample-report.html`, and the policy pages.

---

## 5. Core Web Vitals Report

Tracks real-user load experience. Find it: left sidebar → **Core Web Vitals** (under "Experience").

**Thresholds (the "Good" bar):**
| Metric | Meaning | "Good" |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Time to render the main content | **≤ 2.5 s** |
| **INP** (Interaction to Next Paint) | Responsiveness to user input | **≤ 200 ms** |
| **CLS** (Cumulative Layout Shift) | Visual stability (no jumping layout) | **≤ 0.1** |

How to use it:
1. Open the report; review the **Mobile** and **Desktop** tabs separately. Mobile is usually the harder bar and what Google weights most.
2. URLs are grouped as **Good / Needs improvement / Poor**. Click a status to see affected URL groups.

**Honesty note:** This report uses **field data** (CrUX — real Chrome users). A brand-new or low-traffic site will show **"No data"** or sparse data until enough real visitors hit the pages. The field window is a **rolling ~28 days**, so changes you ship today won't fully reflect for up to about a month. Until then, use **lab tools** for guidance: PageSpeed Insights (https://pagespeed.web.dev/) and Lighthouse. For a static HTML site like this one, hitting "Good" is very achievable — watch for oversized images and any layout shift from late-loading fonts or the QR/sample-report assets.

---

## 6. Performance Report

The core of day-to-day monitoring. Left sidebar → **Performance** → **Search results**.

**The four metrics (top of the report, toggle each on):**
- **Total clicks** — visits from Google search.
- **Total impressions** — times a site URL appeared in results.
- **Average CTR** — clicks ÷ impressions.
- **Average position** — mean ranking of your URLs for the queries shown (lower is better; 1.0 is the top).

**How to filter (tabs below the chart + the "+ New" filter at the top):**
- **Queries** tab — what people searched. This is your keyword reality check.
- **Pages** tab — which URLs got the impressions/clicks.
- **Countries / Devices** tabs — segment by geography and mobile vs desktop.
- **Search appearance** — special result types (if any structured data applies).
- **Date** (top filter) — compare ranges (e.g. "Compare last 28 days to previous period").
- Click **+ New** to filter by a specific query string, page, country, etc.

Default view is 3 months; widen the date range for trend reading. Enable all four metric toggles at once so you can see, for example, rising impressions but flat clicks (a CTR or positioning problem).

---

## 7. Branded Query Conflict Monitoring

**There is an unrelated company also called "SB Finance" (two words).** Our brand is one word — **SBFinance**. Users (and Google) may conflate them, so monitor branded queries deliberately.

**How to watch it:**
1. Go to **Performance → Search results → Queries** tab.
2. Click **+ New → Query → Custom (regex)** and use a pattern that catches both spellings, e.g.:
   ```
   (?i)sb ?finance
   ```
   (`(?i)` = case-insensitive; `?` makes the space optional, so it matches both "sbfinance" and "sb finance").
3. Alternatively add two separate filters — one **Query containing** `sbfinance`, one **Query containing** `sb finance` — and compare their clicks/impressions/position side by side over the same date range.

**What a healthy pattern looks like:**
- Your own pages rank #1–#3 for both "sbfinance" and "sb finance".
- The one-word "sbfinance" queries dominate your branded traffic and convert (good CTR).
- "SBFinance" + product terms (e.g. "sbfinance ai cfo") appear and point to your URLs.

**What a confused/at-risk pattern looks like:**
- High impressions but **poor average position** on "sb finance" — the other company is outranking you there.
- People search "sbfinance" but land on competitor or disambiguation results (low CTR despite impressions).
- Branded queries with mismatched intent (e.g. banking/loan terms) showing up — that's the other "SB Finance" bleeding into your data.

**Response levers (outside GSC, but informed by it):** keep the one-word "SBFinance" spelling consistent across title tags, the `<h1>`, and Open Graph metadata; reinforce the full positioning ("SBFinance — Local-first AI-CFO for Small Businesses") so Google learns the distinct entity; build the entity with consistent NAP/about info. Do **not** try to trick Google (see section 10).

---

## 8. Recommended Target Queries to Track

These are high-intent, long-tail queries aligned with the product. Add each as a **Query containing** filter under **Performance → Queries**, or check whether you're even appearing for them yet (often you'll have zero impressions early — that itself is the signal of where to create/strengthen content).

- AI CFO for small businesses
- local-first AI financial analyst
- financial analysis software for SMBs
- CSV XLSX financial analysis tool
- cash gap forecast software
- financial leak detection software
- AI financial dashboard for founders
- private/local finance analysis tool
- Excel alternative for financial reporting
- AI tool for accounting firms

For each, watch the progression: **impressions appear → average position improves → CTR rises → clicks arrive.** Track them monthly; the long-tail ones are where a small static site can realistically win.

---

## 9. Optional: Bing Webmaster Tools

Bing also powers DuckDuckGo and some AI search surfaces, so it's worth claiming. It's quick.

- URL: **https://www.bing.com/webmasters**
- Easiest path: **Import from Google Search Console** (Bing offers a one-click import once your GSC property is verified) — no separate DNS/file step needed.
- Otherwise verify via DNS TXT, an XML file, or a meta tag (same pattern as section 2; if you use a file, add it to the deploy allowlist as in 2.2).
- After verifying, submit the same sitemap: `https://sbfinance.me/sitemap.xml`.

**Value:** a second source of search-query and crawl data for near-zero effort, plus coverage of the non-Google audience. Treat GSC as primary and Bing as a cross-check.

---

## 10. What NOT to Do (Honest Guardrails)

These tank rankings or get the site penalized. The product's whole pitch is trust and "local-first / private" — don't undermine that with spammy SEO.

- **No fake or paid backlinks / link schemes.** No buying links, link farms, or reciprocal-link rings. Earn links with real content and real product value.
- **No keyword stuffing.** Don't cram "AI CFO small business financial analysis software" repeatedly into pages or hide text. Write for humans.
- **No AI-generated spam/doorway pages.** Don't mass-produce thin pages targeting query variants. One genuinely useful page beats fifty empty ones — and matches what Google's helpful-content systems reward.
- **No cloaking.** Don't show Googlebot different content than real users. Easy to do accidentally with overly clever rendering — keep the static HTML honest.
- **No fake structured data.** If you add JSON-LD/schema later, only mark up content that is actually visible on the page. Fake reviews, fake ratings, or fake org data risk manual actions. Validate with the Rich Results Test.
- **No fake verification codes or screenshots** in this doc or anywhere — always use the real values Google generates for *this* property.

---

## 11. 30 / 60 / 90-Day Monitoring Cadence

**Day 0 (setup):** Verify Domain property (§2.1), submit sitemap (§3), inspect + request indexing on `/` and `/sample-report.html` (§4), optionally claim Bing (§9).

**By Day 30:**
- [ ] Sitemap status = **Success**, all 5 URLs discovered (§3).
- [ ] Homepage shows **"URL is on Google"** in URL Inspection (§4).
- [ ] Confirm key pages are indexed (Pages report under Indexing → "Why pages aren't indexed").
- [ ] Performance report has data flowing; note baseline impressions/clicks/avg position (§6).
- [ ] Set up the branded-query regex filter and record a baseline for "sbfinance" vs "sb finance" (§7).
- [ ] Check Core Web Vitals — expect "No/low data" this early; cross-check with PageSpeed Insights (§5).

**By Day 60:**
- [ ] Review which of the §8 target queries you're appearing for; note gaps.
- [ ] Compare last 28 days vs previous period in Performance (§6) — direction of impressions and position.
- [ ] Branded conflict check: is "sb finance" being outranked by the other company? Note position trend (§7).
- [ ] Core Web Vitals should start showing field data if traffic exists; address any "Poor" URL group (§5).
- [ ] Fix any new "Crawled/Discovered – currently not indexed" pages (§4).

**By Day 90:**
- [ ] Trend review: 90-day impressions, clicks, CTR, average position (§6).
- [ ] Branded health verdict: are you #1 for "sbfinance"? Is "sb finance" confusion improving or worsening (§7)?
- [ ] Re-evaluate the §8 target-query list — drop ones with no traction, double down on ones gaining position; plan content for high-impression / low-position queries.
- [ ] Confirm Core Web Vitals are "Good" on mobile and desktop, or open a perf task (§5).
- [ ] Re-submit sitemap if pages changed; re-inspect any new/updated URLs (§3, §4).
- [ ] Confirm DNS TXT (and any HTML verification file) are still present so the property stays verified (§2).

**Ongoing:** glance at Performance weekly, do the full checklist monthly, and watch the **Manual actions** and **Security issues** reports (left sidebar) — both should always read "No issues detected."
