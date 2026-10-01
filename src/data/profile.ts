export const profile = {
  name: 'Muhammad Syahmi', displayName: 'SYAHMI AOF',
  role: 'Cloud Computing Student', location: 'Malaysia',
  email: 'syahmiaof123@gmail.com', github: 'https://github.com/syahmiaof',
  phone: '010-796 5236', phoneInternational: '+60107965236',
  whatsapp: 'https://wa.me/60107965236', siteUrl: 'https://syahmiaof.my',
  description: 'I build systems across software, cloud infrastructure, automation and intelligent edge devices.',
  resumeUrl: 'mailto:syahmiaof123@gmail.com?subject=Resume%20request',
};
export type SocialPlatform = 'facebook' | 'tiktok' | 'instagram' | 'threads' | 'github' | 'linkedin';
export const socials: { platform: SocialPlatform; label: string; href: string | null }[] = [
  { platform: 'facebook', label: 'Facebook', href: null },
  { platform: 'tiktok', label: 'TikTok', href: null },
  { platform: 'instagram', label: 'Instagram', href: null },
  { platform: 'threads', label: 'Threads', href: null },
  { platform: 'github', label: 'GitHub', href: profile.github },
  { platform: 'linkedin', label: 'LinkedIn', href: null },
];
export const navigation = [
  { name: 'Index', href: '/#index', id: 'index' },
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Work', href: '/#work', id: 'work' },
  { name: 'Lab', href: '/#lab', id: 'lab' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
];
