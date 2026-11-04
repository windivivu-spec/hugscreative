"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { projects, type Project } from "@/data/projects";
import { Arrow } from "@/components/ui/Icons";
import SectionLabel from "@/components/ui/SectionLabel";
import VideoPreview from "@/components/ui/VideoPreview";
export type OpenProject = (project: Project, rect?: DOMRect) => void;
const wrap = (n: number) =>
  ((n % projects.length) + projects.length) % projects.length;
const angle = 360 / projects.length;
export default function RotundaPortfolio({
  onOpen,
  paused,
}: {
  onOpen: OpenProject;
  paused: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  const rotor = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const state = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    frame: 0,
    down: false,
    start: 0,
    last: 0,
    time: 0,
    distance: 0,
    card: -1,
    visible: false,
    reduced: false,
    paused: false,
    active: 0,
    autoPaused: false,
    scrollProgress: 0,
  });
  const wake = useRef<() => void>(() => {});
  const wheelSnapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const s = state.current;
    const trackNode = track.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    s.reduced = media.matches;
    function paint() {
      if (rotor.current)
        rotor.current.style.transform = `rotateY(${-s.current * angle}deg)`;
      const n = wrap(Math.round(s.current));
      if (s.active !== n) {
        s.active = n;
        setActive(n);
        window.dispatchEvent(
          new CustomEvent("studio:rotunda", { detail: n + 1 }),
        );
      }
      stage.current
        ?.querySelectorAll<HTMLElement>(".ring-card")
        .forEach((card, i) => {
          const relative = ((i - s.current) * Math.PI * 2) / projects.length;
          const depth = (Math.cos(relative) + 1) / 2;
          card.style.setProperty("--depth", String(depth));
          card.style.filter = `brightness(${0.36 + depth * 0.64})`;
        });
    }
    let last = 0;
    function step(now: number) {
      s.frame = 0;
      if (!s.visible || s.paused || document.hidden) return;
      const dt = Math.min(2, (now - last) / 16.667 || 1);
      last = now;
      const auto =
        !s.reduced &&
        !s.autoPaused &&
        !s.down;
      if (auto) s.target += 0.0018 * dt;
      if (!s.down) {
        if (s.reduced) {
          s.current = s.target;
          s.velocity = 0;
        } else {
          s.velocity += (s.target - s.current) * 0.075 * dt;
          s.velocity *= Math.pow(0.67, dt);
          s.current += s.velocity * dt;
        }
      }
      paint();
      if (
        auto ||
        s.down ||
        Math.abs(s.target - s.current) > 0.0005 ||
        Math.abs(s.velocity) > 0.0005
      )
        s.frame = requestAnimationFrame(step);
      else {
        s.current = s.target;
        paint();
      }
    }
    wake.current = () => {
      if (!s.frame && s.visible && !s.paused) {
        last = performance.now();
        s.frame = requestAnimationFrame(step);
      }
    };
    const change = () => {
      s.reduced = media.matches;
      trackNode?.classList.toggle("is-scroll-orbit", !s.reduced);
      syncScroll();
      wake.current();
    };
    media.addEventListener("change", change);
    const observer = new IntersectionObserver(
      ([e]) => {
        s.visible = e.isIntersecting;
        if (s.visible) wake.current();
        else {
          cancelAnimationFrame(s.frame);
          s.frame = 0;
        }
      },
      { threshold: 0.15 },
    );
    if (stage.current) observer.observe(stage.current);
    function syncScroll() {
      const node = track.current;
      if (!node || s.reduced) return;
      const travel = Math.max(1, node.offsetHeight - window.innerHeight);
      const progress = Math.max(
        0,
        Math.min(1, -node.getBoundingClientRect().top / travel),
      );
      if (progress !== s.scrollProgress) {
        if (!s.paused)
          s.target += (progress - s.scrollProgress) * projects.length / 2;
        s.scrollProgress = progress;
        node.style.setProperty("--orbit-scroll", `${progress * 100}%`);
        wake.current();
      }
    }
    trackNode?.classList.toggle("is-scroll-orbit", !s.reduced);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    const resume = () => {
      if (!document.hidden) wake.current();
    };
    document.addEventListener("visibilitychange", resume);
    const node = stage.current;
    const wheel = (e: WheelEvent) => {
      if (s.paused || s.down) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horizontal) return;
      e.preventDefault();
      s.target += (e.shiftKey ? e.deltaY : e.deltaX) * 0.003;
      clearTimeout(wheelSnapTimer.current);
      wheelSnapTimer.current = setTimeout(() => {
        if (s.paused) return;
        s.target = Math.round(s.target);
        wake.current();
      }, 120);
      wake.current();
    };
    node?.addEventListener("wheel", wheel, { passive: false });
    paint();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(s.frame);
      clearTimeout(wheelSnapTimer.current);
      media.removeEventListener("change", change);
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
      document.removeEventListener("visibilitychange", resume);
      trackNode?.classList.remove("is-scroll-orbit");
      node?.removeEventListener("wheel", wheel);
    };
  }, []);
  useEffect(() => {
    const s = state.current;
    if (s.paused !== paused) {
      clearTimeout(wheelSnapTimer.current);
      s.target = s.current;
      s.velocity = 0;
      s.paused = paused;
      // Scroll locking can move the page without representing an orbit gesture.
      const node = track.current;
      if (node) {
        const travel = Math.max(1, node.offsetHeight - window.innerHeight);
        s.scrollProgress = Math.max(0, Math.min(1, -node.getBoundingClientRect().top / travel));
        node.style.setProperty("--orbit-scroll", `${s.scrollProgress * 100}%`);
      }
    }
    if (!paused) wake.current();
  }, [paused]);
  function openCard(project: Project, rect?: DOMRect) {
    const s = state.current;
    clearTimeout(wheelSnapTimer.current);
    s.target = s.current;
    s.velocity = 0;
    s.paused = true;
    onOpen(project, rect);
  }
  function move(delta: number) {
    const s = state.current;
    if (s.paused) return;
    s.target = Math.round(s.target) + delta;
    wake.current();
  }
  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || paused) return;
    const s = state.current;
    s.down = true;
    s.start = s.last = e.clientX;
    s.time = performance.now();
    s.distance = 0;
    s.velocity = 0;
    s.target = s.current;
    s.card = Number(
      (e.target as HTMLElement).closest<HTMLElement>("[data-project]")?.dataset
        .project ?? -1,
    );
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    wake.current();
  }
  function pointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const s = state.current;
    if (!s.down) return;
    const dx = e.clientX - s.last;
    const dt = Math.max(8, performance.now() - s.time);
    s.current -= dx / (window.innerWidth < 700 ? 150 : 240);
    s.target = s.current;
    s.velocity = (-dx / dt) * 0.09;
    s.distance += Math.abs(dx);
    s.last = e.clientX;
    s.time = performance.now();
    wake.current();
  }
  function up(e: ReactPointerEvent<HTMLDivElement>) {
    const s = state.current;
    if (!s.down) return;
    s.down = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (s.distance < 6 && s.card >= 0) {
      if (s.card === s.active) {
        const card = stage.current?.querySelector<HTMLElement>(
          `[data-project="${s.card}"]`,
        );
        openCard(projects[s.card], card?.getBoundingClientRect());
      } else {
        const difference =
          wrap(s.card - s.active + projects.length / 2) - projects.length / 2;
        s.target = Math.round(s.current) + difference;
      }
    } else {
      s.target = Math.round(
        s.current + Math.max(-2, Math.min(2, s.velocity * 8)),
      );
    }
    wake.current();
  }
  const p = projects[active];
  return (
    <section
      className="rotunda-scroll-track"
      ref={track}
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="rotunda-section">
        <div className="section-heading">
          <div>
            <SectionLabel index="01">A FEW THINGS WE’VE MADE</SectionLabel>
            <h2 id="work-heading">
              Selected <em>work</em>
              <span className="heading-period">.</span>
            </h2>
          </div>
          <p>
            A collection of ideas
            <br />
            brought to life.
          </p>
        </div>
        <div
          className={`orbit-stage ${dragging ? "is-dragging" : ""}`}
          ref={stage}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Selected projects. Drag horizontally, or use left and right arrow keys."
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              move(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              move(-1);
            }
            if (e.key === "Enter") {
              openCard(
                p,
                stage.current
                  ?.querySelector<HTMLElement>(`[data-project="${active}"]`)
                  ?.getBoundingClientRect(),
              );
            }
          }}
          onPointerDown={down}
          onPointerMove={pointerMove}
          onPointerUp={up}
          onPointerCancel={() => {
            state.current.down = false;
            state.current.target = Math.round(state.current.current);
            setDragging(false);
            wake.current();
          }}
        >
          <div className="orbit-ambient" />
          <span className="orbit-watermark" aria-hidden="true">
            IN ORBIT
          </span>
          <div className="ring-perspective">
            <div className="ring-tilt">
              <div className="ring-rotor" ref={rotor}>
                {projects.map((project, i) => (
                  <button
                    key={project.id}
                    data-project={i}
                    className={`ring-card ${i === active ? "is-active" : ""}`}
                    style={
                      {
                        "--card-angle": `${i * angle}deg`,
                        "--project-color": project.color,
                      } as CSSProperties
                    }
                    tabIndex={i === active ? 0 : -1}
                    aria-label={`Open ${project.name}, ${project.category}, media pack visual`}
                    aria-current={i === active ? "true" : undefined}
                    onClick={(e) => {
                      if (e.detail === 0)
                        openCard(
                          project,
                          e.currentTarget.getBoundingClientRect(),
                        );
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 700px) 65vw, 430px"
                      draggable={false}
                      style={project.videos?.length ? { objectFit: "contain", background: "#0b0b0d" } : undefined}
                    />
                    {project.videos?.[0] && (
                      <VideoPreview
                        src={project.videos[0].src.replace(/\.mp4$/, "-preview.mp4")}
                        enabled={!paused && Math.abs(wrap(i - active + Math.floor(projects.length / 2)) - Math.floor(projects.length / 2)) <= 1}
                        renderAsCanvas
                      />
                    )}
                    <div className="ring-card-overlay">
                      <span>{project.name}</span>
                      <Arrow />
                    </div>
                    <span className="ring-card-number">
                      {String(i + 1).padStart(2, "0")} / VISUAL
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="orbit-info">
          <div className="orbit-project" key={p.id}>
            <span className="eyebrow muted">
              {p.category} / {p.year}
            </span>
            <button
              onClick={() =>
                openCard(
                  p,
                  stage.current
                    ?.querySelector<HTMLElement>(`[data-project="${active}"]`)
                    ?.getBoundingClientRect(),
                )
              }
            >
              {p.name}
              <Arrow />
            </button>
          </div>
          <div className="orbit-instructions">
            <span className="drag-symbol">↔</span>
            <span>
              SCROLL TO ROTATE 180°
              <br />
              <span className="muted">CLICK TO DISCOVER</span>
            </span>
          </div>
          <div className="orbit-controls">
            <button
              className="orbit-auto-toggle"
              aria-pressed={autoPaused}
              aria-label={
                autoPaused
                  ? "Resume automatic rotation"
                  : "Pause automatic rotation"
              }
              onClick={() => {
                state.current.autoPaused = !autoPaused;
                setAutoPaused(!autoPaused);
                wake.current();
              }}
            >
              {autoPaused ? "PLAY" : "PAUSE"}
            </button>
            <button
              className="circle-button"
              onClick={() => move(-1)}
              aria-label="Previous project"
            >
              <Arrow direction="left" />
            </button>
            <span className="orbit-counter">
              {String(active + 1).padStart(2, "0")}
              <span> / {projects.length}</span>
            </span>
            <button
              className="circle-button"
              onClick={() => move(1)}
              aria-label="Next project"
            >
              <Arrow direction="right" />
            </button>
          </div>
        </div>
        <div className="orbit-scroll-progress" aria-hidden="true">
          <span />
        </div>
        <a className="orbit-skip" href="#services">
          Continue to services <Arrow direction="down" />
        </a>
        <div className="demo-caption">
          <span className="tiny-cross">+</span> INDEPENDENT EXPLORATIONS. ALL
          SELECTED VISUALS FROM THE MEDIA PACK.
        </div>
      </div>
    </section>
  );
}
