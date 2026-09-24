import type { Metadata } from "next";
import Home from "@/app/components/pages/Home";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "/", {});

export default function Page() {
  return <Home lang={"en"} />;
}
