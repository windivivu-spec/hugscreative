"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import ServiceMediaViewer, {
  type MediaSelection,
} from "@/components/ui/ServiceMediaViewer";
import FloatingMediaCard from "@/components/ui/FloatingMediaCard";
import { Arrow } from "@/components/ui/Icons";
import { homepageServices as services } from "@/data/services";
import { serviceVisuals } from "@/data/service-visuals";
import { site } from "@/data/site";

const titles = [
  <>
    <em>Graphic</em> design
  </>,
  <>
    <em>Illustration</em> design
  </>,
  <>
    Video &amp; <em>motion</em>
  </>,
  <>
    <em>Web</em> design
  </>,
  <>
    <em>Social</em> media
  </>,
  <>
    Event <em>photography</em>
  </>,
];
export default function ServiceScope({
  onContact,
}: {
  onContact: (service?: string) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const compactTransition = useRef<gsap.core.Timeline | null>(null);
  const compactDrift = useRef<gsap.core.Tween | null>(null);
  const compactActiveRef = useRef(0);
  const compactStageRef = useRef(false);
  const [selection, setSelection] = useState<MediaSelection | null>(null);
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [compactStage, setCompactStage] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [docHidden, setDocHidden] = useState(false);
  const [timerNonce, setTimerNonce] = useState(0);
  const isInteractiveStage = animated || compactStage;

  const startCompactDrift = useCallback((scene: HTMLElement | undefined) => {
    if (!scene || !compactStageRef.current) return;
    compactDrift.current?.kill();
    const cards = scene.querySelectorAll<HTMLElement>(".floating-card");
    if (!cards.length) return;
    compactDrift.current = gsap.to(cards, {
      x: (j) => (j % 2 ? 1 : -1) * 8,
      y: (j) => (j % 2 ? -1 : 1) * 12,
      rotation: (j) => (j % 2 ? 1 : -1) * 1.5,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const transitionCompactScene = useCallback(
    (nextRaw: number) => {
      const node = root.current;
      if (!node || !compactStageRef.current) return;
      const scenes = Array.from(
        node.querySelectorAll<HTMLElement>(".service-scene"),
      );
      if (!scenes.length) return;
      const next =
        ((nextRaw % services.length) + services.length) % services.length;
      const from = compactActiveRef.current;
      if (from === next && !compactTransition.current?.isActive()) return;

      compactTransition.current?.kill();
      compactDrift.current?.kill();
      compactActiveRef.current = next;
      setActive(next);
      node.style.setProperty(
        "--services-progress",
        `${((next + 1) / services.length) * 100}%`,
      );

      scenes.forEach((scene, k) => {
        if (k !== from && k !== next) {
          gsap.set(scene, { autoAlpha: 0 });
        }
      });

      const nextScene = scenes[next];
      const nextCards = nextScene.querySelectorAll<HTMLElement>(".floating-card");
      const nextCluster = nextScene.querySelector<HTMLElement>(".media-cluster");
      const nextCopy = nextScene.querySelector<HTMLElement>(".service-copy");

      const tl = gsap.timeline({
        onComplete: () => {
          compactTransition.current = null;
          startCompactDrift(nextScene);
        },
      });
      compactTransition.current = tl;

      let enterAt = 0;
      if (from !== next && scenes[from]) {
        const fromScene = scenes[from];
        const fromCards =
          fromScene.querySelectorAll<HTMLElement>(".floating-card");
        const fromCluster =
          fromScene.querySelector<HTMLElement>(".media-cluster");
        const fromCopy = fromScene.querySelector<HTMLElement>(".service-copy");
        tl.to(
          fromCopy,
          {
            y: -28,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.24,
            ease: "power2.in",
          },
          0,
        );
        tl.to(
          fromCluster,
          { filter: "blur(14px)", duration: 0.3, ease: "power2.in" },
          0,
        );
        tl.to(
          fromCards,
          {
            x: (j) => (j % 2 ? 1 : -1) * (window.innerWidth < 700 ? 150 : 380),
            y: (j) => (j < 3 ? -1 : 1) * 140,
            rotation: (j) => (j % 2 ? 18 : -18),
            scale: 0.82,
            opacity: 0,
            duration: 0.28,
            stagger: 0.012,
            ease: "power2.in",
          },
          0,
        );
        tl.set(fromScene, { autoAlpha: 0 }, 0.32);
        enterAt = 0.22;
      }

      tl.set(nextScene, { autoAlpha: 1 }, enterAt);
      tl.fromTo(
        nextCluster,
        { filter: "blur(14px)" },
        { filter: "blur(0px)", duration: 0.38, ease: "power2.out" },
        enterAt,
      );
      tl.fromTo(
        nextCards,
        {
          x: (j) => (j % 2 ? 1 : -1) * (window.innerWidth < 700 ? 120 : 320),
          y: (j) => (j < 3 ? -1 : 1) * 130,
          rotation: (j) => (j % 2 ? 18 : -18),
          scale: 0.72,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.38,
          stagger: 0.018,
          ease: "power3.out",
        },
        enterAt,
      );
      tl.fromTo(
        nextCopy,
        { y: 32, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.34,
          ease: "power3.out",
        },
        enterAt + 0.06,
      );
    },
    [startCompactDrift],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 1001px) and (min-height: 650px)",
      () => {
        const node = root.current;
        if (!node) return;
        node.classList.add("is-motion");
        setAnimated(true);
        const ctx = gsap.context(() => {
          const scenes = gsap.utils.toArray<HTMLElement>(".service-scene");
          gsap.set(scenes, { autoAlpha: 0 });
          gsap.set(scenes[0], { autoAlpha: 1 });
          const tl = gsap.timeline({
            onUpdate: () =>
              setActive(
                Math.min(
                  services.length - 1,
                  Math.floor(timeline.current?.time() ?? 0),
                ),
              ),
            scrollTrigger: {
              trigger: node,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                node.style.setProperty(
                  "--services-progress",
                  `${self.progress * 100}%`,
                ),
            },
          });
          timeline.current = tl;
          scenes.forEach((scene, i) => {
            const cards = scene.querySelectorAll(".floating-card");
            const cluster = scene.querySelector(".media-cluster");
            const copy = scene.querySelector(".service-copy");
            // Each chapter owns a separate interval. The previous scene is
            // fully hidden before the next one can enter, in either direction.
            if (i > 0) {
              tl.set(scene, { autoAlpha: 1 }, i);
              tl.fromTo(
                cluster,
                { filter: "blur(14px)" },
                { filter: "blur(0px)", duration: 0.34, ease: "none" },
                i,
              );
              tl.fromTo(
                cards,
                {
                  x: (j) => (j % 2 ? 1 : -1) * (innerWidth < 700 ? 120 : 320),
                  y: (j) => (j < 3 ? -1 : 1) * 130,
                  rotation: (j) => (j % 2 ? 18 : -18),
                  scale: 0.72,
                  opacity: 0,
                },
                {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 0.26,
                  stagger: 0.018,
                  ease: "none",
                },
                i,
              );
              tl.fromTo(
                copy,
                { y: 32, opacity: 0, filter: "blur(8px)" },
                {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.24,
                  ease: "none",
                },
                i + 0.06,
              );
            }
            // Keep the composition moving gently throughout the reading interval,
            // including the first and final chapters.
            tl.to(
              cards,
              {
                x: (j) => (j % 2 ? 1 : -1) * 10,
                y: (j) => (j % 2 ? -1 : 1) * 18,
                rotation: (j) => (j % 2 ? 1 : -1) * 2,
                duration:
                  i === 0 ? 0.62 : i === services.length - 1 ? 0.66 : 0.3,
                ease: "none",
              },
              i + (i === 0 ? 0 : 0.34),
            );
            if (i < services.length - 1) {
              tl.to(
                copy,
                {
                  y: -28,
                  opacity: 0,
                  filter: "blur(8px)",
                  duration: 0.22,
                  ease: "none",
                },
                i + 0.64,
              );
              tl.to(
                cluster,
                { filter: "blur(14px)", duration: 0.3, ease: "none" },
                i + 0.64,
              );
              tl.to(
                cards,
                {
                  x: (j) => (j % 2 ? 1 : -1) * (innerWidth < 700 ? 180 : 460),
                  y: (j) => (j < 3 ? -1 : 1) * 160,
                  rotation: (j) => (j % 2 ? 18 : -18),
                  scale: 0.82,
                  opacity: 0,
                  duration: 0.26,
                  stagger: 0.012,
                  ease: "none",
                },
                i + 0.64,
              );
              tl.set(scene, { autoAlpha: 0 }, i + 0.98);
            }
          });
          tl.to({}, { duration: 0.38 }, services.length - 0.38);
        }, node);
        return () => {
          ctx.revert();
          timeline.current = null;
          node.classList.remove("is-motion");
          node.style.removeProperty("--services-progress");
          setAnimated(false);
        };
      },
    );
    mm.add(
      "(prefers-reduced-motion: no-preference) and (max-width: 1000px), (prefers-reduced-motion: no-preference) and (min-width: 1001px) and (max-height: 649px)",
      () => {
        const node = root.current;
        if (!node) return;
        compactStageRef.current = true;
        node.classList.add("is-compact-stage");
        setCompactStage(true);
        const scenes = Array.from(
          node.querySelectorAll<HTMLElement>(".service-scene"),
        );
        const startIdx = Math.min(services.length - 1, compactActiveRef.current);
        compactActiveRef.current = startIdx;
        setActive(startIdx);
        node.style.setProperty(
          "--services-progress",
          `${((startIdx + 1) / services.length) * 100}%`,
        );
        const ctx = gsap.context(() => {
          gsap.set(scenes, { clearProps: "all" });
          gsap.set(
            node.querySelectorAll(
              ".media-cluster, .floating-card, .service-copy",
            ),
            { clearProps: "all" },
          );
          gsap.set(scenes, { autoAlpha: 0 });
          if (scenes[startIdx]) {
            gsap.set(scenes[startIdx], { autoAlpha: 1 });
            startCompactDrift(scenes[startIdx]);
          }
        }, node);
        return () => {
          compactStageRef.current = false;
          compactTransition.current?.kill();
          compactTransition.current = null;
          compactDrift.current?.kill();
          compactDrift.current = null;
          ctx.revert();
          gsap.set(
            node.querySelectorAll(
              ".service-scene, .media-cluster, .floating-card, .service-copy",
            ),
            { clearProps: "all" },
          );
          node.classList.remove("is-compact-stage");
          node.style.removeProperty("--services-progress");
          setCompactStage(false);
        };
      },
    );
    return () => mm.revert();
  }, [startCompactDrift]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    const onVisibility = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!compactStage || autoPaused || !inView || docHidden || selection) return;
    const id = window.setTimeout(() => {
      transitionCompactScene(compactActiveRef.current + 1);
    }, 2500);
    return () => window.clearTimeout(id);
  }, [
    compactStage,
    autoPaused,
    inView,
    docHidden,
    selection,
    active,
    timerNonce,
    transitionCompactScene,
  ]);

  const jump = useCallback(
    (index: number) => {
      const node = root.current;
      const trigger = timeline.current?.scrollTrigger;
      if (node && trigger) {
        const progress = (index + 0.46) / services.length;
        window.scrollTo({
          top:
            node.getBoundingClientRect().top +
            window.scrollY +
            (node.offsetHeight -
              (node.querySelector<HTMLElement>(".services-stage")?.offsetHeight ??
                innerHeight)) *
              progress,
          behavior: "instant",
        });
      } else if (compactStageRef.current) {
        transitionCompactScene(index);
        setTimerNonce((n) => n + 1);
      } else {
        node
          ?.querySelectorAll<HTMLElement>(".service-scene")
          [index]?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    },
    [transitionCompactScene],
  );

  useEffect(() => {
    const navigate = () => {
      if (location.hash === "#event-photography") {
        jump(services.findIndex((service) => service.slug === "event-photography"));
        if (compactStageRef.current) {
          root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("hashchange", navigate);
    navigate();
    return () => window.removeEventListener("hashchange", navigate);
  }, [jump]);
  return (
    <section
      ref={root}
      id="services"
      className="services-section services-v2"
      aria-label="What we do — six creative services"
    >
      <div className="services-stage">
        <div className="services-top">
          <SectionLabel index="02">WHAT WE DO</SectionLabel>
          <span className="eyebrow muted">
            SIX DISCIPLINES. ONE PROJECT LEAD.
          </span>
        </div>
        <div className="services-halo" aria-hidden="true" />
        {services.map((service, i) => (
          <article
            key={service.title}
            id={service.slug === "event-photography" ? "event-photography" : undefined}
            className={`service-scene scene-${i === 1 ? 0 : i > 1 ? i - 1 : i} service-${service.slug}`}
            inert={isInteractiveStage && active !== i}
            aria-label={service.title}
          >
            <div
              className={`media-cluster${service.slug === "social-media" ? " client-media-cluster" : ""}`}
            >
              {serviceVisuals[i].map((media, j) => (
                <FloatingMediaCard
                  key={j}
                  media={media}
                  index={j}
                  active={!selection && (!isInteractiveStage || active === i)}
                  label={`${service.shortTitle} — ${j + 1}`}
                  onOpen={(origin, ratio, thumbnail) =>
                    setSelection({
                      media,
                      origin,
                      ratio,
                      thumbnail,
                      label: media.projectName,
                    })
                  }
                />
              ))}
            </div>
            <div className="service-copy">
              <span className="service-count">
                0{i + 1}
                <span>/ 06</span>
              </span>
              <h2 aria-label={service.title}>{titles[i]}</h2>
              <p>{service.description}</p>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {(service.note || service.slug === "event-photography") && (
                <p className="service-detail-note">
                  {service.slug === "event-photography" ? site.photographyCoverage : service.note}
                </p>
              )}
              <div className="service-scene-actions">
                <button
                  className="glass-button"
                  onClick={() => onContact(service.title)}
                >
                  Discuss this service <Arrow />
                </button>
                {service.workHref && (
                  <Link className="text-link" href={service.workHref}>
                    Explore {service.shortTitle.toLowerCase()} projects{" "}
                    <Arrow />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
        <div className="services-bottom">
          <nav className="service-chapter-nav" aria-label="Choose a service">
            {services.map((s, i) => (
              <button
                key={s.title}
                onClick={() => jump(i)}
                aria-label={`Go to ${s.title}`}
                aria-current={
                  isInteractiveStage && active === i ? "step" : undefined
                }
              >
                <span>0{i + 1}</span>
                <span className="chapter-name">{s.shortTitle}</span>
              </button>
            ))}
          </nav>
          <div className="services-bottom-meta">
            {compactStage && (
              <div
                className="service-stage-controls"
                aria-label="Service slideshow controls"
              >
                <button
                  type="button"
                  className="circle-button"
                  onClick={() =>
                    jump((active - 1 + services.length) % services.length)
                  }
                  aria-label="Previous service"
                >
                  <Arrow direction="left" />
                </button>
                <button
                  type="button"
                  className="service-auto-toggle"
                  aria-pressed={autoPaused}
                  aria-label={
                    autoPaused
                      ? "Resume automatic service rotation"
                      : "Pause automatic service rotation"
                  }
                  onClick={() => {
                    setAutoPaused((p) => !p);
                    setTimerNonce((n) => n + 1);
                  }}
                >
                  {autoPaused ? "PLAY" : "PAUSE"}
                </button>
                <button
                  type="button"
                  className="circle-button"
                  onClick={() => jump((active + 1) % services.length)}
                  aria-label="Next service"
                >
                  <Arrow direction="right" />
                </button>
              </div>
            )}
            <a href="#about" className="text-link service-skip">
              Continue <Arrow direction="down" />
            </a>
          </div>
          <div className="services-reading-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      {selection && (
        <ServiceMediaViewer
          selection={selection}
          onClose={() => setSelection(null)}
        />
      )}
    </section>
  );
}
