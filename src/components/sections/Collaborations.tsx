import { ArrowUpRight, Plus } from 'lucide-react';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { ghazwahCollaboration as collaboration } from '@/data/collaborations';

export function Collaborations() {
  return <section id="collaboration" className="section collaboration-section" aria-labelledby="collaboration-title">
    <div className="collaboration-heading"><AnimatedTitle animation="opposing" id="collaboration-title">In collaboration<br /><span className="muted">with.</span></AnimatedTitle><p>Connecting the work<br />to a real business.</p></div>
    <div className="collaboration-body">
      <div className="collaboration-identity"><a href={collaboration.website} target="_blank" rel="noopener noreferrer" className="collaboration-company"><h3>{collaboration.company}</h3><ArrowUpRight size={28} aria-hidden="true" /></a><p className="collaboration-role">{collaboration.role}</p><p className="collaboration-pilot">Pilot: {collaboration.pilot}</p></div>
      <div className="collaboration-story"><p>{collaboration.summary}</p><ol className="collaboration-flow" aria-label="Marketing workflow">{collaboration.workflow.map(step => <li key={step}>{step}</li>)}</ol>
        <details className="collaboration-details"><summary>Explore the AI marketing pilot<Plus size={20} aria-hidden="true" /></summary><div>{collaboration.details.map(detail => <article key={detail.title}><h4>{detail.title}</h4><p>{detail.description}</p></article>)}</div></details>
      </div>
    </div>
  </section>;
}
