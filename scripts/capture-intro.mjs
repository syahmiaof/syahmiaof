import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded' });
  await page.locator('.network-intro[data-phase="connecting"]').waitFor();
  await page.screenshot({ path: `.impeccable/review/${name}-intro.png` });
  await page.locator('.network-intro[data-phase="leaving"]').waitFor();
  await page.waitForTimeout(750);
  await page.screenshot({ path: `.impeccable/review/${name}-intro-transition.png` });
  await page.locator('.network-intro').waitFor({ state: 'detached' });
  await page.screenshot({ path: `.impeccable/review/${name}-intro-revealed.png` });
  await page.close();
}
await browser.close();
