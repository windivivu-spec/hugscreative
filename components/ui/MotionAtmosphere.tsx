"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markSubpageVisit } from "@/lib/preloaderSession";

// Animate only free-flow content. Pinned scenes own their own timelines.
const revealTargets = [
  ".reel-intro > *",
  ".reel-poster",
  ".scope-heading > .section-label",
  ".scope-heading > h2",
  ".scope-heading > p",
  ".scope-list article",
  ".archive-intro",
  "#archive-heading",
  ".archive-bar",
  ".archive-card",
  ".about-top",
  "#about-heading",
  ".about-copy > *",
  ".faq-section .section-label",
  "#faq-heading",
  ".faq-list details",
  ".contact-top",
  "#contact-heading",
  ".contact-bottom",
  ".contact-channels",
  ".case-page-title > *",
  ".case-page > .detail-feature",
  ".case-facts > *",
  ".case-page .detail-gallery > *",
  ".case-cta",
].join(",");

const lightTargets =
  ".glow-card, .scope-list article, .faq-list details, .reel-poster, .ring-card, .circle-button";

export default function MotionAtmosphere() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname && pathname !== "/") markSubpageVisit();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 1001px)",
      () => {
        const seen = new WeakSet<Element>();
        const tweens = new Map<HTMLElement, gsap.core.Tween>();
        let scanFrame = 0;
        const scan = () => {
          let changed = false;
          // Release removed filter results instead of retaining their triggers.
          tweens.forEach((tween, node) => {
            if (!node.isConnected) {
              tween.scrollTrigger?.kill();
              tween.kill();
              tweens.delete(node);
              changed = true;
            }
          });
          document
            .querySelectorAll<HTMLElement>(revealTargets)
            .forEach((node) => {
              if (seen.has(node)) return;
              seen.add(node);
              changed = true;
              const siblings = Array.from(node.parentElement?.children ?? []);
              const delay = Math.min(siblings.indexOf(node) % 3, 2) * 0.04;
              const tween = gsap.fromTo(
                node,
                { opacity: 0, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.42,
                  delay,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: node,
                    start: "top bottom+=40",
                    once: true,
                    toggleActions: "play none none none",
                  },
                },
              );
              tweens.set(node, tween);
            });
          // Filtering moves surviving cards too; recalculate all reveal positions.
          if (changed) ScrollTrigger.refresh();
        };
        const queueScan = () => {
          cancelAnimationFrame(scanFrame);
          scanFrame = requestAnimationFrame(scan);
        };
        queueScan();
        const observer = new MutationObserver(queueScan);
        observer.observe(document.body, { childList: true, subtree: true });
        const revealFocused = (event: FocusEvent) => {
          const focused = event.target as Node;
          tweens.forEach((tween, node) => {
            if (node.contains(focused)) tween.progress(1);
          });
        };
        document.addEventListener("focusin", revealFocused);
        return () => {
          observer.disconnect();
          document.removeEventListener("focusin", revealFocused);
          cancelAnimationFrame(scanFrame);
          tweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.revert();
          });
        };
      },
    );

    let lightFrame = 0;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const moveLight = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      const target = (event.target as Element).closest<HTMLElement>(
        lightTargets,
      );
      cancelAnimationFrame(lightFrame);
      if (!target) return;
      const { clientX, clientY } = event;
      lightFrame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--light-x", `${clientX - rect.left}px`);
        target.style.setProperty("--light-y", `${clientY - rect.top}px`);
      });
    };
    document.addEventListener("pointermove", moveLight, { passive: true });
    return () => {
      mm.revert();
      cancelAnimationFrame(lightFrame);
      document.removeEventListener("pointermove", moveLight);
    };
  }, [pathname]);
  return null;
}
