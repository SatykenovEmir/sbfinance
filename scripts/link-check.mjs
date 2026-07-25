#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = 'https://sbfinance.me';
const pages = new Map([
  ['/', 'index.html'],
  ['/privacy-policy.html', 'privacy-policy.html'],
  ['/terms.html', 'terms.html'],
  ['/refund-policy.html', 'refund-policy.html'],
  ['/sample-report.html', 'sample-report.html'],
  ['/protection-gap/', 'protection-gap/index.html'],
  ['/protection-gap/demo/', 'protection-gap/demo/index.html'],
  ['/sample-protection-report/', 'sample-protection-report/index.html'],
  ['/privacy/', 'privacy/index.html'],
  ['/terms/', 'terms/index.html'],
]);

let passed = 0;
let failed = 0;
const failures = [];
const checked = new Set();

function normalizePath(pathname) {
  if (pages.has(pathname)) return pathname;
  if (!pathname.endsWith('/') && pages.has(`${pathname}/`)) return `${pathname}/`;
  return pathname;
}

function check(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.log(`  ✗ ${message}`);
  }
}

for (const [route, file] of pages) {
  const html = readFileSync(join(ROOT, file), 'utf8');
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const resolved = new URL(href, `${ORIGIN}${route}`);
    if (resolved.origin !== ORIGIN) continue;
    const pathname = normalizePath(resolved.pathname);
    const key = `${pathname}${resolved.hash}`;
    if (checked.has(key)) continue;
    checked.add(key);

    const targetFile = pages.get(pathname);
    check(Boolean(targetFile) && existsSync(join(ROOT, targetFile)),
      `${href} resolves to a deployed local page`);
    if (!targetFile || !resolved.hash) continue;

    const target = readFileSync(join(ROOT, targetFile), 'utf8');
    const id = decodeURIComponent(resolved.hash.slice(1));
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    check(new RegExp(`\\sid=["']${escaped}["']`, 'i').test(target),
      `${href} resolves to an existing anchor`);
  }
}

console.log(`\nLink check: ${passed} passed, ${failed} failed`);
if (failed) {
  console.log('\nFailures:');
  failures.forEach((failure) => console.log(`  - ${failure}`));
  process.exit(1);
}
