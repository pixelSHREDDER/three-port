import React, { useCallback, useEffect, useState } from 'react'
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

  const onAccelerometerDetected = useCallback((event: DeviceMotionEvent) => {
    if (Object.values(event.acceleration).some(v => v !== null)) {
      event.preventDefault();
      window.removeEventListener('devicemotion', onAccelerometerDetected);
      document.removeEventListener('keydown', onKeyboardDetected);
      window.removeEventListener('ontouchstart', onTouchDetected);
      setAccelerometer(true);
      setWaitingForInput(false);
    }
  }, []);

  const onGamepadDetected = useCallback((event: GamepadEvent) => { 
    event.preventDefault();
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    
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
    window.removeEventListener('ontouchstart', onTouchDetected);
    setKeyboard(true);
    setWaitingForInput(false);
  }, []);

  const onMouseDetected = useCallback((event: MouseEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    setMouse(true);
    setWaitingForInput(false);
  }, []);
  
  const onTouchDetected = useCallback((event: TouchEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    setTouch(true);
    setWaitingForInput(false);
  }, []);

  const removeAllListeners = useCallback(() => {
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
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
    window.addEventListener('mousemove', onMouseDetected);
    window.addEventListener('ontouchstart', onTouchDetected);

    return () => removeAllListeners();
  }, []);

  return {
    accelerometer,
    activeGamepadIndex,
    keyboard,
    mouse,
    touch,
    waitingForInput,
  };
}