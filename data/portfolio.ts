import { services } from "./services.ts";
import { projects, type Project } from "./projects.ts";

export function projectYear(project: Pick<Project, "year">): string {
  return /^\d{4}$/.test(project.year) ? project.year : "Undated";
}

export function sortProjects(collection: Project[]): Project[] {
  return [...collection].sort(
    (a, b) => (Number(projectYear(b)) || 0) - (Number(projectYear(a)) || 0),
  );
}

export function groupProjectsByYear(collection: Project[]) {
  const years = [...new Set(collection.map(projectYear))].sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return Number(b) - Number(a);
  });
  return years.map((year) => ({
    year,
    projects: sortProjects(collection.filter((p) => projectYear(p) === year)),
  }));
}

const featured = [
  "kem-trang-tien",
  "vinamilk",
  "ananas",
  "fairy-farm",
  "acb-commercial",
  "bvbank-commercial",
  "acb-calendar-2026",
  "xe-tot",
  "buki-website",
  "windread-website",
  "wafaifo-hoi-an",
  "kyoto-sushi",
  "lifehouse",
  "verita",
  "festive-gatherings",
  "after-dark",
  "moments-to-celebrate",
  "around-the-table",
];

export function featuredProjects(category: Project["category"]): Project[] {
  // Newer years take priority; editorial order chooses four within the same year.
  return projects
    .filter((p) => p.category === category)
    .sort((a, b) => {
      const year =
        (Number(projectYear(b)) || 0) - (Number(projectYear(a)) || 0);
      const rank = (p: Project) =>
        featured.includes(p.id) ? featured.indexOf(p.id) : featured.length;
      return year || rank(a) - rank(b);
    })
    .slice(0, 4);
}

export function projectLabel(project: Project): string {
  if (project.projectType === "photography") return "Photography selection";
  if (project.projectType === "website") return "Website showcase";
  return project.demo ? "Visual study" : "Client project";
}

export function archiveHref(service = "all", year = "all") {
  const query = new URLSearchParams();
  if (service !== "all") query.set("service", service);
  if (year !== "all") query.set("year", year);
  return `/work/archive${query.size ? `?${query}` : ""}`;
}

export const projectServices = services.map((service) => ({
  ...service,
  projects: sortProjects(projects.filter((p) => p.category === service.title)),
}));
