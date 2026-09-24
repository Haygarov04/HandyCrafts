"use client";

import { useState } from "react";
import { faqItems } from "@/lib/faq";

type Item = { q: string; a: string };

export default function FaqList({ items = faqItems }: { items?: readonly Item[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span className="font-display text-lg leading-snug sm:text-xl">
                {item.q}
              </span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-lg text-ember-deep" aria-hidden>
                {expanded ? "–" : "+"}
              </span>
            </button>
            {expanded ? (
              <p className="max-w-2xl pb-5 leading-7 text-ink/70">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
