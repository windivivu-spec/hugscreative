export const serviceNames = [
  "Graphic Design",
  "Video Editing & Motion Graphics",
  "Website Design",
  "Social Media Management & Channel Operations",
  "Event Photography",
] as const;

export type ServiceName = (typeof serviceNames)[number];
export type Service = {
  title: ServiceName;
  shortTitle: string;
  description: string;
  tags: string[];
  note?: string;
  workHref?: string;
  media: {
    image?: string;
    kind?: "poster" | "calendar" | "chart" | "website" | "phone";
    text?: string;
    theme?: string;
    alt?: string;
  }[];
};

export const services: Service[] = [
  {
    title: serviceNames[0],
    shortTitle: "Graphic Design",
    description:
      "Campaign visuals and everyday brand assets, built around a consistent visual identity.",
    tags: ["Social posts & banners", "Labels", "Marketing materials"],
    media: [
      {
        image: "/media/pack/spray-collection.webp",
        alt: "Colorful fragrance spray product visual",
      },
    ],
  },
  {
    title: serviceNames[1],
    shortTitle: "Video & Motion",
    description:
      "From raw footage to finished stories. Editing and motion design for campaigns, products, and social channels.",
    tags: ["Short-form videos", "Video ads", "Brand & event edits"],
    media: [
      {
        image: "/media/pack/loops-16x9-poster.webp",
        alt: "Berry soda motion graphic",
      },
    ],
  },
  {
    title: serviceNames[2],
    shortTitle: "Website Design",
    description:
      "Clear, engaging websites and landing pages designed around your business and your audience.",
    tags: ["Business websites", "Landing pages", "Responsive UI"],
    note: "Development, CMS, and ongoing maintenance are scoped separately.",
    media: [
      {
        image: "/media/pack/a2.webp",
        alt: "Botanical product visual direction",
      },
    ],
  },
  {
    title: serviceNames[3],
    shortTitle: "Social Media",
    description:
      "Build a marketing foundation, shape your brand’s social strategy, and keep your channels moving with ongoing management.",
    tags: [
      "Marketing & social strategy",
      "Facebook management",
      "TikTok development & management",
      "SEO where scoped",
    ],
    workHref: "/work/social-media",
    media: [
      {
        image: "/media/showcase/WAFAIFO/01.png",
        alt: "Wafaifo Hoi An social media strategy and channel showcase",
      },
    ],
  },
  {
    title: serviceNames[4],
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
