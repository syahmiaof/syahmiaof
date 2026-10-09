import Image from 'next/image';
import Link from 'next/link';
import { techStackGroups } from '@/data/tech-stack';
import { evidenceFor, skillDepths } from '@/data/skill-evidence';

export function TechStack() {
  return <section id="stack" className="section stack-section evidence-stack" aria-label="Tech stack by experience depth">
    {skillDepths.map(level => <section id={level.id} key={level.id} className="skill-depth" aria-labelledby={level.id + '-title'}>
      <header><h2 id={level.id + '-title'}>{level.title}</h2><p>{level.description}</p></header>
      <div className="stack-groups">{techStackGroups.map(group => {
        const items = group.items.filter(item => evidenceFor(item.name).depth === level.depth);
        if (!items.length) return null;
        return <section className="stack-group" key={group.name}><h3>{group.name}</h3><div className="stack-badges">{items.map(item => {
          const evidence = evidenceFor(item.name);
          const content = <><Image className="stack-logo" src={item.logo} alt="" width={24} height={24} /><span>{item.name}</span></>;
          return evidence.href ? <Link className="stack-badge" key={item.name} href={evidence.href} title={evidence.label} aria-label={item.name + ' — ' + evidence.label}>{content}</Link> : <span className="stack-badge" key={item.name} title={evidence.label}>{content}</span>;
        })}</div></section>;
      })}</div>
    </section>)}
  </section>;
}
