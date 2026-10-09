import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { TextLink } from '@/components/ui/Primitives';
import { workExperiences } from '@/data/experience';
import { ongoingProjects } from '@/data/projects';
import { featuredPrograms, competitionRecognitions } from '@/data/credentials';

export function OngoingPreview() {
  return <section id="ongoing" data-nav-section="work" className="section summary-section" aria-labelledby="ongoing-preview-title">
    <div className="section-title-row"><AnimatedTitle id="ongoing-preview-title" animation="wave">Ongoing projects.</AnimatedTitle><TextLink href="/projects#ongoing">All development projects</TextLink></div>
    <div className="summary-rows">{ongoingProjects.slice(0, 2).map(project => <article key={project.slug}><div><h3>{project.title.split(' : ')[0]}</h3><span className="status-outline">In development</span></div><p>{project.subtitle}</p><TextLink href={`/projects#${project.slug}`}>View project & progress</TextLink></article>)}</div>
  </section>;
}

export function SkillsPreview() {
  return <section id="skills" data-nav-section="skills" className="section summary-section" aria-labelledby="skills-preview-title">
    <div className="section-title-row"><AnimatedTitle id="skills-preview-title" animation="stack">Skills &<br /><span className="muted">tech stack.</span></AnimatedTitle><TextLink href="/skills">Explore skills & evidence</TextLink></div>
    <div className="focus-columns"><div><h3>Cloud & DevOps</h3><p>Linux, deployment, DNS and connected cloud services, grounded in the projects I build.</p></div><div><h3>AI & automation</h3><p>Agent workflows, tool integration and human approval, with software and edge systems connecting the pieces.</p></div></div>
  </section>;
}

export function ExperiencePreview() {
  const academy = workExperiences.find(role => role.id === 'leadership')!;
  return <section id="experience" data-nav-section="experience" className="section summary-section" aria-labelledby="experience-preview-title">
    <div className="section-title-row"><AnimatedTitle id="experience-preview-title" animation="editorial">Experience &<br /><span className="muted">leadership.</span></AnimatedTitle><TextLink href="/experience">Read the full experience</TextLink></div>
    <p className="preview-lead">Client advisory, community IT support, independent development and running an academy. The people and operations behind my technical work.</p>
    <p className="preview-proof"><strong>{academy.highlight!.value}</strong> {academy.highlight!.label}</p>
  </section>;
}

export function CredentialsPreview() {
  return <section id="credentials" data-nav-section="credentials" className="section summary-section" aria-labelledby="credentials-preview-title">
    <div className="section-title-row"><AnimatedTitle id="credentials-preview-title" animation="continuation">Certificates &<br /><span className="muted">specializations.</span></AnimatedTitle><TextLink href="/credentials">View credentials & awards</TextLink></div>
    <ul className="preview-credentials">{featuredPrograms.slice(0, 3).map(program => <li key={program.slug}><h3>{program.title}</h3><p>{program.issuer} · Completed learning program</p></li>)}</ul>
    <p className="preview-proof">Competition recognition: {competitionRecognitions.map(record => record.event).join(' · ')}</p>
  </section>;
}
