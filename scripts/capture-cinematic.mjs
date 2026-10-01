import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const reports = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['laptop', 1280, 800], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:3100/#index', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `.impeccable/review/${name}-cinematic-hero.png` });
  const stage = page.locator('.journey-stage');
  if (width >= 1100) {
    const start = await stage.evaluate(el => el.getBoundingClientRect().top + scrollY - 100);
    for (const [label, distance] of [['assembled', 5], ['exploded', 800], ['record', 1800]]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), start + distance);
      await page.waitForTimeout(1100);
      await page.screenshot({ path: `.impeccable/review/${name}-greetly-${label}.png` });
    }
  } else {
    await page.locator('.journey').scrollIntoViewIfNeeded();
    await page.screenshot({ path: '.impeccable/review/mobile-greetly-cinematic.png' });
  }
  reports.push({ name, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile('.impeccable/review/cinematic-report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
await browser.close();
