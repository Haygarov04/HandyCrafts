import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Landing from "@/app/components/Landing";
import { pageMetadata } from "@/lib/seo";
import { topicContent, topicList } from "@/lib/topics";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return topicList.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = topicContent((await params).slug, "bg");
  return content ? pageMetadata("bg", content.path, { title: content.metaTitle, description: content.lead }) : {};
}

export default async function Page({ params }: Props) {
  const content = topicContent((await params).slug, "bg");
  if (!content) notFound();
  return <Landing content={content} lang="bg" />;
}
