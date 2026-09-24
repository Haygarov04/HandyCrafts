"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useLang } from "./lang";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
const ADS_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "";
const CONSENT_KEY = "hc_consent_v1";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export const trackingEnabled = Boolean(GA_ID || ADS_ID);

function consentState(granted: boolean) {
  const value = granted ? "granted" : "denied";
  return { ad_storage: value, ad_user_data: value, ad_personalization: value, analytics_storage: value };
}

/** A finished order: Google Ads conversion plus the GA4 purchase event. */
export function trackPurchase(order: { number: string; total: number }) {
  if (!window.gtag) return;
  if (ADS_ID && ADS_LABEL) {
    window.gtag("event", "conversion", {
      send_to: `${ADS_ID}/${ADS_LABEL}`,
      value: order.total,
      currency: "EUR",
      transaction_id: order.number,
    });
  }
  window.gtag("event", "purchase", { transaction_id: order.number, value: order.total, currency: "EUR" });
}

/** Smaller steps that show where people drop off. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  window.gtag?.("event", name, params);
}

/**
 * Google Analytics and Google Ads, loaded only when their IDs are set.
 * Consent Mode starts as "denied" and only a click on "Accept" turns cookies on.
 */
export default function Analytics() {
  const { lang, href } = useLang();
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!trackingEnabled) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(CONSENT_KEY);
    } catch {}
    if (saved === "granted" || saved === "denied") return;
    // A short delay so the banner doesn't cover the page while it is still loading.
    const timer = window.setTimeout(() => setAsk(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!trackingEnabled) return null;

  function answer(granted: boolean) {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {}
    window.gtag?.("consent", "update", consentState(granted));
    setAsk(false);
  }

  const first = GA_ID || ADS_ID;
  const configs = [GA_ID, ADS_ID].filter(Boolean).map((id) => `gtag('config', '${id}');`).join("\n");

  return (
    <>
      <Script id="gtag-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${JSON.stringify({ ...consentState(false), wait_for_update: 500 })});
try { if (localStorage.getItem('${CONSENT_KEY}') === 'granted') gtag('consent', 'update', ${JSON.stringify(consentState(true))}); } catch (e) {}
gtag('js', new Date());
${configs}`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${first}`} strategy="afterInteractive" />

      {ask ? (
        <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_20px_50px_rgba(22,21,19,0.2)] sm:left-auto sm:right-5 sm:bottom-5">
          <p className="text-sm leading-6 text-ink/75">
            {lang === "en"
              ? "We use cookies from Google to see which ads bring visitors and to improve the site. "
              : "Използваме бисквитки на Google, за да виждаме кои реклами водят посетители и да подобряваме сайта. "}
            <Link href={href("/poveritelnost")} className="font-semibold underline decoration-ember underline-offset-4">
              {lang === "en" ? "Privacy" : "Поверителност"}
            </Link>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => answer(false)} className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold">
              {lang === "en" ? "Decline" : "Отказвам"}
            </button>
            <button type="button" onClick={() => answer(true)} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper">
              {lang === "en" ? "Accept" : "Приемам"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
