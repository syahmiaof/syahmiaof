import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function TextLink({ href, children, className = '', external = false }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  return <Link href={href} className={`text-link ${className}`} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} data-cursor="OPEN">{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}
export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span className="signal-dot" /><span>{number} / {children}</span></div>;
}
export function Status({ children }: { children: ReactNode }) { return <span className="status"><span />{children}</span>; }
export function ScrollLink() { return <a href="#about" className="scroll-link"><ArrowDown size={15} aria-hidden="true" />Scroll to enter</a>; }
