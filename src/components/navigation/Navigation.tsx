'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { projects, ongoingProjects } from '@/data/projects';
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
    let frame = 0;
    const route = pathname.startsWith('/projects') || pathname === '/lab' ? 'work'
      : pathname === '/experience' ? 'experience' : pathname === '/skills' ? 'skills'
      : pathname === '/credentials' ? 'credentials' : '';
    const update = () => {
      frame = 0;
      const header = document.querySelector('header.site-header')?.getBoundingClientRect().bottom ?? 82;
      const readingLine = header + (innerHeight - header) * .22;
      const contact = document.getElementById('contact');
      if (contact && contact.getBoundingClientRect().top <= readingLine) { setActive('contact'); return; }
      if (pathname !== '/') { setActive(route); return; }
      let current = '';
      document.querySelectorAll<HTMLElement>('[data-nav-section]').forEach(section => {
        if (section.getBoundingClientRect().top <= readingLine) current = section.dataset.navSection ?? '';
      });
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.removeEventListener('hashchange', schedule); };
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onOutside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenu(false); };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [menu]);
  const commands = [
    { label: 'About Syahmi', detail: 'Profile and focus', href: '/#about' },
    { label: 'Open Greetly case study', detail: 'Project', href: '/projects/greetly' },
    ...[...projects.filter(project => !project.featured), ...ongoingProjects].map(project => ({ label: `Open ${project.title}`, detail: 'Project', href: project.liveUrl || `/projects#${project.slug}` })),
    { label: 'All projects', detail: 'Active and ongoing builds', href: '/projects' },
    { label: 'Quick view', detail: 'Recruiter overview', href: '/quick' },
    { label: 'Explore experience', detail: 'The road here · People, leadership & operations', href: '/experience' },
    { label: 'View GitHub', detail: 'Source code', href: profile.github },
    { label: 'Open Technical Lab', detail: 'Experiments & AI concepts', href: '/lab' },
    { label: 'Open skills & tech stack', detail: 'Tools, platforms & evidence', href: '/skills' },
    { label: 'View credentials', detail: 'Programs, courses & recognition', href: '/credentials' },
    { label: 'View CV (PDF)', detail: 'Resume', href: profile.resumeUrl },
    { label: 'Contact Syahmi', detail: 'Email', href: `mailto:${profile.email}` },
    { label: reduced ? 'Enable motion (unless system preference is reduced)' : 'Reduce motion', detail: 'Preference', action: toggleMotion },
  ].filter(command => `${command.label} ${command.detail}`.toLowerCase().includes(query.toLowerCase()));
  const activate = (index: number) => {
    const command = commands[index];
    if (!command) return;
    dialog.current?.close();
    if ('action' in command) command.action();
    else if ('href' in command) window.location.assign(command.href);
  };
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Syahmi Aof home">THE BUILDER<span>.</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? (pathname === '/' || active === 'contact' ? 'location' : 'page') : undefined}>{item.name}</Link>)}</nav>
      <div className="nav-actions"><a className="quick-nav nav-cv" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">View CV <ArrowUpRight size={13} aria-hidden="true" /></a><button className="command-trigger" onClick={openPalette} aria-label="Search this portfolio"><Search size={14} aria-hidden="true" /><span className="command-trigger-label">Search</span><kbd className="command-trigger-shortcut">⌘K</kbd></button>
        <div ref={menuRef} className="mobile-menu-wrap"><button className="menu-trigger" aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button>{menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.id} href={item.href} aria-current={active === item.id ? (pathname === '/' || active === 'contact' ? 'location' : 'page') : undefined} onClick={() => setMenu(false)}>{item.name}<ArrowUpRight size={16} /></Link>)}<Link href="/quick" onClick={() => setMenu(false)}>Quick view · Recruiter overview<ArrowUpRight size={16} /></Link></nav>}</div>
      </div>
    </header>
    <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="command-body"><div className="command-heading"><h2 id="command-title">Search the portfolio</h2><button aria-label="Close command palette" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
        <div className="command-search"><Search size={20} aria-hidden="true" /><input aria-label="Search this portfolio" placeholder="Search about me, projects, skills…" value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setSelected(previous => commands.length ? (previous + 1) % commands.length : 0); }
          if (event.key === 'ArrowUp') { event.preventDefault(); setSelected(previous => commands.length ? (previous - 1 + commands.length) % commands.length : 0); }
          if (event.key === 'Enter') { event.preventDefault(); activate(selected); }
        }} /></div>
        <div className="command-results">{commands.map((command, index) => <button key={command.label} className={selected === index ? 'selected' : ''} onClick={() => activate(index)} onFocus={() => setSelected(index)}><span>{command.label}</span><small>{command.detail}</small></button>)}{!commands.length && <p className="empty-results">No matching results. Try “Greetly”, “skills” or “contact”.</p>}</div>
        <p className="command-hint">↑ ↓ to select · Enter to open · Esc to close</p>
      </div>
    </dialog>
  </>;
}
