import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { cfg } from "./config.js";

function createMotionPaths() {
  const leftCurve = new THREE.QuadraticBezierCurve3(
    cfg.pts.leftLifted.clone(),
    cfg.pts.leftCurveControl.clone(),
    cfg.pts.leftAssemblyApproach.clone()
  );

  const rightCurve = new THREE.QuadraticBezierCurve3(
    cfg.pts.rightLifted.clone(),
    cfg.pts.rightCurveControl.clone(),
    cfg.pts.rightAssemblyApproach.clone()
  );

  const capCurve = new THREE.QuadraticBezierCurve3(
    cfg.pts.capLifted.clone(),
    cfg.pts.capCurveControl.clone(),
    cfg.pts.capAssemblyApproach.clone()
  );

  return { leftCurve, rightCurve, capCurve };
}

export { createMotionPaths };

