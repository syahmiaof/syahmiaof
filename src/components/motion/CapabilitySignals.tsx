'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import './capability-signals.css';

const endpoints = [[115, 70], [320, 45], [535, 75], [555, 255], [410, 355], [195, 355], [65, 250]];

export function CapabilitySignals({ selected }: { selected: number }) {
  const svg = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const tier = useViewportTier();

  useEffect(() => {
    const element = svg.current;
    if (!element || reduced || tier === 'LITE') return;
    let inView = false;
    const update = () => { element.dataset.running = String(inView && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: .15 });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.dataset.running = 'false';
    };
  }, [reduced, tier]);

  return <svg ref={svg} className="capability-signals" viewBox="0 0 640 410" aria-hidden="true" data-reduced={reduced || tier === 'LITE'}>
    {endpoints.map(([x, y], index) => <g key={index} data-selected={index === selected}>
      <path className="map-wire" d={`M320 200L${x} ${y}`} />
      <path className="map-packet" pathLength="1" d={`M320 200L${x} ${y}`} style={{ '--packet-delay': `${index * .24}s` } as CSSProperties} />
    </g>)}
    <circle className="map-core-ring" cx="320" cy="200" r="62" />
    <g className="map-waves">
      <circle className="map-wave" cx="320" cy="200" r="62" />
      <circle className="map-wave map-wave-delayed" cx="320" cy="200" r="62" />
      <circle key={selected} className="map-selection-wave" cx="320" cy="200" r="62" />
    </g>
  </svg>;
}
