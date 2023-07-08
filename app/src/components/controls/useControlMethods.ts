import { useCallback, useEffect } from 'react'
import { ControlMethods } from './controlsSlice';
import { useAppDispatch } from '../../hooks';
import {
  addGamepad,
  removeGamepad,
  setActiveGamepad,
  setWaitingForInput,
  toggleControlMethod,
} from './controlsSlice';
import { useKeyboardControls } from './keyboard/useKeyboardControls';
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

export default function useControlMethods() {
  const dispatch = useAppDispatch();
  useKeyboardControls();
  //const [touchInputs, touchDispatch] = useReducer(touchReducer, defaultTouchState);

  const onAccelerometerDetected = useCallback((event: DeviceMotionEvent) => {
    if (Object.values(event.acceleration).some(v => v !== null)) {
      event.preventDefault();
      document.removeEventListener('keydown', onKeyboardDetected);
      document.removeEventListener('touchstart', onTouchDetected);
      dispatch(toggleControlMethod(ControlMethods.Accelerometer));
      dispatch(setWaitingForInput(false));
    }
  }, []);

  const onGamepadDetected = useCallback((event: GamepadEvent) => { 
    event.preventDefault();
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    dispatch(addGamepad(event.gamepad.index));
    
    if (event.gamepad.mapping === 'standard') {
      dispatch(setActiveGamepad(event.gamepad.index));
    }
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
    dispatch(toggleControlMethod(ControlMethods.Gamepad));
    dispatch(setWaitingForInput(false));
  }, []);

  const onGamepadDisconnected = useCallback((event: GamepadEvent) => {
    dispatch(removeGamepad(event.gamepad.index));
  }, []);

  const onKeyboardDetected = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    dispatch(toggleControlMethod(ControlMethods.Keyboard));
    dispatch(setWaitingForInput(false));
  }, []);

  const onMouseDetected = useCallback((event: MouseEvent) => {
    event.preventDefault();
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('touchstart', onTouchDetected);
    dispatch(toggleControlMethod(ControlMethods.Mouse));
    dispatch(setWaitingForInput(false));
  }, []);
  
  const onTouchDetected = useCallback((event: TouchEvent) => {
    window.removeEventListener('devicemotion', onAccelerometerDetected);
    window.removeEventListener('gamepadconnected', onGamepadDetected);
    document.removeEventListener('keydown', onKeyboardDetected);
    window.removeEventListener('mousedown', onMouseDetected);
    dispatch(toggleControlMethod(ControlMethods.Touch));
    dispatch(setWaitingForInput(false));
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
          window.addEventListener('devicemotion', onAccelerometerDetected, { once: true });
        }
      });
    } else {
      window.addEventListener('devicemotion', onAccelerometerDetected, { once: true });
    }
    window.addEventListener('gamepadconnected', onGamepadDetected, { once: true });
    document.addEventListener('keydown', onKeyboardDetected, { once: true });
    window.addEventListener('mousedown', onMouseDetected, { once: true });
    document.addEventListener('touchstart', onTouchDetected, { once: true });

    return () => removeAllListeners();
  }, []);
}