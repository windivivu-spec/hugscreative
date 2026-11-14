import gsap from "gsap";

export const CUBE_SPIN_END = 2.1;
export const CUBE_BLOOM_START = CUBE_SPIN_END;

/** One continuous gesture: a small wind-up, readable image sweep, then a short landing. */
export function addCubeSpin(
  timeline: gsap.core.Timeline,
  cube: HTMLElement,
  images: readonly string[],
) {
  const imageAt = (index: number) =>
    images[index % images.length] ?? "/hug.png";
  const faceImage = (name: string) =>
    cube.querySelector<HTMLImageElement>(`[data-face="${name}"] img`);
  const front = faceImage("front");
  const back = faceImage("back");
  const left = faceImage("left");
  for (const [name, index] of [
    ["back", 1],
    ["right", 2],
    ["left", 4],
    ["top", 5],
    ["bottom", 0],
  ] as const) {
    const image = faceImage(name);
    if (image) image.src = imageAt(index);
  }
  if (front) front.src = "/hug.png";

  let frontChanged = false;
  let backChanged = false;
  let leftChanged = false;
  const swapHiddenFaces = () => {
    // Read the actual animated angle, never a smoothed target. Every swap
    // happens on a concealed face, even if a frame is dropped.
    const angle = Number(gsap.getProperty(cube, "rotationY"));
    if (!frontChanged && angle > 135) {
      if (front) front.src = imageAt(0);
      frontChanged = true;
    }
    if (!leftChanged && angle > 225) {
      if (left) left.src = imageAt(3);
      leftChanged = true;
    }
    if (!backChanged && angle > 315) {
      if (back) back.src = "/hug.png";
      backChanged = true;
    }
  };

  timeline
    .to(
      cube,
      {
        rotationX: 7,
        rotationZ: -4,
        duration: 0.18,
        ease: "power2.out",
      },
      0,
    )
    .to(
      cube,
      {
        rotationY: 540,
        duration: CUBE_SPIN_END - 0.08,
        // Spread the sweep across more of the gesture so each project face
        // remains legible, while retaining acceleration and a short landing.
        ease: (time: number) => {
          const t = Math.pow(time, 1.25);
          return t * t * (3 - 2 * t);
        },
        onUpdate: swapHiddenFaces,
      },
      0.08,
    )
    .to(
      cube,
      {
        rotationX: -24,
        rotationZ: 5,
        duration: CUBE_SPIN_END * 0.45 - 0.18,
        ease: "power2.inOut",
      },
      0.18,
    )
    .to(
      cube,
      {
        rotationX: 0,
        rotationZ: 0,
        duration: CUBE_SPIN_END * 0.55,
        ease: "power2.inOut",
      },
      CUBE_SPIN_END * 0.45,
    );
}
