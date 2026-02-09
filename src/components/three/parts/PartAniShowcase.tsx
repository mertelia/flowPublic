"use client";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFlowStore } from "@/store/store";

type PartAniShowcaseProps = {
  name: string;
  aniKey: string;
};

export default function PartAniShowcase({
  name,
  aniKey,
}: PartAniShowcaseProps) {
  const { animations, nodes } = useGLTF("/models/stage.glb");
  const cameraPos = useFlowStore((s) => s.cameraPos);
  const isActive = cameraPos === aniKey;

  const group = useRef<THREE.Group>(null);

  // 1. Sadece ilgili parçaya ait animasyon track'lerini filtrele
  const filteredAnimations = useMemo(() => {
    return animations.map((clip) => {
      const newClip = clip.clone();
      // Sadece 'name' ile başlayan veya 'name' içeren track'leri tut
      newClip.tracks = newClip.tracks.filter((track) => {
        // Track ismi genelde "ObjeAdi.quaternion" şeklindedir
        return track.name.includes(name);
      });
      return newClip;
    });
  }, [animations, name]);

  // 2. Filtrelenmiş animasyonları kullan
  const { actions } = useAnimations(filteredAnimations, group);

  const { original, ghost } = useMemo(() => {
    const target = nodes[name];
    if (!target) return { original: null, ghost: null };

    const cloneOriginal = (obj: THREE.Object3D) => obj.clone(true);
    const cloneGhost = (obj: THREE.Object3D) => {
      const copy = obj.clone(true);
      copy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: "#444444",
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
          });
        }
      });
      return copy;
    };

    return {
      original: cloneOriginal(target),
      ghost: cloneGhost(target),
    };
  }, [name, nodes]);

  useEffect(() => {
    if (!actions) return;
    const allActions = Object.values(actions);

    if (isActive) {
      allActions.forEach((action) => {
        if (action) {
          action.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.5).play();
          action.clampWhenFinished = true;
        }
      });
    } else {
      allActions.forEach((action) => action?.fadeOut(0.5));
    }

    return () => allActions.forEach((action) => action?.stop());
  }, [isActive, actions]);

  if (!original || !ghost) return null;

  return (
    <group ref={group} dispose={null}>
      <primitive object={original} visible={isActive} name={name} />
      <primitive object={ghost} visible={!isActive} />
    </group>
  );
}
