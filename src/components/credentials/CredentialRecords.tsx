import { ArrowUpRight } from 'lucide-react';
import type { Credential, CompetitionRecognition } from '@/types/portfolio';
import { competitionRecognitions, componentsFor, credentialCounts, credentialKindLabels, formatCredentialDate, nextTargets } from '@/data/credentials';
import { SafeImage } from '@/components/ui/SafeImage';

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
      <div className="credential-program-identity"><p className="credential-meta">{program.issuer} / {program.provider}</p><h3>{program.title}</h3><p className="credential-meta">{credentialKindLabels[program.kind]} · <time dateTime={program.issuedAt}>{formatCredentialDate(program.issuedAt)}</time> · {componentsFor(program.slug).length} components</p></div>
      <div className="credential-program-detail"><p>{program.summary}</p>{!compact && <p className="credential-skills">{program.skills.join(' / ')}</p>}{program.disclaimer && <p className="credential-disclaimer">{program.disclaimer}</p>}<EvidenceLink credential={program} /></div>
    </li>)}
  </ol>;
}

export function CompletionList({ records }: { records: readonly Credential[] }) {
  return <ul className="credential-completions">{records.map(record => <li key={record.slug} data-completion={record.slug}>
    <div><h4>{record.title}</h4><p className="credential-meta">{record.issuer}{record.provider && ` / ${record.provider}`} · {credentialKindLabels[record.kind]} · <time dateTime={record.issuedAt}>{formatCredentialDate(record.issuedAt)}</time></p>{record.summary && <p>{record.summary}</p>}{record.disclaimer && <p className="credential-disclaimer">{record.disclaimer}</p>}{record.certificateId && <p className="credential-meta credential-id">Certificate ID: {record.certificateId}</p>}</div><EvidenceLink credential={record} />
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
