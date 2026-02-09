import PartAniShowcase from "./PartAniShowcase";
import PartShowCase from "./PartShowcase";
import * as THREE from "three";

export default function PartCompiler() {
  type partArrayType = {
    objectName: string;
    header: string;
    detail: string;
    offset: THREE.Vector3;
    distanceFactor: number;
  };

  const partArray: partArrayType[] = [
    {
      objectName: "truss",
      header: "Truss",
      detail:
        "The main structural system of the stage. It securely supports lighting, audio, and screen equipment. Designed and installed with proper load calculations for maximum safety.",
      offset: new THREE.Vector3(-26, 1, 0),
      distanceFactor: 30,
    },
    {
      objectName: "lineSpeaker",
      header: "Line Speaker",
      detail:
        "The primary sound system delivering clear, balanced audio across the venue, adjusted to the space’s acoustic requirements.",
      offset: new THREE.Vector3(-26.5, 6, 0),
      distanceFactor: 30,
    },
    {
      objectName: "fogMachine",
      header: "Fog Machine",
      detail:
        "Enhances lighting effects by creating controlled atmospheric haze, as one example of stage effects equipment.",
      offset: new THREE.Vector3(-6.5, 1.5, 0),
      distanceFactor: 6,
    },
    {
      objectName: "subwoofer",
      header: "Subwoofer",
      detail:
        "Responsible for delivering powerful low-frequency sound. Adds depth and impact to the music and is positioned for optimal bass coverage.",
      offset: new THREE.Vector3(-8, 7.5, 0),
      distanceFactor: 10,
    },
    {
      objectName: "mainScreen",
      header: "Main Screen",
      detail:
        "The central visual display of the stage, used for live feeds and dynamic visual content.",
      offset: new THREE.Vector3(-24, 1, 0),
      distanceFactor: 30,
    },
    {
      objectName: "police",
      header: "Front of Stage Barriers",
      detail:
        "Safety barriers installed at the front of the stage. They create a secure separation between performers and the audience while maintaining clear visibility.",
      offset: new THREE.Vector3(-15, 4, 0),
      distanceFactor: 13,
    },
    {
      objectName: "delayTower",
      header: "Delay Tower",
      detail:
        "Additional speaker towers placed further from the stage. Ensure consistent sound coverage and timing for large or extended venues.",
      offset: new THREE.Vector3(-30, 30, 0),
      distanceFactor: 30,
    },
    {
      objectName: "frontFillSpeaker",
      header: "Front Fill Speaker",
      detail:
        "Speakers placed at the front of the stage to cover the nearest audience areas. Improve sound clarity for attendees close to the stage.",
      offset: new THREE.Vector3(-11.5, 1, 0),
      distanceFactor: 13,
    },
    {
      objectName: "stageMonitor",
      header: "Stage Monitor",
      detail:
        "Speakers positioned on stage for performers. Allow artists to clearly hear themselves and other performers during the show.",
      offset: new THREE.Vector3(-11.5, 1, 0),
      distanceFactor: 13,
    },
    {
      objectName: "enstrumants",
      header: "Instrumants",
      detail:
        "Professional instruments provided based on musicians needs, set up for optimal performance.",
      offset: new THREE.Vector3(-22, 6, 5),
      distanceFactor: 17,
    },
    {
      objectName: "sideScreen",
      header: "Side Screen",
      detail:
        "Additional screens positioned on the sides of the stage. Improve visibility for audiences farther from the center.",
      offset: new THREE.Vector3(-26, 0, 0),
      distanceFactor: 30,
    },
    {
      objectName: "lights",
      header: "Lights",
      detail:
        "Professional lighting systems designed to enhance the stage atmosphere. Synchronized with the performance to create dynamic and immersive visuals.",
      offset: new THREE.Vector3(-14, 1.5, 0),
      distanceFactor: 15,
    },
  ];
  const aniArray = [
    ["light1Bot", "lights"],
    ["light1Top", "lights"],
    ["light2Bot", "lights"],
    ["light2Top", "lights"],
    ["light3Bot", "lights"],
    ["light3Top", "lights"],
  ];
  return (
    <>
      {partArray.map((part) => (
        <PartShowCase
          key={part.objectName}
          objectName={part.objectName}
          header={part.header}
          detail={part.detail}
          offset={part.offset}
          distanceFactor={part.distanceFactor}
        />
      ))}
      {aniArray.map((part) => (
        <PartAniShowcase name={part[0]} aniKey={part[1]} key={part[0]} />
      ))}
    </>
  );
}
