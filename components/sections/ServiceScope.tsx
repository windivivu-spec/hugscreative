"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
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

const chapterCenter = 0.49;
const chapterSnapDistance = 36;
const autoplayOrder = serviceVisuals.flatMap((media) =>
  media.flatMap((item) => item.autoplaySrc ? [item.projectId] : []),
);

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
  warmPreviews = false,
}: {
  onContact: (service?: string) => void;
  warmPreviews?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chapterNav = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const scrollTween = useRef<gsap.core.Tween | null>(null);
  const compactTransition = useRef<gsap.core.Timeline | null>(null);
  const compactSettle = useRef<gsap.core.Tween | null>(null);
  const compactDrift = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(0);
  const compactActiveRef = useRef(0);
  const compactStageRef = useRef(false);
  const swipe = useRef<{
    mode: "compact" | "scroll";
    pointerId: number;
    x: number;
    y: number;
    horizontal: boolean;
    target?: number;
    navStart: number;
    scrollStart: number;
    startChapter: number;
  } | null>(null);
  const suppressClickUntil = useRef(0);
  const [selection, setSelection] = useState<MediaSelection | null>(null);
  const [active, setActive] = useState(0);
  const [previewChapter, setPreviewChapter] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const [compactStage, setCompactStage] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [docHidden, setDocHidden] = useState(false);
  const [timerNonce, setTimerNonce] = useState(0);
  const [touching, setTouching] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const [warmedCount, setWarmedCount] = useState(0);
  const isInteractiveStage = animated || compactStage;

  useEffect(() => {
    if (!warmPreviews || !isInteractiveStage || warmedCount >= autoplayOrder.length)
      return;
    // Warm the actual preview elements so they can reuse their buffered data.
    const timer = window.setTimeout(() => setWarmedCount((count) => count + 1), 220);
    return () => window.clearTimeout(timer);
  }, [warmPreviews, isInteractiveStage, warmedCount]);

  useEffect(() => {
    const nav = chapterNav.current;
    if (!nav || !compactStage) return;
    const alignChapter = (behavior: ScrollBehavior) => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const button = nav.querySelector<HTMLElement>('[aria-current="step"]');
      if (!button) return;
      nav.scrollTo({
        left:
          nav.scrollLeft +
          button.getBoundingClientRect().left -
          nav.getBoundingClientRect().left -
          (nav.clientWidth - button.offsetWidth) / 2,
        behavior,
      });
    };
    alignChapter(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    );
    let lastWidth = nav.clientWidth;
    const observer = new ResizeObserver(() => {
      if (nav.clientWidth === lastWidth) return;
      lastWidth = nav.clientWidth;
      alignChapter("instant");
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active, compactStage]);

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

      compactSettle.current?.kill();
      compactTransition.current?.kill();
      compactDrift.current?.kill();
      chapterNav.current?.style.removeProperty("scroll-snap-type");
      gsap.set(scenes, { clearProps: "transform" });
      compactActiveRef.current = next;
      activeRef.current = next;
      setActive(next);
      setPreviewChapter(null);
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
          setPreviewChapter(next);
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
        let currentChapter = -1;
        let playingChapter: number | null = null;
        const ctx = gsap.context(() => {
          const scenes = gsap.utils.toArray<HTMLElement>(".service-scene");
          gsap.set(scenes, { autoAlpha: 0 });
          gsap.set(scenes[0], { autoAlpha: 1 });
          const tl = gsap.timeline({
            onUpdate(this: gsap.core.Timeline) {
              const time = this.time();
              const index = Math.min(services.length - 1, Math.floor(time));
              if (index !== currentChapter) {
                currentChapter = index;
                activeRef.current = index;
                setActive(index);
              }
              const chapterTime = time - index;
              const alreadyPlaying = playingChapter === index;
              const canPlay = serviceVisuals[index].some((media) => media.autoplaySrc) &&
                chapterTime >= (alreadyPlaying ? 0.30 : 0.34) &&
                chapterTime <= (alreadyPlaying ? 0.68 : 0.64);
              const nextPreview = canPlay ? index : null;
              if (nextPreview !== playingChapter) {
                playingChapter = nextPreview;
                setPreviewChapter(nextPreview);
              }
            },
            scrollTrigger: {
              trigger: node,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.22,
              snap: {
                inertia: false,
                delay: 0.24,
                duration: { min: 0.12, max: 0.22 },
                ease: "power2.out",
                snapTo: (progress, trigger) => {
                  if (!trigger) return progress;
                  const index = Math.min(
                    services.length - 1,
                    Math.floor(progress * services.length),
                  );
                  const center = (index + chapterCenter) / services.length;
                  const distance = Math.abs(center - progress) * (trigger.end - trigger.start);
                  return distance <= chapterSnapDistance ? center : progress;
                },
              },
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
            const copy = scene.querySelector(".service-copy");
            // Each chapter owns a separate interval. The previous scene is
            // fully hidden before the next one can enter, in either direction.
            if (i > 0) {
              tl.set(scene, { autoAlpha: 1 }, i);
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
                { y: 32, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.24,
                  ease: "none",
                },
                i + 0.06,
              );
            }
            if (i < services.length - 1) {
              tl.to(
                copy,
                {
                  y: -28,
                  opacity: 0,
                  duration: 0.22,
                  ease: "none",
                },
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
          scrollTween.current?.kill();
          scrollTween.current = null;
          ctx.revert();
          timeline.current = null;
          setPreviewChapter(null);
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
        activeRef.current = startIdx;
        setActive(startIdx);
        setPreviewChapter(startIdx);
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
            {
              clearProps: "transform,translate,rotate,scale,opacity,visibility,filter",
            },
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
          compactSettle.current?.kill();
          compactSettle.current = null;
          chapterNav.current?.style.removeProperty("scroll-snap-type");
          compactTransition.current = null;
          compactDrift.current?.kill();
          compactDrift.current = null;
          ctx.revert();
          gsap.set(
            node.querySelectorAll(
              ".service-scene, .media-cluster, .floating-card, .service-copy",
            ),
            {
              clearProps: "transform,translate,rotate,scale,opacity,visibility,filter",
            },
          );
          node.classList.remove("is-compact-stage");
          node.style.removeProperty("--services-progress");
          setPreviewChapter(null);
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
    if (!compactStage || autoPaused || touching || !inView || docHidden || selection ||
      window.matchMedia("(max-width: 767px)").matches)
      return;
    const id = window.setTimeout(() => {
      transitionCompactScene(compactActiveRef.current + 1);
    }, 2500);
    return () => window.clearTimeout(id);
  }, [
    compactStage,
    autoPaused,
    touching,
    inView,
    docHidden,
    selection,
    active,
    timerNonce,
    transitionCompactScene,
  ]);

  const scrollToChapter = useCallback((index: number, instant = false) => {
    const trigger = timeline.current?.scrollTrigger;
    if (!trigger) return;
    const clampedIndex = ((index % services.length) + services.length) % services.length;
    const progress = (clampedIndex + chapterCenter) / services.length;
    const destination = Math.round(
      trigger.start + (trigger.end - trigger.start) * progress,
    );
    scrollTween.current?.kill();
    scrollTween.current = null;
    if (instant || Math.abs(window.scrollY - destination) < 2) {
      window.scrollTo({ top: destination, behavior: "instant" });
      return;
    }
    const proxy = { y: window.scrollY };
    scrollTween.current = gsap.to(proxy, {
      y: destination,
      duration: 0.44,
      ease: "power2.out",
      onUpdate: () => {
        window.scrollTo({ top: proxy.y, behavior: "instant" });
      },
      onComplete: () => {
        scrollTween.current = null;
      },
    });
  }, []);

  const jump = useCallback(
    (index: number, instant = false) => {
      const node = root.current;
      const trigger = timeline.current?.scrollTrigger;
      if (node && trigger) {
        scrollToChapter(index, instant);
      } else if (compactStageRef.current) {
        setAutoPaused(true);
        transitionCompactScene(index);
        setTimerNonce((n) => n + 1);
      } else {
        node
          ?.querySelectorAll<HTMLElement>(".service-scene")
          [index]?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    },
    [scrollToChapter, transitionCompactScene],
  );

  const stepChapter = useCallback(
    (delta: -1 | 1) => {
      const base = compactStageRef.current
        ? compactActiveRef.current
        : activeRef.current;
      jump((base + delta + services.length) % services.length);
    },
    [jump],
  );

  const finishSwipe = (commit: boolean, signedDx = 0) => {
    const gesture = swipe.current;
    swipe.current = null;
    setTouching(false);
    setSwiping(false);
    if (!gesture?.horizontal || !root.current) return;

    if (gesture.mode === "scroll") {
      const from = gesture.startChapter;
      const next = commit
        ? (from + (signedDx < 0 ? 1 : -1) + services.length) % services.length
        : from;
      scrollToChapter(next);
      return;
    }

    if (gesture.target === undefined) return;
    const node = root.current;
    const scenes = Array.from(node.querySelectorAll<HTMLElement>(".service-scene"));
    const from = compactActiveRef.current;
    const next = gesture.target;
    const chosen = commit ? next : from;
    const tl = compactTransition.current;
    if (!tl) return;
    compactSettle.current?.kill();
    compactSettle.current = gsap.to(tl, {
      progress: commit ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        if (commit) {
          compactActiveRef.current = next;
          activeRef.current = next;
          setActive(next);
          node.style.setProperty("--services-progress", `${((next + 1) / services.length) * 100}%`);
          setAutoPaused(true);
        }
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[chosen], { autoAlpha: 1 });
        gsap.set(scenes[chosen].querySelectorAll(".media-cluster, .floating-card, .service-copy"), {
          clearProps: "transform,translate,rotate,scale,opacity,visibility,filter",
        });
        tl.kill();
        chapterNav.current?.style.removeProperty("scroll-snap-type");
        compactTransition.current = null;
        compactSettle.current = null;
        setPreviewChapter(chosen);
        startCompactDrift(scenes[chosen]);
      },
    });
  };

  const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) {
      finishSwipe(false);
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const mode = compactStageRef.current
      ? "compact"
      : timeline.current?.scrollTrigger
        ? "scroll"
        : null;
    if (
      !mode ||
      selection ||
      (event.target as Element).closest(
        ".services-bottom, a, button:not(.floating-card)",
      )
    )
      return;
    swipe.current = {
      mode,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      horizontal: false,
      navStart: chapterNav.current?.scrollLeft ?? 0,
      scrollStart: window.scrollY,
      startChapter: mode === "compact" ? compactActiveRef.current : activeRef.current,
    };
    setTouching(true);
  };

  const moveSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = swipe.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = Math.abs(event.clientX - gesture.x);
    const dy = Math.abs(event.clientY - gesture.y);
    if (!gesture.horizontal && dy > 12 && dy >= dx) {
      finishSwipe(false);
      return;
    }
    if (!gesture.horizontal && dx > 12 && dx > dy * 1.3) {
      gesture.horizontal = true;
      setSwiping(true);
      window.getSelection()?.removeAllRanges();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable.
      }
    }
    if (!gesture.horizontal || !root.current) return;
    const signedDx = event.clientX - gesture.x;

    if (gesture.mode === "scroll") {
      const trigger = timeline.current?.scrollTrigger;
      if (!trigger) return;
      scrollTween.current?.kill();
      scrollTween.current = null;
      const chapterSpan = (trigger.end - trigger.start) / services.length;
      const dragWidth = Math.min(480, Math.max(260, root.current.clientWidth * 0.42));
      const targetScroll = Math.max(
        trigger.start,
        Math.min(
          trigger.end,
          gesture.scrollStart - (signedDx / dragWidth) * chapterSpan,
        ),
      );
      window.scrollTo({ top: targetScroll, behavior: "instant" });
      return;
    }

    const from = compactActiveRef.current;
    const next = (from + (signedDx < 0 ? 1 : -1) + services.length) % services.length;
    const scenes = Array.from(root.current.querySelectorAll<HTMLElement>(".service-scene"));
    if (gesture.target !== next) {
      setPreviewChapter(null);
      compactSettle.current?.kill();
      compactTransition.current?.kill();
      compactDrift.current?.kill();
      gsap.set(scenes, { autoAlpha: 0 });
      [scenes[from], scenes[next]].forEach((scene) => {
        gsap.set(scene.querySelectorAll('.media-cluster, .floating-card, .service-copy'), {
          clearProps: "transform,translate,rotate,scale,opacity,visibility,filter",
        });
      });
      gsap.set(scenes[from], { autoAlpha: 1 });
      const fromCards = scenes[from].querySelectorAll<HTMLElement>(".floating-card");
      const nextCards = scenes[next].querySelectorAll<HTMLElement>(".floating-card");
      const fromCopy = scenes[from].querySelector<HTMLElement>(".service-copy");
      const nextCopy = scenes[next].querySelector<HTMLElement>(".service-copy");
      const fromCluster = scenes[from].querySelector<HTMLElement>(".media-cluster");
      const nextCluster = scenes[next].querySelector<HTMLElement>(".media-cluster");
      const tl = gsap.timeline({ paused: true });
      tl.to(fromCopy, { y: -28, opacity: 0, filter: "blur(8px)", duration: 0.45, ease: "none" }, 0);
      tl.to(fromCluster, { filter: "blur(14px)", duration: 0.55, ease: "none" }, 0);
      tl.to(fromCards, { x: (j) => (j % 2 ? 1 : -1) * 150, y: (j) => (j < 3 ? -1 : 1) * 140, rotation: (j) => (j % 2 ? 18 : -18), scale: 0.82, opacity: 0, duration: 0.45, stagger: 0.012, ease: "none" }, 0);
      tl.set(scenes[next], { autoAlpha: 1 }, 0.42);
      tl.set(scenes[from], { autoAlpha: 0 }, 0.56);
      tl.fromTo(nextCluster, { filter: "blur(14px)" }, { filter: "blur(0px)", duration: 0.44, ease: "none" }, 0.42);
      tl.fromTo(nextCards, { x: (j) => (j % 2 ? 1 : -1) * 120, y: (j) => (j < 3 ? -1 : 1) * 130, rotation: (j) => (j % 2 ? 18 : -18), scale: 0.72, opacity: 0 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.4, stagger: 0.012, ease: "none" }, 0.42);
      tl.fromTo(nextCopy, { y: 32, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "none" }, 0.46);
      const nav = chapterNav.current;
      const targetButton = nav?.querySelectorAll<HTMLButtonElement>("button")[next];
      if (nav && targetButton && window.matchMedia("(max-width: 767px)").matches) {
        nav.style.scrollSnapType = "none";
        const navRect = nav.getBoundingClientRect();
        const targetScroll = nav.scrollLeft + targetButton.getBoundingClientRect().left - navRect.left -
          (nav.clientWidth - targetButton.offsetWidth) / 2;
        const maxScroll = nav.scrollWidth - nav.clientWidth;
        const destination = Math.max(0, Math.min(maxScroll, targetScroll));
        tl.eventCallback("onUpdate", () => {
          nav.scrollLeft = gesture.navStart + (destination - gesture.navStart) * tl.progress();
        });
      }
      compactTransition.current = tl;
      gesture.target = next;
    }
    const progress = Math.min(1, Math.abs(signedDx) / Math.max(1, root.current.clientWidth));
    compactTransition.current?.progress(progress);
  };

  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = swipe.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      finishSwipe(false);
      return;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore if already released.
      }
    }
    // A drag over an artwork must not also open its media viewer.
    suppressClickUntil.current = performance.now() + 500;
    finishSwipe(Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.3, dx);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isInteractiveStage || selection) return;
    let cooldownUntil = 0;
    const onWheel = (event: WheelEvent) => {
      if ((event.target as Element).closest(".service-chapter-nav")) return;
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 24 || absX <= absY * 1.5) return;
      event.preventDefault();
      const now = performance.now();
      if (now < cooldownUntil) return;
      cooldownUntil = now + 520;
      stepChapter(event.deltaX > 0 ? 1 : -1);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [isInteractiveStage, selection, stepChapter]);

  useEffect(() => {
    const navigate = () => {
      if (location.hash === "#event-photography") {
        jump(services.findIndex((service) => service.slug === "event-photography"), true);
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
      <div
        ref={stageRef}
        className="services-stage"
        data-swiping={swiping ? "true" : undefined}
        onPointerDownCapture={startSwipe}
        onPointerMoveCapture={moveSwipe}
        onPointerUpCapture={endSwipe}
        onPointerCancel={() => finishSwipe(false)}
        onClickCapture={(event) => {
          if (
            event.detail > 0 &&
            performance.now() < suppressClickUntil.current &&
            (event.target as Element).closest(".floating-card")
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
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
                  active={
                    !selection &&
                    !docHidden &&
                    (!isInteractiveStage || active === i) &&
                    (!isInteractiveStage || !media.autoplaySrc || previewChapter === i)
                  }
                  autoplaySrc={isInteractiveStage ? media.autoplaySrc : undefined}
                  warmPreview={
                    !!media.autoplaySrc &&
                    autoplayOrder.indexOf(media.projectId) < warmedCount
                  }
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
          {compactStage && (
            <p className="service-swipe-hint">
              <span>SWIPE TO EXPLORE <Arrow direction="right" /></span>
              <span className="service-chapter-position">0{active + 1} <span>/ 06</span></span>
            </p>
          )}
          <nav
            ref={chapterNav}
            className="service-chapter-nav"
            aria-label="Choose a service"
            onPointerDown={() => {
              if (compactStageRef.current) setAutoPaused(true);
            }}
          >
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
            {isInteractiveStage && (
              <div
                className="service-stage-controls"
                aria-label="Service chapter controls"
              >
                <button
                  type="button"
                  className="circle-button"
                  onClick={() => stepChapter(-1)}
                  aria-label="Previous service"
                >
                  <Arrow direction="left" />
                </button>
                {compactStage && (
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
                )}
                <button
                  type="button"
                  className="circle-button"
                  onClick={() => stepChapter(1)}
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
