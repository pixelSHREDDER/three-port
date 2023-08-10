'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useBox } from '@react-three/cannon';
import { useCursor, useGLTF } from '@react-three/drei';
import React from 'react';
import { MeshProps, useLoader } from '@react-three/fiber';
import { useAppDispatch } from '../../hooks';
import { setFocusedObject } from '../controls/controlsSlice';
import { Group, Mesh, MeshNormalMaterial, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
//import useModel from './useModel';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export interface ItemProps extends MeshProps {
  obj: Group,
  position: Vector3,
  route: string,
}

export default function Item({ route, ...props }) {
  const dispatch = useAppDispatch();
  //const router = useRouter();
  const [hovered, hover] = useState(false);
  //const arcade = useModel('/models/arcade/Arcade machine.obj');

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
    args: [0.5, 0.5, 0.5],
  }));
  

  /*useEffect(() => {
    //if (!obj || objRef.current !== null) {
    if (*//*!obj || *//*objs !== null) {
      return;
    }
    //objRef.current = obj.clone();
    //const newObjs = obj.clone();
    const newObjs = props.obj.clone();
    //newObjs.position.copy(new Vector3(props.position));
    setObjs(newObjs);
  }, [objs, props.obj, props.position]);*/

  /*const obj = useLoader(OBJLoader, '/models/arcade/arcade_machine_v2.obj', (loader) => {
    //materials.preload();
    //loader.setMaterials(materials);
  }).clone();*/
  //const gltf = useLoader(GLTFLoader, '/models/arcade/arcade_machine_v2.gltf'),
		//[geometry, setGeometry] = useState<Group>();

	// init
	/*if (!geometry) {
		// Scene settings
		const scene = gltf.scene.clone(true); // so we can instantiate multiple copies of this geometry
		//setCastShadow(scene.children, true);
		//setReceiveShadow(scene.children, true);
		setGeometry(scene);
	}*/

  useCursor(hovered);

  const setFocus = () => {
    return () => {
      dispatch(setFocusedObject({
        position: {...ref.current.position},
        rotation: {
          x: ref.current.rotation.x,
          y: ref.current.rotation.y,
          z: ref.current.rotation.z,
        },
        scale: {
          x: ref.current.scale.x,
          y: ref.current.scale.y,
          z: ref.current.scale.z,
        },
      }));
    }
  }

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
        onClick={setFocus()}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        {...props}
        ref={ref as any}
        scale={[0.0325, 0.025, 0.025]}
        position={props.position}
        object={clone} />
      }
        {/*<boxGeometry args={[3, 6, 3]} />
        <meshStandardMaterial color={props.color} transparent />*/}
  </mesh>
    </group>
  );
}