"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Грешка при изпращане.");
      }

      setSuccess("Запитването беше изпратено успешно.");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нещо се обърка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-36">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Контакти
          </p>

          <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            Свържете се с нас
          </h1>

          <p className="mb-8 text-lg leading-8 text-neutral-700">
            Ако имате идея, файл, въпрос или нужда от консултация, изпратете
            запитване и ще се свържем с вас.
          </p>

          <div className="space-y-4 rounded-[28px] bg-neutral-50 p-8">
            <p><strong>Имейл:</strong> handycraftshelp@gmail.com</p>
            <p><strong>Локация:</strong> Русе, България</p>
            <p><strong>Услуги:</strong> 3D принтиране, 3D сканиране, 3D моделиране</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-neutral-50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">
            Изпрати съобщение
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={updateField}
              placeholder="Име"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="Имейл"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-orange-500"
              required
            />

            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={updateField}
              placeholder="Телефон"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-orange-500 md:col-span-2"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="Вашето съобщение"
              className="min-h-[180px] rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-orange-500 md:col-span-2"
              required
            />

            {success ? (
              <div className="rounded-2xl bg-green-50 px-4 py-3 text-green-700 md:col-span-2">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-red-700 md:col-span-2">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60 md:col-span-2"
            >
              {loading ? "Изпращане..." : "Изпрати запитване"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}