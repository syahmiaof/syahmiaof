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
  
  // Fallback local triggers for extremely common things, otherwise use LLM
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
