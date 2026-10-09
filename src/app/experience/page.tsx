import { PointerMotion } from '@/components/motion/PointerMotion';
import type { Metadata } from 'next';
import { Experience } from '@/components/sections/Experience';
import { Collaborations } from '@/components/sections/Collaborations';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Experience & Leadership', description: 'Client advisory, community IT support, independent development, academy leadership and AI marketing.', alternates: { canonical: canonical('/experience') } };
export default function ExperiencePage() {
  return <><PointerMotion /><main id="main" tabIndex={-1} className="detail-page"><Experience page /><Collaborations /></main><Footer compact /></>;
}
