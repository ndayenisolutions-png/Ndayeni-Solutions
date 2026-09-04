// Section background images — all VLM-verified watermark-free.
// Each path points to a locally-hosted image in /public/section-images/.

export const sectionImages = {
  abstract: "/section-images/abstract.jpg",
  cctv: "/section-images/cctv.jpg",
  repairs: "/section-images/repairs.jpg",
  network: "/section-images/network.jpg",
  itsupport: "/section-images/techhelp.jpg",
  itsupport2: "/section-images/techhelp.jpg",
  techhelp: "/section-images/techhelp.jpg",
  techtheme: "/section-images/techtheme.jpg",
  workspace: "/section-images/workspace.jpg",
  printer: "/section-images/printer.jpg",
  webdesign: "/section-images/webdesign.png",
  graphicdesign: "/section-images/graphicdesign.jpg",
  training: "/section-images/training.jpg",
  office: "/section-images/office.jpg",
  home: "/section-images/home.jpg",
} as const;

export type SectionImageKey = keyof typeof sectionImages;
