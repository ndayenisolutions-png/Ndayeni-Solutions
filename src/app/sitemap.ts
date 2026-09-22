import type { MetadataRoute } from "next";

const siteUrl = "https://ndayenisolutions.co.za";

// Single source of truth for every public route we want search engines to crawl.
const serviceSlugs = [
  "it-support-outsourcing",
  "computer-repairs",
  "networking-wifi",
  "cctv-security",
  "printer-office-technology",
  "web-design",
  "graphic-design-branding",
  "digital-automation",
  "digital-skills-training",
];

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/training`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/training/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/training/verify`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
