import { test, expect } from '@playwright/test';

test('robot entrance overlaps the outgoing intro and settles in its final pose', async ({ page }) => {
  // Observe transitions from document creation instead of polling a brief phase
  // that can pass between browser responses on software WebGL.
  await page.addInitScript(() => {
    const phases: string[] = [];
    Object.assign(window, { arrivalPhases: phases });
    new MutationObserver(records => records.forEach(record => {
      if (record.type === 'attributes' && record.target instanceof Element) {
        const current = record.target.getAttribute('data-arrival');
        if (record.oldValue) phases.push(record.oldValue);
        if (current) phases.push(current);
      }
    })).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-arrival'], attributeOldValue: true });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const canvas = page.locator('.robot-canvas canvas');
  await expect(canvas).toHaveAttribute('data-arrival', 'ready', { timeout: 20000 });
  expect(await page.evaluate(() => (window as Window & { arrivalPhases?: string[] }).arrivalPhases)).toContain('entering');
  await expect(page.locator('.network-intro')).toHaveCount(0);
});

test('Greetly scroll opens the actual device, pins the scene and delivers the record', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#work');
  const journey = page.locator('.journey');
  await expect(journey).toHaveAttribute('data-cinematic', 'true');
  const stage = journey.locator('.journey-stage');
  const start = await stage.evaluate(el => el.getBoundingClientRect().top + scrollY - 100);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), start + 5);
  const canvas = page.locator('.device-canvas canvas');
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(900);
  const closed = await canvas.screenshot();
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), start + 800);
  await expect(page.getByRole('tab', { name: '03 Identify' })).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => stage.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(100);
  await page.waitForTimeout(800);
  const open = await canvas.screenshot();
  expect(open.equals(closed), 'Rendered device changes as layers separate').toBe(false);
  await test.info().attach('exploded-device', { body: open, contentType: 'image/png' });
  await page.getByRole('tab', { name: '06 Visualize' }).click();
  await expect(page.locator('.event-destination')).toHaveAttribute('data-stage', '5');
  await expect(page.locator('.attendance-preview')).toContainText('Attendance recorded');
  await page.getByRole('tab', { name: '01 Capture' }).click();
  await expect(page.locator('.event-destination')).toHaveAttribute('data-stage', '0');
  await expect(page.locator('.attendance-preview')).toContainText('Awaiting event');
  expect(errors).toEqual([]);
});

test('turning motion off removes Greetly pin and keeps its keyboard walkthrough', async ({ page }) => {
  await page.goto('/#work');
  await expect(page.locator('.journey')).toHaveAttribute('data-cinematic', 'true');
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('.journey')).not.toHaveAttribute('data-cinematic');
  await expect(page.locator('.journey .pin-spacer')).toHaveCount(0);
  const capture = page.getByRole('tab', { name: '01 Capture' });
  await capture.focus();
  await capture.press('End');
  await expect(page.getByRole('tab', { name: '06 Visualize' })).toBeFocused();
  await expect(page.locator('#journey-panel')).toContainText('Realtime');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('touch walkthrough shows the illustrative record with no pinned scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');
  await expect(page.locator('.journey')).not.toHaveAttribute('data-cinematic');
  await page.getByRole('tab', { name: '05 Store' }).click();
  await expect(page.locator('.attendance-preview')).toContainText('Attendance recorded');
  await expect(page.locator('.attendance-preview')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
