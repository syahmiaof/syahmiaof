import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';
import { credentials, professionalPrograms, featuredPrograms, componentsFor, courseCompletions, standaloneCompletions, competitionRecognitions, nextTargets } from '../src/data/credentials';

test('credential catalog preserves evidence grouping and precise credential types', () => {
  expect(credentials).toHaveLength(43);
  expect(new Set(credentials.map(record => record.slug)).size).toBe(43);
  expect(professionalPrograms).toHaveLength(4);
  expect(featuredPrograms).toHaveLength(4);
  expect(courseCompletions).toHaveLength(39);
  expect(standaloneCompletions).toHaveLength(4);
  expect(professionalPrograms.map(program => componentsFor(program.slug).length)).toEqual([18, 8, 6, 3]);
  expect(competitionRecognitions).toHaveLength(3);
  expect(competitionRecognitions.find(record => record.slug === 'cloudhunt-2025')?.achievements).toEqual(['MVP Team Member', 'Most Crowd’s Favourite', 'Bootcamp Participant']);
  expect(nextTargets.every(target => target.status === 'target')).toBe(true);
  for (const record of credentials) {
    expect(record.issuedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(record.title).not.toMatch(/AWS Certified|Google Cloud Certified/);
    expect(record.evidenceLevel).toBe('certificate-only');
    if (record.verificationUrl) expect(record.verificationUrl).toMatch(/^https:\/\/coursera\.org\/verify\//);
    if (record.parentSlug) expect(professionalPrograms.some(parent => parent.slug === record.parentSlug)).toBe(true);
  }
  expect(credentials.find(record => record.slug === 'aws-cloud-practitioner-essentials')?.kind).toBe('course');
  expect(professionalPrograms.find(record => record.issuer === 'Whizlabs')?.kind).toBe('specialization');
  const publicFiles = readdirSync('public', { recursive: true }).map(String);
  expect(publicFiles.filter(file => /certificate|coursera|cloudhunt|netacad|icompex|linkdln|\.pdf$/i.test(file))).toEqual([]);
});

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('homepage retains section order and presents only featured records with separate targets', async ({ page }) => {
  await page.goto('/');
  const order = await page.locator('#stack, #credentials, #awards, #contact').evaluateAll(nodes => nodes.map(node => node.id));
  expect(order).toEqual(['stack', 'credentials', 'awards', 'contact']);
  await expect(page.locator('#credentials [data-program]')).toHaveCount(4);
  await expect(page.locator('#credentials [data-completion]')).toHaveCount(0);
  await expect(page.locator('#awards [data-competition]')).toHaveCount(3);
  await expect(page.locator('#awards [data-competition="cloudhunt-2025"] .recognition-achievements li')).toHaveCount(3);
  await expect(page.locator('#credentials .credential-summary dd')).toHaveText(['4', '39', '3']);
  await page.locator('#credentials summary').click();
  await expect(page.locator('#credentials .credential-targets')).toContainText('Aspirational targets, not earned credentials');
  await expect(page.locator('#credentials .credential-targets .status-outline')).toHaveCount(5);
  await page.getByRole('link', { name: 'Explore all credentials' }).click();
  await expect(page).toHaveURL('/credentials');
});

test('catalog filtering, disclosures, evidence and keyboard navigation work', async ({ page, request }) => {
  await page.goto('/credentials');
  await expect(page).toHaveTitle(/Credentials & recognition/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://syahmiaof.my/credentials');
  await expect(page.locator('[data-program]')).toHaveCount(4);
  await expect(page.locator('[data-completion]')).toHaveCount(39);
  const courses = page.getByRole('button', { name: 'Course Completions', exact: true });
  await courses.focus();
  await page.keyboard.press('Enter');
  await expect(courses).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Professional Programs', exact: true })).toBeHidden();
  const summary = page.locator('.credential-course-group summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.credential-course-group').first()).toHaveAttribute('open', '');
  await expect(page.locator('.credential-course-group').first().locator('[data-completion]:visible')).toHaveCount(18);
  await expect(summary).toBeFocused();
  expect(await summary.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Space');
  await expect(page.locator('.credential-course-group').first()).not.toHaveAttribute('open');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  for (const link of await page.locator('.credential-verify').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).toHaveAttribute('aria-label', /^Verify .+ on /);
    await expect(link).toHaveAttribute('href', /^https:\/\/coursera\.org\/verify\//);
  }
  await expect(page.locator('main')).toContainText('This is not the AWS certification exam credential.');
  await expect(page.locator('main')).toContainText('It is not the Google Cloud Professional Data Engineer certification exam credential.');
  await expect(page.locator('main')).toContainText('Course completion, not the AWS Certified Cloud Practitioner exam credential.');
  expect(await page.locator('main').textContent()).not.toMatch(/\d{6}-\d{2}-\d{4}/);
  await expect(page.locator('main a[href*="certificate/"]')).toHaveCount(0);
  expect((await request.get('/certificate/')).status()).toBe(404);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/credentials');
});

for (const width of [320, 390, 1440]) {
  test(`credentials responsive and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/credentials');
    for (const summary of await page.locator('main summary').all()) await summary.click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const tooSmall = await page.locator('main button, main a, main summary').evaluateAll(nodes => nodes.filter(node => node.getBoundingClientRect().height < 44).map(node => node.textContent));
    expect(tooSmall).toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  });
}
