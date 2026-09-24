import { Manrope, Unbounded } from "next/font/google";
import "../globals.css";
import { dict, type Lang } from "@/lib/i18n";
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
    url: absolute(lang === "en" ? "/en" : "/"),
    logo: absolute("/icon.png"),
    image: absolute("/opengraph-image.jpg"),
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
    <html lang={t.htmlLang} className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <JsonLd data={store} />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
