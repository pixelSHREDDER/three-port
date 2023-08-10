import React, { useCallback, useEffect, useState } from 'react';
import { Cylinder, useCursor } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
//import { useAppDispatch } from '../../../hooks';
import { Color } from 'three';

const checkedColor = new Color(0x00ff00);
const uncheckedColor = new Color(0xff0000);

export interface SwitchboardButtonProps extends MeshProps {
  label: string,
  onToggle: Function,
  value: string,
}

const SwitchboardButton = (props: SwitchboardButtonProps) => {
  //const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);
  const [checked, setChecked] = useState(false);

  useCursor(hovered);

  const toggle = useCallback((checked: boolean) => {
    setChecked(checked);
    props.onToggle(props.value, checked);
    //dispatch(toggleFilter, value);
  }, [props]);

  return (
    <group>
      <mesh castShadow {...props}>
        <Cylinder
          onClick={() => toggle(!checked)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial
            emissive={!!hovered ? [0.5, 0.5, 0.5] : [0, 0, 0]}
            color={!!checked ? checkedColor : uncheckedColor}
            transparent />
        </Cylinder>
      </mesh>
    </group>
  );
}

export default SwitchboardButton;