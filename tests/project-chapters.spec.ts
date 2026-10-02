import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('project categories contain real work and precede collaboration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#work');
  await expect(page.getByRole('heading', { name: 'Active projects.', exact: true })).toBeVisible();
  expect(await page.locator('#work, #ongoing, #collaboration, #lab').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(['work', 'ongoing', 'collaboration', 'lab']);
  await expect(page.locator('#work #greetly, #work #selected')).toHaveCount(2);
  await expect(page.locator('#ongoing article')).toHaveCount(2);
  await expect(page.locator('#ongoing')).toContainText('CerviScan-AI');
  await expect(page.locator('#ongoing')).toContainText('GayongX');
  await expect(page.getByText(/Cloudscope|Deployflow|Nexus Agents|Edgewatch/)).toHaveCount(0);
  await page.locator('#cerviscan-ai summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cerviscan-ai details')).toHaveAttribute('open', '');
  await expect(page.locator('#cerviscan-ai')).toContainText('mock data');
  await expect(page.locator('#cerviscan-ai')).toContainText('not a clinically validated');
  await expect(page.locator('#cerviscan-ai a')).toHaveAttribute('href', 'https://cervi-scan-ai.vercel.app/');
  await page.locator('#gayongx summary').click();
  await expect(page.locator('#gayongx')).toContainText('full ecosystem has not launched');
  await expect(page.locator('.project-aduan-preview .project-image')).toHaveAttribute('href', 'https://sistem-aduan-asrama-ikm.web.app/');
  await page.locator('.project-aduan-preview img').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.project-aduan-preview img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  for (const link of await page.locator('#ongoing a[target], .project-aduan-preview a[target]').all()) await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('active chapter assembles, holds, exits and reverses without hiding its links', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#work');
  await page.evaluate(() => document.fonts.ready);
  const header = page.locator('.project-chapter-intro');
  const place = async (y: number) => header.evaluate((el, top) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - top, behavior: 'instant' }), y);
  await place(180);
  await expect.poll(() => page.locator('.chapter-word').evaluateAll(nodes => nodes.every(node => Number(getComputedStyle(node).opacity) > .99))).toBe(true);
  await expect(page.getByRole('link', { name: 'Start with Greetly' })).toBeVisible();
  await header.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().bottom + scrollY, behavior: 'instant' }));
  await expect.poll(() => page.locator('.chapter-word').evaluateAll(nodes => nodes.every(node => Number(getComputedStyle(node).opacity) < .01))).toBe(true);
  await place(180);
  await expect.poll(() => page.locator('.chapter-word').evaluateAll(nodes => nodes.every(node => Number(getComputedStyle(node).opacity) > .99))).toBe(true);
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  for (const word of await page.locator('.chapter-word').all()) await expect(word).toHaveCSS('opacity', '1');
  await expect(page.locator('.chapter-circuit')).toHaveCSS('transform', 'none');
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 1280, 1440]) test(`project chapter layout and keyboard at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#work');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const chapterSize = await page.locator('#work-title').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  const projectSize = await page.locator('#greetly-title').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  expect(chapterSize).toBeGreaterThanOrEqual(projectSize);
  await page.getByRole('link', { name: 'See ongoing projects' }).click();
  await expect(page).toHaveURL(/#ongoing$/);
  await page.locator('#gayongx summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gayongx details')).toHaveAttribute('open', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const audit = await new AxeBuilder({ page }).include('#work').include('#ongoing').include('#collaboration').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});
