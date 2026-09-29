import type { Metadata } from "next";
import Home from "@/app/components/pages/Home";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("en", "/", {});
}

export default function Page() {
  return <Home lang={"en"} />;
}
