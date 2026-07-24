#!/usr/bin/env node
/**
 * seo-check.mjs — zero-dependency SEO sanity checks for the SBFinance landing site.
 *
 * Validates the static site BEFORE deploy so regressions (missing title, broken
 * JSON-LD, FAQ schema drifting from visible content, un-deployed assets) are caught
 * in CI instead of in production. No npm install required — pure Node + fs.
 *
 * Run:  node scripts/seo-check.mjs
 * Exit: 0 = all checks pass, 1 = one or more failures.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE_ORIGIN = 'https://sbfinance.me';

let passed = 0;
let failed = 0;
const fails = [];

function ok(msg) {
  passed++;
  console.log(`  ✓ ${msg}`);
}
function bad(msg) {
  failed++;
  fails.push(msg);
  console.log(`  ✗ ${msg}`);
}
function check(cond, label) {
  cond ? ok(label) : bad(label);
}
function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks;
}

// --- Homepage ---------------------------------------------------------------
console.log('\nindex.html');
const html = read('index.html');

const titles = html.match(/<title>([\s\S]*?)<\/title>/gi) || [];
check(titles.length === 1, 'exactly one <title>');
const titleText = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
check(titleText.trim().length >= 10 && titleText.length <= 70,
  `<title> length sane (${titleText.trim().length} chars): "${titleText.trim()}"`);

const descM = html.match(/<meta\s+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
check(!!descM, 'meta description present');
if (descM) {
  const len = descM[1].trim().length;
  check(len >= 50 && len <= 320, `meta description length reasonable (${len} chars)`);
}

check(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/sbfinance\.me\/["']/i.test(html),
  'canonical points to https://sbfinance.me/');
check(/<meta\s+name=["']robots["']/i.test(html), 'meta robots present');
check(/<meta\s+name=["']theme-color["']/i.test(html), 'theme-color present');
check(/<meta\s+name=["']viewport["']/i.test(html), 'viewport present');
check(/<html\s+lang=["'][a-z-]+["']/i.test(html), 'html lang attribute present');

// Social
check(/<meta\s+property=["']og:title["']/i.test(html), 'og:title present');
check(/<meta\s+property=["']og:image["']/i.test(html), 'og:image present');
check(/<meta\s+property=["']og:url["']/i.test(html), 'og:url present');
check(/<meta\s+name=["']twitter:card["']/i.test(html), 'twitter:card present');
check(/<link\s+rel=["']manifest["']/i.test(html), 'web manifest linked');

// Exactly one H1
const h1count = (html.match(/<h1[\s>]/gi) || []).length;
check(h1count === 1, `exactly one <h1> (found ${h1count})`);

// JSON-LD parses + has the expected types
const ld = extractJsonLd(html);
check(ld.length >= 2, `found ${ld.length} JSON-LD block(s)`);
let faqEntityCount = 0;
const seenTypes = new Set();
ld.forEach((raw, i) => {
  try {
    const data = JSON.parse(raw);
    ok(`JSON-LD block #${i + 1} parses as valid JSON`);
    const nodes = data['@graph'] || [data];
    for (const n of nodes) {
      const t = Array.isArray(n['@type']) ? n['@type'].join(',') : n['@type'];
      if (t) seenTypes.add(t);
      if (t === 'FAQPage' && Array.isArray(n.mainEntity)) faqEntityCount = n.mainEntity.length;
    }
  } catch (e) {
    bad(`JSON-LD block #${i + 1} is INVALID JSON: ${e.message}`);
  }
});
['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage'].forEach((t) =>
  check(seenTypes.has(t), `JSON-LD includes ${t}`));

// FAQ schema must mirror visible FAQ count (Google policy: match visible content)
const visibleFaqCount = (html.match(/class=["']faq-btn["']/g) || []).length;
check(visibleFaqCount > 0, `visible FAQ items found (${visibleFaqCount})`);
check(faqEntityCount === visibleFaqCount,
  `FAQPage schema entries (${faqEntityCount}) match visible FAQ items (${visibleFaqCount})`);

// No invented price in structured data (private beta, no public pricing)
check(!/"@type"\s*:\s*"Offer"[\s\S]*?"price"/i.test(html),
  'no invented Offer/price in structured data');

// --- robots.txt -------------------------------------------------------------
console.log('\nrobots.txt');
check(existsSync(join(ROOT, 'robots.txt')), 'robots.txt exists');
if (existsSync(join(ROOT, 'robots.txt'))) {
  const robots = read('robots.txt');
  check(/sitemap:\s*https:\/\/sbfinance\.me\/sitemap\.xml/i.test(robots),
    'robots.txt references the sitemap');
}

// --- sitemap.xml ------------------------------------------------------------
console.log('\nsitemap.xml');
check(existsSync(join(ROOT, 'sitemap.xml')), 'sitemap.xml exists');
const sitemap = read('sitemap.xml');
check(/<urlset[\s>]/i.test(sitemap), 'sitemap has <urlset>');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
check(locs.length > 0, `sitemap has ${locs.length} URL(s)`);
check(locs.every((u) => u.startsWith(SITE_ORIGIN)),
  'all sitemap URLs are absolute https://sbfinance.me URLs');
// Each sitemap URL resolves to a local file that will be deployed
for (const u of locs) {
  const path = u.replace(SITE_ORIGIN, '').replace(/^\//, '');
  const file = path === '' ? 'index.html' : path;
  check(existsSync(join(ROOT, file)), `sitemap URL has a local file: ${file || 'index.html'}`);
}

// --- web manifest -----------------------------------------------------------
console.log('\nsite.webmanifest');
check(existsSync(join(ROOT, 'site.webmanifest')), 'site.webmanifest exists');
if (existsSync(join(ROOT, 'site.webmanifest'))) {
  try {
    JSON.parse(read('site.webmanifest'));
    ok('site.webmanifest is valid JSON');
  } catch (e) {
    bad(`site.webmanifest invalid JSON: ${e.message}`);
  }
}

function canonicalOk(p, url) {
  const esc = url.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  return new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${esc}["']`, 'i').test(p);
}

// --- secondary pages (full pages keep their own .html canonical) ------------
console.log('\nsecondary pages');
for (const [page, canonical] of [
  ['privacy-policy.html', `${SITE_ORIGIN}/privacy-policy.html`],
  ['terms.html', `${SITE_ORIGIN}/terms.html`],
  ['refund-policy.html', `${SITE_ORIGIN}/refund-policy.html`],
  ['sample-report.html', `${SITE_ORIGIN}/sample-report.html`],
]) {
  const p = read(page);
  check(/<title>[\s\S]*?<\/title>/i.test(p), `${page}: has <title>`);
  check(/<meta\s+name=["']description["']/i.test(p), `${page}: has meta description`);
  check(canonicalOk(p, canonical), `${page}: canonical is correct`);
}

// --- clean-route pages (directory-index; extensionless canonical) -----------
console.log('\nclean routes');
for (const [file, canonical] of [
  ['protection-gap/index.html', `${SITE_ORIGIN}/protection-gap`],
  ['protection-gap/demo/index.html', `${SITE_ORIGIN}/protection-gap/demo`],
  ['sample-protection-report/index.html', `${SITE_ORIGIN}/sample-protection-report`],
]) {
  check(existsSync(join(ROOT, file)), `${file} exists`);
  const p = read(file);
  check(/<title>[\s\S]*?<\/title>/i.test(p), `${file}: has <title>`);
  check(/<meta\s+name=["']description["']/i.test(p), `${file}: has meta description`);
  check(canonicalOk(p, canonical), `${file}: canonical is ${canonical}`);
}
check(existsSync(join(ROOT, 'protection-gap/demo/data/protection-demo-fixture.json')),
  'browser-demo fixture JSON exists');

// --- redirect stubs (old / clean URLs → destination) ------------------------
console.log('\nredirect stubs');
for (const stub of ['privacy/index.html', 'terms/index.html']) {
  const p = read(stub);
  check(/<title>[\s\S]*?<\/title>/i.test(p), `${stub}: has <title>`);
  check(/http-equiv=["']refresh["']/i.test(p), `${stub}: is a redirect`);
}

// --- deploy allowlist guard -------------------------------------------------
console.log('\ndeploy workflow');
const wf = read('.github/workflows/deploy-pages.yml');
for (const f of ['index.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'CNAME']) {
  check(wf.includes(f), `deploy workflow copies ${f}`);
}
for (const d of ['protection-gap', 'sample-protection-report', 'privacy', 'terms']) {
  check(wf.includes(d), `deploy workflow copies ${d}/ directory`);
}

// --- summary ----------------------------------------------------------------
console.log(`\n${'-'.repeat(48)}`);
console.log(`SEO check: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFailures:');
  fails.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
console.log('All SEO checks passed.');
