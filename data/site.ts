// Only public information belongs here. Email credentials stay on the server.
export const site = {
  name: "HUGs Creative",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  vimeo: process.env.NEXT_PUBLIC_VIMEO_URL || "",
  // Set to an approved asset and caption track when the real reel is supplied.
  reel: "/media/hugs-direction-reel.mp4",
  reelPoster: "/media/dunes.jpg",
  reelIsDemo: true,
  photographyCoverage:
    "Availability is confirmed for each location. Share the city and date with your brief.",
};
