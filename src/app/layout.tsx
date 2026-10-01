import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './responsive.css';
import { Navigation } from '@/components/navigation/Navigation';
import { ExperienceControls } from '@/components/layout/ExperienceControls';
import { canonical, siteOrigin } from '@/lib/seo';
import { profile } from '@/data/profile';

const display = localFont({ src: '../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2', variable: '--font-display-loaded', display: 'swap', weight: '300 700', preload: true });
const mono = localFont({ src: '../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', variable: '--font-mono-loaded', display: 'swap', weight: '400', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin() ?? 'http://localhost:3000'),
  title: { default: 'Syahmi Aof — Cloud, DevOps & Intelligent Systems', template: '%s | Syahmi Aof' },
  description: 'Muhammad Syahmi’s portfolio: cloud computing, DevOps, intelligent systems and edge-to-cloud engineering. Explore Greetly and selected builds.',
  openGraph: { title: 'SYAHMI AOF — Digital Infrastructure', description: 'I build systems that connect. Cloud / DevOps / AI / Edge.', type: 'website', locale: 'en_MY' },
  twitter: { card: 'summary_large_image', title: 'SYAHMI AOF — Digital Infrastructure', description: 'Cloud / DevOps / AI / Edge. I build systems that connect.' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#0b0e0c', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, alternateName: profile.displayName, ...(canonical() ? { url: canonical() } : {}), sameAs: [profile.github], description: profile.description, jobTitle: profile.role };
  return <html lang="en" className={`${display.variable} ${mono.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><Navigation />{children}<ExperienceControls /></body></html>;
}
