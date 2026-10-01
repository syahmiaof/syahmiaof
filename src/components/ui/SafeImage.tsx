'use client';
import Image from 'next/image';
import { useState } from 'react';
type Props = { src: string; alt: string; width: number; height: number; sizes: string; className?: string; priority?: boolean };
export function SafeImage(props: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${props.className ?? ''}`} role="img" aria-label={props.alt}><span>Image unavailable</span><small>{props.alt}</small></div>;
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />;
}
