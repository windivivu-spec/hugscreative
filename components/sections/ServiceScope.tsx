"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import FloatingMediaCard from "@/components/ui/FloatingMediaCard";
import { Arrow } from "@/components/ui/Icons";
import { services } from "@/data/services";
import { serviceVisuals } from "@/data/service-visuals";
import { site } from "@/data/site";

const titles = [
  <>
    <em>Graphic</em> design
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
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-height: 650px)",
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
                { filter: "blur(0px)", duration: 0.34, ease: "power2.out" },
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
                  ease: "power3.out",
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
                  ease: "power2.out",
                },
                i + 0.06,
              );
            }
            tl.to(
              cards,
              { y: (j) => (j % 2 ? -10 : 10), duration: 0.26, ease: "none" },
              i + 0.36,
            );
            if (i < services.length - 1) {
              tl.to(
                copy,
                {
                  y: -28,
                  opacity: 0,
                  filter: "blur(8px)",
                  duration: 0.14,
                  ease: "power2.in",
                },
                i + 0.66,
              );
              tl.to(
                cluster,
                { filter: "blur(14px)", duration: 0.24, ease: "power2.in" },
                i + 0.68,
              );
              tl.to(
                cards,
                {
                  x: (j) => (j % 2 ? 1 : -1) * (innerWidth < 700 ? 180 : 460),
                  y: (j) => (j < 3 ? -1 : 1) * 160,
                  rotation: (j) => (j % 2 ? 18 : -18),
                  scale: 0.82,
                  opacity: 0,
                  duration: 0.2,
                  stagger: 0.012,
                  ease: "power2.in",
                },
                i + 0.68,
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
          setAnimated(false);
        };
      },
    );
    return () => mm.revert();
  }, []);
  function jump(index: number) {
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
    } else
      node
        ?.querySelectorAll<HTMLElement>(".service-scene")
        [index]?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  useEffect(() => {
    const navigate = () => {
      if (location.hash === "#event-photography") jump(4);
    };
    window.addEventListener("hashchange", navigate);
    navigate();
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  return (
    <section
      ref={root}
      id="services"
      className="services-section services-v2"
      aria-label="What we do — five creative services"
    >
      <div className="services-stage">
        <div className="services-top">
          <SectionLabel index="02">WHAT WE DO</SectionLabel>
          <span className="eyebrow muted">
            FIVE DISCIPLINES. ONE PROJECT LEAD.
          </span>
        </div>
        <div className="services-halo" aria-hidden="true" />
        {services.map((service, i) => (
          <article
            key={service.title}
            id={i === 4 ? "event-photography" : undefined}
            className={`service-scene scene-${i}`}
            inert={animated && active !== i}
            aria-label={service.title}
          >
            <div
              className={`media-cluster${i === 3 ? " client-media-cluster" : ""}`}
              aria-hidden="true"
            >
              {serviceVisuals[i].map((media, j) => (
                <FloatingMediaCard key={j} media={media} index={j} />
              ))}
            </div>
            <div className="service-copy">
              <span className="service-count">
                0{i + 1}
                <span>/ 05</span>
              </span>
              {i === 3 && (
                <span className="service-specialty">
                  MANAGEMENT &amp; CHANNEL OPERATIONS
                </span>
              )}
              <h2 aria-label={service.title}>{titles[i]}</h2>
              <p>{service.description}</p>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {(service.note || i === 4) && (
                <p className="service-detail-note">
                  {i === 4 ? site.photographyCoverage : service.note}
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
                    Six client projects <Arrow />
                  </Link>
                )}
              </div>
              {i === 4 && (
                <small className="service-art-note">
                  PHOTOGRAPHY IMAGES / ILLUSTRATIVE DIRECTION
                </small>
              )}
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
                aria-current={animated && active === i ? "step" : undefined}
              >
                <span>0{i + 1}</span>
                <span className="chapter-name">{s.shortTitle}</span>
              </button>
            ))}
          </nav>
          <a href="#about" className="text-link service-skip">
            Continue <Arrow direction="down" />
          </a>
          <div className="services-reading-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
