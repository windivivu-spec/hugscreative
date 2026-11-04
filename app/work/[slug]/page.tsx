import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import CaseStudyContact from "@/components/ui/CaseStudyContact";
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
  return {
    title: p
      ? `${p.name} — Concept project | HUGs Creative`
      : "Project not found",
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
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <main className="case-page">
      <header className="detail-toolbar">
        <Link href="/" className="wordmark">
          HUGs<small className="wordmark-sub">Creative</small>
        </Link>
        <Link className="glass-button" href="/#work">
          Back to selected work
        </Link>
      </header>
      <div className="case-page-title">
        <span className="eyebrow">
          CONCEPT PROJECT / {p.category} / {p.year}
        </span>
        <h1>{p.name}</h1>
        <p>{p.description}</p>
      </div>
      <div className="detail-feature">
        <Image src={p.image} alt={p.alt} fill priority sizes="100vw" />
      </div>
      <div className="case-share">
        <span>{p.industry}</span>
        <span>Independent exploration / stock imagery</span>
      </div>
      <div className="case-facts">
        <article>
          <span className="eyebrow">THE BRIEF</span>
          <p>{p.brief}</p>
        </article>
        <article>
          <span className="eyebrow">OUR ROLE</span>
          <p>{p.role}</p>
        </article>
        <article>
          <span className="eyebrow">PROPOSED DELIVERABLES</span>
          <ul>
            {p.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="detail-gallery">
        {p.gallery.map((image, i) => (
          <div key={image + i}>
            <Image
              src={image}
              alt={`${p.name} — supporting visual study ${i + 1}`}
              fill
              sizes="(max-width:767px) 90vw,45vw"
            />
          </div>
        ))}
      </div>
      <p className="case-disclosure">
        Fictional concept project. Stock photographs illustrate the creative
        direction; this is not commissioned client work and no business results
        are claimed.
      </p>
      <div className="case-cta">
        <h2>
          A similar idea
          <br />
          on your <em>mind?</em>
        </h2>
        <CaseStudyContact service={p.category} project={p.name} />
      </div>
      <footer className="detail-navigation">
        <Link className="text-link" href="/#work">
          All projects
        </Link>
        <Link className="text-link" href={`/work/${next.id}`}>
          Next exploration — {next.name} ↗
        </Link>
      </footer>
    </main>
  );
}
