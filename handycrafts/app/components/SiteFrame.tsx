"use client";

import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "./cart";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
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
          <Footer />
        </>
      )}
      {manage ? null : <CartDrawer />}
    </CartProvider>
  );
}
