import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/manage", "/api/", "/cart", "/thanks"] },
      // AI search and assistants are welcome: they read the same public pages (and llms.txt, catalog.json).
      ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Bingbot"].map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/manage", "/api/", "/cart", "/thanks"],
      })),
    ],
    sitemap: absolute("/sitemap.xml"),
  };
}
