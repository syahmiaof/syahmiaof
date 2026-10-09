import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { About, Philosophy } from '@/components/sections/About';
import { ExperiencePreview, SkillsPreview, CredentialsPreview, OngoingPreview } from '@/components/sections/HomePreviews';
import { LegacyAnchors } from '@/components/navigation/LegacyAnchors';
import { PageIndex } from '@/components/navigation/PageIndex';
import { Greetly } from '@/components/sections/Greetly';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ProjectChapter } from '@/components/sections/ProjectChapter';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';
import { HomeMotion } from '@/components/motion/HomeMotion';
import { NetworkIntro } from '@/components/motion/NetworkIntro';
import { PointerMotion } from '@/components/motion/PointerMotion';
export const metadata: Metadata = { alternates: { canonical: canonical('/') } };
export default function Home() {
  return <><LegacyAnchors /><NetworkIntro /><HomeMotion /><PointerMotion /><main id="main" tabIndex={-1}><Hero /><About /><Philosophy /><section id="work" data-nav-section="work" className="work-chapter" aria-labelledby="work-title"><ProjectChapter /><div className="project-jump"><PageIndex items={[{ label: 'Greetly', href: '#greetly' }, { label: 'More active projects', href: '#selected' }, { label: 'Ongoing projects', href: '#ongoing' }, { label: 'All projects', href: '/projects' }]} /></div><Greetly /><SelectedWork /></section><OngoingPreview /><SkillsPreview /><ExperiencePreview /><CredentialsPreview /></main><Footer /></>;
}
