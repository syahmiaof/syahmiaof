import { PointerMotion } from '@/components/motion/PointerMotion';
import type { Metadata } from 'next';
import { Capabilities } from '@/components/sections/Capabilities';
import { TechStack } from '@/components/sections/TechStack';
import { PageIndex } from '@/components/navigation/PageIndex';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Skills & Tech Stack', description: 'Cloud and DevOps skills, AI automation, project evidence and ongoing learning.', alternates: { canonical: canonical('/skills') } };
export default function SkillsPage() {
  return <><PointerMotion /><main id="main" tabIndex={-1} className="detail-page"><header className="section detail-header"><h1>Skills &<br />tech stack<span>.</span></h1><p>Cloud and DevOps are my direction. AI automation, software and edge systems are how I connect the work.</p><PageIndex items={[{ label: 'Skills in context', href: '#capabilities' }, { label: 'Used in projects', href: '#used' }, { label: 'Hands-on / labs', href: '#labs' }, { label: 'Currently learning', href: '#learning' }, { label: 'Technical Lab', href: '/lab' }]} /></header><Capabilities /><TechStack /></main><Footer compact /></>;
}
