import type { Lang } from "@/lib/i18n";

/** Just the paths and names of the landing pages, light enough for client components. */
export const landingLinks: { path: string; label: Record<Lang, string> }[] = [
  { path: "/figurka-po-snimka", label: { bg: "Фигурка по снимка", en: "Custom figurine from a photo" } },
  { path: "/figurka-na-domashen-lyubimets", label: { bg: "Фигурка на домашен любимец", en: "Pet figurine from a photo" } },
  { path: "/klyuchodarzhatel-po-snimka", label: { bg: "Ключодържател по снимка", en: "Custom keychain from a photo" } },
  { path: "/personaliziran-podarak", label: { bg: "Персонализиран подарък", en: "Personalised gift" } },
];
