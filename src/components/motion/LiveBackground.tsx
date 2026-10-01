'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useExperience';

export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / height) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Create stars
    const stars = Array.from({ length: 150 }).map(() => {
      const z = Math.random(); // 0 (far) to 1 (near)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseSize: z * 1.5 + 0.5,
        opacity: z * 0.5 + 0.1,
        // Drift speed
        vx: (Math.random() - 0.5) * 0.2 * z,
        vy: (Math.random() - 0.5) * 0.2 * z,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      };
    });

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (easing)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseParallaxX = mouseRef.current.x * 30; // Max 30px shift
      const mouseParallaxY = mouseRef.current.y * 30;

      stars.forEach(star => {
        // Natural drift
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen
        if (star.x < -50) star.x = width + 50;
        if (star.x > width + 50) star.x = -50;
        if (star.y < -50) star.y = height + 50;
        if (star.y > height + 50) star.y = -50;

        // Parallax offset based on depth (z)
        const offsetX = star.x - (mouseParallaxX * star.z);
        const offsetY = star.y - (mouseParallaxY * star.z);

        // Twinkle effect
        const currentOpacity = star.opacity + Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.15;
        const boundedOpacity = Math.max(0.05, Math.min(1, currentOpacity));

        ctx.beginPath();
        ctx.arc(offsetX, offsetY, star.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 236, 227, ${boundedOpacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'var(--bg-primary)'
      }}
      aria-hidden="true"
    />
  );
}
