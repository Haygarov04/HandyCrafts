"use client";

import { usePathname } from "next/navigation";
import Analytics from "./Analytics";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./cart";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteFrame({ children, sellerLine }: { children: React.ReactNode; sellerLine?: string }) {
  const pathname = (usePathname() || "/").replace(/^\/en(?=\/|$)/, "") || "/";
  const manage = pathname.startsWith("/manage");
  const bare = pathname.startsWith("/studio") || manage;
  return (
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
    </CartProvider>
  );
}
