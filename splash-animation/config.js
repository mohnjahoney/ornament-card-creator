import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// --------------------------------------------------
// Small math helpers
// --------------------------------------------------

export const deg = (d) => d * Math.PI / 180;

// --------------------------------------------------
// Core dimensions
// --------------------------------------------------
export const ornamentRadius = 1.6;
export const capRadius = 0.45 * ornamentRadius;

export const paperWidth = 7.0;
export const paperHeight = 5.0;
export const paperThickness = 0.06;

export const liftHeight = 0.5 * ornamentRadius;
export const assemblyZ = 1 * ornamentRadius;

// --------------------------------------------------
// Key positions
// --------------------------------------------------
export const ornamentFinalPosition = new THREE.Vector3(0, 0, assemblyZ);

export const rightAssemblyApproachPosition = new THREE.Vector3(
  0,
  1.4 * ornamentRadius,
  assemblyZ
);

export const leftAssemblyApproachPosition = new THREE.Vector3(
  rightAssemblyApproachPosition.x,
  -rightAssemblyApproachPosition.y + 0.3 * ornamentRadius,
  rightAssemblyApproachPosition.z
);

export const capAssemblyApproachPosition = new THREE.Vector3(
  0,
  2 * ornamentRadius,
  assemblyZ
);

export const capFinalPosition = new THREE.Vector3(
  0,
  0.96 * ornamentRadius,
  assemblyZ
);

export const titleAnchorPosition = new THREE.Vector3(0, 0, assemblyZ);

export const leftStartPosition = new THREE.Vector3(-1.1 * ornamentRadius, 0, 0);
export const rightStartPosition = new THREE.Vector3(+1.1 * ornamentRadius, 0, 0);
export const capStartPosition = new THREE.Vector3(0, 1.3 * ornamentRadius, 0);

export const leftLiftedPosition = leftStartPosition.clone().add(
  new THREE.Vector3(-0.1 * ornamentRadius, -0.05 * ornamentRadius, liftHeight)
);

export const rightLiftedPosition = rightStartPosition.clone().add(
  new THREE.Vector3(+0.1 * ornamentRadius, -0.05 * ornamentRadius, liftHeight)
);

export const capLiftedPosition = capStartPosition.clone().add(
  new THREE.Vector3(0, +0.05 * ornamentRadius, liftHeight)
);

export const leftCurveControl = new THREE.Vector3(
  -0.6 * ornamentRadius,
  -1.8 * ornamentRadius,
  liftHeight + 0.4 * ornamentRadius
);

export const rightCurveControl = new THREE.Vector3(
  +0.6 * ornamentRadius,
  +1.8 * ornamentRadius,
  liftHeight + 0.4 * ornamentRadius
);

export const capCurveControl = new THREE.Vector3(
  0,
  +2.2 * ornamentRadius,
  liftHeight + 0.6 * ornamentRadius
);

// --------------------------------------------------
// Rotation totals
// --------------------------------------------------
export const leftYawTotal = deg(585);
export const rightYawTotal = deg(135);
export const capPitchTotal = deg(450);
export const groupYawTotal = deg(360);

// --------------------------------------------------
// Timeline phase boundaries
// --------------------------------------------------
export const tA0 = 0.00, tA1 = 0.60;
export const tB0 = 0.60, tB1 = 1.20;
export const tC0 = 1.20, tC1 = 1.80;
export const tD0 = 1.80, tD1 = 3.20;
export const tE0 = 3.20, tE1 = 3.60;
export const tF0 = 3.20, tF1 = 4.00;
export const tG0 = 4.00, tG1 = 4.60;
export const tH0 = 4.60, tH1 = 5.00;
export const tI0 = 5.00, tI1 = 6.00;
export const tJ0 = 6.00, tJ1 = 7.00;
export const tK0 = 7.00, tK1 = 100.00;

// --------------------------------------------------
// Title / letter config
// --------------------------------------------------
export const titleLetters = ["r", "n", "a", "m", "e", "n", "t", " ", "M", "a", "k", "e", "r"];

export const letterCfg = {
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
};