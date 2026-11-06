import Link from "next/link";
import type { Metadata } from "next";
import WorkArchive from "@/components/sections/WorkArchive";
import CaseStudyContact from "@/components/ui/CaseStudyContact";
import { Arrow } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Work — Client projects & creative studies | HUGs Creative",
  description:
    "Explore HUGs Creative’s client collaborations in social media and marketing, alongside design, video, and digital visual studies.",
};
export default function WorkPage() {
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
        <Link href="/#work" className="text-link">
          <Arrow direction="left" /> Back to home
        </Link>
      </header>
      <div className="portfolio-intro">
        <span className="eyebrow">THE PORTFOLIO / HUGs CREATIVE</span>
        <h1>
          Work with
          <br />
          <em>something to say.</em>
        </h1>
        <p>
          Client collaborations and creative studies. A closer look at the
          brands, ideas, and channels we help bring to life.
        </p>
      </div>
      <WorkArchive />
      <div className="case-cta">
        <h2>
          Your next
          <br />
          <em>chapter?</em>
        </h2>
        <CaseStudyContact label="Start a project" />
      </div>
      <footer className="detail-navigation">
        <Link className="text-link" href="/">
          HUGs Creative <Arrow />
        </Link>
        <Link className="text-link" href="/work/social-media">
          Social media projects <Arrow />
        </Link>
      </footer>
    </main>
  );
}
