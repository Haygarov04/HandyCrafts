import type { MetadataRoute } from "next";
import { langs, localize } from "@/lib/i18n";
import { landingLinks } from "@/lib/landing-links";
import { absolute } from "@/lib/site";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  ...landingLinks.map((page) => ({ path: page.path, priority: 0.9, changeFrequency: "monthly" as const })),
  { path: "/studio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pages.flatMap((page) =>
    langs.map((lang) => ({
      url: absolute(localize(lang, page.path)),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: lang === "bg" ? page.priority : Math.round(page.priority * 80) / 100,
      alternates: {
        languages: {
          bg: absolute(page.path),
          en: absolute(localize("en", page.path)),
        },
      },
    }))
  );
}
