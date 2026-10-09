import { test, expect } from '@playwright/test';
import { GenerateContentResponse, type GenerateContentParameters } from '@google/genai';
import { generateSymiAnswer, SymiServiceError } from '../src/lib/symi-server';
import { PDFDocument } from 'pdf-lib';

test('temporary Gemini failure uses the alternate model with conversation context', async () => {
  const calls: GenerateContentParameters[] = [];
  const result = await generateSymiAnswer('What did he build?', [{ role: 'user', text: 'Tell me about CerviScan-AI' }], async params => {
    calls.push(params);
    if (calls.length === 1) throw Object.assign(new Error('Unavailable'), { status: 503 });
    const response = new GenerateContentResponse();
    response.candidates = [{ content: { parts: [{ text: 'He builds the CMS and video-streaming application.' }] } }];
    return response;
  });
  expect(result.source).toBe('gemini');
  expect(calls).toHaveLength(2);
  expect(calls[0].model).not.toBe(calls[1].model);
  expect(JSON.stringify(calls[1].contents)).toContain('CerviScan-AI');
});

test('authentication errors do not retry or leak provider diagnostics', async () => {
  let calls = 0;
  try {
    await generateSymiAnswer('hello', [], async () => { calls++; throw Object.assign(new Error('secret-provider-details'), { status: 403 }); });
    throw new Error('Expected service failure');
  } catch (error) {
    expect(error).toBeInstanceOf(SymiServiceError);
    expect((error as Error).message).not.toContain('secret-provider-details');
  }
  expect(calls).toBe(1);
});

test('chat rejects malformed, oversized and cross-origin requests before calling Gemini', async ({ request }) => {
  expect((await request.post('/api/chat', { data: { message: { prompt: 'bad' } } })).status()).toBe(400);
  expect((await request.post('/api/chat', { data: { message: 'x'.repeat(501) } })).status()).toBe(400);
  expect((await request.post('/api/chat', { headers: { Origin: 'https://unrelated.example' }, data: { message: 'hello' } })).status()).toBe(403);
});

test('CV is a real PDF with preview and download responses', async ({ request }) => {
  const view = await request.get('/api/resume');
  expect(view.ok()).toBe(true);
  expect(view.headers()['content-type']).toBe('application/pdf');
  expect(view.headers()['content-disposition']).toContain('inline');
  const pdf = await PDFDocument.load(await view.body());
  expect(pdf.getPageCount()).toBeLessThanOrEqual(2);
  expect(pdf.getTitle()).toContain('Muhammad Syahmi');
  const download = await request.get('/api/resume?download=1');
  expect(download.headers()['content-disposition']).toContain('attachment');
});

test('chat error preserves question and allows a successful retry', async ({ page }) => {
  await page.goto('/quick');
  await page.getByRole('button', { name: 'Ask Symi about Syahmi' }).click();
  const input = page.getByRole('textbox', { name: 'Ask Symi a question' });
  await page.route('**/api/chat', route => route.fulfill({ status: 503, json: { error: 'Gemini is busy. Please try again.' } }));
  await input.fill('Explain CerviScan-AI in Malay');
  await input.press('Enter');
  await expect(page.locator('#symi-panel').getByRole('alert')).toContainText('Gemini is busy');
  await expect(input).toHaveValue('Explain CerviScan-AI in Malay');
  await page.unroute('**/api/chat');
  await page.route('**/api/chat', route => route.fulfill({ json: { text: 'CerviScan ialah prototaip penyelidikan.', source: 'gemini' } }));
  await input.press('Enter');
  await expect(page.locator('.symi-log')).toContainText('CerviScan ialah prototaip');
  await expect(page.locator('#symi-panel').getByRole('alert')).toHaveCount(0);
});

test('GayongX keeps only the main website image at readable mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#gayongx');
  const image = page.locator('#gayongx .ongoing-preview img');
  await expect(image).toHaveCount(1);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('alt', /GayongX.*preview/);
  await expect(image).toHaveAttribute('src', /gayongx-website/);
  expect((await image.boundingBox())!.width).toBeGreaterThan(300);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
