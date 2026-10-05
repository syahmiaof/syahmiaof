import { ArrowUpRight } from 'lucide-react';
import type { Credential, CompetitionRecognition } from '@/types/portfolio';
import { competitionRecognitions, componentsFor, credentialCounts, credentialKindLabels, formatCredentialDate, nextTargets } from '@/data/credentials';
import { SafeImage } from '@/components/ui/SafeImage';

function IssuerIcon({ issuer }: { issuer: string }) {
  if (issuer === 'Microsoft') {
    return <svg role="img" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="issuer-icon" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>;
  }
  if (issuer === 'Google') {
    return <svg role="img" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="issuer-icon" aria-hidden="true"><path fill="#4285F4" d="M47.5 24.5c0-1.7-.1-3.3-.4-4.8H24v9.1h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z"/><path fill="#34A853" d="M24 48c6.6 0 12.2-2.2 16.2-5.9l-7.9-6c-2.2 1.5-5 2.4-8.3 2.4-6.4 0-11.8-4.3-13.8-10.1H2.1v6.2C6.1 42.5 14.3 48 24 48z"/><path fill="#FBBC05" d="M10.2 28.4c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7V12.7H2.1C.8 15.2 0 18.1 0 21.2s.8 6 2.1 8.5l8.1-6.3z"/><path fill="#EA4335" d="M24 9.5c3.6 0 6.8 1.2 9.4 3.7l7-7C36.2 2.4 30.6 0 24 0 14.3 0 6.1 5.5 2.1 13.4l8.1 6.3c2-5.8 7.4-10.2 13.8-10.2z"/></svg>;
  }
  if (issuer.includes('AWS') || issuer === 'Amazon Web Services') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="issuer-icon" aria-hidden="true"><path fill="#FF9900" d="M23.109 15.654C20.354 18.232 16.32 19.8 11.956 19.8c-4.499 0-8.643-1.66-11.455-4.364L2.096 17c2.616 2.502 6.467 4.015 10.604 4.015 4.024 0 7.753-1.442 10.409-3.842l.024-3.52z"/><path fill="#FF9900" d="M21.579 12.285l-4.148-3.072 1.341 4.707 2.807-1.635z"/></svg>;
  }
  if (issuer === 'Whizlabs') {
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#F15A24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="issuer-icon" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
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
