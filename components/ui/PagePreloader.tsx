"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { WelcomeCube, CUBE_SERVICES } from "@/components/welcome-cube/WelcomeCube";
import {
  addCubeSpin,
  CUBE_BLOOM_START,
  CUBE_SPIN_END,
} from "@/components/welcome-cube/cubeMotion";

const CUBE_IMAGES = CUBE_SERVICES.map((service) => service.id);
const HERO_POSTER = "/media/previews/hero-poster.jpg";
const ASSET_WAIT_MS = 900;
const LOADING_FAILSAFE_MS = 8000;
// CSS chooses the column count. Overscan keeps the first frame and resizes
// covered without a viewport-dependent React render or moving the cube.
const GRID_CELLS = 240;

export default function PagePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    html.dataset.preloader = "loading";
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let started = false;
    let frame = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const textures = [...CUBE_IMAGES];

    const complete = () => {
      if (cancelled) return;
      html.dataset.preloader = "done";
      document.body.style.overflow = previousOverflow;
      setDone(true);
    };
    // Never leave the site blocked if a mobile browser stalls the timeline.
    const failsafe = window.setTimeout(complete, LOADING_FAILSAFE_MS);

    let timeline: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      timeline = gsap.timeline({ paused: true, onComplete: complete });
      const cube = root.querySelector<HTMLElement>(".welcome-cube");
      const scene = root.querySelector<HTMLElement>(".welcome-cube-scene");
      if (!cube || !scene) return;

      // Reduced motion keeps the opening HUG static and uses a brief dissolve.
      if (media.matches) {
        timeline.to(root, { opacity: 0, duration: 0.2, ease: "none" }, 0);
        return;
      }

      addCubeSpin(timeline, cube, textures);
      const bounds = scene.getBoundingClientRect();
      const originX = bounds.left + bounds.width / 2;
      const originY = bounds.top + bounds.height / 2;
      const maxDistance = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY),
      );
      const visibleCells = Array.from(
        root.querySelectorAll<HTMLElement>(".preloader-cell"),
      )
        .map((cell) => ({ cell, bounds: cell.getBoundingClientRect() }))
        .filter(
          ({ bounds }) => bounds.top < window.innerHeight && bounds.bottom > 0,
        );
      const distances = new Map(
        visibleCells.map(({ cell, bounds }) => [
          cell,
          Math.hypot(
            bounds.left + bounds.width / 2 - originX,
            bounds.top + bounds.height / 2 - originY,
          ) / maxDistance,
        ]),
      );
      const cells = visibleCells.map(({ cell }) => cell);
      const stagger = (_: number, cell: Element) =>
        Math.pow(distances.get(cell as HTMLElement) ?? 1, 0.85) * 0.48;
      const aura = root.querySelector(".welcome-cube-aura");
      const frames = root.querySelectorAll(".welcome-cube-frame");
      const spread =
        (Math.max(window.innerWidth, window.innerHeight) / bounds.width) * 1.65;

      const revealStart = CUBE_BLOOM_START + 0.24;
      // The halo carries the landing into a bright inward dissolve. The grid
      // opens during that dissolve, keeping the final cube frame connected.
      timeline
        .fromTo(
          frames,
          { scale: (index) => (index === 0 ? 1.02 : 0.98), opacity: 0.6 },
          {
            scale: (index) => spread * (index === 0 ? 0.8 : 0.72),
            opacity: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "power2.out",
            immediateRender: false,
          },
          CUBE_BLOOM_START,
        )
        .to(
          aura,
          { scale: 1.42, opacity: 0.58, duration: 0.65, ease: "power2.out" },
          0.05,
        )
        .to(
          aura,
          {
            scale: 1.05,
            opacity: 0.82,
            duration: CUBE_BLOOM_START - 0.7,
            ease: "power2.inOut",
          },
          0.7,
        )
        .to(
          aura,
          { scale: spread, opacity: 0, duration: 0.88, ease: "power2.out" },
          CUBE_BLOOM_START,
        )
        .add(() => {
          root.dataset.phase = "dissolving";
        }, CUBE_SPIN_END)
        .to(
          root.querySelector(".welcome-cube-exit"),
          { scale: 0.06, rotation: -8, duration: 0.72, ease: "power2.out" },
          CUBE_BLOOM_START,
        )
        .fromTo(
          root.querySelector(".welcome-cube-exit"),
          { opacity: 1, filter: "blur(0px) brightness(1)" },
          {
            opacity: 0,
            filter: "blur(12px) brightness(2.4)",
            duration: 0.52,
            ease: "power2.in",
            immediateRender: false,
          },
          CUBE_BLOOM_START + 0.1,
        )
        .to(
          root.querySelectorAll(".preloader-hud-top, .preloader-hud-bottom"),
          {
            opacity: 0,
            duration: 0.24,
            ease: "power2.in",
          },
          CUBE_BLOOM_START + 0.02,
        )
        .add(() => {
          html.dataset.preloader = "revealing";
          root.dataset.phase = "revealing";
          root.style.backgroundColor = "transparent";
          // Restore the scrollbar while the shutter still covers the edges,
          // so its return cannot shift the page after the reveal finishes.
          document.body.style.overflow = previousOverflow;
        }, revealStart)
        .to(
          cells,
          {
            borderColor: "#ffffff20",
            duration: 0.14,
            stagger,
            ease: "power1.out",
          },
          revealStart,
        )
        .to(
          cells,
          {
            scale: 0,
            duration: 0.5,
            stagger,
            ease: "power3.inOut",
          },
          revealStart,
        );
    }, root);

    const start = () => {
      if (cancelled || started) return;
      started = true;
      frame = requestAnimationFrame(() => {
        root.dataset.phase = "spinning";
        timeline.play(0);
      });
    };

    // Only small decoded textures gate the intro. The hero owns its video
    // preload; starting a second video and full-size image decodes caused work
    // to compete with the first animation frames.
    const images: HTMLImageElement[] = [];
    const assets = ["/hug.png", HERO_POSTER].map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          images.push(image);
          image.decoding = "async";
          image.onload = () => {
            if (typeof image.decode !== "function") {
              resolve();
              return;
            }
            void image.decode().then(
              () => resolve(),
              () => resolve(),
            );
          };
          image.onerror = () => resolve();
          image.src = src;
        }),
    );
    const timeout = window.setTimeout(start, ASSET_WAIT_MS);
    const fonts = document.fonts;
    const fontLoads = fonts?.load
      ? [fonts.load('italic 24px Retroscope'), fonts.load('24px OVSoge')]
      : [];
    void Promise.allSettled([...assets, ...fontLoads]).then(start);

    // If the preference changes during the intro, finish without more motion.
    const onMotionChange = () => {
      if (media.matches) {
        timeline.kill();
        complete();
      }
    };
    media.addEventListener("change", onMotionChange);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearTimeout(failsafe);
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMotionChange);
      ctx.revert();
      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
      document.body.style.overflow = previousOverflow;
      if (html.dataset.preloader !== "done") delete html.dataset.preloader;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="page-preloader"
      data-phase="preparing"
      role="status"
      aria-label="Loading HUGs Creative"
    >
      <div className="preloader-grid" aria-hidden="true">
        {Array.from({ length: GRID_CELLS }, (_, i) => (
          <span key={i} className="preloader-cell" />
        ))}
      </div>
      <div className="preloader-stage">
        <div className="preloader-hud-top">
          <div className="eyebrow preloader-brand">
            <span className="tiny-cross">+</span> HUGs CREATIVE / DA NANG
          </div>
        </div>
        <div className="preloader-center">
          <WelcomeCube images={CUBE_IMAGES} />
        </div>
        <div className="preloader-hud-bottom">
          <span className="preloader-tagline">
            We <em>make</em> brands move.
          </span>
        </div>
      </div>
    </div>
  );
}
