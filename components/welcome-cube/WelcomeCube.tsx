"use client";

export const CUBE_SERVICES = [
  { id: "graphic", first: "Graphic", second: "design" },
  { id: "motion", first: "Video &", second: "motion" },
  { id: "website", first: "Website", second: "design" },
  { id: "illustration", first: "Illustration", second: "design" },
  { id: "event", first: "Event", second: "photography" },
  { id: "social", first: "Social", second: "media" },
] as const;

export function WelcomeCube({ images }: { images: readonly string[] }) {
  const imageAt = (index: number) => images[index % images.length] ?? "graphic";
  const faces = [
    { name: "front", rotation: "rotateY(0deg)", content: "hug" },
    { name: "back", rotation: "rotateY(180deg)", content: imageAt(1) },
    { name: "right", rotation: "rotateY(90deg)", content: imageAt(2) },
    { name: "left", rotation: "rotateY(-90deg)", content: imageAt(0) },
    { name: "top", rotation: "rotateX(90deg)", content: "hug" },
    { name: "bottom", rotation: "rotateX(-90deg)", content: "hug" },
  ];
  return (
    <div className="welcome-cube-scene" aria-hidden="true">
      <span className="welcome-cube-frame is-outer" />
      <span className="welcome-cube-frame is-inner" />
      <span className="welcome-cube-aura" />
      <div className="welcome-cube-exit"><div className="welcome-cube">
        {faces.map(({ name, rotation, content }) => (
          <div key={name} className="welcome-cube-face" data-face={name} data-current={content}
            style={{ transform: `${rotation} translateZ(var(--cube-depth))` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cube-logo" src="/hug.png" alt="" decoding="async" draggable={false} />
            {CUBE_SERVICES.map((service, i) => (
              <div key={service.id} className={`cube-service cube-service-${service.id} ${i % 2 ? "is-pink" : "is-light"}`} data-content={service.id}>
                <span className="cube-service-type"><em>{service.first}</em><span>{service.second}</span></span>
              </div>
            ))}
          </div>
        ))}
      </div></div>
    </div>
  );
}
