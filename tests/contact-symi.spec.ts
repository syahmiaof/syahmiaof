import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('contact links use supplied details and unpublished profiles remain honest', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('#contact');
  await expect(footer.getByRole('link', { name: /Email me/ })).toHaveAttribute('href', 'mailto:syahmiaof123@gmail.com');
  await expect(footer.getByRole('link', { name: /talk on WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/60107965236');
  await expect(footer.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/syahmiaof');
  for (const name of ['Facebook', 'TikTok', 'Instagram', 'Threads', 'LinkedIn']) {
    await expect(footer.getByRole('img', { name: `${name} profile coming soon` })).toHaveCount(1);
    await expect(footer.getByRole('link', { name, exact: true })).toHaveCount(0);
  }
  await expect(page.locator('#awards')).toContainText('Awards and competition highlights will be shared here.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',  /^https:\/\/syahmiaof\.my\/?$/);
});

test('Symi answers portfolio prompts, renders unknown input safely and returns focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/quick');
  await page.getByRole('button', { name: 'Ask Symi about Syahmi' }).click();
  const panel = page.getByRole('dialog', { name: 'Symi', exact: true });
  const input = panel.getByRole('textbox', { name: 'Ask Symi a question' });
  await expect(input).toBeFocused();
  await expect(panel).toContainText('tuan saya, Syahmi');
  await panel.getByRole('button', { name: 'How can I contact him?' }).click();
  await expect(panel.getByRole('link', { name: 'WhatsApp Syahmi' })).toHaveAttribute('href', 'https://wa.me/60107965236');
  await panel.getByRole('button', { name: 'What does he work with?' }).click();
  await expect(panel).toContainText('Next.js, Python, OpenCV');
  await input.fill('<img src=x onerror=alert(1)>');
  await input.press('Enter');
  await expect(panel.locator('img')).toHaveCount(0);
  await expect(panel).toContainText('I don’t have that information');
  await input.fill('Are you connected to Gemini?');
  await input.press('Enter');
  await expect(panel).toContainText('not connected to a live AI model');
  await expect(input).toHaveAttribute('maxlength', '500');
  const audit = await new AxeBuilder({ page }).include('#symi-panel').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations.map(item => item.id)).toEqual([]);
  await input.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ask Symi about Syahmi' })).toBeFocused();
  expect(errors).toEqual([]);
});

for (const size of [{ width: 390, height: 844 }, { width: 489, height: 449 }, { width: 390, height: 420 }]) {
  test(`Symi remains usable at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/quick');
    await page.getByRole('button', { name: 'Ask Symi about Syahmi' }).click();
    const panel = page.locator('#symi-panel');
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(size.width);
    expect(box.y + box.height).toBeLessThanOrEqual(size.height);
    const input = panel.getByRole('textbox');
    await expect(input).toBeInViewport();
    await input.fill('Who is Syahmi?');
    await panel.getByRole('button', { name: 'Send message' }).click();
    await expect(panel).toContainText('cloud computing student based in Malaysia');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('sitemap includes both case studies on the public domain', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const content = await response.text();
  expect(content).toContain('https://syahmiaof.my/projects/ai-growth-automation');
  expect(content).toContain('https://syahmiaof.my/projects/greetly');
});
