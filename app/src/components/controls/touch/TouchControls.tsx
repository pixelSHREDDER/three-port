import { PerspectiveCamera, OrbitControls, OrbitControlsProps } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Vector3 } from 'three';
import Manager from './manager';

/* @ts-ignore */
const factory = new Manager();
var nipplejs = {
    create: function (options) {
        return factory.create(options);
    },
    factory: factory
};

let joyManagers = [];
const NIPPLEJS_LEFT_OPTIONS = {
  label: 'Move',  
  zone: document.getElementById("joystickWrapper1"),
  size: 120,
  multitouch: true,
  maxNumberOfNipples: 2,
  mode: "static",
  restJoystick: true,
  shape: "circle",
  position: {
    top: "60px",
    left: "60px"
  },
  dynamicPage: true,
};
const NIPPLEJS_RIGHT_OPTIONS = {
  ...NIPPLEJS_LEFT_OPTIONS,
  label: 'Look',
  zone: document.getElementById("joystickWrapper2"),
  position: {
    top: "60px",
    right: "60px"
  },
};

export interface ITouchControlsProps {
  enableJoysticks?: boolean,
  enableKeyboard?: boolean,
  orbitProps?: OrbitControlsProps,
  camProps?: any,
  mult?: number,
};

const defaultTouchControlsProps = {
  enableJoysticks: true,
  enableKeyboard: true,
  orbitProps: {},
  camProps: {},
  mult: 0.1,
};

