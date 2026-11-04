export type Service = {
  title: string;
  description: string;
  tags: string[];
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
    title: "GRAPHIC DESIGN",
    description:
      "Social posts, banners, labels, and campaign visuals designed to give your brand a clear, consistent presence.",
    tags: ["Social posts & banners", "Labels", "Marketing materials"],
    media: [
      { image: "/media/pack/a6.webp", alt: "Sneaker campaign artwork" },
      { kind: "poster", text: "STAY\nIN\nMOTION.", theme: "coral" },
      { image: "/media/pack/a3.webp", alt: "Illustrated milk packaging" },
      { image: "/media/pack/a7.webp", alt: "Green tea product artwork" },
      { kind: "poster", text: "less,\nbut better.", theme: "cream" },
      { image: "/media/pack/flower-wine.webp", alt: "Floral wine campaign artwork" },
    ],
  },
  {
    title: "VIDEO & MOTION",
    description:
      "From raw footage to finished stories. Video editing, short-form content, commercial cuts, and motion graphics.",
    tags: ["Film editing", "Motion design", "Short-form video"],
    media: [
      { image: "/media/pack/loops-16x9-poster.webp", alt: "Berry soda motion graphic" },
      { kind: "poster", text: "MAKE\nA\nMOVE.", theme: "purple" },
      { image: "/media/pack/v1-poster.webp", alt: "Headphone product film" },
      { image: "/media/pack/v4-poster.webp", alt: "Earbud product film" },
      { kind: "poster", text: "PLAY\nIT LOUD.", theme: "coral" },
      { image: "/media/pack/v3-poster.webp", alt: "Fashion product film" },
    ],
  },
  {
    title: "SOCIAL & DIGITAL",
    description:
      "Content planning, social graphics, and short videos that keep your brand active across digital channels.",
    tags: ["Content planning", "Social graphics", "Short videos"],
    media: [
      { kind: "calendar", text: "A little structure. A lot of possibility." },
      { image: "/media/pack/a1.webp", alt: "Peach milk product artwork" },
      { kind: "poster", text: "GOOD\nTHINGS,\nON REPEAT.", theme: "green" },
      { kind: "chart", text: "IN GOOD COMPANY" },
      { image: "/media/pack/a5.webp", alt: "Cocktail campaign artwork" },
      { kind: "poster", text: "PLAN.\nPOST.\nCONNECT.", theme: "cream" },
    ],
  },
  {
    title: "WEBSITE DESIGN",
    description:
      "Clear, engaging websites and landing pages designed around your business.",
    tags: ["Business websites", "Landing pages", "Responsive UI"],
    media: [
      { kind: "website", text: "Spaces for living." },
      { kind: "phone", text: "aura." },
      {
        image: "/media/pack/a2.webp",
        alt: "Bottled juice visual direction",
      },
      { kind: "poster", text: "BEYOND\nTHE\nSCREEN.", theme: "purple" },
      { kind: "website", text: "A different perspective." },
      { image: "/media/pack/a4.webp", alt: "Milk packaging visual direction" },
    ],
  },
];
