"use client";

import Image from "next/image";
import { useState } from "react";

export default function ManageLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/manage/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Входът не мина.");
      setBusy(false);
      return;
    }
    window.location.replace("/manage");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <Image src="/logo-remove.png" alt="HandyCrafts" width={72} height={72} className="mx-auto h-18 w-18" />
      <h1 className="mt-6 text-center text-3xl">Поръчки</h1>
      <form onSubmit={submit} className="mt-8 grid gap-3">
        <input
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Парола"
          className="rounded-2xl border border-ink/10 bg-white px-4 py-3.5 outline-none focus:border-ember"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={busy || !password} className="rounded-full bg-ink px-5 py-3.5 font-semibold text-paper disabled:opacity-50">
          Влез
        </button>
      </form>
    </div>
  );
}
