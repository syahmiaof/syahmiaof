import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollLink } from '@/components/ui/Primitives';
import { InfrastructureScene } from '@/scenes/InfrastructureScene';

export function Hero() {
  return <section className="hero" id="index" aria-labelledby="hero-title">
    <div className="hero-topline mono"><span>Independent portfolio / 2026</span><span className="hero-status"><i />Always building</span></div>
    <div className="hero-layout"><div className="hero-copy"><p className="hero-discipline mono">Cloud systems / DevOps / AI / Edge</p><h1 id="hero-title"><span className="hero-first">SYAHMI</span><span className="hero-second">AOF<span className="hero-period">.</span></span></h1><div className="hero-intro"><span className="hero-cross" aria-hidden="true">+</span><p>I build systems<br />that connect.</p><span className="hero-intro-detail">From the interface you see<br />to the infrastructure you don’t.</span></div><Link href="#work" className="primary-button" data-cursor="VIEW">Explore my work<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <div className="hero-art"><InfrastructureScene /><div className="scene-annotation annotation-top"><span className="signal-dot" />YOUR DIGITAL COMPANION<span><span className="robot-hover-hint">MOVE YOUR CURSOR. SAY HELLO.</span><span className="robot-static-hint">AOF / HUMAN + MACHINE</span></span></div><div className="scene-annotation annotation-bottom"><span>01 — AOF / ROBOT</span><span className="annotation-rule" /><span>HUMAN → MACHINE</span></div></div></div>
    <div className="hero-bottom mono"><ScrollLink /><span className="hero-bottom-center">Digital infrastructure, human intent.</span><span>Based in Malaysia <span className="tiny-cross">↗</span></span></div>
  </section>;
}
