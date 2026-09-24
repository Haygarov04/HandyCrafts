import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import SiteFrame from "./components/SiteFrame";
import { absolute, business, siteName, siteUrl } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "3D фигурки и ключодържатели по снимка | HandyCrafts",
    template: "%s | HandyCrafts",
  },
  description:
    "Мини фигурка или ключодържател по твоя снимка. Виждаш визуализацията веднага, плащаш с наложен платеж. Изработено в Русе.",
  openGraph: {
    title: "HandyCrafts — фигурка по снимка",
    description: "Качи снимка, виж фигурката си веднага и я поръчай с наложен платеж.",
    locale: "bg_BG",
    type: "website",
    siteName: "HandyCrafts",
  },
  twitter: { card: "summary_large_image" },
  applicationName: siteName,
  keywords: [
    "фигурка по снимка",
    "3D фигурка",
    "персонализирана фигурка",
    "ключодържател по снимка",
    "фигурка на куче",
    "фигурка на домашен любимец",
    "персонализиран подарък",
    "подарък за годишнина",
    "мини фигурка",
  ],
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: siteName,
  url: siteUrl(),
  logo: absolute("/icon.png"),
  image: absolute("/opengraph-image.jpg"),
  email: business.email,
  description: "3D фигурки и ключодържатели по снимка на хора и домашни любимци, изработени на ръка.",
  address: { "@type": "PostalAddress", addressLocality: business.city, addressCountry: business.country },
  areaServed: { "@type": "Country", name: "България" },
  paymentAccepted: "Наложен платеж",
  currenciesAccepted: "EUR",
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <JsonLd data={organization} />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
