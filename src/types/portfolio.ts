export type ProjectStatus = 'active' | 'experiment' | 'planned' | 'concept';
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
