import { useState } from 'react';
import { useRouter } from 'next/router';
import { useBox } from '@react-three/cannon';
import { useCursor } from '@react-three/drei';
import React from 'react';
import { MeshProps } from '@react-three/fiber';
import { useAppDispatch } from '../../hooks';
import { setFocusedObject } from '../controls/controlsSlice';
import { Vector3 } from 'three';

export interface ItemProps extends MeshProps {
  route: string,
}

export default function Item({ route, ...props }) {
  const dispatch = useAppDispatch();
  //const router = useRouter();
  const [hovered, hover] = useState(false);
  const [ref] = useBox(() => ({ mass: 10, position: props.position }));
  
  useCursor(hovered);

  const setFocus = () => {
    return () => {
      dispatch(setFocusedObject({
        position: ref.current.getWorldPosition(ref.current.position),
        rotation: ref.current.rotation,
      }));
    }
  }
  
  return (
    <group>
      <mesh
        castShadow
        //onClick={() => router.push(route)}
        onClick={setFocus()}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        {...props}
        ref={ref as any}>
        <boxGeometry args={[3, 6, 3]} />
        <meshStandardMaterial color={props.color} transparent />
      </mesh>
    </group>
  );
}
