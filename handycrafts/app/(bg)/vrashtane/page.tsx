import type { Metadata } from "next";
import Legal from "@/app/components/pages/Legal";
import { legalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDoc("returns", "bg");

export const metadata: Metadata = pageMetadata("bg", "/vrashtane", { title: doc.title, description: doc.description });

export default function Page() {
  return <Legal id="returns" lang="bg" />;
}
