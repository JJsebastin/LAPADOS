/**
 * LAPDOS — 3D Ambient Background Scene
 * Three.js floating geometry with lime-to-dark-green gradients
 * Design.md §5.1: Global Ambient Background Scene
 */
(function() {
    'use strict';

    // Skip on mobile (< 768px) for performance — Design.md §6
    if (window.innerWidth < 768) return;

    // Skip if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // ─── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true, 
        antialias: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ─── Scene & Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.z = 20;

    // ─── Lighting ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xF6D7F7, 0.8, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8F8186, 0.4, 50);
    pointLight2.position.set(-5, -3, 8);
    scene.add(pointLight2);

    // ─── Geometries ────────────────────────────────────────
    // Low-poly floating shapes with muted lime-to-dark-green colors
    const geometries = [];
    const meshes = [];

    const shapes = [
        { geo: new THREE.IcosahedronGeometry(1.2, 0), color: 0xF6D7F7, pos: [-6, 3, -5] },
        { geo: new THREE.IcosahedronGeometry(0.8, 1), color: 0x8F8186, pos: [5, -2, -8] },
        { geo: new THREE.TorusKnotGeometry(0.7, 0.25, 64, 8), color: 0xF6D7F7, pos: [3, 4, -6] },
        { geo: new THREE.IcosahedronGeometry(0.6, 0), color: 0x8F8186, pos: [-4, -3, -4] },
        { geo: new THREE.OctahedronGeometry(0.9, 0), color: 0xF6D7F7, pos: [7, 1, -10] },
        { geo: new THREE.TorusKnotGeometry(0.5, 0.2, 48, 6), color: 0x8F8186, pos: [-7, -1, -7] },
        { geo: new THREE.IcosahedronGeometry(0.5, 0), color: 0xF6D7F7, pos: [0, 5, -12] },
        { geo: new THREE.DodecahedronGeometry(0.7, 0), color: 0x8F8186, pos: [-2, -5, -9] },
    ];

    shapes.forEach(({ geo, color, pos }) => {
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.6,
            transparent: true,
            opacity: 0.35,
            wireframe: false,
        });
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(pos[0], pos[1], pos[2]);
        
        // Randomize initial rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Store animation parameters
        mesh.userData = {
            basePos: [...pos],
            rotSpeed: 0.001 + Math.random() * 0.002,
            driftSpeed: 0.3 + Math.random() * 0.5,
            driftAmplitude: 0.5 + Math.random() * 1.0,
            phase: Math.random() * Math.PI * 2,
        };
        
        scene.add(mesh);
        meshes.push(mesh);
    });

    // ─── Animation Loop ────────────────────────────────────
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        meshes.forEach(mesh => {
            const d = mesh.userData;
            
            // Slow rotation
            mesh.rotation.x += d.rotSpeed;
            mesh.rotation.y += d.rotSpeed * 0.7;
            
            // Sine-wave drift
            mesh.position.x = d.basePos[0] + Math.sin(time * d.driftSpeed + d.phase) * d.driftAmplitude;
            mesh.position.y = d.basePos[1] + Math.cos(time * d.driftSpeed * 0.7 + d.phase) * d.driftAmplitude * 0.6;
        });

        renderer.render(scene, camera);
    }

    animate();

    // ─── Resize Handler ────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
