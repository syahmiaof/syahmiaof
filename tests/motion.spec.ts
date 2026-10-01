import { test, expect } from '@playwright/test';
import sharp from 'sharp';

async function eyeCentroid(png: Buffer) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let total = 0, sum = 0;
  for (let y = Math.round(info.height * .17); y < info.height * .48; y++) {
    for (let x = Math.round(info.width * .3); x < info.width * .7; x++) {
      const i = (y * info.width + x) * 4;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      // Isolate mint eye light, excluding green reflections on the metal shell and ear caps.
      if (g > 120 && g - r > 30 && b - r > 25 && g - b < 40) { total++; sum += x; }
    }
  }
  expect(total, 'The rendered robot has visible emerald eyes').toBeGreaterThan(150);
  return sum / total;
}

test('robot gaze follows horizontal cursor movement in the rendered canvas', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#index');
  const canvas = page.locator('.robot-canvas canvas');
  await expect(canvas).toBeVisible();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * .06, box.y + box.height * .4);
  await page.waitForTimeout(950);
  const leftImage = await canvas.screenshot();
  await test.info().attach('left-gaze', { body: leftImage, contentType: 'image/png' });
  const left = await eyeCentroid(leftImage);
  await page.mouse.move(box.x + box.width * .94, box.y + box.height * .4);
  await page.waitForTimeout(950);
  const rightImage = await canvas.screenshot();
  await test.info().attach('right-gaze', { body: rightImage, contentType: 'image/png' });
  const right = await eyeCentroid(rightImage);
  expect(right - left, 'Eye position moves toward the cursor').toBeGreaterThan(8);
  expect(errors).toEqual([]);
});

test('image tilt follows the pointer and settles back without horizontal overflow', async ({ page }) => {
  await page.goto('/#selected');
  const image = page.locator('.project-image').first();
  await expect(image).toHaveAttribute('data-pointer-effect', 'surface');
  const initial = await image.evaluate(el => getComputedStyle(el).transform);
  await image.hover({ position: { x: 35, y: 45 } });
  await expect(image).toHaveAttribute('data-pointer-active', 'true');
  await expect.poll(() => image.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.mouse.move(5, 95);
  await expect(image).not.toHaveAttribute('data-pointer-active');
  await expect.poll(() => image.evaluate(el => getComputedStyle(el).transform)).toBe(initial);
});

test('large title reacts and magnetic CTA remains clickable', async ({ page }) => {
  await page.goto('/#index');
  const title = page.locator('.hero h1');
  await title.hover({ position: { x: 50, y: 60 } });
  await expect(title).toHaveAttribute('data-pointer-active', 'true');
  const cta = page.getByRole('link', { name: 'Explore my work' });
  await cta.hover({ position: { x: 25, y: 20 } });
  await expect(cta).toHaveAttribute('data-pointer-effect', 'magnetic');
  await cta.click();
  await expect(page).toHaveURL('/#work');
});

test('motion switch removes active tilt and robot enhancement then restores both', async ({ page }) => {
  await page.goto('/#index');
  await expect(page.locator('.robot-canvas canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('[data-pointer-effect]')).toHaveCount(0);
  await expect(page.locator('.robot-canvas')).toHaveCount(0);
  await expect(page.locator('.hero .robot-fallback')).toBeVisible();
  await page.getByRole('button', { name: 'Motion reduced', exact: true }).click();
  await expect(page.locator('.robot-canvas canvas')).toBeVisible();
  await expect(page.locator('.hero h1')).toHaveAttribute('data-pointer-effect', 'title');
});

test('touch viewport has a static robot and no pointer-driven transforms', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('/#index');
  await expect(page.locator('.hero .robot-fallback')).toBeVisible();
  await expect(page.locator('.robot-canvas')).toHaveCount(0);
  await expect(page.locator('[data-pointer-effect]')).toHaveCount(0);
  await context.close();
});

test('robot draw calls stop when its scene is outside the viewport', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { robotDrawCalls: 0 });
    for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const draw = prototype.drawElements;
      prototype.drawElements = function(...args: Parameters<typeof draw>) {
        const target = window as Window & { robotDrawCalls?: number };
        target.robotDrawCalls = (target.robotDrawCalls ?? 0) + 1;
        return draw.apply(this, args);
      };
    }
  });
  await page.goto('/#index');
  await expect(page.locator('.robot-canvas canvas')).toBeVisible();
  await page.mouse.move(1000, 350);
  await expect.poll(() => page.evaluate(() => (window as Window & { robotDrawCalls?: number }).robotDrawCalls ?? 0)).toBeGreaterThan(0);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const count = await page.evaluate(() => (window as Window & { robotDrawCalls?: number }).robotDrawCalls);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as Window & { robotDrawCalls?: number }).robotDrawCalls)).toBe(count);
});
