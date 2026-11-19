"use client";
import SectionLabel from "@/components/ui/SectionLabel";
import ImpactSculpture from "@/components/ui/ImpactSculpture";
import { Asterisk } from "@/components/ui/Icons";
import { site } from "@/data/site";

export default function AboutProcess() {
  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-top">
        <SectionLabel index="03">HUGs CREATIVE / DA NANG, VIETNAM</SectionLabel>
        <Asterisk />
      </div>
      <div className="about-main">
        <div className="about-lead">
          <h2 id="about-heading">
            From <em>idea</em>
            <br />
            to <em className="impact-word">impact</em>
            <span>.</span>
          </h2>
          <ImpactSculpture />
        </div>
        <div className="about-copy">
          <h3 className="about-brand-line">
            HUGs Creative — Born in Da Nang. Driven by Creativity.
          </h3>
          <p className="brand-story">
            With over six years of hands-on experience in creative production
            and digital communications, HUGs Creative is based in Da Nang,
            Vietnam. We bring ideas to life through design, video, websites,
            social media, and event photography.
          </p>
          <p className="partner-story">
            A creative partner for brands, and specialist production support for
            agencies. Bring us a single project or an ongoing content need. One
            dedicated project lead coordinates the right specialists, feedback,
            and delivery.
          </p>
          <span className="about-location">
            BASED IN DA NANG / COLLABORATING REMOTELY
          </span>
          <div className="about-contact">
            <a href={site.website}>hugscreative.com</a>
          </div>
        </div>
      </div>
      <div
        id="process"
        className="compact-process"
        aria-labelledby="process-heading"
      >
        <div className="compact-process-heading">
          <h3 id="process-heading">A clear path from brief to delivery.</h3>
          <span className="eyebrow">ONE PROJECT LEAD, EVERY STEP.</span>
        </div>
        <ol>
          <li>
            <span className="process-step-number">01</span>
            <div>
              <h4>Share your brief.</h4>
              <p>
                Your goals, audience, deliverables, timeline, and available
                assets.
              </p>
            </div>
          </li>
          <li>
            <span className="process-step-number">02</span>
            <div>
              <h4>Agree on the scope.</h4>
              <p>
                Deliverables, quote, schedule, and revision rounds agreed before
                we begin.
              </p>
            </div>
          </li>
          <li>
            <span className="process-step-number">03</span>
            <div>
              <h4>Create, review &amp; deliver.</h4>
              <p>
                We coordinate production, refine with your feedback, and deliver
                the final files.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
