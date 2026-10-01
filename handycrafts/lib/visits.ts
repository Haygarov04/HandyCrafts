import { getJSON, incr } from "@/lib/kv";

/** Where a visitor came from. Anything unknown is "other". */
export const visitSources = ["tiktok", "instagram", "facebook", "google", "direct", "other"] as const;
export type VisitSource = (typeof visitSources)[number];

export const visitSourceLabel: Record<VisitSource, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  direct: "Директно",
  other: "Други сайтове",
};

/** Long enough to compare a whole year in the stats. */
const KEEP_DAYS = 400;

export function isVisitSource(value: unknown): value is VisitSource {
  return typeof value === "string" && (visitSources as readonly string[]).includes(value);
}

export function dayKey(date: Date) {
  // Bulgarian time, so a day starts at local midnight.
  return date.toLocaleDateString("en-CA", { timeZone: "Europe/Sofia" });
}

export async function recordVisit(source: VisitSource) {
  await incr(`visits:${dayKey(new Date())}:${source}`, KEEP_DAYS * 24 * 60 * 60);
}

/** Visits per source for each given day ("YYYY-MM-DD", Bulgarian time). */
export async function visitsOnDays(dates: string[]) {
  return Promise.all(
    dates.map(async (day) => {
      const counts = await Promise.all(visitSources.map((source) => getJSON<number>(`visits:${day}:${source}`)));
      const bySource = Object.fromEntries(visitSources.map((source, i) => [source, Number(counts[i]) || 0])) as Record<VisitSource, number>;
      return { day, bySource, total: counts.reduce<number>((sum, n) => sum + (Number(n) || 0), 0) };
    })
  );
}

/** Visits per source for each of the last `days` days, oldest first. */
export async function visitsByDay(days: number) {
  const today = Date.now();
  return visitsOnDays(Array.from({ length: days }, (_, i) => dayKey(new Date(today - (days - 1 - i) * 24 * 60 * 60 * 1000))));
}
