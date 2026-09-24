import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Landing from "@/app/components/Landing";
import { cityContent } from "@/lib/cities";
import { pageMetadata } from "@/lib/seo";
import { citySlugs } from "@/lib/topic-slugs";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return citySlugs.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = cityContent((await params).city);
  return content ? pageMetadata("bg", content.path, { title: content.metaTitle, description: content.lead, bgOnly: true }) : {};
}

export default async function Page({ params }: Props) {
  const content = cityContent((await params).city);
  if (!content) notFound();
  return <Landing content={content} lang="bg" />;
}
