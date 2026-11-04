"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import { Arrow } from "@/components/ui/Icons";
const steps = [
  {
    title: "Share your",
    word: "brief.",
    description:
      "Tell us about your goals, deliverables, timeline, and available assets.",
    label: "A GOOD START",
    artwork: "/media/process/brief-ny-journal.webp",
    items: [
      "Your goals & audience",
      "Deliverables & references",
      "Timeline & available assets",
    ],
  },
  {
    title: "Agree on the",
    word: "scope.",
    description:
      "We confirm the deliverables, quote, schedule, and revision rounds before work begins.",
    label: "EVERY DETAIL, ALIGNED",
    artwork: "/media/process/scope-ny-journal-v2.webp",
    items: [
      "Deliverables confirmed",
      "Quote & schedule agreed",
      "Revision rounds defined",
    ],
  },
  {
    title: "Create, review",
    word: "& deliver.",
    description:
      "We coordinate production, collect your feedback, and deliver the agreed final files.",
    label: "FROM FIRST DRAFT TO FINAL",
    artwork: "/media/process/deliver-ny-journal-v2.webp",
    items: [
      "Production in motion",
      "Your feedback, refined",
      "Final files delivered",
    ],
  },
];
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".process-panel");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.min(2, Math.floor(self.progress * 3))),
          },
        });
        const compact = window.matchMedia("(max-width: 767px)").matches;
        panels.forEach((panel, i) => {
          const copy = panel.querySelector(".process-copy");
          const art = panel.querySelector(".process-art");
          const lines = panel.querySelectorAll(".process-copy > *");
          const sheen = panel.querySelector(".process-page-sheen");
          gsap.set(panel, { zIndex: i + 1 });
          if (i > 0) {
            const entry = i - 0.28;
            gsap.set(panel, { autoAlpha: 0 });
            tl.set(panel, { autoAlpha: 1 }, entry);
            tl.fromTo(
              panel,
              { xPercent: 105 },
              {
                xPercent: 0,
                duration: 0.64,
                ease: "power2.inOut",
              },
              entry,
            );
            tl.fromTo(
              lines,
              { x: compact ? 24 : 65, opacity: 0, filter: "blur(6px)" },
              {
                x: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.46,
                stagger: 0.045,
                ease: "power2.out",
              },
              entry + 0.12,
            );
            tl.fromTo(
              art,
              {
                filter: compact ? "blur(6px)" : "blur(10px)",
                opacity: 0,
              },
              {
                filter: "blur(0px)",
                opacity: 1,
                duration: 0.58,
                ease: "power2.out",
              },
              entry + 0.06,
            );
            tl.fromTo(
              sheen,
              { xPercent: -110, opacity: 0 },
              {
                xPercent: 110,
                opacity: 0.65,
                duration: 0.42,
                ease: "power1.inOut",
              },
              entry + 0.12,
            );
            tl.to(sheen, { opacity: 0, duration: 0.18 }, entry + 0.48);
          }
          if (i < panels.length - 1) {
            const exit = i + 0.64;
            tl.to(
              copy,
              {
                xPercent: -12,
                filter: compact ? "blur(6px)" : "blur(10px)",
                opacity: 0,
                duration: 0.45,
                ease: "power2.in",
              },
              exit,
            );
            tl.to(
              art,
              {
                filter: compact ? "blur(8px)" : "blur(14px)",
                opacity: 0,
                duration: 0.55,
                ease: "power2.inOut",
              },
              exit,
            );
            tl.to(
              panel,
              {
                xPercent: -110,
                duration: 0.62,
                ease: "power2.inOut",
              },
              exit,
            );
            tl.set(panel, { autoAlpha: 0 }, exit + 0.62);
          }
        });
        tl.to(
          ".process-track-fill",
          { scaleX: 1, duration: 3, ease: "none" },
          0,
        );
        tl.to({}, { duration: 0.1 }, 2.9);
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  function jump(i: number) {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current
        .querySelectorAll(".process-panel")
        [i].scrollIntoView({ block: "center" });
      return;
    }
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (root.current.offsetHeight - innerHeight) * ((i + 0.55) / 3),
      behavior: "smooth",
    });
  }
  return (
    <section
      id="process"
      className="process-section"
      ref={root}
      aria-label="How we work, three steps"
    >
      <div className="process-stage">
        <div className="process-stage-top">
          <SectionLabel index="06">HOW WE WORK</SectionLabel>
          <span className="eyebrow muted">
            ONE POINT OF CONTACT. EVERY STEP OF THE WAY.
          </span>
        </div>
        <div className="process-panels">
          {steps.map((s, i) => (
            <article className={`process-panel process-step-${i}`} key={s.word}>
              <span className="process-page-sheen" aria-hidden="true" />
              <div className="process-copy">
                <span className="eyebrow process-chapter">
                  0{i + 1} / 03 — {s.label}
                </span>
                <h2>
                  {s.title}
                  <br />
                  <em>{s.word}</em>
                </h2>
                <p>{s.description}</p>
                <a className="text-link" href="#contact">
                  Start the conversation <Arrow />
                </a>
              </div>
              <div className="process-art" aria-hidden="true">
                <span className="process-big-number">0{i + 1}</span>
                <figure className="process-newspaper">
                  <Image src={s.artwork} alt="" width={1086} height={1448} sizes="(max-width: 767px) 180px, (max-height: 700px) 260px, 420px" />
                </figure>
                <span className="process-orbit" />
              </div>
            </article>
          ))}
        </div>
        <div className="process-stage-bottom">
          <nav aria-label="Process steps">
            {steps.map((s, i) => (
              <button
                key={s.word}
                onClick={() => jump(i)}
                aria-current={active === i ? "step" : undefined}
              >
                <span>0{i + 1}</span>
                {["Brief", "Scope", "Deliver"][i]}
              </button>
            ))}
          </nav>
          <span className="eyebrow muted">
            SCROLL TO TURN THE PAGE <Arrow direction="left" />
          </span>
          <div className="process-track">
            <span className="process-track-fill" />
          </div>
        </div>
      </div>
    </section>
  );
}
