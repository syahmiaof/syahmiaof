import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { awards } from '@/data/awards';

export type SymiReply = { text: string; links?: { label: string; href: string }[] };
export type SymiMessage = SymiReply & { id: number; role: 'user' | 'assistant' };
export const symiGreeting = 'Hi, I’m Symi. What would you like to know about tuan saya, Syahmi?';
export const symiSuggestions = ['Who is Syahmi?', 'Show me his projects', 'What does he work with?', 'How can I contact him?'];

/** A provider boundary for a future server-side Gemini integration. No remote model is called today. */
export async function getSymiReply(question: string): Promise<SymiReply> {
  const text = question.toLowerCase();
  if (/contact|email|whatsapp|phone|telefon|hubungi|hire|kerja sama|collaborat/.test(text)) return {
    text: `Boleh! Email Syahmi at ${profile.email}, or WhatsApp ${profile.phone}. For a project or opportunity, share a little context and he can take it from there.`,
    links: [{ label: 'WhatsApp Syahmi', href: profile.whatsapp }, { label: 'Send an email', href: `mailto:${profile.email}` }],
  };
  if (/resume|résumé|\bcv\b/.test(text)) return { text: 'You can request Syahmi’s latest resume by email.', links: [{ label: 'Request resume', href: profile.resumeUrl }] };
  if (/greetly|attendance|kehadiran/.test(text)) return { text: 'Greetly connects a Raspberry Pi camera and local OpenCV recognition to Supabase and a Next.js dashboard. The case study explains how one attendance event travels through the system.', links: [{ label: 'Explore Greetly', href: '/projects/greetly' }] };
  if (/award|win|anugerah|juara|pencapaian/.test(text)) return { text: awards.length ? awards.map(award => `${award.title} — ${award.event}, ${award.year}.`).join('\n') : 'Award details haven’t been published here yet. The Awards & wins section will hold those updates.', links: [{ label: 'Awards & wins', href: '/#awards' }] };
  if (/project|projek|build|portfolio|work\b|bina/.test(text) && !/work with/.test(text)) return { text: `His projects include ${projects.map(project => project.title).join(', ')}. Greetly is the featured edge-to-cloud project.`, links: [{ label: 'Explore the work', href: '/#work' }, { label: '30-second overview', href: '/quick' }] };
  if (/skill|stack|tech|cloud|devops|work with|kemahiran|tools|\bai\b/.test(text)) return { text: 'Syahmi works across web applications, cloud services and edge devices. His projects use Next.js, Python, OpenCV, Supabase and Firebase. He is also exploring DevOps, AI automation and agent workflows.', links: [{ label: 'Explore capabilities', href: '/#capabilities' }] };
  if (/who|siapa|about|background|study|belajar|student|location|malaysia/.test(text)) return { text: 'Muhammad Syahmi is a cloud computing student based in Malaysia. He enjoys connecting interfaces with the infrastructure, data and automation behind them, and is working toward cloud and DevOps engineering.', links: [{ label: 'Meet Syahmi', href: '/#about' }] };
  if (/gemini|model|chatbot|symi|human|manusia/.test(text)) return { text: 'I’m Symi, Syahmi’s portfolio guide. Right now I use prepared answers about this portfolio; I’m not connected to a live AI model yet. Ask me about his work, skills or contact details.' };
  if (/^(hi|hello|hey|hai|salam|helo)[! .]*$/.test(text.trim())) return { text: symiGreeting };
  return { text: 'I don’t have that information in my portfolio notes yet. Try asking about Syahmi, Greetly, his skills or how to contact him.', links: [{ label: 'Ask Syahmi directly', href: profile.whatsapp }] };
}
