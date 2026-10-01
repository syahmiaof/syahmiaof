'use client';

import { useState, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useExperience';

export function HeroTitle() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (reducedMotion || !h1Ref.current) return;
    const rect = h1Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -100, y: -100 }); // Move off-screen
  };

  return (
    <h1 
      id="hero-title"
      ref={h1Ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'block', // use block as original, not inline-block which might break layout
      }}
    >
      {/* Background layer (darker text) */}
      <span className="hero-first" style={{ color: 'var(--fg-dim)' }}>SYAHMI</span>
      <span className="hero-second" style={{ color: 'var(--fg-dim)' }}>AOF<span className="hero-period" style={{ color: 'var(--signal-deep)' }}>.</span></span>

      {/* Foreground layer (illuminated text mapped to mouse) */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          ...(mousePos.x !== -100 && {
            WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          }),
          opacity: mousePos.x === -100 ? 0 : 1, // Hide layer completely when not hovered
          color: 'var(--fg-primary)',
          transition: reducedMotion ? 'none' : 'opacity 0.2s ease-out',
        }}
      >
        <span className="hero-first" style={{ display: 'block', width: 'max-content' }}>SYAHMI</span>
        <span className="hero-second" style={{ display: 'block', width: 'max-content' }}>AOF<span className="hero-period" style={{ color: 'var(--signal-primary)' }}>.</span></span>
      </div>
    </h1>
  );
}
