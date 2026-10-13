'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import { TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger);

export function SelectedWork() {
  const daeng = projects.find(p => p.slug === 'daeng-kuning')!;
  const aduan = projects.find(p => p.slug === 'sistem-aduan')!;
  const metaAds = projects.find(p => p.slug === 'modul-meta-ads')!;
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    
    const ctx = gsap.context(() => {
      // Idea A: Project Card Slide & Fade up
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

      // Idea B: Booting Sequence for workflows
      const workflows = gsap.utils.toArray<HTMLElement>('.project-aduan');
      workflows.forEach(workflow => {
        const elements = workflow.querySelectorAll('.aduan-workflow > div, .aduan-workflow i');
        if (!elements.length) return;
        
        gsap.fromTo(elements,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.15, // Sequential boot up
            ease: 'power2.out',
            scrollTrigger: {
              trigger: workflow,
              start: 'top 80%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return <section ref={containerRef} id="selected" className="section selected-section" aria-labelledby="selected-title"><div className="section-title-row"><AnimatedTitle as="h3" animation="opposing" id="selected-title">More active<br /><span className="muted">projects.</span></AnimatedTitle><p>From cultural heritage to everyday workflows.<br />A few things I’ve put into the world.</p></div><div className="selected-grid"><article className="project-editorial project-daeng"><a href={daeng.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" data-cursor="VIEW"><SafeImage src={daeng.image!} alt="Actual Daeng Kuning website showing its silat academy identity and heritage presentation" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 52vw" /></a><div className="project-caption"><span className="mono muted">CULTURE / WEB EXPERIENCE</span><h3>{daeng.title}</h3><p>{daeng.description}</p><TextLink href={daeng.github!} external>View source</TextLink></div></article></div><article id="project-aduan" className="project-aduan project-aduan-preview"><div><span className="mono muted">WORKFLOW / CLOUD APPLICATION</span><h3>{aduan.title}</h3><p>{aduan.description}</p><div className="project-links"><TextLink href={aduan.liveUrl!} external>Visit live website</TextLink><TextLink href={aduan.github!} external>View source</TextLink></div></div><a href={aduan.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" aria-label="Open Sistem Aduan Asrama live website" data-cursor="VIEW"><SafeImage src={aduan.image!} alt="Portal E-Aduan Asrama TVET MARA Besut homepage with report, status and warden entry points" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 45vw" /></a></article><article id="project-meta-ads" className="project-aduan project-aduan-preview" style={{ borderTop: 0, paddingTop: 0 }}><div><span className="mono muted">AI AGENT / MARKETING AUTOMATION</span><h3>{metaAds.title}</h3><p>{metaAds.description}</p><div className="project-links"><TextLink href={metaAds.liveUrl!} external>Visit live website</TextLink>{metaAds.github && <TextLink href={metaAds.github} external>View source</TextLink>}</div></div><a href={metaAds.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" aria-label="Open Modul Meta Ads & AI Agent Automation live website" data-cursor="VIEW"><SafeImage src={metaAds.image!} alt="Panduan Meta Ads & API Automation Dari Sifar" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 45vw" /></a></article></section>;
}

