"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "@/components/ui/RevealText";
import { Arrow, Asterisk } from "@/components/ui/Icons";
import VideoPreview from "@/components/ui/VideoPreview";
export default function Hero() {
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
          src="/media/previews/hero-poster.jpg"
          alt="HUGs Creative showreel"
          fill
          priority
          sizes="100vw"
          quality={90}
        />
        <VideoPreview
          src="/media/Video/hero.mp4"
          mobileSrc="/media/Video/hero.mp4"
          preload="auto"
          playbackRate={1.15}
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
        </div>
      </div>
      <div className="hero-frame" aria-hidden="true" />
      <div className="hero-side-note">
        <Asterisk />
        <span>
          BORN IN DA NANG.
          <br />
          DRIVEN BY CREATIVITY.
        </span>
      </div>
      <div className="hero-bottom">
        <div className="hero-caption">
          <span className="status-dot" /> DA NANG, VIETNAM / REMOTE &amp; ON
          LOCATION
        </div>
        <a href="#work" className="scroll-cue">
          <span className="scroll-line" /> SCROLL TO EXPLORE{" "}
          <Arrow direction="down" />
        </a>
        <span className="hero-coordinate">CREATIVE WITHOUT LIMITS. ©26</span>
      </div>
    </section>
  );
}
