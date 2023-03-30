import { useFrame } from '@react-three/fiber';
import { useReducer } from 'react';
import { gamepadInitialState, gamepadReducer } from './gamepadControlsReducer';

export const useGamepadControls = (activeGamepad: number | undefined) => {
  const [gamepad, dispatch] = useReducer(gamepadReducer, {
    ...gamepadInitialState,
    deadzone: 0.5,
    lookSensitivity: 0.1625,
  });

  const pollGamepads = () => {
    let gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (!!gamepads[i]) {
        dispatch({ type: 'updateAll', payload: gamepads[i] })
        break;
      }
    }
  }

  useFrame(() => {
    if (activeGamepad === undefined) {
      return;
    }
    if (!('GamepadEvent' in window)) {
      pollGamepads();
    } else {
      const gamepads: Gamepad[] = navigator.getGamepads();
      dispatch({ type: 'updateAll', payload: gamepads[activeGamepad] });
    }
  });

  return gamepad;
};