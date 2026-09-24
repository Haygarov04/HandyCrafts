import type { Metadata } from "next";
import Contact from "@/app/components/pages/Contact";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const t = dict["en"].meta;

export const metadata: Metadata = pageMetadata("en", "/contact", { title: t.contactTitle, description: t.contactDescription });

export default function Page() {
  return <Contact />;
}
