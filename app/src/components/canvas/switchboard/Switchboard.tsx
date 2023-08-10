import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
//import { useRouter } from 'next/router';
//import { Triplet, useBox } from '@react-three/cannon';
import { useCursor, useGLTF } from '@react-three/drei';
import React from 'react';
import { MeshProps, useFrame, useLoader } from '@react-three/fiber';
import { useAppDispatch } from '../../../hooks';
import { Group, Mesh, MeshNormalMaterial, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import SwitchboardButton from './SwitchboardButton';
import { RootContainer, Container } from '@coconut-xr/koestlich';
//import useModel from './useModel';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Form, Input, Label, Submit } from "r3f-form";


export interface SwitchboardProps extends MeshProps {
  obj: Group,
  route: string,
}

export default function Switchboard({ route, ...props }) {
  //const dispatch = useAppDispatch();
  //const router = useRouter();
  const [hovered, hover] = useState(false);
  //const button1Position = new Vector3(-0.75, 2.5, 1);
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

  const toggleDOMCheckbox = (name: string, checked: boolean) => {
    const checkbox: Input | undefined = document.querySelector(`input[name="${name}"]`);
    let form;
    let newCheckbox;

    if (!!checkbox && checkbox.type === 'checkbox') {
      checkbox.checked = checked;
      console.log(checkbox.checked);
      return;
    }

    form = document.querySelector('#_r3f-input-form');

    if (!form) {
      return;
    }

    newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    newCheckbox.name = name;
    newCheckbox.id = name;
    newCheckbox.checked = checked;
    newCheckbox.style = 'position: absolute; left: -1000vw; transform: translateX(-50%); width: 15em; touch-action: none; pointer-events: none; opacity: 0;';
    form.append(newCheckbox);
  };

  //const objRef = useRef<Group | null>(null);
  //const [objs, setObjs] = useState<Group | null>(null);
  /*const [ref, api] = useBox(() => ({
    mass: 100,
    *//*position: [
      props.position.x,
      props.position.y,
      props.position.z,
    ],*//*
    //scale: props.scale,
    //args: [2, 4.1, 2],
    //...props,
    //args: [0.5, 0.5, 0.5],
  }));*/

  /*const [button1Ref, button1Api] = useBox(() => ({
    mass: 0,
    position: props.position,
    args: [0.5, 0.5, 0.5],
  }));*/
  

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

  /*useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.children.forEach(child => {
      if (child instanceof SwitchboardButton) {
        child.position.add(new Vector3(ref.current.position));
      }
    });
  });*/

  useCursor(hovered);

  /*useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v: Triplet) => (button1Api.velocity.set(...v)));
    return unsubscribe;
  }, [api.velocity, button1Api.velocity]);*/

  return (
    <group position={props.position} /*{...props}*/>
      <mesh
      //ref={ref as any}
      rotation={props.rotation}
      //scale={[0.0325, 0.025, 0.025]}
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
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        scale={[0.0325, 0.025, 0.025]}
        //{...props}
        //scale={[0.0325, 0.025, 0.025]}
        //position={props.position}
        //positionY={20} 
        object={clone} />
      }
        {/*<boxGeometry args={[3, 6, 3]} />
        <meshStandardMaterial color={props.color} transparent />*/}
    <group position={[0, 3.5, 3]} rotation={[-.25, 0, 0]}>
    <Form>
      <Label text="username" />
      <Input name="username" />

      <group position-y={-0.325}>
      <Label text="password" />
      <Input name="password" type="password" />
      </group>

      <group position-x={-0.5} position-y={-0.5}>
      <Label text="Web" />
      <SwitchboardButton
        //ref={button1Ref}
        label="Web"
        //position={[-0.75, 2.5, 1]}
        onToggle={toggleDOMCheckbox}
        //attach="parent"
        rotation={[45, 0, 0]}
        scale={[.1, .1, .1]}
        value="web" />
        </group>
        <group position-x={0.5} position-y={-0.5}>
      <Label text="Art" />
      <SwitchboardButton
        //ref={button1Ref}
        label="Art"
        //position={[-0.75, 2.5, 1]}
        onToggle={toggleDOMCheckbox}
        //attach="parent"
        rotation={[45, 0, 0]}
        scale={[.1, .1, .1]}
        value="art" />
        </group>

      <Submit value="Login">
      
      </Submit>
    </Form>
    </group>
  </mesh>
  {/*<RootContainer backgroundColor="red" sizeX={2} sizeY={1} flexDirection="row">
        <Container flexGrow={1} margin={48} backgroundColor="green" />
        <Container flexGrow={1} margin={48} backgroundColor="blue" />
      </RootContainer>*/}
    </group>
  );
}