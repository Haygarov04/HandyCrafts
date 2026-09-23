import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import "./globals.css";
import SiteFrame from "./components/SiteFrame";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-literata",
});

export const metadata: Metadata = {
  title: "HandyCrafts 3D — фигурки и 3D изработка в Русе",
  description:
    "Фигурка по снимка, 3D принтиране, сканиране и моделиране. Работилница в Русе. Първо визуализация, после изработка.",
  icons: {
    icon: "/logo-remove.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className={`${manrope.variable} ${literata.variable}`}>
      <body className="relative overflow-x-hidden antialiased">
        <SiteFrame>
          <main>{children}</main>
        </SiteFrame>
      </body>
    </html>
  );
}
