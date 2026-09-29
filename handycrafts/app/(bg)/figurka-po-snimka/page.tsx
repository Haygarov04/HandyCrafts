import type { Metadata } from "next";
import Landing from "@/app/components/Landing";
import { landingContent } from "@/lib/landings";
import { pageMetadata } from "@/lib/seo";

const content = landingContent.figurine.bg;

export const metadata: Metadata = pageMetadata("bg", content.path, { title: content.metaTitle, description: content.lead });

export default function Page() {
  return <Landing content={content} lang={"bg"} />;
}
