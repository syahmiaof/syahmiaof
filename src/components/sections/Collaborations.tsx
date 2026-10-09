import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { TextLink } from '@/components/ui/Primitives';
import { ghazwahCollaboration as collaboration } from '@/data/collaborations';

export function Collaborations() {
  return <section id="collaboration" className="section collaboration-section" aria-labelledby="collaboration-title">
    <div className="section-title-row"><AnimatedTitle animation="opposing" id="collaboration-title">Inside the<br /><span className="muted">Ghazwah pilot.</span></AnimatedTitle><TextLink href={collaboration.website} external>{collaboration.company}</TextLink></div>
    <p className="pilot-intro">{collaboration.pilot} is the first business workspace for a marketing workflow built around specialist AI agents.</p>
    <ol className="collaboration-flow" aria-label="Marketing workflow">{collaboration.workflow.map(step => <li key={step}>{step}</li>)}</ol>
    <div className="pilot-details">{collaboration.details.map(detail => <article key={detail.title}><h3>{detail.title}</h3><p>{detail.description}</p></article>)}</div>
    <TextLink href="/projects/ai-growth-automation">Explore the system design</TextLink>
  </section>;
}
