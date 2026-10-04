'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Bot, Send, X } from 'lucide-react';
import { getSymiReply, symiGreeting, symiSuggestions, type SymiMessage } from '@/lib/symi';
import './symi.css';

export function Symi() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<SymiMessage[]>([{ id: 0, role: 'assistant', text: symiGreeting }]);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { if (open && log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, open]);
  const close = () => { setOpen(false); launcher.current?.focus(); };
  const send = async (question: string) => {
    const clean = question.trim().slice(0, 500);
    if (!clean || inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setDraft(''); setError('');
    const userMessage: SymiMessage = { id: nextId.current++, role: 'user', text: clean };
    setMessages(previous => [...previous.slice(-22), userMessage]);
    try {
      const reply = await getSymiReply(clean, messages.filter(message => message.id !== 0));
      if (mounted.current) {
        const answer: SymiMessage = { ...reply, id: nextId.current++, role: 'assistant' };
        setMessages(previous => [...previous, answer]);
      }
    } catch (failure: unknown) {
      if (mounted.current) { setError(failure instanceof Error ? failure.message : 'I couldn’t answer that just now. Please try again.'); setDraft(clean); }
    } finally {
      inFlight.current = false;
      if (mounted.current) { setBusy(false); input.current?.focus(); }
    }
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void send(draft); };
  return <div className="symi-widget">
    {open && <section id="symi-panel" role="dialog" aria-modal="false" aria-labelledby="symi-title" className="symi-panel" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <header className="symi-header"><span className="symi-avatar"><Bot size={24} aria-hidden="true" /></span><div><h2 id="symi-title">Symi</h2><p>Syahmi’s portfolio guide</p></div><button type="button" onClick={close} aria-label="Close Symi"><X size={21} aria-hidden="true" /></button></header>
      <div className="symi-log" ref={log} role="log" aria-label="Conversation with Symi" aria-live="polite" aria-relevant="additions" aria-busy={busy}>
        {messages.map(message => <div className={`symi-message symi-${message.role}`} key={message.id}><span className="symi-speaker">{message.role === 'assistant' ? 'Symi' : 'You'}</span><p>{message.text}</p>{message.links && <div className="symi-message-links">{message.links.map(link => <a key={link.href} href={link.href} {...(link.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={() => { if (link.href.startsWith('/')) close(); }}>{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>}</div>)}
        {busy && <p className="symi-thinking" role="status">Symi is replying…</p>}
      </div>
      <div className="symi-suggestions" aria-label="Suggested questions">{symiSuggestions.map(question => <button type="button" key={question} disabled={busy} onClick={() => void send(question)}>{question}</button>)}</div>
      {error && <p className="symi-error" role="alert">{error}</p>}
      <form className="symi-form" onSubmit={submit}><label className="sr-only" htmlFor="symi-question">Ask Symi a question</label><input ref={input} id="symi-question" value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} placeholder="Ask about Syahmi…" autoComplete="off" /><button type="submit" disabled={busy || !draft.trim()} aria-label="Send message"><Send size={18} aria-hidden="true" /></button></form>
      <p className="symi-note">Portfolio answers + Gemini AI. AI questions are sent to Google.</p>
    </section>}
    <button ref={launcher} type="button" className="symi-launcher" aria-label={open ? 'Close Symi assistant' : 'Ask Symi about Syahmi'} aria-expanded={open} aria-controls="symi-panel" onClick={() => open ? close() : setOpen(true)}><Bot size={25} aria-hidden="true" /><span>Ask Symi</span></button>
  </div>;
}
