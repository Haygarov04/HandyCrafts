// Where a visitor came from (Instagram, TikTok, Google, ChatGPT, an ad…) and, on the server, their
// country. Kept with orders and contact messages so the shop can see which channels bring customers.
// Only the country is stored, never the IP address.

export const channels = ["instagram", "tiktok", "facebook", "pinterest", "google", "ai", "email", "other", "direct"] as const;
export type Channel = (typeof channels)[number];

export const channelLabel: Record<Channel, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  pinterest: "Pinterest",
  google: "Google",
  ai: "ChatGPT / AI",
  email: "Имейл",
  other: "Друг сайт",
  direct: "Директно",
};

export type Origin = {
  channel: Channel;
  /** Came through a paid ad or a promoted post (utm_medium, gclid, fbclid, ttclid…). */
  ad?: boolean;
  /** utm_campaign, e.g. "otsveti_sam". */
  campaign?: string;
  /** The other site's host, e.g. "chatgpt.com". */
  referrer?: string;
  /** The first page they opened on our site. */
  landing?: string;
  /** Two-letter country code from the request, e.g. "GR". */
  country?: string;
};

/** The channel for a landing URL and the referrer the browser reports. */
export function channelOf(url: URL, referrer: string): Channel {
  const utm = (url.searchParams.get("utm_source") || "").toLowerCase();
  const ref = referrer.toLowerCase();
  const text = `${utm} ${ref}`;
  if (/tiktok/.test(text)) return "tiktok";
  if (/instagram|\big\b/.test(text)) return "instagram";
  if (/facebook|fb\.|\bfb\b|messenger/.test(text)) return "facebook";
  if (/pinterest|pin\.it/.test(text)) return "pinterest";
  if (/chatgpt|openai|perplexity|gemini|copilot|claude\.ai|bard/.test(text)) return "ai";
  if (/google/.test(text)) return "google";
  if (/mail|newsletter/.test(text)) return "email";
  if (!utm && (!ref || ref.includes(url.hostname))) return "direct";
  return "other";
}

/** True when the visit came from a paid ad or a promoted post. */
export function isAd(url: URL) {
  const medium = (url.searchParams.get("utm_medium") || "").toLowerCase();
  return /cpc|ppc|paid|ad|promote|boost/.test(medium) || ["gclid", "fbclid", "ttclid", "msclkid"].some((key) => url.searchParams.has(key));
}

const short = (value: unknown, max: number) => (typeof value === "string" ? value.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max) : "");

/** Checks an origin sent by the browser and adds the country from the request (Vercel's IP header). */
export function cleanOrigin(input: unknown, headers: Headers): Origin | undefined {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const country = short(headers.get("x-vercel-ip-country"), 2).toUpperCase();
  const channel = (channels as readonly unknown[]).includes(raw.channel) ? (raw.channel as Channel) : undefined;
  if (!channel && !country) return undefined;
  return {
    channel: channel || "direct",
    ...(raw.ad === true ? { ad: true } : {}),
    ...(short(raw.campaign, 60) ? { campaign: short(raw.campaign, 60) } : {}),
    ...(short(raw.referrer, 80) ? { referrer: short(raw.referrer, 80) } : {}),
    ...(short(raw.landing, 120) ? { landing: short(raw.landing, 120) } : {}),
    ...(/^[A-Z]{2}$/.test(country) ? { country } : {}),
  };
}

/** "GR" → "🇬🇷 Гърция". */
export function countryName(code?: string) {
  if (!code) return "";
  const flag = String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
  let name = code;
  try {
    name = new Intl.DisplayNames(["bg"], { type: "region" }).of(code) || code;
  } catch {}
  return `${flag} ${name}`;
}

/** One line for the panel and emails, e.g. "Instagram (реклама · otsveti_sam) · 🇬🇷 Гърция". */
export function originLine(origin?: Origin) {
  if (!origin) return "";
  const extra = [origin.ad ? "реклама" : "", origin.campaign || "", origin.channel === "other" || origin.channel === "ai" ? origin.referrer || "" : ""].filter(Boolean);
  return [`${channelLabel[origin.channel]}${extra.length ? ` (${extra.join(" · ")})` : ""}`, countryName(origin.country)].filter(Boolean).join(" · ");
}
