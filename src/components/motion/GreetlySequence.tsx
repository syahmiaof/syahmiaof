'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useExperience';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 200;

export function GreetlySequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Load images
    const images: HTMLImageElement[] = [];
    let imagesLoaded = 0;
    
    // We only draw the first frame once it's loaded
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 1) {
        renderFrame(1);
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/images/greetly-sequence/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = onImageLoad;
      images.push(img);
    }

    const renderFrame = (index: number) => {
      if (!images[index - 1] || !images[index - 1].complete) return;
      
      const img = images[index - 1];
      // Use logical width/height instead of physical pixel dimensions for calculation
      const rect = canvas.getBoundingClientRect();
      const canvasRatio = rect.width / rect.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Fit the image within the canvas without cropping (contain), or scale down slightly
      // Let's use 'contain' logic to make it smaller as requested, but covering 80%
      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height * 0.9; // 90% of height to make it smaller
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = canvas.width * 0.9;
        drawHeight = drawWidth / imgRatio;
      }
      
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const sequence = { frame: 1 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'center center',
          end: '+=300%', // Pin for 300% of viewport height
          pin: true,
          scrub: 0.5,
        }
      });

      // Animate frame sequence
      tl.to(sequence, {
        frame: FRAME_COUNT,
        snap: 'frame',
        ease: 'none',
        onUpdate: () => renderFrame(sequence.frame)
      }, 0);

      // Animate Text 1 (Zero-Touch) at frame 1 - 50
      tl.fromTo(text1Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0);
      tl.to(text1Ref.current, { opacity: 0, y: -20, duration: 0.1 }, 0.25);

      // Animate Text 2 (Lightning Fast) at frame 60 - 130
      tl.fromTo(text2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.35);
      tl.to(text2Ref.current, { opacity: 0, y: -20, duration: 0.1 }, 0.60);

      // Animate Text 3 (No Cheating) at frame 140 - 200
      tl.fromTo(text3Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.70);
      tl.to(text3Ref.current, { opacity: 0, y: -20, duration: 0.1 }, 0.95);

    }, containerRef);

    // Handle resizing for HD DPI
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Physical pixels
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        
        // Logical CSS pixels
        canvasRef.current.style.width = `${rect.width}px`;
        canvasRef.current.style.height = `${rect.height}px`;
        
        context.scale(dpr, dpr); // Normalize coordinates
        renderFrame(sequence.frame);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <img 
        src="/images/greetly-sequence/ezgif-frame-200.jpg" 
        alt="Greetly device concept artwork" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );
  }

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
    <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', margin: '0 auto' }}
      />
      
      {/* Overlay Texts */}
      <div ref={text1Ref} style={{ ...overlayStyle, left: '5%' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>— Welcome to Greetly</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>Zero-Touch<br/>Attendance</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>No cards to swipe. No screens to touch. Just walk in and you're recorded.</p>
      </div>

      <div ref={text2Ref} style={{ ...overlayStyle, right: '5%', textAlign: 'right' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Lightning Fast —</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>1.5 Seconds</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>Our smart camera recognizes faces instantly. It processes data directly on the device, meaning no waiting for internet delays.</p>
      </div>

      <div ref={text3Ref} style={{ ...overlayStyle, left: '5%' }}>
        <p style={{ color: 'var(--signal-primary)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>— Super Secure</p>
        <h3 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '20px' }}>No Cheating</h3>
        <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6 }}>Say goodbye to 'buddy-punching' (tolong punch kad kawan). The 3D depth sensor knows the difference between a real person and a photo.</p>
      </div>
    </div>
  );
}
