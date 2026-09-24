import type { Metadata } from "next";
import { alternates, dict, type Lang } from "@/lib/i18n";
import { siteName, siteUrl } from "@/lib/site";

/** One stable share image for every page and chat app (Instagram, Viber, Messenger). */
function shareImage(lang: Lang) {
  return {
    url: "/og.jpg",
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt: lang === "en" ? "Figurine next to the photo it was made from — HandyCrafts" : "Фигурка до снимката, по която е направена — HandyCrafts",
  };
}

/** Shared metadata for the root layout of one language. */
export function rootMetadata(lang: Lang): Metadata {
  const t = dict[lang].meta;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.title, template: `%s | ${siteName}` },
    description: t.description,
    applicationName: siteName,
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      locale: dict[lang].ogLocale,
      alternateLocale: lang === "en" ? ["bg_BG"] : ["en_US"],
      type: "website",
      siteName,
      images: [shareImage(lang)],
    },
    twitter: { card: "summary_large_image", images: [shareImage(lang)] },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

/** Title, description, canonical and hreflang for one page. `bgPath` is the page's Bulgarian URL. */
export function pageMetadata(
  lang: Lang,
  bgPath: string,
  input: { title?: string; description?: string; noindex?: boolean; bgOnly?: boolean }
): Metadata {
  const links = input.bgOnly ? { canonical: bgPath } : alternates(bgPath, lang);
  return {
    ...(input.title ? { title: input.title } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.noindex ? { robots: { index: false, follow: false } } : { alternates: links }),
    ...(input.title
      ? {
          openGraph: {
            title: input.title,
            description: input.description,
            url: links.canonical,
            locale: dict[lang].ogLocale,
            type: "website",
            siteName,
            images: [shareImage(lang)],
          },
          twitter: { card: "summary_large_image", title: input.title, description: input.description, images: [shareImage(lang)] },
        }
      : {}),
  };
}
