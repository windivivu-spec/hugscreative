import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectStory({ project }: { project: Project }) {
  if (project.projectType === "commercial") return null;
  return (
    <div className={`case-facts${project.demo ? "" : " client-facts"}`}>
      <article>
        <h2 className="eyebrow">
          {project.demo ? "THE BRIEF" : "CLIENT INTRO"}
        </h2>
        <p>{project.demo ? project.brief : project.description}</p>
      </article>
      {project.demo && (
        <article>
          <h2 className="eyebrow">OUR ROLE / VISUAL STUDY</h2>
          <p>{project.role}</p>
        </article>
      )}
      <article>
        <h2 className="eyebrow">
          {project.demo ? "VISUAL CONTENT" : "HUGs SCOPE OF WORK"}
        </h2>
        <ul>
          {project.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
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
                project.demo
                  ? `${project.name} — supporting visual study ${i + 1}`
                  : `${project.name} — marketing and channel showcase ${i + 2}`
              }
              fill
              sizes={
                project.demo
                  ? "(max-width: 700px) 90vw, 45vw"
                  : "(max-width: 1400px) 90vw, 1200px"
              }
              style={{ objectFit: project.demo ? "cover" : "contain" }}
            />
          </div>
          {!project.demo && <ShowcaseCaption project={project} index={i + 2} />}
        </figure>
      ))}
    </div>
  );
}
