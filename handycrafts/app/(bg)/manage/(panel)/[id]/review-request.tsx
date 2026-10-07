"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Emails the customer the review link — only when the workshop presses it. */
export default function ReviewRequest({ id, sentAt }: { id: string; sentAt: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function send() {
    if (sentAt && !confirm("Вече е пратена молба за отзив. Да я пратя ли пак?")) return;
    setState("sending");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewRequest: true }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setState(res?.ok && data.emailed ? "sent" : "failed");
    router.refresh();
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper disabled:opacity-50"
      >
        {state === "sending" ? "Изпращане…" : state === "sent" ? "Изпратено ✓" : "Изпрати молба за отзив по имейл"}
      </button>
      {state === "failed" ? <p className="mt-2 text-sm text-red-700">Имейлът не мина. Опитай пак.</p> : null}
      {sentAt && state !== "sent" ? (
        <p className="mt-2 text-xs text-ink/50">
          Последно пратена: {new Date(sentAt).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" })}
        </p>
      ) : null}
    </div>
  );
}
