import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import SiteFrame from "./components/SiteFrame";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  weight: ["400", "500", "600"],
});

// Absolute URLs for link previews (Instagram, Viber, Facebook). On Vercel the
// production domain is known even when NEXT_PUBLIC_SITE_URL is not set.
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "HandyCrafts — фигурка по снимка",
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
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
