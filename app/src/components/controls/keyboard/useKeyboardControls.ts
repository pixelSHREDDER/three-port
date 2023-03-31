import { useCallback, useEffect, useReducer } from 'react';
import { defaultKeyboardState, keyboardReducer } from './keyboardControlsReducer';

export const useKeyboardControls = (enabled: boolean) => {
  const [keyboard, dispatch] = useReducer(keyboardReducer, defaultKeyboardState);

  const handleKeyDown = useCallback((e: KeyboardEvent) => dispatch({
    type: 'updateOneInput',
    payload: { event: e, pressed: true }
  }), []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => dispatch({
    type: 'updateOneInput',
    payload: { event: e, pressed: false }
  }), []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  return keyboard;
};