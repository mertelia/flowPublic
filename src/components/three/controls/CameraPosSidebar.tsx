"use client";
import { useEffect, useRef, useState } from "react";
import { ShowPartArray, useFlowStore } from "@/store/store";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const LABEL_MAP: Record<(typeof ShowPartArray)[number], string> = {
  idle: "Idle",
  focused: "Stage",
  truss: "Truss System",
  lineSpeaker: "Line Array Speakers",
  lights: "Lights",
  fogMachine: "Fog Machine",
  subwoofer: "Subwoofers",
  mainScreen: "Stage Screens",
  police: "Front of Stage Barriers",
  delayTower: "Delay Tower",
  frontFillSpeaker: "Front Fill Speakers",
  stageMonitor: "Stage Monitor Speakers",
  enstrumants: "Instruments",
  sideScreen: "Side Screens",
};

const getOpacityByDistance = (distance: number) => {
  if (distance === 0) return 1; // active
  if (distance === 1) return 0.65; // üst-alt
  if (distance === 2) return 0.55;
  if (distance === 3) return 0.45;
  return 0.45;
};

export default function CameraPosSidebar() {
  const cameraPos = useFlowStore((s) => s.cameraPos);
  const canvasPos = useFlowStore((s) => s.canvasPos);
  const setCameraPos = useFlowStore((s) => s.setCameraPos);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const sidebarItems = ShowPartArray.filter((key) => key !== "idle");
  const activeIndex = sidebarItems.indexOf(cameraPos as any);

  const mouseY = useMotionValue(0);

  const smoothY = useSpring(mouseY, {
    stiffness: isHovering ? 450 : 180,
    damping: 35,
  });

  const maskImage = useTransform(
    smoothY,
    (y) =>
      `radial-gradient(
      ellipse 150% 80px at center ${y}px,
      black 25%,
      rgba(0,0,0,0.08) 100%
    )`,
  );
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current.getBoundingClientRect();
    mouseY.set(e.clientY - rect.top);
    if (!isHovering) setIsHovering(true);
  };

  // hover yokken aktif item spotlight merkezine gelsin
  useEffect(() => {
    if (!isHovering && activeIndex !== -1 && sidebarRef.current) {
      const activeButton = sidebarRef.current.children[
        activeIndex
      ] as HTMLElement;

      if (activeButton) {
        mouseY.set(activeButton.offsetTop + activeButton.offsetHeight / 2);
      }
    }
  }, [activeIndex, isHovering, mouseY]);

  return (
    <AnimatePresence>
      {canvasPos === 2 && (
        <motion.div
          ref={sidebarRef}
          exit={{ opacity: 0, x: -20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsHovering(false)}
          className="fixed left-[5%] top-1/2 z-50 flex flex-col gap-4 -translate-y-1/2 text-main"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
          }}
        >
          {sidebarItems.map((key, index) => {
            const distance =
              activeIndex === -1 ? 99 : Math.abs(index - activeIndex);

            const opacity = getOpacityByDistance(distance);
            const isActive = distance === 0;

            return (
              <motion.button
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ opacity: { duration: 0.25 } }}
                onClick={() => setCameraPos(key)}
                className="flex w-full cursor-pointer items-center gap-2 text-left text-lg outline-none tracking-[-0.07em]"
              >
                <div className="h-3 w-3 bg-main" />

                <div className="whitespace-nowrap tracking-tight font-light ">
                  {LABEL_MAP[key]}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
