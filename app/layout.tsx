import type { Metadata } from "next";
import "./globals.css";
import MotionAtmosphere from "@/components/ui/MotionAtmosphere";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://hugscreative.com"),
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
        url: "/social-card-hero-v3.png",
        width: 1200,
        height: 630,
        alt: "HUGs Creative — design, video, web and social",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/social-card-hero-v3.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <MotionAtmosphere />
      </body>
    </html>
  );
}
