"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiscountToggle({ on }: { on: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function flip() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/manage/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ on: !on }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) setError("Не се запази. Опитай пак.");
    router.refresh();
  }

  return (
    <section className="rounded-3xl bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base">Отстъпка −10 €</h2>
          <p className="text-sm text-ink/55">{on ? "Включена на сайта." : "Изключена — сайтът показва редовните цени."}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={busy}
          onClick={flip}
          className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:opacity-50 ${on ? "bg-ember" : "bg-ink/20"}`}
        >
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-ink/50">
        Важи за ключодържатели за един човек, фигурки за 1 или 2 души и всичко за домашни любимци. Цените в поръчките се
        смятат наново при изпращане.
      </p>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
