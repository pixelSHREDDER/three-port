import { configureStore } from '@reduxjs/toolkit';
import controlsReducer from './components/controls/controlsSlice';
import keyboardControlsReducer from './components/controls/keyboard/keyboardControlsSlice';

export const store = configureStore({
  reducer: {
    controls: controlsReducer,
    keyboardControls: keyboardControlsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;