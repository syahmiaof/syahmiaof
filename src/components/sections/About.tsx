'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger, SplitText);

import { AnimatedTitle } from '@/components/motion/AnimatedTitle';

export function About() {
  return <section id="about" className="section about-section" aria-labelledby="about-title"><div className="about-grid"><div className="about-copy"><AnimatedTitle animation="editorial" id="about-title">Curious by nature.<br /><span className="muted">Builder by choice.</span></AnimatedTitle><p className="large-body">I’m Muhammad Syahmi.<br />A cloud computing student who likes knowing how the whole thing works.</p><p>Interfaces are where I start. What keeps me interested is everything behind them: the network, the data, the deployment, and the small decisions that make a system hold together.</p><p>Right now, I’m connecting software with cloud infrastructure and edge devices, while exploring how AI agents can become useful parts of those systems.</p><TextLink href="/quick">The 30-second version</TextLink><dl className="about-facts"><div><dt>NOW</dt><dd>Cloud Computing Student</dd></div><div><dt>NEXT</dt><dd>Cloud / DevOps Engineer</dd></div><div><dt>EXPLORING</dt><dd>AI infrastructure & agentic systems</dd></div></dl></div><figure className="portrait"><SafeImage src="/images/syahmic3.png" alt="Muhammad Syahmi beside a river and forested limestone hills in Malaysia" width={960} height={1280} sizes="(max-width: 760px) 90vw, 40vw" /><figcaption><span>MUHAMMAD SYAHMI</span><span>MALAYSIA / MY</span></figcaption><span className="portrait-cross" aria-hidden="true">+</span></figure></div></section>;
}

export function Philosophy() {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !textRef.current) return;
    const ctx = gsap.context(() => {
      // Split text into words and chars
      const split = new SplitText(textRef.current, { type: 'words,chars' });
      
      // Animate chars appearing with a stagger
      gsap.fromTo(split.chars, 
        { opacity: 0, y: 20, rotationX: -90, transformOrigin: "0% 50% -50" }, 
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          stagger: 0.02, 
          ease: 'power3.out', 
          duration: 1.5,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%', // Trigger when it enters the viewport
            end: 'center 40%',
            scrub: 1, // Tie it to the scrollbar for the GSAP website effect
          }
        }
      );
    }, container);
    
    return () => ctx.revert();
  }, [reducedMotion]);

  return <section ref={container} className="philosophy section" aria-label="Engineering philosophy"><div className="philosophy-line" aria-hidden="true"><span /><i /><span /></div><p ref={textRef} className="philosophy-text" style={{ perspective: '400px' }}>I don’t just build interfaces.<br /><span>I think about what<br />runs behind them.</span></p></section>;
}
