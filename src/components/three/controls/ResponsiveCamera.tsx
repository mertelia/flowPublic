"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isPortrait = size.height > size.width;

      if (isPortrait) {
        camera.fov = 90;
      } else {
        camera.fov = 45;
      }

      camera.updateProjectionMatrix();
    }
  }, [size.width, size.height, camera]);

  return null;
}
