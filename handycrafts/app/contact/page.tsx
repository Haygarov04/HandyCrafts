"use client";

import { useState } from "react";

const field = "w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-ember";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: event.target.value });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Грешка при изпращане.");
      setSuccess("Съобщението е изпратено. Ще ти отговорим скоро.");
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Нещо се обърка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">Контакти</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Пиши ни</h1>
          <p className="mt-5 leading-7 text-ink/65">
            Въпрос за поръчка, фигурка на няколко души или по-голям размер? Пиши ни и ще отговорим
            в рамките на работния ден.
          </p>
          <div className="mt-8 space-y-3 rounded-[2rem] bg-white p-6 text-sm">
            <p>
              <span className="text-ink/50">Имейл: </span>
              <a href="mailto:handycraftshelp@gmail.com" className="font-semibold">
                handycraftshelp@gmail.com
              </a>
            </p>
            <p>
              <span className="text-ink/50">Работилница: </span>Русе, България
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-3 rounded-[2rem] bg-white p-6 sm:grid-cols-2 sm:p-8">
          <input required value={form.name} onChange={set("name")} placeholder="Име" autoComplete="name" className={field} />
          <input required type="email" value={form.email} onChange={set("email")} placeholder="Имейл" autoComplete="email" className={field} />
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="Телефон (по желание)" autoComplete="tel" className={`${field} sm:col-span-2`} />
          <textarea required value={form.message} onChange={set("message")} placeholder="Съобщение" maxLength={3000} className={`${field} min-h-44 sm:col-span-2`} />
          <input tabIndex={-1} aria-hidden autoComplete="off" value={form.website} onChange={set("website")} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:col-span-2">{success}</p> : null}
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-ink py-4 font-semibold text-paper transition hover:bg-ember hover:text-ink disabled:opacity-60 sm:col-span-2"
          >
            {loading ? "Изпращане…" : "Изпрати"}
          </button>
        </form>
      </div>
    </div>
  );
}
