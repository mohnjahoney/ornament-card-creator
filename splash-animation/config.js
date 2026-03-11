import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// --------------------------------------------------
// Small math helpers
// --------------------------------------------------

export const deg = (d) => d * Math.PI / 180;

// --------------------------------------------------
// Single nested config object
// --------------------------------------------------

const ornamentRadius = 1.6;
const capRadius = 0.45 * ornamentRadius;

const paperWidth = 7.0;
const paperHeight = 5.0;
const paperThickness = 0.06;

const liftHeight = 0.5 * ornamentRadius;
const assemblyZ = 1 * ornamentRadius;

const leftStartPoint = new THREE.Vector3(-1.1 * ornamentRadius, 0, 0);
const rightStartPoint = new THREE.Vector3(+1.1 * ornamentRadius, 0, 0);
const capStartPoint = new THREE.Vector3(0, 1.3 * ornamentRadius, 0);

const ornamentFinalPoint = new THREE.Vector3(0, 0, assemblyZ);

const rightAssemblyApproachPoint = new THREE.Vector3(
  0,
  1.4 * ornamentRadius,
  assemblyZ
);

const leftAssemblyApproachPoint = new THREE.Vector3(
  rightAssemblyApproachPoint.x,
  -rightAssemblyApproachPoint.y + 0.3 * ornamentRadius,
  rightAssemblyApproachPoint.z
);

const capAssemblyApproachPoint = new THREE.Vector3(
  0,
  2 * ornamentRadius,
  assemblyZ
);

const capFinalPoint = new THREE.Vector3(
  0,
  0.96 * ornamentRadius,
  assemblyZ
);

const leftLiftedPoint = leftStartPoint.clone().add(
  new THREE.Vector3(-0.1 * ornamentRadius, -0.05 * ornamentRadius, liftHeight)
);

const rightLiftedPoint = rightStartPoint.clone().add(
  new THREE.Vector3(+0.1 * ornamentRadius, -0.05 * ornamentRadius, liftHeight)
);

const capLiftedPoint = capStartPoint.clone().add(
  new THREE.Vector3(0, +0.05 * ornamentRadius, liftHeight)
);

const leftCurveControlPoint = new THREE.Vector3(
  -0.6 * ornamentRadius,
  -1.8 * ornamentRadius,
  liftHeight + 0.4 * ornamentRadius
);

const rightCurveControlPoint = new THREE.Vector3(
  +0.6 * ornamentRadius,
  +1.8 * ornamentRadius,
  liftHeight + 0.4 * ornamentRadius
);

const capCurveControlPoint = new THREE.Vector3(
  0,
  +2.2 * ornamentRadius,
  liftHeight + 0.6 * ornamentRadius
);

export const cfg = {
  geom: {
    ornamentRadius,
    capRadius,
    paperWidth,
    paperHeight,
    paperThickness,
    liftHeight,
    assemblyZ,
  },

  pts: {
    leftStart: leftStartPoint,
    rightStart: rightStartPoint,
    capStart: capStartPoint,

    leftLifted: leftLiftedPoint,
    rightLifted: rightLiftedPoint,
    capLifted: capLiftedPoint,

    ornamentFinal: ornamentFinalPoint,
    capFinal: capFinalPoint,

    rightAssemblyApproach: rightAssemblyApproachPoint,
    leftAssemblyApproach: leftAssemblyApproachPoint,
    capAssemblyApproach: capAssemblyApproachPoint,

    leftCurveControl: leftCurveControlPoint,
    rightCurveControl: rightCurveControlPoint,
    capCurveControl: capCurveControlPoint,
  },

  rot: {
    leftYawTotal: deg(585),
    rightYawTotal: deg(135),
    capPitchTotal: deg(450),
    groupYawTotal: deg(360),
  },

  timeline: {
    blankCard: { start: 0.0, duration: 0.6 },
    revealCutLines: { start: 0.6, duration: 0.6 },
    liftPieces: { start: 1.2, duration: 0.6 },
    movePiecesToAssembly: { start: 1.8, duration: 1.4 },
    settleOrnamentHalves: { start: 3.2, duration: 0.4 },
    moveCapToAssembly: { start: 3.2, duration: 0.8 },
    rotateCap: { start: 4.0, duration: 0.6 },
    settleCap: { start: 4.6, duration: 0.4 },
    slideTitleAndAssemble: { start: 5.0, duration: 1.0 },
    easeSpin: { start: 6.0, duration: 1.0 },
    infiniteSpin: { start: 7.0, duration: 999 },
  },

  letters: {
    baselineY: 0,
    finalZ: assemblyZ + 0.02,

    sequenceStart: 5.0,
    flightDuration: 0.2,
    launchDelay: 0.1,

    startScale: 3.0,
    finalScale: 3.0,
    arcHeight: 1,

    spacing: 0.7,
    widthScale: 0.0042,
    tracking: 0.0,
    wordGapExtra: 0.0,

    spawnOffsetX: 0.10,
    spawnOffsetY: 0,
    spawnOffsetZ: -0.35,
  },
};

// --------------------------------------------------
// Title letters
// --------------------------------------------------

export const titleLetters = ["r", "n", "a", "m", "e", "n", "t", " ", "M", "a", "k", "e", "r"];