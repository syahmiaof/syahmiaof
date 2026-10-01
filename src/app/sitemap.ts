import type { MetadataRoute } from 'next';
import { canonical } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap { return canonical() ? ['/', '/quick', '/projects/greetly'].map(path => ({ url: canonical(path)!, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.8 })) : []; }
