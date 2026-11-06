import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  projects,
  socialProjects,
  mediaProjects,
  commercialProjects,
} from "@/data/projects";
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
    title: `${p.name} — ${p.demo ? "Visual study" : p.industry} | HUGs Creative`,
    description: p.description,
    openGraph: {
      title: `${p.name} | HUGs Creative`,
      description: `${p.industry} | ${p.direction}`,
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
  const collection = p.demo
    ? mediaProjects
    : p.projectType === "commercial"
      ? commercialProjects
      : socialProjects;
  const next = collection[(collection.indexOf(p) + 1) % collection.length];
  const back =
    p.demo || p.projectType === "commercial" ? "/work" : "/work/social-media";
  return (
    <main className={`case-page${p.demo ? "" : " client-case"}`}>
      <header className="detail-toolbar">
        <Link href="/" className="wordmark" aria-label="HUGs Creative home">
          <img
            src="/hugs%20creative%20logo.png?v=2"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </Link>
        <Link className="text-link" href={back}>
          <Arrow direction="left" />{" "}
          {p.demo || p.projectType === "commercial"
            ? "All work"
            : "Social media projects"}
        </Link>
      </header>
      <div className="case-page-title">
        <Link className="eyebrow case-category" href={back}>
          {p.demo
            ? "VISUAL STUDY / MEDIA PACK"
            : p.projectType === "commercial"
              ? "COMMERCIAL VIDEO"
              : "SOCIAL MEDIA MANAGEMENT & CHANNEL OPERATIONS"}
        </Link>
        <h1>{p.name}</h1>
        <p className="project-summary">
          {p.industry} <span aria-hidden="true">|</span> {p.direction}
        </p>
      </div>
      {!p.demo && <ProjectStory project={p} />}
      {p.projectType === "commercial" ? (
        <div className="commercial-player">
          <ProjectVideos videos={p.videos} />
        </div>
      ) : p.demo ? (
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
      {p.demo && (
        <p className="case-disclosure">
          Visuals supplied in the media pack. Project details and credits are
          pending confirmation.
        </p>
      )}
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
          <Arrow direction="left" />{" "}
          {p.demo || p.projectType === "commercial"
            ? "All work"
            : "All social projects"}
        </Link>
        <Link className="text-link" href={`/work/${next.id}`}>
          Next project — {next.name} <Arrow />
        </Link>
      </footer>
    </main>
  );
}
