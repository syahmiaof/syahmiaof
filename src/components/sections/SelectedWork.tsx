'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, syncedActiveProjects } from '@/data/projects';
import { TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger);

interface SelectedWorkProps {
  all?: boolean;
}

export function SelectedWork({ all = false }: SelectedWorkProps) {
  const daeng = projects.find(p => p.slug === 'daeng-kuning')!;
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const featuredSlugs = ['siapsatu', 'sistem-aduan', 'modul-meta-ads', 'studio-syahmiaof'];
  const remainingActiveProjects = projects.filter(p => p.slug !== 'greetly' && p.slug !== 'daeng-kuning');
  const activeList = all
    ? remainingActiveProjects
    : remainingActiveProjects.filter(p => featuredSlugs.includes(p.slug));

  useEffect(() => {
    if (reducedMotion) return;
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.project-editorial');
      cards.forEach(card => {
        gsap.fromTo(card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });

      const workflows = gsap.utils.toArray<HTMLElement>('.project-aduan');
      workflows.forEach(workflow => {
        gsap.fromTo(workflow,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: workflow,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} id="selected" className="section selected-section" aria-labelledby="selected-title">
      <div className="section-title-row">
        <AnimatedTitle as="h3" animation="opposing" id="selected-title">
          More active<br /><span className="muted">projects.</span>
        </AnimatedTitle>
        <p>
          From cultural heritage to everyday workflows.<br />
          A few things I’ve put into the world.
        </p>
      </div>

      <div className="selected-grid">
        <article className="project-editorial project-daeng">
          <a href={daeng.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" data-cursor="VIEW">
            <SafeImage
              src={daeng.image!}
              alt="Actual Daeng Kuning website showing its silat academy identity and heritage presentation"
              width={1440}
              height={1000}
              sizes="(max-width: 760px) 90vw, 52vw"
            />
          </a>
          <div className="project-caption">
            <span className="mono muted">{daeng.category ?? 'CULTURE / WEB EXPERIENCE'}</span>
            <h3>{daeng.title}</h3>
            <p>{daeng.description}</p>
            <div className="project-links">
              {daeng.liveUrl && <TextLink href={daeng.liveUrl} external>Visit live website</TextLink>}
              {daeng.github && <TextLink href={daeng.github} external>View source</TextLink>}
            </div>
          </div>
        </article>
      </div>

      {activeList.map((project) => (
        <article
          key={project.slug}
          id={`project-${project.slug}`}
          className="project-aduan project-aduan-preview"
        >
          <div>
            <span className="mono muted">{project.category ?? 'WORKFLOW / APPLICATION'}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="synced-project-stack" aria-label={`${project.title} technology stack`}>
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <div className="project-links">
              {project.liveUrl && <TextLink href={project.liveUrl} external>Visit live website</TextLink>}
              {project.github && <TextLink href={project.github} external>View source</TextLink>}
            </div>
          </div>
          {project.image && (
            <a
              href={project.liveUrl ?? project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-image"
              aria-label={`Open ${project.title} live website`}
              data-cursor="VIEW"
            >
              <SafeImage
                src={project.image}
                alt={`${project.title} preview`}
                width={1440}
                height={1000}
                sizes="(max-width: 760px) 90vw, 45vw"
              />
            </a>
          )}
        </article>
      ))}

      {syncedActiveProjects.map((project) => (
        <article
          key={project.slug}
          id={`project-${project.slug}`}
          className="project-aduan project-aduan-preview synced-project"
        >
          <div>
            <span className="mono muted">{project.category ?? 'GITHUB SYNC / ACTIVE PROJECT'}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="synced-project-stack" aria-label={`${project.title} technology stack`}>
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <div className="project-links">
              {project.liveUrl && <TextLink href={project.liveUrl} external>Visit live website</TextLink>}
              {project.github && <TextLink href={project.github} external>View source</TextLink>}
            </div>
          </div>
          {project.image && (
            <a
              href={project.liveUrl ?? project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-image"
              aria-label={`Open ${project.title}`}
              data-cursor="VIEW"
            >
              <SafeImage
                src={project.image}
                alt={`${project.title} project preview`}
                width={1440}
                height={1000}
                sizes="(max-width: 760px) 90vw, 45vw"
              />
            </a>
          )}
        </article>
      ))}

      {!all && (
        <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)' }}>
          <TextLink href="/projects">
            Explore all {projects.length + syncedActiveProjects.length - 1} active &amp; open-source projects in directory &rarr;
          </TextLink>
        </div>
      )}
    </section>
  );
}
