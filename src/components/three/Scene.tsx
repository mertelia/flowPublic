"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useFlowStore, ShowPartArray } from "@/store/store";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stage from "./Stage";
import PartCompiler from "./parts/PartCompiler";
import CameraControls from "./controls/CameraControls";
import VideoPlane from "./parts/VideoPlane";
gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasPos = useFlowStore((s) => s.canvasPos);
  const setCanvasPos = useFlowStore((s) => s.setCanvasPos);
  const inViewLock = useFlowStore((s) => s.inViewLock);
  const setCameraPos = useFlowStore((s) => s.setCameraPos);

  const isInView = useInView(canvasWrapperRef, { amount: 0.98 });
  useEffect(() => {
    if (isInView && canvasPos !== 2 && !inViewLock) {
      setCanvasPos(2);
      setCameraPos("focused");
      if (canvasPos === 3) {
        setCameraPos(ShowPartArray[ShowPartArray.length - 1]);
      }
    }
  }, [isInView, canvasPos, setCanvasPos, inViewLock, setCameraPos]);

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!canvasWrapperRef.current) return;

    const wrapper = canvasWrapperRef.current;

    if (canvasPos === 2) {
      scrollYRef.current = window.scrollY;
      gsap.set(wrapper, {
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 10,
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      gsap.set(wrapper, {
        position: "relative",
        width: "100vw",
        height: "100vh",
        top: "auto",
        left: "auto",
        zIndex: 10,
      });
      window.scrollTo(0, scrollYRef.current);
    }
  }, [canvasPos]);

  return (
    <div
      ref={canvasWrapperRef}
      className="w-screen h-screen overflow-hidden bg-black"
    >
      <Canvas shadows camera={{ fov: 45, position: [-0.7, 80, -170] }}>
        <CameraControls />
        <Stage />
        <PartCompiler />
        <VideoPlane />
      </Canvas>
    </div>
  );
}
