import Link from "next/link";
import { projects, socialProjects } from "@/data/projects";
import {
  archiveHref,
  groupProjectsByYear,
  projectServices,
  projectYear,
} from "@/data/portfolio";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectReveal from "@/components/ui/ProjectReveal";

export default function WorkArchive({
  socialOnly = false,
  service = "all",
  year = "all",
}: {
  socialOnly?: boolean;
  service?: string;
  year?: string;
}) {
  const selected = projectServices.find((item) => item.slug === service);
  const collection = socialOnly
    ? socialProjects
    : (selected?.projects ?? projects);
  const years = groupProjectsByYear(collection);
  const visible =
    year === "all"
      ? collection
      : collection.filter((p) => projectYear(p) === year);
  const groups = groupProjectsByYear(visible);
  return (
    <div className="project-archive" id="archive-results">
      {!socialOnly && (
        <nav
          className="project-archive-services"
          aria-label="Filter projects by service"
        >
          <Link
            href={archiveHref()}
            aria-current={!selected ? "page" : undefined}
          >
            All projects <span>{projects.length}</span>
          </Link>
          {projectServices.map((item) => (
            <Link
              key={item.slug}
              href={archiveHref(item.slug)}
              aria-current={service === item.slug ? "page" : undefined}
            >
              {item.shortTitle} <span>{item.projects.length}</span>
            </Link>
          ))}
        </nav>
      )}
      <div className="project-archive-tools">
        <nav aria-label="Filter projects by year">
          {socialOnly ? (
            <span className="eyebrow">BY YEAR</span>
          ) : (
            <>
              <Link
                href={archiveHref(service)}
                aria-current={year === "all" ? "page" : undefined}
              >
                All years
              </Link>
              {years.map((group) => (
                <Link
                  key={group.year}
                  href={archiveHref(service, group.year)}
                  aria-current={year === group.year ? "page" : undefined}
                >
                  {group.year}
                </Link>
              ))}
            </>
          )}
        </nav>
        <p role="status">
          {visible.length} {visible.length === 1 ? "project" : "projects"}{" "}
          <span>
            /{" "}
            {selected?.shortTitle ??
              (socialOnly ? "Social Media" : "All disciplines")}
          </span>
        </p>
      </div>
      <ProjectReveal resetKey={`${service}-${year}`}>
        {groups.map((group) => (
          <section
            className="project-year-group"
            key={`${service}-${group.year}`}
            aria-labelledby={`year-${group.year}`}
          >
            <header className="project-year-heading" data-reveal>
              <h2 id={`year-${group.year}`}>
                {group.year}
                <span className="heading-period">.</span>
              </h2>
              <span>
                {String(group.projects.length).padStart(2, "0")} PROJECTS
              </span>
            </header>
            <div className="project-archive-grid">
              {group.projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        ))}
      </ProjectReveal>
      {!visible.length && (
        <div className="work-empty">
          <h2>No projects in this selection.</h2>
          <p>Try another year or explore the full archive.</p>
          <Link href={archiveHref(service)} className="text-link">
            View all years
          </Link>
        </div>
      )}
    </div>
  );
}
