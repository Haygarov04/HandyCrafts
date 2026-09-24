"use client";

import { useEffect, useState } from "react";

function keyBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

type State = "loading" | "unsupported" | "ios-install" | "off" | "on" | "blocked" | "no-keys";

export default function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [note, setNote] = useState("");
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (!("serviceWorker" in navigator)) {
      setState("unsupported");
      return;
    }
    navigator.serviceWorker
      .register("/manage-sw.js", { scope: "/manage", updateViaCache: "none" })
      .then(async (registration) => {
        if (!("PushManager" in window)) {
          setState(ios && !standalone ? "ios-install" : "unsupported");
          return;
        }
        if (!publicKey) {
          setState("no-keys");
          return;
        }
        if (Notification.permission === "denied") {
          setState("blocked");
          return;
        }
        const sub = await registration.pushManager.getSubscription();
        setState(sub ? "on" : "off");
      })
      .catch(() => setState("unsupported"));
  }, [publicKey]);

  async function enable() {
    setNote("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const sub =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyBytes(publicKey),
        }));
      const res = await fetch("/api/manage/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), device: navigator.userAgent }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Не се записа.");
      setState("on");
      setNote("Готово. Ще получаваш известие при всяка нова поръчка.");
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Не се включи.");
    }
  }

  async function disable() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/manage/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
    setState("off");
    setNote("");
  }

  async function test() {
    setNote("Изпращаме…");
    const res = await fetch("/api/manage/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    });
    setNote(res.ok ? "Изпратено. Трябва да видиш известие." : "Не мина.");
  }

  const box = "rounded-3xl bg-white p-5";

  if (state === "loading") return null;
  if (state === "ios-install") {
    return (
      <div className={box}>
        <p className="font-semibold">Известия на iPhone</p>
        <p className="mt-1 text-sm leading-6 text-ink/60">
          Отвори тази страница в Safari → бутона „Сподели“ → „Добави към началния екран“. После отвори
          „Поръчки“ от иконата и включи известията оттук.
        </p>
      </div>
    );
  }
  if (state === "unsupported") {
    return <p className="text-sm text-ink/50">Този браузър не поддържа известия.</p>;
  }
  if (state === "no-keys") {
    return <p className="text-sm text-ink/50">Известията чакат VAPID ключовете във Vercel.</p>;
  }
  if (state === "blocked") {
    return (
      <p className="text-sm text-ink/60">
        Известията са блокирани за сайта. Разреши ги от настройките на браузъра и презареди.
      </p>
    );
  }

  return (
    <div className={`${box} flex flex-wrap items-center justify-between gap-3`}>
      <div>
        <p className="font-semibold">Известия за нови поръчки</p>
        <p className="text-sm text-ink/55">{note || (state === "on" ? "Включени на това устройство." : "Изключени на това устройство.")}</p>
      </div>
      <div className="flex gap-2">
        {state === "on" ? (
          <>
            <button type="button" onClick={test} className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">
              Тест
            </button>
            <button type="button" onClick={disable} className="rounded-full border border-ink/15 px-4 py-2 text-sm">
              Изключи
            </button>
          </>
        ) : (
          <button type="button" onClick={enable} className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-ink">
            Включи
          </button>
        )}
      </div>
    </div>
  );
}
