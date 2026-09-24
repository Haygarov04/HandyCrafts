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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "HandyCrafts — фигурка по снимка",
  description:
    "Мини фигурка или ключодържател по твоя снимка. Виждаш визуализацията веднага, плащаш с наложен платеж. Изработено в Русе.",
  icons: {
    icon: "/logo-remove.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "HandyCrafts — фигурка по снимка",
    description: "Качи снимка, виж фигурката си веднага и я поръчай с наложен платеж.",
    images: ["/shop/hero.webp"],
    locale: "bg_BG",
    type: "website",
  },
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
