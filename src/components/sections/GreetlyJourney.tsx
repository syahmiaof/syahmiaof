'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Cpu, ScanFace, Radio, Database, Monitor } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '@/data/projects';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import { InfrastructureScene } from '@/scenes/InfrastructureScene';
import { createSceneProgress } from '@/scenes/sceneProgress';
import './greetly-cinematic.css';

gsap.registerPlugin(ScrollTrigger);
const icons = [Camera, Cpu, ScanFace, Radio, Database, Monitor];

export function GreetlyJourney() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tier = useViewportTier();
  const root = useRef<HTMLDivElement>(null);
  const progress = useMemo(() => createSceneProgress(), []);
  const trigger = useRef<ScrollTrigger | null>(null);
  const manual = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || reduced || tier === 'LITE') return;
    const update = () => {
      progress.notify();
      setActive(Math.min(5, Math.round(progress.value)));
      element.style.setProperty('--event-progress', String(Math.max(0, Math.min(1, (progress.value - 2) / 3))));
    };
    const media = gsap.matchMedia();
    media.add('(min-width: 1100px) and (min-height: 760px) and (pointer: fine)', () => {
      element.dataset.cinematic = 'true';
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: element.querySelector('.journey-stage'), start: 'top 100px', end: '+=1900', pin: true, scrub: .65, invalidateOnRefresh: true },
        onUpdate: update,
      });
      timeline.to(progress, { value: 5, duration: 5, ease: 'none' });
      trigger.current = timeline.scrollTrigger!;
      let disposed = false;
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
      return () => { disposed = true; trigger.current = null; delete element.dataset.cinematic; };
    }, element);
    return () => { manual.current?.kill(); media.revert(); element.style.removeProperty('--event-progress'); };
  }, [reduced, tier, progress]);
  const select = (index: number) => {
    manual.current?.kill();
    setActive(index);
    if (trigger.current) {
      const scroll = trigger.current;
      window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * index / 5, behavior: 'instant' });
    } else if (!reduced && tier !== 'LITE') {
      manual.current = gsap.to(progress, { value: index, duration: .8, ease: 'power2.inOut', onUpdate: () => { progress.notify(); root.current?.style.setProperty('--event-progress', String(Math.max(0, (progress.value - 2) / 3))); } });
    } else { progress.set(index); }
  };
  return <div className="journey section" ref={root}><div className="journey-stage">
    <div className="journey-heading"><div><span className="mono signal-text">FOLLOW ONE ATTENDANCE EVENT</span><h3>From a face{' '}<br />to a record.</h3></div><p>Six steps. One connected system.<br /><span className="journey-scroll-hint">Scroll to take it apart, or select a stage.</span><span className="journey-tap-hint">Select a stage to follow the event.</span></p></div>
    <div className="device-inspection"><InfrastructureScene mode="device" step={active} progress={progress} />
      <div className="device-layer-labels mono" aria-hidden="true"><span>01 / OPTICS</span><span>02 / SENSOR</span><span>03 / COMPUTE</span><span>04 / ENCLOSURE</span></div>
      <svg className="event-link" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path className="event-track" d="M 470 230 H 600 V 130 H 680" /><path className="event-travel" pathLength="1" d="M 470 230 H 600 V 130 H 680" /></svg>
      <div className="event-destination" data-stage={active}>
        <span className="mono signal-text">{active < 3 ? 'AT THE EDGE' : active === 3 ? 'EDGE → CLOUD' : 'IN THE CLOUD'}</span>
        <h4>{active < 3 ? 'Local intelligence.' : active === 3 ? 'One event. Delivered.' : 'A record. Connected.'}</h4>
        <p>{active < 3 ? 'Frames stay local. Only the recognition event moves onward.' : active === 3 ? 'The Supabase client sends the attendance write. The queue supports retries.' : 'Stored in PostgreSQL. Reflected in the realtime dashboard.'}</p>
        <div className="attendance-preview" data-ready={active >= 4}><div className="mono"><span>attendance_logs</span><Database size={14} /></div><dl><div><dt>student</dt><dd>Recognized identity</dd></div><div><dt>timestamp</dt><dd>Capture time</dd></div><div><dt>status</dt><dd>{active >= 4 ? 'Attendance recorded' : 'Awaiting event'}</dd></div></dl><span className="mono record-caption">ILLUSTRATIVE RECORD</span></div>
      </div><span className="device-disclaimer mono">INTERACTIVE SCHEMATIC · NOT A HARDWARE REPLICA</span>
    </div>
    <div className="journey-topology" role="tablist" aria-label="Greetly attendance event stages">{journey.map((step, index) => {
      const Icon = icons[index];
      return <button key={step.id} id={`journey-tab-${step.id}`} role="tab" aria-selected={active === index} aria-controls="journey-panel" tabIndex={active === index ? 0 : -1} className={`journey-node ${active === index ? 'is-active' : ''} ${index < active ? 'is-past' : ''}`} onClick={() => select(index)} onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % journey.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + journey.length - 1) % journey.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = journey.length - 1;
        else return;
        event.preventDefault(); select(next); document.getElementById(`journey-tab-${journey[next].id}`)?.focus({ preventScroll: true });
      }}><span className="node-number mono">0{index + 1}</span><span className="node-icon"><Icon size={25} strokeWidth={1.25} /></span><span>{step.name}</span><span className="node-connector" aria-hidden="true" /></button>;
    })}</div>
    <div id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${journey[active].id}`} className="journey-detail" tabIndex={0}><span className="journey-index">0{active + 1}<span>/06</span></span><div><h4>{journey[active].component}</h4><p>{journey[active].description}</p></div><span className="mono journey-origin">ARCHITECTURE WALKTHROUGH<br />NOT A LIVE DATA FEED</span></div>
    </div><details className="architecture-transcript"><summary>Read the complete architecture</summary><ol>{journey.map(step => <li key={step.id}><strong>{step.name} · {step.component}</strong><p>{step.description}</p></li>)}</ol></details>
  </div>;
}
