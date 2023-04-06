/*import { TouchEvent, useCallback, useContext, useReducer } from 'react';
import { ControlMethodsContext } from '../../canvas/Scene';
//import { defaultTouchState, touchReducer } from './touchControlsReducer';

export const useTouchControls = () => {
  //const [touch, dispatch] = useReducer(touchReducer, defaultTouchState);
  const controlMethods = useContext(ControlMethodsContext);

  //const handleTouchStart = useCallback((e: TouchEvent<HTMLButtonElement>) => {
  const handleTouchStart = useCallback((e: string) => {
    controlMethods.touchDispatch({
    type: 'updateOneInput',
    //payload: { input: e.currentTarget.id, pressed: true }
    payload: { input: e, pressed: true }
  })}, []);

  //const handleTouchEnd = useCallback((e: TouchEvent<HTMLButtonElement>) => {
  const handleTouchEnd = useCallback((e: string) => {
    controlMethods.touchDispatch({
    type: 'updateOneInput',
    //payload: { input: e.currentTarget.id, pressed: false }
    payload: { input: e, pressed: false }
  })}, []);

  return [ handleTouchStart, handleTouchEnd ];
};*/

import { MouseEvent, MouseEventHandler, TouchEvent, TouchEventHandler, useCallback, useRef, useState } from "react";

const useTouchControls = (
    /*onLongPress: TouchEventHandler<HTMLButtonElement>,
    onClick: TouchEventHandler<HTMLButtonElement>,*/
    onLongPress: Function,
    onClick: Function,
    //{ shouldPreventDefault: boolean = true, delay: number = 300 } = {},
    shouldPreventDefault: boolean = true,
    delay: number = 300,
  ) => {
    const [longPressTriggered, setLongPressTriggered] = useState<boolean>(false);
    const timeout = useRef<NodeJS.Timeout>();
    const target = useRef<EventTarget>();

    const start = useCallback(
        (event: TouchEvent<HTMLButtonElement>) => {
            if (shouldPreventDefault && event.target) {
                    event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(target.current);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event: TouchEvent<HTMLButtonElement>, shouldTriggerClick: boolean = true) => {
            if (timeout.current) {
              clearTimeout(timeout.current);
            }
            if (shouldTriggerClick && !longPressTriggered) {
              onClick(target.current);
            }
            setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        //onMouseDown: (e: TouchEvent<HTMLButtonElement>) => start(e),
        onTouchStart: (e: TouchEvent<HTMLButtonElement>) => start(e),
        //onMouseUp: (e: TouchEvent<HTMLButtonElement>) => clear(e),
        //onMouseLeave: (e: TouchEvent<HTMLButtonElement>) => clear(e, false),
        onTouchEnd: (e: TouchEvent<HTMLButtonElement>) => clear(e),
    };
};

/*const isTouchEvent = (event: Event) => {
return "touches" in event;
};*/

const preventDefault = (event) => {
//if (!isTouchEvent(event)) return;

if ((event.touches.length < 2) && event.preventDefault) {
    event.preventDefault();
}
};

export default useTouchControls;