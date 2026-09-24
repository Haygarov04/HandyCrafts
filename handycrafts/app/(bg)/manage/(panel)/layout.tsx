import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { manageAllowed, manageOpenInDev } from "@/lib/manage-auth";
import BottomNav from "./bottom-nav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await manageAllowed())) redirect("/manage/login");

  return (
    // The page itself never scrolls: only the middle area does, so the bottom bar can't drift
    // when Safari shows or hides its toolbar.
    <div className="fixed inset-0 flex flex-col bg-paper">
      <header className="shrink-0 border-b border-ink/10 bg-paper pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/manage" className="flex items-center gap-2">
            <Image src="/logo-remove.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display font-semibold">HandyCrafts</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-ink/55 hover:text-ink">
              Сайт
            </Link>
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {manageOpenInDev() ? (
        <p className="mx-auto mt-4 max-w-5xl rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Локално /manage е отворено без парола. Във Vercel задължително има CRM_PASSWORD.
        </p>
      ) : null}
      <div className="mx-auto max-w-5xl px-4 pb-8 pt-6">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
