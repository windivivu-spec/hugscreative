"use client";
import { site } from "@/data/site";
import GlassButton from "@/components/ui/GlassButton";
import SectionLabel from "@/components/ui/SectionLabel";
import { Arrow, Asterisk } from "@/components/ui/Icons";
export default function ContactFooter({
  onContact,
}: {
  onContact: () => void;
}) {
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
          {site.contactEmail ? (
            <a className="contact-address" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          ) : (
            <p>Contact details coming soon. Start with a project brief.</p>
          )}
          <a href="#faq" className="text-link">
            Before we start: your questions, answered <Arrow />
          </a>
        </div>
      </section>
      <footer className="footer">
        <a className="wordmark" href="#home">
          <img
            src="/hugs%20creative%20logo.png?v=2"
            alt="HUGs Creative"
            width="1322"
            height="490"
          />
        </a>
        <div className="footer-links">
          {["Work", "Services", "About", "Contact"].map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`}>
              {n}
            </a>
          ))}
        </div>
        <div className="footer-social">
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer">
              INSTAGRAM ↗
            </a>
          ) : (
            <span>INSTAGRAM / LINK TO BE ADDED</span>
          )}
          {site.vimeo ? (
            <a href={site.vimeo} target="_blank" rel="noreferrer">
              VIMEO ↗
            </a>
          ) : (
            <span>VIMEO / LINK TO BE ADDED</span>
          )}
        </div>
        <div className="footer-baseline">
          <span>© 2026 HUGs Creative. BORN IN DA NANG.</span>
          <a href="/privacy">Privacy notice</a>
          <a href="#home">
            BACK TO TOP <Arrow direction="up-right" />
          </a>
        </div>
      </footer>
    </>
  );
}
