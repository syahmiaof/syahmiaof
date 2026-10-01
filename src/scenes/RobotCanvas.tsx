'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { StudioEnvironment } from './StudioEnvironment';

function Shell({ size, position = [0, 0, 0], color = '#ced4c5', radius = .18 }: { size: [number, number, number]; position?: [number, number, number]; color?: string; radius?: number }) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => {
    const x = -width / 2, y = -height / 2, r = radius;
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y); shape.lineTo(x + width - r, y); shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    const result = new THREE.ExtrudeGeometry(shape, { depth: depth - .1, bevelEnabled: true, bevelThickness: .05, bevelSize: .045, bevelSegments: 3, steps: 1, curveSegments: 10 });
    result.translate(0, 0, -depth / 2);
    return result;
  }, [width, height, depth, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const visor = color === '#111f1b' || color === '#182b22';
  return <mesh position={position} geometry={geometry}><meshPhysicalMaterial color={color} metalness={visor ? .05 : .3} roughness={visor ? .14 : .22} clearcoat={1} clearcoatRoughness={.16} envMapIntensity={visor ? .22 : .7} /></mesh>;
}

function Eye({ x, gaze, blink }: { x: number; gaze: React.RefObject<THREE.Group | null>; blink: React.RefObject<THREE.Group | null> }) {
  return <group position={[x, .12, .63]}>
    <mesh><circleGeometry args={[.32, 48]} /><meshBasicMaterial color="#06140f" /></mesh>
    <mesh position={[0, 0, .008]}><ringGeometry args={[.275, .295, 48]} /><meshBasicMaterial color="#235941" /></mesh>
    <group ref={gaze} position={[0, 0, .024]}><group ref={blink}>
      <mesh><circleGeometry args={[.205, 48]} /><meshBasicMaterial color="#65edb8" /></mesh>
      <mesh position={[.01, 0, .006]}><circleGeometry args={[.105, 32]} /><meshBasicMaterial color="#063725" /></mesh>
      <mesh position={[-.055, .07, .012]}><circleGeometry args={[.044, 24]} /><meshBasicMaterial color="#f0fff4" /></mesh>
    </group></group>
  </group>;
}

