"use client";

import { useState } from "react";

const items = [
  {
    q: "Каква снимка работи най-добре?",
    a: "Ясна снимка на дневна светлина, лицето гледа напред и се вижда цялото. За фигурка в цял ръст е добре да се виждат и краката. Без слънчеви очила и силни филтри.",
  },
  {
    q: "Ще видя ли фигурката, преди да поръчам?",
    a: "Да. След като качиш снимката, за около минута получаваш визуализация на фигурката. Ако не ти харесва, промени описанието и я направи отново. Поръчваш само когато си доволен.",
  },
  {
    q: "Колко струва и как се плаща?",
    a: "Фигурка 10 см е 50 €, 15 см е 80 €, 20 см е 100 €. Ключодържател 5 см е 30 €, 6 см е 40 €. Плащаш с наложен платеж при получаване. Доставката е по тарифа на Еконт или Спиди.",
  },
  {
    q: "За колко време става?",
    a: "Обикновено 7–12 работни дни от потвърждението по телефона до изпращането. Ако ти трябва за конкретна дата, напиши го в бележката към поръчката.",
  },
  {
    q: "Колко точно ще прилича готовата фигурка на визуализацията?",
    a: "Визуализацията показва стила, позата и дрехите. Готовата фигурка се моделира и довършва на ръка по нея и по оригиналната снимка, затова малки разлики в детайлите са нормални.",
  },
  {
    q: "Може ли няколко души в една фигурка?",
    a: "Засега студиото прави по един човек. За двойка или семейство направи отделни фигурки или ни пиши и ще ти дадем цена.",
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
