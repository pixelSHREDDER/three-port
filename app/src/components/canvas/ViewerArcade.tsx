import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBox } from '@react-three/cannon';
import React from 'react';
import { MeshProps, useLoader } from '@react-three/fiber';
import { Group, Mesh, MeshNormalMaterial, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
//import useModel from './useModel';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export interface ItemProps extends MeshProps {
  route: string,
}

export default function ViewerArcade({ route, ...props }) {
  const obj = useLoader(OBJLoader, '/models/arcade/Arcade machine.obj');
  const clone = useMemo(() => {
    const mat = new MeshNormalMaterial();
    const newObj = obj.clone();
    newObj.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = mat;
        child.material.color = props.color;
        child.material.transparent = true;
      }
    });
    return newObj;
  }, [obj, props.color]);

  //const objRef = useRef<Group | null>(null);
  //const [objs, setObjs] = useState<Group | null>(null);
  const [ref] = useBox(() => ({
    mass: 100,
    //position: props.position,
    ...props,
    position: [0, 0, 0],
    args: [0.5, 0.5, 0.5],
  }));

  return (
    <group>
      <mesh
        //castShadow
        //onClick={() => router.push(route)}
        /*onClick={setFocus()}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}*/
        //{...props}
        //ref={ref as any}
        >
      {!!clone &&
      <primitive
        castShadow
        {...props}
        ref={ref as any}
        scale={[0.0325, 0.025, 0.025]}
        position={props.position}
        object={clone} />
      }
  </mesh>
    </group>
  );
}