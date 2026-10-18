"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./lang";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
const ADS_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "";
// Meta Pixel (Facebook + Instagram ads). The ID is public; the env var can replace it.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1426817696297029";
const CONSENT_KEY = "hc_consent_v1";

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
    fbq?: Fbq;
  }
}

export const trackingEnabled = Boolean(GA_ID || ADS_ID || PIXEL_ID);

// Site events → Meta's standard events, so ads can optimise for them.
const metaEvents: Record<string, string> = { generate_preview: "Lead", add_to_cart: "AddToCart", preview_email: "Contact" };

function consentState(granted: boolean) {
  const value = granted ? "granted" : "denied";
  return { ad_storage: value, ad_user_data: value, ad_personalization: value, analytics_storage: value };
}

/** A finished order: Google Ads conversion plus the GA4 purchase event. */
export function trackPurchase(order: { number: string; total: number }) {
  window.fbq?.("track", "Purchase", { value: order.total, currency: "EUR" }, { eventID: order.number });
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
  const meta = metaEvents[name];
  if (meta) window.fbq?.("track", meta, { currency: "EUR", value: params.value, content_category: params.product });
  else window.fbq?.("trackCustom", name, params);
}

/**
 * Google Analytics and Google Ads, loaded only when their IDs are set.
 * Consent Mode starts as "denied" and only a click on "Accept" turns cookies on.
 */
export default function Analytics() {
  const { lang, href } = useLang();
  const [ask, setAsk] = useState(false);
  const pathname = usePathname();
  const firstPage = useRef(true);

  // The pixel counts the first page itself; later client-side navigations are sent here.
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

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
    window.fbq?.("consent", granted ? "grant" : "revoke");
    setAsk(false);
  }

  const first = GA_ID || ADS_ID;
  const hasGoogle = Boolean(first);
  const configs = [GA_ID, ADS_ID].filter(Boolean).map((id) => `gtag('config', '${id}');`).join("\n");

  return (
    <>
      {PIXEL_ID ? (
        // Meta Pixel with consent revoked until "Accept": no cookies and no data are sent before that.
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
var granted=false;try{granted=localStorage.getItem('${CONSENT_KEY}')==='granted'}catch(e){}
fbq('consent', granted ? 'grant' : 'revoke');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
      {hasGoogle ? (
      <Script id="gtag-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${JSON.stringify({ ...consentState(false), wait_for_update: 500 })});
try { if (localStorage.getItem('${CONSENT_KEY}') === 'granted') gtag('consent', 'update', ${JSON.stringify(consentState(true))}); } catch (e) {}
gtag('js', new Date());
${configs}`}
      </Script>
      ) : null}
      {hasGoogle ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${first}`} strategy="afterInteractive" /> : null}

      {ask ? (
        <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_20px_50px_rgba(22,21,19,0.2)] sm:left-auto sm:right-5 sm:bottom-5">
          <p className="text-sm leading-6 text-ink/75">
            {lang === "en"
              ? "We use cookies from Google and Meta (Facebook, Instagram) to see which ads bring visitors and to improve the site. "
              : "Използваме бисквитки на Google и Meta (Facebook, Instagram), за да виждаме кои реклами водят посетители и да подобряваме сайта. "}
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
