"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const studio = usePathname().startsWith("/studio");
  if (studio) return <>{children}</>;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
