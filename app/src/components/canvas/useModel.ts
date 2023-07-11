import { useLoader } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { Group } from "three";
import { OBJLoader } from "three-stdlib";

export default function useModel(objUrl: string) {
  const [objs, setObjs] = useState<Group | null>(null);
  const objLoader = useLoader(OBJLoader, objUrl);

  useEffect(() => {
    //if (!obj || objRef.current !== null) {
    if (!objLoader || objs !== null) {
      return;
    }
    //objRef.current = obj.clone();
    //const newObjs = obj.clone();
    //const newObjs = props.obj.clone();
    const newObjs = objLoader.clone();
    //newObjs.position.copy(new Vector3(props.position));
    setObjs(newObjs);
  }, [objLoader, objs]);

  return objs;
}