'use client';
import { useSyncExternalStore } from 'react';

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  window.addEventListener('portfolio-motion', callback);
  window.addEventListener('storage', callback);
  return () => { query.removeEventListener('change', callback); window.removeEventListener('portfolio-motion', callback); window.removeEventListener('storage', callback); };
}
function motionSnapshot() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try { return localStorage.getItem('portfolio-reduced-motion') === 'true'; } catch { return false; }
}
export function useReducedMotion() { return useSyncExternalStore(subscribeMotion, motionSnapshot, () => true); }
export function toggleMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try { localStorage.setItem('portfolio-reduced-motion', String(!motionSnapshot())); } catch { return; }
  window.dispatchEvent(new Event('portfolio-motion'));
}
function subscribeViewport(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
function viewportSnapshot(): 'HIGH' | 'BALANCED' | 'LITE' {
  if (window.innerWidth < 760 || matchMedia('(pointer: coarse)').matches) return 'LITE';
  return window.innerWidth >= 1200 ? 'HIGH' : 'BALANCED';
}
export function useViewportTier() { return useSyncExternalStore(subscribeViewport, viewportSnapshot, () => 'LITE' as const); }
