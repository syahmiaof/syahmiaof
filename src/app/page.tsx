import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { About, Philosophy } from '@/components/sections/About';
import { Greetly } from '@/components/sections/Greetly';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { FutureAndLab } from '@/components/sections/FutureAndLab';
import { Capabilities, Intelligence } from '@/components/sections/Capabilities';
import { Credentials } from '@/components/sections/Credentials';
import { Footer } from '@/components/layout/Footer';
import { canonical } from '@/lib/seo';
import { HomeMotion } from '@/components/motion/HomeMotion';
import { NetworkIntro } from '@/components/motion/NetworkIntro';
import { PointerMotion } from '@/components/motion/PointerMotion';
export const metadata: Metadata = { alternates: { canonical: canonical('/') } };
export default function Home() {
  return <><NetworkIntro /><HomeMotion /><PointerMotion /><main id="main" tabIndex={-1}><Hero /><About /><Philosophy /><Greetly /><SelectedWork /><FutureAndLab /><Capabilities /><Intelligence /><Credentials /></main><Footer /></>;
}
