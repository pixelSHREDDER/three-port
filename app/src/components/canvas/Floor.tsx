import React from 'react';
import { PlaneProps, usePlane } from '@react-three/cannon';
import { Color, PlaneGeometryProps } from '@react-three/fiber';

export interface IFloorProps extends PlaneProps {
  color: Color,
  geometry: PlaneGeometryProps,
}

export default function Floor(props: IFloorProps) {
  const [ref] = usePlane(() => ({ type: 'Static', mass: 0, ...props }));

  return (
    <mesh receiveShadow rotation={props.rotation} position={props.position} ref={ref as any}>
      <planeGeometry args={props.geometry.args} />
      <meshStandardMaterial color={props.color} transparent />
    </mesh>
  );
};