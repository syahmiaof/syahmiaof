import { test, expect } from '@playwright/test';

test('original artwork advances throughout the full scroll and keeps loading bounded', async ({ page }) => {
  const frames = new Set<string>();
  const errors: string[] = [];
  page.on('request', request => {
    const match = request.url().match(/ezgif-frame-\d+\.jpg/);
    if (match) frames.add(match[0]);
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#work');
  const scene = page.locator('.greetly-sequence');
  const canvas = scene.locator('canvas');
  await expect(canvas).toHaveAttribute('data-frame', '1');
  expect(frames.size).toBeLessThan(40);
  const start = await scene.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo({ top: y + innerHeight * 2.5, behavior: 'instant' }), start);
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame'))).toBeGreaterThan(95);
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame'))).toBeLessThan(110);
  await page.screenshot({ path: 'test-results/greetly-original-sequence.png' });
  await page.evaluate(y => window.scrollTo({ top: y + innerHeight * 4, behavior: 'instant' }), start);
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame'))).toBeGreaterThan(150);
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame'))).toBeLessThan(175);
  await page.evaluate(y => window.scrollTo({ top: y + innerHeight * 5 - 1, behavior: 'instant' }), start);
  await expect(canvas).toHaveAttribute('data-frame', '200');
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(scene.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.greetly-cover .pin-spacer')).toHaveCount(0);
  await expect(page.locator('.greetly-sequence-poster')).toBeVisible();
  await page.getByRole('button', { name: 'Motion reduced', exact: true }).click();
  await expect(canvas).toHaveCount(1);
  await expect(page.locator('.greetly-cover .pin-spacer')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('high-DPI canvas draws a centered image in logical coordinates', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args: unknown[]) {
      if (this.canvas.closest('.greetly-sequence')) this.canvas.dataset.testDraw = JSON.stringify(args.slice(1));
      Reflect.apply(original, this, args);
    };
  });
  await page.goto('/#work');
  const canvas = page.locator('.greetly-sequence canvas');
  await expect(canvas).toHaveAttribute('data-frame', '1');
  const sizes = await canvas.evaluate((el: HTMLCanvasElement) => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height, physical: el.width, scale: el.getContext('2d')!.getTransform().a, draw: JSON.parse(el.dataset.testDraw!) as number[] };
  });
  expect(sizes.scale).toBe(2);
  expect(sizes.physical).toBe(Math.round(sizes.width * 2));
  const [x, y, width, height] = sizes.draw;
  expect(width).toBeLessThanOrEqual(sizes.width * .9 + 1);
  expect(height).toBeLessThanOrEqual(sizes.height * .9 + 1);
  expect(x + width / 2).toBeCloseTo(sizes.width / 2);
  expect(y + height / 2).toBeCloseTo(sizes.height / 2);
  await context.close();
});

test('mobile uses the original poster without a pinned sequence or frame downloads', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (/ezgif-frame-\d+\.jpg$/.test(request.url())) requests.push(request.url()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');
  await expect(page.locator('.greetly-sequence canvas')).toHaveCount(0);
  await expect(page.locator('.greetly-sequence-poster')).toBeVisible();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a failed first frame uses the nearest available artwork without breaking the page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/images/greetly-sequence/ezgif-frame-001.jpg', route => route.abort());
  await page.goto('/#work');
  const canvas = page.locator('.greetly-sequence canvas');
  await expect(canvas).toHaveAttribute('data-frame', '2');
  await expect(canvas).toHaveCSS('opacity', '1');
  expect(errors).toEqual([]);
});
