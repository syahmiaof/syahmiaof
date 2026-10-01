import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { TextLink } from '@/components/ui/Primitives';
import { CredentialSummary, ProgramList, CompletionList, CompetitionList, NextTargets } from '@/components/credentials/CredentialRecords';
import { CredentialFilter } from '@/components/credentials/CredentialFilter';
import { componentsFor, professionalPrograms, standaloneCompletions } from '@/data/credentials';
import { canonical } from '@/lib/seo';

const description = 'Four professional learning programs, 39 course and lab completions, and three competition records, with certificate evidence and verification links.';
export const metadata: Metadata = { title: 'Credentials & recognition', description, alternates: { canonical: canonical('/credentials') }, openGraph: { title: 'Credentials & recognition — Syahmi Aof', description, url: canonical('/credentials') } };

export default function CredentialsPage() {
  return <><main id="main" className="section credential-page">
    <header className="credential-page-hero"><div className="credential-page-top"><p className="mono">CREDENTIALS / RECOGNITION</p><TextLink href="/#credentials">Back to portfolio</TextLink></div><h1>Evidence of learning,<br /><span className="muted">grouped by outcome.</span></h1><p>Programs, individual completions and competition recognition, kept separate so the evidence speaks for itself. Component courses sit within their parent programs; they are not additional professional certifications.</p></header>
    <CredentialSummary />
    <CredentialFilter
      programs={<section className="credential-category" aria-labelledby="programs-heading"><h2 id="programs-heading">Professional Programs</h2><p className="credential-category-intro">Four completed learning programs. Professional certificates and specializations are distinct from industry certification exams.</p><ProgramList programs={professionalPrograms} /></section>}
      courses={<section className="credential-category" aria-labelledby="courses-heading"><h2 id="courses-heading">Course & Lab Completions</h2><p className="credential-category-intro">35 components across four programs, plus four standalone completions.</p><div className="credential-course-groups">{professionalPrograms.map(program => <details className="credential-course-group" key={program.slug}><summary><span>{program.title}</span><span className="credential-meta">{componentsFor(program.slug).length} completions</span></summary><div><h3 className="credential-group-heading">Components of {program.title}</h3><CompletionList records={componentsFor(program.slug)} /></div></details>)}</div><h3 className="credential-standalone-heading">Standalone completions</h3><CompletionList records={standaloneCompletions} /></section>}
      competitions={<section className="credential-category" aria-labelledby="competitions-heading"><h2 id="competitions-heading">Competitions & Recognition</h2><p className="credential-category-intro">Three events. Multiple recognitions from the same event stay in one record.</p><CompetitionList /></section>}
    />
    <aside className="credential-source-note" aria-label="About the evidence"><h2>About the evidence</h2><p>Records are transcribed from supplied certificates. “Verification available” links to the provider’s record; it does not mean independent issuer authentication has been completed here. “Certificate evidence” means a certificate was supplied without a public verification link.</p><p>Some component certificates show dates later than their parent program certificate. Each date is preserved as printed. Original files stay private to protect personal and team details.</p></aside>
    <NextTargets />
  </main><Footer compact /></>;
}
