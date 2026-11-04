"use client";
import { useEffect, useState } from "react";
export default function DebugPanel() {
  const [info, setInfo] = useState({
    enabled: false,
    section: "home",
    service: 1,
    progress: 0,
    project: 1,
    width: 0,
    reduced: false,
  });
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug") !== "1")
      return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setInfo((v) => ({
        ...v,
        enabled: true,
        width: window.innerWidth,
        reduced: media.matches,
      }));
    update();
    const services = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setInfo((v) => ({ ...v, service: d.state, progress: d.progress }));
    };
    const ring = (e: Event) =>
      setInfo((v) => ({ ...v, project: (e as CustomEvent).detail }));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setInfo((v) => ({
              ...v,
              section: e.target.id || e.target.className,
            }));
        });
      },
      { rootMargin: "-30% 0px -45% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((s) => observer.observe(s));
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    window.addEventListener("studio:services", services);
    window.addEventListener("studio:rotunda", ring);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
      window.removeEventListener("studio:services", services);
      window.removeEventListener("studio:rotunda", ring);
    };
  }, []);
  if (!info.enabled) return null;
  return (
    <aside className="debug-panel" aria-label="Development review">
      <strong>ORBIT / REVIEW MODE</strong>
      <span>SECTION: {info.section}</span>
      <span>
        SERVICE: {info.service}/4 · {(info.progress * 100).toFixed(1)}%
      </span>
      <span>PROJECT: {info.project}/8</span>
      <span>VIEWPORT: {info.width}px</span>
      <span>REDUCED MOTION: {info.reduced ? "ON" : "OFF"}</span>
    </aside>
  );
}
