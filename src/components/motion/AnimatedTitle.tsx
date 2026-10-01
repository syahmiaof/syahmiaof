'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'cinematic' | 'wipe' | 'swing' | 'focal' | 'epic';

interface AnimatedTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  animation: AnimationType;
  as?: 'h1' | 'h2' | 'h3';
}

export function AnimatedTitle({ animation, as: Tag = 'h2', children, style, ...props }: AnimatedTitleProps) {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !elementRef.current) return;

    const el = elementRef.current;
    
    // Set initial states based on animation type
    let fromState: gsap.TweenVars = { opacity: 0 };
    
    switch (animation) {
      case 'cinematic':
        fromState = { y: 60, opacity: 0 };
        break;
      case 'wipe':
        fromState = { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 1 };
        break;
      case 'swing':
        fromState = { rotationX: -60, y: 30, opacity: 0, transformOrigin: 'bottom', transformPerspective: 1000 };
        break;
      case 'focal':
        fromState = { scale: 1.05, filter: 'blur(8px)', opacity: 0 };
        break;
      case 'epic':
        fromState = { letterSpacing: '0.15em', opacity: 0 };
        break;
    }

    gsap.set(el, fromState);

    let toState: gsap.TweenVars = {
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    };

    switch (animation) {
      case 'cinematic':
        toState = { ...toState, y: 0 };
        break;
      case 'wipe':
        toState = { ...toState, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' };
        break;
      case 'swing':
        toState = { ...toState, rotationX: 0, y: 0 };
        break;
      case 'focal':
        toState = { ...toState, scale: 1, filter: 'blur(0px)' };
        break;
      case 'epic':
        // Greetly h2 has a specific structure, we don't want to break it, 
        // just letterSpacing and opacity is enough
        toState = { ...toState, letterSpacing: 'normal', ease: 'power2.out', duration: 1.2 };
        break;
    }

    gsap.to(el, toState);

  }, [animation, reducedMotion]);

  // Combine perspective for 3D transforms if needed
  const combinedStyle = animation === 'swing' 
    ? { ...style } 
    : style;

  return (
    <Tag ref={elementRef} style={combinedStyle} {...props}>
      {children}
    </Tag>
  );
}


