import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const enum ControlMethods {
  Accelerometer,
  Gamepad,
  Keyboard,
  Mouse,
  Touch,
}

export interface IControlsState {
  activeGamepadIndex: number,
  connectedGamepads: Set<number>,
  controlMethods: [boolean, boolean, boolean, boolean, boolean],
  waitingForInput: boolean,
}

export const defaultControlsState: IControlsState = {
  activeGamepadIndex: -1,
  connectedGamepads: new Set(),
  controlMethods: [false, false, false, false, false],
  waitingForInput: true,
}

export const controlsSlice = createSlice({
  name: 'controls',
  initialState: defaultControlsState,
  reducers: {
    addGamepad: (state, action: PayloadAction<number>) => {
      state.connectedGamepads.add(action.payload);
    },
    clearActiveGamepad: (state) => {
			state.activeGamepadIndex = -1;
    },
    removeGamepad: (state, action: PayloadAction<number>) => {
      state.connectedGamepads.delete(action.payload);
    },
    setActiveGamepad: (state, action: PayloadAction<number>) => {
			state.activeGamepadIndex = action.payload;
    },
    setWaitingForInput: (state, action: PayloadAction<boolean>) => {
			state.waitingForInput = action.payload;
    },
    toggleControlMethod: (state, action: PayloadAction<ControlMethods>) => {
			state.controlMethods[action.payload] = !state.controlMethods[action.payload];
    },
  },
})

export const {
  addGamepad,
  clearActiveGamepad,
  removeGamepad,
  setActiveGamepad,
  setWaitingForInput,
  toggleControlMethod,
} = controlsSlice.actions;

export default controlsSlice.reducer;