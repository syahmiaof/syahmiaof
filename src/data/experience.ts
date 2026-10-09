export type ExperienceCategory = 'people' | 'operations' | 'development' | 'leadership' | 'marketing';

export interface WorkExperience {
  id: string;
  chapter: string;
  category: ExperienceCategory;
  role: string;
  organization: string;
  summary: string;
  responsibilities: string[];
  transferableSkills: [string, string, string];
  highlight?: { value: string; label: string };
  link?: { href: string; label: string };
}

// Owner-supplied experience. Chapters express a capability progression, not dates.
export const workExperiences: WorkExperience[] = [
  {
    id: 'people', chapter: 'People', category: 'people', role: 'Takaful advisor',
    organization: 'Client advisory',
    summary: 'Listen first. Build trust. Make the options clear.',
    responsibilities: [
      'Understood client needs, explained options and handled questions without losing the human side of the conversation.',
      'Built relationships through follow-up, active listening and clear communication.',
    ],
    transferableSkills: ['Active listening', 'Client communication', 'Negotiation'],
  },
  {
    id: 'operations', chapter: 'Operations', category: 'operations', role: 'Part-time administrator',
    organization: 'NADI / Pusat Internet',
    summary: 'Technology has to work for the person using it.',
    responsibilities: [
      'Helped community users with computers, digital services, device setup and everyday troubleshooting.',
      'Supported daily administration and documentation, explaining technical steps in language people could use.',
    ],
    transferableSkills: ['IT support', 'Problem solving', 'Technical communication'],
  },
  {
    id: 'building', chapter: 'Building', category: 'development', role: 'Freelance web developer',
    organization: 'Independent digital services',
    summary: 'From a client conversation to a working website.',
    responsibilities: [
      'Turned business needs into scope, interfaces and frontend implementations, working through feedback and revisions.',
      'Handled domains, DNS, hosting and deployment alongside the responsibility of delivering the work.',
    ],
    transferableSkills: ['Client discovery', 'Technical delivery', 'Ownership'],
    link: { href: '/projects#selected', label: 'Explore the delivered work' },
  },
  {
    id: 'leadership', chapter: 'Leadership', category: 'leadership', role: 'Founder, coach & operator',
    organization: 'Akademi Persilatan Daeng Kuning',
    summary: 'An academy to run. People to teach. Decisions to own.',
    responsibilities: [
      'Run coaching, mentoring, class coordination and academy operations, including administration and team responsibilities.',
      'Manage branding, marketing, member communication and events while developing the business and its community.',
    ],
    transferableSkills: ['Leadership', 'Mentoring', 'Business operations'],
    highlight: { value: 'RM15,000', label: 'TUBE SME Corp grant received to expand the business.' },
    link: { href: '/projects#selected', label: 'See Daeng Kuning online' },
  },
  {
    id: 'growth', chapter: 'Growth systems', category: 'marketing', role: 'Digital marketer',
    organization: 'Ghazwah · Current role',
    summary: 'Connect the content, the campaign and the workflow.',
    responsibilities: [
      'Handle content strategy, social media operations and Meta Ads campaign work, from audience planning to optimization.',
      'Build AI agent workflows for research, content, scheduling and monitoring, with human approval for higher-risk actions.',
    ],
    transferableSkills: ['Audience strategy', 'AI automation', 'Workflow orchestration'],
    link: { href: '#collaboration', label: 'Explore the Ghazwah collaboration' },
  },
];

export const experienceStory = {
  title: 'Experience',
  indexTitle: 'The road here.',
  intro: 'Built through people, operations, business and systems.',
  indexNote: 'Each role adds something to how I build.',
  conclusion: 'People. Operations. Technology.',
  conclusionDetail: 'I bring the same listening, ownership and problem solving into the systems I build.',
  direction: 'Working toward Cloud / DevOps engineering.',
};
