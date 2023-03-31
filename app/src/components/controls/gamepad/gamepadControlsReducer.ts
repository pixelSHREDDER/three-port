import { IGamepadPreferences, defaultGamepadPreferences } from './gamepadPreferences';

export interface IGamepadInputs {
  back: boolean,
	buttonEast: boolean,
	buttonNorth: boolean,
	buttonSouth: boolean,
	buttonWest: boolean,
	dpadDown: boolean,
	dpadLeft: boolean,
	dpadRight: boolean,
	dpadUp: boolean,
	guide: boolean,
	leftBumper: boolean,
	leftStickButton: boolean,
	leftStickX: number,
	leftStickY: number,
	leftTrigger: boolean,
	rightBumper: boolean,
	rightStickButton: boolean,
	rightStickX: number,
	rightStickY: number,
	rightTrigger: boolean,
	start: boolean,
}

export interface IGamepadState {
	inputs: IGamepadInputs,
	preferences: IGamepadPreferences,
}

type IGamepadAction = | {
	type: 'setAllPreferences',
	payload: IGamepadPreferences,
} | {
	type: 'setOnePreference',
	payload: {
		key: string,
		value: string,
	},
} | {
	type: 'updateAllInputs',
	payload: Gamepad,
} | {
	type: 'updateOneInput',
	payload: {
		key: string,
		value: string,
	},
}

export const defaultGamepadInputs: IGamepadInputs = {
	back: false,
	buttonEast: false,
	buttonNorth: false,
	buttonSouth: false,
	buttonWest: false,
	dpadDown: false,
	dpadLeft: false,
	dpadRight: false,
	dpadUp: false,
	guide: false,
	leftBumper: false,
	leftStickButton: false,
	leftStickX: 0,
	leftStickY: 0,
	leftTrigger: false,
	rightBumper: false,
	rightStickButton: false,
	rightStickX: 0,
	rightStickY: 0,
	rightTrigger: false,
	start: false,
}

export const defaultGamepadState: IGamepadState = {
	inputs: defaultGamepadInputs,
	preferences: defaultGamepadPreferences,
}

export const gamepadReducer = (state: IGamepadState, action: IGamepadAction) => {
	switch (action.type) {
		case 'setAllPreferences':
			return {
				...state,
				preferences: action.payload,
			}
		case 'setOnePreference':
			return {
				...state,
				preferences: {
					...state.preferences,
					[action.payload.key]: action.payload.value,
				}
			}
		case 'updateAllInputs':
			let newInputs: IGamepadInputs = { ...state.inputs };
			if (!!action.payload && !!action.payload.axes) {
				if (action.payload.axes.length >= 4) {
					newInputs.leftStickX = Math.abs(action.payload.axes[0]) > state.preferences.deadzone ? -action.payload.axes[0] : 0;
					newInputs.leftStickY = Math.abs(action.payload.axes[1]) > state.preferences.deadzone ? action.payload.axes[1] : 0;
					newInputs.rightStickX = Math.abs(action.payload.axes[2]) > state.preferences.deadzone ? -action.payload.axes[2] * state.preferences.lookSensitivity : 0;
					newInputs.rightStickY = Math.abs(action.payload.axes[3]) > state.preferences.deadzone ? action.payload.axes[3] * state.preferences.lookSensitivity : 0;
				}
			}
			newInputs.back = action.payload.buttons[8].pressed;
			newInputs.buttonEast = action.payload.buttons[1].pressed;
			newInputs.buttonNorth = action.payload.buttons[3].pressed;
			newInputs.buttonSouth = action.payload.buttons[0].pressed;
			newInputs.buttonWest = action.payload.buttons[2].pressed;
			newInputs.dpadDown = action.payload.buttons[13].pressed;
			newInputs.dpadLeft = action.payload.buttons[14].pressed;
			newInputs.dpadRight = action.payload.buttons[15].pressed;
			newInputs.dpadUp = action.payload.buttons[12].pressed;
			newInputs.guide = action.payload.buttons[16].pressed;
			newInputs.leftBumper = action.payload.buttons[4].pressed;
			newInputs.leftStickButton = action.payload.buttons[10].pressed;
			newInputs.leftTrigger = action.payload.buttons[6].pressed;
			newInputs.rightBumper = action.payload.buttons[5].pressed;
			newInputs.rightStickButton = action.payload.buttons[11].pressed;
			newInputs.rightTrigger = action.payload.buttons[7].pressed;
			newInputs.start = action.payload.buttons[9].pressed;
			return {
				...state,
				inputs: newInputs,
			};
		case 'updateOneInput':
			return {
				...state,
				inputs: {
					...state.inputs,
					[action.payload.key]: action.payload.value,
				}
			};
		default:
			throw new Error(`Unknown action type ${action}`);
	}
}