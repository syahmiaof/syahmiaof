'use client';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Outline({ size, color = '#507d66' }: { size: [number, number, number]; color?: string }) {
  const geometry = useMemo(() => { const box = new THREE.BoxGeometry(...size); const edges = new THREE.EdgesGeometry(box); box.dispose(); return edges; }, [size[0], size[1], size[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color={color} transparent opacity={0.8} /></lineSegments>;
}
function Plate({ y, size, color = '#16291e' }: { y: number; size: number; color?: string }) {
  return <group position={[0, y, 0]}><mesh><boxGeometry args={[size, .13, size]} /><meshStandardMaterial color={color} metalness={.7} roughness={.42} /></mesh><Outline size={[size, .135, size]} /></group>;
}
function Pins() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const temp = new THREE.Object3D();
    let index = 0;
    for (let side = 0; side < 4; side++) for (let pin = 0; pin < 12; pin++) {
      const along = (pin - 5.5) * .21;
      temp.position.set(side < 2 ? along : (side === 2 ? -1.45 : 1.45), .48, side < 2 ? (side === 0 ? -1.45 : 1.45) : along);
      temp.rotation.y = side < 2 ? 0 : Math.PI / 2; temp.updateMatrix();
      ref.current.setMatrixAt(index++, temp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={ref} args={[undefined, undefined, 48]}><boxGeometry args={[.07, .07, .32]} /><meshStandardMaterial color="#8baf98" metalness={.85} roughness={.3} /></instancedMesh>;
}
function CircuitLines() {
  const geometry = useMemo(() => {
    const segments: number[] = [];
    for (let side = 0; side < 4; side++) for (let i = 0; i < 6; i++) {
      const offset = (i - 2.5) * .28;
      const points = [[offset, -.48, 1.5], [offset, -.48, 2.2 + i * .14], [offset + .7, -.48, 2.2 + i * .14], [offset + .7, -.48, 3.0 + i * .16]];
      const theta = side * Math.PI / 2;
      const rotated = points.map(([x,y,z]) => [x * Math.cos(theta) - z * Math.sin(theta), y, x * Math.sin(theta) + z * Math.cos(theta)]);
      for(let j = 0; j < rotated.length - 1; j++) segments.push(...rotated[j], ...rotated[j+1]);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color="#286949" transparent opacity={.7} /></lineSegments>;
}
function Satellites() {
  return <group>{[[-3.1,-.38,2.4], [3.2,-.38,1.9], [2.5,-.38,-3.1], [-2.8,-.38,-2.5]].map((position, i) => <group key={i} position={position as [number, number, number]}><mesh><boxGeometry args={[.36, .16, .36]} /><meshStandardMaterial color="#356246" metalness={.7} roughness={.35} /></mesh><mesh position={[0,.1,0]}><boxGeometry args={[.14,.03,.14]} /><meshBasicMaterial color="#8bf5b9" /></mesh><Outline size={[.4,.2,.4]} color="#508967" /></group>)}</group>;
}
function Core() {
  return <group><CircuitLines /><Satellites /><Plate y={-.65} size={3.8} color="#101d15" /><Plate y={-.04} size={3.25} /><Plate y={.48} size={2.6} color="#1a3020" /><Pins /><group position={[0, .8, 0]}><mesh><boxGeometry args={[1.65,.36,1.65]} /><meshStandardMaterial color="#1c6241" emissive="#0c4c2d" emissiveIntensity={.7} metalness={.55} roughness={.22} /></mesh><Outline size={[1.66,.37,1.66]} color="#78e9ab" /><mesh position={[0,.2,0]}><boxGeometry args={[1.2,.025,1.2]} /><meshStandardMaterial color="#215f3e" metalness={.8} roughness={.28} /></mesh></group>{[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}-${z}`} position={[x*1.45,-.18,z*1.45]}><cylinderGeometry args={[.055,.055,1.5,8]} /><meshStandardMaterial color="#63836a" metalness={.8} roughness={.4} /></mesh>))}<group position={[0,-1.18,0]}><Outline size={[4.9,.01,4.9]} color="#233e2b" /></group></group>;
}
function Device({ step }: { step: number }) {
  const explode = .22 + step * .13;
  return <group rotation={[0, .2, 0]}><Plate y={-.55 - explode} size={3.2} /><Plate y={-.15} size={2.75} color="#235039" /><group position={[0,.38+explode,0]}><mesh><boxGeometry args={[2.9,.15,2.9]} /><meshStandardMaterial color="#18261c" metalness={.7} roughness={.38} /></mesh><Outline size={[2.9,.16,2.9]} /><mesh position={[-.65,.16,0]}><cylinderGeometry args={[.39,.43,.22,32]} /><meshStandardMaterial color="#101914" metalness={.9} roughness={.14} /></mesh><mesh position={[-.65,.3,0]}><cylinderGeometry args={[.24,.24,.02,32]} /><meshStandardMaterial color="#154d48" metalness={.8} roughness={.08} /></mesh><mesh position={[.65,.09,.1]}><boxGeometry args={[.65,.03,1.4]} /><meshBasicMaterial color={step>2?'#62dba5':'#153d29'} /></mesh></group><mesh position={[0,0,0]}><boxGeometry args={[.9,.2,.9]} /><meshStandardMaterial color="#111c14" metalness={.65} /></mesh><CircuitLines /></group>;
}
function SceneRig({ mode, step, visible }: { mode: 'core' | 'device'; step: number; visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { invalidate, camera } = useThree();
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const pointer = { x: 0, y: 0 };
    const update = () => {
      frame = 0;
      if (group.current) {
        group.current.rotation.y = -.28 + pointer.x * .08;
        group.current.rotation.x = pointer.y * .04;
      }
      if (mode === 'core') {
        const progress = Math.min(1, window.scrollY / 850);
        camera.position.set(6.8 - progress * .8, 5.7 - progress * .6, 7.8 - progress);
        camera.lookAt(0, 0, 0);
      }
      invalidate();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPointer = (event: PointerEvent) => { pointer.x = event.clientX / window.innerWidth - .5; pointer.y = event.clientY / window.innerHeight - .5; schedule(); };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', onPointer); window.removeEventListener('scroll', schedule); };
  }, [visible, invalidate, camera, mode]);
  return <group ref={group} rotation={[0,-.28,0]}>{mode === 'core' ? <Core /> : <Device step={step} />}</group>;
}
function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}
export default function ComputeCanvas({ tier, visible, onReady, onFailure, mode, step }: { tier: 'HIGH' | 'BALANCED'; visible: boolean; onReady: () => void; onFailure: () => void; mode: 'core' | 'device'; step: number }) {
  return <div className="scene-canvas"><Canvas frameloop={visible ? 'demand' : 'never'} dpr={tier === 'HIGH' ? [1, 1.5] : 1} gl={{ antialias: tier === 'HIGH', alpha: true, powerPreference: 'low-power' }} camera={{ position: [6.8,5.7,7.8], fov: 37 }} onCreated={state => { state.camera.lookAt(0,0,0); onReady(); }} fallback={<span />}><ambientLight intensity={1.3} /><directionalLight position={[3,8,5]} intensity={3.5} color="#def3d9" /><directionalLight position={[-4,3,-3]} intensity={3} color="#4ddb8f" /><directionalLight position={[5,1,-5]} intensity={2} color="#91c6d0" /><SceneRig mode={mode} step={step} visible={visible} /><ContextGuard onFailure={onFailure} /></Canvas></div>;
}
