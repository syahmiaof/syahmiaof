import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const samples = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__loadMetrics = { cls: 0, lcp: 0, element: '' };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__loadMetrics.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => {
        const entry = list.getEntries().at(-1);
        window.__loadMetrics.lcp = entry.startTime;
        window.__loadMetrics.element = entry.element?.tagName + '.' + (entry.element?.className ?? '');
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto('http://127.0.0.1:3100', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    samples.push({ name, run, ...await page.evaluate(() => ({
      ...window.__loadMetrics,
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      transferBytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.transferSize, 0),
    })) });
    await context.close();
  }
}
await browser.close();
await writeFile('.impeccable/review/load-report.json', JSON.stringify(samples, null, 2));
console.log(JSON.stringify(samples, null, 2));
