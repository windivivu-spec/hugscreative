import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectStory({ project }: { project: Project }) {
  if (project.contentStatus === "draft") return null;
  if (project.projectType === "commercial" && !project.overview) return null;
  const selection =
    project.projectType === "website" || project.projectType === "photography";
  return (
    <div className={`case-facts${project.demo ? "" : " client-facts"}`}>
      <article>
        <h2 className="eyebrow">
          {selection
            ? "ABOUT THE SELECTION"
            : project.demo
              ? "THE BRIEF"
              : "CLIENT INTRO"}
        </h2>
        <p>{project.demo ? project.brief : project.description}</p>
        {project.projectType !== "website" && project.references?.map((source) => (
          <a
            className="project-reference"
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.title} ↗
          </a>
        ))}
      </article>
      {project.overview && (
        <article>
          <h2 className="eyebrow">THE PROJECT</h2>
          <p>{project.overview}</p>
        </article>
      )}
      {project.demo && (
        <article>
          <h2 className="eyebrow">
            {selection ? "CREATIVE DIRECTION" : "OUR ROLE / VISUAL STUDY"}
          </h2>
          <p>{project.role}</p>
        </article>
      )}
      {project.deliverables.length > 0 && (
        <article>
          <h2 className="eyebrow">
            {selection
              ? "THE SELECTION"
              : project.demo
                ? "VISUAL CONTENT"
                : "HUGs SCOPE OF WORK"}
          </h2>
          <ul>
            {project.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}

export function ShowcaseCaption({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <figcaption className="showcase-caption">
      {project.name}
      <span>
        SHOWCASE {String(index).padStart(2, "0")} /{" "}
        {String(project.gallery.length + 1).padStart(2, "0")}
      </span>
    </figcaption>
  );
}

export function ProjectGallery({ project }: { project: Project }) {
  return (
    <div className={`detail-gallery${project.demo ? "" : " showcase-gallery"}`}>
      {project.gallery.map((src, i) => (
        <figure key={src}>
          <div className="gallery-image">
            <Image
              src={src}
              alt={
                project.projectType === "photography"
                  ? `${project.name} supporting photograph ${i + 1}`
                  : project.demo
                    ? `${project.name} — supporting visual study ${i + 1}`
                    : `${project.name} — project showcase ${i + 2}`
              }
              fill
              sizes={
                project.demo
                  ? "(max-width: 700px) 90vw, 45vw"
                  : "(max-width: 1400px) 90vw, 1200px"
              }
              style={{
                objectFit:
                  project.projectType === "photography" ||
                  project.projectType === "website"
                    ? "contain"
                    : project.demo
                      ? "cover"
                      : "contain",
              }}
            />
          </div>
          {!project.demo && <ShowcaseCaption project={project} index={i + 2} />}
        </figure>
      ))}
    </div>
  );
}
