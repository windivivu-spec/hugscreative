import type { Service } from "./services.ts";
import { projects, getVideoPreview } from "./projects.ts";

export type ServiceVisual = Service["media"][number] & {
  projectId: string;
  projectName: string;
  videoSrc?: string;
  autoplaySrc?: string;
};

const autoplayVisual = (projectId: string, useExistingPreview = false): ServiceVisual => {
  const media = visual(projectId);
  return {
    ...media,
    autoplaySrc: useExistingPreview
      ? media.preview
      : `/media/previews/service-loops/${projectId}.webm`,
  };
};

// Explicit ownership also covers gallery images and secondary project videos.
const visual = (
  projectId: string,
  image?: string,
  preview?: string,
): ServiceVisual => {
  const project = projects.find((item) => item.id === projectId);
  if (!project) throw new Error(`Unknown service project: ${projectId}`);
  return {
    projectId,
    projectName: project.name,
    videoSrc:
      project.videos?.find((v) => getVideoPreview(v) === preview)?.src ??
      project.videos?.[0]?.src,
    image: image ?? project.image,
    preview:
      preview ??
      (project.videos?.[0] ? getVideoPreview(project.videos[0]) : undefined),
  };
};

export const serviceVisuals: ServiceVisual[][] = [
  [
    visual("kem-trang-tien"),
    visual("vinamilk"),
    visual("yen-thien-viet"),
    visual("ananas"),
    visual("fairy-farm"),
    visual("raw-nest"),
  ],
  [
    visual("golden-angel-illustration"),
    visual("el-paraiso-illustration"),
    visual("white-angel-illustration"),
    visual("adult-swim-illustration"),
    visual("medora-illustration"),
    visual("red-angel-illustration"),
  ],
  [
    autoplayVisual("acb-commercial", true),
    autoplayVisual("acbs-commercial"),
    autoplayVisual("bvbank-commercial", true),
    autoplayVisual("bvbank-mascot"),
    autoplayVisual("xe-tot"),
  ],
  [
    autoplayVisual("inter-office-website"),
    autoplayVisual("windread-website"),
    autoplayVisual("monopo-website"),
    autoplayVisual("buki-website"),
    autoplayVisual("cafeholic-website"),
  ],
  [
    visual("kyoto-sushi"),
    visual("verita"),
    visual("chinhuei"),
    visual("lifehouse"),
    visual("wafaifo-hoi-an"),
    visual("nam-duong-land"),
  ],
  [
    visual("festive-gatherings"),
    visual("after-dark"),
    visual("moments-to-celebrate"),
    visual("around-the-table"),
    visual("event-collection-05"),
    visual("event-collection-06"),
  ],
];
