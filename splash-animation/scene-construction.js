import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { cfg } from "./config.js";

function makePaperMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xfaf7f0,
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
  });
}

function makeOutlineMaterial() {
  return new THREE.LineBasicMaterial({
    color: 0x222222,
    transparent: true,
    opacity: 0.0,
  });
}

function lineFromShape({ shape, outlineMat }) {
  const pts = shape.getPoints(128);
  const geo = new THREE.BufferGeometry().setFromPoints(
    pts.map((p) => new THREE.Vector3(p.x, p.y, 0.001))
  );
  return new THREE.LineLoop(geo, outlineMat.clone());
}

function buildPaperMesh({ paperMat }) {
  const paperGeo = new THREE.PlaneGeometry(
    cfg.geom.paperWidth,
    cfg.geom.paperHeight,
    1,
    1
  );
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  paperMesh.position.set(0, 0.3 * cfg.geom.ornamentRadius, 0);
  return paperMesh;
}

function setInitialPieceTransforms({ leftOrnamentPiece, rightOrnamentPiece, capPiece }) {
  leftOrnamentPiece.group.position.copy(cfg.pts.leftStart);
  rightOrnamentPiece.group.position.copy(cfg.pts.rightStart);
  capPiece.mesh.position.copy(cfg.pts.capStart);

  leftOrnamentPiece.group.rotation.set(0, 0, 0);
  rightOrnamentPiece.group.rotation.set(0, 0, 0);
  capPiece.mesh.rotation.set(0, 0, 0);
}

function createOutlineGroup({
  leftOrnamentPiece,
  rightOrnamentPiece,
  capPiece,
  outlineMat,
}) {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  const leftCircleOutline = lineFromShape({
    shape: leftOrnamentPiece.circleShape,
    outlineMat,
  });
  const leftBumpOutline = lineFromShape({
    shape: leftOrnamentPiece.bumpShape,
    outlineMat,
  });
  leftCircleOutline.position.copy(cfg.pts.leftStart);
  leftBumpOutline.position.copy(cfg.pts.leftStart);

  const rightCircleOutline = lineFromShape({
    shape: rightOrnamentPiece.circleShape,
    outlineMat,
  });
  const rightBumpOutline = lineFromShape({
    shape: rightOrnamentPiece.bumpShape,
    outlineMat,
  });
  rightCircleOutline.position.copy(cfg.pts.rightStart);
  rightBumpOutline.position.copy(cfg.pts.rightStart);

  const capOutline = lineFromShape({ shape: capPiece.shape, outlineMat });
  capOutline.position.copy(cfg.pts.capStart);

  group.add(
    leftCircleOutline,
    leftBumpOutline,
    rightCircleOutline,
    rightBumpOutline,
    capOutline
  );

  return group;
}

function createAssemblyGroups({ scene }) {
  const ornamentAssemblyGroup = new THREE.Group();
  const titleLetterGroup = new THREE.Group();

  ornamentAssemblyGroup.position.copy(cfg.pts.ornamentFinal);

  scene.add(ornamentAssemblyGroup);
  scene.add(titleLetterGroup);

  return { ornamentAssemblyGroup, titleLetterGroup };
}

export {
  makePaperMaterial,
  makeOutlineMaterial,
  buildPaperMesh,
  setInitialPieceTransforms,
  lineFromShape,
  createOutlineGroup,
  createAssemblyGroups,
};