import type { Metadata } from "next";
import Studio from "@/app/components/pages/Studio";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const t = dict["en"].meta;

export const metadata: Metadata = pageMetadata("en", "/studio", { title: t.studioTitle, description: t.studioDescription });

export default function Page() {
  return <Studio />;
}
