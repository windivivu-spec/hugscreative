"use client";
import SectionLabel from "@/components/ui/SectionLabel";
import ImpactSculpture from "@/components/ui/ImpactSculpture";
import { Asterisk, Arrow } from "@/components/ui/Icons";

export default function AboutProcess() {
  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-top">
        <SectionLabel index="05">HUGs CREATIVE / DA NANG, VIETNAM</SectionLabel>
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
            Vietnam — a dynamic, fast-growing city emerging as a hub for
            technology and innovation. We bring ideas to life through video,
            design, websites, and digital content crafted to make an impact.
          </p>
          <p className="partner-story">
            One point of contact. A network of specialists in Vietnam, brought
            together around your project — from the initial brief through review
            and delivery.
          </p>
          <a href="#process" className="text-link">
            See how we work <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
