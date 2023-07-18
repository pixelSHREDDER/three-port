import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const enum ControlMethods {
  Accelerometer,
  Gamepad,
  Keyboard,
  Mouse,
  Touch,
}

export type FocusedObject = {
  position: {
    x: number,
    y: number,
    z: number,
  },
  rotation: {
    x: number,
    y: number,
    z: number,
  },
  scale: {
    x: number,
    y: number,
    z: number,
  },
}

export interface IControlsState {
  activeGamepadIndex: number,
  connectedGamepads: number[],
  controlMethods: [boolean, boolean, boolean, boolean, boolean],
  focusedObject: FocusedObject | null,
  waitingForInput: boolean,
}

export const defaultControlsState: IControlsState = {
  activeGamepadIndex: -1,
  connectedGamepads: [],
  controlMethods: [false, false, false, false, false],
  focusedObject: null,
  waitingForInput: true,
}

export const controlsSlice = createSlice({
  name: 'controls',
  initialState: defaultControlsState,
  reducers: {
    addGamepad: (state, action: PayloadAction<number>) => {
      state.connectedGamepads.push(action.payload);
    },
    clearActiveGamepad: (state) => {
			state.activeGamepadIndex = -1;
    },
    clearFocusedObject: (state) => {
      state.focusedObject = null;
    },
    removeGamepad: (state, action: PayloadAction<number>) => {
      state.connectedGamepads.filter(pad => pad !== action.payload);
    },
    setActiveGamepad: (state, action: PayloadAction<number>) => {
			state.activeGamepadIndex = action.payload;
    },
    setFocusedObject: (state, action: PayloadAction<FocusedObject>) => {
      action.payload.position.y = 0;
      state.focusedObject = action.payload;
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
  clearFocusedObject,
  removeGamepad,
  setActiveGamepad,
  setFocusedObject,
  setWaitingForInput,
  toggleControlMethod,
} = controlsSlice.actions;

export default controlsSlice.reducer;