import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollLink } from '@/components/ui/Primitives';
import { InfrastructureScene } from '@/scenes/InfrastructureScene';
import { HeroTitle } from '@/components/motion/HeroTitle';
import { positioning } from '@/data/positioning';
import { TypewriterGreeting } from '@/components/motion/TypewriterGreeting';

export function Hero() {
  return <section className="hero" id="index" aria-labelledby="hero-title">
    <div className="hero-topline mono"><span>Welcome to my portfolio</span><span className="hero-status"><i />Always building</span></div>
    <div className="hero-layout"><div className="hero-copy"><p className="hero-discipline mono">{positioning.primary} · {positioning.status}</p><HeroTitle /><div className="hero-intro"><span className="hero-cross" aria-hidden="true">+</span><p>I build systems<br />that connect.</p><span className="hero-intro-detail">{positioning.direction}<br /><small>{positioning.differentiators}</small></span></div><Link href="#work" className="primary-button" data-cursor="VIEW">Explore my projects<ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/quick" className="hero-recruiter">Recruiter? View the 30-second overview<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="hero-art"><InfrastructureScene /><TypewriterGreeting /></div></div>
    <div className="hero-bottom mono"><ScrollLink /><span>Based in Malaysia <span className="tiny-cross">↗</span></span></div>
  </section>;
}
