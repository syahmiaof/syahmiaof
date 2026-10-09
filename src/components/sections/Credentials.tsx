import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { featuredPrograms } from '@/data/credentials';
import { TextLink } from '@/components/ui/Primitives';
import { CredentialSummary, NextTargets, ProgramList } from '@/components/credentials/CredentialRecords';

export function Credentials() {
  return <section id="credentials" className="section credentials-section" aria-labelledby="credentials-title">
    <div className="credentials-intro">
      <AnimatedTitle animation="continuation" id="credentials-title">Certificates &<br /><span className="muted">specializations.</span></AnimatedTitle>
      <div><p>Learning across cloud security, AI, IT support and data engineering. Completed programs, backed by certificate evidence.</p><TextLink href="/credentials">Explore all credentials</TextLink></div>
    </div>
    <CredentialSummary />
    <ProgramList programs={featuredPrograms} compact />
    <NextTargets />
  </section>;
}
