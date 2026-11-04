"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { Project } from "@/data/projects";
import { Arrow, CloseIcon } from "./Icons";
export default function ProjectDetail({
  project,
  origin,
  onClose,
  onNavigate,
  onDiscuss,
}: {
  project: Project;
  origin?: DOMRect;
  onClose: () => void;
  onNavigate: (delta: number) => void;
  onDiscuss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const closing = useRef(false);
  const savedOrigin = useRef(origin);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const focused = document.activeElement as HTMLElement | null;
    const y = window.scrollY;
    const previous = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    document.body.style.overflow = "hidden";
    d.showModal();
    return () => {
      d.close();
      document.body.style.overflow = previous;
      document.body.style.paddingRight = padding;
      window.scrollTo({ top: y, behavior: "instant" });
      focused?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const node = media.current;
    if (!node) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const origin = savedOrigin.current;
    const ctx = gsap.context(() => {
      if (!opened.current && origin && !reduced) {
        const r = node.getBoundingClientRect();
        gsap.fromTo(
          node,
          {
            x: origin.left - r.left,
            y: origin.top - r.top,
            scaleX: origin.width / r.width,
            scaleY: origin.height / r.height,
            borderRadius: 12,
            transformOrigin: "0 0",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.7,
            ease: "power3.inOut",
            clearProps: "transform,borderRadius",
          },
        );
      } else if (!reduced) {
        gsap.fromTo(node, { opacity: 0.3 }, { opacity: 1, duration: 0.35 });
      }
    });
    opened.current = true;
    return () => ctx.revert();
  }, [project.id]);
  function close() {
    if (closing.current) return;
    closing.current = true;
    const node = media.current;
    const r = savedOrigin.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (node && r && !reduced) {
      dialog.current?.scrollTo({ top: 0, behavior: "instant" });
      const b = node.getBoundingClientRect();
      gsap.to(node, {
        x: r.left - b.left,
        y: r.top - b.top,
        scaleX: r.width / b.width,
        scaleY: r.height / b.height,
        transformOrigin: "0 0",
        borderRadius: 12,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: onClose,
      });
      gsap.to(".detail-info, .detail-gallery", { opacity: 0, duration: 0.2 });
    } else onClose();
  }
  return (
    <dialog
      className="project-dialog"
      ref={dialog}
      aria-labelledby="project-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="detail-toolbar">
        <span className="wordmark">
          HUGs<small className="wordmark-sub">Creative</small>
        </span>
        <span className="eyebrow">INDEPENDENT EXPLORATION / DEMO CONCEPT</span>
        <button className="glass-button" onClick={close}>
          Back to work <CloseIcon />
        </button>
      </div>
      <div className="detail-feature" ref={media}>
        <Image
          src={project.image}
          alt={project.alt}
          fill
          priority
          sizes="100vw"
        />
        <div className="detail-image-caption">
          <span>HUGs Creative / {project.year}</span>
          <span>{project.name.toUpperCase()}</span>
        </div>
      </div>
      <div className="detail-info">
        <div>
          <span className="eyebrow muted">
            {project.category} — {project.year}
          </span>
          <h2 id="project-title">{project.name}</h2>
          <p className="detail-direction">{project.direction}</p>
        </div>
        <div>
          <p>{project.description}</p>
          <small>
            This is a fictional portfolio concept using curated stock imagery.
            It does not represent commissioned client work.
          </small>
        </div>
      </div>
      <div className="case-facts">
        <article>
          <span className="eyebrow">THE BRIEF</span>
          <p>{project.brief}</p>
        </article>
        <article>
          <span className="eyebrow">OUR ROLE / CONCEPT EXPLORATION</span>
          <p>{project.role}</p>
        </article>
        <article>
          <span className="eyebrow">PROPOSED DELIVERABLES</span>
          <ul>
            {project.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="case-share">
        <span>{project.industry}</span>
        <a href={`/work/${project.id}`} className="text-link">
          View shareable case study <Arrow />
        </a>
      </div>
      <div className="detail-gallery">
        {project.gallery.map((img, i) => (
          <div key={`${project.id}-${i}`}>
            <Image
              src={img}
              alt={`${project.name} — supporting visual direction ${i + 1}`}
              fill
              sizes="(max-width: 700px) 90vw, 45vw"
            />
          </div>
        ))}
      </div>
      <div className="case-cta">
        <h3>
          A similar idea
          <br />
          on your <em>mind?</em>
        </h3>
        <button className="glass-button glass-primary" onClick={onDiscuss}>
          Discuss a similar project <Arrow />
        </button>
      </div>
      <div className="detail-navigation">
        <button
          className="text-link"
          onClick={() => {
            onNavigate(-1);
            dialog.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Arrow direction="left" /> Previous project
        </button>
        <button
          className="text-link"
          onClick={() => {
            onNavigate(1);
            dialog.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Next project <Arrow direction="right" />
        </button>
      </div>
    </dialog>
  );
}
