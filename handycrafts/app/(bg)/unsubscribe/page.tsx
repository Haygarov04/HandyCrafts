import type { Metadata } from "next";
import Unsubscribe from "@/app/components/pages/Unsubscribe";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("bg", "/unsubscribe", { title: "Отписване", noindex: true });

type Props = { searchParams: Promise<{ e?: string; t?: string }> };

export default async function Page({ searchParams }: Props) {
  const { e, t } = await searchParams;
  return <Unsubscribe email={String(e || "").slice(0, 120)} token={String(t || "").slice(0, 64)} />;
}
