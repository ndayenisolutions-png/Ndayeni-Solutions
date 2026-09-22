// Section background images — all VLM-verified watermark-free.
// Each path points to a locally-hosted image in /public/section-images/.
//
// NOTE: Compressed to WebP at 78% quality (resized to max 1920px) via sharp.
// Total payload reduction: ~5MB across the homepage (e.g. abstract.jpg
// 686KB → 232KB WebP, 66% smaller). WebP is supported by iOS Safari 14+
// (Sep 2020+), Chrome, Edge, Firefox — covers >99% of users. office.jpg
// stays as .jpg because the WebP version was actually larger (already tiny).

export const sectionImages = {
  abstract: "/section-images/abstract.webp",
  cctv: "/section-images/cctv.webp",
  repairs: "/section-images/repairs.webp",
  network: "/section-images/network.webp",
  itsupport: "/section-images/techhelp.webp",
  itsupport2: "/section-images/techhelp.webp",
  techhelp: "/section-images/techhelp.webp",
  techtheme: "/section-images/techtheme.webp",
  workspace: "/section-images/workspace.webp",
  printer: "/section-images/printer.webp",
  webdesign: "/section-images/webdesign.webp",
  graphicdesign: "/section-images/graphicdesign.webp",
  training: "/section-images/training.webp",
  office: "/section-images/office.jpg",
  home: "/section-images/home.webp",
  automation: "/section-images/automation.webp",
} as const;

export type SectionImageKey = keyof typeof sectionImages;
