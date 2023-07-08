import { useCallback, useEffect } from 'react';
import { updateInput } from './keyboardControlsSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ControlMethods } from '../controlsSlice';

export const useKeyboardControls = () => {
  const { controlMethods } = useAppSelector((state) => state.controls);
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    dispatch(updateInput({ keyCode: e.code, pressed: false }));
    dispatch(updateInput({ keyCode: e.code, pressed: true }));
  }, [dispatch]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    dispatch(updateInput({ keyCode: e.code, pressed: false }));
  }, [dispatch]);

  useEffect(() => {
    if (controlMethods[ControlMethods.Keyboard] === true) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    };
  }, [controlMethods, handleKeyDown, handleKeyUp]);

  useEffect(() => { return () => {
    document.removeEventListener('keypress', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  }}, []);
};