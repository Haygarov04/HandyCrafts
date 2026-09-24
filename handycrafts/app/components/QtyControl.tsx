"use client";

import { maxQty } from "@/lib/catalog";
import { useLang } from "./lang";

export default function QtyControl({ value, onChange }: { value: number; onChange: (qty: number) => void }) {
  const { t } = useLang();
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-full text-lg disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t.qty.less}
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-full text-lg disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= maxQty}
        aria-label={t.qty.more}
      >
        +
      </button>
    </div>
  );
}
