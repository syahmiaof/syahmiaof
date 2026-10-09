'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { TextLink } from '@/components/ui/Primitives';
import { useReducedMotion } from '@/hooks/useExperience';
import { experienceStory, workExperiences } from '@/data/experience';
import './experience.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Experience({ page = false }: { page?: boolean }) {
  const RoleHeading = page ? 'h2' : 'h3';
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const chapters = gsap.utils.toArray<HTMLElement>('.road-chapter', section.current);
    // State follows native scroll even with motion off. Text is always in the DOM.
    chapters.forEach((chapter, index) => {
      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 45%', end: 'bottom 45%',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
        onRefresh: self => { if (self.isActive) setActive(index); },
      });
      if (!reduced) {
        gsap.fromTo(chapter.querySelector('.road-rule'),
          { scaleX: .08 },
          { scaleX: 1, duration: .85, ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 85%', toggleActions: 'play none none reverse' } },
        );
      }
    });
  }, { scope: section, dependencies: [reduced], revertOnUpdate: true });

  return <section ref={section} id="experience" className="section road-section" aria-labelledby="experience-title">
    <header className="road-heading">
      <AnimatedTitle as={page ? 'h1' : 'h2'} id="experience-title" animation="editorial">{experienceStory.title}<span className="signal-text">.</span></AnimatedTitle>
      <p>{experienceStory.intro}</p>
    </header>
    <div className="road-layout">
      <aside className="road-index" aria-label="The road here">
        <p className="road-index-title">{experienceStory.indexTitle}</p>
        <p className="road-index-note">{experienceStory.indexNote}</p>
        <nav aria-label="Experience chapters">
          <ol>{workExperiences.map((experience, index) => <li key={experience.id}>
            <a href={`#experience-${experience.id}`} aria-current={active === index ? 'step' : undefined}>
              <span className="road-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span>{experience.chapter}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </li>)}</ol>
        </nav>
      </aside>
      <div className="road-chapters">
        {workExperiences.map((experience, index) => <article
          key={experience.id} id={`experience-${experience.id}`}
          className="road-chapter" aria-labelledby={`road-role-${experience.id}`}
          data-active={active === index}>
          <div className="road-rule" aria-hidden="true" />
          <div className="road-chapter-meta"><span>{String(index + 1).padStart(2, '0')} / {experience.chapter}</span><span>{experience.organization}</span></div>
          <RoleHeading id={`road-role-${experience.id}`}>{experience.role}</RoleHeading>
          <p className="road-summary">{experience.summary}</p>
          <div className="road-detail">{experience.responsibilities.map(text => <p key={text}>{text}</p>)}</div>
          {experience.highlight && <p className="road-grant"><strong>{experience.highlight.value}</strong><span>{experience.highlight.label}</span></p>}
          <ul className="road-skills" aria-label={`Skills from ${experience.role}`}>
            {experience.transferableSkills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
          {experience.link && <TextLink href={experience.link.href}>{experience.link.label}</TextLink>}
        </article>)}
      </div>
    </div>
    <footer className="road-conclusion">
      <div><h3>{experienceStory.conclusion}</h3><p>{experienceStory.conclusionDetail}</p></div>
      <div><p className="road-direction">{experienceStory.direction}</p><TextLink href="/#work">The systems I build</TextLink></div>
    </footer>
  </section>;
}