function Robot({ visible, wake }: { visible: boolean; wake: React.RefObject<{ value: number }> }) {
  const body = useRef<THREE.Group>(null), head = useRef<THREE.Group>(null), arm = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null), rightEye = useRef<THREE.Group>(null);
  const leftBlink = useRef<THREE.Group>(null), rightBlink = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0, hover: 0, blinkStart: 0 });
  const current = useRef({ x: 0, y: 0, hover: 0 });
  const { gl, invalidate } = useThree();
  useEffect(() => {
    if (!visible) return;
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || document.hidden) return;
      const bounds = canvas.getBoundingClientRect();
      target.current.x = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      target.current.y = THREE.MathUtils.clamp(1 - (event.clientY - bounds.top) / bounds.height * 2, -1, 1);
      target.current.hover = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom ? 1 : 0;
      invalidate();
    };
    const reset = () => { target.current.x = 0; target.current.y = 0; target.current.hover = 0; invalidate(); };
    const blink = window.setInterval(() => { if (!document.hidden) { target.current.blinkStart = performance.now(); invalidate(); } }, 4200);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', reset);
    invalidate();
    return () => { clearInterval(blink); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset); document.removeEventListener('visibilitychange', reset); };
  }, [gl, invalidate, visible]);

  useFrame((_, delta) => {
    if (!visible || document.hidden || !head.current || !body.current) return;
    const state = current.current, goal = target.current;
    const dt = Math.min(delta, .05);
    state.x = THREE.MathUtils.damp(state.x, goal.x, 5, dt);
    state.y = THREE.MathUtils.damp(state.y, goal.y, 5, dt);
    state.hover = THREE.MathUtils.damp(state.hover, goal.hover, 4, dt);
    head.current.rotation.set(-state.y * .23 + (1 - wake.current.value) * .45, state.x * .42, -state.x * .045);
    body.current.rotation.set(0, state.x * .1, -state.x * .035);
    body.current.position.y = state.hover * .12;
    if (arm.current) arm.current.rotation.z = -.18 - state.hover * .36;
    for (const eye of [leftEye, rightEye]) if (eye.current) eye.current.position.set(state.x * .115, state.y * .085, .024);
    const elapsed = performance.now() - goal.blinkStart;
    const lid = elapsed < 220 ? 1 - Math.sin(elapsed / 220 * Math.PI) * .94 : 1;
    for (const eye of [leftBlink, rightBlink]) if (eye.current) eye.current.scale.y = lid * (.08 + wake.current.value * .92);
    if (Math.abs(state.x - goal.x) + Math.abs(state.y - goal.y) + Math.abs(state.hover - goal.hover) > .001 || elapsed < 220) invalidate();
  });

  return <group ref={body} position={[0, 0, 0]}>
    <group ref={head} position={[0, .85, 0]}>
      <Shell size={[2.5, 1.65, 1.12]} radius={.42} />
      <Shell size={[2.19, 1.25, .12]} position={[0, -.01, .55]} color="#111f1b" radius={.34} />
      <Eye x={-.52} gaze={leftEye} blink={leftBlink} /><Eye x={.52} gaze={rightEye} blink={rightBlink} />
      <mesh position={[0, .46, .653]} rotation={[0, 0, -.06]}><planeGeometry args={[1.55, .045]} /><meshBasicMaterial color="#cceee3" transparent opacity={.18} /></mesh>
      {[-1, 1].flatMap(x => [-1, 1].map(y => <mesh key={`${x}-${y}`} position={[x * 1.06, y * .58, .63]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.035, .035, .023, 16]} /><meshStandardMaterial color="#87978d" metalness={1} roughness={.2} /></mesh>))}
      <mesh position={[0, -.35, .64]}><boxGeometry args={[.3, .035, .02]} /><meshBasicMaterial color="#65edb8" /></mesh>
      {[-1, 1].map(side => <group key={side} position={[side * 1.33, .02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh><cylinderGeometry args={[.29, .29, .19, 32]} /><meshStandardMaterial color="#38594a" metalness={.8} roughness={.28} /></mesh>
        <mesh position={[0, side * -.11, 0]}><cylinderGeometry args={[.18, .18, .035, 32]} /><meshStandardMaterial color="#63dfb0" emissive="#19583a" emissiveIntensity={.6} /></mesh>
      </group>)}
      <mesh position={[.75, 1, -.1]}><cylinderGeometry args={[.035, .035, .38, 12]} /><meshStandardMaterial color="#829c8b" metalness={.8} roughness={.3} /></mesh>
      <mesh position={[.75, 1.21, -.1]}><sphereGeometry args={[.105, 24, 16]} /><meshBasicMaterial color="#63dfb0" /></mesh>
      <mesh position={[-.68, .75, .24]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.06, .06, .018, 12]} /><meshStandardMaterial color="#243d30" /></mesh>
    </group>
    <mesh position={[0, -.15, 0]}><cylinderGeometry args={[.3, .37, .42, 32]} /><meshStandardMaterial color="#263e31" metalness={.8} roughness={.28} /></mesh>
    <Shell size={[1.55, 1.25, .92]} position={[0, -.86, 0]} radius={.28} />
    {[-1, 1].map(side => <group key={side} position={[side * .71, -.82, .37]}><mesh><boxGeometry args={[.025, .65, .16]} /><meshStandardMaterial color="#65796c" metalness={.9} roughness={.2} /></mesh>{[0, 1, 2, 3].map(i => <mesh key={i} position={[side * .04, -.22 + i * .14, .03]}><boxGeometry args={[.06, .03, .17]} /><meshStandardMaterial color="#182a21" /></mesh>)}</group>)}
    <Shell size={[1.19, .82, .1]} position={[0, -.85, .47]} color="#182b22" radius={.17} />
    <mesh position={[0, -.78, .56]}><torusGeometry args={[.23, .025, 10, 48]} /><meshBasicMaterial color="#63dfb0" /></mesh>
    <mesh position={[0, -.78, .565]}><circleGeometry args={[.115, 32]} /><meshStandardMaterial color="#63dfb0" emissive="#2e9f6b" emissiveIntensity={1.2} /></mesh>
    {[-1, 0, 1].map(i => <mesh key={i} position={[i * .15, -1.19, .555]}><boxGeometry args={[.07, .026, .015]} /><meshBasicMaterial color="#759b83" /></mesh>)}
    {[-1, 1].map(side => <group key={side} ref={side === 1 ? arm : undefined} position={[side * .97, -.46, 0]} rotation={[0, 0, side * -.18]}>
      <mesh><sphereGeometry args={[.245, 24, 16]} /><meshStandardMaterial color="#2a4537" metalness={.8} roughness={.3} /></mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.245, .025, 12, 32]} /><meshStandardMaterial color="#aab9ad" metalness={1} roughness={.17} /></mesh>
      <Shell size={[.42, .7, .51]} position={[0, -.4, 0]} radius={.15} />
      <mesh position={[0, -.91, .02]}><sphereGeometry args={[.255, 24, 16]} /><meshStandardMaterial color="#456650" metalness={.65} roughness={.3} /></mesh>
      <Shell size={[.32, .24, .2]} position={[0, -.94, .2]} color="#a6b7a5" radius={.08} />
    </group>)}
    <mesh position={[0, -1.6, 0]}><cylinderGeometry args={[.5, .29, .2, 32]} /><meshStandardMaterial color="#213d2d" metalness={.7} roughness={.25} /></mesh>
    <mesh position={[0, -1.74, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.31, .025, 12, 48]} /><meshBasicMaterial color="#63dfb0" /></mesh>
    <group position={[0, -2.04, 0]} rotation={[Math.PI / 2, 0, 0]}>{[.65, 1.05, 1.55].map((radius, i) => <mesh key={radius}><ringGeometry args={[radius, radius + .008, 80]} /><meshBasicMaterial color="#3e9c70" transparent opacity={.6 - i * .15} side={THREE.DoubleSide} /></mesh>)}</group>
  </group>;
}

