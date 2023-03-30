import React, { createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  Preload,
  BakeShadows
} from '@react-three/drei';
import { Physics } from '@react-three/cannon';
//import { useControls } from 'leva';
import ControlMethodsChooser from '../controls/ControlMethodsChooser';
import Floor from './Floor';
import Player from './Player';
import useControlMethods, { IControlMethods } from '../controls/useControlMethods';

export const ControlMethodsContext = createContext({
  accelerometer: false,
  activeGamepad: undefined,
  keyboard: false,
  mouse: false,
  touch: false,
  waitingForInput: true,
} as IControlMethods);

export default function Scene({ children, ...props }) {
  /*const { up, scale, ...config } = useControls({
    up: { value: -0.5, min: -10, max: 10 },
    scale: { value: 27, min: 0, max: 50 },
    roughness: { value: 0.06, min: 0, max: 0.15, step: 0.001 },
    envMapIntensity: { value: 1, min: 0, max: 5 }
  })*/
  const controlMethods:IControlMethods = useControlMethods();

  return (
    <ControlMethodsContext.Provider value={controlMethods}>
      <Canvas
        {...props}
        frameloop="demand"
        //dpr={[1, 1.5]}
        shadows
        camera={{ near: 0.1, far: 400, fov: 75 }}>
        <fog attach="fog" args={['purple', 0, 130]} />
        <ambientLight intensity={0.1} />
        <group position={[0, 0, 0]}>
          <spotLight castShadow intensity={10} angle={0.1} position={[-200, 220, -100]} shadow-mapSize={[2048, 2048]} shadow-bias={-0.000001} />
          <spotLight angle={0.1} position={[-250, 120, -200]} intensity={1} castShadow shadow-mapSize={[50, 50]} shadow-bias={-0.000001} />
          <spotLight angle={0.1} position={[250, 120, 200]} intensity={1} castShadow shadow-mapSize={[50, 50]} shadow-bias={-0.000001} />
          <Physics gravity={[0, -9.8, 0]}>
            <Player position={[0, 5, 5]} />
            {children}
            <Floor
              geometry={{ args: [20, 20] }}
              position={[0, -.1, 0]}
              rotation={[Math.PI / -2, 0, 0]}
              color="green" />
          </Physics>
        </group>
        <Preload all />
        <ControlMethodsChooser />
        <Environment files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr" background />
        <BakeShadows />
      </Canvas>
    </ControlMethodsContext.Provider>
  )
}