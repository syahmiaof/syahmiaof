export type ProjectStatus = 'active' | 'in-development' | 'experiment';
export type Project = {
  slug: string; title: string; subtitle: string; status: ProjectStatus;
  description: string; stack: string[]; github?: string; liveUrl?: string;
  featured: boolean; image?: string;
};
export type SkillLevel = 'used-in-projects' | 'working-knowledge' | 'exploring';
export type Capability = {
  name: string; description: string; level: SkillLevel;
  technologies: string[]; evidence: string; href?: string;
};
export type Certification = {
  title: string; issuer: string; status: 'earned' | 'in-progress' | 'target';
  issued?: string; credentialUrl?: string; evidence?: string;
};
export type JourneyStep = { id: string; name: string; component: string; description: string };

export type CredentialKind = 'professional-certificate' | 'specialization' | 'course' | 'guided-lab';
export type EvidenceLevel = 'issuer-verified' | 'certificate-only';
export interface Credential {
  slug: string;
  title: string;
  issuer: string;
  provider?: string;
  kind: CredentialKind;
  issuedAt: string;
  verificationUrl?: string;
  certificateId?: string;
  parentSlug?: string;
  featured: boolean;
  category: 'program' | 'completion';
  skills: readonly string[];
  summary?: string;
  disclaimer?: string;
  evidenceLevel: EvidenceLevel;
}
export interface CompetitionRecognition {
  slug: string;
  event: string;
  year: string;
  scope: string;
  result: string;
  achievements: readonly string[];
  organizers: readonly string[];
  project?: string;
  description?: string;
  venue?: string;
  startsAt: string;
  endsAt: string;
  bootcampAt?: string;
  evidenceLevel: 'certificate-only' | 'issuer-verified';
  verificationUrl?: string;
  certificateImage?: string;
  featured: boolean;
}
