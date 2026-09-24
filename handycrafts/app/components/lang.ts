"use client";

import { usePathname } from "next/navigation";
import { dict, langFromPath, localize } from "@/lib/i18n";

/** Language of the current page, taken from the URL (/en/... is English). */
export function useLang() {
  const lang = langFromPath(usePathname() || "/");
  return { lang, t: dict[lang], href: (path: string) => localize(lang, path) };
}
