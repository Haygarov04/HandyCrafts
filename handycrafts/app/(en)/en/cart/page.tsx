import type { Metadata } from "next";
import Cart from "@/app/components/pages/Cart";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "/cart", { title: dict["en"].meta.cartTitle, noindex: true });

export default function Page() {
  return <Cart />;
}
