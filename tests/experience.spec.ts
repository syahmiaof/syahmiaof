import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('experience is a readable factual chapter between about and project work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/experience#experience');
  const section = page.locator('#experience');
  await expect(section.getByRole('heading', { name: 'Experience.' })).toBeVisible();
  await expect(section.locator('article')).toHaveCount(5);
  await expect(section).toContainText('RM15,000');
  await expect(section).toContainText('TUBE SME Corp grant');
  await expect(section).toContainText('Working toward Cloud / DevOps engineering.');
  await expect(section.locator('time')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Experience', exact: true })).toHaveAttribute('aria-current', 'page');
  const results = await new AxeBuilder({ page }).include('#experience').analyze();
  expect(results.violations).toEqual([]);
});

test('native chapter navigation supports keyboard and reverse scroll', async ({ page }) => {
  await page.goto('/experience#experience');
  const leadership = page.getByRole('navigation', { name: 'Experience chapters' }).getByRole('link', { name: 'Leadership', exact: true });
  await leadership.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#experience-leadership$/);
  await expect(leadership).toHaveAttribute('aria-current', 'step');
  const first = page.getByRole('navigation', { name: 'Experience chapters' }).getByRole('link', { name: 'People', exact: true });
  await first.click();
  await expect(first).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('#experience-people')).toHaveAttribute('data-active', 'true');
});

test('experience can be found from About and command search', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#about');
  await page.getByRole('link', { name: 'Explore my experience' }).click();
  await expect(page).toHaveURL(/\/experience$/);
  await page.getByRole('button', { name: 'Open command palette' }).click();
  await page.getByRole('textbox', { name: 'Search commands' }).fill('experience');
  await page.getByRole('textbox', { name: 'Search commands' }).press('Enter');
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 600 }]) {
  test(`experience stays readable without sticky obstruction at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/experience#experience-leadership');
    await expect(page.locator('#experience-leadership h2')).toBeVisible();
    expect(await page.locator('.road-index').evaluate(el => getComputedStyle(el).position)).toBe('static');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const chapter of await page.locator('.road-chapter').all()) {
      await chapter.scrollIntoViewIfNeeded();
      const box = await chapter.boundingBox();
      expect(box!.width).toBeGreaterThan(300);
      await expect(chapter.locator('.road-skills li')).toHaveCount(3);
    }
  });
}

test('experience is still readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/experience#experience');
  await expect(page.locator('#experience h1')).toBeVisible();
  await expect(page.locator('.road-chapter')).toHaveCount(5);
  await page.getByRole('navigation', { name: 'Experience chapters' }).getByRole('link', { name: 'Growth systems', exact: true }).click();
  await expect(page.locator('#experience-growth h2')).toBeInViewport();
  await context.close();
});
