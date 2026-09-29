import type { Metadata } from "next";
import Legal from "@/app/components/pages/Legal";
import { legalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDoc("privacy", "en");

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("en", "/poveritelnost", { title: doc.title, description: doc.description });
}

export default function Page() {
  return <Legal id="privacy" lang="en" />;
}
