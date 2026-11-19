import type { ServiceName } from "./services.ts";
import { serviceNames } from "./services.ts";
import database from "./projects.database.json" with { type: "json" };
export type Category = ServiceName;
export type ProjectVideo = {
  src: string;
  poster: string;
  title: string;
  orientation: "landscape" | "portrait";
  previewSrc?: string | null;
};
export type Project = {
  id: string;
  name: string;
  category: Category;
  year: string;
  image: string;
  imageAspectRatio?: number;
  alt: string;
  color: string;
  description: string;
  direction: string;
  gallery: string[];
  demo: boolean;
  projectType?: "commercial" | "website" | "photography";
  industry: string;
  brief: string;
  role: string;
  deliverables: string[];
  videos?: ProjectVideo[];
  overview?: string;
  contentStatus?: "draft" | "supplied";
  yearStatus?: string;
  editorNotes?: string;
  references?: { title: string; url: string }[];
  fit?: "cover" | "contain";
};
export const getVideoPreview = (video: ProjectVideo): string | undefined =>
  video.previewSrc === null
    ? undefined
    : (video.previewSrc ?? video.src.replace(/\.mp4$/, "-preview.mp4"));

// Provisional years remain flagged in the database for owner review.
export const projects = (database.projects as Project[]).map((project) => ({
  ...project,
  year: project.year,
}));
export const categories = ["All", ...serviceNames] as const;
export const socialProjects = projects.filter(
  (p) => p.category === "Social Media Management",
);
const selectedIds = [
  "kyoto-sushi",
  "acb-commercial",
  "kem-trang-tien",
  "chinhuei",
  "acbs-commercial",
  "vinamilk",
  "ananas",
  "xe-tot",
  "yen-thien-viet",
];
export const selectedProjects = selectedIds.map((id) => {
  const project = projects.find((p) => p.id === id);
  if (!project) throw new Error(`Missing selected project: ${id}`);
  return project;
});
