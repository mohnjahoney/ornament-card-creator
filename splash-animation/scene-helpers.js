import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

function createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0b0c, 10, 30);
    return scene;
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.6, 10);
    return camera;
  }

  function addSceneLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    rimLight.position.set(-4, 2, -6);
    scene.add(rimLight);
  }


  function exposeDebugGlobals({ scene, camera, assemblyGroup }) {
    window.scene = scene;
    window.camera = camera;
    window.assemblyGroup = assemblyGroup;
  }

export {
    createScene,
    createRenderer,
    createCamera,
    addSceneLights,
    exposeDebugGlobals
  };