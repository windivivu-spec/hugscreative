"use client";
import { useState } from "react";
import VideoPreview from "./VideoPreview";
import Image from "next/image";
import type { Service } from "@/data/services";
export default function FloatingMediaCard({
  media,
  index,
  active = true,
  autoplaySrc,
  warmPreview = false,
  label,
  onOpen,
}: {
  media: Service["media"][number];
  index: number;
  active?: boolean;
  autoplaySrc?: string;
  warmPreview?: boolean;
  label: string;
  onOpen: (origin: DOMRect, ratio: number, thumbnail?: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [ratio, setRatio] = useState<string>();
  const previewSrc = autoplaySrc ?? (hovered ? media.preview : undefined);
  return (
    <button
      type="button"
      aria-label={`View ${label}`}
      onClick={(event) => {
        setHovered(false);
        const image = event.currentTarget.querySelector("img");
        onOpen(
          event.currentTarget.getBoundingClientRect(),
          image?.naturalWidth && image.naturalHeight
            ? image.naturalWidth / image.naturalHeight
            : 1.5,
          image?.currentSrc,
        );
      }}
      style={media.image ? { aspectRatio: ratio ?? "3 / 2" } : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      className={`floating-card float-${index} ${media.kind ? `graphic-card graphic-${media.kind}` : ""} ${media.theme || ""}`}
    >
      {media.image ? (
        <Image
          src={media.image}
          alt={media.alt || ""}
          fill
          sizes="(max-width: 500px) 68vw, (max-width: 1000px) 340px, 23vw"
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth && naturalHeight)
              setRatio(`${naturalWidth} / ${naturalHeight}`);
          }}
        />
      ) : media.kind === "calendar" ? (
        <>
          <div className="mock-label">THE CONTENT EDIT / OCTOBER</div>
          <strong>
            Good things.
            <br />
            On schedule.
          </strong>
          <div className="calendar-grid">
            {Array.from({ length: 21 }, (_, i) => (
              <span
                className={[2, 6, 10, 16, 19].includes(i) ? "filled" : ""}
                key={i}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <small>YOUR NEXT CHAPTER, PLANNED.</small>
        </>
      ) : media.kind === "chart" ? (
        <>
          <div className="mock-label">EDITORIAL DIRECTION</div>
          <strong>
            In good
            <br />
            company.
          </strong>
          <div className="chart-bars">
            {[24, 46, 38, 70, 60, 88, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <small>ILLUSTRATIVE CONTENT SYSTEM</small>
        </>
      ) : media.kind === "website" || media.kind === "phone" ? (
        <>
          <div className="browser-chrome">
            <span />
            <span />
            <span />
          </div>
          <div className="web-mock-body">
            <small>
              {media.kind === "phone" ? "AURA OBJECTS" : "COMMON GROUND®"}
            </small>
            <strong>{media.text}</strong>
            <div className="mock-web-image">
              <Image
                src={
                  media.kind === "phone"
                    ? "/media/Picture%20/raw%20nest.png"
                    : "/media/Picture%20/Vinamilk/1.png"
                }
                alt=""
                fill
                sizes="250px"
              />
            </div>
            <span className="mock-web-link">EXPLORE THE COLLECTION ↗</span>
          </div>
        </>
      ) : (
        <>
          <div className="mock-label">HUGs Creative / EXPLORATIONS</div>
          <strong>
            {media.text?.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </strong>
          <span className="poster-orbit" />
          <small>INDEPENDENT IN SPIRIT. CREATIVE BY NATURE.</small>
        </>
      )}
      {previewSrc && (active || (autoplaySrc && warmPreview)) && (
        <VideoPreview
          src={previewSrc}
          enabled={active}
          playOnHover={!autoplaySrc}
          preload={autoplaySrc ? "auto" : "none"}
        />
      )}
    </button>
  );
}
