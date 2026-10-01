import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = '.impeccable/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = [];
for (const [name, width, height] of [['desktop',1440,1000], ['laptop',1280,800], ['tablet',768,1024], ['mobile',390,844], ['mobile-small',360,800], ['user-1270',1270,714]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', error=>errors.push(error.message));
  page.on('console', message=>{if(message.type()==='error') errors.push(message.text())});
  await page.addInitScript(() => {
    window.__metrics = { cls:0, lcp:0 };
    new PerformanceObserver(list => {for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.__metrics.cls+=entry.value}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list => {window.__metrics.lcp=list.getEntries().at(-1).startTime}).observe({type:'largest-contentful-paint',buffered:true});
  });
  await page.goto('http://127.0.0.1:3100', {waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1000);
  // Freeze load-only metrics before scripted scrolling creates later paint candidates.
  const initialLoadMetrics = await page.evaluate(()=>window.__metrics);
  await page.screenshot({path:`${out}/${name}-hero.png`});
  for(const id of ['about','work','selected','lab','capabilities','intelligence','credentials','contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    if(name==='desktop'||name==='mobile') {
      await page.locator(`#${id}`).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 94));
      await page.waitForTimeout(250);
      await page.screenshot({path:`${out}/${name}-${id}.png`});
    }
  }
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(800);
  await page.screenshot({path:`${out}/${name}.png`,fullPage:true});
  report.push({name,width,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),initialLoadMetrics});
  if(name==='desktop'||name==='mobile') for(const [key,path] of [['quick','/quick'],['case','/projects/greetly']]) {
    await page.goto(`http://127.0.0.1:3100${path}`,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})))});
    await page.screenshot({path:`${out}/${name}-${key}.png`,fullPage:true});
  }
  await page.close();
}
await writeFile(`${out}/browser-report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
