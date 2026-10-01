'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { StudioEnvironment } from './StudioEnvironment';
import type { SceneProgress } from './sceneProgress';

function Part({ size, color, position = [0, 0, 0], metal = .5 }: { size: [number, number, number]; color: string; position?: [number, number, number]; metal?: number }) {
  const [x, y, z] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(x, y, z, 3, Math.min(.09, y / 3)), [x, y, z]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position}><meshPhysicalMaterial color={color} roughness={.28} metalness={metal} clearcoat={.65} /></mesh>;
}

function Device({ progress, visible }: { progress: SceneProgress; visible: boolean }) {
  const assembly = useRef<THREE.Group>(null), lid = useRef<THREE.Group>(null), sensor = useRef<THREE.Group>(null), board = useRef<THREE.Group>(null), base = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const { invalidate, camera } = useThree();
  useEffect(() => {
    if (!visible) return;
    invalidate();
    return progress.subscribe(() => { if (!document.hidden) invalidate(); });
  }, [progress, visible, invalidate]);
  useEffect(() => {
    const resume = () => { if (!document.hidden && visible) invalidate(); };
    document.addEventListener('visibilitychange', resume);
    return () => document.removeEventListener('visibilitychange', resume);
  }, [visible, invalidate]);
  useFrame(() => {
    if (!visible || !assembly.current || !lid.current || !sensor.current || !board.current || !base.current) return;
    const p = progress.value;
    const open = THREE.MathUtils.smoothstep(p, .1, 2);
    lid.current.position.y = .24 + open * 1.3;
    sensor.current.position.y = .13 + open * .4;
    board.current.position.y = -.13 - open * .4;
    base.current.position.y = -.28 - open * 1.08;
    assembly.current.rotation.y = -.3 + p * .12;
    camera.position.set(5.4 - p * .17, 4.9 - open * .7, 6.4 + open * .4);
    camera.lookAt(0, .08, 0);
    if (beam.current) { beam.current.visible = p > 1.5 && p < 3.2; beam.current.scale.y = .4 + open; }
  });
  return <group ref={assembly}>
    <group ref={lid} position={[0, .24, 0]}>
      <Part size={[2.8, .16, 2.55]} color="#c0cbbc" metal={.55} />
      <Part size={[2.55, .025, 2.3]} color="#a8b9a7" position={[0, .09, 0]} />
      {[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * 1.15, .12, z * 1]}><cylinderGeometry args={[.055, .055, .025, 16]} /><meshStandardMaterial color="#546b5c" metalness={1} roughness={.15} /></mesh>))}
      {[0, 1, 2, 3, 4].map(i => <Part key={i} size={[.6, .018, .04]} position={[.55, .11, -.65 + i * .14]} color="#283d30" />)}
      <mesh position={[-.55, .14, .1]}><cylinderGeometry args={[.44, .49, .13, 48]} /><meshStandardMaterial color="#28362f" metalness={.85} roughness={.2} /></mesh>
      <mesh position={[-.55, .23, .1]}><cylinderGeometry args={[.31, .34, .055, 48]} /><meshPhysicalMaterial color="#124a45" metalness={.85} roughness={.08} clearcoat={1} /></mesh>
      <mesh position={[-.55, .264, .1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.2, .22, 48]} /><meshBasicMaterial color="#63dfb0" /></mesh>
    </group>
    <group ref={sensor} position={[0, .13, 0]}>
      <Part size={[1.55, .08, 1.2]} color="#263e30" position={[-.4, 0, .1]} />
      <Part size={[.46, .09, .46]} color="#1a2422" position={[-.55, .07, .1]} />
      <Part size={[.24, .14, .24]} color="#3b6980" position={[-.55, .16, .1]} />
      <Part size={[.36, .025, .9]} color="#c58e4f" position={[.45, -.02, 0]} />
    </group>
    <group ref={board} position={[0, -.13, 0]}>
      <Part size={[2.6, .1, 2.25]} color="#164932" metal={.2} />
      <Part size={[.85, .16, .82]} color="#65756b" position={[-.22, .12, -.12]} metal={.95} />
      {[0, 1, 2, 3, 4, 5].map(i => <Part key={i} size={[.7, .1, .032]} color="#9eaaa0" position={[-.22, .23, -.43 + i * .12]} metal={1} />)}
      {[-1, 1].map(side => <group key={side}>{Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[side * 1.08, .13, -.87 + i * .15]}><boxGeometry args={[.05, .16, .045]} /><meshStandardMaterial color="#d5b375" metalness={.9} roughness={.24} /></mesh>)}</group>)}
      {[0, 1].map(i => <Part key={i} size={[.48, .3, .36]} position={[.55 - i * .65, .12, 1.04]} color="#a5b1a9" metal={1} />)}
      {[-.6, -.3, 0, .3, .6].map(z => <Part key={z} size={[.32, .03, .025]} position={[.65, .065, z]} color="#c6aa67" />)}
    </group>
    <group ref={base} position={[0, -.28, 0]}>
      <Part size={[2.8, .15, 2.55]} color="#899f8a" />
      <Part size={[2.55, .04, 2.3]} color="#263f30" position={[0, .09, 0]} />
      {[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * 1.13, .2, z * 1]}><cylinderGeometry args={[.055, .055, .28, 12]} /><meshStandardMaterial color="#c0b98b" metalness={1} /></mesh>))}
    </group>
    <mesh ref={beam} position={[-.55, .1, .1]}><cylinderGeometry args={[.2, .2, .85, 32, 1, true]} /><meshBasicMaterial color="#63dfb0" transparent opacity={.12} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.1, 2.11, 96]} /><meshBasicMaterial color="#39664b" transparent opacity={.6} /></mesh>
  </group>;
}

function Guard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => { const canvas = gl.domElement; const lost = (event: Event) => { event.preventDefault(); onFailure(); }; canvas.addEventListener('webglcontextlost', lost); return () => canvas.removeEventListener('webglcontextlost', lost); }, [gl, onFailure]);
  return null;
}

export default function DeviceCanvas({ progress, visible, tier, onReady, onFailure }: { progress: SceneProgress; visible: boolean; tier: 'HIGH' | 'BALANCED'; onReady: () => void; onFailure: () => void }) {
  return <div className="scene-canvas device-canvas"><Canvas frameloop={visible ? 'demand' : 'never'} dpr={tier === 'HIGH' ? [1, 1.5] : 1} camera={{ position: [5.4, 4.9, 6.4], fov: 32 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ camera }) => { camera.lookAt(0, .08, 0); onReady(); }}>
    <StudioEnvironment /><ambientLight intensity={.6} /><directionalLight position={[-3, 6, 4]} intensity={2.5} color="#fff7e7" /><directionalLight position={[4, 1, -3]} intensity={2} color="#8ddcbb" />
    <Device progress={progress} visible={visible} /><Guard onFailure={onFailure} />
  </Canvas></div>;
}
