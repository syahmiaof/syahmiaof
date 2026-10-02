import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { labEntries } from '@/data/lab';
import { TextLink } from '@/components/ui/Primitives';
export function Lab() {
  return <section id="lab" className="section lab-section" aria-labelledby="lab-title"><div className="lab-heading"><AnimatedTitle animation="terminal" id="lab-title">/LAB<span>_</span></AnimatedTitle><p>Small systems.<br />Tests. Failures. Experiments.</p></div><div className="lab-list">{labEntries.map(entry => <article key={entry.title}><span className="mono lab-category">{entry.category}</span><div><h3>{entry.title}</h3><p>{entry.description}</p></div><div className="lab-actions"><span className="mono lab-status">{entry.status}</span><TextLink href={entry.href} external={entry.href.startsWith('https')}>Explore</TextLink></div></article>)}</div></section>;
}
