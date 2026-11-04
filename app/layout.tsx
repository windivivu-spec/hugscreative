import type { Metadata } from "next";
import "./globals.css";
import MotionAtmosphere from "@/components/ui/MotionAtmosphere";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3107"),
  title: "HUGs Creative — Born in Da Nang. Driven by Creativity.",
  description:
    "Video, graphic design, websites, and digital content from HUGs Creative, based in Da Nang, Vietnam.",
  robots: {
    index: process.env.SITE_PUBLISHED === "true",
    follow: process.env.SITE_PUBLISHED === "true",
  },
  openGraph: {
    title: "HUGs Creative — Born in Da Nang. Driven by Creativity.",
    description:
      "Video, design, websites and digital content — one creative point of contact.",
    type: "website",
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "HUGs Creative — design, video, web and social",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<MotionAtmosphere /></body>
    </html>
  );
}
