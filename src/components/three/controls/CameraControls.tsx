import { useFlowStore } from "@/store/store";
import { useGLTF, useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ShowPartArray } from "@/store/store";
import { useFrame, useThree } from "@react-three/fiber";
import { useMotionValue, useSpring } from "motion/react";

export default function CameraControls() {
  //Store
  const cameraPos = useFlowStore((s) => s.cameraPos);
  const canvasPos = useFlowStore((s) => s.canvasPos);
  const setCanvasPos = useFlowStore((s) => s.setCanvasPos);
  const setInViewLock = useFlowStore((s) => s.setInViewLock);
  const isCameraAnimating = useRef(false);

  useEffect(() => {
    if (canvasPos !== 2) return;

    let touchStartY = 0;

    const handleInput = (deltaY: number) => {
      if (Math.abs(deltaY) < 50) return;
      if (isCameraAnimating.current) return;

      const { cameraPos, setCameraPos } = useFlowStore.getState();
      const index = ShowPartArray.indexOf(cameraPos);
      if (index === -1) return;

      if (deltaY > 0) {
        if (index === ShowPartArray.length - 1) {
          setInViewLock(true);
          setCanvasPos(3);
          window.setTimeout(() => setInViewLock(false), 700);
          setCameraPos("idle");
          isCameraAnimating.current = true;
          return;
        }
        setCameraPos(ShowPartArray[index + 1]);
        isCameraAnimating.current = true;
      } else {
        if (index === 1) {
          setInViewLock(true);
          setCanvasPos(1);
          window.setTimeout(() => setInViewLock(false), 700);
          setCameraPos("idle");
          isCameraAnimating.current = true;
          return;
        }
        setCameraPos(ShowPartArray[index - 1]);
        isCameraAnimating.current = true;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleInput(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      handleInput(deltaY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasPos, setCanvasPos, setInViewLock]);

  // Camera Animation
  const { camera } = useThree();
  const cameraRefTarget = useRef(new THREE.Vector3(-0.7, 25, 0));

  const { nodes } = useGLTF("/models/stage.glb");

  // Light Ref
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const ambientLightRef = useRef<THREE.AmbientLight>(null!);
  // useHelper(spotLightRef, THREE.SpotLightHelper, "cyan");

  // CAMERA
  const camX = useMotionValue(camera.position.x);
  const camY = useMotionValue(camera.position.y);
  const camZ = useMotionValue(camera.position.z);

  // CAMERA TARGET
  const targetX = useMotionValue(cameraRefTarget.current.x);
  const targetY = useMotionValue(cameraRefTarget.current.y);
  const targetZ = useMotionValue(cameraRefTarget.current.z);

  // LIGHT POSITION
  const lightX = useMotionValue(spotLightRef.current?.position.x ?? 0);
  const lightY = useMotionValue(spotLightRef.current?.position.y ?? 0);
  const lightZ = useMotionValue(spotLightRef.current?.position.z ?? 0);

  // AMBIENT
  const ambientIntensity = useMotionValue(0);

  const springConfig = {
    stiffness: 120,
    damping: 30,
    mass: 1.4,
  };
  const camXSpring = useSpring(camX, springConfig);
  const camYSpring = useSpring(camY, springConfig);
  const camZSpring = useSpring(camZ, springConfig);

  const targetXSpring = useSpring(targetX, springConfig);
  const targetYSpring = useSpring(targetY, springConfig);
  const targetZSpring = useSpring(targetZ, springConfig);

  const lightXSpring = useSpring(lightX, springConfig);
  const lightYSpring = useSpring(lightY, springConfig);
  const lightZSpring = useSpring(lightZ, springConfig);

  const ambientSpring = useSpring(ambientIntensity, {
    stiffness: 120,
    damping: 22,
  });

  type AnimateShowcasePositionParams = {
    cameraPos: THREE.Vector3;
    cameraTarget: THREE.Vector3;
    lightPosition: THREE.Vector3;
    lightTarget: THREE.Vector3;
    ambientIntensity: number;
  };
  // ANIMATE FUNCTION
  const animateShowcasePosition = ({
    cameraPos,
    cameraTarget,
    lightPosition,
    lightTarget,
    ambientIntensity: ambient,
  }: AnimateShowcasePositionParams) => {
    isCameraAnimating.current = true;

    camX.set(cameraPos.x);
    camY.set(cameraPos.y);
    camZ.set(cameraPos.z);

    targetX.set(cameraTarget.x);
    targetY.set(cameraTarget.y);
    targetZ.set(cameraTarget.z);

    lightX.set(lightPosition.x);
    lightY.set(lightPosition.y);
    lightZ.set(lightPosition.z);

    ambientIntensity.set(ambient);

    window.setTimeout(() => {
      isCameraAnimating.current = false;
    }, 800);
  };

  const nodeOffsets: Record<
    string,
    {
      cameraOffset: THREE.Vector3;
      targetOffset: THREE.Vector3;
      lightOffset: THREE.Vector3;
      lightTargetOffset: THREE.Vector3;
      ambient: number;
    }
  > = {
    truss: {
      cameraOffset: new THREE.Vector3(-20.638, 11.651, -70),
      targetOffset: new THREE.Vector3(-10, -8.349, -1.559),
      lightOffset: new THREE.Vector3(-35.638, -8.349, -6.559),
      lightTargetOffset: new THREE.Vector3(0.362, -43.349, 8.441),
      ambient: 2,
    },
    lineSpeaker: {
      cameraOffset: new THREE.Vector3(11.381, 11.154, -51.682),
      targetOffset: new THREE.Vector3(-2.381, -3.846, -1.682),
      lightOffset: new THREE.Vector3(-26.62, -8.846, -16.682),
      lightTargetOffset: new THREE.Vector3(53.62, -43.846, 8.318),
      ambient: 2,
    },
    lights: {
      cameraOffset: new THREE.Vector3(8.899, -1.68, -26.91),
      targetOffset: new THREE.Vector3(-6.101, -1.68, -1.91),
      lightOffset: new THREE.Vector3(-16.101, -11.68, -6.91),
      lightTargetOffset: new THREE.Vector3(-6.101, -1.68, -1.91),
      ambient: 2,
    },
    fogMachine: {
      cameraOffset: new THREE.Vector3(-3.0, 5.557, -14.458),
      targetOffset: new THREE.Vector3(0, 1, 15.542),
      lightOffset: new THREE.Vector3(-27.678, 5.557, -14.458),
      lightTargetOffset: new THREE.Vector3(37.322, -9.443, 15.542),
      ambient: 0.2,
    },
    subwoofer: {
      cameraOffset: new THREE.Vector3(6.25, 8.854, -20.868),
      targetOffset: new THREE.Vector3(1.25, 6.854, 4.132),
      lightOffset: new THREE.Vector3(16.25, 13.854, -10.868),
      lightTargetOffset: new THREE.Vector3(-28.75, -1.146, 4.132),
      ambient: 2,
    },
    mainScreen: {
      cameraOffset: new THREE.Vector3(-0.473, -15.876, -64.75),
      targetOffset: new THREE.Vector3(-0.473, -15.876, -54.75),
      lightOffset: new THREE.Vector3(-0.473, -15.876, -64.75),
      lightTargetOffset: new THREE.Vector3(-0.473, -15.876, -54.75),
      ambient: 2,
    },
    police: {
      cameraOffset: new THREE.Vector3(-4.946, 7.036, -29.476),
      targetOffset: new THREE.Vector3(-4.946, 7.036, -19.476),
      lightOffset: new THREE.Vector3(-4.946, 7.036, -29.476),
      lightTargetOffset: new THREE.Vector3(-4.946, 7.036, -19.476),
      ambient: 0.5,
    },
    delayTower: {
      cameraOffset: new THREE.Vector3(-24.929, 21.813, -96.309),
      targetOffset: new THREE.Vector3(-0.629, 16.813, -16.309),
      lightOffset: new THREE.Vector3(-0.629, 21.813, -116.309),
      lightTargetOffset: new THREE.Vector3(-0.629, 6.813, -183.691),
      ambient: 1,
    },
    frontFillSpeaker: {
      cameraOffset: new THREE.Vector3(10.15, 5.783, -21.605),
      targetOffset: new THREE.Vector3(0.15, -1.217, -1.605),
      lightOffset: new THREE.Vector3(15.15, 10.783, -16.605),
      lightTargetOffset: new THREE.Vector3(-9.85, -9.217, -1.605),
      ambient: 2,
    },
    stageMonitor: {
      cameraOffset: new THREE.Vector3(10.15, 5.783, -21.605),
      targetOffset: new THREE.Vector3(0.15, -1.217, -1.605),
      lightOffset: new THREE.Vector3(15.15, 10.783, -16.605),
      lightTargetOffset: new THREE.Vector3(-9.85, -9.217, -1.605),
      ambient: 2,
    },
    enstrumants: {
      cameraOffset: new THREE.Vector3(-13.573, 16.194, -38.045),
      targetOffset: new THREE.Vector3(-12, 11.194, -28.045),
      lightOffset: new THREE.Vector3(-32.427, 16.194, -18.045),
      lightTargetOffset: new THREE.Vector3(-17.573, 11.194, -28.045),
      ambient: 0.5,
    },
    sideScreen: {
      cameraOffset: new THREE.Vector3(10, 8, -70),
      targetOffset: new THREE.Vector3(-10, -10, 0),
      lightOffset: new THREE.Vector3(-30, 0, -30),
      lightTargetOffset: new THREE.Vector3(0, 0, 0),
      ambient: 5,
    },
  };

  useEffect(() => {
    if (!nodes || !cameraPos) return;
    if (cameraPos === "idle") {
      animateShowcasePosition({
        cameraPos: new THREE.Vector3(-0.6, 35, -110),
        cameraTarget: new THREE.Vector3(-0.6, 30, 0),
        lightPosition: new THREE.Vector3(0, 0, 0),
        lightTarget: new THREE.Vector3(0, 0, 0),
        ambientIntensity: 0,
      });
      return;
    }
    if (cameraPos === "focused") {
      animateShowcasePosition({
        cameraPos: new THREE.Vector3(-0.6, 35, -110),
        cameraTarget: new THREE.Vector3(-0.6, 30, 0),
        lightPosition: new THREE.Vector3(0, 0, 0),
        lightTarget: new THREE.Vector3(0, 0, 0),
        ambientIntensity: 0,
      });
      return;
    }

    const targetNode = nodes[cameraPos];
    const offsets = nodeOffsets[cameraPos];

    if (!targetNode || !offsets) return;

    const worldPos = new THREE.Vector3();
    targetNode.getWorldPosition(worldPos);

    animateShowcasePosition({
      cameraPos: worldPos.clone().add(offsets.cameraOffset),
      cameraTarget: worldPos.clone().add(offsets.targetOffset),
      lightPosition: worldPos.clone().add(offsets.lightOffset),
      lightTarget: worldPos.clone().add(offsets.lightTargetOffset),
      ambientIntensity: offsets.ambient,
    });
  }, [cameraPos, nodes]);

  useFrame(() => {
    camera.position.set(camXSpring.get(), camYSpring.get(), camZSpring.get());

    cameraRefTarget.current.set(
      targetXSpring.get(),
      targetYSpring.get(),
      targetZSpring.get(),
    );

    spotLightRef.current.position.set(
      lightXSpring.get(),
      lightYSpring.get(),
      lightZSpring.get(),
    );

    spotLightRef.current.target.position.set(
      targetXSpring.get(),
      targetYSpring.get(),
      targetZSpring.get(),
    );

    spotLightRef.current.target.updateMatrixWorld();

    ambientLightRef.current.intensity = ambientSpring.get();

    camera.lookAt(cameraRefTarget.current);
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0} />
      <spotLight
        ref={spotLightRef}
        position={[-30, 15, -30]}
        intensity={8000}
        angle={2}
        penumbra={1}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={500}
      />
    </>
  );
}
