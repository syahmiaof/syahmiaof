import { PointerMotion } from '@/components/motion/PointerMotion';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import { TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { OngoingProjects } from '@/components/sections/OngoingProjects';
import { PageIndex } from '@/components/navigation/PageIndex';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Projects', description: 'Greetly attendance system, delivered websites and ongoing AI, community and edge projects by Muhammad Syahmi.', alternates: { canonical: canonical('/projects') } };
export default function ProjectsPage() {
  const greetly = projects[0];
  return <><PointerMotion /><main id="main" tabIndex={-1} className="detail-page"><header className="section detail-header"><h1>Projects<span>.</span></h1><p>Working systems and builds in development. Start with Greetly, then explore the problem each project addresses.</p><PageIndex items={[{ label: 'Greetly', href: '#flagship' }, { label: 'Active projects', href: '#selected' }, { label: 'Ongoing projects', href: '#ongoing' }, { label: 'Technical Lab', href: '/lab' }]} /></header><section id="flagship" className="section project-feature"><div><h2>{greetly.title}</h2><span className="status">Flagship project</span><p>{greetly.description}</p><TextLink href="/projects/greetly">Read the engineering case study</TextLink><TextLink href="/#greetly">Explore the cinematic walkthrough</TextLink></div><SafeImage src={greetly.image!} alt="Greetly attendance device concept" width={1440} height={900} sizes="(max-width: 760px) 90vw, 45vw" /></section><SelectedWork /><OngoingProjects /></main><Footer compact /></>;
}
