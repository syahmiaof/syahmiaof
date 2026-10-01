import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = [];
for (const [name, width, height] of [['desktop',1440,1000],['laptop',1280,800],['mobile',390,844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:3100/#index', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.impeccable/review/${name}-robot.png` });
  if (name === 'desktop') {
    await page.mouse.move(600, 340); await page.waitForTimeout(850);
    await page.screenshot({ path: '.impeccable/review/robot-look-left.png' });
    await page.mouse.move(1320, 460); await page.waitForTimeout(850);
    await page.screenshot({ path: '.impeccable/review/robot-look-right.png' });
    await page.locator('.portrait').hover({ position: { x: 30, y: 100 } });
    await page.waitForTimeout(700);
    await page.screenshot({ path: '.impeccable/review/portrait-hover.png' });
    await page.locator('.project-image').first().hover({ position: { x: 60, y: 70 } });
    await page.waitForTimeout(700);
    await page.screenshot({ path: '.impeccable/review/project-hover.png' });
  }
  report.push({ name, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile('.impeccable/review/motion-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
await browser.close();
