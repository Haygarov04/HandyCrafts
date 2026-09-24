import type { Metadata } from "next";
import Thanks from "@/app/components/pages/Thanks";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "/thanks", { title: dict["en"].meta.thanksTitle, noindex: true });

type Props = { searchParams: Promise<{ n?: string }> };

export default async function Page({ searchParams }: Props) {
  const { n } = await searchParams;
  return <Thanks lang={"en"} number={/^HC-\d+$/.test(n || "") ? n! : ""} />;
}
