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
      // Pad with leading zeros: 001, 002, ... 200
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/images/greetly-sequence/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = onImageLoad;
      images.push(img);
    }

    const renderFrame = (index: number) => {
      if (!images[index - 1] || !images[index - 1].complete) return;
      
      // Calculate aspect ratio to cover canvas completely
      const img = images[index - 1];
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const sequence = { frame: 1 };

    const ctx = gsap.context(() => {
      gsap.to(sequence, {
        frame: FRAME_COUNT,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.5, // Smooth scrubbing
        },
        onUpdate: () => renderFrame(sequence.frame)
      });
    }, containerRef);

    // Handle resizing
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        // Match container size
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
        renderFrame(sequence.frame);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

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
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
