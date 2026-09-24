import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Поръчки — HandyCrafts",
  manifest: "/manage/manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Поръчки", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#161513",
};

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
