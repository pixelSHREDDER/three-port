import { useState } from 'react';
import { useRouter } from 'next/router';
import { useBox } from '@react-three/cannon';
import { useCursor } from '@react-three/drei';
import React from 'react';
import { MeshProps } from '@react-three/fiber';

export interface ItemProps extends MeshProps {
  route: string,
}

export default function Item({ route, ...props }) {
  const router = useRouter();
  const [hovered, hover] = useState(false);
  const [ref] = useBox(() => ({ mass: 10, position: props.position }));
  useCursor(hovered);
  
  return (
    <group>
      <mesh
        castShadow
        onClick={() => router.push(route)}
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
