"use client";
import { useState, useRef, useEffect } from "react";
import { Asterisk } from "@/components/ui/Icons";
export default function MarqueeSection() {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) =>
      setVisible(e.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={root}
      className="marquee-section"
      aria-label="Ideas in motion. Stories that connect. Built for every screen."
    >
      <div
        className={`marquee-track ${paused || !visible ? "paused" : ""}`}
        aria-hidden="true"
      >
        {[0, 1].map((n) => (
          <div className="marquee-content" key={n}>
            <span>IDEAS IN MOTION</span>
            <Asterisk />
            <span>STORIES THAT CONNECT</span>
            <Asterisk />
            <span>BUILT FOR EVERY SCREEN</span>
            <Asterisk />
          </div>
        ))}
      </div>
      <div className="marquee-footer">
        <span className="eyebrow">CREATE / PRODUCE / CONNECT</span>
        <button
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          className="marquee-pause"
        >
          {paused ? "Resume motion ↗" : "Pause motion Ⅱ"}
        </button>
      </div>
    </section>
  );
}
