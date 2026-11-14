"use client";

export interface WelcomeCubeProps {
  /** Small project textures; the first and final visible faces remain HUG. */
  images: readonly string[];
}

export function WelcomeCube({ images }: WelcomeCubeProps) {
  const imageAt = (index: number) =>
    images[index % images.length] ?? "/hug.png";
  const faces = [
    { name: "front", rotation: "rotateY(0deg)", src: "/hug.png" },
    { name: "back", rotation: "rotateY(180deg)", src: imageAt(1) },
    { name: "right", rotation: "rotateY(90deg)", src: imageAt(2) },
    { name: "left", rotation: "rotateY(-90deg)", src: imageAt(4) },
    { name: "top", rotation: "rotateX(90deg)", src: imageAt(5) },
    { name: "bottom", rotation: "rotateX(-90deg)", src: imageAt(0) },
  ];

  return (
    <div className="welcome-cube-scene" aria-hidden="true">
      <span className="welcome-cube-frame is-outer" />
      <span className="welcome-cube-frame is-inner" />
      <span className="welcome-cube-aura" />
      <div className="welcome-cube-exit">
        <div className="welcome-cube">
          {faces.map(({ name, rotation, src }) => (
            <div
              key={name}
              className="welcome-cube-face"
              data-face={name}
              style={{
                transform: `${rotation} translateZ(calc(var(--cube-size) / 2))`,
              }}
            >
              {/* These exact small textures are decoded before the spin starts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
