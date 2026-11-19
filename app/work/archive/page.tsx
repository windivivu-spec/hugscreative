import type { Metadata } from "next";
import Link from "next/link";
import WorkShell from "@/components/layout/WorkShell";
import WorkArchive from "@/components/sections/WorkArchive";
import { projectServices, groupProjectsByYear } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { Arrow } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Project Archive | HUGs Creative",
  description:
    "The HUGs Creative project archive. Browse every project by discipline and year, from graphic design and motion to websites, social media, and event photography.",
  alternates: { canonical: "/work/archive" },
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string | string[];
    year?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const selected = projectServices.find((item) => item.slug === query.service);
  const service = selected?.slug ?? "all";
  const years = groupProjectsByYear(selected?.projects ?? projects).map(
    (group) => group.year,
  );
  const year =
    typeof query.year === "string" && years.includes(query.year)
      ? query.year
      : "all";
  return (
    <WorkShell archive>
      <header
        className="projects-intro archive-page-intro"
        id="project-content"
      >
        <Link href="/work" className="text-link">
          <Arrow direction="left" /> Selected projects
        </Link>
        <div className="projects-intro-main">
          <h1>
            Every project.
            <br />
            <em>A new perspective.</em>
          </h1>
          <div className="projects-intro-copy">
            <p>
              The complete collection, across six creative disciplines. Find
              your inspiration by service or explore the work year by year.
            </p>
          </div>
        </div>
      </header>
      <WorkArchive service={service} year={year} />
    </WorkShell>
  );
}
