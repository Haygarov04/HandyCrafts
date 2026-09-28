"use client";

import { useEffect } from "react";

const KEY = "hc_visit_counted";

function sourceOf(url: URL, referrer: string) {
  const utm = (url.searchParams.get("utm_source") || "").toLowerCase();
  const ref = referrer.toLowerCase();
  const text = `${utm} ${ref}`;
  if (/tiktok/.test(text)) return "tiktok";
  if (/instagram|\big\b/.test(text)) return "instagram";
  if (/facebook|fb\.|\bfb\b|messenger/.test(text)) return "facebook";
  if (/google/.test(text)) return "google";
  if (!utm && (!ref || ref.includes(url.hostname))) return "direct";
  return "other";
}

/** Sends one anonymous "visit" per browser session, tagged with where the visitor came from. */
export default function VisitCounter() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      return;
    }
    const source = sourceOf(new URL(window.location.href), document.referrer || "");
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
