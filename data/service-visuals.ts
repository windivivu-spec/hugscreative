import type { Service } from "./services";
type Visual = Service["media"][number];
const image = (name: string): Visual => ({ image: `/media/pack/${name}.webp` });
const poster = (text: string, theme: string): Visual => ({
  kind: "poster",
  text,
  theme,
});
export const serviceVisuals: Visual[][] = [
  [
    image("spray-collection"),
    poster("STAY\nIN\nMOTION.", "coral"),
    image("a3"),
    image("a7"),
    poster("less,\nbut better.", "cream"),
    image("flower-wine"),
  ],
  [
    { image: "/media/commercial/acb.webp" },
    poster("MAKE\nA\nMOVE.", "purple"),
    { image: "/media/commercial/bvbank.webp" },
    { image: "/media/commercial/cityland.webp" },
    poster("PLAY\nIT LOUD.", "coral"),
    image("v3-poster"),
  ],
  [
    { kind: "website", text: "Spaces for living." },
    { kind: "phone", text: "aura." },
    image("a2"),
    poster("BEYOND\nTHE\nSCREEN.", "purple"),
    { kind: "website", text: "A different perspective." },
    image("a4"),
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
    { image: "/media/portrait.jpg" },
    poster("PEOPLE.\nDETAILS.\nMOMENTS.", "cream"),
    { image: "/media/night.jpg" },
    { image: "/media/architecture.jpg" },
    poster("IN THE\nMOMENT.", "coral"),
    { image: "/media/landscape.jpg" },
  ],
];
