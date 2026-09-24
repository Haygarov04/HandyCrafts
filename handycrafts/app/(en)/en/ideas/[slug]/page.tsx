import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Landing from "@/app/components/Landing";
import { pageMetadata } from "@/lib/seo";
import { topicSlugs } from "@/lib/topic-slugs";
import { topicContent } from "@/lib/topics";

type Props = { params: Promise<{ slug: string }> };

const bgSlug = (en: string) => Object.keys(topicSlugs).find((bg) => topicSlugs[bg] === en) || "";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(topicSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = topicContent(bgSlug((await params).slug), "en");
  return content ? pageMetadata("en", content.path, { title: content.metaTitle, description: content.lead }) : {};
}

export default async function Page({ params }: Props) {
  const content = topicContent(bgSlug((await params).slug), "en");
  if (!content) notFound();
  return <Landing content={content} lang="en" />;
}
