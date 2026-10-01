import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('network introduction reveals hero automatically and restores scrolling', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const intro = page.getByRole('dialog', { name: 'Everything connects.' });
  await expect(intro).toBeVisible();
  await expect(page.locator('.network-intro')).toHaveJSProperty('open', true);
  await expect(page.locator('#intro-status')).toContainText(/Initializing|Connecting/);
  await expect(intro).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL('/#work');
});

test('skip releases focus immediately and cancelled timers cannot reopen intro', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await expect(page.locator('#main')).toBeFocused();
  await page.waitForTimeout(3600);
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open command palette' }).click();
  await expect(page.getByRole('textbox', { name: 'Search commands' })).toBeVisible();
});

test('hero and outgoing network overlap during a gradual reveal', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.network-intro[data-phase="leaving"]').waitFor();
  await page.waitForTimeout(750);
  const state = await page.evaluate(() => {
    const intro = document.querySelector('.network-intro')!;
    const hero = document.querySelector('.hero-copy')!;
    return { cover: Number(getComputedStyle(intro, '::before').opacity), hero: Number(getComputedStyle(hero).opacity) };
  });
  expect(state.cover).toBeGreaterThan(0);
  expect(state.cover).toBeLessThan(1);
  expect(state.hero).toBeGreaterThan(0);
  expect(state.hero).toBeLessThan(1);
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
});

test('Escape interrupts the reveal and restores fully visible hero', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.network-intro[data-phase="leaving"]').waitFor();
  await page.keyboard.press('Escape');
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-art')).toHaveCSS('transform', 'none');
  await expect(page.locator('#main')).toBeFocused();
});

test('Escape skips and modal keeps keyboard focus on the available control', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest('.network-intro'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await expect(page.locator('#main')).toBeFocused();
});

test('reload replays but client navigation back to the homepage does not', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await page.getByRole('link', { name: 'Quick view', exact: true }).click();
  await expect(page).toHaveURL('/quick');
  await page.getByRole('link', { name: 'Syahmi Aof home' }).click();
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
});

test('deep links, OS reduced motion and saved motion preference bypass intro', async ({ page }) => {
  await page.goto('/#work');
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.network-intro')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => localStorage.setItem('portfolio-reduced-motion', 'true'));
  await page.reload();
  await expect(page.locator('.network-intro')).toHaveCount(0);
});

test('changed OS preference dismisses an active intro', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.network-intro')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
});

test('without JavaScript the portfolio remains available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.network-intro')).toBeHidden();
  await expect(page.getByRole('link', { name: 'Explore my work' })).toBeVisible();
  await context.close();
});

test('intro is accessible and has no overflow on a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  expect(await page.locator('.network-intro').evaluate(el => el.scrollWidth <= innerWidth)).toBe(true);
  const result = await new AxeBuilder({ page }).include('.network-intro').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations.map(v => v.id)).toEqual([]);
});
