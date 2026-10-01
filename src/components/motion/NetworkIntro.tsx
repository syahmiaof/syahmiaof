'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './network-intro.css';

// A fresh document replays the intro; client-side return navigation does not.
let enteredThisDocument = false;
const REVEAL_DURATION = 1800;
const nodes = [
  [80, 100], [310, 170], [490, 80], [740, 150], [1060, 90], [1320, 210],
  [170, 350], [400, 300], [1050, 320], [1270, 440], [90, 650], [320, 570],
  [550, 700], [780, 620], [1030, 710], [1370, 680], [230, 810], [850, 840],
] as const;
const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[1,7],[6,7],[4,8],[5,9],[8,9],[6,10],[7,11],[10,11],[11,12],[12,13],[13,14],[14,15],[9,15],[10,16],[12,16],[13,17],[14,17],[3,8],[8,13],[7,2]] as const;
const mobileNodes = [[15,100],[105,160],[155,80],[225,140],[310,90],[385,200],[25,255],[130,240],[290,240],[375,355],[5,525],[85,555],[150,665],[235,575],[310,675],[400,545],[25,700],[230,765]] as const;

function NetworkMap({ compact = false }: { compact?: boolean }) {
  const points = compact ? mobileNodes : nodes;
  return <svg className={`intro-network ${compact ? 'intro-network-mobile' : 'intro-network-desktop'}`} viewBox={compact ? '0 0 390 844' : '0 0 1440 900'} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g className="intro-links">{links.map(([from, to], index) => {
      const [x1, y1] = points[from]; const [x2, y2] = points[to];
      const path = `M${x1} ${y1} L${(x1 + x2) / 2} ${y1} L${x2} ${y2}`;
      return <g key={index} style={{ '--link-delay': `${index * 35}ms` } as CSSProperties}>
        <path d={path} className="intro-wire" pathLength="1" />
        <path d={path} className="intro-packet" pathLength="1" />
      </g>;
    })}</g>
    {points.map(([x, y], index) => <g key={index} className="intro-node" style={{ '--link-delay': `${index * 65}ms` } as CSSProperties}>
      <circle cx={x} cy={y} r={compact ? 9 : 13} className="intro-node-ring" /><rect x={x - 3} y={y - 3} width="6" height="6" />
    </g>)}
    {!compact && <g className="intro-map-labels"><text x="190" y="330">EDGE / INPUT</text><text x="1075" y="300">CLOUD / COMPUTE</text><text x="335" y="607">DEVOPS / DELIVERY</text><text x="1045" y="751">AI / INTELLIGENCE</text></g>}
  </svg>;
}

