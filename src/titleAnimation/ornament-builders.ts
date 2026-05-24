import * as THREE from 'three';
import { cfg } from './config';

// --------------------------------------------------
// Texture helpers
// --------------------------------------------------

export function loadTexture(path: string) {
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function configureOrnamentTexture(texture: THREE.Texture) {
  const imageScale = 1 / (2 * cfg.geom.ornamentRadius);
  texture.offset.set(0.5, 0.5);
  texture.repeat.set(imageScale, imageScale);
  return texture;
}

export function configureCapTexture(texture: THREE.Texture) {
  const imageScale = 1 / (1 * cfg.geom.ornamentRadius);
  texture.offset.set(0.5, 0.5);
  texture.repeat.set(imageScale, imageScale);
  return texture;
}

// --------------------------------------------------
// Material helpers
// --------------------------------------------------

function makeTexturedFaceMaterial(texture: THREE.Texture) {
  return new THREE.MeshBasicMaterial({ map: texture });
}

function makeInvisibleCapMaterial() {
  return new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });
}

function makeOrnamentEdgeMaterial() {
  return new THREE.MeshBasicMaterial({
    color: 0x8e0c0c,
  });
}

function makeBumpMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xd9d9d9,
    roughness: 0.85,
    metalness: 0.2,
  });
}

function makeCapMaterial(texture: THREE.Texture) {
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.85,
    metalness: 0,
  });
}

// --------------------------------------------------
// Geometry helpers
// --------------------------------------------------

function roundedRectPath(x: number, y: number, w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function makeOrnamentShape() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, cfg.geom.ornamentRadius, 0, Math.PI * 2, false);

  const bumpW = 0.6 * cfg.geom.ornamentRadius;
  const bumpH = 0.8 * cfg.geom.ornamentRadius;
  const bumpRad = 0.2 * cfg.geom.ornamentRadius;
  const overlap = 0.4 * cfg.geom.ornamentRadius;

  const bx = -bumpW / 2;
  const by = cfg.geom.ornamentRadius - overlap;

  const bump = roundedRectPath(bx, by, bumpW, bumpH, bumpRad);
  return { circleShape: shape, bumpShape: bump };
}

function extrudeShape(shape: THREE.Shape, depth = cfg.geom.paperThickness) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 64,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function makeFaceGroups({
  circleGeo,
  bumpGeo,
  matA,
  matB,
  matBump,
}: {
  circleGeo: THREE.ShapeGeometry;
  bumpGeo: THREE.ShapeGeometry;
  matA: THREE.Material;
  matB: THREE.Material;
  matBump: THREE.Material;
}) {
  const frontCircleMesh = new THREE.Mesh(circleGeo, matA);
  const backCircleMesh = new THREE.Mesh(circleGeo, matB);
  const frontBumpMesh = new THREE.Mesh(bumpGeo, matBump);
  const backBumpMesh = new THREE.Mesh(bumpGeo, matBump);

  frontBumpMesh.position.z -= 0.01 * cfg.geom.paperThickness;
  backBumpMesh.position.z -= 0.01 * cfg.geom.paperThickness;

  const frontGroup = new THREE.Group();
  const backGroup = new THREE.Group();

  frontGroup.add(frontCircleMesh, frontBumpMesh);
  backGroup.add(backCircleMesh, backBumpMesh);

  frontGroup.position.z += cfg.geom.paperThickness / 2;
  backGroup.rotation.y = Math.PI;
  backGroup.position.z += -cfg.geom.paperThickness / 2;

  return { frontGroup, backGroup };
}

function makeEdgeMesh(shape: THREE.Shape, hiddenCapMaterial: THREE.Material, edgeMaterial: THREE.Material) {
  const sideGeo = extrudeShape(shape);
  return new THREE.Mesh(sideGeo, [hiddenCapMaterial, edgeMaterial]);
}

// --------------------------------------------------
// Piece builders
// --------------------------------------------------

export function createOrnamentPiece({
  frontTexture,
  backTexture,
  ornamentRadius: _ornamentRadius,
}: {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  ornamentRadius: number;
}) {
  function configureFaceTexture(texture: THREE.Texture) {
    const imageScale = 1 / (2 * _ornamentRadius);
    texture.offset.set(0.5, 0.5);
    texture.repeat.set(imageScale, imageScale);
    return texture;
  }

  const frontFaceMaterial = makeTexturedFaceMaterial(configureFaceTexture(frontTexture));
  const backFaceMaterial = makeTexturedFaceMaterial(configureFaceTexture(backTexture));
  const hiddenCapMaterial = makeInvisibleCapMaterial();
  const edgeMaterial = makeOrnamentEdgeMaterial();
  const bumpMaterial = makeBumpMaterial();

  const { circleShape, bumpShape } = makeOrnamentShape();

  const circleGeometry = new THREE.ShapeGeometry(circleShape, 64);
  const bumpGeometry = new THREE.ShapeGeometry(bumpShape, 64);

  const { frontGroup, backGroup } = makeFaceGroups({
    circleGeo: circleGeometry,
    bumpGeo: bumpGeometry,
    matA: frontFaceMaterial,
    matB: backFaceMaterial,
    matBump: bumpMaterial,
  });

  const circleEdgeMesh = makeEdgeMesh(circleShape, hiddenCapMaterial, edgeMaterial);
  const bumpEdgeMesh = makeEdgeMesh(bumpShape, hiddenCapMaterial, bumpMaterial);

  const group = new THREE.Group();
  group.add(frontGroup, backGroup, circleEdgeMesh, bumpEdgeMesh);

  return { group, circleShape, bumpShape };
}

export function createCapPiece({
  texture,
  capRadius,
  ornamentRadius: _ornamentRadius,
}: {
  texture: THREE.Texture;
  capRadius: number;
  ornamentRadius: number;
}) {
  function configureTexture(tex: THREE.Texture) {
    tex.offset.set(0.5, 0.5);
    tex.repeat.set(1 / _ornamentRadius, 1 / _ornamentRadius);
    return tex;
  }

  const shape = new THREE.Shape();
  shape.absarc(0, 0, capRadius, 0, Math.PI * 2, false);

  const material = makeCapMaterial(configureTexture(texture));
  const mesh = new THREE.Mesh(extrudeShape(shape), material);

  return { mesh, shape };
}

