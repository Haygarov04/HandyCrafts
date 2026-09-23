"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrmLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Входът не мина.");
      return;
    }
    router.push("/crm");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-deep">Поръчки</p>
      <h1 className="mt-3 text-5xl">Вход</h1>
      <p className="mt-3 text-sm leading-6 text-ink/60">
        Списъкът с поръчки е само за работилницата. Паролата е CRM_PASSWORD.
      </p>
      <form onSubmit={submit} className="mt-8 grid gap-3">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Парола"
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-ember"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="rounded-full bg-ink px-5 py-3 font-semibold text-paper">
          Отвори
        </button>
      </form>
    </div>
  );
}
