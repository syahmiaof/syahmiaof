'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';

export function HomeMotion() {
  const reduced = useReducedMotion();
  const tier = useViewportTier();
  useEffect(() => {
    if (reduced || tier === 'LITE') return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
        .addLabel('enter-network').to('.hero-first', { x: -24, ease: 'none' }, 'enter-network').to('.hero-second', { x: 38, ease: 'none' }, 'enter-network');
      gsap.fromTo('.portrait img', { clipPath: 'inset(5% 0 5% 0)' }, { clipPath: 'inset(0% 0 0% 0)', ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top 85%', end: 'center 55%', scrub: .7 } });
      gsap.fromTo('.philosophy > p span', { color: '#8b998d' }, { color: '#e9ece3', scrollTrigger: { trigger: '.philosophy', start: 'top 75%', end: 'center 45%', scrub: true } });
      gsap.fromTo('.footer-network', { rotation: -35, scale: .7, opacity: .2 }, { rotation: -12, scale: 1, opacity: .4, scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 25%', scrub: .8 } });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
    return () => context.revert();
  }, [reduced, tier]);
  return null;
}
