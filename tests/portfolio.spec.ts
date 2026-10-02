import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function gotoHomepage(page: Page) {
  await page.goto('/');
  await expect(page.locator('.network-intro')).toBeHidden();
}

test('homepage has the complete narrative and healthy images', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await gotoHomepage(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SYAHMI');
  for (const id of ['about', 'work', 'selected', 'lab', 'capabilities', 'intelligence', 'credentials', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.evaluate(async () => { await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
  expect(await page.locator('main img').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

for (const width of [360, 390, 768, 1280, 1920]) {
  test(`responsive layout at ${width}px has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await gotoHomepage(page);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const id of ['work', 'selected', 'capabilities', 'credentials', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  });
}

test('command palette filters, supports arrows, closes with Escape and returns focus', async ({ page }) => {
  await gotoHomepage(page);
  await page.getByRole('button', { name: 'Open command palette' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.getByRole('textbox', { name: 'Search commands' }).fill('greetly');
  await expect(dialog.getByRole('button', { name: /Open Greetly/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open command palette' })).toBeFocused();
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox', { name: 'Search commands' }).fill('quick');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/quick');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Muhammad');
});

test('palette shows an honest empty state and traps focus', async ({ page }) => {
  await gotoHomepage(page);
  await page.keyboard.press('Control+k');
  await page.getByRole('textbox', { name: 'Search commands' }).fill('unfindablexyz');
  await expect(page.getByText('No matching commands.')).toBeVisible();
  for(let i=0;i<8;i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('dialog')?.contains(document.activeElement))).toBe(true);
});

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHomepage(page);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL('/#work');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  await expect(page.locator('#greetly-title')).toBeInViewport();
});

test('architecture nodes work by keyboard and have a full text transcript', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoHomepage(page);
  const capture = page.getByRole('tab', { name: '01 Capture' });
  await capture.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '02 Process' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#journey-panel')).toContainText('OpenCV');
  await page.getByText('Read the complete architecture', { exact: true }).click();
  await expect(page.locator('.architecture-transcript')).toContainText('LBPH');
});

test('capability and AI pattern tabs switch actual content', async ({ page }) => {
  await gotoHomepage(page);
  await page.getByRole('tab', { name: 'AI systems', exact: true }).click();
  await expect(page.locator('#capability-panel')).toContainText('exploring');
  await expect(page.locator('#capability-panel')).toContainText('MCP');
  await page.getByRole('tab', { name: 'Retrieval / RAG' }).click();
  await expect(page.locator('#ai-panel')).toContainText('Embeddings');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'MCP / tools' })).toHaveAttribute('aria-selected', 'true');
});

test('reduced motion keeps content and does not create canvases', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoHomepage(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /From a face/ })).toBeVisible();
});

test('motion toggle persists across navigation', async ({ page }) => {
  await gotoHomepage(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.goto('/quick');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
});

test('quick view loads without WebGL and has usable contact links', async ({ page }) => {
  await page.goto('/quick');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email me', exact: true })).toHaveAttribute('href', 'mailto:syahmiaof123@gmail.com');
  await expect(page.getByRole('link', { name: 'Request resume' }).first()).toHaveAttribute('href', /mailto:.*subject=Resume/);
  expect(await page.evaluate(() => performance.getEntriesByType('resource').filter(item => /ComputeCanvas|three_core|three_module/.test(item.name)).length)).toBe(0);
});

test('project route has sourced technical details and deployment', async ({ page }) => {
  await page.goto('/projects/greetly');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('GREETLY');
  await expect(page.getByText(/current Python script uses OpenCV/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Python edge implementation' })).toHaveAttribute('href', /recognize_attendance.py$/);
  await expect(page.locator('#deployment')).toContainText('Cloudflare');
});

test('ongoing projects and credentials do not imply verified achievements', async ({ page }) => {
  await gotoHomepage(page);
  await page.locator('#cerviscan-ai summary').click();
  await expect(page.locator('#cerviscan-ai')).toContainText('not a clinically validated diagnostic device');
  await expect(page.locator('#credentials')).toContainText('Aspirational targets');
  await page.getByText('Next certification targets', { exact: true }).click();
  await expect(page.locator('.credential-targets')).toContainText('not earned credentials');
});

for (const route of ['/', '/quick', '/projects/greetly']) {
  test(`WCAG automated audit ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n=>n.target) }))).toEqual([]);
  });
}

test('fallback survives a missing project image', async ({ page }) => {
  await page.route('**/_next/image?*', route => route.abort());
  await page.goto('/quick');
  await expect(page.getByText('Image unavailable')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email me', exact: true })).toBeVisible();
});

test('WebGL unavailable retains the topology and readable content', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await gotoHomepage(page);
  await expect(page.locator('.hero .topology-fallback').first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SYAHMI');
  await page.getByRole('link', { name: 'Quick view', exact: true }).click();
  await expect(page).toHaveURL('/quick');
});

test('keyboard skip link reaches the main content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoHomepage(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/#main');
});

test('404 and public SEO endpoints work', async ({ page, request }) => {
  const response = await page.goto('/missing-node');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /doesn’t exist/ })).toBeVisible();
  expect((await request.get('/robots.txt')).ok()).toBe(true);
  const image = await request.get('/opengraph-image');
  expect(image.ok()).toBe(true);
  expect(image.headers()['content-type']).toContain('image/png');
});
