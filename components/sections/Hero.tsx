"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassButton from "@/components/ui/GlassButton";
import RevealText from "@/components/ui/RevealText";
import { Arrow, Asterisk } from "@/components/ui/Icons";
export default function Hero({ onContact }: { onContact: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.to(".hero-image", {
          yPercent: 16,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-main", {
          y: 100,
          opacity: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={root}
      className="hero"
      id="home"
      aria-labelledby="hero-heading"
    >
      <div className="hero-image">
        <Image
          src="/media/dunes.jpg"
          alt="Sweeping sand dunes, sculpted by light and movement"
          fill
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
      <div className="hero-shade" />
      <div className="hero-main">
        <div className="eyebrow hero-eyebrow">
          <span className="tiny-cross">+</span> HUGs CREATIVE / DESIGN · VIDEO ·
          WEB · SOCIAL
        </div>
        <h1 id="hero-heading">
          <RevealText
            lines={[
              <>
                We <em>make</em>
              </>,
              <>brands move.</>,
            ]}
          />
        </h1>
        <div className="hero-under">
          <p>
            Design, video editing, websites, social content,
            <br className="desktop-break" /> and event photography — one
            dedicated contact.
          </p>
          <div className="hero-actions">
            <GlassButton onClick={onContact} primary>
              Start a project
            </GlassButton>
            <a href="#work" className="text-link">
              View our work <Arrow direction="down" />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-side-note">
        <Asterisk />
        <span>
          BORN IN DA NANG.
          <br />
          DRIVEN BY CREATIVITY.
        </span>
      </div>
      <div className="hero-bottom">
        <a href="#services" className="scroll-cue">
          <span className="scroll-line" /> SCROLL TO EXPLORE{" "}
          <Arrow direction="down" />
        </a>
        <div className="hero-caption">
          <span className="status-dot" /> EVENT PHOTOGRAPHY / LOCATION ON
          REQUEST.
        </div>
        <span className="hero-coordinate">CREATIVE WITHOUT LIMITS. ©26</span>
      </div>
      <div className="hero-frame" aria-hidden="true">
        <span>FRAME 001 — THE OPENING</span>
        <span>16:9 / IN FULL COLOR</span>
      </div>
    </section>
  );
}
