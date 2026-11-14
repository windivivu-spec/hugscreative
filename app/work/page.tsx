import type { Metadata } from "next";
import WorkShell from "@/components/layout/WorkShell";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectReveal from "@/components/ui/ProjectReveal";
import ProjectNavigation from "@/components/ui/ProjectNavigation";
import GlassButton from "@/components/ui/GlassButton";
import { Arrow } from "@/components/ui/Icons";
import {
  featuredProjects,
  projectServices,
  archiveHref,
} from "@/data/portfolio";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | HUGs Creative",
  description:
    "Explore HUGs Creative projects across graphic design, illustration, video and motion, website design, social media, and event photography. Browse selected work or the complete archive by year.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <WorkShell>
      <header className="projects-intro" id="project-content">
        <span className="eyebrow">THE WORK / HUGs CREATIVE</span>
        <div className="projects-intro-main">
          <h1>
            Good ideas.
            <br />
            <em>Out in the world.</em>
          </h1>
          <div className="projects-intro-copy">
            <p>
              Different disciplines. One creative spirit. Explore the brands,
              stories, and experiences we help bring to life.
            </p>
            <GlassButton href="/work/archive" primary>
              View all projects{" "}
              <span className="button-count">{projects.length}</span>
            </GlassButton>
          </div>
        </div>
        <div className="projects-intro-bottom">
          <span>SIX DISCIPLINES. MANY POSSIBILITIES.</span>
          <a href="#graphic-design">
            Discover the work <Arrow direction="down" />
          </a>
        </div>
      </header>
      <ProjectNavigation />
      <ProjectReveal>
        {projectServices.map((service) => (
          <section
            className={`project-chapter chapter-${service.slug}`}
            id={service.slug}
            key={service.slug}
            aria-labelledby={`${service.slug}-title`}
          >
            <header className="project-chapter-header" data-reveal>
              <div>
                <span className="eyebrow">
                  {service.projects.length} PROJECTS / SELECTED WORK
                </span>
                <h2 id={`${service.slug}-title`}>
                  {service.shortTitle}
                  <span className="heading-period">.</span>
                </h2>
              </div>
              <p>{service.description}</p>
            </header>
            <div className="project-featured-grid">
              {featuredProjects(service.title).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
            <div className="project-chapter-footer" data-reveal>
              <span>
                A selection of recent {service.shortTitle.toLowerCase()} work.
              </span>
              <GlassButton
                className="project-view-all"
                href={archiveHref(service.slug)}
                primary
              >
                View all {service.shortTitle.toLowerCase()}{" "}
                <span className="button-count">{String(service.projects.length).padStart(2, "0")}</span>
              </GlassButton>
            </div>
          </section>
        ))}
        <div className="projects-archive-callout" data-reveal>
          <div>
            <span className="eyebrow">THERE’S MORE TO EXPLORE</span>
            <h2>The full picture.</h2>
          </div>
          <GlassButton href="/work/archive" primary>
            View all projects by year
          </GlassButton>
        </div>
      </ProjectReveal>
    </WorkShell>
  );
}
