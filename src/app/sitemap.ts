import type { MetadataRoute } from "next";

const siteUrl = "https://ndayenisolutions.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
