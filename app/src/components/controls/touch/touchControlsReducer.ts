/*const keyMappings = {
	ArrowLeft: 'lookLeft',
	ArrowRight: 'lookRight',
	KeyA: 'moveLeft',
	KeyD: 'moveRight',
	KeyS: 'moveBackward',
	KeyW: 'moveForward',
	PageDown: 'lookDown',
	PageUp: 'lookUp',
};*/

export interface ITouchInputs {
  /*lookDown: boolean,
  lookLeft: boolean,
  lookRight: boolean,
	lookUp: boolean,*/
	moveBackward: boolean,
	moveForward: boolean,
	moveLeft: boolean,
  moveRight: boolean,
}

export interface ITouchState {
	inputs: ITouchInputs,
}

type ITouchAction = | {
	type: 'updateOneInput',
	payload: {
		event: TouchEvent,
		pressed: boolean,
	},
}

export const defaultTouchInputs: ITouchInputs = {
	/*lookDown: false,
  lookLeft: false,
  lookRight: false,
	lookUp: false,*/
	moveBackward: false,
	moveForward: false,
	moveLeft: false,
  moveRight: false,
}

export const defaultTouchState: ITouchState = {
	inputs: defaultTouchInputs,
}

export const touchReducer = (state: ITouchState, action: ITouchAction) => {
	switch (action.type) {
		case 'updateOneInput':
			let newInputs: ITouchInputs = { ...state.inputs };
			//newInputs[keyMappings[action.payload.event.code]] = !!action.payload.pressed ? 1 : 0;
			return {
				...state,
				inputs: newInputs,
			};
		default:
			throw new Error(`Unknown action type ${action}`);
	}
}