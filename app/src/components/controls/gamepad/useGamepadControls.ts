import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useReducer } from 'react';
import { defaultGamepadState, gamepadReducer } from './gamepadControlsReducer';
import getGamepadPreferences from './gamepadPreferences';

export const useGamepadControls = (activeGamepadIndex: number) => {
  const [gamepad, dispatch] = useReducer(gamepadReducer, defaultGamepadState);

  const getActiveGamepad = useCallback(() => {
    let gamepads: Gamepad[];
    if (!('GamepadEvent' in window)) {
      let gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        if (!!gamepads[i]) {
          return gamepads[i];
        }
      }
      return undefined;
    } else {
      gamepads = navigator.getGamepads();
      return gamepads[activeGamepadIndex];
    }
  }, [activeGamepadIndex]);

  const configGamepad = useCallback(() => {
    const activeGamepad = getActiveGamepad();
    if (!activeGamepad) {
      return;
    }
    dispatch({type: 'setAllPreferences', payload: getGamepadPreferences(activeGamepad.id)});
  }, [getActiveGamepad]);

  useFrame(() => {
    if (activeGamepadIndex === -1) {
      return;
    }
    const activeGamepad: Gamepad | undefined = getActiveGamepad();
    if (!!activeGamepad) {
      dispatch({ type: 'updateAllInputs', payload: activeGamepad });
    }
  });
  
  useEffect(() => { activeGamepadIndex > -1 && configGamepad() }, [activeGamepadIndex, configGamepad]);

  return gamepad;
};