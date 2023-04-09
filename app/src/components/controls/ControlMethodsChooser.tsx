import React, { useContext } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { ControlMethodsContext } from '../canvas/Scene';
import dynamic from 'next/dynamic';

const TouchControls = dynamic(() => import('../controls/touch/TouchControls'), { ssr: false });

export default function ControlMethodsChooser() {
  const controlMethods = useContext(ControlMethodsContext);

  return (
    <>
      {!!controlMethods.touch &&
        <TouchControls
          camProps={{
            makeDefault: true,
            fov: 80,
            position: [0, 0, 5],
          }}
        />
      }
      
      {!!controlMethods.mouse &&
        <>
          {/* @ts-ignore */}
          <PointerLockControls />
        </>
      }
    </>
  );
}