import * as THREE from 'three';
import { cfg, titleLetters } from './config';

function measureLetterWidth(char: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = 'bold 220px Arial';
  return ctx.measureText(char).width;
}

function makeLetterSprite(char: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const material = new THREE.SpriteMaterial({ transparent: true, opacity: 0 });
    return new THREE.Sprite(material);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8e0c0c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 160px Arial';
  ctx.fillText(char, canvas.width / 2, canvas.height / 2 + 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(cfg.letters.startScale, cfg.letters.startScale, 1);
  return sprite;
}

function computeLetterLayout() {
  let cursorX = 0.62;
  let prevGlyphWidth = 1.2 * cfg.geom.ornamentRadius;
  const layout: Array<{
    char: string;
    glyphWidth: number;
    targetX: number;
    targetY: number;
    targetZ: number;
    arcHeight: number;
  }> = [];

  for (const ch of titleLetters) {
    if (ch === ' ') {
      const spaceWidth = measureLetterWidth(' ') * cfg.letters.widthScale + cfg.letters.wordGapExtra;
      cursorX += prevGlyphWidth / 2;
      cursorX += spaceWidth;
      prevGlyphWidth = spaceWidth;
      continue;
    }

    const glyphWidth = measureLetterWidth(ch) * cfg.letters.widthScale;

    cursorX += prevGlyphWidth / 2;
    cursorX += glyphWidth / 2;

    layout.push({
      char: ch,
      glyphWidth,
      targetX: cursorX,
      targetY: cfg.letters.baselineY,
      targetZ: cfg.letters.finalZ,
      arcHeight: cfg.letters.arcHeight,
    });

    cursorX += cfg.letters.tracking;
    prevGlyphWidth = glyphWidth;
  }

  return layout;
}

export function addLettersToGroup(letterGroup: THREE.Group) {
  letterGroup.clear();

  const layout = computeLetterLayout();

  for (const letterSpec of layout) {
    const sprite = makeLetterSprite(letterSpec.char);
    sprite.userData.glyphWidth = letterSpec.glyphWidth;

    sprite.position.set(cfg.letters.spawnOffsetX, cfg.letters.spawnOffsetY, cfg.letters.spawnOffsetZ);
    sprite.userData.targetX = letterSpec.targetX;
    sprite.userData.targetY = letterSpec.targetY;
    sprite.userData.targetZ = letterSpec.targetZ;
    sprite.userData.arcHeight = letterSpec.arcHeight;

    letterGroup.add(sprite);
  }
}

export { measureLetterWidth, makeLetterSprite, computeLetterLayout };

