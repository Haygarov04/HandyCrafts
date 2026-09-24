"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { statusLabel, type OrderStatus } from "@/lib/order-types";

export default function AdvanceButton({ id, to }: { id: string; to: OrderStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function advance() {
    setBusy(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={advance}
      disabled={busy}
      className="mt-3 w-full rounded-full bg-ink py-2 text-xs font-semibold text-paper transition hover:bg-ember hover:text-ink disabled:opacity-50"
    >
      {busy ? "…" : `→ ${statusLabel[to]}`}
    </button>
  );
}
