"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { getVideoPreview, type Project } from "@/data/projects";
import { projectLabel, projectYear } from "@/data/portfolio";
import { Arrow } from "./Icons";
import VideoPreview from "./VideoPreview";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const [preview, setPreview] = useState(false);
  const video = project.videos?.[0];
  const previewSrc = video && getVideoPreview(video);
  return (
    <Link
      href={`/work/${project.id}`}
      className={`portfolio-card portfolio-card-${project.projectType ?? "visual"}${video ? " portfolio-card-has-video" : ""}`}
      data-reveal
      style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as CSSProperties}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      onFocus={() => setPreview(true)}
      onBlur={() => setPreview(false)}
      aria-label={`View ${project.name} project`}
    >
      <div className="portfolio-card-visual">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 700px) 46vw, (max-width: 1200px) 44vw, 640px"
          style={{ objectFit: video ? "cover" : (project.fit ?? "cover") }}
        />
        {preview && previewSrc && <VideoPreview src={previewSrc} />}
        <span className="portfolio-card-kind">{projectLabel(project)}</span>
        <span className="portfolio-card-open">
          <Arrow />
        </span>
        {video && (
          <span className="portfolio-card-play" aria-hidden="true">
            Play preview <Arrow direction="right" />
          </span>
        )}
      </div>
      <div className="portfolio-card-caption">
        <h3>{project.name}</h3>
        {project.year && <span>{projectYear(project)}</span>}
        <p>{project.direction}</p>
      </div>
    </Link>
  );
}
