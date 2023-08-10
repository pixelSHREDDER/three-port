import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Preload,
  BakeShadows,
  Loader,
  Stars
} from '@react-three/drei';
import { Debug, Physics } from '@react-three/cannon';
//import { useControls } from 'leva';
import ControlMethodsChooser from '../controls/ControlMethodsChooser';
import Floor from './Floor';
import Player from './Player';
//import useControlMethods from '../controls/useControlMethods';
import { useAppSelector } from '../../hooks';
import Image from 'next/image';
import Modal from '../dom/Modal';
import { IControlsState } from '../controls/controlsSlice';

export default function Scene({ children, ...props }) {
  const { waitingForInput } = useAppSelector<IControlsState>((state) => state.controls);
  /*const { up, scale, ...config } = useControls({
    up: { value: -0.5, min: -10, max: 10 },
    scale: { value: 27, min: 0, max: 50 },
    roughness: { value: 0.06, min: 0, max: 0.15, step: 0.001 },
    envMapIntensity: { value: 1, min: 0, max: 5 }
  })*/

  return (
    <>
      <Canvas
        {...props}
        frameloop="demand"
        //dpr={[1, 1.5]}
        shadows
        camera={{ near: 0.1, far: 400, fov: 75 }}>
        <Suspense fallback={null}>
          <fog attach="fog" args={['purple', 0, 130]} />
          <ambientLight intensity={0.1} />
          <group position={[0, 0, 0]}>
            <spotLight castShadow intensity={10} angle={0.1} position={[-200, 220, -100]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.000001} />
            <spotLight angle={0.1} position={[-250, 120, -200]} intensity={1} castShadow shadow-mapSize={[50, 50]} shadow-bias={-0.000001} />
            <spotLight angle={0.1} position={[250, 120, 200]} intensity={1} castShadow shadow-mapSize={[50, 50]} shadow-bias={-0.000001} />
            <Physics gravity={[0, -9.8, 0]}>
              <Debug color="red" scale={1}>
                <Player position={[0, 5, 5]} />
                {children}
                <Floor
                  geometry={{ args: [20, 20] }}
                  //position={[0, 0, 0]}
                  rotation={[Math.PI / -2, 0, 0]}
                  color="green" />
              </Debug>
            </Physics>
          </group>
          <Preload all />
          <ControlMethodsChooser />
          <Stars
            radius={100}
            depth={100}
            count={10000}
            factor={4}
            saturation={0}
            fade
            speed={1} />
          <BakeShadows />
        </Suspense>
      </Canvas>
      {waitingForInput === true &&
        <Modal classNames="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 md:gap-6 justify-items-center items-center content-evenly md:content-center sm:auto-rows-fr md:auto-rows-max">
          <Image
            className="h-16 w-16 sm:h-auto sm:w-auto col-span-2"
            height={200}
            width={200}
            src={'/img/touch.gif'}
            alt="Tap the screen" />
          <span className="text-cyan-200 text-xl">OR</span>
          <Image
            className="h-16 w-16 sm:h-auto sm:w-auto col-span-2"
            height={200}
            width={200}
            src={'/img/gamepad.gif'}
            alt="Move the thumbsticks on the gamepad" />
          <span className="text-cyan-200 text-xl">OR</span>
          <Image
            className="h-16 w-32 sm:h-auto sm:w-auto sm:col-start-2 col-span-4"
            height={200}
            width={400}
            src={'/img/keyboard-mouse.gif'}
            alt="Press a key on the keyboard & click the mouse" />
        </Modal>
      }
      <Loader />
    </>
  )
}