const TouchControls = (props: ITouchControlsProps) => {
  const orbitRef = useRef(undefined);
  const camRef = useRef(undefined);
  const meshRef = useRef(undefined);

  const [fwdValue, setFwdValue] = useState(0);
  const [bkdValue, setBkdValue] = useState(0);
  const [rgtValue, setRgtValue] = useState(0);
  const [lftValue, setLftValue] = useState(0);
  const [lookXValue, setLookXValue] = useState(0);
  const [lookYValue, setLookYValue] = useState(0);
  const [isLooking, setIsLooking] = useState(false);
  const [recenteringLookY, setRecenteringLookY] = useState(false);

  const tempVector = useMemo(() => new Vector3(), []);
  const upVector = useMemo(() => new Vector3(0, 1, 0), []);
  const lookVector = useMemo(() => new Vector3(0, 1, 0), []);

  const rotateCoords = (x, y, radians) => {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = (cos * x) + (sin * y);
    const ny = (cos * y) - (sin * x);
    return {x: nx, y: ny};
}

  const handleMove = (evt, data) => {
    const rotatedVector = rotateCoords(data.vector.x, data.vector.y, -camRef.current.rotation.y);
    if (rotatedVector.y > 0) {
      setFwdValue(Math.abs(rotatedVector.y));
      setBkdValue(0);
    } else if (rotatedVector.y < 0) {
      setFwdValue(0);
      setBkdValue(Math.abs(rotatedVector.y));
    }
    if (rotatedVector.x > 0) {
      setLftValue(0);
      setRgtValue(Math.abs(rotatedVector.x));
    } else if (rotatedVector.x < 0) {
      setLftValue(Math.abs(rotatedVector.x));
      setRgtValue(0);
    }
  };
  
  const handleLook = (evt, data) => {
    !isLooking && setIsLooking(true);
    setLookXValue(lookXValue => lookXValue + data.vector.x);
    let newLookYValue = lookYValue + data.vector.y;
    if (lookYValue >= 1 && newLookYValue > 0) {
      setLookYValue(1);
    } else if (lookYValue <= -1 && newLookYValue < 0) {
      setLookYValue(-1);
    } else {
      setLookYValue(newLookYValue);
    }
  };

  const useKeyboard = () => {
    const onKeyDown = (event) => {
      switch(event.code) {
        case "ArrowUp":
        case "KeyW":
          handleMove({}, { vector: { y: 1 } });
          break;
        case "ArrowLeft":
        case "KeyA":
          handleMove({}, { vector: { x: -1 } });
          break;
        case "ArrowDown":
        case "KeyS":
          handleMove({}, { vector: { y: -1 } });
          break;
        case "ArrowRight":
        case "KeyD":
          handleMove({}, { vector: { x: 1 } });
          break;
      }
    };
  
    const onKeyUp = (event) => {
      switch(event.code) {
        case "ArrowUp":
        case "KeyW":
          setFwdValue(0);
          break;
        case "ArrowLeft":
        case "KeyA":
          setLftValue(0);
          break;
        case "ArrowDown":
        case "KeyS":
          setBkdValue(0);
          break;
        case "ArrowRight":
        case "KeyD":
          setRgtValue(0);
          break;
      }
    };
  
    useEffect(() => {
      if (props.enableKeyboard) {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
      }
      
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }, []);
  };

  const useJoystick = () => {
    const handleMoveEnd = () => {
      setBkdValue(0);
      setFwdValue(0);
      setLftValue(0);
      setRgtValue(0);
    };
      
    const handleLookEnd = () => { setIsLooking(false) };

    const recenterLookY = () => {
      if (!recenteringLookY || isLooking) {
        return;
      }
      if (Math.abs(lookYValue) < 0.025) {
        setLookYValue(0);
        setRecenteringLookY(false);
        return;
      }
      setLookYValue(lookYValue => lookYValue > 0 ? lookYValue - 0.025 : lookYValue + 0.025);
    };

    useEffect(() => {
      if (!joyManagers.length && props.enableJoysticks) {
        // @ts-ignore
        joyManagers.push(nipplejs.create(NIPPLEJS_LEFT_OPTIONS));
        joyManagers[0].on("move", handleMove);
        joyManagers[0].on("end", handleMoveEnd);
        joyManagers.push(nipplejs.create(NIPPLEJS_RIGHT_OPTIONS));
        joyManagers[1].on("move", handleLook);
        joyManagers[1].on("end", handleLookEnd);
      }
      
      return () => {
        if (joyManagers.length) {
          joyManagers[0].off("move", handleMove);
          joyManagers[0].off("end", handleMoveEnd);
          joyManagers[1].off("move", handleLook);
          joyManagers[1].off("end", handleLookEnd);
        }
      };
    }, []);

    return recenterLookY;
  };

  const recenterLookY = useJoystick();
  useKeyboard();

  const updatePlayer = useCallback(() => {
    let mesh = meshRef.current;
    let controls = orbitRef.current;
    let camera = camRef.current;
    // move the player
    let angle = controls.getAzimuthalAngle();
    
    if (fwdValue > 0) {
      tempVector.set(0, 0, -fwdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (bkdValue > 0) {
      tempVector.set(0, 0, bkdValue).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (lftValue > 0) {
      tempVector.set(-lftValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
    
    if (rgtValue > 0) {
      tempVector.set(rgtValue, 0, 0).applyAxisAngle(upVector, angle);
      mesh.position.addScaledVector(tempVector, props.mult);
    }
        
    camera.rotateX(lookYValue);  
    camera.rotateOnWorldAxis(lookVector, (-lookXValue * props.mult));
    
    if (
      (fwdValue > 0 || bkdValue > 0) &&
      (Math.abs(camera.rotation.x) >= 0.025)
    ) {
      setRecenteringLookY(true);
      recenterLookY();
    }

    mesh.updateMatrixWorld();
    // reposition camera
    camera.position.sub(controls.target);
    controls.target.copy(mesh.position);
    camera.position.add(mesh.position);
  }, [fwdValue, bkdValue, lftValue, rgtValue, lookYValue, lookVector, lookXValue, tempVector, upVector, props.mult, recenterLookY]);
  
  useFrame(() => updatePlayer());

  return (
    <>
      <PerspectiveCamera rotationOrder="YXZ" {...props.camProps} ref={camRef} />
      <OrbitControls
        autoRotate={false}
        enableDamping={false}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotateSpeed={0}
        rotateSpeed={0.5}
        dampingFactor={0}
        {...props.orbitProps}
        ref={orbitRef} />
      <mesh
        position={props.orbitProps.target || [0,0,0]}
        visible={false}
        ref={meshRef}>
        <boxGeometry args={[1,1,1]}>
          <meshStandardMaterial color="white" />
        </boxGeometry>
      </mesh>
    </>
  );
};

TouchControls.defaultProps = defaultTouchControlsProps;

export default TouchControls;