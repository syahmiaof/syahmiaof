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
    return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="issuer-icon" aria-hidden="true"><path d="M11.028 15.65c-1.393.755-3.303 1.189-5.183 1.189-1.344 0-2.355-.306-2.883-1.118-.328-.521-.497-1.178-.497-1.921 0-2.327 1.849-3.791 5.932-3.791.956 0 1.802.132 2.631.328v-.62c0-1.85-.92-2.73-2.784-2.73-1.304 0-2.528.328-3.523.869l-.79-2.285c1.23-.623 2.946-.97 4.698-.97 3.518 0 5.253 1.637 5.253 4.88v6.626h-2.522v-1.443h-.065c-.534.62-1.398 1.187-2.268 1.187m-.266-3.834c-.655-.179-1.36-.26-2.062-.26-1.968 0-2.903.655-2.903 1.803 0 1.045.719 1.666 2.012 1.666 1.455 0 2.522-.72 2.953-1.786v-1.423zm-1.889 8.761c4.542 0 8.73-1.466 12.087-4.116l1.205 1.583c-3.693 2.969-8.411 4.542-13.334 4.542-3.712 0-7.202-1.018-10.314-2.887l1.322-1.639c2.723 1.633 5.86 2.517 9.034 2.517m11.237-4.526c.307-.643.512-1.164.673-1.859h.063c.123.635.347 1.258.653 1.879l1.69 3.522h3.42l-4.103-7.585 3.906-7.391h-3.321l-1.571 3.504c-.305.736-.532 1.255-.714 1.879h-.06c-.144-.543-.328-1.026-.633-1.799l-1.634-3.584h-3.197l-1.551 3.541c-.246.562-.471 1.082-.633 1.761h-.06c-.165-.639-.328-1.066-.613-1.743L12.559 5h-3.159l3.886 7.43-4.162 7.567h3.339l1.796-3.738c.244-.523.511-1.102.693-1.801h.062c.164.58.368 1.101.652 1.761l1.838 3.778h3.359l-1.956-3.984z"/></svg>;
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
