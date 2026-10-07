"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReviewStatus } from "@/lib/reviews";

export default function ReviewControls({ id, status }: { id: string; status: ReviewStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function send(method: "PATCH" | "DELETE", body?: object) {
    setBusy(true);
    await fetch(`/api/manage/reviews/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).catch(() => undefined);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status !== "approved" ? (
        <button type="button" disabled={busy} onClick={() => send("PATCH", { status: "approved" })} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper disabled:opacity-50">
          Публикувай на сайта
        </button>
      ) : null}
      {status !== "hidden" ? (
        <button type="button" disabled={busy} onClick={() => send("PATCH", { status: "hidden" })} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
          {status === "approved" ? "Махни от сайта" : "Скрий"}
        </button>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (confirm("Да изтрия ли отзива завинаги?")) send("DELETE");
        }}
        className="rounded-full px-3 py-2.5 text-sm text-red-700 disabled:opacity-50"
      >
        Изтрий
      </button>
    </div>
  );
}
