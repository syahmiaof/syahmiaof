import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const value = process.env.NEXT_PUBLIC_SITE_URL || 'https://syahmiaof.my';
try {
  const url = new URL(value);
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Expected a public HTTPS origin.');
  console.log(`SEO origin is configured: ${url.origin}`);
} catch {
  console.error('Set NEXT_PUBLIC_SITE_URL to the actual public HTTPS origin before deployment. Vercel production domain environment is also supported.');
  process.exitCode = 1;
}
