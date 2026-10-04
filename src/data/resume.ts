import { credentials } from '@/data/credentials';

// Curated CV content. Leave unconfirmed institution names, dates and grades out.
export const resume = {
  headline: 'Cloud Computing Student | Software Developer | AI Automation',
  summary: 'Cloud computing student and independent builder connecting web applications, cloud infrastructure and edge devices. Builds portfolio projects across attendance systems, computer vision interfaces and workflow automation, with an interest in cloud and DevOps engineering.',
  education: 'Cloud Computing - currently studying',
  skills: [
    'Development: TypeScript, JavaScript, Python, React, Next.js, HTML, CSS',
    'Data and deployment: Supabase, PostgreSQL, Firebase, Git, Vercel, Cloudflare',
    'Edge and AI: Raspberry Pi, OpenCV, YOLOv8 integration, AI agents, MCP, n8n',
  ],
  projects: [
    { name: 'Greetly', detail: 'Edge-to-cloud attendance system', bullets: [
      'Built a workflow connecting Raspberry Pi camera capture and local OpenCV recognition to Supabase and a Next.js attendance dashboard.',
      'Implemented recognition cooldowns, queued write retries and realtime attendance updates.',
    ] },
    { name: 'CerviScan-AI', detail: 'Computer vision research prototype | In development', bullets: [
      'Develops the CMS dashboard and video-streaming application with YOLOv8 integration for cervical sample review.',
      'Research prototype with demo data; not a clinically validated diagnostic device.',
    ] },
    { name: 'GayongX', detail: 'Silat association ecosystem | In development', bullets: [
      'Builds the digital ecosystem for Silat Seni Gayong Perak, including the public website, member portal and administrative interfaces.',
      'Develops related athlete analytics and heritage storytelling prototypes.',
    ] },
    { name: 'Sistem Aduan Asrama', detail: 'Hostel complaint management', bullets: [
      'Built a student reporting and status-tracking interface using Firebase, with a documented Telegram notification workflow.',
    ] },
  ],
  collaboration: {
    title: 'Ghazwah Group - AI Marketer & Automation Builder',
    bullets: [
      'Builds a specialist-agent marketing pilot for DFK INC / Ghazwah Tech, covering research, content, design, publishing and analytics.',
      'Connects Canva MCP, n8n and Meta Ads tooling; retains human approval for paid ads and other high-risk actions.',
    ],
  },
  credentials: credentials.filter(item => ['aws-security-engineer-advanced', 'aws-cloud-solutions-architect', 'google-ai', 'google-it-support'].includes(item.slug)).map(item => `${item.title} - ${item.provider || item.issuer} (${item.issuedAt.slice(0, 7)})`),
};
