/**
 * LAPDOS — Optimised 3D Ambient Background
 * GPU-friendly: fewer meshes, will-change, reduced pixel ratio cap, no heavy post-processing
 */
(function () {
  'use strict';

  // Skip on mobile or reduced-motion
  if (window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer (performance-tuned) ───────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,          // off for perf
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // cap at 1.5×
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene & Camera ─────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.z = 18;

  // ── Lighting ───────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pl1 = new THREE.PointLight(0xF6D7F7, 1.0, 40);
  pl1.position.set(6, 6, 4);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0xD4EF44, 0.5, 40);
  pl2.position.set(-6, -4, 6);
  scene.add(pl2);

  // ── Geometries (fewer & lighter) ──────────────────────────
  const shapes = [
    { geo: new THREE.IcosahedronGeometry(1.1, 0), color: 0xF6D7F7, pos: [-6, 3, -4] },
    { geo: new THREE.OctahedronGeometry(0.85, 0),  color: 0xD4EF44, pos: [5.5, -2, -6] },
    { geo: new THREE.TorusKnotGeometry(0.6, 0.22, 48, 6), color: 0xF6D7F7, pos: [3, 4, -5] },
    { geo: new THREE.DodecahedronGeometry(0.7, 0), color: 0x8F8186, pos: [-4, -3, -3] },
    { geo: new THREE.IcosahedronGeometry(0.5, 0),  color: 0xD4EF44, pos: [0,  5, -10] },
  ];

  const meshes = shapes.map(({ geo, color, pos }) => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.55,
      transparent: true,
      opacity: 0.28,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.userData = {
      basePos: [...pos],
      rotSpeed: 0.0008 + Math.random() * 0.0014,
      driftSpeed: 0.25 + Math.random() * 0.35,
      driftAmp: 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    return mesh;
  });

  // ── Animate (requestAnimationFrame + will-change hint) ─────
  canvas.style.willChange = 'transform';
  let time = 0;
  let rafId;

  function animate() {
    rafId = requestAnimationFrame(animate);
    time += 0.008; // slightly slower = less CPU

    meshes.forEach(m => {
      const d = m.userData;
      m.rotation.x += d.rotSpeed;
      m.rotation.y += d.rotSpeed * 0.65;
      m.position.x = d.basePos[0] + Math.sin(time * d.driftSpeed + d.phase) * d.driftAmp;
      m.position.y = d.basePos[1] + Math.cos(time * d.driftSpeed * 0.7 + d.phase) * d.driftAmp * 0.5;
    });

    renderer.render(scene, camera);
  }

  animate();

  // ── Pause when tab hidden ──────────────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });

  // ── Resize ─────────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  });
})();
