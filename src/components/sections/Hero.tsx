import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollLink } from '@/components/ui/Primitives';
import { InfrastructureScene } from '@/scenes/InfrastructureScene';
import { HeroTitle } from '@/components/motion/HeroTitle';
import { TypewriterGreeting } from '@/components/motion/TypewriterGreeting';

export function Hero() {
  return <section className="hero" id="index" aria-labelledby="hero-title">
    <div className="hero-topline mono"><span>Welcome to my portfolio</span><span className="hero-status"><i />Always building</span></div>
    <div className="hero-layout"><div className="hero-copy"><p className="hero-discipline mono">Cloud Infra / DevOps / Network / IoT / AI Agent / AI Automation / Digital Marketer</p><HeroTitle /><div className="hero-intro"><span className="hero-cross" aria-hidden="true">+</span><p>I build systems<br />that connect.</p><span className="hero-intro-detail">From the interface you see<br />to the infrastructure you don’t.</span></div><Link href="#work" className="primary-button" data-cursor="VIEW">Explore my work<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      <div className="hero-art"><InfrastructureScene /><TypewriterGreeting /></div></div>
    <div className="hero-bottom mono"><ScrollLink /><span>Based in Malaysia <span className="tiny-cross">↗</span></span></div>
  </section>;
}
