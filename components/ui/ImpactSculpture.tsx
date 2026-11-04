"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Vec2 = [number, number];

const SCATTER_STATES = [
  // 0: Top-Left
  {
    x: -1.65,
    y: 1.25,
    z: -1.0,
    rx: 0.62,
    ry: -0.68,
    rz: 0.44,
    scale: 0.82,
    phase: 0.0,
  },
  // 1: Top-Right (Deep ruby-magenta accent piece)
  {
    x: 1.72,
    y: 1.2,
    z: -0.65,
    rx: 0.54,
    ry: 0.72,
    rz: -0.4,
    scale: 0.84,
    phase: 1.57,
  },
  // 2: Bottom-Left
  {
    x: -1.6,
    y: -1.28,
    z: -0.6,
    rx: -0.58,
    ry: -0.62,
    rz: -0.38,
    scale: 0.82,
    phase: 3.14,
  },
  // 3: Bottom-Right
  {
    x: 1.66,
    y: -1.22,
    z: -0.95,
    rx: -0.56,
    ry: 0.66,
    rz: 0.42,
    scale: 0.82,
    phase: 4.71,
  },
] as const;

export default function ImpactSculpture() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const rootEl = rootRef.current;
    const hostEl = hostRef.current;
    if (!rootEl || !hostEl) return;
    const root = rootEl;
    const host = hostEl;

    let cancelled = false;
    let dispose = () => {};

    async function initThree() {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (cancelled) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        dispose = () => renderer.dispose();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
        camera.position.set(0, 0, 6.4);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const envRT = pmrem.fromScene(room, 0.04);
        scene.environment = envRT.texture;
        room.dispose();
        pmrem.dispose();

        // Crisp studio lighting for translucent pink liquid glass
        const ambient = new THREE.AmbientLight(0xfff5f8, 1.2);
        const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
        keyLight.position.set(4.5, 6.5, 7);
        const rimLight = new THREE.DirectionalLight(0xeb2266, 3.4);
        rimLight.position.set(-5.5, -4.5, 4);
        const backLight = new THREE.DirectionalLight(0xff7aa8, 2.4);
        backLight.position.set(2, 3, -6);
        scene.add(ambient, keyLight, rimLight, backLight);

        // Create inner embossed glass typography & subtle glass watermark texture
        const createInnerGlassTextTexture = () => {
          const size = 1024;
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          const ctx = c.getContext("2d")!;

          ctx.clearRect(0, 0, size, size);

          // Delicate inner frosted glass border ring
          ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
          ctx.lineWidth = 4.5;
          ctx.strokeRect(86, 86, size - 172, size - 172);

          ctx.strokeStyle = "rgba(235, 34, 102, 0.3)";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 10]);
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, 340, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Top micro glass engraving
          ctx.fillStyle = "rgba(189, 24, 80, 0.78)";
          ctx.font = "600 28px Geist, Arial, sans-serif";
          ctx.letterSpacing = "7px";
          ctx.fillText("IDEA → IMPACT", 128, 154);

          // Signature corner arrow mark (bright white on the deep ruby top-right piece)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.96)";
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(824, 176);
          ctx.lineTo(884, 116);
          ctx.moveTo(836, 116);
          ctx.lineTo(884, 116);
          ctx.lineTo(884, 164);
          ctx.stroke();

          // Center transparent glass-embossed word: "impact."
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "italic 400 252px Retroscope, Georgia, serif";

          // Rose refractive shadow edge
          ctx.strokeStyle = "rgba(185, 12, 70, 0.75)";
          ctx.lineWidth = 10;
          ctx.strokeText("impact.", size / 2 + 5, size / 2 - 6);

          // Translucent frosted white glass fill
          const textGrad = ctx.createLinearGradient(0, 350, 0, 650);
          textGrad.addColorStop(0, "rgba(255, 255, 255, 0.96)");
          textGrad.addColorStop(0.5, "rgba(255, 232, 242, 0.62)");
          textGrad.addColorStop(1, "rgba(255, 255, 255, 0.92)");
          ctx.fillStyle = textGrad;
          ctx.fillText("impact.", size / 2, size / 2 - 12);

          // Bright specular glass rim highlight
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 5;
          ctx.strokeText("impact.", size / 2 - 3, size / 2 - 15);
          ctx.restore();

          // Sub-label etched in glass
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(189, 24, 80, 0.8)";
          ctx.font = "600 32px Geist, Arial, sans-serif";
          ctx.letterSpacing = "12px";
          ctx.fillText("HUGs CREATIVE", size / 2 + 6, 694);
          ctx.restore();

          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        const innerTextMap = createInnerGlassTextTexture();

        const addJigsawSeam = (
          shape: InstanceType<typeof THREE.Shape>,
          p0: Vec2,
          p1: Vec2,
          n: Vec2,
          tabH = 0.27,
        ) => {
          const dx = p1[0] - p0[0];
          const dy = p1[1] - p0[1];
          const pt = (s: number, d: number): Vec2 => [
            p0[0] + dx * s + n[0] * d,
            p0[1] + dy * s + n[1] * d,
          ];
          const [x1, y1] = pt(0.35, 0);
          shape.lineTo(x1, y1);

          const [c1x, c1y] = pt(0.4, 0);
          const [c2x, c2y] = pt(0.41, -0.14 * tabH);
          const [p2x, p2y] = pt(0.388, 0.18 * tabH);
          shape.bezierCurveTo(c1x, c1y, c2x, c2y, p2x, p2y);

          const [c3x, c3y] = pt(0.345, 0.54 * tabH);
          const [c4x, c4y] = pt(0.355, tabH);
          const [p3x, p3y] = pt(0.5, tabH);
          shape.bezierCurveTo(c3x, c3y, c4x, c4y, p3x, p3y);

          const [c5x, c5y] = pt(0.645, tabH);
          const [c6x, c6y] = pt(0.655, 0.54 * tabH);
          const [p4x, p4y] = pt(0.612, 0.18 * tabH);
          shape.bezierCurveTo(c5x, c5y, c6x, c6y, p4x, p4y);

          const [c7x, c7y] = pt(0.59, -0.14 * tabH);
          const [c8x, c8y] = pt(0.6, 0);
          const [p5x, p5y] = pt(0.65, 0);
          shape.bezierCurveTo(c7x, c7y, c8x, c8y, p5x, p5y);

          shape.lineTo(p1[0], p1[1]);
        };

        const S = 1.48;
        const R = 0.36;

        // 0: Top-Left
        const shapeTL = new THREE.Shape();
        shapeTL.moveTo(0, S);
        addJigsawSeam(shapeTL, [0, S], [0, 0], [1, 0]);
        addJigsawSeam(shapeTL, [0, 0], [-S, 0], [0, 1]);
        shapeTL.lineTo(-S, S - R);
        shapeTL.quadraticCurveTo(-S, S, -S + R, S);
        shapeTL.lineTo(0, S);

        // 1: Top-Right
        const shapeTR = new THREE.Shape();
        shapeTR.moveTo(S, 0);
        addJigsawSeam(shapeTR, [S, 0], [0, 0], [0, -1]);
        addJigsawSeam(shapeTR, [0, 0], [0, S], [1, 0]);
        shapeTR.lineTo(S - R, S);
        shapeTR.quadraticCurveTo(S, S, S, S - R);
        shapeTR.lineTo(S, 0);

        // 2: Bottom-Left
        const shapeBL = new THREE.Shape();
        shapeBL.moveTo(-S, 0);
        addJigsawSeam(shapeBL, [-S, 0], [0, 0], [0, 1]);
        addJigsawSeam(shapeBL, [0, 0], [0, -S], [-1, 0]);
        shapeBL.lineTo(-S + R, -S);
        shapeBL.quadraticCurveTo(-S, -S, -S, -S + R);
        shapeBL.lineTo(-S, 0);

        // 3: Bottom-Right
        const shapeBR = new THREE.Shape();
        shapeBR.moveTo(0, -S);
        addJigsawSeam(shapeBR, [0, -S], [0, 0], [-1, 0]);
        addJigsawSeam(shapeBR, [0, 0], [S, 0], [0, -1]);
        shapeBR.lineTo(S, -S + R);
        shapeBR.quadraticCurveTo(S, -S, S - R, -S);
        shapeBR.lineTo(0, -S);

        const shapes = [shapeTL, shapeTR, shapeBL, shapeBR];

        // Soft Pink Liquid Glass for Pieces 0, 2, 3
        const frontGlassMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf66d9b),
          transparent: true,
          opacity: 0.34,
          roughness: 0.06,
          metalness: 0.02,
          ior: 1.5,
          reflectivity: 0.95,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          iridescence: 0.45,
          iridescenceIOR: 1.32,
          specularIntensity: 1.8,
          specularColor: new THREE.Color(0xffffff),
          envMapIntensity: 1.1,
          side: THREE.FrontSide,
          depthWrite: false,
        });

        const backGlassMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xeb2266),
          transparent: true,
          opacity: 0.22,
          roughness: 0.1,
          metalness: 0.05,
          clearcoat: 0.9,
          specularIntensity: 1.2,
          specularColor: new THREE.Color(0xffb8d0),
          envMapIntensity: 0.85,
          side: THREE.BackSide,
          depthWrite: false,
        });

        // Rich, Deep Ruby-Magenta Liquid Glass for Top-Right Piece (idx === 1)
        // Lower envMapIntensity on the flat face so the deep #c70a48 magenta color stays saturated & bold!
        const frontAccentMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xc70a48),
          emissive: new THREE.Color(0x8f0533),
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0.68,
          roughness: 0.05,
          metalness: 0.05,
          ior: 1.58,
          reflectivity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          iridescence: 0.55,
          iridescenceIOR: 1.36,
          specularIntensity: 1.9,
          specularColor: new THREE.Color(0xffbfd6),
          envMapIntensity: 0.58,
          side: THREE.FrontSide,
          depthWrite: false,
        });

        const backAccentMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x960434),
          transparent: true,
          opacity: 0.52,
          roughness: 0.08,
          metalness: 0.08,
          clearcoat: 1.0,
          specularIntensity: 1.4,
          specularColor: new THREE.Color(0xff6699),
          envMapIntensity: 0.65,
          side: THREE.BackSide,
          depthWrite: false,
        });

        // Inner suspended transparent glass-etched typography material
        const innerEtchMaterial = new THREE.MeshPhysicalMaterial({
          map: innerTextMap,
          transparent: true,
          opacity: 0.95,
          roughness: 0.12,
          clearcoat: 1.0,
          specularIntensity: 1.4,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        const assignGlobalUVs = (geo: InstanceType<typeof THREE.BufferGeometry>) => {
          const pos = geo.getAttribute("position") as InstanceType<
            typeof THREE.BufferAttribute
          >;
          const uvs = new Float32Array(pos.count * 2);
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            uvs[i * 2] = (x + S) / (2 * S);
            uvs[i * 2 + 1] = (y + S) / (2 * S);
          }
          geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        };

        const puzzleGroup = new THREE.Group();
        scene.add(puzzleGroup);

        const pieceGroups: InstanceType<typeof THREE.Group>[] = [];
        const geometriesToDispose: InstanceType<typeof THREE.BufferGeometry>[] = [];

        shapes.forEach((sh, idx) => {
          const pGroup = new THREE.Group();
          const isTopRight = idx === 1;

          const extrudeGeo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.28,
            bevelEnabled: true,
            bevelThickness: 0.095,
            bevelSize: 0.075,
            bevelOffset: -0.015,
            bevelSegments: 10,
            curveSegments: 32,
          });
          extrudeGeo.translate(0, 0, -0.14);
          extrudeGeo.computeVertexNormals();
          geometriesToDispose.push(extrudeGeo);

          const backMesh = new THREE.Mesh(
            extrudeGeo,
            isTopRight ? backAccentMaterial : backGlassMaterial,
          );
          backMesh.renderOrder = 1;
          pGroup.add(backMesh);

          const flatGeo = new THREE.ShapeGeometry(sh, 28);
          assignGlobalUVs(flatGeo);
          geometriesToDispose.push(flatGeo);

          const innerMesh = new THREE.Mesh(flatGeo, innerEtchMaterial);
          innerMesh.position.z = 0.01;
          innerMesh.renderOrder = 2;
          pGroup.add(innerMesh);

          const frontMesh = new THREE.Mesh(
            extrudeGeo,
            isTopRight ? frontAccentMaterial : frontGlassMaterial,
          );
          frontMesh.renderOrder = 3;
          pGroup.add(frontMesh);

          puzzleGroup.add(pGroup);
          pieceGroups.push(pGroup);
        });

        let scrollProgress = 0;
        const pointer = { x: 0, y: 0 };
        const smoothPointer = { x: 0, y: 0 };
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );

        const st = ScrollTrigger.create({
          trigger: root,
          start: "top 92%",
          end: "top 36%",
          scrub: reducedMotion.matches ? false : 0.65,
          onUpdate: (self) => {
            scrollProgress = self.progress;
            root.style.setProperty(
              "--puzzle-progress",
              scrollProgress.toFixed(3),
            );
          },
        });

        let rafId = 0;
        let visible = true;
        const clockStart = performance.now();
        let baseAspect = 1;

        const render = () => {
          const t = reducedMotion.matches
            ? 0
            : (performance.now() - clockStart) * 0.001;

          smoothPointer.x += (pointer.x - smoothPointer.x) * 0.08;
          smoothPointer.y += (pointer.y - smoothPointer.y) * 0.08;

          const p = Math.max(0, Math.min(1, scrollProgress));
          const spread = Math.pow(1 - p, 1.15);

          // Moderate camera distance so the assembled square is ~22% smaller and doesn't touch the heading
          const targetZ = 7.75 + spread * 1.85;
          camera.position.z = Math.max(targetZ, targetZ / baseAspect);

          // Expressive 3D tilt + continuous levitation ("nghiêng nghiêng bay bay")
          const baseTiltX = -0.26 + Math.sin(t * 1.15) * 0.08;
          const baseTiltY = 0.34 + Math.cos(t * 0.9) * 0.1;
          const baseTiltZ = -0.1 + Math.sin(t * 0.7) * 0.04;

          puzzleGroup.rotation.set(
            baseTiltX - smoothPointer.y * 0.32,
            baseTiltY + smoothPointer.x * 0.38,
            baseTiltZ,
          );
          puzzleGroup.position.y = Math.sin(t * 1.5) * 0.08;
          puzzleGroup.position.x = Math.cos(t * 1.0) * 0.04;

          pieceGroups.forEach((grp, idx) => {
            const cfg = SCATTER_STATES[idx];
            const floatAmp = 0.022 + spread * 0.11;
            const rotAmp = 0.018 + spread * 0.14;

            const fx = Math.sin(t * 1.55 + cfg.phase) * floatAmp;
            const fy = Math.cos(t * 1.4 + cfg.phase) * floatAmp;
            const fz = Math.sin(t * 1.85 + cfg.phase * 1.3) * (floatAmp * 1.35);

            grp.position.set(
              cfg.x * spread + fx,
              cfg.y * spread + fy,
              cfg.z * spread + fz,
            );

            grp.rotation.set(
              cfg.rx * spread + Math.cos(t * 1.3 + cfg.phase) * rotAmp,
              cfg.ry * spread + Math.sin(t * 1.45 + cfg.phase) * rotAmp,
              cfg.rz * spread + Math.sin(t * 1.15 + cfg.phase) * (rotAmp * 0.65),
            );

            const s = cfg.scale + (1 - cfg.scale) * (1 - spread);
            grp.scale.setScalar(s);
          });

          keyLight.position.x =
            4.5 + Math.sin(t * 1.2) * 1.8 + smoothPointer.x * 2.2;
          keyLight.position.y =
            6.0 + Math.cos(t * 0.95) * 1.4 - smoothPointer.y * 2.2;

          renderer.render(scene, camera);
        };

        const animate = () => {
          if (!visible || document.hidden) {
            rafId = 0;
            return;
          }
          render();
          rafId = requestAnimationFrame(animate);
        };

        const syncLoop = () => {
          cancelAnimationFrame(rafId);
          rafId = 0;
          if (!visible || document.hidden) return;
          if (reducedMotion.matches) {
            render();
          } else {
            rafId = requestAnimationFrame(animate);
          }
        };

        const resize = () => {
          const rect = host.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          baseAspect = rect.width / rect.height;
          camera.aspect = baseAspect;
          camera.updateProjectionMatrix();
          renderer.setSize(rect.width, rect.height, false);
          render();
        };

        const onPointerMove = (e: PointerEvent) => {
          if (reducedMotion.matches || e.pointerType === "touch") return;
          const rect = host.getBoundingClientRect();
          pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        const onPointerLeave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };

        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          syncLoop();
        });
        const ro = new ResizeObserver(resize);

        host.appendChild(renderer.domElement);
        resize();
        root.dataset.ready = "true";
        io.observe(host);
        ro.observe(host);
        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);
        document.addEventListener("visibilitychange", syncLoop);

        dispose = () => {
          cancelAnimationFrame(rafId);
          st.kill();
          io.disconnect();
          ro.disconnect();
          host.removeEventListener("pointermove", onPointerMove);
          host.removeEventListener("pointerleave", onPointerLeave);
          document.removeEventListener("visibilitychange", syncLoop);
          renderer.domElement.remove();
          delete root.dataset.ready;
          geometriesToDispose.forEach((g) => g.dispose());
          frontGlassMaterial.dispose();
          backGlassMaterial.dispose();
          frontAccentMaterial.dispose();
          backAccentMaterial.dispose();
          innerEtchMaterial.dispose();
          innerTextMap.dispose();
          envRT.dispose();
          renderer.dispose();
        };
      } catch {
        dispose();
      }
    }

    void initThree();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <div className="impact-puzzle" ref={rootRef}>
      <div className="impact-puzzle-stage" ref={hostRef} />
    </div>
  );
}
