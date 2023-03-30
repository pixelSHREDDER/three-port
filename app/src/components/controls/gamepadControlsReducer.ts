export interface IGamepadState {
  back: boolean,
	buttonEast: boolean,
	buttonNorth: boolean,
	buttonSouth: boolean,
	buttonWest: boolean,
	deadzone: number,
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
	lookSensitivity: number,
	rightBumper: boolean,
	rightStickButton: boolean,
	rightStickX: number,
	rightStickY: number,
	rightTrigger: boolean,
	start: boolean,
}

type IGamepadAction = | {
	type: 'updateAll',
	payload: Gamepad,
} | {
	type: 'updateOne',
	payload: {
		key: string,
		value: string,
	},
}

export const gamepadInitialState: IGamepadState = {
	back: false,
	buttonEast: false,
	buttonNorth: false,
	buttonSouth: false,
	buttonWest: false,
	deadzone: 0,
	dpadDown: false,
	dpadLeft: false,
	dpadRight: false,
	dpadUp: false,
	guide: false,
	leftBumper: false,
	leftStickButton: false,
	leftStickX: 0,
	leftStickY: 0,
	lookSensitivity: 1,
	leftTrigger: false,
	rightBumper: false,
	rightStickButton: false,
	rightStickX: 0,
	rightStickY: 0,
	rightTrigger: false,
	start: false,
}

export const gamepadReducer = (state: IGamepadState, action: IGamepadAction) => {
	switch (action.type) {
		case 'updateAll':
			let newState: IGamepadState = { ...state };
			if (!!action.payload && !!action.payload.axes) {
				if (action.payload.axes.length >= 4) {
					newState.leftStickX = Math.abs(action.payload.axes[0]) > state.deadzone ? -action.payload.axes[0] : 0;
					newState.leftStickY = Math.abs(action.payload.axes[1]) > state.deadzone ? action.payload.axes[1] : 0;
					newState.rightStickX = Math.abs(action.payload.axes[2]) > state.deadzone ? -action.payload.axes[2] * state.lookSensitivity : 0;
					newState.rightStickY = Math.abs(action.payload.axes[3]) > state.deadzone ? action.payload.axes[3] * state.lookSensitivity : 0;
				}
			}
			newState.back = action.payload.buttons[8].pressed;
			newState.buttonEast = action.payload.buttons[1].pressed;
			newState.buttonNorth = action.payload.buttons[3].pressed;
			newState.buttonSouth = action.payload.buttons[0].pressed;
			newState.buttonWest = action.payload.buttons[2].pressed;
			newState.dpadDown = action.payload.buttons[13].pressed;
			newState.dpadLeft = action.payload.buttons[14].pressed;
			newState.dpadRight = action.payload.buttons[15].pressed;
			newState.dpadUp = action.payload.buttons[12].pressed;
			newState.guide = action.payload.buttons[16].pressed;
			newState.leftBumper = action.payload.buttons[4].pressed;
			newState.leftStickButton = action.payload.buttons[10].pressed;
			newState.leftTrigger = action.payload.buttons[6].pressed;
			newState.rightBumper = action.payload.buttons[5].pressed;
			newState.rightStickButton = action.payload.buttons[11].pressed;
			newState.rightTrigger = action.payload.buttons[7].pressed;
			newState.start = action.payload.buttons[9].pressed;
			return newState;
		case 'updateOne':
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};
		default:
			throw new Error(`Unknown action type ${action}`);
	}
}