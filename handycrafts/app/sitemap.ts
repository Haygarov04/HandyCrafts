import type { MetadataRoute } from "next";
import { absolute, landings } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...landings.map((page) => ({
      url: absolute(page.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absolute("/studio"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absolute("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
