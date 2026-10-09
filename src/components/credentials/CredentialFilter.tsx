'use client';

import { useEffect, useState, type ReactNode } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'programs', label: 'Professional Programs' },
  { id: 'courses', label: 'Course Completions' },
  { id: 'competitions', label: 'Competitions' },
] as const;
type Category = typeof categories[number]['id'];

export function CredentialFilter({ programs, courses, competitions }: { programs: ReactNode; courses: ReactNode; competitions: ReactNode }) {
  const [active, setActive] = useState<Category>('all');
  useEffect(() => {
    // Restore all records before resolving a page-index or external hash target.
    const reveal = () => {
      if (!['#programs', '#courses', '#awards'].includes(location.hash)) return;
      setActive('all');
    };
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);
  useEffect(() => {
    if (active !== 'all' || !['#programs', '#courses', '#awards'].includes(location.hash)) return;
    const frame = requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [active]);
  return <>
    <div className="credential-filters" role="group" aria-label="Filter credentials">{categories.map(category => <button key={category.id} type="button" aria-pressed={active === category.id} aria-controls="credential-results" onClick={() => {
      if (category.id !== 'all' && ['#programs', '#courses', '#awards'].includes(location.hash)) {
        history.replaceState(history.state, '', location.pathname + location.search);
      }
      setActive(category.id);
    }}>{category.label}</button>)}</div>
    <div id="credential-results"><div hidden={active !== 'all' && active !== 'programs'}>{programs}</div><div hidden={active !== 'all' && active !== 'courses'}>{courses}</div><div hidden={active !== 'all' && active !== 'competitions'}>{competitions}</div></div>
  </>;
}
