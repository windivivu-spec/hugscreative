import type { Service } from "./services.ts";
import { projects, getVideoPreview } from "./projects.ts";

export type ServiceVisual = Service["media"][number] & {
  projectId: string;
  projectName: string;
  videoSrc?: string;
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
    visual("acb-commercial"),
    visual("bvbank-commercial"),
    visual("camera-in-focus"),
    visual("body-polish-motion"),
    visual("xiaomi-cleaner-g20-lite"),
    visual("bvbank-mascot"),
    visual("xe-tot"),
  ],
  [
    visual("inter-office-website"),
    visual("windread-website"),
    visual("monopo-website"),
    visual("buki-website"),
    visual("cafeholic-website"),
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
