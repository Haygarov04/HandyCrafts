import { Manrope, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = dict[lang];
  const store = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteName,
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

  return (
    <html lang={t.htmlLang} className={`${manrope.variable} ${playfair.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <JsonLd data={store} />
        <SiteFrame sellerLine={sellerComplete() ? `${seller.name}, ${lang === "en" ? "EIK" : "ЕИК"} ${seller.eik}` : undefined}>{children}</SiteFrame>
      </body>
    </html>
  );
}
