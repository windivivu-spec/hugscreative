"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { CloseIcon } from "@/components/ui/Icons";
export default function ReelSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="reel-section" id="reel" aria-labelledby="reel-heading">
      <div className="reel-intro">
        <span className="eyebrow">A LITTLE OF OUR CREATIVE WORLD</span>
        <h2 id="reel-heading">
          A feel for
          <br />
          what’s <em>possible.</em>
        </h2>
        <p>Images, rhythm, and a different point of view.</p>
        <span className="reel-demo">
          {site.reelIsDemo
            ? "VISUAL DIRECTION / CONCEPT REEL"
            : "HUGs CREATIVE / SHOWREEL"}
        </span>
      </div>
      <button
        className="reel-poster"
        onClick={() => setOpen(true)}
        aria-label="Watch 15-second concept reel, stock imagery"
      >
        <Image
          src={site.reelPoster}
          alt="Warm desert dunes from the concept reel"
          fill
          sizes="(max-width:767px) 90vw, 55vw"
        />
        <span className="reel-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="m8 4 12 8-12 8z" />
          </svg>
        </span>
        <span className="reel-poster-bottom">
          <span>PLAY THE CONCEPT REEL</span>
          <span>00:15 / SILENT</span>
        </span>
      </button>
      {open && <ReelDialog onClose={() => setOpen(false)} />}
    </section>
  );
}
function ReelDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const d = dialog.current,
      old = document.body.style.overflow;
    d?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      d?.close();
      document.body.style.overflow = old;
      focused?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className="reel-dialog"
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="reel-dialog-title"
    >
      <div className="detail-toolbar">
        <h2 className="eyebrow" id="reel-dialog-title">
          HUGs Creative — {site.reelIsDemo ? "Concept reel" : "Showreel"}
        </h2>
        <button
          className="circle-button"
          aria-label="Close reel"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      <video
        controls
        playsInline
        preload="none"
        poster={site.reelPoster}
        aria-label="15-second silent visual direction reel"
      >
        <source src={site.reel} type="video/mp4" />
        Your browser does not support embedded video.{" "}
        <a href={site.reel}>Download the reel</a>.
      </video>
      <p>
        {site.reelIsDemo
          ? "A visual direction study made with stock photography. This is sample creative direction, not commissioned client work. The reel is silent."
          : "Our creative work, in motion."}
      </p>
    </dialog>
  );
}
