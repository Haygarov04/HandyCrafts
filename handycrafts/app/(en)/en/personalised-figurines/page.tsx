import type { Metadata } from "next";
import Landing from "@/app/components/Landing";
import { landingContent } from "@/lib/landings";
import { pageMetadata } from "@/lib/seo";

const content = landingContent.custom.en;

export const metadata: Metadata = pageMetadata("en", content.path, { title: content.metaTitle, description: content.lead });

export default function Page() {
  return <Landing content={content} lang={"en"} />;
}
