"use client";
import { useState } from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassButton from "@/components/ui/GlassButton";
const offerings = [
  [
    "Graphic Design",
    "Visual content for your brand and campaigns.",
    "Social posts & banners / Labels / Marketing materials",
  ],
  [
    "Video Editing & Motion Graphics",
    "Turn your footage into engaging, polished stories.",
    "Short-form videos / Video ads / Brand & event edits",
  ],
  [
    "Website Design",
    "Clear, engaging websites designed around your business.",
    "Business websites / Landing pages / Responsive UI",
  ],
  [
    "Social Media & Digital Content",
    "Consistent content that keeps your brand active.",
    "Content planning / Social graphics / Short videos",
  ],
  [
    "Event Photography",
    "Capture the people, details, and moments that matter.",
    "Corporate events / Conferences / Brand & product launches",
  ],
];
export default function ServiceScope({
  onContact,
}: {
  onContact: (service?: string) => void;
}) {
  const [preview, setPreview] = useState(0);
  const images = [
    "/media/pack/a6.webp",
    "/media/pack/loops-16x9-poster.webp",
    "/media/pack/a2.webp",
    "/media/pack/a1.webp",
    "/media/pack/v5-poster.webp",
  ];
  return (
    <section className="scope-section" aria-labelledby="scope-heading">
      <div className="scope-heading">
        <SectionLabel index="03">
          THE RIGHT SUPPORT FOR YOUR NEXT PROJECT
        </SectionLabel>
        <h2 id="scope-heading">
          What we can
          <br />
          help you <em>create.</em>
        </h2>
        <p>
          Specialist support across design, video, web, social, and photography.
        </p>
        <div className="scope-visual" key={preview}>
          <div className="scope-visual-photo">
            <Image
              src={images[preview]}
              alt={`Media pack visual direction for ${offerings[preview][0]}`}
              fill
              sizes="(max-width:767px) 90vw,40vw"
            />
          </div>
          <span className="scope-visual-index">0{preview + 1} / 05</span>
          <div className="scope-visual-caption">
            <strong>{offerings[preview][0]}</strong>
            <small>VISUAL DIRECTION / MEDIA PACK</small>
          </div>
        </div>
      </div>
      <div className="scope-list">
        {offerings.map(([name, description, deliverables], i) => (
          <article
            key={name}
            onMouseEnter={() => setPreview(i)}
            onFocusCapture={() => setPreview(i)}
          >
            <span className="scope-index">0{i + 1}</span>
            <div>
              <h3>{name}</h3>
              <button
                className="scope-preview-button"
                onClick={() => setPreview(i)}
                aria-pressed={preview === i}
              >
                Preview direction <span aria-hidden="true">↗</span>
              </button>
              <p>{description}</p>
              <small>{deliverables}</small>
              {i === 4 && (
                <p className="scope-note">
                  Event photography availability varies by location. Share the
                  city and date so we can confirm coverage.
                </p>
              )}
              {i === 2 && (
                <p className="scope-note">
                  Development, CMS, and ongoing maintenance are scoped
                  separately.
                </p>
              )}
              <button
                className="text-link scope-select"
                aria-label={`Discuss ${name}`}
                onClick={() => onContact(name)}
              >
                Discuss this service
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
        <GlassButton onClick={() => onContact()}>
          Discuss your project
        </GlassButton>
      </div>
    </section>
  );
}