export function NetworkIntro() {
  const dialog = useRef<HTMLDialogElement>(null);
  const finish = useRef<(immediate?: boolean, focusContent?: boolean) => void>(() => {});
  const [phase, setPhase] = useState<'initializing' | 'connecting' | 'ready' | 'leaving' | 'done'>('initializing');
  const [fontsReady, setFontsReady] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useLayoutEffect(() => {
    if (interactive && dialog.current?.open) dialog.current.querySelector<HTMLButtonElement>('.intro-skip')?.focus();
  }, [interactive]);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let savedReduction = false;
    try { savedReduction = localStorage.getItem('portfolio-reduced-motion') === 'true'; } catch { /* Browser storage may be disabled. */ }
    if (enteredThisDocument || location.hash || reduced.matches || savedReduction) {
      element.style.display = 'none';
      const timer = window.setTimeout(() => setPhase('done'), 0);
      return () => clearTimeout(timer);
    }

    let disposed = false;
    let leaving = false;
    let focusFrame = 0;
    const timers: number[] = [];
    const heroAnimations: Animation[] = [];
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement;
    const schedule = (callback: () => void, duration: number) => {
      const timer = window.setTimeout(() => { if (!disposed) callback(); }, duration);
      timers.push(timer);
    };
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });
    element.showModal();

    const release = (focusContent: boolean) => {
      disposed = true;
      timers.forEach(clearTimeout);
      heroAnimations.forEach(animation => animation.cancel());
      element.removeEventListener('cancel', cancel);
      document.removeEventListener('keydown', keydown, true);
      reduced.removeEventListener('change', preferenceChanged);
      enteredThisDocument = true;
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      setPhase('done');
      // Restore focus after React removes the closed dialog, not during its click event.
      focusFrame = requestAnimationFrame(() => {
        if (focusContent || previousFocus === document.body) document.getElementById('main')?.focus({ preventScroll: true });
        else if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      });
    };
    finish.current = (immediate = false, focusContent = false) => {
      if (disposed) return;
      if (immediate) { leaving = true; release(focusContent); return; }
      if (leaving) return;
      leaving = true;
      const target = document.querySelector('.hero-art')?.getBoundingClientRect();
      if (target) {
        element.style.setProperty('--arrival-x', `${Math.min(innerWidth * .82, target.left + target.width / 2)}px`);
        element.style.setProperty('--arrival-y', `${Math.min(innerHeight * .72, target.top + target.height / 2)}px`);
      }
      // Overlap the outgoing topology with the incoming hero instead of cutting a hole into a static frame.
      const arrivals = [
        { selector: '.hero-art', duration: 1600, delay: 100, from: 'translateY(24px) scale(.95)' },
        { selector: '.hero-copy', duration: 1350, delay: 350, from: 'translateY(24px)' },
        { selector: '.site-header', duration: 1100, delay: 500, from: 'translateY(-8px)' },
        { selector: '.hero-topline, .hero-bottom', duration: 1000, delay: 650, from: 'translateY(8px)' },
      ];
      for (const arrival of arrivals) {
        document.querySelectorAll<HTMLElement>(arrival.selector).forEach(target => {
          heroAnimations.push(target.animate([
            { opacity: 0, transform: arrival.from },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ], { duration: arrival.duration, delay: arrival.delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }));
        });
      }
      setPhase('leaving');
      schedule(() => release(focusContent), REVEAL_DURATION);
    };

    const cancel = (event: Event) => { event.preventDefault(); finish.current(true, true); };
    const keydown = (event: KeyboardEvent) => {
      if (disposed) return;
      // Keep the site's command palette behind this short, skippable introduction.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); event.stopImmediatePropagation(); finish.current(true, true);
      }
    };
    const preferenceChanged = () => { if (reduced.matches) finish.current(true); };
    element.addEventListener('cancel', cancel);
    document.addEventListener('keydown', keydown, true);
    reduced.addEventListener('change', preferenceChanged);
    // The server-rendered cover is visible before hydration; enable skipping only
    // once its handler and modal focus management are ready to receive the click.
    setInteractive(true);
    document.fonts.ready.then(() => { if (!disposed) setFontsReady(true); }).catch(() => {});
    schedule(() => setPhase('connecting'), 650);
    // The network is an authored introduction, not a simulated backend connection.
    schedule(() => setPhase('ready'), 2150);
    schedule(() => finish.current(), 2700);
    schedule(() => finish.current(true), 6500);

    return () => {
      disposed = true;
      cancelAnimationFrame(focusFrame);
      timers.forEach(clearTimeout);
      heroAnimations.forEach(animation => animation.cancel());
      element.removeEventListener('cancel', cancel);
      document.removeEventListener('keydown', keydown, true);
      reduced.removeEventListener('change', preferenceChanged);
      element.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === 'done') return null;
  const ready = phase === 'ready' || phase === 'leaving';
  return <>
    <noscript><style>{'.network-intro { display: none !important; }'}</style></noscript>
    <dialog ref={dialog} className="network-intro" data-phase={phase} style={{ '--intro-reveal': `${REVEAL_DURATION}ms` } as CSSProperties} aria-labelledby="intro-title" aria-describedby="intro-status">
      <NetworkMap /><NetworkMap compact />
      <div className="intro-frame">
        <div className="intro-top"><span>SYAHMI AOF<span className="intro-slash"> / </span>PORTFOLIO</span><span className="intro-sequence">ENTRY SEQUENCE</span></div>
        <div className="intro-center">
          <h2 id="intro-title">Everything<span>connects<span className="intro-period">.</span></span></h2>
          <p id="intro-status" role="status"><span className="intro-status-light" />{ready ? 'Ready to enter' : phase === 'connecting' ? 'Connecting the dots' : 'Initializing interface'}<span className="intro-caret" aria-hidden="true" /></p>
        </div>
        <div className="intro-bottom">
          <div className="intro-readiness"><span>INTERFACE <b>READY</b></span><span>TYPOGRAPHY <b>{fontsReady ? 'READY' : 'LOADING'}</b></span><span>SEQUENCE <b>{ready ? 'COMPLETE' : 'IN MOTION'}</b></span></div>
          <button type="button" disabled={!interactive} onClick={() => finish.current(true, true)} className="intro-skip">Skip intro<ArrowUpRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </dialog>
  </>;
}
