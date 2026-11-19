import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { projectLabel, projectYear } from "@/data/portfolio";
import { services } from "@/data/services";
import CaseStudyContact from "@/components/ui/CaseStudyContact";
import ProjectVideos from "@/components/ui/ProjectVideos";
import {
  ProjectStory,
  ProjectGallery,
  ShowcaseCaption,
} from "@/components/ui/ProjectStory";
import { Arrow } from "@/components/ui/Icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.id === slug);
  if (!p) return { title: "Project not found | HUGs Creative" };
  return {
    title: `${p.name} — ${p.demo ? projectLabel(p) : p.industry} | HUGs Creative`,
    description: p.contentStatus === "draft" ? `${p.name} — ${p.category} | HUGs Creative` : p.description,
    openGraph: {
      title: `${p.name} | HUGs Creative`,
      description: p.contentStatus === "draft" ? p.category : `${p.industry} | ${p.direction}`,
      images: [{ url: p.image, alt: p.alt }],
    },
  };
}
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.id === slug);
  if (!p) notFound();
  const collection = projects.filter(
    (project) => project.category === p.category,
  );
  const next = collection[(collection.indexOf(p) + 1) % collection.length];
  const service = services.find((service) => service.title === p.category)!;
  const back = `/work#${service.slug}`;
  return (
    <main className={`case-page${p.demo ? "" : " client-case"}`}>
      <header className="detail-toolbar">
        <Link href="/" className="wordmark" aria-label="HUGs Creative home">
          <img
            src="/hugs%20creative%20logo.png?v=3"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </Link>
        <Link className="text-link" href={back}>
          <Arrow direction="left" /> All projects
        </Link>
      </header>
      <div className="case-page-title">
        <Link className="eyebrow case-category" href={back}>
          {service.title.toUpperCase()}{p.year && ` / ${projectYear(p)}`}
        </Link>
        <h1>{p.name}</h1>
        <div className="case-title-meta">
          {p.contentStatus !== "draft" && <p className="project-summary">
            {p.industry} <span aria-hidden="true">|</span> {p.direction}
          </p>}
          {p.projectType === "website" && p.references?.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="glass-button case-website-link">
              {source.title} <Arrow />
            </a>
          ))}
        </div>
      </div>
      {!p.demo && <ProjectStory project={p} />}
      {p.projectType === "commercial" ? (
        <div className="commercial-player">
          <ProjectVideos videos={p.videos} />
        </div>
      ) : p.demo ? (
        <div
          className={`detail-feature${p.demo ? "" : " showcase-feature"}`}
          style={
            p.imageAspectRatio
              ? {
                  aspectRatio: p.imageAspectRatio,
                  width: `min(100%, 960px, calc(65svh * ${p.imageAspectRatio}))`,
                  height: "auto",
                  minHeight: 0,
                }
              : undefined
          }
        >
          <Image
            src={p.image}
            alt={p.alt}
            fill
            preload
            sizes="(max-width: 1400px) 90vw, 1280px"
            style={{ objectFit: p.fit }}
          />
        </div>
      ) : (
        <figure className="showcase-lead">
          <div className={`detail-feature${p.demo ? "" : " showcase-feature"}`}>
            <Image
              src={p.image}
              alt={p.alt}
              fill
              preload
              sizes="(max-width: 1400px) 90vw, 1280px"
              style={{ objectFit: p.fit }}
            />
          </div>
          <ShowcaseCaption project={p} index={1} />
        </figure>
      )}
      {p.demo && <ProjectStory project={p} />}
      {p.projectType !== "commercial" && <ProjectVideos videos={p.videos} />}
      <ProjectGallery project={p} />
      <div className="case-cta">
        <h2>
          A similar idea
          <br />
          on your <em>mind?</em>
        </h2>
        <CaseStudyContact service={p.category} project={p.name} />
      </div>
      <footer className="detail-navigation">
        <Link className="text-link" href={back}>
          <Arrow direction="left" /> All {service.shortTitle.toLowerCase()}{" "}
          projects
        </Link>
        <Link className="text-link" href={`/work/${next.id}`}>
          Next project — {next.name} <Arrow />
        </Link>
      </footer>
    </main>
  );
}
