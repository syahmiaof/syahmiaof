import type { SocialPlatform } from '@/data/profile';

export function SocialIcon({ platform }: { platform: SocialPlatform }) {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {platform === 'facebook' && <path d="M14.5 21v-8h3l.5-4h-3.5V7c0-1 .3-2 2-2H18V1.5a20 20 0 0 0-2.5-.2C12 1.3 10 3.4 10 6.7V9H7v4h3v8z" />}
    {platform === 'instagram' && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></>}
    {platform === 'linkedin' && <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M11 17v-7m0 3c0-4 6-4 6 0v4" /><circle cx="7" cy="7" r=".8" fill="currentColor" stroke="none" /></>}
    {platform === 'tiktok' && <path d="M14 3h3c.3 2.4 1.7 3.8 4 4v3a9 9 0 0 1-4-1v7a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3z" />}
    {platform === 'threads' && <path d="M19.5 7C18.4 3.8 15.9 2 12 2 5.8 2 3 6 3 12s3 10 9 10c5 0 8-2.8 8-6.5 0-4-3.5-6-7.5-6-3.2 0-5 1.4-5 3.5 0 2 1.5 3 3.5 3 2.7 0 4-1.9 4-5V9c0-2.7-1.5-4-3.5-4-1.4 0-2.6.6-3.2 1.8" />}
    {platform === 'github' && <path d="M9 20c-4 1.2-4-2-5-2.5M15 22v-4c0-1-.3-1.7-.8-2.2 2.8-.3 5.8-1.4 5.8-6.3 0-1.4-.5-2.5-1.3-3.4.2-.4.6-1.7-.1-3.4 0 0-1.1-.4-3.6 1.3a12 12 0 0 0-6 0C6.5 2.3 5.4 2.7 5.4 2.7c-.7 1.7-.3 3-.1 3.4C4.5 7 4 8.1 4 9.5c0 4.9 3 6 5.8 6.3-.5.5-.8 1.2-.8 2.2v4" />}
  </svg>;
}
