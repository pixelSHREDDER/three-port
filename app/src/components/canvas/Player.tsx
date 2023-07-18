import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { SphereProps, useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '../controls/keyboard/useKeyboardControls';
import { useGamepadControls } from '../controls/gamepad/useGamepadControls';
import { IGamepadInputs, IGamepadState } from '../controls/gamepad/gamepadControlsReducer';
import { IKeyboardInputs, IKeyboardControlsState } from '../controls/keyboard/keyboardControlsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ControlMethods, clearFocusedObject } from '../controls/controlsSlice';

export default function Player(props: SphereProps) {
  const { activeGamepadIndex, controlMethods, focusedObject } = useAppSelector((state) => state.controls);
  //const isTouch = useAppSelector((state) => state.controls.controlMethods[ControlMethods.Touch]);
  const keyboard: IKeyboardControlsState = useAppSelector((state) => state.keyboardControls);
  const dispatch = useAppDispatch();
  const gamepad: IGamepadState = useGamepadControls(activeGamepadIndex);
  const velocity = useRef([0, 0, 0]);
  const camera = useThree((state) => state.camera);
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    type: 'Dynamic',
    //position: props.position,
    ...props,
    args: [3.5],
  }));
  useKeyboardControls();

  const GAMEPAD_LOOK_SPEED: number = 0.4;
  const KEYBOARD_LOOK_SPEED: number = 0.05;
  const MOVE_SPEED: number = 10;
  const COLLISION_BUFFER = 0.5;

  const directionVector = useMemo(() => new Vector3(), []);
  const frontVector = useMemo(() => new Vector3(), []);
  const sideVector = useMemo(() => new Vector3(), []);
  const lookVector = useMemo(() => new Vector3(0, 1, 0), []);

  const positionToVector = useMemo<Vector3 | null>(() => {
    if (!!focusedObject) {
      return new Vector3(
        focusedObject.position.x + focusedObject.scale.x + COLLISION_BUFFER,
        camera.position.y,
        focusedObject.position.z + focusedObject.scale.z + COLLISION_BUFFER,
      );
    } else {
      return null;
    }
  }, [camera.position.y, focusedObject]);

  const updateKeyboard = useCallback((inputs: IKeyboardInputs) => {
    const lookX = Number(inputs.lookLeft) - Number(inputs.lookRight);
    const lookY = Number(inputs.lookDown) - Number(inputs.lookUp);

    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, Number(inputs.moveBackward) - Number(inputs.moveForward));
    sideVector.set(Number(inputs.moveLeft) - Number(inputs.moveRight), 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);

    if (camera.rotation.x >= 1 && -lookY > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -lookY < 0) {
      camera.rotation.x = -1;
    } else {
      camera.rotateX(-lookY * KEYBOARD_LOOK_SPEED);
    }
    camera.rotateOnWorldAxis(lookVector, lookX * KEYBOARD_LOOK_SPEED);
  }, [api.velocity, camera, directionVector, frontVector, lookVector, ref, sideVector]);

  const updateGamepad = useCallback((inputs: IGamepadInputs) => {
    ref.current.getWorldPosition(camera.position);
    frontVector.set(0, 0, inputs.leftStickY);
    sideVector.set(inputs.leftStickX, 0, 0);
    directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(camera.rotation);
    api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);

    if (camera.rotation.x >= 1 && -Number(inputs.rightStickY) > 0) {
      camera.rotation.x = 1;
    } else if (camera.rotation.x <= -1 && -Number(inputs.rightStickY) < 0) {
      camera.rotation.x = -1;
    } else {
      camera.rotateX(-Number(inputs.rightStickY) * GAMEPAD_LOOK_SPEED);
    }
    camera.rotateOnWorldAxis(lookVector, Number(inputs.rightStickX) * GAMEPAD_LOOK_SPEED);
  }, [api.velocity, camera, directionVector, frontVector, lookVector, ref, sideVector]);

  const moveToFocusedObject = useCallback((state, delta) => {
    if (Math.floor(positionToVector.distanceTo(state.camera.position)) <= 0) {
      //ref.current.getWorldPosition(state.camera.position);
      //state.camera.updateProjectionMatrix();
      
      
      
      /*ref.current.getWorldPosition(camera.position);
      frontVector.set(0, 0, 0);
      sideVector.set(0, 0, 0);
      directionVector.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);
      api.velocity.set(directionVector.x, velocity.current[1], directionVector.z);
      //state.camera.updateProjectionMatrix();

      camera.rotateX(0);
      camera.rotateOnWorldAxis(lookVector, 0);*/
      dispatch(clearFocusedObject());
      return null;
    }

    //ref.current.getWorldPosition(state.camera.position);
    state.camera.lookAt(positionToVector);
    state.camera.position.lerp(positionToVector, delta);
    ref.current.position.lerp(positionToVector, delta);
    state.camera.updateProjectionMatrix();
  }, [dispatch, positionToVector, ref]);

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  useEffect(() => { camera.rotation.order = 'YXZ';  }, [camera.rotation]);

  return useFrame((state, delta) => {
    if (!!focusedObject) {
      moveToFocusedObject(state, delta);
     } else {
      if (controlMethods[ControlMethods.Keyboard] === true) {
        updateKeyboard(keyboard.inputs);
      }
      if (controlMethods[ControlMethods.Gamepad] === true) {
        updateGamepad(gamepad.inputs);
      }
     }
    return null;
  });
};