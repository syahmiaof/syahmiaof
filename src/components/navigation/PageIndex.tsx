import Link from 'next/link';

export function PageIndex({ items }: { items: { label: string; href: string }[] }) {
  return <nav className="page-index" aria-label="On this page">{items.map(item => item.href.startsWith('#')
    ? <a key={item.href} href={item.href}>{item.label}</a>
    : <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>;
}
