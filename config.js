/* ============================================================
   LeadQuik Sites — per-site config
   This is the data model the visual builder edits. Each media
   section only renders when its link is filled in here, so a
   client never shows an empty "Videos" or "Instagram" block.
   Leave a value as "" (empty) to hide that section.
   ============================================================ */
window.SITE = {
  // YouTube: paste a video ID or full URL. Empty string hides the section.
  youtube: "Tf0i2sS7LYM",

  // Instagram: paste the handle (without @). Empty string hides the section.
  instagram: "",
  // Optional thumbnails for the Instagram grid: { img, url } per post.
  instagramPosts: []
};
