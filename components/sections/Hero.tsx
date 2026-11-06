"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassButton from "@/components/ui/GlassButton";
import RevealText from "@/components/ui/RevealText";
import { Arrow, Asterisk } from "@/components/ui/Icons";
import VideoPreview from "@/components/ui/VideoPreview";
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
          src="/media/pack/v1-poster.webp"
          alt="Headphones in a cinematic studio spotlight"
          fill
          priority
          sizes="100vw"
          quality={90}
        />
        <VideoPreview src="/media/pack/v1-hq.mp4" />
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
          <div className="hero-copy">
            <p>
              Creative production for brands and agencies.
              <br className="desktop-break" /> Design, video, websites, and
              social content—with one dedicated project lead.
            </p>
            <a className="hero-photography" href="#event-photography">
              Event photography · Da Nang–based. Other locations by arrangement.
            </a>
          </div>
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
          <span className="status-dot" /> DA NANG, VIETNAM / REMOTE &amp; ON
          LOCATION
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
