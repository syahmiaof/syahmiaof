'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Command, Menu, Search, X } from 'lucide-react';
import { navigation, profile } from '@/data/profile';
import { toggleMotion, useReducedMotion } from '@/hooks/useExperience';

export function Navigation() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('index');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const openPalette = () => { setMenu(false); setQuery(''); setSelected(0); dialog.current?.showModal(); };
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
      if (event.key === 'Escape') setMenu(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -55% 0px' });
    navigation.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onOutside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenu(false); };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [menu]);
  const commands = [
    { label: 'Open Greetly case study', detail: 'Project', href: '/projects/greetly' },
    { label: 'Quick view', detail: 'Recruiter overview', href: '/quick' },
    { label: 'View GitHub', detail: 'Source code', href: profile.github },
    { label: 'Open Lab', detail: 'Experiments', href: '/#lab' },
    { label: 'Open tech stack', detail: 'Tools and platforms', href: '/#stack' },
    { label: 'View credentials', detail: 'Learning passport', href: '/#credentials' },
    { label: 'Request resume', detail: 'Email', href: profile.resumeUrl },
    { label: 'Contact Syahmi', detail: 'Email', href: `mailto:${profile.email}` },
    { label: reduced ? 'Enable motion (unless system preference is reduced)' : 'Reduce motion', detail: 'Preference', action: toggleMotion },
  ].filter(command => `${command.label} ${command.detail}`.toLowerCase().includes(query.toLowerCase()));
  const activate = (index: number) => {
    const command = commands[index];
    if (!command) return;
    dialog.current?.close();
    if (command.action) command.action();
    else if (command.href) window.location.assign(command.href);
  };
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Syahmi Aof home">THE BUILDER<span>.</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.id} href={item.href} aria-current={pathname === '/' && active === item.id ? 'location' : undefined}>{item.name}</Link>)}</nav>
      <div className="nav-actions"><Link className="quick-nav" href="/quick">Quick view <ArrowUpRight size={13} aria-hidden="true" /></Link><button className="command-trigger" onClick={openPalette} aria-label="Open command palette"><Command size={14} aria-hidden="true" /><span>K</span></button>
        <div ref={menuRef} className="mobile-menu-wrap"><button className="menu-trigger" aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button>{menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.id} href={item.href} onClick={() => setMenu(false)}>{item.name}<ArrowUpRight size={16} /></Link>)}<Link href="/quick" onClick={() => setMenu(false)}>Quick view<ArrowUpRight size={16} /></Link></nav>}</div>
      </div>
    </header>
    <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="command-body"><div className="command-heading"><h2 id="command-title">Where to?</h2><button aria-label="Close command palette" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
        <div className="command-search"><Search size={20} aria-hidden="true" /><input aria-label="Search commands" placeholder="Search projects, pages, actions…" value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setSelected(previous => commands.length ? (previous + 1) % commands.length : 0); }
          if (event.key === 'ArrowUp') { event.preventDefault(); setSelected(previous => commands.length ? (previous - 1 + commands.length) % commands.length : 0); }
          if (event.key === 'Enter') { event.preventDefault(); activate(selected); }
        }} /></div>
        <div className="command-results">{commands.map((command, index) => <button key={command.label} className={selected === index ? 'selected' : ''} onClick={() => activate(index)} onFocus={() => setSelected(index)}><span>{command.label}</span><small>{command.detail}</small></button>)}{!commands.length && <p className="empty-results">No matching commands. Try “Greetly” or “contact”.</p>}</div>
        <p className="command-hint">↑ ↓ to select · Enter to open · Esc to close</p>
      </div>
    </dialog>
  </>;
}
