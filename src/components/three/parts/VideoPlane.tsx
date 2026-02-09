"use client";

import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFlowStore } from "@/store/store";

// --- Shader Tanımları ---
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uOpacity; 
  uniform float uIsActive;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
uv.y += sin(uv.x * 2.0 + uTime * 0.5) * 0.008;
uv.x += sin(uv.y * 1.5 + uTime * 0.3) * 0.006;
    
    vec4 texColor = texture2D(uTexture, uv);
    vec3 ghostColor = vec3(0.1, 0.1, 0.1); 
    
    vec3 finalRGB = mix(ghostColor, texColor.rgb, uIsActive);
    
    gl_FragColor = vec4(finalRGB, uOpacity);
  }
`;

class VideoMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: new THREE.Texture() },
        uOpacity: { value: 0.4 },
        uIsActive: { value: 0.0 },
      },
      vertexShader,
      fragmentShader,
    });
  }
}

extend({ VideoMaterial });

export default function VideoPlane() {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<any>(null);

  const { nodes } = useGLTF("/models/stage.glb") as any;
  const cameraPos = useFlowStore((s) => s.cameraPos);

  const isActive = cameraPos === "mainScreen";
  const offset = useMemo(() => new THREE.Vector3(0, -14.3, 0), []);

  const video = useMemo(() => {
    if (typeof window === "undefined") return null;
    const v = document.createElement("video");
    v.src = "/videos/musicVideo.mp4";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    return v;
  }, []);

  const videoTexture = useMemo(() => {
    if (!video) return null;
    return new THREE.VideoTexture(video);
  }, [video]);

  useEffect(() => {
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    }
  }, [isActive, video]);

  // Dünya Pozisyonu ve Offset
  useLayoutEffect(() => {
    if (nodes.mainScreen && groupRef.current) {
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();

      nodes.mainScreen.getWorldPosition(worldPos);
      nodes.mainScreen.getWorldQuaternion(worldQuat);

      const rotatedOffset = offset.clone().applyQuaternion(worldQuat);
      groupRef.current.position.copy(worldPos).add(rotatedOffset);
      groupRef.current.quaternion.copy(worldQuat);
    }
  }, [nodes, offset]);

  // Animasyon ve Yumuşak Geçişler
  useFrame((state, delta) => {
    if (materialRef.current) {
      const u = materialRef.current.uniforms;

      u.uTime.value += delta;
      if (videoTexture) u.uTexture.value = videoTexture;

      const targetActive = isActive ? 1.0 : 0.0;
      const targetOpacity = isActive ? 0.6 : 0.4;

      u.uIsActive.value = THREE.MathUtils.lerp(
        u.uIsActive.value,
        targetActive,
        0.1,
      );
      u.uOpacity.value = THREE.MathUtils.lerp(
        u.uOpacity.value,
        targetOpacity,
        0.1,
      );
    }
  });

  return (
    <group ref={groupRef} scale={[10, 9, 1]}>
      <mesh>
        <planeGeometry args={[4, 2.25]} />
        {/* @ts-ignore */}
        <videoMaterial ref={materialRef} />
      </mesh>
    </group>
  );
}
