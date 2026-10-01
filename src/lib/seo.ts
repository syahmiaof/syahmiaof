import { profile } from '@/data/profile';
export function siteOrigin(): string | undefined {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || profile.siteUrl;
  if (!origin) return undefined;
  try { const url = new URL(origin); return ['http:', 'https:'].includes(url.protocol) ? url.origin : undefined; } catch { return undefined; }
}
export function canonical(path = '/') { const origin = siteOrigin(); return origin ? new URL(path, origin).toString() : undefined; }
