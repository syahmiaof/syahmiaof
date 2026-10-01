'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { TopologyFallback } from './TopologyFallback';
import { RobotFallback } from './RobotFallback';
import { SceneBoundary } from './SceneBoundary';
import { useReducedMotion, useViewportTier } from '@/hooks/useExperience';
import type { SceneProgress } from './sceneProgress';
const ComputeCanvas = dynamic(() => import('./ComputeCanvas'), { ssr: false });
const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });
const DeviceCanvas = dynamic(() => import('./DeviceCanvas'), { ssr: false });
export function InfrastructureScene({ mode = 'robot', step = 0, progress }: { mode?: 'robot' | 'core' | 'device'; step?: number; progress?: SceneProgress }) {
  const reduced = useReducedMotion();
  const tier = useViewportTier();
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: '180px' });
    const viewportObserver = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting));
    observer.observe(root.current); viewportObserver.observe(root.current);
    return () => { observer.disconnect(); viewportObserver.disconnect(); };
  }, []);
  const enabled = !reduced && tier !== 'LITE' && near && !failed;
  const fallback = mode === 'robot' ? <RobotFallback /> : <TopologyFallback />;
  return <div className={`infrastructure-scene ${mode === 'device' ? 'device-scene' : ''}`} ref={root} aria-hidden="true">
    <div className={`scene-fallback ${enabled && ready ? 'scene-ready' : ''}`}>{fallback}</div>
    {enabled && <SceneBoundary fallback={fallback}>{mode === 'robot' ? <RobotCanvas tier={tier} visible={visible} onReady={() => setReady(true)} onFailure={() => setFailed(true)} /> : mode === 'device' && progress ? <DeviceCanvas progress={progress} tier={tier} visible={visible} onReady={() => setReady(true)} onFailure={() => setFailed(true)} /> : <ComputeCanvas mode={mode} step={step} tier={tier} visible={visible} onReady={() => setReady(true)} onFailure={() => setFailed(true)} />}</SceneBoundary>}
  </div>;
}
