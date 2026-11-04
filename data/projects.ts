export type Category =
  | "Graphic Design"
  | "Video Editing & Motion Graphics"
  | "Social Media & Digital Content"
  | "Website Design";
export type ProjectVideo = {
  src: string;
  poster: string;
  title: string;
  orientation: "landscape" | "portrait";
};
export type Project = {
  id: string;
  name: string;
  category: Category;
  year: string;
  image: string;
  alt: string;
  color: string;
  description: string;
  direction: string;
  gallery: string[];
  demo: true;
  industry: string;
  brief: string;
  role: string;
  deliverables: string[];
  videos?: ProjectVideo[];
  fit?: "cover" | "contain";
};
const asset = (name: string) => `/media/pack/${name}`;
const clip = (name: string, title: string): ProjectVideo => ({
  src: asset(`${name}-hq.mp4`),
  poster: asset(`${name}-poster.webp`),
  title,
  orientation: ["loops-9x16", "v6", "v8"].includes(name)
    ? "portrait"
    : "landscape",
});
const items: Array<
  Omit<
    Project,
    "year" | "demo" | "industry" | "brief" | "role" | "deliverables"
  >
> = [
  {
    id: "off-script",
    name: "Berry Pop",
    category: "Video Editing & Motion Graphics",
    image: "loops-16x9-poster.webp",
    alt: "Pink berry soda motion graphic",
    color: "#eb2266",
    description:
      "A playful berry soda motion piece with bright color and energetic typography.",
    direction: "Product video / Motion graphics",
    gallery: ["a1.webp", "a7.webp"],
    videos: [
      clip("loops-16x9", "Berry Pop — landscape"),
      clip("loops-9x16", "Berry Pop — portrait"),
    ],
  },
  {
    id: "form-function",
    name: "All Over Spray",
    category: "Graphic Design",
    image: "spray-collection.webp",
    alt: "A colorful collection of fragrance sprays",
    color: "#85aa39",
    description:
      "A colorful product collection visual with bold shapes and expressive packaging.",
    direction: "Product visual / Graphic design",
    gallery: ["spray-collection.webp"],
  },
  {
    id: "daily-ritual",
    name: "Peach Milk Cooler",
    category: "Social Media & Digital Content",
    image: "a1.webp",
    alt: "Peach milk cooler product campaign artwork",
    color: "#f39a5a",
    description:
      "A bright product visual pairing peach imagery, splashes and playful composition.",
    direction: "Product visual / Social content",
    gallery: ["a1.webp", "a2.webp"],
  },
  {
    id: "aura",
    name: "Raw Nest",
    category: "Website Design",
    image: "a2.webp",
    alt: "Raw Nest bottled juice product artwork",
    color: "#8a9f65",
    description:
      "A botanical product visual that explores a fresh direction for a digital brand experience.",
    direction: "Product imagery / Digital visual direction",
    gallery: ["a2.webp", "a4.webp"],
  },
  {
    id: "after-hours",
    name: "Sound in Focus",
    category: "Video Editing & Motion Graphics",
    image: "v1-poster.webp",
    alt: "Headphones in a dramatic studio spotlight",
    color: "#49525e",
    description:
      "A headphone product film exploring light, form and a cinematic studio atmosphere.",
    direction: "Product film / Motion",
    gallery: ["v1-poster.webp", "v5-poster.webp"],
    videos: [clip("v1", "Headphone product film")],
  },
  {
    id: "human-nature",
    name: "Fairy Farm",
    category: "Graphic Design",
    image: "a3.webp",
    alt: "Illustrated farm milk packaging campaign",
    color: "#98b96d",
    description:
      "A farm-inspired milk packaging visual with illustrated landscapes and a playful character.",
    direction: "Packaging visual / Graphic design",
    gallery: ["dairy-landscape.webp", "a3.webp"],
  },
  {
    id: "common-ground",
    name: "Beyond Smart",
    category: "Graphic Design",
    image: "beyond-smart.webp",
    alt: "Home appliance launch artwork in a gold studio setting",
    color: "#b18a58",
    description:
      "A home appliance launch visual with a warm palette and a clean product-led composition.",
    direction: "Launch visual / Graphic design",
    gallery: ["beyond-smart.webp"],
  },
  {
    id: "new-current",
    name: "Ozaura Collection",
    category: "Social Media & Digital Content",
    image: "ozaura-collection.webp",
    alt: "Skincare products arranged against a tropical sunset",
    color: "#d89b9f",
    description:
      "A tropical product visual pairing skincare packaging with sunset tones and natural details.",
    direction: "Product visual / Social content",
    gallery: ["ozaura-collection.webp"],
  },
  {
    id: "soft-signal",
    name: "Form in Motion",
    category: "Video Editing & Motion Graphics",
    image: "v4-poster.webp",
    alt: "Red earbuds arranged in a product film",
    color: "#b94e62",
    description:
      "A product motion study with sculptural forms, detail and a restrained studio palette.",
    direction: "Product motion / Visual direction",
    gallery: ["v4-poster.webp", "v1-poster.webp"],
    videos: [
      clip("v4", "Earbuds product film"),
      clip("v8", "Home appliance vertical video"),
    ],
  },
  {
    id: "open-season",
    name: "Color & Texture",
    category: "Video Editing & Motion Graphics",
    image: "v7-poster.webp",
    alt: "Blueberry in a food product film",
    color: "#718359",
    description:
      "A collection of motion studies exploring texture, movement and material detail.",
    direction: "Product video / Visual exploration",
    gallery: ["v7-poster.webp", "a5.webp"],
    videos: [
      clip("v7", "Food product film"),
      clip("v3", "Fashion product film"),
    ],
  },
];
export const categories = [
  "All",
  "Graphic Design",
  "Video Editing & Motion Graphics",
  "Social Media & Digital Content",
  "Website Design",
] as const;
export const projects: Project[] = items.map((item) => ({
  ...item,
  image: asset(item.image),
  gallery: item.gallery.map(asset),
  year: "MEDIA PACK",
  demo: true,
  fit: ["daily-ritual", "aura", "human-nature"].includes(item.id)
    ? "contain"
    : "cover",
  industry: "Visual direction / media pack",
  brief:
    "A visual selection from the supplied media pack, presented as a creative direction reference.",
  role: "Selected imagery and video from the media pack; project credits and commissioning details are pending confirmation.",
  deliverables: item.videos?.length
    ? ["Product visuals", "Motion preview"]
    : ["Visual direction", "Product imagery"],
}));
