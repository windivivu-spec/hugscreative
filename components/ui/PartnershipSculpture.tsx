"use client";

import { useEffect, useRef } from "react";

export default function PartnershipSculpture() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const host = element;
    let cancelled = false;
    let started = false;
    let dispose = () => {};

    async function init() {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (cancelled) return;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        // Install a cleanup immediately, including on partial setup failure.
        dispose = () => renderer.dispose();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, 0.04);
        scene.environment = environment.texture;
        room.dispose();
        pmrem.dispose();

        const geometry = new THREE.TorusGeometry(1, 0.19, 32, 96);
        const pink = new THREE.MeshPhysicalMaterial({
          color: 0xeb2266,
          metalness: 0.85,
          roughness: 0.22,
          clearcoat: 1,
          clearcoatRoughness: 0.16,
          envMapIntensity: 1.4,
        });
        const pearl = new THREE.MeshPhysicalMaterial({
          color: 0xf1cbd8,
          metalness: 0.92,
          roughness: 0.18,
          clearcoat: 1,
          envMapIntensity: 1.25,
        });
        const sculpture = new THREE.Group();
        const first = new THREE.Mesh(geometry, pink);
        first.position.x = -0.65;
        const second = new THREE.Mesh(geometry, pearl);
        second.position.x = 0.65;
        second.rotation.x = Math.PI / 2;
        sculpture.add(first, second);
        scene.add(sculpture);
        const rim = new THREE.DirectionalLight(0xff72a2, 3);
        rim.position.set(-3, 2, -2);
        scene.add(rim, new THREE.HemisphereLight(0xffffff, 0x240816, 1.3));

        let frame = 0;
        let visible = false;
        let lost = false;
        let last = 0;
        let elapsed = 0;
        const pointer = { x: 0, y: 0 };
        const tilt = { x: 0, y: 0 };
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const draw = () => {
          sculpture.rotation.set(
            0.4 + Math.sin(elapsed * 0.3) * 0.12 + tilt.y * 0.15,
            -0.45 + elapsed * 0.12 + tilt.x * 0.25,
            -0.3 + Math.sin(elapsed * 0.25) * 0.08,
          );
          sculpture.position.y = Math.sin(elapsed * 0.65) * 0.08;
          renderer.render(scene, camera);
        };
        const animate = (now: number) => {
          frame = requestAnimationFrame(animate);
          if (now - last < 1000 / 30) return;
          elapsed += Math.min((now - last) / 1000, 0.06);
          last = now;
          tilt.x += (pointer.x - tilt.x) * 0.08;
          tilt.y += (pointer.y - tilt.y) * 0.08;
          draw();
        };
        const sync = () => {
          cancelAnimationFrame(frame);
          if (!visible || document.hidden || lost) return;
          if (motion.matches) {
            elapsed = 0;
            tilt.x = tilt.y = 0;
            draw();
          } else {
            last = performance.now();
            frame = requestAnimationFrame(animate);
          }
        };
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height || lost) return;
          camera.aspect = width / height;
          camera.position.z = Math.max(7.6, 7.6 / camera.aspect);
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          draw();
        };
        const move = (event: PointerEvent) => {
          if (motion.matches || event.pointerType === "touch") return;
          const bounds = host.getBoundingClientRect();
          pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
          pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
        };
        const leave = () => { pointer.x = pointer.y = 0; };
        const contextLost = (event: Event) => {
          event.preventDefault();
          lost = true;
          delete host.dataset.ready;
          sync();
        };
        const contextRestored = () => {
          lost = false;
          resize();
          host.dataset.ready = "true";
          sync();
        };
        const viewport = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        });
        const size = new ResizeObserver(resize);

        dispose = () => {
          cancelAnimationFrame(frame);
          viewport.disconnect();
          size.disconnect();
          document.removeEventListener("visibilitychange", sync);
          motion.removeEventListener("change", sync);
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          renderer.domElement.removeEventListener("webglcontextlost", contextLost);
          renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
          renderer.domElement.remove();
          delete host.dataset.ready;
          geometry.dispose();
          pink.dispose();
          pearl.dispose();
          environment.dispose();
          renderer.dispose();
        };
        host.appendChild(renderer.domElement);
        resize();
        host.dataset.ready = "true";
        viewport.observe(host);
        size.observe(host);
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        document.addEventListener("visibilitychange", sync);
        motion.addEventListener("change", sync);
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
      } catch {
        dispose();
        // Keep the static sculptural fallback on devices without WebGL.
      }
    }

    const preload = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      preload.disconnect();
      void init();
    }, { rootMargin: "300px" });
    preload.observe(host);
    return () => {
      cancelled = true;
      preload.disconnect();
      dispose();
    };
  }, []);

  return (
    <div className="partner-sculpture" ref={root}>
      <div className="partner-sculpture-fallback"><span /><span /></div>
    </div>
  );
}
