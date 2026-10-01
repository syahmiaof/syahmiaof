import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
const value = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
try {
  const url = new URL(value);
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Expected a public HTTPS origin.');
  console.log(`SEO origin is configured: ${url.origin}`);
} catch {
  console.error('Set NEXT_PUBLIC_SITE_URL to the actual public HTTPS origin before deployment. Vercel production domain environment is also supported.');
  process.exitCode = 1;
}
