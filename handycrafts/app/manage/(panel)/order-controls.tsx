"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderStatuses, statusLabel, type OrderStatus } from "@/lib/order-types";

export default function OrderControls({
  id,
  status,
  internalNote,
}: {
  id: string;
  status: OrderStatus;
  internalNote: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [note, setNote] = useState(internalNote);
  const [state, setState] = useState("");

  async function save(change: { status?: OrderStatus; internalNote?: string }) {
    setState("Записва се…");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change),
    });
    setState(res.ok ? "Записано ✓" : "Не се записа");
    if (res.ok) router.refresh();
  }

  return (
    <section className="rounded-3xl bg-white p-5">
      <p className="text-sm font-semibold">Статус</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {orderStatuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCurrent(item);
              save({ status: item });
            }}
            className={`rounded-full px-4 py-2 text-sm ${current === item ? "bg-ink text-paper" : "bg-paper hover:bg-sand"}`}
          >
            {statusLabel[item]}
          </button>
        ))}
      </div>
      <label className="mt-5 block text-sm font-semibold">
        Вътрешна бележка
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => note !== internalNote && save({ internalNote: note })}
          placeholder="Само за работилницата — напр. товарителница, уговорки"
          className="mt-2 min-h-20 w-full rounded-2xl border border-ink/10 px-4 py-3 font-normal outline-none focus:border-ember"
        />
      </label>
      {state ? <p className="mt-2 text-xs text-ink/50">{state}</p> : null}
    </section>
  );
}
