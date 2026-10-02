'use client';

import { useRef, type HTMLAttributes } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import './title-motion.css';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

let pendingRefresh = 0;
function refreshTitles() {
  if (!pendingRefresh) pendingRefresh = requestAnimationFrame(() => {
    pendingRefresh = 0;
    ScrollTrigger.refresh();
  });
}

export type TitleAnimation = 'editorial' | 'opposing' | 'wave' | 'terminal' | 'hinge' | 'depth' | 'continuation' | 'recognition' | 'converge' | 'stack' | 'chapter';
interface AnimatedTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  animation: TitleAnimation;
  as?: 'h1' | 'h2' | 'h3';
}

function poses(variant: TitleAnimation, small: boolean) {
  const distance = small ? .55 : 1;
  const from: gsap.TweenVars = { opacity: 0 };
  const exit: gsap.TweenVars = { opacity: 0, y: -12 * distance };
  let stagger = .09;
  let duration = small ? .6 : .85;
  switch (variant) {
    case 'chapter': Object.assign(from, { yPercent: 110, rotationX: -16, transformPerspective: 1000, transformOrigin: '50% 100%' }); Object.assign(exit, { yPercent: -105, y: 0, rotationX: 8 }); duration = small ? 1 : 1.3; stagger = .16; break;
    case 'stack': Object.assign(from, { yPercent: 105, x: (i: number) => (i % 2 ? 30 : -30) * distance }); Object.assign(exit, { yPercent: -105, x: (i: number) => (i % 2 ? -18 : 18) * distance, y: 0 }); duration = small ? .85 : 1.1; stagger = .18; break;
    case 'editorial': Object.assign(from, { yPercent: 105 }); Object.assign(exit, { yPercent: -105, y: 0 }); break;
    case 'opposing': Object.assign(from, { x: (i: number) => (i % 2 ? 28 : -28) * distance }); Object.assign(exit, { x: (i: number) => (i % 2 ? 12 : -12) * distance, y: 0 }); break;
    case 'wave': Object.assign(from, { x: -10 * distance, y: 24 * distance }); Object.assign(exit, { x: 8 * distance }); stagger = .045; break;
    case 'terminal': Object.assign(from, { opacity: 1, clipPath: 'inset(0% 100% 0% 0%)' }); Object.assign(exit, { y: 0, clipPath: 'inset(0% 100% 0% 0%)' }); duration = .65; stagger = 0; break;
    case 'hinge': Object.assign(from, { rotationX: -10 * distance, y: 18 * distance, transformPerspective: 900, transformOrigin: '50% 100%' }); Object.assign(exit, { rotationX: 4 * distance }); break;
    case 'depth': Object.assign(from, { z: (i: number) => (i % 2 ? -12 : -28) * distance, transformPerspective: 700 }); Object.assign(exit, { z: -20 * distance, y: 0 }); break;
    case 'continuation': Object.assign(from, { clipPath: 'inset(0% 100% 0% 0%)' }); Object.assign(exit, { y: 0 }); stagger = .15; break;
    case 'recognition': Object.assign(from, { clipPath: 'inset(0% 50% 0% 50%)', scale: .985 }); Object.assign(exit, { clipPath: 'inset(0% 50% 0% 50%)', y: 0 }); duration = small ? .7 : .95; break;
    case 'converge': Object.assign(from, { y: (i: number) => (i % 2 ? 20 : -16) * distance }); Object.assign(exit, { y: (i: number) => (i % 2 ? 10 : -8) * distance }); duration = small ? .7 : 1; break;
  }
  return { from, exit, stagger, duration };
}

export function AnimatedTitle({ animation, as: Tag = 'h2', children, ...props }: AnimatedTitleProps) {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const tier = useViewportTier();

  useGSAP((_, contextSafe) => {
    const heading = elementRef.current;
    if (reduced || !heading || !contextSafe) return;
    const small = tier === 'LITE';
    document.addEventListener('toggle', refreshTitles, true);
    let controller: gsap.core.Tween | undefined;
    let disposed = false;
    const split = SplitText.create(heading, {
      type: animation === 'wave' ? 'lines,words' : 'lines',
      autoSplit: true,
      mask: animation === 'editorial' || animation === 'stack' || animation === 'chapter' ? 'lines' : undefined,
      linesClass: 'motion-title-line',
      wordsClass: 'motion-title-word',
      onRevert: () => { controller?.kill(); },
      onSplit(self) {
        const targets = animation === 'wave' ? self.words : self.lines;
        const { from, exit, duration, stagger } = poses(animation, small);
        const timeline = gsap.timeline({ paused: true });
        timeline.fromTo(targets, from, {
          x: 0, y: 0, yPercent: 0, z: 0, rotationX: 0, scale: 1, opacity: 1,
          clipPath: animation === 'terminal' ? 'inset(0% 0% 0% 0%)' : 'inset(-15% -2% -15% -2%)',
          duration, stagger: { amount: Math.min(stagger * Math.max(0, targets.length - 1), .25) },
          ease: animation === 'terminal' ? 'steps(4)' : 'power3.out',
        });
        timeline.addLabel('read').to(targets, { ...exit, duration: small ? .3 : .4, stagger: animation === 'continuation' ? { each: .04, from: 'end' } : .025, ease: 'power2.inOut' });
        timeline.addLabel('out');
        const move = contextSafe((label: 'read' | 'out' | 'start') => {
          if (disposed) return;
          controller?.kill();
          heading.dataset.titleState = label === 'read' ? 'reading' : 'exiting';
          controller = timeline.tweenTo(label === 'start' ? 0 : label, { ease: 'none' });
        });
        ScrollTrigger.create({
          id: `title-${heading.id || animation}`,
          trigger: heading, animation: timeline,
          start: animation === 'chapter' ? 'top 80%' : 'top 88%', end: 'bottom top+=100',
          toggleActions: 'none none none none',
          refreshPriority: -1,
          onEnter: () => move('read'), onLeave: () => move('out'),
          onEnterBack: () => move('read'), onLeaveBack: () => move('start'),
          onRefresh: self => {
            controller?.kill();
            const position = self.scroll();
            timeline.pause(position >= self.end ? 'out' : position >= self.start ? 'read' : 0);
            heading.dataset.titleState = self.isActive ? 'reading' : 'outside';
          },
        });
        refreshTitles();
        return timeline;
      },
    });
    return () => {
      disposed = true;
      document.removeEventListener('toggle', refreshTitles, true);
      controller?.kill();
      split.revert();
      delete heading.dataset.titleState;
    };
  }, { scope: elementRef, dependencies: [animation, reduced, tier], revertOnUpdate: true });

  return <Tag ref={elementRef} data-title-animation={animation} {...props}>{children}</Tag>;
}
