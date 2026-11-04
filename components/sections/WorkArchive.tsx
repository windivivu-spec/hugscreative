"use client";
import Image from "next/image";
import { useState } from "react";
import { projects, categories } from "@/data/projects";
import type { OpenProject } from "./RotundaPortfolio";
import SectionLabel from "@/components/ui/SectionLabel";
import GlowCard from "@/components/ui/GlowCard";
import { Arrow } from "@/components/ui/Icons";
import VideoPreview from "@/components/ui/VideoPreview";
export default function WorkArchive({ onOpen }: { onOpen: OpenProject }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const visible =
    filter === "All"
      ? projects.slice(0, 6)
      : projects.filter((p) => p.category === filter);
  return (
    <section
      id="archive"
      className="archive-section"
      aria-labelledby="archive-heading"
    >
      <div className="archive-intro">
        <SectionLabel index="04">THE CREATIVE INDEX</SectionLabel>
        <span className="eyebrow muted">
          A DIFFERENT PERSPECTIVE, EVERY PROJECT.
        </span>
      </div>
      <h2 id="archive-heading">
        More <em>than</em> just
        <br />
        <em>good</em> looking<span className="heading-period">.</span>
      </h2>
      <div className="archive-bar">
        <div className="archive-filters" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
            >
              {c}
              <span>
                {c === "All"
                  ? "06"
                  : String(
                      projects.filter((p) => p.category === c).length,
                    ).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <span className="eyebrow archive-demo">SELECTED VISUALS / MEDIA PACK</span>
      </div>
      <div className="project-grid" aria-live="polite">
        {visible.map((p, i) => (
          <GlowCard
            key={p.id}
            className="archive-card"
            label={`View ${p.name}, ${p.category}, media pack visual`}
            onClick={(e) =>
              onOpen(
                p,
                e.currentTarget
                  .querySelector(".archive-image")
                  ?.getBoundingClientRect(),
              )
            }
          >
            <div className={`archive-image${p.videos?.length ? " has-video" : ""}`}>
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw"
                style={p.videos?.length ? { objectFit: "contain", background: "#0b0b0d" } : undefined}
              />
              {p.videos?.[0] && <VideoPreview src={p.videos[0].src.replace(/\.mp4$/, "-preview.mp4")} />}
              <span className="project-demo-tag">MEDIA PACK</span>
              <span className="project-open">
                <Arrow />
              </span>
              {i === 1 && filter === "All" && (
                <span className="art-overlay" aria-hidden="true">
                  FORM /<br />
                  FUNCTION.
                </span>
              )}
            </div>
            <div className="archive-meta">
              <h3>{p.name}</h3>
              <span>{p.year}</span>
              <p>{p.category}</p>
            </div>
          </GlowCard>
        ))}
      </div>
      <p className="archive-count">
        {String(visible.length).padStart(2, "0")} selected explorations{" "}
        <span>— always making room for what’s next.</span>
      </p>
    </section>
  );
}
