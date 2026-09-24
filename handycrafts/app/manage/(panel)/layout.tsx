import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { manageAllowed, manageOpenInDev } from "@/lib/manage-auth";
import LogoutButton from "./logout-button";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await manageAllowed())) redirect("/manage/login");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/manage" className="flex items-center gap-2">
            <Image src="/logo-remove.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display font-semibold">Поръчки</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-ink/55 hover:text-ink">
              Сайт
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      {manageOpenInDev() ? (
        <p className="mx-auto mt-4 max-w-5xl rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Локално /manage е отворено без парола. Във Vercel задължително има CRM_PASSWORD.
        </p>
      ) : null}
      <div className="mx-auto max-w-5xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-6">{children}</div>
    </>
  );
}
