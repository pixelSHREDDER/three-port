import React, { useEffect, useState } from 'react'
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
  accelerometer: Boolean,
  gamepad: Boolean,
  keyboard: Boolean,
  mouse: Boolean,
  touch: Boolean,
  waitingForInput: Boolean,
}

export default function useControlMethods() {
  const [accelerometer, setAccelerometer] = useState(false);
  const [gamepad, setGamepad] = useState(false);
  const [keyboard, setKeyboard] = useState(true);
  const [mouse, setMouse] = useState(false);
  const [touch, setTouch] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(() => true);

  const onAccelerometerDetected = (event: DeviceMotionEvent) => {
    if (Object.values(event.acceleration).some(v => v !== null)) {
      event.preventDefault();
      window.removeEventListener('devicemotion', onAccelerometerDetected);
      document.removeEventListener('keydown', onKeyboardDetected);
      window.removeEventListener('ontouchstart', onTouchDetected);
      setAccelerometer(true);
      setWaitingForInput(false);
    }
  }

  const onGamepadDetected = (event: GamepadEvent) => { 
    event.preventDefault();
    document.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    setGamepad(true);
    setWaitingForInput(false);
  };
  
  const onKeyboardDetected = (event: KeyboardEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    document.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    setKeyboard(true);
    setWaitingForInput(false);
    };

  const onMouseDetected = (event: MouseEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    document.removeEventListener('gamepadconnected', onGamepadDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    setMouse(true);
    setWaitingForInput(false);
  };
  
  const onTouchDetected = (event: TouchEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    document.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousemove', onMouseDetected);
    window.removeEventListener('ontouchstart', onTouchDetected);
    console.log('derr');
    setTouch(true);
    setWaitingForInput(false);
  };

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

    return () => {
      window.removeEventListener('devicemotion', onAccelerometerDetected);
      document.removeEventListener('gamepadconnected', onGamepadDetected);
      document.removeEventListener('keydown', onKeyboardDetected);
      window.removeEventListener('mousemove', onMouseDetected);
      window.removeEventListener('ontouchstart', onTouchDetected);
    }
  }, []);

  return {
    accelerometer,
    gamepad,
    keyboard,
    mouse,
    touch,
    waitingForInput,
  };
}