export type Category =
  | "Graphic Design"
  | "Video Editing & Motion Graphics"
  | "Social Media & Digital Content"
  | "Website Design";
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
};
const samples: Omit<Project, "industry" | "brief" | "role" | "deliverables">[] =
  [
    {
      id: "off-script",
      name: "Off Script",
      category: "Video Editing & Motion Graphics",
      year: "2026",
      image: "/media/dunes.jpg",
      alt: "Sculptural dunes in the warm light of the desert",
      color: "#b16a3c",
      description:
        "A journey beyond the familiar. A cinematic campaign concept exploring movement, open spaces, and the freedom to take your own path.",
      direction: "Campaign concept / Art direction / Film editing",
      gallery: ["/media/landscape.jpg", "/media/ocean.jpg"],
      demo: true,
    },
    {
      id: "form-function",
      name: "Form / Function",
      category: "Graphic Design",
      year: "2026",
      image: "/media/fashion.jpg",
      alt: "Fashion editorial with a model and shopping bags",
      color: "#d63930",
      description:
        "A bold visual language built around one simple idea: everyday movement deserves extraordinary design. A concept social campaign with color at its core.",
      direction: "Visual identity / Social campaign / Content design",
      gallery: ["/media/portrait.jpg", "/media/architecture.jpg"],
      demo: true,
    },
    {
      id: "daily-ritual",
      name: "Daily Ritual",
      category: "Social Media & Digital Content",
      year: "2026",
      image: "/media/coffee.jpg",
      alt: "Coffee ritual with warm natural textures",
      color: "#a17e55",
      description:
        "Small moments, thoughtfully shared. An editorial content system and sample publishing direction for an independent coffee brand.",
      direction: "Content strategy / Editorial planning / Channel design",
      gallery: ["/media/coffee.jpg", "/media/landscape.jpg"],
      demo: true,
    },
    {
      id: "aura",
      name: "Aura Objects",
      category: "Website Design",
      year: "2026",
      image: "/media/skincare.jpg",
      alt: "Minimal skincare objects arranged as a still life",
      color: "#bca68c",
      description:
        "A quieter kind of digital experience. A concept storefront for considered objects, pairing tactile imagery with an intuitive editorial layout.",
      direction: "Digital strategy / Web design / Development",
      gallery: ["/media/skincare.jpg", "/media/architecture.jpg"],
      demo: true,
    },
    {
      id: "after-hours",
      name: "After Hours",
      category: "Video Editing & Motion Graphics",
      year: "2025",
      image: "/media/night.jpg",
      alt: "Atmospheric night sky filled with stars",
      color: "#56517f",
      description:
        "A study of light after dark. A motion-led visual concept that turns fleeting moments into a vivid, cinematic brand story.",
      direction: "Art direction / Motion design / Color grading",
      gallery: ["/media/night.jpg", "/media/ocean.jpg"],
      demo: true,
    },
    {
      id: "human-nature",
      name: "Human Nature",
      category: "Graphic Design",
      year: "2025",
      image: "/media/portrait.jpg",
      alt: "Sunlit editorial portrait surrounded by greenery",
      color: "#7c8962",
      description:
        "An intimate editorial concept about the connection between people and their surroundings. Natural light, honest details, and a distinct point of view.",
      direction: "Creative direction / Photography concept / Social design",
      gallery: ["/media/landscape.jpg", "/media/portrait.jpg"],
      demo: true,
    },
    {
      id: "common-ground",
      name: "Common Ground",
      category: "Website Design",
      year: "2025",
      image: "/media/architecture.jpg",
      alt: "Graphic lines of contemporary glass architecture",
      color: "#6b8892",
      description:
        "Architecture meets digital space. A responsive studio website concept with a structured grid and a confident, image-led narrative.",
      direction: "Brand direction / Website design / Development",
      gallery: ["/media/architecture.jpg", "/media/landscape.jpg"],
      demo: true,
    },
    {
      id: "new-current",
      name: "New Current",
      category: "Social Media & Digital Content",
      year: "2025",
      image: "/media/ocean.jpg",
      alt: "Rolling ocean waves in a clear blue sea",
      color: "#517a85",
      description:
        "A fresh perspective, across every channel. A sample social publishing system inspired by the changing rhythm of the ocean.",
      direction: "Channel direction / Content planning / Editorial system",
      gallery: ["/media/ocean.jpg", "/media/desert.jpg"],
      demo: true,
    },
    {
      id: "soft-signal",
      name: "Soft Signal",
      category: "Graphic Design",
      year: "2026",
      image: "/media/desert.jpg",
      alt: "Soft light and sculptural desert textures",
      color: "#bd866a",
      description:
        "A concept identity exploring quiet color, sculptural forms, and expressive editorial typography.",
      direction: "Identity concept / Editorial design / Visual direction",
      gallery: ["/media/dunes.jpg", "/media/fashion.jpg"],
      demo: true,
    },
    {
      id: "open-season",
      name: "Open Season",
      category: "Video Editing & Motion Graphics",
      year: "2026",
      image: "/media/landscape.jpg",
      alt: "Open landscape in natural light",
      color: "#748663",
      description:
        "An outdoor film direction study built around expansive landscapes, changing light, and an unhurried edit.",
      direction: "Film concept / Edit treatment / Color direction",
      gallery: ["/media/ocean.jpg", "/media/night.jpg"],
      demo: true,
    },
  ];
