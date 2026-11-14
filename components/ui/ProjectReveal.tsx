"use client";
import { useEffect, useRef, type ReactNode } from "react";

export default function ProjectReveal({
  children,
  resetKey = "",
}: {
  children: ReactNode;
  resetKey?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const sync = () => {
      observer?.disconnect();
      targets.forEach((target) => target.classList.remove("reveal-pending"));
      if (motion.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove("reveal-pending");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px 50px 0px" },
      );
      targets.forEach((target) => {
        // Leave content in the viewport visible during hydration.
        if (target.getBoundingClientRect().top > window.innerHeight) {
          target.classList.add("reveal-pending");
          observer?.observe(target);
        }
      });
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", sync);
      targets.forEach((target) => target.classList.remove("reveal-pending"));
    };
  }, [resetKey]);
  return (
    <div ref={ref} className="portfolio-reveals">
      {children}
    </div>
  );
}
