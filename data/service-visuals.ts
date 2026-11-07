import type { Service } from "./services";
type Visual = Service["media"][number];
const image = (name: string): Visual => ({ image: `/media/pack/${name}.webp` });
const clip = (image: string, preview: string): Visual => ({ image, preview });
export const serviceVisuals: Visual[][] = [
  [
    image("spray-collection"),
    image("a6"),
    image("a3"),
    image("a7"),
    { image: "/media/poster/2.png" },
    image("flower-wine"),
    { image: "/media/poster/1.png" },
  ],
  [
    clip("/media/commercial/acb.webp", "/media/commercial/acb-preview.webm"),
    clip("/media/commercial/bvbank.webp", "/media/commercial/bvbank-preview.webm"),
    clip("/media/pack/v5-poster.webp", "/media/pack/v5-hq-preview.mp4"),
    clip("/media/pack/v6-poster.webp", "/media/pack/v6-hq-preview.mp4"),
    clip("/media/pack/v8-poster.webp", "/media/pack/v8-hq-preview.mp4"),
    clip("/media/commercial/mascot-bvbank.png", "/media/commercial/mascot-bvbank-web-preview.mp4"),
    clip("/media/commercial/xe-tot.png", "/media/commercial/xe-tot-web-preview.mp4"),
  ],
  [
    { image: "/media/website/hero1.png" },
    { image: "/media/website/hero2.png" },
    { image: "/media/website/hero3.png" },
    clip("/media/website/hero4-poster.webp", "/media/website/hero4.mp4"),
  ],
  [
    "KYOTO/1",
    "VERITA/1",
    "CHINHUEI/1",
    "LIFEHOUSE/1",
    "WAFAIFO/01",
    "NAM%20D%C6%AF%C6%A0NG%20LAND/1",
  ].map((path) => ({ image: `/media/showcase/${path}.png` })),
  [
    "Screenshot 2026-11-07 at 11.23.18 AM.png",
    "Screenshot 2026-11-07 at 11.25.48 AM.png",
    "Screenshot 2026-11-07 at 11.26.02 AM.png",
    "Screenshot 2026-11-07 at 11.27.29 AM.png",
    "Screenshot 2026-11-07 at 11.28.57 AM.png",
    "abc5f3_1a3525af76b748799727106d7271552d~mv2.jpg.avif",
  ].map((name) => ({ image: `/media/event/${encodeURIComponent(name)}` })),
];
