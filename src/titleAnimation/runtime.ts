import type * as THREE from 'three';

export function startRenderLoop({
  renderer,
  scene,
  camera,
}: {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
}) {
  let rafId: number | null = null;

  function animate() {
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  return () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  };
}

export function wireRestartButton({ buttonEl, onRestart }: { buttonEl: HTMLButtonElement | null; onRestart?: () => void }) {
  if (!buttonEl) return () => {};

  const handler = () => onRestart?.();
  buttonEl.addEventListener('click', handler);

  return () => {
    buttonEl.removeEventListener('click', handler);
  };
}

