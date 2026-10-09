export type SkillDepth = 'projects' | 'labs' | 'learning';
type Evidence = { depth: SkillDepth; label: string; href?: string };

const greetly: Evidence = { depth: 'projects', label: 'Greetly engineering case study', href: '/projects/greetly' };
const pilot: Evidence = { depth: 'projects', label: 'Ghazwah AI marketing pilot', href: '/experience#collaboration' };
const websites: Evidence = { depth: 'projects', label: 'Delivered websites', href: '/projects#selected' };
const evidence: Record<string, Evidence> = {
  'Raspberry Pi': greetly, Python: greetly, Linux: greetly, Supabase: greetly,
  PostgreSQL: greetly, TypeScript: greetly, Cloudflare: greetly, Git: greetly,
  Firebase: { depth: 'projects', label: 'Hostel complaint portal', href: '/projects#project-aduan' },
  JavaScript: websites, HTML5: websites, CSS3: websites,
  DigitalOcean: pilot, n8n: pilot, MCP: pilot, Hermes: pilot, 'Agentic AI': pilot, 'AI Automation': pilot,
  AWS: { depth: 'labs', label: 'Completed AWS learning programs', href: '/credentials#programs' },
  GCP: { depth: 'labs', label: 'Cloud training and course evidence', href: '/credentials#courses' },
};

export function evidenceFor(name: string): Evidence {
  return evidence[name] ?? { depth: 'learning', label: 'Profile-listed learning; project evidence not yet linked' };
}

export const skillDepths: { id: string; depth: SkillDepth; title: string; description: string }[] = [
  { id: 'used', depth: 'projects', title: 'Used in projects', description: 'Tools connected to a documented build or pilot. Select a badge to see the work.' },
  { id: 'labs', depth: 'labs', title: 'Hands-on / labs', description: 'Structured learning and training evidence, separate from production experience.' },
  { id: 'learning', depth: 'learning', title: 'Currently learning', description: 'The wider toolkit from my profile. These entries do not yet have linked project evidence; they are not a claim of equal proficiency.' },
];
