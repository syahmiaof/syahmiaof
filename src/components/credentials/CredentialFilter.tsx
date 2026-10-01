'use client';

import { useState, type ReactNode } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'programs', label: 'Professional Programs' },
  { id: 'courses', label: 'Course Completions' },
  { id: 'competitions', label: 'Competitions' },
] as const;
type Category = typeof categories[number]['id'];

export function CredentialFilter({ programs, courses, competitions }: { programs: ReactNode; courses: ReactNode; competitions: ReactNode }) {
  const [active, setActive] = useState<Category>('all');
  return <>
    <div className="credential-filters" role="group" aria-label="Filter credentials">{categories.map(category => <button key={category.id} type="button" aria-pressed={active === category.id} aria-controls="credential-results" onClick={() => setActive(category.id)}>{category.label}</button>)}</div>
    <div id="credential-results"><div hidden={active !== 'all' && active !== 'programs'}>{programs}</div><div hidden={active !== 'all' && active !== 'courses'}>{courses}</div><div hidden={active !== 'all' && active !== 'competitions'}>{competitions}</div></div>
  </>;
}
