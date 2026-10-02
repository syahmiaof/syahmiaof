import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { ongoingProjects } from '@/data/projects';
import { TextLink } from '@/components/ui/Primitives';
import { ArrowDownRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export function OngoingProjects() {
  return <section id="ongoing" className="section ongoing-section" aria-labelledby="future-title">
    <div className="section-title-row"><AnimatedTitle animation="wave" id="future-title">Ongoing<br /><span className="muted">projects.</span></AnimatedTitle><p>Two builds in development.<br />The work, its scope, and where it stands.</p></div>
    <div className="ongoing-projects">{ongoingProjects.map(project => <article key={project.slug} id={project.slug} className="ongoing-project">
      <div className="ongoing-identity">
        <h3>{project.title}</h3>
        <span className="status-outline mono">In development</span>
        <p>{project.subtitle}</p>
        <p className="ongoing-stage">{project.stage}</p>
      </div>
      <div className="ongoing-description"><p>{project.description}</p><ul className="ongoing-scope" aria-label={`${project.title} development scope`}>{project.scope.map(scope => <li key={scope}>{scope}</li>)}</ul>
        <details><summary>Explore development notes<ArrowDownRight size={18} aria-hidden="true" /></summary><p>{project.developmentNote}</p><p className="mono">Current interface: {project.stack.join(' / ')}</p></details>
        {project.liveUrl ? <div className="project-links"><TextLink href={project.liveUrl} external>Explore the dashboard prototype</TextLink>{project.github && <TextLink href={project.github} external>View source</TextLink>}</div> : <p className="ongoing-availability">Public demo coming after the initial build.</p>}
        {project.image && project.liveUrl && <figure className="ongoing-preview"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" aria-label={`Open ${project.title} dashboard prototype`} data-cursor="VIEW"><SafeImage src={project.image} alt="CerviScan-AI prototype CMS overview with screening trend and risk distribution charts using demo data" width={1440} height={740} sizes="(max-width: 760px) 90vw, 45vw" /></a><figcaption>Dashboard prototype &middot; Demo data; displayed metrics and certification labels are unverified.</figcaption></figure>}
      </div>
      {project.images && <div className="ongoing-gallery" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
        {project.images.map((img, idx) => (
          <figure key={idx} className="ongoing-preview" style={{ marginTop: 0 }}>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" data-cursor="VIEW">
              <SafeImage src={img.src} alt={img.alt} width={1440} height={810} sizes="(max-width: 760px) 90vw, 30vw" />
            </a>
            <figcaption dangerouslySetInnerHTML={{ __html: img.caption }} style={{ fontSize: '13px', lineHeight: '1.4' }} />
          </figure>
        ))}
      </div>}
    </article>)}</div>
  </section>;
}
