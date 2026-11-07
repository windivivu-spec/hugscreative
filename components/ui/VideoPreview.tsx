"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoPreview({
  src,
  enabled = true,
  onProgress,
  renderAsCanvas = false,
  playOnHover = false,
}: {
  src: string;
  enabled?: boolean;
  onProgress?: (current: number, duration: number) => void;
  renderAsCanvas?: boolean;
  playOnHover?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<{ id: number; kind: "video" | "animation" } | null>(
    null,
  );
  const painted = useRef(false);
  const [ready, setReady] = useState(false);

  function stopFrames(video: HTMLVideoElement) {
    const frame = frameRef.current;
    if (!frame) return;
    if (frame.kind === "video") video.cancelVideoFrameCallback(frame.id);
    else cancelAnimationFrame(frame.id);
    frameRef.current = null;
  }

  function hideFrame(video: HTMLVideoElement) {
    stopFrames(video);
    painted.current = false;
    setReady(false);
  }

  function startFrames(video: HTMLVideoElement) {
    stopFrames(video);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let last = 0;
    const paint = (now: number) => {
      if (!video.isConnected || video.paused || video.ended) return;
      if (
        video.readyState >= 2 &&
        video.videoWidth &&
        video.videoHeight &&
        now - last >= 32
      ) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          last = now;
          if (!painted.current) {
            painted.current = true;
            setReady(true);
          }
        } catch {
          hideFrame(video);
          return;
        }
      }
      if ("requestVideoFrameCallback" in video) {
        frameRef.current = {
          id: video.requestVideoFrameCallback(paint),
          kind: "video",
        };
      } else {
        frameRef.current = {
          id: requestAnimationFrame(paint),
          kind: "animation",
        };
      }
    };
    if ("requestVideoFrameCallback" in video) {
      frameRef.current = {
        id: video.requestVideoFrameCallback(paint),
        kind: "video",
      };
    } else {
      frameRef.current = {
        id: requestAnimationFrame(paint),
        kind: "animation",
      };
    }
  }

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (enabled && (playOnHover || visible) && !document.hidden && (playOnHover || !motion.matches)) {
        void video.play().catch(() => setReady(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      stopFrames(video);
      painted.current = false;
      video.pause();
    };
  }, [src, enabled, playOnHover]);

  return (
    <>
      <video
        ref={ref}
        className={
          renderAsCanvas
            ? "video-preview-source"
            : `video-preview${ready && enabled ? " is-ready" : ""}`
        }
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={(event) => {
          const video = event.currentTarget;
          if (renderAsCanvas) {
            startFrames(video);
            return;
          }
          if ("requestVideoFrameCallback" in video) {
            video.requestVideoFrameCallback(() => {
              if (video.isConnected && !video.paused) setReady(true);
            });
          } else {
            setReady(true);
          }
        }}
        onPause={(event) => hideFrame(event.currentTarget)}
        onWaiting={(event) => hideFrame(event.currentTarget)}
        onError={(event) => hideFrame(event.currentTarget)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration))
            onProgress?.(video.currentTime, video.duration);
        }}
      />
      {renderAsCanvas && (
        <canvas
          ref={canvasRef}
          className={`video-preview${ready && enabled ? " is-ready" : ""}`}
          aria-hidden="true"
        />
      )}
    </>
  );
}
