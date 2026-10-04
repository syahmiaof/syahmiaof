import { profile } from '@/data/profile';
import { projects, ongoingProjects } from '@/data/projects';
import { awards } from '@/data/awards';
import { ghazwahCollaboration } from '@/data/collaborations';

export type SymiReply = { text: string; links?: { label: string; href: string }[] };
export type SymiMessage = SymiReply & { id: number; role: 'user' | 'assistant' };
export const symiGreeting = 'Hi, I’m Symi. What would you like to know about tuan saya, Syahmi?';
export const symiSuggestions = ['Who is Syahmi?', 'Show me his projects', 'What does he work with?', 'How can I contact him?'];

export async function getSymiReply(question: string): Promise<SymiReply> {
  const text = question.toLowerCase();
  
  if (/ghazwah|dfk|jebat|marketing|marketer/.test(text)) return { text: `Syahmi collaborates with ${ghazwahCollaboration.company} as an AI Marketer. ${ghazwahCollaboration.pilot} is the first pilot for his team of specialist marketing agents, coordinated by Jebat. Paid ads and other high-risk decisions still need human approval.`, links: [{ label: 'Explore the collaboration', href: '/#collaboration' }, { label: 'Ghazwah Group', href: ghazwahCollaboration.website }] };
  if (/contact|email|whatsapp|phone|telefon|hubungi|hire|kerja sama|collaborat/.test(text)) return {
    text: `Boleh! Email Syahmi at ${profile.email}, or WhatsApp ${profile.phone}. For a project or opportunity, share a little context and he can take it from there.`,
    links: [{ label: 'WhatsApp Syahmi', href: profile.whatsapp }, { label: 'Send an email', href: `mailto:${profile.email}` }],
  };
  if (/resume|résumé|\bcv\b/.test(text)) return { text: 'You can request Syahmi’s latest resume by email.', links: [{ label: 'Request resume', href: profile.resumeUrl }] };
  if (/greetly|attendance|kehadiran/.test(text)) return { text: 'Greetly connects a Raspberry Pi camera and local OpenCV recognition to Supabase and a Next.js dashboard. The case study explains how one attendance event travels through the system.', links: [{ label: 'Explore Greetly', href: '/projects/greetly' }] };
  if (/award|win|anugerah|juara|pencapaian/.test(text)) return { text: awards.length ? awards.map(award => `${award.result} — ${award.event}, ${award.year}.`).join('\n') : 'Award details haven’t been published here yet. The Awards & wins section will hold those updates.', links: [{ label: 'Awards & wins', href: '/#awards' }] };
  if (/project|projek|build|portfolio|work\b|bina/.test(text) && !/work with/.test(text)) return { text: `His projects include ${projects.map(project => project.title).join(', ')}. Greetly is the featured edge-to-cloud project. In development: ${ongoingProjects.map(project => project.title).join(', ')}.`, links: [{ label: 'Explore the work', href: '/#work' }, { label: '30-second overview', href: '/quick' }] };
  if (/skill|stack|tech|cloud|devops|work with|kemahiran|tools|\bai\b/.test(text)) return { text: 'Syahmi works across web applications, cloud services and edge devices. His projects use Next.js, Python, OpenCV, Supabase and Firebase. He is also exploring DevOps, AI automation and agent workflows.', links: [{ label: 'Explore capabilities', href: '/#capabilities' }] };
  if (/who|siapa|about|background|study|belajar|student|location|malaysia/.test(text)) return { text: 'Muhammad Syahmi is a cloud computing student based in Malaysia. He enjoys connecting interfaces with the infrastructure, data and automation behind them, and is working toward cloud and DevOps engineering.', links: [{ label: 'Meet Syahmi', href: '/#about' }] };
  if (/^(hi|hello|hey|hai|salam|helo)[! .]*$/.test(text.trim())) return { text: symiGreeting };

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    });
    
    if (!res.ok) {
      throw new Error('API error');
    }
    
    const data = await res.json();
    return { text: data.text || 'I am still learning to answer that!' };
  } catch (error) {
    console.error("Symi API Error:", error);
    return { text: 'I couldn’t reach my AI brain just now. Please try again later or ask me something simpler.' };
  }
}
