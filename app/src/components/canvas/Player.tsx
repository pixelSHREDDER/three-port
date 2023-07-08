import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { SphereProps, useSphere } from '@react-three/cannon';
import { useThree } from '@react-three/fiber';
import { useKeyboardControls } from '../controls/keyboard/useKeyboardControls';
import { useGamepadControls } from '../controls/gamepad/useGamepadControls';
import { IGamepadInputs, IGamepadState } from '../controls/gamepad/gamepadControlsReducer';
import { IKeyboardInputs, IKeyboardControlsState } from '../controls/keyboard/keyboardControlsSlice';
import { useAppSelector } from '../../hooks';

export default function Player(props: SphereProps) {
  const { activeGamepadIndex } = useAppSelector((state) => state.controls);
  const keyboard: IKeyboardControlsState = useAppSelector((state) => state.keyboardControls);
  const gamepad: IGamepadState = useGamepadControls(activeGamepadIndex);
  const velocity = useRef([0, 0, 0]);
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: props.position,
    ...props,
  }));
  useKeyboardControls();

  const speed: number = 10;

  const directionVector = useMemo(() => new Vector3(), []);
  const frontVector = useMemo(() => new Vector3(), []);
  const sideVector = useMemo(() => new Vector3(), []);
  const lookVector = useMemo(() => new Vector3(0, 1, 0), []);

  const updateKeyboard = useCallback((inputs: IKeyboardInputs) => {
    const lookX = Number(inputs.lookLeft) - Number(inputs.lookRight);
    const lookY = Number(inputs.lookDown) - Number(inputs.lookUp);

    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(inputs.moveBackward) - Number(inputs.moveForward));
    sideVector.set(Number(inputs.moveLeft) - Number(inputs.moveRight), 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);

    if (camera.rotation.x >= 1 && -lookY > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -lookY < 0) {
      camera.rotation.x = -1;
    } else {
      camera.rotateX(-lookY * 0.05);
    }
    camera.rotateOnWorldAxis(lookVector, lookX * 0.05);
  }, [api.velocity, camera, directionVector, frontVector, lookVector, ref, sideVector]);

  const updateGamepad = useCallback((inputs: IGamepadInputs) => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, inputs.leftStickY);
    sideVector.set(inputs.leftStickX, 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);

    if (camera.rotation.x >= 1 && -Number(inputs.rightStickY) > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -Number(inputs.rightStickY) < 0) {
      camera.rotation.x = -1;
    } else {
      camera.rotateX(-Number(inputs.rightStickY));
    }
    camera.rotateOnWorldAxis(lookVector, Number(inputs.rightStickX));
  }, [api.velocity, camera, directionVector, frontVector, lookVector, ref, sideVector]);

  useEffect(() => updateGamepad(gamepad.inputs), [gamepad.inputs, updateGamepad]);
  useEffect(() => updateKeyboard(keyboard.inputs), [keyboard.inputs, updateKeyboard]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  useEffect(() => { camera.rotation.order = 'YXZ';  }, [camera.rotation]);

  return (
    <group>
      <mesh position={props.position} ref={ref as any}>
        {/*<sphereGeometry args={props.args} />*/}
        <meshStandardMaterial />
      </mesh>
    </group>
  );
};