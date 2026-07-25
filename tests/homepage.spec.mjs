import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const expectedH1 = 'Know your cash-flow risks and protection gaps before a loss hits.';

async function stabilizeExternalRequests(page) {
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({
    status: 200,
    contentType: 'text/css',
    body: '',
  }));
  await page.route('https://api.github.com/repos/SatykenovEmir/sbfinance/releases/latest', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      tag_name: 'desktop-v0.1.4',
      html_url: 'https://github.com/SatykenovEmir/sbfinance/releases/tag/desktop-v0.1.4',
      published_at: '2026-06-15T12:39:52Z',
      assets: [],
    }),
  }));
}

test.beforeEach(async ({ page }) => {
  await stabilizeExternalRequests(page);
});

test('homepage leads with protection positioning and retains AI-CFO foundation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(expectedH1);
  await expect(page.getByText('The local-first AI-CFO that finds cash gaps before they hit.')).toHaveCount(0);
  await expect(page.getByRole('heading', {
    name: 'Financial intelligence powering every protection assessment',
  })).toBeVisible();
  await expect(page.getByText('Cyber disruption', { exact: true })).toBeVisible();
  await expect(page.getByText('Supply-chain interruption', { exact: true })).toBeVisible();
  await expect(page.getByText('Asset / property loss', { exact: true })).toBeVisible();
  await expect(page.getByText('Business interruption', { exact: true })).toBeVisible();
  await expect(page.getByText('Synthetic demonstration data', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/SBFinance provides indicative decision-support analysis/).first()).toBeVisible();
});

test('hero and primary navigation use real protection routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero').getByRole('link', { name: /Run Protection Gap Demo/ }))
    .toHaveAttribute('href', '/protection-gap/demo/');
  await expect(page.locator('#hero').getByRole('link', { name: 'View Sample Protection Report' }))
    .toHaveAttribute('href', '/sample-protection-report/');
  await expect(page.locator('#hero').getByRole('link', { name: 'Request a Pilot' }))
    .toHaveAttribute('href', '#pilot');
  await expect(page.locator('#nav-menu').getByRole('link', { name: 'Protection Gap', exact: true }))
    .toHaveAttribute('href', '/protection-gap/');
  await expect(page.locator('#nav-menu').getByRole('link', { name: 'Interactive demo' }))
    .toHaveAttribute('href', '/protection-gap/demo/');
  await expect(page.locator('#nav-menu').getByRole('link', { name: 'Protection report' }))
    .toHaveAttribute('href', '/sample-protection-report/');
  await expect(page.locator('#hero a[href*="github.com"]')).toHaveCount(0);
});

test('fixture-backed proof, coverage and evidence load from the public demo data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Marina Digital Services Pte Ltd (Synthetic)').first()).toBeVisible();
  await expect(page.locator('#coverage-body tr')).toHaveCount(4);
  await expect(page.locator('#evidence-body tr')).toHaveCount(5);
  await expect(page.locator('#coverage-body tr').first()).toContainText('Requires policy review');
  await expect(page.locator('#coverage-body tr').first()).toContainText('Unknown');
  await expect(page.locator('[data-fixture="revenue-6m"]')).toHaveText('SGD 900,000');
  await expect(page.locator('[data-fixture="supplier-share"]').first()).toHaveText('45%');
});

test('homepage simulator changes fixture-backed scenario outputs', async ({ page }) => {
  await page.goto('/');
  const output = page.locator('#scenario-total');
  await expect(output).not.toHaveText('...');
  const before = await output.textContent();
  await page.locator('#scenario-days').fill('7');
  await expect(output).not.toHaveText(before || '');
  await expect(page.locator('#scenario-days-label')).toHaveText('60 days');
  await expect(page.locator('#scenario-note')).toContainText('assume zero payout');
});

test('public fixture keeps unresolved coverage unknown and withholds the prototype score', async ({ request }) => {
  const response = await request.get('/protection-gap/demo/data/protection-demo-fixture.json');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.base_assessment).not.toHaveProperty('overall_score');
  expect(data.base_assessment).not.toHaveProperty('score_components');
  for (const risk of data.base_assessment.risk_categories.filter((item) => item.confidence === 'low')) {
    expect(risk.covered_amount).toBeNull();
    expect(risk.estimated_uncovered).toBeNull();
    expect(risk.uncovered_range).toEqual([0, risk.gross_impact]);
  }
  expect(data.scenario_grid.coverage_assumption).toContain('zero-payout assumption');
  expect(data.meta.provenance_note).toContain('cannot be independently verified');
});

test('homepage exposes an explicit simulator error when the fixture fails', async ({ page }) => {
  await page.route('**/protection-demo-fixture.json', (route) => route.fulfill({ status: 503, body: '' }));
  await page.goto('/');
  await expect(page.locator('#scenario-uncovered')).toHaveText('Unavailable');
  await expect(page.locator('#scenario-total')).toHaveText('Unavailable');
  await expect(page.locator('#scenario-days')).toBeDisabled();
  await expect(page.locator('#coverage-body')).toContainText('Fixture could not be loaded');
});

