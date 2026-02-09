"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useLayoutEffect, useState } from "react"; // useLayoutEffect ekledik
import { useInView, motion } from "framer-motion";
import { useFlowStore, ShowPartArray } from "@/store/store";
import Stage from "./Stage";
import PartCompiler from "./parts/PartCompiler";
import CameraControls from "./controls/CameraControls";
import VideoPlane from "./parts/VideoPlane";
import ResponsiveCamera from "./controls/ResponsiveCamera";

export default function Scene() {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasPos = useFlowStore((s) => s.canvasPos);
  const setCanvasPos = useFlowStore((s) => s.setCanvasPos);
  const inViewLock = useFlowStore((s) => s.inViewLock);
  const setCameraPos = useFlowStore((s) => s.setCameraPos);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const isInView = useInView(canvasWrapperRef, {
    amount: isMobile ? 0.8 : 0.98,
  });
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (isInView && canvasPos !== 2 && !inViewLock) {
      setCanvasPos(2);
      setCameraPos("focused");
      if (canvasPos === 3) {
        setCameraPos(ShowPartArray[ShowPartArray.length - 1]);
      }
    }
  }, [isInView, canvasPos, setCanvasPos, inViewLock, setCameraPos]);

  useLayoutEffect(() => {
    if (canvasPos === 2) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [canvasPos]);

  return (
    <>
      <div className="absolute w-screen h-screen -z-10" />

      <motion.div
        ref={canvasWrapperRef}
        style={{
          position: canvasPos === 2 ? "fixed" : "relative",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10,
        }}
        className="overflow-hidden bg-black"
      >
        <Canvas shadows camera={{ fov: 45, position: [-0.7, 80, -170] }}>
          <CameraControls />
          <Stage />
          <PartCompiler />
          <VideoPlane />
          <ResponsiveCamera />
        </Canvas>
      </motion.div>
      {canvasPos === 2 && <div style={{ height: "100vh" }} />}
    </>
  );
}
