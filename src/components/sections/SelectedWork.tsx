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
  const [daeng, nurizma, aduan, aiGrowth] = projects.slice(1);
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

  return <section ref={containerRef} id="selected" className="section selected-section" aria-labelledby="selected-title"><div className="section-title-row"><AnimatedTitle as="h3" animation="opposing" id="selected-title">More active<br /><span className="muted">projects.</span></AnimatedTitle><p>From cultural heritage to everyday workflows.<br />A few things I’ve put into the world.</p></div><div className="selected-grid"><article className="project-editorial project-daeng"><a href={daeng.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" data-cursor="VIEW"><SafeImage src={daeng.image!} alt="Actual Daeng Kuning website showing its silat academy identity and heritage presentation" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 52vw" /></a><div className="project-caption"><span className="mono muted">CULTURE / WEB EXPERIENCE</span><h3>{daeng.title}</h3><p>{daeng.description}</p><TextLink href={daeng.github!} external>View source</TextLink></div></article><article className="project-editorial project-nurizma"><a href={nurizma.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" data-cursor="VIEW"><SafeImage src={nurizma.image!} alt="Actual Nurizma Bridal website presenting henna services and bridal work" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 35vw" /></a><div className="project-caption"><span className="mono muted">CRAFT / SERVICE WEBSITE</span><h3>{nurizma.title}</h3><p>{nurizma.description}</p><TextLink href={nurizma.github!} external>View source</TextLink></div></article></div><article className="project-aduan project-aduan-preview"><div><span className="mono muted">WORKFLOW / CLOUD APPLICATION</span><h3>{aduan.title}</h3><p>{aduan.description}</p><div className="project-links"><TextLink href={aduan.liveUrl!} external>Visit live website</TextLink><TextLink href={aduan.github!} external>View source</TextLink></div></div><a href={aduan.liveUrl} target="_blank" rel="noopener noreferrer" className="project-image" aria-label="Open Sistem Aduan Asrama live website" data-cursor="VIEW"><SafeImage src={aduan.image!} alt="Portal E-Aduan Asrama TVET MARA Besut homepage with report, status and warden entry points" width={1440} height={1000} sizes="(max-width: 760px) 90vw, 45vw" /></a></article><article className="project-aduan" style={{ borderTop: 0, paddingTop: 0 }}><div><span className="mono muted">AI / GROWTH / AUTOMATION</span><h3>{aiGrowth.title}</h3><p>{aiGrowth.description}</p><TextLink href={aiGrowth.liveUrl!}>EXPLORE THE CASE STUDY</TextLink></div><div className="aduan-workflow" aria-label="AI Agent workflow"><div><span>01</span>DETECT</div><i /><div><span>02</span>QUALIFY</div><i /><div><span>03</span>SCORE</div><i /><div><span>04</span>HANDOFF</div><p className="mono" style={{ textAlign: 'left', marginTop: '30px', color: 'var(--fg-primary)' }}>WIRA FB → PEMBURU → DUTA</p><p className="mono" style={{ marginTop: '10px' }}>INFERENCE GATEWAY · TELEMETRY · DLQ · SELF-HEALING</p><div style={{ width: '100%', textAlign: 'right', marginTop: '20px' }}><span className="status-outline">PROTOTYPE / INTEGRATION</span></div></div></article></section>;
}

