import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Въпрос за фигурка по снимка, поръчка на няколко души или по-голям размер? Пиши на HandyCrafts, Русе.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
