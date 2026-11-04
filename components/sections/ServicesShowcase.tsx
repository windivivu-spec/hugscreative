"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";
import FloatingMediaCard from "@/components/ui/FloatingMediaCard";
import SectionLabel from "@/components/ui/SectionLabel";
import { Arrow } from "@/components/ui/Icons";
export default function ServicesShowcase() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLElement>(".service-scene");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(3, Math.floor(self.progress * 4));
              setActive(n);
              window.dispatchEvent(
                new CustomEvent("studio:services", {
                  detail: { state: n + 1, progress: self.progress },
                }),
              );
            },
          },
        });
        scenes.forEach((scene, i) => {
          const cards = scene.querySelectorAll(".floating-card");
          const text = scene.querySelector(".service-copy");
          if (i > 0) {
            gsap.set(scene, { autoAlpha: 0 });
            tl.set(scene, { autoAlpha: 1 }, i);
            tl.fromTo(
              cards,
              {
                x: (j) =>
                  (j % 2 === 0 ? -1 : 1) *
                  (window.innerWidth < 700 ? 180 : 360),
                y: (j) => (j < 3 ? -180 : 180),
                scale: 0.65,
                rotation: (j) => (j % 2 === 0 ? -15 : 15),
                opacity: 0,
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.48,
                stagger: 0.025,
                ease: "power2.out",
              },
              i - 0.12,
            );
            tl.fromTo(
              text,
              { y: 45, opacity: 0, filter: "blur(8px)" },
              { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.46 },
              i + 0.02,
            );
          }
          if (i < 3) {
            tl.to(
              cards,
              {
                x: (j) => (j % 2 === 0 ? -1 : 1) * window.innerWidth * 0.55,
                y: (j) => (j < 3 ? -140 : 160),
                scale: 0.75,
                rotation: (j) => (j % 2 === 0 ? -12 : 12),
                opacity: 0,
                duration: 0.46,
                stagger: 0.02,
                ease: "power1.in",
              },
              i + 0.64,
            );
            tl.to(text, { opacity: 0, y: -35, filter: "blur(6px)", duration: 0.24 }, i + 0.78);
            tl.set(scene, { autoAlpha: 0 }, i + 1.2);
          } else {
            tl.to(
              cards,
              {
                scale: 0.88,
                y: (j) => (j < 3 ? -45 : 70),
                opacity: 0.5,
                duration: 0.35,
              },
              3.65,
            );
          }
        });
        tl.to({}, { duration: 0.05 }, 3.95);
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  function goToService(index: number) {
    if (!root.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      root.current
        .querySelectorAll(".service-scene")
        [index]?.scrollIntoView({ behavior: "instant", block: "center" });
    } else {
      const top = root.current.getBoundingClientRect().top + window.scrollY;
      const travel = root.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + travel * ((index + 0.4) / 4),
        behavior: "smooth",
      });
    }
  }
  return (
    <section
      ref={root}
      id="services"
      className="services-section"
      aria-label="Our four creative services"
    >
      <div ref={stage} className="services-stage">
        <div className="services-top">
          <SectionLabel index="02">WHAT WE DO</SectionLabel>
          <span className="eyebrow muted">
            FOUR DISCIPLINES. ONE CREATIVE ORBIT.
          </span>
        </div>
        {services.map((s, i) => (
          <article
            className={`service-scene scene-${i}`}
            key={s.title}
            aria-label={s.title}
          >
            <div className="media-cluster" aria-hidden="true">
              {s.media.map((m, j) => (
                <FloatingMediaCard key={j} media={m} index={j} />
              ))}
            </div>
            <div className="service-copy">
              <span className="service-count">
                0{i + 1} <span>/ 04</span>
              </span>
              <h2>
                {i === 0 ? (
                  <>
                    <em>Graphic</em> design
                  </>
                ) : i === 1 ? (
                  <>
                    Video &amp; <em>motion</em>
                  </>
                ) : i === 2 ? (
                  <>
                    <em>Social</em> &amp; digital
                  </>
                ) : (
                  <>
                    <em>Web</em> design
                  </>
                )}
              </h2>
              <p>{s.description}</p>
              <div className="service-tags">
                {s.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
        <div className="services-bottom">
          <div className="service-progress" aria-label="Jump to service">
            {services.map((s, i) => (
              <button
                key={s.title}
                onClick={() => goToService(i)}
                aria-label={`Go to ${s.title}`}
                aria-current={i === active ? "step" : undefined}
              >
                <span className={i === active ? "active" : ""} />
                <small>0{i + 1}</small>
              </button>
            ))}
          </div>
          <span className="eyebrow muted services-scroll">
            KEEP SCROLLING <Arrow direction="down" />
          </span>
        </div>
      </div>
    </section>
  );
}
