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
      { image: "/media/portrait.jpg", alt: "Sunlit editorial portrait" },
      { kind: "poster", text: "STAY\nIN\nMOTION.", theme: "coral" },
      { image: "/media/fashion.jpg", alt: "Fashion campaign concept" },
      { image: "/media/skincare.jpg", alt: "Minimal product photography" },
      { kind: "poster", text: "less,\nbut better.", theme: "cream" },
      { image: "/media/coffee.jpg", alt: "Coffee editorial still life" },
    ],
  },
  {
    title: "VIDEO & MOTION",
    description:
      "From raw footage to finished stories. Video editing, short-form content, commercial cuts, and motion graphics.",
    tags: ["Film editing", "Motion design", "Short-form video"],
    media: [
      { image: "/media/desert.jpg", alt: "Cinematic desert landscape" },
      { kind: "poster", text: "MAKE\nA\nMOVE.", theme: "purple" },
      { image: "/media/night.jpg", alt: "Night sky color study" },
      { image: "/media/ocean.jpg", alt: "Ocean film still" },
      { kind: "poster", text: "PLAY\nIT LOUD.", theme: "coral" },
      { image: "/media/landscape.jpg", alt: "Misty mountain landscape" },
    ],
  },
  {
    title: "SOCIAL & DIGITAL",
    description:
      "Content planning, social graphics, and short videos that keep your brand active across digital channels.",
    tags: ["Content planning", "Social graphics", "Short videos"],
    media: [
      { kind: "calendar", text: "A little structure. A lot of possibility." },
      { image: "/media/coffee.jpg", alt: "Coffee editorial content" },
      { kind: "poster", text: "GOOD\nTHINGS,\nON REPEAT.", theme: "green" },
      { kind: "chart", text: "IN GOOD COMPANY" },
      { image: "/media/fashion.jpg", alt: "Fashion editorial content" },
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
        image: "/media/architecture.jpg",
        alt: "Architectural website inspiration",
      },
      { kind: "poster", text: "BEYOND\nTHE\nSCREEN.", theme: "purple" },
      { kind: "website", text: "A different perspective." },
      { image: "/media/skincare.jpg", alt: "Product web concept" },
    ],
  },
];
