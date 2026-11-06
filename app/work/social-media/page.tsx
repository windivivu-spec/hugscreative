import Link from "next/link";
import type { Metadata } from "next";
import WorkArchive from "@/components/sections/WorkArchive";
import CaseStudyContact from "@/components/ui/CaseStudyContact";
import { Arrow } from "@/components/ui/Icons";
import { serviceNames } from "@/data/services";

export const metadata: Metadata = {
  title: "Social Media Management & Channel Operations | HUGs Creative",
  description:
    "Social media strategy, Facebook management, TikTok channel development, and marketing foundations for Kyoto Sushi, Verita, ChinHuei, Nam Duong Land, Lifehouse, and Wafaifo Hoi An.",
};
export default function SocialMediaPage() {
  return (
    <main className="portfolio-page">
      <header className="detail-toolbar">
        <Link href="/" className="wordmark" aria-label="HUGs Creative home">
          <img
            src="/hugs%20creative%20logo.png?v=2"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </Link>
        <Link className="text-link" href="/work">
          <Arrow direction="left" /> All work
        </Link>
      </header>
      <div className="portfolio-intro social-intro">
        <span className="eyebrow">
          SOCIAL MEDIA MANAGEMENT &amp; CHANNEL OPERATIONS
        </span>
        <h1>
          Strong brands.
          <br />
          <em>Active channels.</em>
        </h1>
        <p>
          From a clear marketing foundation to the day-to-day life of a brand.
          Explore six collaborations across hospitality, dining, wellness,
          interiors, and real estate.
        </p>
        <div className="social-capabilities">
          <span>Marketing &amp; social strategy</span>
          <span>Facebook management</span>
          <span>TikTok development &amp; management</span>
          <span>SEO where scoped</span>
        </div>
      </div>
      <WorkArchive socialOnly />
      <div className="case-cta">
        <h2>
          Let’s build
          <br />
          <em>your presence.</em>
        </h2>
        <CaseStudyContact
          service={serviceNames[3]}
          label="Discuss your social channels"
        />
      </div>
      <footer className="detail-navigation">
        <Link className="text-link" href="/#services">
          <Arrow direction="left" /> All services
        </Link>
        <Link className="text-link" href="/work">
          Explore all work <Arrow />
        </Link>
      </footer>
    </main>
  );
}
