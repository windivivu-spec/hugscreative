import gsap from "gsap";

export const CUBE_SPIN_END = 3.4;
export const CUBE_BLOOM_START = CUBE_SPIN_END;

/** One continuous gesture: a small wind-up, readable image sweep, then a short landing. */
export function addCubeSpin(
  timeline: gsap.core.Timeline,
  cube: HTMLElement,
  images: readonly string[],
) {
  const imageAt = (index: number) => images[index % images.length] ?? "graphic";
  const show = (name: string, content: string) => {
    const face = cube.querySelector<HTMLElement>(`[data-face="${name}"]`);
    if (face) face.dataset.current = content;
  };
  for (const [name, index] of [["back", 1], ["right", 2], ["left", 0]] as const) {
    show(name, imageAt(index));
  }
  show("front", "hug");
  show("top", "hug");
  show("bottom", "hug");
  let frontChanged = false;
  let backChanged = false;
  let leftChanged = false;
  let frontRestored = false;
  const swapHiddenFaces = () => {
    const angle = Number(gsap.getProperty(cube, "rotationY"));
    if (!frontChanged && angle > 135) { show("front", imageAt(3)); frontChanged = true; }
    if (!leftChanged && angle > 225) { show("left", imageAt(4)); leftChanged = true; }
    if (!backChanged && angle > 315) { show("back", imageAt(5)); backChanged = true; }
    if (!frontRestored && angle > 495) { show("front", "hug"); frontRestored = true; }
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
        rotationY: 720,
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
