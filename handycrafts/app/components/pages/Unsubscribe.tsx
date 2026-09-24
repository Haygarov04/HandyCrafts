"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/app/components/lang";

export default function Unsubscribe({ email, token }: { email: string; token: string }) {
  const { lang, href } = useLang();
  const en = lang === "en";
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function confirm() {
    setState("busy");
    const res = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    setState(res.ok ? "done" : "error");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
      <h1 className="text-3xl sm:text-4xl">{state === "done" ? (en ? "Unsubscribed" : "Отписан си") : en ? "Unsubscribe" : "Отписване"}</h1>
      <p className="mt-4 text-ink/65">
        {state === "done"
          ? en
            ? "You won't get any more newsletters from us."
            : "Няма да получаваш повече бюлетини от нас."
          : en
            ? `Stop newsletters to ${email}?`
            : `Да спрем бюлетините до ${email}?`}
      </p>
      {state === "error" ? (
        <p className="mt-4 text-sm text-red-700">{en ? "This link is not valid." : "Връзката не е валидна."}</p>
      ) : null}
      {state === "done" ? (
        <Link href={href("/")} className="mt-8 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper">
          {en ? "Back to home" : "Към началото"}
        </Link>
      ) : (
        <button
          type="button"
          onClick={confirm}
          disabled={state === "busy" || !email}
          className="mt-8 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper disabled:opacity-50"
        >
          {en ? "Yes, unsubscribe" : "Да, отпиши ме"}
        </button>
      )}
    </div>
  );
}
