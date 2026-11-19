"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { ServiceVisual } from "@/data/service-visuals";
import { Arrow } from "./Icons";
export type MediaSelection = {
  media: ServiceVisual;
  origin: DOMRect;
  ratio: number;
  label: string;
  thumbnail?: string;
};
export default function ServiceMediaViewer({
  selection,
  onClose,
}: {
  selection: MediaSelection;
  onClose: () => void;
}) {
  const [videoReady, setVideoReady] = useState(false);
  const [mediaRatio, setMediaRatio] = useState(selection.ratio);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const opening = useRef<gsap.core.Tween | null>(null);
  const exit = useRef<gsap.core.Timeline | null>(null);
  const video = selection.media.videoSrc;
  useLayoutEffect(() => {
    const d = dialog.current!,
      f = frame.current!;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    document.body.style.paddingRight = `${innerWidth - document.documentElement.clientWidth}px`;
    document.body.style.overflow = "hidden";
    d.showModal();
    gsap.set(d, {
      "--viewer-shade": 0,
      "--viewer-blur": "0px",
      "--viewer-glow": 0,
    });
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(d, {
        "--viewer-shade": 0.28,
        "--viewer-blur": "24px",
        "--viewer-glow": 1,
        duration: 0.65,
        ease: "power2.out",
      });
      const r = f.getBoundingClientRect(),
        o = selection.origin;
      opening.current = gsap.fromTo(
        f,
        {
          x: o.left - r.left,
          y: o.top - r.top,
          scaleX: o.width / r.width,
          scaleY: o.height / r.height,
          transformOrigin: "0 0",
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.8,
          ease: "power3.inOut",
          clearProps: "transform,transformOrigin",
        },
      );
    } else {
      gsap.set(d, {
        "--viewer-shade": 0.28,
        "--viewer-blur": "24px",
        "--viewer-glow": 1,
      });
    }
    return () => {
      gsap.killTweensOf(d);
      opening.current?.kill();
      exit.current?.kill();
      d.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      focused?.focus({ preventScroll: true });
    };
  }, [selection]);
  function close() {
    if (closing.current) return;
    closing.current = true;
    const d = dialog.current!,
      f = frame.current!;
    d.querySelector("video")?.pause();
    gsap.killTweensOf(d);
    opening.current?.kill();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    const r = f.getBoundingClientRect(),
      o = selection.origin;
    exit.current = gsap
      .timeline({ onComplete: onClose })
      .to(
        d,
        {
          "--viewer-shade": 0,
          "--viewer-blur": "0px",
          "--viewer-glow": 0,
          duration: 0.5,
        },
        0,
      )
      .to(
        f,
        {
          x: o.left - r.left,
          y: o.top - r.top,
          scaleX: o.width / r.width,
          scaleY: o.height / r.height,
          transformOrigin: "0 0",
          duration: 0.55,
          ease: "power3.inOut",
        },
        0,
      )
      .to(f, { opacity: 0, duration: 0.15 }, 0.4);
  }
  return (
    <dialog
      ref={dialog}
      className="service-media-viewer"
      aria-label={selection.label}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button
        className="viewer-close glass-button"
        onClick={close}
        aria-label="Close media viewer"
      >
        Close <span aria-hidden="true">×</span>
      </button>
      <div
        className="viewer-content"
        style={{ "--viewer-ratio": mediaRatio } as CSSProperties}
      >
        <header className="viewer-project">
          <div>
            <p>PROJECT</p>
            <h2>{selection.media.projectName}</h2>
          </div>
          {selection.media.projectId && (
            <Link
              href={`/work/${selection.media.projectId}`}
              className="glass-button viewer-project-link"
              aria-label={`View project details — ${selection.media.projectName}`}
              onNavigate={() => {
                dialog.current?.querySelector("video")?.pause();
                onClose();
              }}
            >
              <span>View project details</span>
              <Arrow />
            </Link>
          )}
        </header>
        <div
          ref={frame}
          className="viewer-frame"
          style={{ aspectRatio: mediaRatio }}
        >
          <img
            className={
              video && videoReady
                ? "viewer-placeholder is-hidden"
                : "viewer-placeholder"
            }
            src={selection.thumbnail || selection.media.image}
            alt=""
            aria-hidden="true"
          />
          {video ? (
            <video
              className={
                videoReady ? "viewer-video is-visible" : "viewer-video"
              }
              controls
              playsInline
              autoPlay
              preload="auto"
              poster={selection.media.image}
              aria-label={selection.label}
              onLoadedMetadata={(event) => {
                const v = event.currentTarget;
                if (v.videoWidth && v.videoHeight)
                  setMediaRatio(v.videoWidth / v.videoHeight);
              }}
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoReady(true)}
              onPlaying={(event) => {
                const v = event.currentTarget;
                if ("requestVideoFrameCallback" in v)
                  v.requestVideoFrameCallback(() => {
                    if (v.isConnected) setVideoReady(true);
                  });
                else setVideoReady(true);
              }}
            >
              <source
                src={video}
                type={video.endsWith(".webm") ? "video/webm" : "video/mp4"}
              />
            </video>
          ) : (
            <Image
              src={selection.media.image!}
              alt={selection.label}
              fill
              sizes="88vw"
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
