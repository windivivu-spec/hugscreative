export const serviceNames = [
  "Graphic Design",
  "Video Editing & Motion Graphics",
  "Website Design",
  "Social Media Management",
  "Event Photography",
  "Illustration Design",
] as const;

export type ServiceName = (typeof serviceNames)[number];
export type Service = {
  slug: string;
  title: ServiceName;
  shortTitle: string;
  description: string;
  tags: string[];
  note?: string;
  workHref?: string;
  media: {
    image?: string;
    preview?: string;
    kind?: "poster" | "calendar" | "chart" | "website" | "phone";
    text?: string;
    theme?: string;
    alt?: string;
  }[];
};

export const services: Service[] = [
  {
    slug: "graphic-design",
    title: serviceNames[0],
    workHref: "/work#graphic-design",
    shortTitle: "Graphic Design",
    description:
      "Campaign visuals and everyday brand assets, built around a consistent visual identity.",
    tags: ["Social posts & banners", "Labels", "Marketing materials"],
    media: [
      {
        image: "/media/Picture%20/Kem%20Trang%20Tien/1.png",
        alt: "Colorful fragrance spray product visual",
      },
    ],
  },
  {
    slug: "illustration-design",
    title: serviceNames[5],
    workHref: "/work#illustration-design",
    shortTitle: "Illustration Design",
    description: "Distinctive illustrations that bring stories, packaging, and brand worlds to life.",
    tags: ["Packaging illustration", "Brand illustration", "Custom artwork"],
    media: [{ image: "/media/Picture%20/illustration%20design/pack8.jpg.webp", alt: "Illustrated packaging artwork" }],
  },
  {
    slug: "video-motion",
    title: serviceNames[1],
    workHref: "/work#video-motion",
    shortTitle: "Video & Motion",
    description:
      "From raw footage to finished stories. Editing and motion design for campaigns, products, and social channels.",
    tags: ["Short-form videos", "Video ads", "Brand & event edits"],
    media: [
      {
        image: "/media/previews/acb-commercial.jpg",
        alt: "Berry soda motion graphic",
      },
    ],
  },
  {
    slug: "website-design",
    title: serviceNames[2],
    workHref: "/work#website-design",
    shortTitle: "Website Design",
    description:
      "Clear, engaging websites and landing pages designed around your business and your audience.",
    tags: ["Business websites", "Landing pages", "Responsive UI"],
    note: "Development, CMS, and ongoing maintenance are scoped separately.",
    media: [
      {
        image: "/media/Picture%20/Vinamilk/1.png",
        alt: "Botanical product visual direction",
      },
    ],
  },
  {
    slug: "social-media",
    title: serviceNames[3],
    shortTitle: "Social Media Management",
    description:
      "Build a marketing foundation, shape your brand’s social strategy, and keep your channels moving with ongoing management.",
    tags: [
      "Marketing & social strategy",
      "Facebook management",
      "TikTok development & management",
      "SEO where scoped",
    ],
    workHref: "/work#social-media",
    media: [
      {
        image: "/media/showcase/WAFAIFO/01.png",
        alt: "Wafaifo Hoi An social media strategy and channel showcase",
      },
    ],
  },
  {
    slug: "event-photography",
    title: serviceNames[4],
    workHref: "/work#event-photography",
    shortTitle: "Event Photography",
    description:
      "Capture the people, details, and moments behind your event, with a clear brief and a coordinated shoot.",
    tags: ["Corporate events", "Conferences", "Brand & product launches"],
    media: [
      {
        image: "/media/portrait.jpg",
        alt: "Illustrative portrait photography direction",
      },
    ],
  },
];


export const homepageServices = services;
