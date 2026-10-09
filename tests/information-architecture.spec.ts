import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { techStackGroups } from '../src/data/tech-stack';

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

for (const width of [1440, 1280, 390]) {
  test(`all primary pages remain direct and contained at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [route, active] of [['/projects', 'Projects'], ['/experience', 'Experience'], ['/skills', 'Skills'], ['/credentials', 'Credentials'], ['/lab', 'Projects'], ['/quick', '']]) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('canvas')).toHaveCount(0);
      if (active) await expect(page.locator('.desktop-nav [aria-current]')).toHaveText(active);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      expect(await page.locator('main').getByRole('navigation', { name: /On this page|Experience chapters/ }).count()).toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
  });
}

test('cross-page nav lands below the header and closes the mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/skills');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#mobile-nav [aria-current]')).toHaveText('Skills');
  await page.locator('#mobile-nav').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL('/#about');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
  await expect.poll(() => page.locator('#about').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeGreaterThanOrEqual(68);
  await expect(page.locator('.desktop-nav [aria-current]')).toHaveText('About');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
});

test('legacy anchors redirect to their preserved content', async ({ page }) => {
  for (const [old, target, id] of [['/#stack', '/skills#stack', '#stack'], ['/#collaboration', '/experience#collaboration', '#collaboration'], ['/#awards', '/credentials#awards', '#awards'], ['/#cerviscan-ai', '/projects#cerviscan-ai', '#cerviscan-ai']]) {
    await page.goto(old);
    await expect(page).toHaveURL(target);
    await expect(page.locator(id)).toBeInViewport();
  }
});

test('credential anchors reveal filtered records and retain evidence', async ({ page }) => {
  await page.goto('/credentials');
  await page.getByRole('button', { name: 'Course Completions', exact: true }).click();
  await expect(page.locator('#programs')).toBeHidden();
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Programs', exact: true }).click();
  await expect(page.locator('#programs')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#industry-targets')).toContainText('not earned credentials');
});

test('skills preserve the complete inventory and expose evidence by depth', async ({ page }) => {
  await page.goto('/skills');
  await expect(page.locator('.stack-badge')).toHaveCount(techStackGroups.flatMap(group => group.items).length);
  await expect(page.locator('#used').getByRole('link', { name: /^Raspberry Pi/ })).toHaveAttribute('href', '/projects/greetly');
  await expect(page.locator('#labs').getByRole('link', { name: /^AWS/ })).toHaveAttribute('href', '/credentials#programs');
  await expect(page.locator('#learning')).toContainText('not a claim of equal proficiency');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
});

test('contact copy succeeds and the CV endpoint returns an actual PDF', async ({ page, request }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (value: string) => { document.documentElement.dataset.copiedEmail = value; } } }));
  await page.goto('/quick');
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.locator('.copy-email [role="status"]')).toHaveText('Copied');
  await expect(page.locator('html')).toHaveAttribute('data-copied-email', 'syahmiaof123@gmail.com');
  const response = await request.get('/api/resume');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('moved animated sections preserve pointer effects and reduced-motion cleanup', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [route, heading] of [['/skills', '#capability-title'], ['/lab', '#lab-title'], ['/experience', '#experience-title'], ['/projects', '#selected-title']]) {
    await page.goto(route);
    await expect(page.locator(heading)).toHaveAttribute('data-pointer-effect', 'title');
  }
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('[data-pointer-effect]')).toHaveCount(0);
});
