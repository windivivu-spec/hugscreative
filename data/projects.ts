import { serviceNames, type ServiceName } from "./services.ts";
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
  alt: string;
  color: string;
  description: string;
  direction: string;
  gallery: string[];
  demo: boolean;
  projectType?: "commercial";
  industry: string;
  brief: string;
  role: string;
  deliverables: string[];
  videos?: ProjectVideo[];
  fit?: "cover" | "contain";
};
export const getVideoPreview = (video: ProjectVideo): string | undefined =>
  video.previewSrc === null
    ? undefined
    : (video.previewSrc ?? video.src.replace(/\.mp4$/, "-preview.mp4"));
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
    category: "Social Media Management & Channel Operations",
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
    category: "Social Media Management & Channel Operations",
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
export const categories = ["All", ...serviceNames] as const;
export const mediaProjects: Project[] = items.map((item) => ({
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

// Client content and scope are supplied by HUGs. No dates or performance claims
// are inferred from the showcase artwork.
const showcase = (folder: string, file: string) =>
  `/media/showcase/${encodeURIComponent(folder)}/${file}.png`;

export const socialProjects: Project[] = [
  {
    id: "kyoto-sushi",
    name: "Kyoto Sushi",
    industry: "F&B Marketing",
    direction:
      "Social Media Strategy & Execution for a Premium Japanese Restaurant",
    description:
      "KYOTO Sushi & Teppanyaki is a premium Japanese restaurant, offering authentic sushi, fresh seafood, and live Teppanyaki experiences. Located near My Khe Beach, KYOTO brings refined Japanese dining to local and international guests.",
    deliverables: [
      "Developing and executing social media strategies to strengthen brand presence",
      "Facebook Fanpage Management",
    ],
    folder: "KYOTO",
    files: ["1", "2", "3", "4"],
    color: "#b42a2e",
  },
  {
    id: "verita",
    name: "Verita",
    industry: "Healthcare & Wellness",
    direction:
      "Brand Marketing & Social Media Strategy for a Premium Wellness Brand",
    description:
      "Verita Health Hoi An is a premium healthcare and wellness destination combining modern medical expertise with refined wellness experiences for local and international clients.",
    deliverables: [
      "Building a strategic marketing foundation and developing social media platforms",
      "Facebook Fanpage Management",
      "TikTok Channel Development & Management",
    ],
    folder: "VERITA",
    files: ["1", "2", "3"],
    color: "#50a7bb",
  },
  {
    id: "chinhuei",
    name: "ChinHuei",
    industry: "Manufacturing & Interior Materials",
    direction: "Integrated Marketing Solutions & Digital Channel Development",
    description:
      "ChinHuei Plastic Industrial JSC is a Taiwan-invested manufacturer with 28 years of experience in Vietnam, specializing in premium plastic interior materials and solutions.",
    deliverables: [
      "Facebook Fanpage Development & Management",
      "TikTok Strategy & Channel Development",
      "SEO Strategy & Implementation",
    ],
    folder: "CHINHUEI",
    files: ["1", "2", "3"],
    color: "#bd3146",
  },
  {
    id: "nam-duong-land",
    name: "Nam Duong Land",
    industry: "Real Estate Marketing",
    direction:
      "A Strategic Partnership Between HUGs and Nam Duong Land at Casamia Balanca",
    description:
      "A strategic marketing collaboration between HUGs and Nam Duong Land at Casamia Balanca, strengthening project positioning, enhancing brand visibility, and communicating the project’s unique value.",
    deliverables: [
      "Strategic marketing collaboration for Casamia Balanca",
      "Project positioning and brand visibility",
      "Communication of the project’s unique value",
    ],
    folder: "NAM DƯƠNG LAND",
    files: ["1", "2", "3"],
    color: "#538d81",
  },
  {
    id: "lifehouse",
    name: "Lifehouse",
    industry: "Interior Design & Build",
    direction: "Marketing Foundation & Digital Channel Development",
    description:
      "Lifehouse is a professional Design & Build company specializing in interior design and construction, delivering refined, sustainable, and functional spatial solutions through creative thinking and precise execution.",
    deliverables: [
      "Established a strategic marketing foundation to position and grow the business",
      "Facebook Fanpage Management",
      "TikTok Channel Development & Management",
    ],
    folder: "LIFEHOUSE",
    files: ["1", "2", "3"],
    color: "#79975d",
  },
  {
    id: "wafaifo-hoi-an",
    name: "Wafaifo Hoi An",
    industry: "Hospitality Marketing",
    direction:
      "Social Media Strategy & Brand Positioning for a Premium Boutique Resort",
    description:
      "Wafaifo Resort Hoi An is a 4-star boutique resort located in the heart of Hoi An, offering premium accommodation and a diverse range of dining, wellness, and event experiences.",
    deliverables: [
      "Developed social media strategies to strengthen brand identity and enhance market positioning",
      "Facebook Fanpage Management",
      "TikTok Channel Development & Management",
    ],
    folder: "WAFAIFO",
    files: ["01", "02", "03"],
    color: "#74b5d3",
  },
].map(({ folder, files, ...project }): Project => ({
  ...project,
  category: "Social Media Management & Channel Operations",
  year: "",
  demo: false,
  image: showcase(folder, files[0]),
  alt: `${project.name} — social media and marketing showcase`,
  gallery: files.slice(1).map((file) => showcase(folder, file)),
  fit: "contain",
  brief: project.description,
  role: project.direction,
}));

export const commercialProjects: Project[] = [
  {
    id: "acb-commercial",
    name: "ACB",
    file: "acb",
    title: "ACB Corporate 2026",
  },
  {
    id: "bvbank-commercial",
    name: "BVBank",
    file: "bvbank",
    title: "BVBank Commercial",
  },
  {
    id: "cityland-commercial",
    name: "CityLand",
    file: "cityland",
    title: "CityLand Commercial",
  },
].map(({ id, name, file, title }) => ({
  id,
  name,
  category: "Video Editing & Motion Graphics",
  projectType: "commercial",
  year: "",
  demo: false,
  industry: "Commercial Video",
  direction: title,
  image: `/media/commercial/${file}.webp`,
  alt: `${title} video poster`,
  color: "#a94f65",
  description: `Watch the ${title} video.`,
  brief: `Watch the ${title} video.`,
  role: "Commercial video",
  deliverables: [],
  gallery: [],
  fit: "contain",
  videos: [
    {
      src: `/media/commercial/${file}.webm`,
      poster: `/media/commercial/${file}.webp`,
      title,
      orientation: "landscape",
      previewSrc: `/media/commercial/${file}-preview.webm`,
    },
  ],
}));

export const selectedProjects: Project[] = [
  socialProjects[0],
  commercialProjects[0],
  socialProjects[5],
  commercialProjects[1],
  socialProjects[1],
  socialProjects[2],
  commercialProjects[2],
  socialProjects[4],
  mediaProjects[8],
  socialProjects[3],
];
export const projects: Project[] = [
  ...socialProjects,
  ...commercialProjects,
  ...mediaProjects,
];
