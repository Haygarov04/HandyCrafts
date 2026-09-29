import type { Metadata } from "next";
import Ideas from "@/app/components/pages/Ideas";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("bg", "/idei", {
  title: "Идеи за фигурки и подаръци по снимка",
  description: "Фигурки по снимка за сватба, рожден ден, годишнина, Коледа, домашни любимци, деца, баба и дядо и колеги. Доставка в цяла България.",
});

export default function Page() {
  return <Ideas lang="bg" />;
}
