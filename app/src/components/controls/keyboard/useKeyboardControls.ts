import { useCallback, useEffect } from 'react';
import { updateInput } from './keyboardControlsSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ControlMethods } from '../controlsSlice';

export const useKeyboardControls = () => {
  const { controlMethods } = useAppSelector((state) => state.controls);
  const { inputs } = useAppSelector((state) => state.keyboardControls);
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (inputs[e.code] === 1) {
      return;
    }
    dispatch(updateInput({ keyCode: e.code, pressed: true }));
  }, [dispatch, inputs]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (inputs[e.code] === 0) {
      return;
    }
    dispatch(updateInput({ keyCode: e.code, pressed: false }));
  }, [dispatch, inputs]);

  useEffect(() => {
    if (controlMethods[ControlMethods.Keyboard] === true) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    };
  }, [controlMethods, handleKeyDown, handleKeyUp]);

  useEffect(() => { return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  }}, []);
};