import React, { useContext, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { SphereProps, useSphere } from '@react-three/cannon';
import { useThree } from '@react-three/fiber';
import { ControlMethodsContext } from './Scene';
import { useKeyboardControls } from '../controls/useKeyboardControls';
import { useGamepadControls } from '../controls/useGamepadControls';
import { IGamepadState } from '../controls/gamepadControlsReducer';

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
  const gamepad: IGamepadState = useGamepadControls(controlMethods.activeGamepad);
  const speed = 10;

  let directionVector = new Vector3();
  let frontVector = new Vector3();
  let sideVector = new Vector3();
  let lookVector = new Vector3(0, 1, 0);

  const keyboardFrame = () => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);
  };

  const gamepadFrame = () => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(gamepad.leftStickY));
    sideVector.set(Number(gamepad.leftStickX), 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);

    if (camera.rotation.x >= 1 && -Number(gamepad.rightStickY) > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -Number(gamepad.rightStickY) < 0) {
      camera.rotation.x = -1;
    } else {
      camera.rotateX(-Number(gamepad.rightStickY));
    }
    camera.rotateOnWorldAxis(lookVector, Number(gamepad.rightStickX));
  };

  useEffect(() => gamepadFrame(), [gamepad]);
  useEffect(() => keyboardFrame(), [forward, backward, left, right]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  useEffect(() => { camera.rotation.order = 'YXZ';  }, []);

  return (
    <group>
      <mesh position={props.position} ref={ref as any}>
        <sphereGeometry args={props.args} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
};