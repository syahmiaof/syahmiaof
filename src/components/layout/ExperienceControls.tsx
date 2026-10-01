'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toggleMotion, useReducedMotion, useViewportTier } from '@/hooks/useExperience';

export function ExperienceControls() {
  const reduced = useReducedMotion();
  const tier = useViewportTier();
  const path = usePathname();
  const [dev, setDev] = useState(false);
  const [clock, setClock] = useState('MYT / UTC+8');
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);
  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) + ' MYT');
    update(); const id = setInterval(update, 60_000); return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === '~' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) setDev(value => !value);
    };
    window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener);
  }, []);
  useEffect(() => {
    if (reduced || tier === 'LITE') return;
    const onPointer = (event: PointerEvent) => {
      if (!cursor.current) return;
      const target = (event.target as Element).closest<HTMLElement>('[data-cursor]');
      cursor.current.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0)`;
      cursor.current.textContent = target?.dataset.cursor ?? '';
      cursor.current.style.opacity = target ? '1' : '0';
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [reduced, tier]);
  return <>
    <div className="experience-controls"><span>{clock}</span><button onClick={toggleMotion} aria-pressed={reduced} title="System reduced-motion preferences take priority">Motion {reduced ? 'reduced' : 'on'}<span className={reduced ? 'motion-indicator' : 'motion-indicator enabled'} /></button></div>
    {!reduced && tier !== 'LITE' && <div ref={cursor} className="cursor-label" aria-hidden="true" />}
    {dev && <aside className="dev-overlay" aria-label="Experience diagnostics"><strong>EXPERIENCE / DEBUG</strong><span>ROUTE {path}</span><span>QUALITY {reduced ? 'LITE' : tier}</span><span>MOTION {reduced ? 'REDUCED' : 'FULL'}</span><span>RENDER ADAPTIVE / ON DEMAND</span><button onClick={() => setDev(false)}>Close diagnostics</button></aside>}
  </>;
}
