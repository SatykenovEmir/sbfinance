#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ignoredDirectories = new Set(['.git', 'node_modules', 'test-results', 'playwright-report']);
const ignoredExtensions = new Set([
  '.docx', '.exe', '.gif', '.ico', '.jpeg', '.jpg', '.pdf', '.png', '.pptx', '.webp', '.zip',
]);
const patterns = [
  ['private key', /-----BEGIN (?:RSA|EC|OPENSSH|DSA) PRIVATE KEY-----/],
  ['AWS access key', /AKIA[0-9A-Z]{16}/],
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{30,}/],
  ['OpenAI-style key', /sk-[A-Za-z0-9]{20,}/],
  ['Google API key', /AIza[0-9A-Za-z_-]{30,}/],
];

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : filesIn(join(directory, entry.name));
    }
    return entry.isFile() ? [join(directory, entry.name)] : [];
  });
}

const findings = [];
for (const file of filesIn(ROOT)) {
  if (ignoredExtensions.has(extname(file).toLowerCase()) || statSync(file).size > 1024 * 1024) continue;
  const content = readFileSync(file, 'utf8');
  for (const [name, pattern] of patterns) {
    if (pattern.test(content)) findings.push(`${relative(ROOT, file)}: ${name}`);
  }
}

if (findings.length) {
  console.error('Potential secrets found (values suppressed):');
  findings.forEach((finding) => console.error(`  - ${finding}`));
  process.exit(1);
}

console.log('Secret check: no high-confidence credential patterns found.');
