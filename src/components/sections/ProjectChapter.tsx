'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useExperience';
import { projects } from '@/data/projects';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProjectChapter() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !root.current) return;
    const element = root.current;
    let disposed = false;
    const timeline = gsap.timeline({
      scrollTrigger: { id: 'active-projects-chapter', trigger: element, start: 'top 90%', end: 'bottom top+=95', scrub: .65, invalidateOnRefresh: true },
      defaults: { ease: 'power3.out' },
    });
    timeline.addLabel('assemble')
      .fromTo('.chapter-word', { yPercent: 65, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .15 }, 'assemble')
      .fromTo('.chapter-circuit', { x: 32, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 'assemble+=.1')
      .fromTo('.chapter-signal-path', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: .8, stagger: .1 }, 'assemble+=.2')
      .fromTo('.chapter-node', { scale: .6, opacity: 0, transformOrigin: 'center', transformBox: 'fill-box' }, { scale: 1, opacity: 1, duration: .5, stagger: .12 }, 'assemble+=.35')
      .addLabel('read').to({}, { duration: 2.6 })
      .addLabel('depart')
      .to('.chapter-word', { y: -20, opacity: 0, duration: .6, stagger: .08, ease: 'power2.inOut' }, 'depart')
      .to('.chapter-circuit', { x: 20, opacity: 0, duration: .6, ease: 'power2.inOut' }, 'depart');
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return <header ref={root} className="section project-chapter-intro">
    <div className="project-chapter-panel">
      <div className="chapter-heading"><h2 id="work-title"><span className="chapter-word">Active</span><span className="chapter-word">projects<span className="chapter-period">.</span></span></h2><p>From working interfaces<br />to the systems behind them.</p></div>
      <div className="chapter-index">
        <svg className="chapter-circuit" viewBox="0 0 360 150" fill="none" aria-hidden="true">
          <path className="chapter-signal-path" d="M25 75H110L155 25H325" /><path className="chapter-signal-path" d="M25 75H325" /><path className="chapter-signal-path" d="M25 75H110L155 125H325" />
          <rect className="chapter-node" x="13" y="63" width="24" height="24" /><rect className="chapter-node" x="313" y="13" width="24" height="24" /><rect className="chapter-node" x="313" y="63" width="24" height="24" /><rect className="chapter-node" x="313" y="113" width="24" height="24" />
        </svg>
        <p className="mono">{projects.length} BUILDS / EXPLORE THE WORK</p>
        <nav aria-label="Project categories"><a href="#greetly">Start with Greetly<ArrowDownRight size={18} aria-hidden="true" /></a><a href="#ongoing">See ongoing projects<ArrowDownRight size={18} aria-hidden="true" /></a></nav>
      </div>
    </div>
  </header>;
}
