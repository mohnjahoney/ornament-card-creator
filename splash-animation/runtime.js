function startRenderLoop({ renderer, scene, camera }) {
  let rafId = null;

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

function attachResizeHandler({ renderer, camera }) {
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
  };
}

function wireRestartButton({ buttonEl, onRestart }) {
  if (!buttonEl) return () => {};

  const handler = () => onRestart?.();
  buttonEl.addEventListener("click", handler);

  return () => {
    buttonEl.removeEventListener("click", handler);
  };
}

export { startRenderLoop, attachResizeHandler, wireRestartButton };

