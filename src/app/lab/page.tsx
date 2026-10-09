import { PointerMotion } from '@/components/motion/PointerMotion';
import type { Metadata } from 'next';
import { Lab } from '@/components/sections/Lab';
import { Intelligence } from '@/components/sections/Capabilities';
import { Footer } from '@/components/layout/Footer';
import { PageIndex } from '@/components/navigation/PageIndex';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Technical Lab', description: 'Project scripts, Git exercises and conceptual AI workflows. Experiments kept separate from delivered projects.', alternates: { canonical: canonical('/lab') } };
export default function LabPage() {
  return <><PointerMotion /><main id="main" tabIndex={-1} className="detail-page"><header className="section detail-header"><h1>Technical Lab<span>.</span></h1><p>Code, experiments and learning notes behind the projects. Exploratory work is labelled separately from project implementations.</p><PageIndex items={[{ label: 'Code & experiments', href: '#lab' }, { label: 'AI workflow concepts', href: '#intelligence' }, { label: 'Applied project work', href: '/projects' }]} /></header><Lab /><Intelligence /></main><Footer compact /></>;
}
