'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import { createFrameSequence } from '@/lib/frame-sequence';
import { SafeImage } from '@/components/ui/SafeImage';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 200;

export function GreetlySequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const tier = useViewportTier();
  const staticView = reducedMotion || tier === 'LITE';

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (staticView || !canvas || !container) return;
    const renderer = createFrameSequence(canvas, FRAME_COUNT, index => `/images/greetly-sequence/ezgif-frame-${String(index).padStart(3, '0')}.jpg`);
    if (!renderer) return;
    let disposed = false;
    let layoutReady = false;
    let inViewport = false;
    const sequence = { frame: 1 };
    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
      layoutReady = true;
      if (inViewport) renderer.setActive(true);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const observer = new IntersectionObserver(entries => {
      inViewport = entries[0].isIntersecting;
      renderer.setActive(inViewport && layoutReady);
    }, { rootMargin: '1200px 0px' });
    observer.observe(container);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'greetly-sequence',
          trigger: container,
          start: 'center center',
          end: '+=500%',
          pin: true,
          scrub: .8,
          invalidateOnRefresh: true,
        },
      });
      // Frame movement spans the whole caption timeline, including its final fade.
      tl.to(sequence, { frame: FRAME_COUNT, duration: 1.05, snap: 'frame', ease: 'none', onUpdate: () => renderer.setFrame(sequence.frame) }, 0);
      tl.fromTo(text1Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .1 }, 0);
      tl.to(text1Ref.current, { opacity: 0, y: -20, duration: .1 }, .25);
      tl.fromTo(text2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .1 }, .35);
      tl.to(text2Ref.current, { opacity: 0, y: -20, duration: .1 }, .60);
      tl.fromTo(text3Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .1 }, .70);
      tl.to(text3Ref.current, { opacity: 0, y: -20, duration: .1 }, .95);
    }, container);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => {
      disposed = true;
      ctx.revert();
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [staticView]);

  // Common styling for overlay text
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '35%',
    opacity: 0,
    color: '#fff',
    pointerEvents: 'none',
  };

  return (
    <div className="greetly-sequence" ref={containerRef} data-static={staticView}>
      {staticView ? <SafeImage src="/images/greetly-sequence/ezgif-frame-200.jpg" alt="Greetly device concept artwork" width={1920} height={1080} sizes="100vw" className="greetly-sequence-poster" /> : <>
      <div aria-hidden="true" style={{ position: 'absolute', inset: '5%', pointerEvents: 'none' }}>
        <SafeImage src="/images/greetly-sequence/ezgif-frame-001.jpg" alt="" width={1920} height={1080} sizes="90vw" className="greetly-sequence-underlay" />
      </div>
      <canvas
        ref={canvasRef} 
        aria-label="Greetly device assembly animation"
        role="img"
        style={{ display: 'block', margin: '0 auto', position: 'relative', opacity: 0 }}
      />
      
      {/* Overlay Texts */}
      <div ref={text1Ref} style={{ ...overlayStyle, left: '5%' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>— Welcome to Greetly</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>Zero-Touch<br/>Attendance</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>No cards to swipe. No screens to touch. Just walk in and you&apos;re recorded.</p>
      </div>

      <div ref={text2Ref} style={{ ...overlayStyle, right: '5%', textAlign: 'right' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Local Intelligence —</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>On-Device</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>Camera frames are processed on the Raspberry Pi. Recognition stays local; attendance events connect to the cloud.</p>
      </div>

      <div ref={text3Ref} style={{ ...overlayStyle, left: '5%' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>— Edge to Cloud</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>Stay Connected</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>From a local recognition event to an attendance record. One connected path to the dashboard.</p>
      </div>
      </>}
    </div>
  );
}
