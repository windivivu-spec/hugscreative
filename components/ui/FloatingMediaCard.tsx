import Image from "next/image";
import type { Service } from "@/data/services";
export default function FloatingMediaCard({
  media,
  index,
}: {
  media: Service["media"][number];
  index: number;
}) {
  return (
    <div
      className={`floating-card float-${index} ${media.kind ? `graphic-card graphic-${media.kind}` : ""} ${media.theme || ""}`}
    >
      {media.image ? (
        <Image
          src={media.image}
          alt={media.alt || ""}
          fill
          sizes="(max-width: 700px) 40vw, 23vw"
        />
      ) : media.kind === "calendar" ? (
        <>
          <div className="mock-label">THE CONTENT EDIT / OCTOBER</div>
          <strong>
            Good things.
            <br />
            On schedule.
          </strong>
          <div className="calendar-grid">
            {Array.from({ length: 21 }, (_, i) => (
              <span
                className={[2, 6, 10, 16, 19].includes(i) ? "filled" : ""}
                key={i}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <small>YOUR NEXT CHAPTER, PLANNED.</small>
        </>
      ) : media.kind === "chart" ? (
        <>
          <div className="mock-label">EDITORIAL DIRECTION</div>
          <strong>
            In good
            <br />
            company.
          </strong>
          <div className="chart-bars">
            {[24, 46, 38, 70, 60, 88, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <small>ILLUSTRATIVE CONTENT SYSTEM</small>
        </>
      ) : media.kind === "website" || media.kind === "phone" ? (
        <>
          <div className="browser-chrome">
            <span />
            <span />
            <span />
          </div>
          <div className="web-mock-body">
            <small>
              {media.kind === "phone" ? "AURA OBJECTS" : "COMMON GROUND®"}
            </small>
            <strong>{media.text}</strong>
            <div className="mock-web-image">
              <Image
                src={
                  media.kind === "phone"
                    ? "/media/pack/a1.webp"
                    : "/media/pack/a2.webp"
                }
                alt=""
                fill
                sizes="250px"
              />
            </div>
            <span className="mock-web-link">EXPLORE THE COLLECTION ↗</span>
          </div>
        </>
      ) : (
        <>
          <div className="mock-label">HUGs Creative / EXPLORATIONS</div>
          <strong>
            {media.text?.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </strong>
          <span className="poster-orbit" />
          <small>INDEPENDENT IN SPIRIT. CREATIVE BY NATURE.</small>
        </>
      )}
    </div>
  );
}
