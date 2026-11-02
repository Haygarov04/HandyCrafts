"use client";

import { useEffect } from "react";
import { channelOf } from "@/lib/attribution";
import { rememberOrigin } from "./origin-store";

const KEY = "hc_visit_counted";

/** The visit counter's sources are a little coarser than the channels kept with orders. */
function sourceOf(url: URL, referrer: string) {
  const channel = channelOf(url, referrer);
  return channel === "email" ? "other" : channel;
}

/** Sends one anonymous "visit" per browser session, tagged with where the visitor came from. */
export default function VisitCounter() {
  useEffect(() => {
    rememberOrigin();
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
