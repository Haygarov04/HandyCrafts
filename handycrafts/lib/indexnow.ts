import sitemap from "@/app/sitemap";
import { siteUrl } from "@/lib/site";

// IndexNow tells Bing (which ChatGPT search uses), Yandex, Seznam and others that pages changed, so
// they crawl them in days instead of weeks. The key file is public/<key>.txt.
const KEY = "5277a2e071990a0c597e904d95a44225";

/** Sends every URL in the sitemap. Called once a week from the daily cron. */
export async function submitSitemapToIndexNow() {
  const base = siteUrl();
  if (!base.startsWith("https://")) return { skipped: "not production" };
  const urlList = sitemap().map((entry) => entry.url).slice(0, 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(base).host, key: KEY, keyLocation: `${base}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  return { status: res?.status ?? 0, urls: urlList.length };
}
