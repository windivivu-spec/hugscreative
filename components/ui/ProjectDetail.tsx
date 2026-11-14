"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { Project } from "@/data/projects";
import { Arrow, CloseIcon } from "./Icons";
import ProjectVideos from "./ProjectVideos";
import { ProjectStory, ProjectGallery, ShowcaseCaption } from "./ProjectStory";
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
  const openingTween = useRef<gsap.core.Tween | null>(null);
  const exitTimeline = useRef<gsap.core.Timeline | null>(null);
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
      exitTimeline.current?.kill();
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
      if (!opened.current && origin && !reduced && project.demo) {
        const r = node.getBoundingClientRect();
        openingTween.current = gsap.fromTo(
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
        openingTween.current = gsap.fromTo(
          node,
          { opacity: 0.3 },
          { opacity: 1, duration: 0.35 },
        );
      }
    });
    opened.current = true;
    return () => ctx.revert();
  }, [project.id]);
  function close() {
    if (closing.current) return;
    closing.current = true;
    const node = media.current;
    const d = dialog.current;
    const r = savedOrigin.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (d && !reduced && !project.demo) {
      exitTimeline.current = gsap
        .timeline({ onComplete: onClose })
        .to(d, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }
    if (node && d && !reduced) {
      openingTween.current?.kill();
      d.scrollTo({ top: 0, behavior: "instant" });
      const b = node.getBoundingClientRect();
      const tl = gsap.timeline({ onComplete: onClose });
      exitTimeline.current = tl;
      // Reveal the portfolio underneath throughout the zoom, not after it.
      tl.to(
        d,
        {
          backgroundColor: "rgba(10, 10, 10, 0)",
          "--project-backdrop-opacity": 0,
          "--project-backdrop-blur": "0px",
          duration: 0.6,
          ease: "power2.out",
        },
        0,
      );
      tl.to(
        d.querySelectorAll(
          ".detail-toolbar, .detail-info, .case-facts, .case-share, .case-videos, .detail-gallery, .case-cta, .detail-navigation",
        ),
        {
          opacity: 0,
          filter: "blur(5px)",
          duration: 0.28,
          ease: "power2.out",
        },
        0,
      );
      tl.to(
        node,
        {
          ...(r
            ? {
                x: r.left - b.left,
                y: r.top - b.top,
                scaleX: r.width / b.width,
                scaleY: r.height / b.height,
                transformOrigin: "0 0",
              }
            : { scale: 0.94, transformOrigin: "50% 50%" }),
          borderRadius: 12,
          duration: 0.68,
          ease: "power3.inOut",
        },
        0,
      );
      tl.to(
        node,
        {
          filter: "blur(7px)",
          opacity: 0,
          duration: 0.48,
          ease: "power1.inOut",
        },
        0.18,
      );
    } else onClose();
  }
  return (
    <dialog
      className={`project-dialog${project.demo ? "" : " client-case"}`}
      ref={dialog}
      aria-labelledby="project-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="detail-toolbar">
        <span className="wordmark">
          <img
            src="/hugs%20creative%20logo.png?v=3"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </span>
        <span className="eyebrow">
          {project.demo
            ? "VISUAL STUDY / MEDIA PACK"
            : project.projectType === "commercial"
              ? "COMMERCIAL VIDEO"
              : "CLIENT PROJECT / SOCIAL MEDIA"}
        </span>
        <button className="glass-button" onClick={close}>
          Back to work <CloseIcon />
        </button>
      </div>
      {project.demo ? (
        <>
          <div
            className={`detail-feature${project.demo ? "" : " showcase-feature"}`}
            ref={media}
          >
            <Image
              src={project.image}
              alt={project.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: project.fit }}
            />
            <div className="detail-image-caption">
              <span>
                HUGs Creative / {project.demo ? project.year : "CLIENT WORK"}
              </span>
              <span>{project.name.toUpperCase()}</span>
            </div>
          </div>
          <div className="detail-info">
            <div>
              <span className="eyebrow muted">{project.category}</span>
              <h2 id="project-title">{project.name}</h2>
              <p className="detail-direction">
                {project.industry} | {project.direction}
              </p>
            </div>
            <div>
              {project.demo && (
                <>
                  <p>{project.description}</p>
                  <small>
                    Visuals supplied in the media pack. Project details and
                    credits are pending confirmation.
                  </small>
                </>
              )}
            </div>
          </div>
          <ProjectStory project={project} />
        </>
      ) : (
        <div className="client-case-content">
          <div className="detail-info">
            <div>
              <span className="eyebrow muted">{project.category}</span>
              <h2 id="project-title">{project.name}</h2>
              <p className="detail-direction">
                {project.industry} | {project.direction}
              </p>
            </div>
            <div>
              {project.demo && (
                <>
                  <p>{project.description}</p>
                  <small>
                    Visuals supplied in the media pack. Project details and
                    credits are pending confirmation.
                  </small>
                </>
              )}
            </div>
          </div>
          <ProjectStory project={project} />
          {project.projectType === "commercial" ? (
            <div className="commercial-player" ref={media}>
              <ProjectVideos videos={project.videos} />
            </div>
          ) : (
            <figure className="showcase-lead">
              <div
                className={`detail-feature${project.demo ? "" : " showcase-feature"}`}
                ref={media}
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: project.fit }}
                />
                <div className="detail-image-caption">
                  <span>
                    HUGs Creative /{" "}
                    {project.demo ? project.year : "CLIENT WORK"}
                  </span>
                  <span>{project.name.toUpperCase()}</span>
                </div>
              </div>
              <ShowcaseCaption project={project} index={1} />
            </figure>
          )}
        </div>
      )}
      {project.demo && (
        <div className="case-share">
          <span>{project.industry}</span>
          <a href={`/work/${project.id}`} className="text-link">
            View shareable case study <Arrow />
          </a>
        </div>
      )}
      {project.projectType !== "commercial" && (
        <ProjectVideos videos={project.videos} />
      )}
      <ProjectGallery project={project} />
      {!project.demo && (
        <div className="case-share">
          <span>{project.industry}</span>
          <a href={`/work/${project.id}`} className="text-link">
            View shareable case study <Arrow />
          </a>
        </div>
      )}
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