test('pilot form exposes the required enquiry types and safe data notice', async ({ page }) => {
  await page.goto('/#pilot');
  await expect(page.locator('#form-success')).toBeHidden();
  await expect(page.locator('#form-error')).toBeHidden();
  await expect(page.locator('#enquiry-type option')).toHaveCount(6);
  await expect(page.locator('#enquiry-type')).toContainText('SME pilot');
  await expect(page.locator('#enquiry-type')).toContainText('Broker review');
  await expect(page.locator('#enquiry-type')).toContainText('Insurer design partnership');
  await expect(page.locator('#enquiry-type')).toContainText('AI-CFO private beta');
  await expect(page.getByText(/Do not upload or paste financial exports/)).toBeVisible();
  await expect(page.locator('#pilot-form input[type="file"]')).toHaveCount(0);
  await expect(page.locator('#pilot-workflow')).toHaveAttribute('maxlength', '1500');
});

test('pilot form retains native required-field validation without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/#pilot', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#pilot-form')).not.toHaveAttribute('novalidate', '');
  const valid = await page.locator('#pilot-form').evaluate((form) => form.reportValidity());
  expect(valid).toBe(false);
  await expect(page.locator('#pilot-name')).toBeFocused();
  await expect(page).toHaveURL(/\/#pilot$/);
  await context.close();
});

test('pilot form reports accessible validation errors', async ({ page }) => {
  await page.goto('/#pilot');
  await page.locator('#pilot-submit').click();
  await expect(page.locator('#pilot-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#pilot-name-error')).toHaveText('This field is required.');
  await expect(page.locator('#pilot-name')).toBeFocused();

  await page.locator('#pilot-name').fill('Sam Founder');
  await page.locator('#pilot-email').fill('not-an-email');
  await page.locator('#pilot-company').fill('Example SME');
  await page.locator('#pilot-role').fill('Founder');
  await page.locator('#enquiry-type').selectOption('sme-pilot');
  await page.locator('#pilot-workflow').fill('Evaluate cyber disruption and policy gaps.');
  await page.locator('#pilot-submit').click();
  await expect(page.locator('#pilot-email-error')).toHaveText('Enter a valid work email address.');
  await expect(page.locator('#pilot-email')).toBeFocused();
});

test('pilot form submits the protection-oriented payload and confirms success', async ({ page }) => {
  let payload = '';
  await page.route('https://api.web3forms.com/submit', async (route) => {
    payload = route.request().postData() || '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
  await page.goto('/#pilot');
  await page.locator('#pilot-name').fill('Sam Founder');
  await page.locator('#pilot-email').fill('sam@example.com');
  await page.locator('#pilot-company').fill('Example SME');
  await page.locator('#pilot-role').fill('Founder');
  await page.locator('#pilot-country').fill('Singapore');
  await page.locator('#enquiry-type').selectOption('sme-pilot');
  await page.locator('#company-size').selectOption('10-49');
  await page.locator('#pilot-timing').selectOption('1-3-months');
  await page.locator('#pilot-workflow').fill('Evaluate cyber disruption and policy gaps.');
  await page.locator('#pilot-submit').click();
  await expect(page.locator('#form-success')).toBeVisible();
  await expect(page.locator('#form-success')).toBeFocused();
  expect(payload).toContain('name="enquiry_type"');
  expect(payload).toContain('sme-pilot');
  expect(payload).toContain('name="pilot_timing"');
  expect(payload).not.toContain('filename=');
});

test('pilot form exposes a recoverable submission error', async ({ page }) => {
  await page.route('https://api.web3forms.com/submit', (route) => route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ success: false }),
  }));
  await page.goto('/#pilot');
  await page.locator('#pilot-name').fill('Sam Founder');
  await page.locator('#pilot-email').fill('sam@example.com');
  await page.locator('#pilot-company').fill('Example SME');
  await page.locator('#pilot-role').fill('Founder');
  await page.locator('#enquiry-type').selectOption('broker-review');
  await page.locator('#pilot-workflow').fill('Review the evidence hand-off.');
  await page.locator('#pilot-submit').click();
  await expect(page.locator('#form-error')).toBeVisible();
  await expect(page.locator('#form-error')).toBeFocused();
  await expect(page.locator('#pilot-form')).toBeVisible();
});

test('offer links preselect the matching enquiry type', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Request a Pilot', exact: true }).first().click();
  await expect(page.locator('#enquiry-type')).toHaveValue('sme-pilot');
  await page.getByRole('link', { name: 'Broker review' }).click();
  await expect(page.locator('#enquiry-type')).toHaveValue('broker-review');
  await page.getByRole('link', { name: 'Insurer partnership' }).click();
  await expect(page.locator('#enquiry-type')).toHaveValue('insurer-design-partnership');
  await page.getByRole('link', { name: 'Request beta access' }).click();
  await expect(page.locator('#enquiry-type')).toHaveValue('ai-cfo-private-beta');
});

