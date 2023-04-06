import React, { useCallback, useEffect, useReducer, useState } from 'react'
//import { touchReducer, defaultTouchState, ITouchInputs, ITouchAction } from './touch/touchControlsReducer-old';
/*import { BrowserTypes, getSelectorsByUserAgent } from 'react-device-detect';
import { GetServerSideProps } from 'next'*/

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

/*export const getServerSideProps: GetServerSideProps<{ promptForAccel: boolean }> = async (context) => {
  const userAgent = await context.req['userAgent'];
  const { isMobile } = getSelectorsByUserAgent(userAgent);
  return {
    props: {
      promptForAccel: BrowserTypes.InternetExplorer && isMobile,
    },
  };
}*/

export interface IControlMethods {
  accelerometer: boolean,
  activeGamepadIndex: number,
  keyboard: boolean,
  mouse: boolean,
  touch: boolean,
  //touchDispatch?: (value: ITouchAction) => void,
  //touchInputs: ITouchInputs,
  waitingForInput: boolean,
}

export default function useControlMethods() {
  const [accelerometer, setAccelerometer] = useState(false);
  const [activeGamepadIndex, setActiveGamepadIndex] = useState<number>(-1);
  const [connectedGamepads, setConnectedGamepads] = useState<number[]>([]);
  const [keyboard, setKeyboard] = useState(true);
  const [mouse, setMouse] = useState(false);
  const [touch, setTouch] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(() => true);
  //const [touchInputs, touchDispatch] = useReducer(touchReducer, defaultTouchState);

  const onAccelerometerDetected = useCallback((event: DeviceMotionEvent) => {
    if (Object.values(event.acceleration).some(v => v !== null)) {
      event.preventDefault();
      window.removeEventListener('devicemotion', onAccelerometerDetected);
      document.removeEventListener('keydown', onKeyboardDetected);
      document.removeEventListener('touchstart', onTouchDetected);
      setAccelerometer(true);
      setWaitingForInput(false);
    }
  }, []);

  const onGamepadDetected = useCallback((event: GamepadEvent) => { 
    event.preventDefault();
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    
    setConnectedGamepads([
      ...connectedGamepads,
      event.gamepad.index
    ]);
    
    if (event.gamepad.mapping === 'standard') {
      setActiveGamepadIndex(event.gamepad.index);
    }
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
    setWaitingForInput(false);
  }, []);

  const onGamepadDisconnected = useCallback((event: GamepadEvent) => {
    let newConnectedGamepads = [...connectedGamepads];
    delete newConnectedGamepads[event.gamepad.index];
    setConnectedGamepads(newConnectedGamepads);
  }, []);

  const onKeyboardDetected = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    setKeyboard(true);
    setWaitingForInput(false);
  }, []);

  const onMouseDetected = useCallback((event: MouseEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    setMouse(true);
    setWaitingForInput(false);
  }, []);
  
  const onTouchDetected = useCallback((event: TouchEvent) => {
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    setTouch(true);
    setWaitingForInput(false);
  }, []);

  const removeAllListeners = useCallback(() => {
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    document.removeEventListener('touchstart', onTouchDetected);
  }, []);

  useEffect(() => {
    const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
    if (typeof requestPermission === 'function') {
      requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', onAccelerometerDetected);
        }
      });
    } else {
      window.addEventListener('devicemotion', onAccelerometerDetected);
    }
    window.addEventListener('gamepadconnected', onGamepadDetected);
    document.addEventListener('keydown', onKeyboardDetected);
    window.addEventListener('mousedown', onMouseDetected);
    document.addEventListener('touchstart', onTouchDetected);

    return () => removeAllListeners();
  }, []);

  return {
    accelerometer,
    activeGamepadIndex,
    keyboard,
    mouse,
    touch,
    //touchDispatch,
    //touchInputs,
    waitingForInput,
  };
}