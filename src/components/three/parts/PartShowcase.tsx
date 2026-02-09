import { Html, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useFlowStore } from "@/store/store";
import PartDetails from "./html/PartDetails";
import { AnimatePresence } from "motion/react";

type PartShowCaseProps = {
  objectName: string;
  header: string;
  detail: string;
  offset: THREE.Vector3;
  distanceFactor: number;
};

export default function PartShowCase({
  objectName,
  header,
  detail,
  offset,
  distanceFactor,
}: PartShowCaseProps) {
  const { nodes } = useGLTF("/models/stage.glb");
  const cameraPos = useFlowStore((s) => s.cameraPos);
  const isActive = cameraPos === objectName;

  const worldPos = new THREE.Vector3();
  nodes[objectName].getWorldPosition(worldPos);

  const { original, ghost } = useMemo(() => {
    const target = nodes[objectName];
    if (!target) return { original: null, ghost: null };

    const cloneOriginal = (obj: THREE.Object3D) => {
      const copy = obj.clone();
      copy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.depthWrite = true;
        }
      });
      return copy;
    };

    const cloneGhost = (obj: THREE.Object3D) => {
      const copy = obj.clone();
      copy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: "#444444",
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
          });
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      return copy;
    };

    return {
      original: cloneOriginal(target),
      ghost: cloneGhost(target),
    };
  }, [nodes, objectName]);

  if (!original || !ghost) return null;

  return (
    <>
      <group>
        <primitive object={original} visible={isActive} />
        <primitive object={ghost} visible={!isActive} />
      </group>
      <Html
        position={[
          worldPos.x + offset.x,
          worldPos.y + offset.y,
          worldPos.z + offset.z,
        ]}
        transform
        rotation={[0, Math.PI, 0]}
        distanceFactor={distanceFactor}
      >
        <AnimatePresence>
          {isActive && <PartDetails header={header} detail={detail} />}
        </AnimatePresence>
      </Html>
    </>
  );
}
