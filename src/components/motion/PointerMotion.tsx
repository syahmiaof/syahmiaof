'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import './pointer-motion.css';

export function PointerMotion() {
  const reduced = useReducedMotion();
  const tier = useViewportTier();
  useEffect(() => {
    if (reduced || tier === 'LITE' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cleanups: (() => void)[] = [];
    const context = gsap.context(() => {
      const bind = (selector: string, kind: 'surface' | 'title' | 'magnetic') => {
        document.querySelectorAll<HTMLElement>(selector).forEach(element => {
          element.dataset.pointerEffect = kind;
          const original = element.getAttribute('style');
          let bounds: DOMRect | undefined;
          const motion = kind === 'surface'
            ? { rotationX: 0, rotationY: 0, transformPerspective: 1000, scale: 1 }
            : { x: 0, y: 0, rotation: 0 };
          gsap.set(element, motion);
          const x = gsap.quickTo(element, kind === 'surface' ? 'rotationY' : 'x', { duration: .75, ease: 'power3.out' });
          const y = gsap.quickTo(element, kind === 'surface' ? 'rotationX' : 'y', { duration: .75, ease: 'power3.out' });
          const enter = () => { bounds = element.getBoundingClientRect(); element.dataset.pointerActive = 'true'; };
          const move = (event: PointerEvent) => {
            if (event.pointerType === 'touch' || !bounds) return;
            const nx = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
            const ny = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
            x(nx * (kind === 'surface' ? 12 : kind === 'title' ? 15 : 18));
            y(ny * (kind === 'surface' ? -10 : kind === 'title' ? 8 : 12));
            if (kind === 'surface') {
              element.style.setProperty('--pointer-x', `${(nx + .5) * 100}%`);
              element.style.setProperty('--pointer-y', `${(ny + .5) * 100}%`);
            }
          };
          const leave = () => { bounds = undefined; delete element.dataset.pointerActive; x(0); y(0); };
          element.addEventListener('pointerenter', enter);
          element.addEventListener('pointermove', move, { passive: true });
          element.addEventListener('pointerleave', leave);
          element.addEventListener('blur', leave);
          cleanups.push(() => {
            element.removeEventListener('pointerenter', enter); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); element.removeEventListener('blur', leave);
            delete element.dataset.pointerEffect; delete element.dataset.pointerActive;
            if (original === null) element.removeAttribute('style'); else element.setAttribute('style', original);
          });
        });
      };
      bind('.portrait, .project-image, .passport', 'surface');
      bind('.hero h1, [data-title-animation], .journey-heading h3, .philosophy > p:first-of-type', 'title');
      bind('.hero .primary-button, .contact-email, .project-caption .text-link', 'magnetic');
    });
    return () => { context.revert(); cleanups.forEach(cleanup => cleanup()); };
  }, [reduced, tier]);
  return null;
}

