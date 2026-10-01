'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useExperience';

const greetings = [
  "Hi, I'm Symi. Syahmi's digital companion.",
  'I watch the signal move from edge to cloud.',
  'Greetly turns a face into a useful record.',
  'Scroll on. The system is connected.',
];

export function TypewriterGreeting() {
  const root = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    const text = copy.current;
    if (!element || !text) return;
    if (reduced) {
      text.textContent = greetings[0];
      return;
    }
    const state = { length: 0, message: 0 };
    const render = () => { text.textContent = greetings[state.message].slice(0, Math.round(state.length)); };
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: .35 });
    greetings.forEach((message, index) => {
      timeline.call(() => { state.message = index; state.length = 0; render(); });
      timeline.to(state, { length: message.length, duration: Math.max(1.4, message.length * .045), ease: 'none', onUpdate: render });
      timeline.to({}, { duration: 1.5 });
      timeline.to(state, { length: 0, duration: Math.max(.45, message.length * .02), ease: 'none', onUpdate: render });
      timeline.to({}, { duration: .3 });
    });
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) timeline.resume();
      else timeline.pause();
    }, { threshold: .1 });
    visibility.observe(element);
    return () => { visibility.disconnect(); timeline.kill(); };
  }, [reduced]);

  return <div ref={root} className="hero-greeting" role="img" aria-label={greetings[0]}>
    <span className="hero-greeting-copy"><span className="hero-greeting-text" ref={copy} aria-hidden="true" /><i aria-hidden="true" /></span>
  </div>;
}
