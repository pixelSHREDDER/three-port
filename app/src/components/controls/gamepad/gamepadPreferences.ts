export interface IGamepadPreferences {
	deadzone: number,
	lookSensitivity: number,
}

export const defaultGamepadPreferences: IGamepadPreferences = {
  deadzone: 0.5,
  lookSensitivity: 0.1625,
}

export const gamepadPreferences: {[id: string]: IGamepadPreferences} = {
  'Xbox 360 Controller (XInput STANDARD GAMEPAD)': {
    deadzone: 0.5,
    lookSensitivity: 0.1625,
  },
}

export default function getGamepadPreferences(id: string) {
  return id in gamepadPreferences ? gamepadPreferences[id] : defaultGamepadPreferences;
}