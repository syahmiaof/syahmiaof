'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { SectionLabel, Status, TextLink } from '@/components/ui/Primitives';
import { SafeImage } from '@/components/ui/SafeImage';
import { GreetlyJourney } from './GreetlyJourney';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function Greetly() {
  const titleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !titleRef.current) return;
    const ctx = gsap.context(() => {
      // Split the GREETLY text into characters
      const split = new SplitText(titleRef.current, { type: 'chars' });
      
      // Animate chars appearing with scrub (GSAP homepage style)
      gsap.fromTo(split.chars, 
        { opacity: 0, scale: 0.5, y: 100, rotationX: -90, transformOrigin: "0% 50% -50" }, 
        { 
          opacity: 1, 
          scale: 1,
          y: 0, 
          rotationX: 0,
          stagger: 0.05, 
          ease: 'power4.out', 
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%', // Start animation when the section hits 80% down the screen
            end: 'top 30%',   // End animation when the section hits 30% down the screen
            scrub: 1, // Tie strictly to scroll
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [reducedMotion]);

  return <section id="work" className="greetly-section" aria-labelledby="greetly-title"><div ref={containerRef} className="section greetly-intro"><div className="section-heading-row"><SectionLabel number="02">Featured system</SectionLabel><Status>Active project</Status></div><div className="greetly-heading"><h2 id="greetly-title"><span ref={titleRef}>GREETLY</span><span>↗</span></h2><p>An edge-to-cloud <br />attendance ecosystem.</p></div><div className="greetly-cover"><SafeImage src="/images/greetly-device.webp" alt="Greetly repository concept artwork showing an exploded attendance camera housing and compute board" width={1600} height={900} sizes="(max-width: 760px) 100vw, 90vw" /><div className="cover-caption mono"><span>Local intelligence.<br />Connected infrastructure.</span><span>EDGE / VISION / REALTIME</span></div></div><div className="greetly-caption"><p>Camera input becomes a local recognition event.<br />The cloud turns that event into something useful.</p><div><TextLink href="/projects/greetly">Explore the case study</TextLink><span className="asset-note">Device concept artwork from the project repository.</span></div></div></div><GreetlyJourney /><div className="section deployment-strip"><div><span className="mono muted">FROM SOURCE TO SERVICE</span><h3>A connected delivery path.</h3></div><ol className="deployment-flow">{['GitHub', 'Vercel build', 'Deployment', 'Cloudflare DNS'].map((stage, i) => <li key={stage}><span className="mono">0{i + 1}</span>{stage}</li>)}</ol><Link className="text-link" href="/projects/greetly#deployment">Engineering decisions<ArrowUpRight size={17} /></Link></div></section>;
}
