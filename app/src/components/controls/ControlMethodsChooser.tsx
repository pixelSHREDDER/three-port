import React, { useContext } from 'react'
import {
  PointerLockControls,
} from '@react-three/drei'
import { ControlMethodsContext } from '../canvas/Scene';

export default function ControlMethodsChooser() {
  const controlMethods = useContext(ControlMethodsContext);

  if (!controlMethods.waitingForInput) {
    if (!!controlMethods.mouse) {
      return (
        <>
          {/* @ts-ignore */}
          <PointerLockControls />
        </>
      );
    }
  }
}