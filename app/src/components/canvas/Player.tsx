import React, { useContext, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { SphereProps, useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { ControlMethodsContext } from './Scene';
import { useKeyboardControls } from '../controls/useKeyboardControls';

export default function Player(props: SphereProps) {
  const controlMethods = useContext(ControlMethodsContext);
  const velocity = useRef([0, 0, 0]);
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: props.position,
    ...props,
  }));
  const { forward, backward, left, right } = useKeyboardControls(controlMethods.keyboard);

  const speed = 10;

  let direction = new Vector3();
  let frontVector = new Vector3();
  let sideVector = new Vector3();

  useFrame(() => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    api.velocity.set(direction.x, velocity.current[1], direction.z);
  });

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);

  return (
    <group>
      <mesh position={props.position} ref={ref as any}>
        <sphereGeometry args={props.args} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
};