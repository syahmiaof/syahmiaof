import Image from 'next/image';
import { Braces, Cloud, Cpu, Workflow, Network, Bot } from 'lucide-react';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { techStackGroups } from '@/data/tech-stack';

const icons = [Cloud, Cpu, Braces, Workflow, Network, Bot];

export function TechStack() {
  return <section id="stack" className="section stack-section" aria-labelledby="stack-title">
    <div className="stack-heading"><AnimatedTitle animation="stack" id="stack-title">My tech<br /><span className="muted">stack.</span></AnimatedTitle><div><p>The tools and technologies I know, from infrastructure to AI.</p><span className="mono stack-hint">HOVER A BADGE / SEE THE SIGNAL</span></div></div>
    <div className="stack-groups">{techStackGroups.map((group, groupIndex) => {
      const Icon = icons[groupIndex];
      return <section className="stack-group" key={group.name} aria-labelledby={`stack-group-${groupIndex}`}><div className="stack-group-heading"><span className="stack-group-icon"><Icon size={18} strokeWidth={1.4} aria-hidden="true" /></span><div><h3 id={`stack-group-${groupIndex}`}>{group.name}</h3><p>{group.note}</p></div></div><div className="stack-badges">{group.items.map(item => <span className="stack-badge" key={item.name} title={item.name}><Image className="stack-logo" src={item.logo} alt="" width={24} height={24} /><span>{item.name}</span></span>)}</div></section>;
    })}</div>
  </section>;
}
