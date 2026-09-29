import type { Metadata } from "next";
import Legal from "@/app/components/pages/Legal";
import { legalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDoc("terms", "bg");

export const metadata: Metadata = pageMetadata("bg", "/terms", { title: doc.title, description: doc.description });

export default function Page() {
  return <Legal id="terms" lang="bg" />;
}
