import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { positioning } from '@/data/positioning';
import { projects, ongoingProjects } from '@/data/projects';
import { workExperiences } from '@/data/experience';
import { featuredPrograms } from '@/data/credentials';
import { TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { Footer } from '@/components/layout/Footer';
import { PageIndex } from '@/components/navigation/PageIndex';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Quick View — Muhammad Syahmi', description: 'A recruiter overview: Cloud / DevOps direction, selected projects, experience, credentials and CV.', alternates: { canonical: canonical('/quick') } };
export default function QuickPage() {
  const selected = [projects[2], ongoingProjects[0], projects[3]];
  return <><main id="main" tabIndex={-1} className="section quick-page">
    <div className="quick-page-top mono"><span>THE 30-SECOND VERSION</span><TextLink href="/">Full experience</TextLink></div>
    <header className="quick-hero"><div><h1>Muhammad<br />Syahmi<span>.</span></h1><p className="quick-role">{positioning.status} · Malaysia</p><p className="quick-target">{positioning.direction}</p><p className="quick-summary">{positioning.summary}</p><div className="quick-actions"><TextLink href={profile.resumeUrl} external>View CV (PDF)</TextLink><TextLink href={'mailto:' + profile.email}>Email me</TextLink><TextLink href={profile.github} external>GitHub</TextLink></div></div><SafeImage src="/images/syahmic3.png" alt="Muhammad Syahmi" width={960} height={1280} sizes="(max-width: 760px) 30vw, 220px" priority /></header>
    <PageIndex items={[{ label: 'Projects', href: '#quick-projects' }, { label: 'Experience', href: '#quick-experience' }, { label: 'Skills', href: '#quick-skills' }, { label: 'Credentials', href: '#quick-credentials' }, { label: 'Contact', href: '#contact' }]} />
    <section id="quick-projects" className="quick-section"><h2>Selected projects</h2><article className="quick-flagship"><h3>{projects[0].title}</h3><span className="status">Flagship project</span><p>{projects[0].description}</p><p className="mono">{projects[0].stack.join(' / ')}</p><TextLink href="/projects/greetly">Read case study</TextLink></article><div className="quick-projects">{selected.map(project => <article key={project.slug}><div><h3>{project.title}</h3><span className="mono muted">{project.status === 'active' ? 'ACTIVE PROJECT' : 'IN DEVELOPMENT'}</span></div><p>{project.subtitle}</p><TextLink href={project.slug === 'ai-growth-automation' ? '/projects/ai-growth-automation' : project.slug === 'sistem-aduan' ? '/projects#project-aduan' : '/projects#' + project.slug}>View project evidence</TextLink></article>)}</div><TextLink href="/projects">All projects</TextLink></section>
    <section id="quick-experience" className="quick-section"><h2>Experience & leadership</h2><dl className="quick-experience">{workExperiences.map(role => <div key={role.id}><dt>{role.role}</dt><dd>{role.organization}</dd><dd>{role.transferableSkills.join(' · ')}</dd></div>)}</dl><TextLink href="/experience">Full experience & responsibilities</TextLink></section>
    <section id="quick-skills" className="quick-section"><h2>Technical focus</h2><div className="focus-columns"><div><h3>Cloud & DevOps</h3><p>Linux, deployment, DNS and cloud-connected applications. Working toward cloud and DevOps engineering.</p></div><div><h3>AI & connected systems</h3><p>Agent workflows, automation and edge devices, supported by software development and networking.</p></div></div><TextLink href="/skills">Skills, learning & evidence</TextLink></section>
    <section id="quick-credentials" className="quick-section"><h2>Certificates & specializations</h2><ul className="quick-credentials">{featuredPrograms.slice(0,3).map(program => <li key={program.slug}>{program.title} · {program.issuer}</li>)}</ul><p>Completed learning programs. Industry exam targets and competition recognition are listed separately.</p><TextLink href="/credentials">View credential evidence</TextLink></section>
  </main><Footer compact /></>;
}
