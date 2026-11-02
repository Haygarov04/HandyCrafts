"use client";

import { channelOf, isAd, type Origin } from "@/lib/attribution";

const KEY = "hc_origin";
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Remembers where this visitor came from, for the order or message they send later. A visit from a
 * real source (Instagram, an ad, ChatGPT…) replaces the stored one; a direct visit only fills a gap.
 */
export function rememberOrigin() {
  try {
    const url = new URL(window.location.href);
    const referrer = document.referrer || "";
    const channel = channelOf(url, referrer);
    const stored = storedOrigin();
    if (channel === "direct" && stored) return;
    let host = "";
    try {
      host = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
    } catch {}
    const origin: Origin & { at: number } = {
      channel,
      ...(isAd(url) ? { ad: true } : {}),
      ...(url.searchParams.get("utm_campaign") ? { campaign: url.searchParams.get("utm_campaign")! } : {}),
      ...(host && host !== url.hostname.replace(/^www\./, "") ? { referrer: host } : {}),
      landing: url.pathname,
      at: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(origin));
  } catch {}
}

/** The remembered origin, or null when there is none or it is older than 30 days. */
export function storedOrigin(): Origin | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null") as (Origin & { at?: number }) | null;
    if (!value || !value.at || Date.now() - value.at > KEEP_MS) return null;
    const { at: _at, ...origin } = value;
    void _at;
    return origin;
  } catch {
    return null;
  }
}
