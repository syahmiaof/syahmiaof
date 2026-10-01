'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** Local studio reflections: no HDR download or continuously rendered environment. */
export function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = generator.fromScene(room, .04, .1, 100, { size: 64 });
    const previous = scene.environment;
    // Three.js owns this mutable scene; it is not React state.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = texture.texture;
    room.dispose(); generator.dispose(); invalidate();
    return () => { scene.environment = previous; texture.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}
