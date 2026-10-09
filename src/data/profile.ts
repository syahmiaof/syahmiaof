// Keep the working address until the owner verifies a replacement mailbox.
export const contactConfig = { email: 'syahmiaof123@gmail.com', preferredDomainEmail: 'hello@syahmiaof.my', domainEmailVerified: false };
export const profile = {
  name: 'Muhammad Syahmi', displayName: 'SYAHMI AOF',
  role: 'Cloud Computing Student', location: 'Malaysia',
  email: contactConfig.email, github: 'https://github.com/syahmiaof',
  phone: '010-796 5236', phoneInternational: '+60107965236',
  whatsapp: 'https://wa.me/60107965236', siteUrl: 'https://syahmiaof.my',
  description: 'I build systems across software, cloud infrastructure, automation and intelligent edge devices.',
  resumeUrl: '/api/resume',
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
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Projects', href: '/#work', id: 'work' },
  { name: 'Experience', href: '/experience', id: 'experience' },
  { name: 'Skills', href: '/skills', id: 'skills' },
  { name: 'Credentials', href: '/credentials', id: 'credentials' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
];
