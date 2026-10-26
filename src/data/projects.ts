import type { JourneyStep, Project } from '@/types/portfolio';
import syncedProjectRecords from '@/data/github-projects.generated.json';

type SyncedProject = Project & {
  sourceRepo: string;
  stage?: string;
  scope?: string[];
  developmentNote?: string;
};

const syncedProjects = syncedProjectRecords as SyncedProject[];
export const syncedActiveProjects = syncedProjects.filter((project) => project.status === 'active');
const syncedOngoingProjects = syncedProjects.filter((project) => project.status === 'in-development') as (Project & {
  sourceRepo: string;
  stage: string;
  scope: string[];
  developmentNote: string;
})[];

export const projects: Project[] = [
  { slug: 'greetly', title: 'Greetly', subtitle: 'An edge-to-cloud attendance ecosystem.', status: 'active',
    description: 'An attendance system for students and administrators. A Raspberry Pi recognises faces locally and sends attendance records to a cloud dashboard.',
    stack: ['Raspberry Pi', 'OpenCV', 'Python', 'Next.js', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/syahmiaof/greetly', liveUrl: 'https://greetly.syahmiaof.my', featured: true, image: '/images/greetly-device.webp' },
  { slug: 'daeng-kuning', title: 'Daeng Kuning', subtitle: 'Heritage, with a digital home.', status: 'active',
    description: 'A web portal for Akademi Persilatan Daeng Kuning, bringing the academy, membership information and its silat heritage online.',
    stack: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/syahmiaof/daengkuning', liveUrl: 'https://daengkuning.my', featured: true, image: '/images/daeng-kuning.webp' },
  // { slug: 'nurizma-bridal', title: 'Nurizma Bridal', subtitle: 'A considered home for a personal craft.', status: 'active',
  //   description: 'A visual henna portfolio and service website in Taiping, Perak. The public repository is Nurizma Bridal; the current live site uses the Hanim Henna identity.',
  //   stack: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/syahmiaof/nurizmabridal', liveUrl: 'https://henna.nurizmabridal.my', featured: false, image: '/images/nurizma-bridal.webp' },
  { slug: 'sistem-aduan', title: 'Sistem Aduan Asrama', subtitle: 'From a reported problem to a visible status.', status: 'active',
    description: 'A hostel complaint system for IKM Besut. Students submit and track reports; the documented workflow connects Firebase data with Telegram notifications.',
    stack: ['JavaScript', 'Firebase', 'Telegram API', 'Chart.js'], github: 'https://github.com/syahmiaof/sistem-aduan-asrama-ikm', liveUrl: 'https://sistemaduanasrama.syahmiaof.my', image: '/images/sistem-aduan.webp', featured: false },
  { slug: 'siapsatu', title: 'SiapSatu', subtitle: 'Satu modul. Satu hasil.', status: 'active',
    description: 'Platform mikro-pembelajaran interaktif berbahasa Melayu berorientasikan hasil praktikal (outcome-based) pada harga RM10 satu modul. Menghimpunkan modul bersasar seperti Meta Ads + AI, Gemini Canvas, n8n, hingga pembangunan web moden dengan panduan langkah demi langkah bergambar dan template sedia guna.',
    stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'CSS Modules', 'Playwright'], github: 'https://github.com/syahmiaof/siapsatu', liveUrl: 'https://siapsatu.syahmiaof.my', image: '/images/siapsatu.png', featured: true },
  { slug: 'modul-meta-ads', title: 'Modul Ebook Lengkap: Meta Ads & AI Agent Automation', subtitle: 'Dari butang klik hingga token kekal & integrasi AI agent melalui MCP.', status: 'active',
    description: 'Panduan praktikal dan portal modul interaktif menghubungkan pemasaran Meta Ads dengan automasi AI agent. Merangkumi setup Facebook Page, API token kekal, Instant Form ID, hingga integrasi alat AI agent melalui Model Context Protocol (MCP).',
    stack: ['Meta Ads API', 'AI Agents', 'MCP', 'JavaScript', 'Automation'], github: 'https://github.com/syahmiaof/modul-meta-ads', liveUrl: 'https://modul-meta-ads.syahmiaof.my/', image: '/images/modul-meta-ads.png', featured: false },
];

const curatedOngoingProjects: (Project & { stage: string; scope: readonly string[]; developmentNote: string })[] = [
  {
    slug: 'lamborghini', title: 'LAMBORGHINI — The Art of Motion', subtitle: 'Cinematic automotive scrollytelling experience.', status: 'in-development',
    description: 'A high-performance automotive web experience featuring Canvas 2D image sequence scrubbing, GSAP ScrollTrigger, Lenis smooth scrolling, and Chiaroscuro visual art direction.',
    stack: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Canvas 2D'], github: 'https://github.com/syahmiaof/lamborghini-art-of-motion', liveUrl: 'https://lamborghini.syahmiaof.my', image: '/images/lamborghini.webp', featured: false,
    stage: 'Deployed showcase · Scrollytelling & Canvas 2D',
    scope: ['Canvas 2D image sequence', 'GSAP ScrollTrigger', 'Chiaroscuro visual aesthetic'],
    developmentNote: 'A high-performance cinematic automotive scrollytelling showcase experimenting with interactive canvas rendering, smooth viewport scrubbing and dark automotive aesthetic.',
  },
  {
    slug: 'cerviscan-ai', title: 'CerviScan-AI', subtitle: 'Computer vision for cervical screening research.', status: 'in-development',
    description: 'A team project for AI-assisted cervical screening research. I build the CMS dashboard and video-streaming application, integrating YOLOv8 to analyse cervical samples and support image review.',
    stack: ['React', 'TypeScript', 'Vite', 'YOLOv8'], liveUrl: 'https://cerviscan-ai.syahmiaof.my/', github: 'https://github.com/syahmiaof/CerviScan-AI', image: '/images/cerviscan-dashboard.webp', featured: false,
    stage: 'My role · CMS dashboard, video streaming & AI integration',
    scope: ['CMS dashboard', 'Video streaming', 'YOLOv8 integration'],
    developmentNote: 'Built with my team and still in development. The public dashboard uses mock data. This is a research prototype, not a clinically validated diagnostic device; demo metrics and certification labels are not verified claims.',
  },
  {
    slug: 'gayongx', title: 'GayongX : Official Website , Portal User & CMS Admin', subtitle: 'A connected ecosystem for Silat Seni Gayong Perak.', status: 'in-development',
    description: 'Building a digital home for the association: member and gelanggang management, learning resources, and athlete development, connected through one ecosystem.',
    stack: ['Next.js', 'React', 'TypeScript'], featured: false, liveUrl: 'https://gayongx.syahmiaof.my', image: '/images/gayongx-website.jpg',
    stage: 'Early development · Website & ecosystem design',
    scope: ['Members & gelanggang', 'Learning & heritage', 'Athlete development'],
    developmentNote: 'An initial website is implemented. The broader draft covers membership and grading, attendance, events, learning, athlete analytics and a marketplace. These modules are under development; the full ecosystem has not launched.',
  },
    {
      slug: 'gayongx-athlete-analytics', title: 'GayongX : Athlete Analytics', subtitle: 'Combat athlete intelligence for PSSGM Perak.', status: 'in-development',
      description: 'A specialized analytics dashboard for tracking combat athlete performance, including readiness scores, body composition, training load, and recovery metrics.',
      stack: ['Next.js', 'React', 'TypeScript'], featured: false, liveUrl: 'https://gxaa.syahmiaof.my', image: '/images/gayongx-athlete-analytics.png',
      stage: 'Prototype · Data integration & visualization',
      scope: ['Performance tracking', 'Health metrics', 'Training schedules'],
      developmentNote: 'The dashboard prototype is functional but currently uses demo data. Integration with actual training sensors and member databases is planned for the next phase.'
    },
    {
      slug: 'gamegayongx-warisan', title: 'Game GayongX : Warisan', subtitle: 'Sebuah kisah tentang amanah.', status: 'in-development',
      description: 'A web-based interactive dramatization exploring the history and heritage of Silat Seni Gayong. Features keyboard and touch controls, taking players back to Pulau Sudong, 1942.',
      stack: ['Next.js', 'React', 'TypeScript'], featured: false, liveUrl: 'https://gamegayongx-warisan.syahmiaof.my', image: '/images/game-gayongx-warisan.png',
      stage: 'Early development · Chapter 1 demo',
      scope: ['Interactive storytelling', 'Historical dramatization', 'Game mechanics'],
      developmentNote: 'Currently in early development. Chapter 1 serves as a proof of concept for the game engine and narrative direction.'
    },
      {
        slug: 'symi', title: 'SYMI', subtitle: 'Crafted Frozen Yogurt.', status: 'in-development',
        description: 'A digital storefront and e-commerce experience for SYMI Crafted Frozen Yogurt, showcasing the flavor universe and driving daily swirl promotions.',
        stack: ['Next.js', 'React', 'TypeScript'], featured: false, liveUrl: 'https://symi.syahmiaof.my', image: '/images/symi.png',
        stage: 'Prototyping · UI/UX Design',
        scope: ['E-commerce', 'Brand identity', 'Mobile-first design'],
        developmentNote: 'Currently in the design and prototyping phase. The interface focuses on high-quality visuals and smooth interactions to represent the crafted frozen yogurt brand.'
      }
    ];

export const ongoingProjects = [...curatedOngoingProjects, ...syncedOngoingProjects];

export const journey: JourneyStep[] = [
  { id: 'capture', name: 'Capture', component: 'Camera input', description: 'The Pi reads camera frames locally. The frame stays at the edge for the recognition step.' },
  { id: 'process', name: 'Process', component: 'Raspberry Pi · OpenCV', description: 'OpenCV prepares grayscale face regions on the Raspberry Pi. Local processing avoids sending a continuous video stream to the dashboard.' },
  { id: 'identify', name: 'Identify', component: 'LBPH recognition · cooldown', description: 'The current Python script matches faces with an LBPH recognizer. A per-person cooldown suppresses repeated attendance writes.' },
  { id: 'sync', name: 'Sync', component: 'Supabase client', description: 'The edge script sends attendance records through the Supabase client. A local queue in the script supports retrying writes.' },
  { id: 'store', name: 'Store', component: 'PostgreSQL', description: 'An attendance record is stored in attendance_logs, connecting the identified student to a timestamp and attendance status.' },
  { id: 'visualize', name: 'Visualize', component: 'Next.js · Realtime', description: 'The dashboard subscribes to database updates through Supabase Realtime, bringing the recorded event into the administrator’s view.' },
];
