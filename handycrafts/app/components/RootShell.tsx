import { Manrope, Unbounded } from "next/font/google";
import "../globals.css";
import { dict, type Lang } from "@/lib/i18n";
import { seller, sellerComplete } from "@/lib/legal";
import { absolute, business, siteName } from "@/lib/site";
import JsonLd from "./JsonLd";
import SiteFrame from "./SiteFrame";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  weight: ["400", "500", "600"],
});

export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = dict[lang];
  const store = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteName,
    alternateName: "Handy Crafts",
    priceRange: "30 € – 100 €",
    url: absolute(lang === "en" ? "/en" : "/"),
    logo: absolute("/icon.png"),
    image: absolute("/og.jpg"),
    email: business.email,
    description: t.meta.storeDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: lang === "en" ? "Ruse" : business.city,
      addressCountry: business.country,
    },
    areaServed: { "@type": "Country", name: t.meta.country },
    paymentAccepted: t.meta.payment,
    currenciesAccepted: "EUR",
  };

  // Tells Google the brand name, including the spellings people type ("handy crafts").
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: ["Handy Crafts", "HandyCrafts фигурки", "handy-crafts.digital"],
    url: absolute(lang === "en" ? "/en" : "/"),
    inLanguage: lang === "en" ? "en" : "bg",
  };

  return (
    <html lang={t.htmlLang} className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <JsonLd data={website} />
        <JsonLd data={store} />
        <SiteFrame sellerLine={sellerComplete() ? `${seller.name}, ${lang === "en" ? "EIK" : "ЕИК"} ${seller.eik}` : undefined}>{children}</SiteFrame>
      </body>
    </html>
  );
}
