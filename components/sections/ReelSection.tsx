"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import VideoPreview from "@/components/ui/VideoPreview";

function formatTime(time: number) {
  const value = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export default function ReelSection() {
  const fullVideo = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(10);
  const [previewProgress, setPreviewProgress] = useState(0);

  function togglePlayback() {
    const video = fullVideo.current;
    if (!video) return;
    if (!active) {
      setActive(true);
      video.muted = false;
      setMuted(false);
      void video.play().catch(() => setPlaying(false));
    } else if (video.paused) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }
  function toggleMute() {
    const video = fullVideo.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }
  const progress =
    active && duration > 0 ? current / duration : previewProgress;

  return (
    <section className="reel-section" id="reel" aria-labelledby="reel-heading">
      <div className="reel-intro">
        <span className="eyebrow">A LITTLE OF OUR CREATIVE WORLD</span>
        <h2 id="reel-heading">
          A <em>feel</em> for
          <br />
          what’s <em>possible.</em>
        </h2>
        <p>Images, rhythm, and a different point of view.</p>
        <span className="reel-demo">VISUAL DIRECTION / MEDIA PACK</span>
      </div>
      <div className="reel-player">
        <div className="reel-poster">
          <Image
            src={site.reelPoster}
            alt="Camera product film"
            fill
            sizes="(max-width:767px) 90vw, 55vw"
          />
          <VideoPreview
            src="/media/previews/camera-in-focus-preview.mp4"
            enabled={!active}
            onProgress={(time, total) => {
              if (!active && total > 0) setPreviewProgress(time / total);
            }}
          />
          <video
            ref={fullVideo}
            className={`reel-full-video${active ? " is-active" : ""}`}
            src={site.reel}
            playsInline
            preload="none"
            aria-label="Camera product film"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={(event) =>
              setCurrent(event.currentTarget.currentTime)
            }
            onDurationChange={(event) => {
              if (Number.isFinite(event.currentTarget.duration))
                setDuration(event.currentTarget.duration);
            }}
          >
            Your browser does not support embedded video.{" "}
            <a href={site.reel}>Download the video</a>.
          </video>
          <button
            className="reel-preview-trigger"
            onClick={togglePlayback}
            aria-label={
              !active
                ? "Play the full camera video"
                : playing
                  ? "Pause video"
                  : "Play video"
            }
          />
        </div>
        <div className="reel-controls">
          <button
            className="reel-control-button"
            onClick={togglePlayback}
            aria-label={
              !active
                ? "Play the full camera video"
                : playing
                  ? "Pause video"
                  : "Play video"
            }
          >
            {active && playing ? "❚❚" : "▶"}
          </button>
          <input
            className="reel-progress"
            type="range"
            min="0"
            max={active ? duration : 1}
            step="0.01"
            value={active ? Math.min(current, duration) : progress}
            disabled={!active}
            aria-label="Video progress"
            style={
              {
                "--reel-progress": `${Math.min(100, Math.max(0, progress * 100))}%`,
              } as React.CSSProperties
            }
            onChange={(event) => {
              const time = Number(event.target.value);
              if (fullVideo.current) fullVideo.current.currentTime = time;
              setCurrent(time);
            }}
          />
          <span className="reel-time">
            {active ? formatTime(current) : "00:00"} / {formatTime(duration)}
          </span>
          <button
            className="reel-control-button reel-mute"
            onClick={toggleMute}
            disabled={!active}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={muted}
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
        </div>
      </div>
    </section>
  );
}
