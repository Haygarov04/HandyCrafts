import type { Metadata } from "next";
import Legal from "@/app/components/pages/Legal";
import { legalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDoc("delivery", "bg");

export const metadata: Metadata = pageMetadata("bg", "/dostavka", { title: doc.title, description: doc.description });

export default function Page() {
  return <Legal id="delivery" lang="bg" />;
}
