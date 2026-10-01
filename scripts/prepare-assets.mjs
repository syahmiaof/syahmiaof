import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('public/images', { recursive: true });
await sharp('syahmi.jpg').resize({ width: 960, withoutEnlargement: true }).webp({ quality: 86 }).toFile('public/images/syahmi.webp');
await sharp('public/images/greetly-device.jpg').resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 85 }).toFile('public/images/greetly-device.webp');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const sources = [];
for (const [name, url] of [['daeng-kuning', 'https://daengkuning.my'], ['nurizma-bridal', 'https://henna.nurizmabridal.my']]) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1800);
    if (name === 'nurizma-bridal') { await page.locator('#close-fomo').click(); await page.waitForTimeout(500); }
    const buffer = await page.screenshot({ fullPage: false });
    await sharp(buffer).webp({ quality: 88 }).toFile(`public/images/${name}.webp`);
    sources.push({ name, url, title: await page.title(), captured: new Date().toISOString() });
    console.log(name, await page.title());
  } catch (error) { console.error(name, error.message); process.exitCode = 1; }
}
await writeFile('docs/screenshot-sources.json', JSON.stringify(sources, null, 2));
await browser.close();
