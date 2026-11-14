import Link from "next/link";
import type { ReactNode } from "react";
import CaseStudyContact from "@/components/ui/CaseStudyContact";
import { Arrow } from "@/components/ui/Icons";

export default function WorkShell({
  children,
  archive = false,
}: {
  children: ReactNode;
  archive?: boolean;
}) {
  return (
    <main className="portfolio-page projects-page" id="main">
      <a href="#project-content" className="skip-link">
        Skip to projects
      </a>
      <header className="detail-toolbar projects-toolbar">
        <Link href="/" className="wordmark" aria-label="HUGs Creative home">
          <img
            src="/hugs%20creative%20logo.png?v=3"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </Link>
        <nav aria-label="Project navigation">
          <Link href="/" className="projects-home-link">
            Home
          </Link>
          <Link href="/work" aria-current={!archive ? "page" : undefined}>
            Projects
          </Link>
          <Link
            href="/work/archive"
            aria-current={archive ? "page" : undefined}
          >
            Archive <Arrow />
          </Link>
        </nav>
      </header>
      {children}
      <section
        className="projects-contact"
        aria-labelledby="projects-contact-title"
      >
        <span className="eyebrow">YOUR IDEA COULD BE NEXT</span>
        <div>
          <h2 id="projects-contact-title">
            Let’s make
            <br />
            <em>something matter.</em>
          </h2>
          <div className="projects-contact-copy">
            <p>
              A new brand, a fresh campaign, or a story waiting to be told. We’d
              love to hear it.
            </p>
            <CaseStudyContact label="Start a project" />
          </div>
        </div>
      </section>
      <footer className="detail-navigation projects-footer">
        <Link className="text-link" href="/">
          HUGs Creative <Arrow />
        </Link>
        <span>Born in Da Nang. Driven by creativity.</span>
        <Link className="text-link" href="/#services">
          What we do <Arrow />
        </Link>
      </footer>
    </main>
  );
}
