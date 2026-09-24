import type { Metadata } from "next";
import Terms from "@/app/components/pages/Terms";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const t = dict["bg"].meta;

export const metadata: Metadata = pageMetadata("bg", "/terms", { title: t.termsTitle, description: t.termsDescription });

export default function Page() {
  return <Terms lang={"bg"} />;
}
