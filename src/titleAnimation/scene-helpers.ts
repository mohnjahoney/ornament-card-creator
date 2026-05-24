import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0b0c, 10, 30);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0.6, 10);
  return camera;
}

export function addSceneLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(3, 5, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
  rimLight.position.set(-4, 2, -6);
  scene.add(rimLight);
}

export function exposeDebugGlobals({
  scene,
  camera,
  assemblyGroup,
}: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  assemblyGroup: THREE.Group;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.scene = scene;
  w.camera = camera;
  w.assemblyGroup = assemblyGroup;
}

