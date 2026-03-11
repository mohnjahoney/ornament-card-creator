
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


import {
    ornamentRadius,
    capRadius,
    paperWidth,
    paperHeight,
    paperThickness,
    liftHeight,
    assemblyZ,
    ornamentFinalPosition,
    rightAssemblyApproachPosition,
    leftAssemblyApproachPosition,
    capAssemblyApproachPosition,
    capFinalPosition,
    titleAnchorPosition,
    leftStartPosition,
    rightStartPosition,
    capStartPosition,
    leftLiftedPosition,
    rightLiftedPosition,
    capLiftedPosition,
    leftCurveControl,
    rightCurveControl,
    capCurveControl,
    leftYawTotal,
    rightYawTotal,
    capPitchTotal,
    groupYawTotal,
    tA0, tA1,
    tB0, tB1,
    tC0, tC1,
    tD0, tD1,
    tE0, tE1,
    tF0, tF1,
    tG0, tG1,
    tH0, tH1,
    tI0, tI1,
    tJ0, tJ1,
    tK0, tK1,
    titleLetters,
    letterCfg
} from "./config.js";

function makePaperMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0xfaf7f0,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true
    });
}


function lineFromShape(shape) {
    const pts = shape.getPoints(128);
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, p.y, 0.001)));
    return new THREE.LineLoop(geo, outlineMat.clone());
}

function buildPaperMesh() {
    const paperGeo = new THREE.PlaneGeometry(paperWidth, paperHeight, 1, 1);
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.position.set(0, 0.3 * ornamentRadius, 0);
    return paperMesh;
}

function setInitialPieceTransforms({
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece
}) {
    leftOrnamentPiece.group.position.copy(leftStartPosition);
    rightOrnamentPiece.group.position.copy(rightStartPosition);
    capPiece.mesh.position.copy(capStartPosition);

    leftOrnamentPiece.group.rotation.set(0, 0, 0);
    rightOrnamentPiece.group.rotation.set(0, 0, 0);
    capPiece.mesh.rotation.set(0, 0, 0);
}


function createOutlineGroup({
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece
}) {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    const leftCircleOutline = lineFromShape(leftOrnamentPiece.circleShape);
    const leftBumpOutline = lineFromShape(leftOrnamentPiece.bumpShape);
    leftCircleOutline.position.copy(leftStartPosition);
    leftBumpOutline.position.copy(leftStartPosition);

    const rightCircleOutline = lineFromShape(rightOrnamentPiece.circleShape);
    const rightBumpOutline = lineFromShape(rightOrnamentPiece.bumpShape);
    rightCircleOutline.position.copy(rightStartPosition);
    rightBumpOutline.position.copy(rightStartPosition);

    const capOutline = lineFromShape(capPiece.shape);
    capOutline.position.copy(capStartPosition);

    group.add(
        leftCircleOutline,
        leftBumpOutline,
        rightCircleOutline,
        rightBumpOutline,
        capOutline
    );

    return group;
}

function createAssemblyGroups() {
    const ornamentAssemblyGroup = new THREE.Group();
    const titleLetterGroup = new THREE.Group();

    ornamentAssemblyGroup.position.copy(ornamentFinalPosition);

    scene.add(ornamentAssemblyGroup);
    scene.add(titleLetterGroup);

    return {
        ornamentAssemblyGroup,
        titleLetterGroup
    };
}