export const categories = [
  "All",
  "Graphic Design",
  "Video Editing & Motion Graphics",
  "Social Media & Digital Content",
  "Website Design",
] as const;

const caseNotes: Record<
  string,
  { industry: string; brief: string; role: string; deliverables: string[] }
> = {
  "soft-signal": {
    industry: "Design & lifestyle / concept",
    brief:
      "Explore a distinctive identity through restrained color and editorial composition.",
    role: "Concept graphic direction using stock photography; no client commission is represented.",
    deliverables: [
      "Identity visual study",
      "Editorial layouts",
      "Social graphic direction",
    ],
  },
  "open-season": {
    industry: "Outdoor & travel / concept",
    brief: "Develop an atmospheric film treatment inspired by open landscapes.",
    role: "Concept edit and color direction illustrated with stock stills.",
    deliverables: ["Film treatment", "Sequence direction", "Color study"],
  },
  "off-script": {
    industry: "Outdoor & lifestyle / concept",
    brief:
      "Explore a campaign direction that conveys freedom and discovery across screens.",
    role: "Concept art direction and a proposed film-editing approach, illustrated with stock photography.",
    deliverables: [
      "Campaign visual direction",
      "Proposed short-form edit structure",
      "Color and imagery study",
    ],
  },
  "form-function": {
    industry: "Fashion & lifestyle / concept",
    brief:
      "Build a distinctive social campaign direction with a recognizable visual rhythm.",
    role: "Concept graphic design and editorial layout exploration. No commissioned brand work is represented.",
    deliverables: [
      "Social post concepts",
      "Campaign banner direction",
      "Visual style exploration",
    ],
  },
  "daily-ritual": {
    industry: "Food & beverage / concept",
    brief:
      "Create a consistent content direction around the everyday ritual of coffee.",
    role: "Concept content planning and social design, demonstrated with curated stock images.",
    deliverables: [
      "Editorial content themes",
      "Sample publishing direction",
      "Social visual concepts",
    ],
  },
  aura: {
    industry: "Beauty & objects / concept",
    brief:
      "Explore a calm, intuitive shopping experience with space for considered product storytelling.",
    role: "Concept website direction and responsive layout study; no live storefront or client commission.",
    deliverables: [
      "Homepage direction",
      "Responsive UI concept",
      "Product storytelling layout",
    ],
  },
  "after-hours": {
    industry: "Culture & entertainment / concept",
    brief:
      "Express an atmospheric after-dark identity through light, color, and pacing.",
    role: "Concept motion direction and proposed editing language, supported by stock stills.",
    deliverables: [
      "Motion visual direction",
      "Color study",
      "Proposed sequence treatment",
    ],
  },
  "human-nature": {
    industry: "Editorial & lifestyle / concept",
    brief:
      "Develop a human-centered editorial campaign inspired by natural surroundings.",
    role: "Concept creative direction and graphic composition using stock photography.",
    deliverables: [
      "Editorial visual direction",
      "Social layout concepts",
      "Image selection study",
    ],
  },
  "common-ground": {
    industry: "Architecture / concept",
    brief:
      "Translate an architectural point of view into a clear, image-led website.",
    role: "Concept website structure and art direction, illustrated with architectural stock imagery.",
    deliverables: [
      "Website narrative",
      "Homepage layout direction",
      "Responsive composition study",
    ],
  },
  "new-current": {
    industry: "Lifestyle & travel / concept",
    brief:
      "Explore a flexible content system inspired by the changing rhythm of the ocean.",
    role: "Concept content strategy and sample visual system; no campaign results are claimed.",
    deliverables: [
      "Content pillars",
      "Editorial visual direction",
      "Sample channel system",
    ],
  },
};
export const projects: Project[] = samples.map((project) => ({
  ...project,
  ...caseNotes[project.id],
}));
