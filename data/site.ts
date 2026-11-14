// Only public information belongs here. Email credentials stay on the server.
export const site = {
  name: "HUGs Creative",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  vimeo: process.env.NEXT_PUBLIC_VIMEO_URL || "",
  reel: "/media/Video/Fuji.mp4",
  reelPoster: "/media/previews/camera-in-focus.jpg",
  reelIsDemo: true,
  photographyCoverage:
    "Based in Da Nang, Vietnam. Share your event city and date to confirm coverage; other locations by arrangement.",
};
