"use client";

import { useState } from "react";

const items = [
  {
    q: "Каква снимка работи най-добре?",
    a: "Ясна, осветена отпред, с цялото лице. Цял ръст помага за дрехите и позата. Един човек в кадъра е по-добър от групова снимка.",
  },
  {
    q: "Ще видя ли фигурката преди изработка?",
    a: "Да. Първо се прави визуализация. Печатът започва след като я одобриш и изпратиш запитването.",
  },
  {
    q: "Кога се появява визуализацията?",
    a: "Студиото вече води клиента през снимка, дрехи и преглед. Картинката тръгва, когато сложиш XAI_API_KEY в handycrafts/.env.local. Печатаемият 3D файл е отделна стъпка и не е това, което клиентът одобрява.",
  },
  {
    q: "Правите ли и технически детайли?",
    a: "Да. Освен фигурки печатаме прототипи, резервни части и custom модели, сканираме реални обекти и моделираме по идея или файл.",
  },
];

export default function FaqList() {
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
              <span className="font-display text-2xl leading-tight sm:text-[1.7rem]">
                {item.q}
              </span>
              <span className="text-ember" aria-hidden>
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
