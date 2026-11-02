import { articles } from "@/lib/blog";
import { dict, localize } from "@/lib/i18n";
import { landingContent, landingIds } from "@/lib/landings";
import { absolute, siteName } from "@/lib/site";

// The full text of the shop's main pages, FAQ and blog in one file for AI assistants (llmstxt.org).
export const dynamic = "force-static";

export function GET() {
  const pages = landingIds.flatMap((id) =>
    (["bg", "en"] as const).map((lang) => {
      const page = landingContent[id][lang];
      const url = absolute(localize(lang, page.path));
      return [
        `## ${page.title}`,
        `URL: ${url}`,
        page.lead,
        ...page.sections.flatMap((section) => [`### ${section.title}`, ...section.text]),
        ...page.faq.map((item) => `Q: ${item.q}\nA: ${item.a}`),
      ].join("\n\n");
    })
  );
  const faq = (["bg", "en"] as const).flatMap((lang) => dict[lang].faq.map((item) => `Q: ${item.q}\nA: ${item.a}`));
  const blog = articles.map((article) =>
    [
      `## ${article.title}`,
      `URL: ${absolute(`/blog/${article.slug}`)}`,
      article.intro,
      ...article.sections.flatMap((section) => [`### ${section.title}`, ...section.text, ...(section.list || []).map((item) => `- ${item}`)]),
    ].join("\n\n")
  );
  const text = [
    `# ${siteName} — full site text`,
    `> Custom 3D printed, hand-painted figurines from a photo, made in Ruse, Bulgaria. Prices and sizes as JSON: ${absolute("/catalog.json")}. Short summary: ${absolute("/llms.txt")}.`,
    "# Product pages",
    ...pages,
    "# FAQ",
    ...faq,
    "# Blog",
    ...blog,
  ].join("\n\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
