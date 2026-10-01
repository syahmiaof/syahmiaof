import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { CompetitionList } from '@/components/credentials/CredentialRecords';

export function Awards() {
  return <section id="awards" className="section awards-section" aria-labelledby="awards-title">
    <div className="awards-heading"><AnimatedTitle animation="recognition" id="awards-title">Competitions<br /><span className="muted">& recognition.</span></AnimatedTitle><p>Learning put to the test.</p></div>
    <CompetitionList />
  </section>;
}
