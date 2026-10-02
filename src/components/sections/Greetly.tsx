import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Status, TextLink } from '@/components/ui/Primitives';
import { GreetlyJourney } from './GreetlyJourney';
import { GreetlySequence } from '@/components/motion/GreetlySequence';

export function Greetly() {
  return <section id="greetly" className="greetly-section" aria-labelledby="greetly-title"><div className="section greetly-intro"><div className="section-heading-row"><Status>Featured build · Edge / cloud</Status></div><div className="greetly-heading"><h3 id="greetly-title">Greetly<ArrowUpRight aria-hidden="true" /></h3><p>An edge-to-cloud <br />attendance ecosystem.</p></div><a href="https://greetly.syahmiaof.my" target="_blank" rel="noopener noreferrer" data-cursor="VIEW" className="greetly-cover" style={{ position: 'relative', display: 'block', overflow: 'visible', width: '100%' }}><GreetlySequence /></a><div className="greetly-caption"><p>Camera input becomes a local recognition event.<br />The cloud turns that event into something useful.</p><div><TextLink href="/projects/greetly">Explore the case study</TextLink><span className="asset-note">Device concept artwork from the project repository.</span></div></div></div><GreetlyJourney /><div className="section deployment-strip"><div><span className="mono muted">FROM SOURCE TO SERVICE</span><h3>A connected delivery path.</h3></div><ol className="deployment-flow">{['GitHub', 'Vercel build', 'Deployment', 'Cloudflare DNS'].map((stage, i) => <li key={stage}><span className="mono">0{i + 1}</span>{stage}</li>)}</ol><Link className="text-link" href="/projects/greetly#deployment">Engineering decisions<ArrowUpRight size={17} /></Link></div></section>;
}
