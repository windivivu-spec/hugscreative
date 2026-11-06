import type { Metadata } from "next";
import "./globals.css";
import MotionAtmosphere from "@/components/ui/MotionAtmosphere";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3107"),
  title: "HUGs Creative — Born in Da Nang. Driven by Creativity.",
  description:
    "Creative production for brands and agencies. Design, video, websites, social media management, and event photography—with one dedicated project lead. Based in Da Nang, Vietnam.",
  robots: {
    index: process.env.SITE_PUBLISHED === "true",
    follow: process.env.SITE_PUBLISHED === "true",
  },
  openGraph: {
    title: "HUGs Creative — Born in Da Nang. Driven by Creativity.",
    description:
      "Creative production for brands and agencies—with one dedicated project lead. Design, video, websites, social media, and event photography from Da Nang, Vietnam.",
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
      <body>
        {children}
        <MotionAtmosphere />
      </body>
    </html>
  );
}
