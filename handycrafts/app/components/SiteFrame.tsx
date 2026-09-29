"use client";

import { usePathname } from "next/navigation";
import Analytics from "./Analytics";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./cart";
import { DiscountProvider } from "./discount";
import Footer from "./Footer";
import Navbar from "./Navbar";
import VisitCounter from "./VisitCounter";

export default function SiteFrame({
  children,
  sellerLine,
  discount,
}: {
  children: React.ReactNode;
  sellerLine?: string;
  discount: boolean;
}) {
  const pathname = (usePathname() || "/").replace(/^\/en(?=\/|$)/, "") || "/";
  const manage = pathname.startsWith("/manage");
  const bare = pathname.startsWith("/studio") || manage;
  return (
    <DiscountProvider value={discount}>
    <CartProvider>
      {bare ? (
        children
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer sellerLine={sellerLine} />
        </>
      )}
      {manage ? null : <CartDrawer />}
      {manage ? null : <Analytics />}
      {manage ? null : <VisitCounter />}
    </CartProvider>
    </DiscountProvider>
  );
}
