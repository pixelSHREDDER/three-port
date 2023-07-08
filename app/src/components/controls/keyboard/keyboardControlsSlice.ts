import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const keyMappings = {
	ArrowLeft: 'lookLeft',
	ArrowRight: 'lookRight',
	KeyA: 'moveLeft',
	KeyD: 'moveRight',
	KeyS: 'moveBackward',
	KeyW: 'moveForward',
	ArrowDown: 'lookDown',
	ArrowUp: 'lookUp',
};

export interface IKeyboardInputs {
  lookDown: 0 | 1,
  lookLeft: 0 | 1,
  lookRight: 0 | 1,
	lookUp: 0 | 1,
	moveBackward: 0 | 1,
	moveForward: 0 | 1,
	moveLeft: 0 | 1,
  moveRight: 0 | 1,
}

export interface IKeyboardControlsState {
	inputs: IKeyboardInputs,
}

export type KeyboardAction = {
  keyCode: string,
	pressed: boolean,
}

export const defaultKeyboardInputs: IKeyboardInputs = {
	lookDown: 0,
  lookLeft: 0,
  lookRight: 0,
	lookUp: 0,
	moveBackward: 0,
	moveForward: 0,
	moveLeft: 0,
  moveRight: 0,
}

export const defaultKeyboardControlsState: IKeyboardControlsState = {
	inputs: defaultKeyboardInputs,
}

export const keyboardControlsSlice = createSlice({
  name: 'keyboardControls',
  initialState: defaultKeyboardControlsState,
  reducers: {
		updateInput: (state, action: PayloadAction<KeyboardAction>) => {
			state.inputs[keyMappings[action.payload.keyCode]] = !!action.payload.pressed ? 1 : 0;
    },
  },
})

export const { updateInput } = keyboardControlsSlice.actions;

export default keyboardControlsSlice.reducer;