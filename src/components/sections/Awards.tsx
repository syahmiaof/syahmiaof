import { ArrowUpRight, Trophy } from 'lucide-react';
import { awards } from '@/data/awards';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';

export function Awards() {
  return <section id="awards" className="section awards-section" aria-labelledby="awards-title">
    <div className="awards-heading"><AnimatedTitle animation="focal" id="awards-title">Awards <span className="muted">& wins.</span></AnimatedTitle><p>Recognition along the way.</p></div>
    {awards.length ? <ol className="award-list">{awards.map(award => <li key={`${award.title}-${award.year}`}>
      <span className="award-year">{award.year}</span><div><h3>{award.title}</h3><p>{award.event}</p><p>{award.description}</p></div>
      {award.evidenceUrl && <a href={award.evidenceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${award.title} recognition`}>View recognition<ArrowUpRight size={18} aria-hidden="true" /></a>}
    </li>)}</ol> : <div className="awards-empty"><Trophy size={36} strokeWidth={1.2} aria-hidden="true" /><div><h3>The story is still being written.</h3><p>Awards and competition highlights will be shared here.</p></div></div>}
  </section>;
}

