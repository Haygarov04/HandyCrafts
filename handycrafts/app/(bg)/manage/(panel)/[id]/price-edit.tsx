"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { money } from "@/lib/catalog";

/** The item's price with a pencil to change it for this order only (e.g. +20 € for a car). */
export default function PriceEdit({ id, item, price, qty }: { id: string; item: number; price: number; qty: number }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(price));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: { item, value } }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setError("Не се записа");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold transition hover:bg-paper"
        aria-label="Промени цената"
      >
        {money(price * qty)}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40 group-hover:text-ember-deep" aria-hidden>
          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center rounded-full border border-ink/15 bg-white pl-3 pr-2 focus-within:border-ember">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && save()}
          inputMode="decimal"
          autoFocus
          className="w-16 py-1.5 text-right font-semibold outline-none"
          aria-label={qty > 1 ? "Цена за брой" : "Цена"}
        />
        <span className="ml-1 text-ink/50">€</span>
      </label>
      <button type="button" onClick={save} disabled={busy} className="rounded-full bg-ember px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-60">
        {busy ? "…" : "Запази"}
      </button>
      <button type="button" onClick={() => { setEditing(false); setValue(String(price)); }} className="text-sm text-ink/50" aria-label="Отказ">
        ✕
      </button>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </div>
  );
}
