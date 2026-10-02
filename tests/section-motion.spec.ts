import { test, expect, type Page } from '@playwright/test';

const titles = ['work-title', 'greetly-title', 'about-title', 'selected-title', 'collaboration-title', 'future-title', 'lab-title', 'capability-title', 'intelligence-title', 'stack-title', 'credentials-title', 'awards-title', 'contact-title'];
async function place(page: Page, id: string, viewportY: number) {
  await page.locator(`#${id}`).evaluate((element, y) => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - y, behavior: 'instant' }), viewportY);
}
async function visibleLines(page: Page, id: string) {
  await expect.poll(() => page.locator(`#${id} ${id === 'future-title' ? '.motion-title-word' : '.motion-title-line'}`).evaluateAll(lines => lines.length > 0 && lines.every(line => Number(getComputedStyle(line).opacity) > .99))).toBe(true);
}

test('headings enter, leave and return without affecting protected scenes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#about');
  await page.locator('#about-title .motion-title-line').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  for (const id of titles.slice(0, -1)) {
    await place(page, id, 420);
    await visibleLines(page, id);
    await place(page, id, -250);
    await expect.poll(() => page.locator(`#${id} ${id === 'future-title' ? '.motion-title-word' : '.motion-title-line'}`).evaluateAll(lines => lines.every(line => Number(getComputedStyle(line).opacity) < .01))).toBe(true);
    await place(page, id, 420);
    await visibleLines(page, id);
  }
  await expect(page.locator('.hero [data-title-animation], .philosophy [data-title-animation]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [1440, 489, 390]) {
  test(`motion off restores original typography and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => localStorage.setItem('portfolio-reduced-motion', 'true'));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const measure = () => page.locator('[data-title-animation]').evaluateAll(elements => elements.map(el => {
      const style = getComputedStyle(el); const rect = el.getBoundingClientRect();
      return { id: el.id, width: rect.width, height: rect.height, font: style.fontFamily, size: style.fontSize, spacing: style.letterSpacing, text: el.textContent };
    }));
    const before = await measure();
    expect(before).toHaveLength(titles.length);
    await page.getByRole('button', { name: 'Motion reduced', exact: true }).click();
    await page.locator('#awards-title .motion-title-line').first().waitFor({ state: 'attached' });
    const animated = await measure();
    for (let i = 0; i < before.length; i++) {
      expect(animated[i].height, before[i].id).toBeCloseTo(before[i].height, 0);
      expect(animated[i].width, before[i].id).toBeCloseTo(before[i].width, 0);
      expect(animated[i].font).toBe(before[i].font);
      expect(animated[i].size).toBe(before[i].size);
      expect(animated[i].spacing).toBe(before[i].spacing);
    }
    await page.getByRole('button', { name: 'Motion on', exact: true }).click();
    await expect(page.locator('.motion-title-line')).toHaveCount(0);
    expect(await measure()).toEqual(before);
    for (const id of titles) await expect(page.locator(`#${id}`)).toHaveCSS('opacity', '1');
    await expect(page.locator('.contact-accent')).toHaveCSS('color', 'rgb(99, 223, 176)');
  });
}

test('collaboration shows owner-provided pilot and keyboard-accessible details', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#collaboration');
  const section = page.locator('#collaboration');
  await expect(section.getByRole('link', { name: 'Ghazwah Group' })).toHaveAttribute('href', 'https://ghazwahgroup.com/');
  await expect(section).toContainText('AI Marketer');
  await expect(section).toContainText('Pilot: DFK INC / Ghazwah Tech');
  const summary = section.locator('summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(section.getByText(/Jebat coordinates/)).toBeVisible();
  await expect(section.getByText(/Paid ads, pricing/)).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(section.getByText(/Jebat coordinates/)).toBeHidden();
});

test('Hero robot types and erases its greeting, with a static reduced-motion fallback', async ({ page }) => {
  await page.goto('/#index');
  const greeting = page.locator('.hero-greeting-text');
  await expect(greeting).toHaveText("Hi, I'm Symi. Syahmi's digital companion.", { timeout: 20000 });
  await expect.poll(async () => (await greeting.textContent())?.length ?? 0, { timeout: 5000 }).toBeLessThan(38);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(greeting).toHaveText("Hi, I'm Symi. Syahmi's digital companion.");
});

test('rapid reversals, resizing and navigation retain clean title instances', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#about');
  await page.locator('#about-title .motion-title-line').first().waitFor();
  for (const y of [700, -200, 400, 1100, 420]) await place(page, 'selected-title', y);
  await visibleLines(page, 'selected-title');
  await page.setViewportSize({ width: 489, height: 900 });
  await place(page, 'selected-title', 400);
  await visibleLines(page, 'selected-title');
  await page.getByRole('link', { name: 'Quick view', exact: true }).click();
  await expect(page).toHaveURL('/quick');
  await expect(page.locator('.motion-title-line')).toHaveCount(0);
  await page.getByRole('link', { name: 'Syahmi Aof home' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('[data-title-animation]')).toHaveCount(titles.length);
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('.motion-title-line')).toHaveCount(0);
  expect(errors).toEqual([]);
});


test('Journey heading stays readable throughout its pinned stages', async ({ page }) => {
  await page.goto('/#work');
  const heading = page.locator('#journey-title');
  await page.locator('.journey').scrollIntoViewIfNeeded();
  await expect(heading).toHaveCSS('opacity', '1');
  await page.locator('.journey-node').last().click();
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toBeInViewport();
  await page.evaluate(() => window.scrollBy({ top: 120, behavior: 'instant' }));
  await expect(heading).toHaveCSS('opacity', '0');
  await page.evaluate(() => window.scrollBy({ top: -120, behavior: 'instant' }));
  await expect(heading).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toContainText('From a face');
});
