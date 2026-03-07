import * as THREE from "three";
import { titleAnimConfig as cfg } from "./titleAnimConfig.ts";

// --------------------------------------------------
// EASING
// --------------------------------------------------

function easeInOutQuad(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number, s = 1.70158): number {
  const x = t - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
}

const easingMap: Record<string, Function> = {
  easeInOutQuad,
  easeOutCubic,
  easeOutBack,
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// --------------------------------------------------
// TEXT SPRITE
// --------------------------------------------------
function makeLetterSprite(char: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = cfg.textStyle.canvasSize;
  canvas.height = cfg.textStyle.canvasSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create 2D canvas context");
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = cfg.textStyle.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${cfg.textStyle.fontWeight} ${cfg.textStyle.fontSizePx}px ${cfg.textStyle.fontFamily}`;
  ctx.fillText(char, canvas.width / 2, canvas.height / 2 + 8);

  const measuredWidthPx = ctx.measureText(char).width;
  const glyphWidthWorld = measuredWidthPx * cfg.letters.widthScale;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);

  sprite.userData.glyphWidthWorld = glyphWidthWorld;
  sprite.userData.measuredWidthPx = measuredWidthPx;
  sprite.userData.char = char;

  sprite.scale.set(
    cfg.letters.finalScale,
    cfg.letters.finalScale,
    1
  );

  
  return sprite;
}

function measureGlyphWidth(char: string): number {
  const canvas = document.createElement("canvas");
  canvas.width = cfg.textStyle.canvasSize;
  canvas.height = cfg.textStyle.canvasSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create 2D canvas context");
  }

  ctx.font = `${cfg.textStyle.fontWeight} ${cfg.textStyle.fontSizePx}px ${cfg.textStyle.fontFamily}`;

  return ctx.measureText(char).width;
}

// --------------------------------------------------
// ANIMATION CLASS
// --------------------------------------------------

export class TitleAnim {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  ornament: THREE.Mesh;
  letters: THREE.Sprite[] = [];

  startTime: number | null = null;

  constructor(container: HTMLElement) {

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.camera.position.z = 8;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    // Ornament
    const geometry = new THREE.CircleGeometry(cfg.ornament.radius, 64);

    const material = new THREE.MeshBasicMaterial({
      color: 0xcc3333
    });

    this.ornament = new THREE.Mesh(geometry, material);

    const start = cfg.ornament.startPosition;

    this.ornament.position.set(start.x, start.y, start.z);

    this.scene.add(this.ornament);

    // Letters
    this.createLetters();

    requestAnimationFrame(this.animate);
  }

  // --------------------------------------------------
  // CREATE LETTERS
  // --------------------------------------------------
  createLetters() {
    let cursorX = cfg.ornament.finalPosition.x + cfg.ornament.radius * 1.15;
  
    for (const ch of cfg.title.letters) {
      if (ch === " ") {
        const spaceWidthWorld =
          measureGlyphWidth(" ") * cfg.letters.widthScale + cfg.letters.wordGapExtra;
  
        cursorX += spaceWidthWorld;
        continue;
      }
  
      const sprite = makeLetterSprite(ch);
      const glyphWidthWorld = sprite.userData.glyphWidthWorld;
  
      const target = new THREE.Vector3(
        cursorX + glyphWidthWorld * 0.5,
        cfg.letters.baselineY,
        0
      );
  
      sprite.userData.target = target;
  
      const spawn = cfg.letters.spawnOffset;
      sprite.position.set(
        cfg.ornament.finalPosition.x + spawn.x,
        spawn.y,
        spawn.z
      );
  
      // animated start scale
      sprite.scale.setScalar(cfg.letters.startScale);
  
      (sprite.material as THREE.SpriteMaterial).opacity = 0;
  
      this.scene.add(sprite);
      this.letters.push(sprite);
  
      cursorX += glyphWidthWorld + cfg.letters.tracking;
    }
  }

  // --------------------------------------------------
  // ORNAMENT MOTION
  // --------------------------------------------------

  animateOrnament(elapsed: number) {

    const moveDuration = cfg.timing.ornamentMoveDuration;

    if (elapsed <= moveDuration) {

      const t = clamp01(elapsed / moveDuration);

      const eased = easingMap[cfg.ornament.moveEase](t);

      const start = cfg.ornament.startPosition;
      const end = cfg.ornament.finalPosition;

      this.ornament.position.set(
        THREE.MathUtils.lerp(start.x, end.x, eased),
        THREE.MathUtils.lerp(start.y, end.y, eased),
        THREE.MathUtils.lerp(start.z, end.z, eased)
      );

      return;
    }

    // Spin

    const spinElapsed = elapsed - moveDuration;

    const spinDuration = cfg.timing.ornamentSpinDuration;

    const t = clamp01(spinElapsed / spinDuration);

    const eased = easingMap[cfg.ornament.spinEase](t);

    const spins = cfg.ornament.totalSpins;

    const angle = spins * Math.PI * 2 * (1 - eased);

    this.ornament.rotation[cfg.ornament.spinAxis] = angle;
  }

  // --------------------------------------------------
  // LETTER MOTION
  // --------------------------------------------------

  animateLetter(letter: THREE.Sprite, elapsed: number, index: number) {

    const launch =
      cfg.letters.sequenceStart +
      index * cfg.letters.launchDelay;

    const duration = cfg.letters.flightDuration;

    const localT = clamp01((elapsed - launch) / duration);

    if (localT <= 0) return;

    const target = letter.userData.target;

    const spawnX = cfg.ornament.finalPosition.x + cfg.letters.spawnOffset.x;

    const xEase = easingMap[cfg.letters.horizontalEase](localT);

    const zEase = easingMap[cfg.letters.depthEase](localT);

    const arc = Math.sin(localT * Math.PI) * cfg.letters.arcHeight;

    letter.position.x = THREE.MathUtils.lerp(
      spawnX,
      target.x,
      xEase
    );

    letter.position.y = target.y + arc;

    letter.position.z = THREE.MathUtils.lerp(
      cfg.letters.spawnOffset.z,
      0,
      zEase
    );

    const scaleEase = easingMap[cfg.letters.scaleEase](
      localT,
      cfg.letters.scaleOvershoot
    );

    const s = THREE.MathUtils.lerp(
      cfg.letters.startScale,
      cfg.letters.finalScale,
      scaleEase
    );

    letter.scale.setScalar(s);
    
    const mat = letter.material as THREE.SpriteMaterial;

    mat.opacity = clamp01(localT / cfg.letters.fadeInPortion);
  }

  // --------------------------------------------------
  // MAIN LOOP
  // --------------------------------------------------

  animate = (time: number) => {

    if (!this.startTime) this.startTime = time;

    const elapsed = time - this.startTime;

    this.animateOrnament(elapsed);

    this.letters.forEach((letter, i) =>
      this.animateLetter(letter, elapsed, i)
    );

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate);
  };

}