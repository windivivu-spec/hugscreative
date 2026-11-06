"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  projects,
  socialProjects,
  categories,
  getVideoPreview,
} from "@/data/projects";
import { services } from "@/data/services";
import { Arrow } from "@/components/ui/Icons";
import VideoPreview from "@/components/ui/VideoPreview";

export default function WorkArchive({
  socialOnly = false,
}: {
  socialOnly?: boolean;
}) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const collection = socialOnly ? socialProjects : projects;
  const visible =
    filter === "All"
      ? collection
      : collection.filter((p) => p.category === filter);
  return (
    <div className={`work-collection${socialOnly ? " social-collection" : ""}`}>
      {!socialOnly && (
        <div className="archive-bar">
          <div
            className="archive-filters"
            role="group"
            aria-label="Filter projects by service"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
              >
                {services.find((s) => s.title === category)?.shortTitle ??
                  category}
                <span>
                  {String(
                    category === "All"
                      ? collection.length
                      : collection.filter((p) => p.category === category)
                          .length,
                  ).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <Link className="text-link" href="/work/social-media">
            Social media case studies <Arrow />
          </Link>
        </div>
      )}
      <p className="collection-count" role="status">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== "All"
          ? ` / ${filter}`
          : socialOnly
            ? " / Social Media Management & Channel Operations"
            : " / Client work & visual studies"}
      </p>
      <div className="project-grid">
        {visible.map((p) => (
          <Link
            key={p.id}
            className={`archive-card glow-card${!p.demo ? " client-card" : ""}`}
            href={`/work/${p.id}`}
          >
            <div
              className={`archive-image${p.videos?.length ? " has-video" : ""}`}
            >
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw"
                style={{ objectFit: p.fit ?? "cover" }}
              />
              {p.videos?.[0] && getVideoPreview(p.videos[0]) && (
                <VideoPreview src={getVideoPreview(p.videos[0])!} />
              )}
              {p.demo && <span className="project-demo-tag">VISUAL STUDY</span>}
              <span className="project-open">
                <Arrow />
              </span>
            </div>
            <div className="archive-meta">
              <h2>{p.name}</h2>
              <span aria-hidden="true">↗</span>
              <p>{p.demo ? p.category : `${p.industry} | ${p.direction}`}</p>
            </div>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className="work-empty">
          <h2>Let’s capture your next event.</h2>
          <p>
            Event photography is coordinated from Da Nang. Share your city,
            date, and brief to confirm coverage and discuss the right scope.
          </p>
          <Link className="glass-button" href="/#services">
            Explore event photography <Arrow />
          </Link>
        </div>
      )}
    </div>
  );
}
