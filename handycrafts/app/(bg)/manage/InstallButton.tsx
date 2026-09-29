"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type InstallWindow = Window & { __hcInstall?: InstallPrompt | null };

/** "Инсталирай" in the panel header: Android/Chrome gets the real install dialog, iPhone gets the Safari steps. */
export default function InstallButton() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [ios, setIos] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const win = window as InstallWindow;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Chrome only offers installing once a service worker controls /manage.
    navigator.serviceWorker?.register("/manage-sw.js", { scope: "/manage", updateViaCache: "none" }).catch(() => {});

    // After hydration, so the server HTML (no button) matches the first render.
    queueMicrotask(() => {
      setIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
      if (win.__hcInstall) setPrompt(win.__hcInstall);
    });
    const onPrompt = (event: Event) => {
      event.preventDefault();
      win.__hcInstall = event as InstallPrompt;
      setPrompt(event as InstallPrompt);
    };
    const onInstalled = () => {
      win.__hcInstall = null;
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice.catch(() => null);
    (window as InstallWindow).__hcInstall = null;
    setPrompt(null);
  }

  if (!prompt && !ios) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={prompt ? install : () => setHelp((open) => !open)}
        className="rounded-full bg-ember px-3.5 py-1.5 text-sm font-semibold text-ink"
      >
        Инсталирай
      </button>
      {help ? (
        <p className="absolute right-0 top-11 z-20 w-64 rounded-2xl bg-white p-4 text-sm leading-6 text-ink/70 shadow-lg">
          В Safari натисни „Сподели“ → „Добави към началния екран“. После отваряй „Поръчки“ от иконата.
        </p>
      ) : null}
    </div>
  );
}
