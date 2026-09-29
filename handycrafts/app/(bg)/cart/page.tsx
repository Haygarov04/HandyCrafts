import type { Metadata } from "next";
import Cart from "@/app/components/pages/Cart";
import { dict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("bg", "/cart", { title: dict["bg"].meta.cartTitle, noindex: true });

export default function Page() {
  return <Cart />;
}
