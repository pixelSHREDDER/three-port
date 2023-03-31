const keyMappings = {
	ArrowLeft: 'lookLeft',
	ArrowRight: 'lookRight',
	KeyA: 'moveLeft',
	KeyD: 'moveRight',
	KeyS: 'moveBackward',
	KeyW: 'moveForward',
	PageDown: 'lookDown',
	PageUp: 'lookUp',
};

export interface IKeyboardInputs {
  lookDown: boolean,
  lookLeft: boolean,
  lookRight: boolean,
	lookUp: boolean,
	moveBackward: boolean,
	moveForward: boolean,
	moveLeft: boolean,
  moveRight: boolean,
}

export interface IKeyboardState {
	inputs: IKeyboardInputs,
}

type IKeyboardAction = | {
	type: 'updateOneInput',
	payload: {
		event: KeyboardEvent,
		pressed: boolean,
	},
}

export const defaultKeyboardInputs: IKeyboardInputs = {
	lookDown: false,
  lookLeft: false,
  lookRight: false,
	lookUp: false,
	moveBackward: false,
	moveForward: false,
	moveLeft: false,
  moveRight: false,
}

export const defaultKeyboardState: IKeyboardState = {
	inputs: defaultKeyboardInputs,
}

export const keyboardReducer = (state: IKeyboardState, action: IKeyboardAction) => {
	switch (action.type) {
		case 'updateOneInput':
			let newInputs: IKeyboardInputs = { ...state.inputs };
			newInputs[keyMappings[action.payload.event.code]] = !!action.payload.pressed ? 1 : 0;
			return {
				...state,
				inputs: newInputs,
			};
		default:
			throw new Error(`Unknown action type ${action}`);
	}
}