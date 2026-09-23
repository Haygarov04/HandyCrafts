"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderStatuses, statusLabel, type OrderStatus } from "@/lib/order-types";

export default function StatusForm({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [note, setNote] = useState("");

  async function change(next: OrderStatus) {
    setValue(next);
    setNote("Записва се…");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setNote(res.ok ? "Записано" : "Не се записа");
    if (res.ok) router.refresh();
  }

  return (
    <label className="block text-sm">
      <span className="text-ink/50">Статус</span>
      <select
        value={value}
        onChange={(event) => change(event.target.value as OrderStatus)}
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3"
      >
        {orderStatuses.map((item) => (
          <option key={item} value={item}>
            {statusLabel[item]}
          </option>
        ))}
      </select>
      {note ? <span className="mt-2 block text-xs text-ink/50">{note}</span> : null}
    </label>
  );
}
