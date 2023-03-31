import { useCallback, useEffect, useReducer } from 'react';
import { defaultTouchState, touchReducer } from './touchControlsReducer';

export const useKeyboardControls = (enabled: boolean) => {
  const [touch, dispatch] = useReducer(touchReducer, defaultTouchState);

  const handleTouchDown = useCallback((e: TouchEvent) => dispatch({
    type: 'updateOneInput',
    payload: { event: e, pressed: true }
  }), []);

  const handleTouchUp = useCallback((e: TouchEvent) => dispatch({
    type: 'updateOneInput',
    payload: { event: e, pressed: false }
  }), []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    //document.addEventListener('touchdown', handleTouchDown);
    //document.addEventListener('touchup', handleTouchUp);

    /*return () => {
      document.removeEventListener('keydown', handleTouchDown);
      document.removeEventListener('keyup', handleTouchUp);
    };*/
  }, [enabled/*, handleTouchDown, handleTouchUp*/]);

  return touch;
};