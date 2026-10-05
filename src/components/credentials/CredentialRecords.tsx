import { ArrowUpRight } from 'lucide-react';
import type { Credential, CompetitionRecognition } from '@/types/portfolio';
import { competitionRecognitions, componentsFor, credentialCounts, credentialKindLabels, formatCredentialDate, nextTargets } from '@/data/credentials';
import { SafeImage } from '@/components/ui/SafeImage';

function IssuerIcon({ issuer }: { issuer: string }) {
  if (issuer === 'Microsoft') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="issuer-icon" aria-hidden="true"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>;
  }
  if (issuer === 'Google') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="issuer-icon" aria-hidden="true"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>;
  }
  if (issuer.includes('AWS') || issuer === 'Amazon Web Services') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="issuer-icon" aria-hidden="true"><path d="M23.109 15.654C20.354 18.232 16.32 19.8 11.956 19.8c-4.499 0-8.643-1.66-11.455-4.364L2.096 17c2.616 2.502 6.467 4.015 10.604 4.015 4.024 0 7.753-1.442 10.409-3.842l.024-3.52zM21.579 12.285l-4.148-3.072 1.341 4.707 2.807-1.635z"/></svg>;
  }
  if (issuer === 'Whizlabs') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="issuer-icon" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
  }
  return null;
}

export function CredentialSummary() {
  return <dl className="credential-summary" aria-label="Evidence summary">
    <div><dt>Professional programs</dt><dd>{credentialCounts.programs}</dd></div>
    <div><dt>Course & lab completions</dt><dd>{credentialCounts.completions}</dd></div>
    <div><dt>Competition records</dt><dd>{credentialCounts.competitions}</dd></div>
  </dl>;
}

function EvidenceLink({ credential }: { credential: Credential }) {
  return credential.verificationUrl
    ? <a className="credential-verify" href={credential.verificationUrl} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${credential.title} on ${credential.provider ?? credential.issuer}`}><span>Verification available</span><ArrowUpRight size={16} aria-hidden="true" /></a>
    : <span className="credential-evidence">Certificate evidence</span>;
}

export function ProgramList({ programs, compact = false }: { programs: readonly Credential[]; compact?: boolean }) {
  return <ol className={`credential-programs${compact ? ' credential-programs-compact' : ''}`}>
    {programs.map(program => <li className="credential-program" key={program.slug} data-program={program.slug}>
      <div className="credential-program-identity"><p className="credential-meta credential-meta-issuer"><IssuerIcon issuer={program.issuer} /><span>{program.issuer} / {program.provider}</span></p><h3>{program.title}</h3><p className="credential-meta">{credentialKindLabels[program.kind]} · <time dateTime={program.issuedAt}>{formatCredentialDate(program.issuedAt)}</time> · {componentsFor(program.slug).length} components</p></div>
      <div className="credential-program-detail"><p>{program.summary}</p>{!compact && <p className="credential-skills">{program.skills.join(' / ')}</p>}{program.disclaimer && <p className="credential-disclaimer">{program.disclaimer}</p>}<EvidenceLink credential={program} /></div>
    </li>)}
  </ol>;
}

export function CompletionList({ records }: { records: readonly Credential[] }) {
  return <ul className="credential-completions">{records.map(record => <li key={record.slug} data-completion={record.slug}>
    <div><h4>{record.title}</h4><p className="credential-meta credential-meta-issuer"><IssuerIcon issuer={record.issuer} /><span>{record.issuer}{record.provider && ` / ${record.provider}`} · {credentialKindLabels[record.kind]} · <time dateTime={record.issuedAt}>{formatCredentialDate(record.issuedAt)}</time></span></p>{record.summary && <p>{record.summary}</p>}{record.disclaimer && <p className="credential-disclaimer">{record.disclaimer}</p>}{record.certificateId && <p className="credential-meta credential-id">Certificate ID: {record.certificateId}</p>}</div><EvidenceLink credential={record} />
  </li>)}</ul>;
}

export function CompetitionList() {
  return (
    <ol className="recognition-records">
      {competitionRecognitions.map(record => (
        <li key={record.slug} data-competition={record.slug}>
          <div className="recognition-result">
            <span className="credential-meta">{record.year}</span>
            <p>{record.result}</p>
          </div>
          
          <div className="recognition-content-wrapper">
            <div>
              <h3>{record.event}</h3>
              <p className="recognition-scope">{record.scope}{record.project && ` · ${record.project}`}</p>
              {record.description && <p>{record.description}</p>}
              <p className="credential-meta">
                <time dateTime={record.startsAt}>{formatCredentialDate(record.startsAt)}</time> — <time dateTime={record.endsAt}>{formatCredentialDate(record.endsAt)}</time>
              </p>
              {record.organizers.length > 0 && <p className="credential-meta">{record.organizers.join(' / ')}</p>}
              {record.venue && <p className="credential-meta">{record.venue}</p>}
              {record.achievements.length > 0 && (
                <ul className="recognition-achievements" aria-label="Additional recognition">
                  {record.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}
                </ul>
              )}
              {record.bootcampAt && (
                <p className="credential-meta">Bootcamp: <time dateTime={record.bootcampAt}>{formatCredentialDate(record.bootcampAt)}</time></p>
              )}
              
              {record.verificationUrl ? (
                <a className="credential-verify" href={record.verificationUrl} target="_blank" rel="noopener noreferrer" aria-label={`Verify on issuer website`}>
                  <span>Verification available</span><ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : (
                <p className="credential-evidence">Certificate evidence</p>
              )}
            </div>
            
            {record.certificateImage && (
              <div className="recognition-image-wrapper">
                <SafeImage src={record.certificateImage} alt={`Certificate for ${record.event}`} width={600} height={450} sizes="(max-width: 768px) 100vw, 320px" className="recognition-image" />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function NextTargets() {
  return <details className="credential-targets"><summary>Next certification targets</summary><div>
    <h3>Next targets</h3><p>Aspirational targets, not earned credentials. These are separate from the completed programs above.</p>
    <ul>{nextTargets.map(target => <li key={target.title}><div><h4>{target.title}</h4><p className="credential-meta">{target.issuer}</p></div><span className="status-outline mono">Target</span></li>)}</ul>
  </div></details>;
}
