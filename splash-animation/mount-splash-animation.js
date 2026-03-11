
// -------------------------
// Imports
// -------------------------
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";

// Import all of these things from the config.
// Careful with mutable things like Vector3s
import { cfg, titleLetters } from "./config.js";


import {
    loadTexture,
    configureOrnamentTexture,
    configureCapTexture,
    extrudeShape,
    createOrnamentPiece,
    createCapPiece
} from "./ornament-builders.js";

import {
    createScene,
    createRenderer,
    createCamera,
    addSceneLights,
    exposeDebugGlobals
} from "./scene-helpers.js";

import {
    measureLetterWidth,
    makeLetterSprite,
    computeLetterLayout,
    addLettersToGroup,
} from "./title-helpers.js"

import { createMotionPaths } from "./motion-paths.js";
import {
    makePaperMaterial,
    makeOutlineMaterial,
    buildPaperMesh,
    setInitialPieceTransforms,
    createOutlineGroup,
    createAssemblyGroups,
} from "./scene-construction.js";

import { startRenderLoop, attachResizeHandler, wireRestartButton } from "./runtime.js";






// -------------------------
// Scene construction helpers
// -------------------------






// -------------------------
// Motion path helpers
// -------------------------

const { leftCurve, rightCurve, capCurve } = createMotionPaths();

// -------------------------
// Reparent helper (preserve world transform)
// -------------------------



// -------------------------
// Timeline helpers
// -------------------------








// -------------------------
// Storyboard
// -------------------------

// Scene
const scene = createScene();
// scene.background = new THREE.Color(0xfaf7f0);
const renderer = createRenderer();
// const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
// camera.position.set(0, 0.6, 10);
const camera = createCamera();

// Lights
addSceneLights(scene);

// Textures
const ornamentTextureALeft = configureOrnamentTexture(loadTexture("mahoneyCardALeft.png"));
const ornamentTextureARight = configureOrnamentTexture(loadTexture("mahoneyCardARight.png"));
const ornamentTextureBLeft = configureOrnamentTexture(loadTexture("mahoneyCardBLeft.png"));
const ornamentTextureBRight = configureOrnamentTexture(loadTexture("mahoneyCardBRight.png"));
const capTexture = configureCapTexture(loadTexture("mahoneyCardCap.png"));

// Materials
const paperMat = makePaperMaterial();
const outlineMat = makeOutlineMaterial();

// Paper
const paperMesh = buildPaperMesh({ paperMat });
scene.add(paperMesh);

// Pieces
const leftOrnamentPiece = createOrnamentPiece({
    frontTexture: ornamentTextureALeft,
    backTexture: ornamentTextureBRight,
    ornamentRadius: cfg.geom.ornamentRadius,
    // thickness: paperThickness
});

const rightOrnamentPiece = createOrnamentPiece({
    frontTexture: ornamentTextureARight,
    backTexture: ornamentTextureBLeft,
    ornamentRadius: cfg.geom.ornamentRadius,
    // thickness: paperThickness
});

const capPiece = createCapPiece({
    texture: capTexture,
    capRadius: cfg.geom.capRadius,
    ornamentRadius: cfg.geom.ornamentRadius,
    // thickness: paperThickness
});

setInitialPieceTransforms({
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece
}
);
scene.add(leftOrnamentPiece.group, rightOrnamentPiece.group, capPiece.mesh);

// Outlines
const outlineGroup = createOutlineGroup({
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece,
    outlineMat
});
scene.add(outlineGroup);


// Collect outline materials for fading
const outlineMats = outlineGroup.children.map(line => line.material);

// Groups
const {
    ornamentAssemblyGroup: assemblyGroup,
    titleLetterGroup: letterGroup
} = createAssemblyGroups({ scene });

// Debug
exposeDebugGlobals({
    scene,
    camera,
    assemblyGroup
});

// Timeline
const tlRef = { current: null };
const movingTitlePoint = new THREE.Vector3(0, 0, cfg.geom.assemblyZ);
const deps = {
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece,
    paperMesh,
    paperMat,
    assemblyGroup,
    letterGroup,
    outlineGroup,
    outlineMats,
    scene,
    leftCurve,
    rightCurve,
    capCurve,
    movingTitlePoint,
    addLettersToGroup,
    tlRef,
};
let tl = resetAndBuildTimeline(deps);
tl.timeScale(0.5);

// Connect UI

wireRestartButton({
    buttonEl: document.getElementById("restart"),
    onRestart: () => {
        tl = resetAndBuildTimeline(deps);
        tl.timeScale(0.5);
    },
});

// Render

startRenderLoop({ renderer, scene, camera });

// Handle resize

attachResizeHandler({ renderer, camera });