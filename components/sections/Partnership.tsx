"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassButton from "@/components/ui/GlassButton";
import PartnershipSculpture from "@/components/ui/PartnershipSculpture";
export default function Partnership({ onContact }: { onContact: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".partner-line", {
          y: 45,
          opacity: 0,
          filter: "blur(8px)",
          stagger: 0.18,
          duration: 1.45,
          ease: "power2.out",
          onComplete: () => { gsap.set(".partner-line", { clearProps: "filter" }); },
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        });
        gsap.from(".partner-symbol", {
          y: 25,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            once: true,
          },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="partner-section" ref={root}>
      <div className="partner-symbol" aria-hidden="true">
        <PartnershipSculpture />
      </div>
      <div className="partner-content">
        <span className="eyebrow partner-line">
          FOR BRANDS. FOR AGENCIES. FOR THE NEXT IDEA.
        </span>
        <h2 className="partner-line">
          Your <em>vision</em>.
          <br />
          Our <em>creative</em> company.
        </h2>
        <p className="partner-line">
          A creative partner for your business — or specialist production
          support for your agency. Bring us a single project or an ongoing
          content need. We shape the right scope together.
        </p>
        <div className="partner-line">
          <GlassButton onClick={onContact} primary>
            Explore working together
          </GlassButton>
          <span className="partner-footnote">
            Based in Da Nang, Vietnam.
            <br />
            Collaborating remotely with U.S. clients.
          </span>
        </div>
      </div>
    </section>
  );
}
