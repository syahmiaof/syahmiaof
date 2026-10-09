import { test, expect } from '@playwright/test';

test('mindmap signals run only in view, react to selection and respect reduced motion', async ({ page }) => {
  await page.goto('/#capabilities');
  const map = page.locator('.capability-signals');
  await expect(map).toHaveAttribute('data-reduced', 'false');

  await page.evaluate(() => document.fonts.ready);
  // Earlier pinned sections settle after hydration and can shift the hash target.
  await expect(async () => {
    await map.scrollIntoViewIfNeeded();
    await expect(map).toBeInViewport();
    await expect(map).toHaveAttribute('data-running', 'true');
  }).toPass();
  const packet = map.locator('.map-packet').first();
  const initial = await packet.evaluate(el => getComputedStyle(el).strokeDashoffset);
  await expect.poll(() => packet.evaluate(el => getComputedStyle(el).strokeDashoffset)).not.toBe(initial);
  await page.getByRole('tab', { name: 'DevOps', exact: true }).click();
  await expect(map.locator('g[data-selected="true"]')).toHaveCount(1);
  await expect(page.locator('#capability-panel h3')).toHaveText('DevOps');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(map).toHaveAttribute('data-running', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(map).toHaveAttribute('data-reduced', 'true');
  await expect(packet).toBeHidden();
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 360, height: 740 }, { width: 489, height: 449 }]) {
  test(`Symi and timestamp share the bottom-right dock at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/quick');
    const dock = page.locator('.experience-dock');
    await expect(dock).toContainText('MYT');
    const box = (await dock.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(viewport.width - box.x - box.width).toBeCloseTo(16, 0);
    expect(viewport.height - box.y - box.height).toBeCloseTo(16, 0);
    const launcher = dock.getByRole('button', { name: 'Ask Symi about Syahmi' });
    await launcher.click();
    const panel = page.locator('#symi-panel');
    const panelBox = (await panel.boundingBox())!;
    expect(panelBox.x).toBeGreaterThanOrEqual(0);
    expect(panelBox.y).toBeGreaterThanOrEqual(0);
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);
    expect(panelBox.y + panelBox.height).toBeLessThan(box.y);
    await page.keyboard.press('Escape');
    await expect(launcher).toBeFocused();
  });
}
