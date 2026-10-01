import type { MetadataRoute } from 'next';
import { canonical } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap { return canonical() ? ['/', '/quick', '/credentials', '/projects/greetly', '/projects/ai-growth-automation'].map(path => ({ url: canonical(path)!, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.8 })) : []; }
