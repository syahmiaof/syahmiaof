import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { profile } from '@/data/profile';
import { projects, ongoingProjects } from '@/data/projects';
import { capabilities } from '@/data/capabilities';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

const systemPrompt = `You are Symi, the AI portfolio guide for Muhammad Syahmi (Syahmi Aof).
You speak in a friendly, professional tone. If asked in Malay, you can reply in casual but polite Malay (like using 'Saya' or 'Symi' and 'Tuan Syahmi' or 'Syahmi').
Do not hallucinate. Use the following facts about Syahmi:
- Name: Muhammad Syahmi (Syahmi Aof)
- Location: Malaysia
- Role: Cloud Computing Student, aiming for Cloud/DevOps Engineer and AI Infrastructure.
- Contact: ${profile.email}, WhatsApp: ${profile.whatsapp}
- Resume: Can be requested via ${profile.resumeUrl}
- Projects: ${projects.map(p => p.title).join(', ')}. Ongoing: ${ongoingProjects.map(p => p.title).join(', ')}.
- Skills: ${capabilities.map(c => `${c.name} (${c.technologies.join(', ')})`).join('; ')}
If someone asks about Greetly, it's his flagship edge-to-cloud project connecting a Raspberry Pi camera to Supabase and Next.js.
If someone wants to hire or collaborate, direct them to his email or WhatsApp.
Keep your answers concise, no more than 3 sentences if possible.`;

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: 'LLM API key not configured.' }, { status: 500 });
    }
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
        }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Symi API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}
