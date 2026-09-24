import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Създай фигурка по снимка",
  description:
    "Качи снимка и за минута виж как ще изглежда твоята 3D фигурка или ключодържател. Човек или домашен любимец, от 30 €. Плащане с наложен платеж.",
  alternates: { canonical: "/studio" },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
