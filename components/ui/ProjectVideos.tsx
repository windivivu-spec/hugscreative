"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectVideo } from "@/data/projects";
import VideoPreview from "./VideoPreview";

export default function ProjectVideos({ videos }: { videos?: ProjectVideo[] }) {
  if (!videos?.length) return null;
  return (
    <div className="case-videos" aria-label="Project videos">
      {videos.map((video) => (
        <ProjectVideoItem video={video} key={video.src} />
      ))}
    </div>
  );
}

function ProjectVideoItem({ video }: { video: ProjectVideo }) {
  const [playingFull, setPlayingFull] = useState(false);
  const portrait = video.orientation === "portrait";
  return (
    <figure className="case-video">
      {playingFull ? (
        <video
          controls
          playsInline
          autoPlay
          preload="metadata"
          poster={video.poster}
          aria-label={video.title}
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support embedded video.{" "}
          <a href={video.src}>Download the video</a>.
        </video>
      ) : (
        <button
          className={`case-video-preview${portrait ? " is-portrait" : ""}`}
          onClick={() => setPlayingFull(true)}
          aria-label={`Play full video: ${video.title}`}
        >
          <Image
            src={video.poster}
            alt=""
            fill
            sizes="(max-width: 700px) 90vw, 50vw"
          />
          <VideoPreview src={video.src.replace(/\.mp4$/, "-preview.mp4")} />
          <span>▶ &nbsp; Play full video</span>
        </button>
      )}
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}
