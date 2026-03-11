import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { cfg } from "./config.js";
import {
  loadTexture,
  configureOrnamentTexture,
  configureCapTexture,
  createOrnamentPiece,
  createCapPiece,
} from "./ornament-builders.js";
import { createScene, createCamera, addSceneLights, exposeDebugGlobals } from "./scene-helpers.js";
import { addLettersToGroup } from "./title-helpers.js";
import { createMotionPaths } from "./motion-paths.js";
import {
  makePaperMaterial,
  makeOutlineMaterial,
  buildPaperMesh,
  setInitialPieceTransforms,
  createOutlineGroup,
  createAssemblyGroups,
} from "./scene-construction.js";
import { resetAndBuildTimeline } from "./timeline.js";
import { startRenderLoop, wireRestartButton } from "./runtime.js";

function getContainerSize(containerEl) {
  const width = Math.max(1, containerEl.clientWidth || 0);
  const height = Math.max(1, containerEl.clientHeight || 0);
  return { width, height };
}

function createRendererInContainer(containerEl) {
  const { width, height } = getContainerSize(containerEl);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));

  containerEl.appendChild(renderer.domElement);
  return renderer;
}

function attachContainerResizeHandler({ containerEl, renderer, camera }) {
  let rafId = null;

  const resize = () => {
    const { width, height } = getContainerSize(containerEl);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const scheduleResize = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      resize();
    });
  };

  scheduleResize();

  const ro = new ResizeObserver(scheduleResize);
  ro.observe(containerEl);
  window.addEventListener("resize", scheduleResize);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", scheduleResize);
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  };
}

function ensureMountContainerStyles(containerEl) {
  if (getComputedStyle(containerEl).position === "static") {
    containerEl.style.position = "relative";
  }
  if (!containerEl.style.overflow) {
    containerEl.style.overflow = "hidden";
  }
  if (!containerEl.style.background) {
    containerEl.style.background = "#0b0b0c";
  }
}

function createUI({ containerEl, onRestart }) {
  const ui = document.createElement("div");
  ui.setAttribute("data-splash-ui", "true");
  ui.style.position = "absolute";
  ui.style.left = "12px";
  ui.style.top = "12px";
  ui.style.zIndex = "10";
  ui.style.color = "#ddd";
  ui.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ui.style.fontSize = "12px";
  ui.style.background = "rgba(0, 0, 0, 0.35)";
  ui.style.padding = "10px 12px";
  ui.style.borderRadius = "10px";
  ui.style.lineHeight = "1.3";
  ui.style.userSelect = "none";

  const title = document.createElement("div");
  title.innerHTML = "<b>Paper Cutout Assembly</b>";
  ui.appendChild(title);

  const subtitle = document.createElement("div");
  subtitle.textContent = "Three.js + GSAP • 6.0s timeline";
  ui.appendChild(subtitle);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Restart";
  btn.style.marginTop = "8px";
  btn.style.padding = "6px 10px";
  btn.style.borderRadius = "8px";
  btn.style.border = "1px solid rgba(255, 255, 255, 0.2)";
  btn.style.background = "#111";
  btn.style.color = "#ddd";
  btn.style.cursor = "pointer";
  btn.onmouseenter = () => {
    btn.style.background = "#171717";
  };
  btn.onmouseleave = () => {
    btn.style.background = "#111";
  };

  ui.appendChild(btn);
  containerEl.appendChild(ui);

  const unwire = wireRestartButton({ buttonEl: btn, onRestart });
  return { uiEl: ui, unwire };
}

export function mountSplashAnimation(containerEl, options = {}) {
  if (!(containerEl instanceof HTMLElement)) {
    throw new Error("mountSplashAnimation(containerEl) requires a DOM element container.");
  }

  const { showUI = true, timeScale = 0.5, debugGlobals = false } = options;

  ensureMountContainerStyles(containerEl);

  const root = document.createElement("div");
  root.setAttribute("data-splash-root", "true");
  root.style.position = "absolute";
  root.style.inset = "0";
  root.style.width = "100%";
  root.style.height = "100%";
  containerEl.appendChild(root);

  const { leftCurve, rightCurve, capCurve } = createMotionPaths();

  const scene = createScene();
  const camera = createCamera();
  const renderer = createRendererInContainer(root);

  addSceneLights(scene);

  const ornamentTextureALeft = configureOrnamentTexture(
    loadTexture(new URL("./mahoneyCardALeft.png", import.meta.url).href),
  );
  const ornamentTextureARight = configureOrnamentTexture(
    loadTexture(new URL("./mahoneyCardARight.png", import.meta.url).href),
  );
  const ornamentTextureBLeft = configureOrnamentTexture(
    loadTexture(new URL("./mahoneyCardBLeft.png", import.meta.url).href),
  );
  const ornamentTextureBRight = configureOrnamentTexture(
    loadTexture(new URL("./mahoneyCardBRight.png", import.meta.url).href),
  );
  const capTexture = configureCapTexture(
    loadTexture(new URL("./mahoneyCardCap.png", import.meta.url).href),
  );

  const paperMat = makePaperMaterial();
  const outlineMat = makeOutlineMaterial();

  const paperMesh = buildPaperMesh({ paperMat });
  scene.add(paperMesh);

  const leftOrnamentPiece = createOrnamentPiece({
    frontTexture: ornamentTextureALeft,
    backTexture: ornamentTextureBRight,
    ornamentRadius: cfg.geom.ornamentRadius,
  });

  const rightOrnamentPiece = createOrnamentPiece({
    frontTexture: ornamentTextureARight,
    backTexture: ornamentTextureBLeft,
    ornamentRadius: cfg.geom.ornamentRadius,
  });

  const capPiece = createCapPiece({
    texture: capTexture,
    capRadius: cfg.geom.capRadius,
    ornamentRadius: cfg.geom.ornamentRadius,
  });

  setInitialPieceTransforms({ leftOrnamentPiece, rightOrnamentPiece, capPiece });
  scene.add(leftOrnamentPiece.group, rightOrnamentPiece.group, capPiece.mesh);

  const outlineGroup = createOutlineGroup({
    leftOrnamentPiece,
    rightOrnamentPiece,
    capPiece,
    outlineMat,
  });
  scene.add(outlineGroup);
  const outlineMats = outlineGroup.children.map((line) => line.material);

  const { ornamentAssemblyGroup: assemblyGroup, titleLetterGroup: letterGroup } = createAssemblyGroups({
    scene,
  });

  if (debugGlobals) {
    exposeDebugGlobals({ scene, camera, assemblyGroup });
  }

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
  tl.timeScale(timeScale);

  const stopRenderLoop = startRenderLoop({ renderer, scene, camera });
  const detachResize = attachContainerResizeHandler({ containerEl: root, renderer, camera });

  const ui = showUI
    ? createUI({
        containerEl: root,
        onRestart: () => {
          tl = resetAndBuildTimeline(deps);
          tl.timeScale(timeScale);
        },
      })
    : null;

  return {
    scene,
    camera,
    renderer,
    timeline: () => tl,
    unmount: () => {
      ui?.unwire?.();
      ui?.uiEl?.remove();
      detachResize?.();
      stopRenderLoop?.();

      renderer.dispose();
      root.remove();
    },
  };
}

export default mountSplashAnimation;