function Arrival({ visible }: { visible: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const wake = useRef({ value: 1 });
  const animation = useRef<gsap.core.Timeline | null>(null);
  const { camera, invalidate, gl } = useThree();
  useEffect(() => {
    if (!rig.current) return;
    const group = rig.current;
    const intro = document.querySelector('.network-intro');
    if (!intro) { gl.domElement.setAttribute('data-arrival', 'ready'); return; }
    const context = gsap.context(() => {
      group.rotation.y = -.8; group.position.y = -.45;
      camera.position.set(1.7, .8, 8.6); camera.lookAt(0, -.05, 0);
      wake.current.value = 0;
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onUpdate: () => { camera.lookAt(0, -.05, 0); invalidate(); }, onComplete: () => { gl.domElement.setAttribute('data-arrival', 'ready'); } });
      timeline.addLabel('awaken', 0)
        .to(group.rotation, { y: 0, duration: 1.8 }, 'awaken')
        .to(group.position, { y: 0, duration: 1.6 }, 'awaken')
        .to(camera.position, { x: 0, y: .25, z: 7.8, duration: 1.8 }, 'awaken')
        .to(wake.current, { value: 1, duration: .9 }, 'awaken+=.25');
      animation.current = timeline;
    });
    const check = () => {
      if (!intro.isConnected) animation.current?.progress(1).pause();
      else if (intro.getAttribute('data-phase') === 'leaving') { gl.domElement.setAttribute('data-arrival', 'entering'); animation.current?.play(); }
      invalidate();
    };
    const observer = new MutationObserver(check);
    observer.observe(intro, { attributes: true, attributeFilter: ['data-phase'] });
    if (intro.parentNode) observer.observe(intro.parentNode, { childList: true });
    const visibility = () => { if (document.hidden) animation.current?.pause(); else check(); };
    document.addEventListener('visibilitychange', visibility);
    check();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); context.revert(); animation.current = null; };
  }, [camera, gl, invalidate]);
  useEffect(() => {
    if (!visible) animation.current?.pause();
    else if (!document.querySelector('.network-intro')) animation.current?.progress(1).pause();
    else if (document.querySelector('.network-intro[data-phase="leaving"]')) animation.current?.play();
  }, [visible]);
  return <group ref={rig}><Robot visible={visible} wake={wake} /></group>;
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => { const canvas = gl.domElement; const lost = (event: Event) => { event.preventDefault(); onFailure(); }; canvas.addEventListener('webglcontextlost', lost); return () => canvas.removeEventListener('webglcontextlost', lost); }, [gl, onFailure]);
  return null;
}

export default function RobotCanvas({ tier, visible, onReady, onFailure }: { tier: 'HIGH' | 'BALANCED'; visible: boolean; onReady: () => void; onFailure: () => void }) {
  return <div className="scene-canvas robot-canvas"><Canvas frameloop={visible ? 'demand' : 'never'} dpr={tier === 'HIGH' ? [1, 1.5] : 1} camera={{ position: [0, .25, 7.8], fov: 37 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={state => { state.camera.lookAt(0, -.05, 0); onReady(); }}>
    <StudioEnvironment /><ambientLight intensity={.5} /><directionalLight position={[-3, 5, 5]} intensity={2.4} color="#fff8ed" /><directionalLight position={[4, 2, 2]} intensity={1.1} color="#bce6d6" /><directionalLight position={[0, 3, -4]} intensity={2} color="#5fe5a9" />
    <Arrival visible={visible} /><ContextGuard onFailure={onFailure} />
  </Canvas></div>;
}
