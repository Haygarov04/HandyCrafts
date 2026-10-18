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
  // Height of a fixed bar at the bottom of the page (the studio's), so the strip never covers it.
  const [lift, setLift] = useState(0);
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

  useEffect(() => {
    if (!ask) return;
    const measure = () => setLift(document.getElementById("studio-bar")?.offsetHeight || 0);
    measure();
    const timer = window.setInterval(measure, 800);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", measure);
    };
  }, [ask, pathname]);

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
        // A slim strip at the bottom that never blocks the page; it sits above the studio's bottom bar.
        <div
          role="region"
          aria-label={lang === "en" ? "Cookies" : "Бисквитки"}
          className="pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-3"
          style={{ bottom: `calc(${lift}px + 0.75rem + env(safe-area-inset-bottom))` }}
        >
          <div className="hc-pop pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full border border-ink/10 bg-white/95 py-2 pl-4 pr-2 shadow-[0_12px_32px_rgba(22,21,19,0.14)] backdrop-blur">
            <Link
              href={href("/poveritelnost")}
              className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap text-[13px] text-ink/70 hover:text-ink"
            >
              <span aria-hidden className="text-lg leading-none">🍪</span>
              {lang === "en" ? "We use cookies" : "Използваме бисквитки"}
            </Link>
            <button type="button" onClick={() => answer(false)} className="shrink-0 rounded-full px-3 py-2 text-[13px] font-semibold text-ink/55 transition hover:text-ink">
              {lang === "en" ? "No" : "Не"}
            </button>
            <button type="button" onClick={() => answer(true)} className="shrink-0 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition hover:bg-ink/85">
              {lang === "en" ? "Accept" : "Приемам"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
