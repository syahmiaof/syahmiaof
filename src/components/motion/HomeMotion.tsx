'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useExperience';

export function HomeMotion() {
  const reduced = useReducedMotion();
  
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    
    const mm = gsap.matchMedia();

    // DESKTOP ANIMATIONS (Exactly the same as before)
    mm.add('(min-width: 761px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
        .addLabel('enter-network')
        .to('.hero-first', { x: -24, ease: 'none' }, 'enter-network')
        .to('.hero-second', { x: 38, ease: 'none' }, 'enter-network');
        
      gsap.fromTo('.portrait img', 
        { clipPath: 'inset(5% 0 5% 0)' }, 
        { clipPath: 'inset(0% 0 0% 0)', ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top 85%', end: 'center 55%', scrub: .7 } }
      );
      
      gsap.fromTo('.philosophy > p span', 
        { color: '#8b998d' }, 
        { color: '#e9ece3', scrollTrigger: { trigger: '.philosophy', start: 'top 75%', end: 'center 45%', scrub: true } }
      );
    });

    // MOBILE ANIMATIONS (Lightweight alternative)
    mm.add('(max-width: 760px)', () => {
      // Simple fade-up for portrait instead of clip-path
      gsap.fromTo('.portrait img', 
        { opacity: 0.5, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.portrait', start: 'top 90%', toggleActions: 'play none none reverse' } }
      );
      
      // Simple color change without scrubbing (performance optimized)
      gsap.fromTo('.philosophy > p span', 
        { color: '#8b998d' }, 
        { color: '#e9ece3', stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: '.philosophy', start: 'top 80%', toggleActions: 'play none none reverse' } }
      );
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, [reduced]);
  
  return null;
}
