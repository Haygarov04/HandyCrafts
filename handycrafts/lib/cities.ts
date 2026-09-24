import type { LandingContent } from "@/app/components/Landing";
import { citySlugs } from "@/lib/topic-slugs";

// Name forms for natural Bulgarian: "в София", "до София", "софиянци" isn't needed.
const cities: Record<(typeof citySlugs)[number], { name: string; days: string }> = {
  sofia: { name: "София", days: "1 работен ден" },
  plovdiv: { name: "Пловдив", days: "1 работен ден" },
  varna: { name: "Варна", days: "1 работен ден" },
  burgas: { name: "Бургас", days: "1–2 работни дни" },
  ruse: { name: "Русе", days: "1 работен ден" },
  "stara-zagora": { name: "Стара Загора", days: "1 работен ден" },
  pleven: { name: "Плевен", days: "1 работен ден" },
  "veliko-tarnovo": { name: "Велико Търново", days: "1 работен ден" },
};

/** "в София", but "във Варна" / "във Велико Търново". */
function inCity(name: string) {
  return /^[ВвФф]/.test(name) ? `във ${name}` : `в ${name}`;
}

export function cityName(slug: string) {
  return cities[slug as keyof typeof cities]?.name || "";
}

export function cityContent(slug: string): LandingContent | null {
  const city = cities[slug as keyof typeof cities];
  if (!city) return null;
  const n = city.name;
  const local = slug === "ruse";
  const where = inCity(n);
  return {
    metaTitle: `Фигурка по снимка ${where} — доставка с наложен платеж`,
    path: `/figurka-po-snimka/${slug}`,
    crumb: `Фигурка по снимка — ${n}`,
    kicker: local ? "Работилницата ни е тук" : `Доставка до ${n}`,
    title: `Фигурка по снимка ${where}`,
    lead: `Персонализирана 3D фигурка или ключодържател по снимка, с доставка до офис на Еконт, Спиди или до адрес ${where}. Виждаш визуализацията веднага, плащаш при получаване.`,
    cta: { label: "Създай фигурка", href: "/studio?product=figurine" },
    image: { src: "/shop/hero-mobile.webp", alt: `Фигурка по снимка с доставка до ${n}`, ratio: "aspect-[9/16] max-h-[36rem]" },
    product: "figurine",
    productName: `Фигурка по снимка — ${n}`,
    sections: [
      {
        title: `Доставка до ${n}`,
        text: [
          local
            ? "Изработваме фигурките в Русе, затова пратките за града пристигат най-бързо."
            : `Изпращаме от Русе с Еконт или Спиди. Доставката до ${n} обикновено отнема ${city.days} след изработката.`,
          "Изработката е 7–12 работни дни от потвърждението по телефона. Доставката се плаща по тарифата на куриера, а поръчката — с наложен платеж при получаване.",
        ],
      },
      {
        title: "Какво можеш да поръчаш",
        text: [
          "Фигурка на човек (10, 15 или 20 см), фигурка на куче или котка, или ключодържател (5 или 6 см). Цените са от 30 € до 100 €.",
          "Качваш снимка, описваш дрехите и позата и за около минута виждаш как ще изглежда. Поръчваш само ако ти харесва.",
        ],
      },
    ],
    faq: [
      { q: `Колко време е доставката до ${n}?`, a: `Обикновено ${city.days} с куриер, след 7–12 работни дни изработка.` },
      { q: "Мога ли да платя при получаване?", a: "Да, плащането е с наложен платеж на куриера." },
      { q: "Колко струва фигурка по снимка?", a: "Фигурка 10 см е 50 €, 15 см е 80 €, 20 см е 100 €. Ключодържател 5 см е 30 €, 6 см е 40 €." },
    ],
  };
}
