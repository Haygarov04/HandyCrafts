"use client";

import { useState } from "react";

/** The customer's private review link, to paste into Viber when they left no email. */
export default function ReviewLink({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const message = `Здравей${name ? `, ${name}` : ""}! Благодарим, че поръча от HandyCrafts 🙂 Ще ни напишеш ли няколко думи за фигурката? Отнема минута: ${url}`;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard
            .writeText(message)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => undefined);
        }}
        className="rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold"
      >
        {copied ? "Копирано ✓" : "Копирай съобщение с линка"}
      </button>
      <a
        href={`viber://forward?text=${encodeURIComponent(message)}`}
        className="rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold"
      >
        Прати във Viber
      </a>
    </div>
  );
}
