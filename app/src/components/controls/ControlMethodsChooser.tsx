import React from 'react';
import { PointerLockControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useAppSelector } from '../../hooks';
import useControlMethods from './useControlMethods';
import { ControlMethods } from './controlsSlice';

const TouchControls = dynamic(() => import('../controls/touch/TouchControls'), { ssr: false });

export default function ControlMethodsChooser() {
  const { controlMethods } = useAppSelector((state) => state.controls);
  useControlMethods();

  return (
    <>
      {controlMethods[ControlMethods.Touch] === true &&
        <TouchControls  
          camProps={{
            makeDefault: true,
            fov: 80,
            position: [0, 0, 5],
          }}
        />
      }
      {controlMethods[ControlMethods.Mouse] === true &&
        <>
          {/* @ts-ignore */}
          <PointerLockControls />
        </>
      }
    </>
  );
}