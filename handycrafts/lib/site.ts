import { catalog, currency, type ProductId } from "@/lib/catalog";

export const siteName = "HandyCrafts";

// Absolute URLs for sitemaps, canonicals and link previews. On Vercel the
// production domain is known even when NEXT_PUBLIC_SITE_URL is not set.
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export function absolute(path: string) {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const business = {
  email: "handycraftshelp@gmail.com",
  city: "Русе",
  country: "BG",
};


/** `product: "all"` covers figurines and keychains together, so the lowest price shown is the keychain's. */
export function productJsonLd(input: { product: ProductId | "all"; name: string; description: string; image: string; url: string }) {
  const products = input.product === "all" ? (Object.keys(catalog) as ProductId[]) : [input.product];
  const prices = products.flatMap((id) => catalog[id].sizes.map((size) => size.price));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: absolute(input.image),
    url: absolute(input.url),
    brand: { "@type": "Brand", name: siteName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency === "€" ? "EUR" : currency,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: siteName },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
