"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { services } from "@/data/services";
import GlassButton from "@/components/ui/GlassButton";
import SectionLabel from "@/components/ui/SectionLabel";
import { Arrow, Asterisk } from "@/components/ui/Icons";

const exploreLinks = [
  { label: "Selected Projects", href: "/work" },
  { label: "Full Archive", href: "/work/archive" },
  { label: "Social Media Cases", href: "/work/social-media" },
  { label: "How We Work", href: "#about" },
  { label: "Common Questions", href: "#faq" },
] as const;

function formatDaNangTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

let cachedDaNangTime = "";
const timeListeners = new Set<() => void>();
let timeTimer: number | null = null;

function subscribeDaNangTime(listener: () => void) {
  timeListeners.add(listener);
  if (typeof window !== "undefined" && timeTimer === null) {
    cachedDaNangTime = formatDaNangTime();
    timeTimer = window.setInterval(() => {
      const next = formatDaNangTime();
      if (next !== cachedDaNangTime) {
        cachedDaNangTime = next;
        timeListeners.forEach((fn) => fn());
      }
    }, 15_000);
  }
  return () => {
    timeListeners.delete(listener);
    if (timeListeners.size === 0 && timeTimer !== null) {
      window.clearInterval(timeTimer);
      timeTimer = null;
    }
  };
}

function getDaNangTimeSnapshot() {
  if (!cachedDaNangTime) cachedDaNangTime = formatDaNangTime();
  return cachedDaNangTime;
}

function getServerDaNangTimeSnapshot() {
  return "";
}

export default function ContactFooter({
  onContact,
}: {
  onContact: () => void;
}) {
  const daNangTime = useSyncExternalStore(
    subscribeDaNangTime,
    getDaNangTimeSnapshot,
    getServerDaNangTimeSnapshot,
  );
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    if (!site.contactEmail) return;
    try {
      await navigator.clipboard.writeText(site.contactEmail);
      setCopied(true);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback: let the mailto link handle it if clipboard access is blocked.
    }
  };

  return (
    <>
      <section
        className="contact-section"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <div className="contact-top">
          <SectionLabel index="05">THE NEXT CHAPTER STARTS HERE</SectionLabel>
          <span className="contact-status">
            <span className="status-dot" /> OPEN TO NEW POSSIBILITIES
          </span>
        </div>
        <h2 id="contact-heading">
          Let’s <em>make</em>
          <br />
          something matter
          <span>.</span>
        </h2>
        <div className="contact-bottom">
          <p>
            Have a project in mind?
            <br />
            Share a few details about what you need.
          </p>
          <GlassButton onClick={onContact} primary className="contact-cta">
            Start a project
          </GlassButton>
          <Asterisk />
        </div>
        <div className="contact-channels">
          <span>BASED IN DA NANG, VIETNAM</span>
          {site.contactEmail && (
            <a className="contact-address" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          )}
          <a href="#faq" className="text-link">
            Before we start: your questions, answered <Arrow />
          </a>
        </div>
      </section>
      <footer className="site-footer" aria-label="Footer">
        <div className="site-footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <a
                className="wordmark"
                href="#home"
                aria-label="HUGs Creative home"
              >
                <img
                  src="/hugs%20creative%20logo.png?v=3"
                  alt="HUGs Creative"
                  width="1322"
                  height="490"
                />
              </a>
              <p className="footer-manifesto">
                Creative production for brands and agencies — design, video,
                websites, social content, and event photography with one
                dedicated project lead.
              </p>
              <div className="footer-studio-meta">
                <span className="status-dot" aria-hidden="true" />
                <span>DA NANG, VN</span>
                {daNangTime && (
                  <>
                    <span className="footer-meta-sep" aria-hidden="true">
                      /
                    </span>
                    <time className="footer-clock">{daNangTime} ICT</time>
                  </>
                )}
              </div>
            </div>

            <nav className="footer-col" aria-label="Disciplines">
              <p className="footer-heading">DISCIPLINES</p>
              <ul className="footer-list">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={service.workHref || `/work#${service.slug}`}>
                      <span>{service.shortTitle}</span>
                      <Arrow className="footer-link-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="footer-col" aria-label="Studio directory">
              <p className="footer-heading">DIRECTORY</p>
              <ul className="footer-list">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("#") ? (
                      <a href={item.href}>
                        <span>{item.label}</span>
                        <Arrow className="footer-link-arrow" />
                      </a>
                    ) : (
                      <Link href={item.href}>
                        <span>{item.label}</span>
                        <Arrow className="footer-link-arrow" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-col footer-direct">
              <p className="footer-heading">STUDIO DESK</p>
              {site.contactEmail && (
                <div className="footer-email-row">
                  <a
                    className="footer-email"
                    href={`mailto:${site.contactEmail}`}
                  >
                    {site.contactEmail}
                  </a>
                  <button
                    type="button"
                    className={`footer-copy-btn${copied ? " is-copied" : ""}`}
                    onClick={copyEmail}
                    aria-label={
                      copied
                        ? "Email copied to clipboard"
                        : "Copy studio email address"
                    }
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <span className="sr-only" aria-live="polite">
                    {copied ? "Email copied to clipboard." : ""}
                  </span>
                </div>
              )}
              <p className="footer-coverage">
                Da Nang–based studio.
                <br />
                Remote &amp; on-location by arrangement.
              </p>
              <button
                type="button"
                className="footer-brief-link"
                onClick={onContact}
              >
                <span>Send a project brief</span>
                <Arrow direction="right" />
              </button>
              {(site.instagram || site.vimeo) && (
                <div className="footer-socials">
                  {site.instagram && (
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram <Arrow />
                    </a>
                  )}
                  {site.vimeo && (
                    <a href={site.vimeo} target="_blank" rel="noreferrer">
                      Vimeo <Arrow />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copyright">
              © 2026 HUGs Creative · Born in Da Nang.
            </span>
            <Link className="footer-legal" href="/privacy">
              Privacy notice
            </Link>
            <a className="footer-top-btn" href="#home">
              <span>Back to top</span>
              <Arrow direction="up" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