test('homepage metadata matches the protection positioning', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('SBFinance — SME Financial Risk & Protection Intelligence');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',
    'Explore a synthetic prototype connecting SME financial inputs, policy facts and transparent scenarios to support review of possible protection gaps.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sbfinance.me/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',
    'Know your cash-flow risks and protection gaps');
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content',
    'Explore how financial inputs, synthetic policy facts and transparent scenarios could support SME protection review.');
});

test('heading hierarchy and anchor IDs are unambiguous', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.locator('h2').count()).toBeGreaterThan(10);
  const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
});

for (const viewport of [
  { name: '390px mobile', width: 390, height: 844 },
  { name: '320px mobile', width: 320, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
]) {
  test(`${viewport.name} has no horizontal page overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('mobile navigation is keyboard operable and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.nav-toggle');
  await expect(toggle).toHaveAccessibleName('Open navigation');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation');
  await expect(page.locator('#nav-menu')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('skip link moves keyboard focus to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
});

test('homepage has no serious or critical automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const material = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
  expect(material, material.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
});

test('public report and protection pages have no serious or critical automated accessibility violations', async ({ page }) => {
  for (const route of ['/protection-gap', '/protection-gap/demo', '/sample-protection-report', '/sample-report.html']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const material = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    expect(material, `${route}\n${material.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([]);
  }
});

test('mobile report and protection pages avoid overflow and material axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/protection-gap', '/protection-gap/demo', '/sample-protection-report', '/sample-report.html']) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${route} has horizontal document overflow`).toBeLessThanOrEqual(dimensions.clientWidth);
    const results = await new AxeBuilder({ page }).analyze();
    const material = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    expect(material, `${route}\n${material.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([]);
    const landmark = results.violations.filter((violation) => ['region', 'landmark-one-main'].includes(violation.id));
    expect(landmark, `${route}\n${landmark.map((violation) => `${violation.id}: ${violation.help}`).join('\n')}`).toEqual([]);
  }
});

test('AI-CFO sample report contains wide content after production fonts settle', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
  const page = await context.newPage();
  await page.goto('/sample-report.html');
  await page.evaluate(async () => { await document.fonts.ready; });
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(page.locator('.table-scroll')).toHaveCSS('overflow-x', 'auto');
  await context.close();
});

test('public protection routes load directly with one H1', async ({ page }) => {
  const failures = [];
  page.on('requestfailed', (request) => failures.push(`${request.method()} ${request.url()}`));
  for (const route of ['/protection-gap', '/protection-gap/demo', '/sample-protection-report']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(failures).toEqual([]);
});

test('full browser demo changes its scenario output', async ({ page }) => {
  await page.goto('/protection-gap/demo');
  const total = page.locator('#out-total');
  await expect(total).not.toHaveText('');
  const before = await total.textContent();
  await page.locator('#slider-days').fill('7');
  await expect(total).not.toHaveText(before || '');
  await page.locator('#slider-decline').fill('3');
  await expect(page.locator('#slider-days')).toHaveAttribute('aria-valuetext', '60 days');
  await expect(page.locator('#slider-decline')).toHaveAttribute('aria-valuetext', '30% revenue decline');
  await expect(page.getByRole('heading', { name: /Baseline coverage gap matrix/ })).toBeVisible();
  await expect(page.locator('#gap-table tbody tr').first()).toContainText('Requires policy review');
  await page.locator('#btn-report').click();
  await expect(page.locator('#report-body')).toContainText('Selected stored scenario: 60 days, 30% revenue decline');
  await expect(page.locator('#report-body')).toContainText('prototype readiness score is intentionally omitted');
  await expect(page.locator('#synthetic-banner')).toContainText('Synthetic data');
});

test('browser demo renders fixture markup as text', async ({ page }) => {
  const payload = '<img src=x onerror="window.__fixtureXss=1">';
  await page.addInitScript(() => { window.__fixtureXss = 0; });
  await page.route('**/protection-demo-fixture.json', async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    data.sme.name = payload;
    data.policy.facts[0].source_snippet = payload;
    data.base_assessment.risk_categories[0].family = payload;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
  await page.goto('/protection-gap/demo/');
  await page.locator('#btn-report').click();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__fixtureXss)).toBe(0);
  await expect(page.locator('#report-body')).toContainText(payload);
});

test('core homepage execution has no browser console errors', async ({ page }) => {
  const errors = [];
  const failures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', (request) => failures.push(`${request.method()} ${request.url()}`));
  await page.goto('/');
  await page.locator('#coverage-body tr').first().waitFor();
  await page.reload();
  await page.locator('#coverage-body tr').first().waitFor();
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
