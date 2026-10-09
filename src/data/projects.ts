import type { JourneyStep, Project } from '@/types/portfolio';

export const projects: Project[] = [
  { slug: 'greetly', title: 'Greetly', subtitle: 'An edge-to-cloud attendance ecosystem.', status: 'active',
    description: 'An attendance system for students and administrators. A Raspberry Pi recognises faces locally and sends attendance records to a cloud dashboard.',
    stack: ['Raspberry Pi', 'OpenCV', 'Python', 'Next.js', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/syahmiaof/greetly', liveUrl: 'https://greetly.syahmiaof.my', featured: true, image: '/images/greetly-device.webp' },
  { slug: 'daeng-kuning', title: 'Daeng Kuning', subtitle: 'Heritage, with a digital home.', status: 'active',
    description: 'A web portal for Akademi Persilatan Daeng Kuning, bringing the academy, membership information and its silat heritage online.',
    stack: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/syahmiaof/daengkuning', liveUrl: 'https://daengkuning.my', featured: false, image: '/images/daeng-kuning.webp' },
  // { slug: 'nurizma-bridal', title: 'Nurizma Bridal', subtitle: 'A considered home for a personal craft.', status: 'active',
  //   description: 'A visual henna portfolio and service website in Taiping, Perak. The public repository is Nurizma Bridal; the current live site uses the Hanim Henna identity.',
  //   stack: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/syahmiaof/nurizmabridal', liveUrl: 'https://henna.nurizmabridal.my', featured: false, image: '/images/nurizma-bridal.webp' },
  { slug: 'sistem-aduan', title: 'Sistem Aduan Asrama', subtitle: 'From a reported problem to a visible status.', status: 'active',
    description: 'A hostel complaint system for IKM Besut. Students submit and track reports; the documented workflow connects Firebase data with Telegram notifications.',
    stack: ['JavaScript', 'Firebase', 'Telegram API', 'Chart.js'], github: 'https://github.com/syahmiaof/sistem-aduan-asrama-ikm', liveUrl: 'https://sistemaduanasrama.syahmiaof.my', image: '/images/sistem-aduan.webp', featured: false },
  { slug: 'ai-growth-automation', title: 'AI Growth Marketer & Automation Specialist', subtitle: 'Agentic growth and revenue system.', status: 'active',
    description: 'An agentic growth and revenue system that turns social engagement into qualified, traceable sales opportunities through intent detection, lead scoring, structured qualification, model routing and failure-safe handoffs.',
    stack: ['AI', 'Automation', 'Agents'], liveUrl: '/projects/ai-growth-automation', featured: false },
];

export const ongoingProjects: (Project & { stage: string; scope: readonly string[]; developmentNote: string })[] = [
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

export const journey: JourneyStep[] = [
  { id: 'capture', name: 'Capture', component: 'Camera input', description: 'The Pi reads camera frames locally. The frame stays at the edge for the recognition step.' },
  { id: 'process', name: 'Process', component: 'Raspberry Pi · OpenCV', description: 'OpenCV prepares grayscale face regions on the Raspberry Pi. Local processing avoids sending a continuous video stream to the dashboard.' },
  { id: 'identify', name: 'Identify', component: 'LBPH recognition · cooldown', description: 'The current Python script matches faces with an LBPH recognizer. A per-person cooldown suppresses repeated attendance writes.' },
  { id: 'sync', name: 'Sync', component: 'Supabase client', description: 'The edge script sends attendance records through the Supabase client. A local queue in the script supports retrying writes.' },
  { id: 'store', name: 'Store', component: 'PostgreSQL', description: 'An attendance record is stored in attendance_logs, connecting the identified student to a timestamp and attendance status.' },
  { id: 'visualize', name: 'Visualize', component: 'Next.js · Realtime', description: 'The dashboard subscribes to database updates through Supabase Realtime, bringing the recorded event into the administrator’s view.' },
];
