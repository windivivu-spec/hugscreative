// Only public information belongs here. Email credentials stay on the server.
export const site = {
  name: "HUGs Creative",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  vimeo: process.env.NEXT_PUBLIC_VIMEO_URL || "",
  reel: "/media/pack/v5-hq.mp4",
  reelPoster: "/media/pack/v5-poster.webp",
  reelIsDemo: true,
  photographyCoverage:
    "Based in Da Nang, Vietnam. Share your event city and date to confirm coverage; other locations by arrangement.",
};
