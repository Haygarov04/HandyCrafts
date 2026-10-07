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
  sliven: { name: "Сливен", days: "1–2 работни дни" },
  dobrich: { name: "Добрич", days: "1 работен ден" },
  shumen: { name: "Шумен", days: "1 работен ден" },
  pernik: { name: "Перник", days: "1–2 работни дни" },
  haskovo: { name: "Хасково", days: "1–2 работни дни" },
  yambol: { name: "Ямбол", days: "1–2 работни дни" },
  pazardzhik: { name: "Пазарджик", days: "1–2 работни дни" },
  blagoevgrad: { name: "Благоевград", days: "1–2 работни дни" },
  vratsa: { name: "Враца", days: "1–2 работни дни" },
  gabrovo: { name: "Габрово", days: "1 работен ден" },
  asenovgrad: { name: "Асеновград", days: "1–2 работни дни" },
  vidin: { name: "Видин", days: "1–2 работни дни" },
  kazanlak: { name: "Казанлък", days: "1–2 работни дни" },
  kardzhali: { name: "Кърджали", days: "1–2 работни дни" },
  kyustendil: { name: "Кюстендил", days: "1–2 работни дни" },
  montana: { name: "Монтана", days: "1–2 работни дни" },
  dimitrovgrad: { name: "Димитровград", days: "1–2 работни дни" },
  lovech: { name: "Ловеч", days: "1 работен ден" },
  silistra: { name: "Силистра", days: "1 работен ден" },
  targovishte: { name: "Търговище", days: "1 работен ден" },
  razgrad: { name: "Разград", days: "1 работен ден" },
  smolyan: { name: "Смолян", days: "1–2 работни дни" },
  dupnitsa: { name: "Дупница", days: "1–2 работни дни" },
  svishtov: { name: "Свищов", days: "1 работен ден" },
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
    metaTitle: local ? "Фигурки по снимка в Русе — ръчна изработка" : `Фигурки по снимка ${where} — от 40 €`,
    path: `/figurka-po-snimka/${slug}`,
    crumb: `Фигурка по снимка — ${n}`,
    kicker: local ? "Работилницата ни е тук" : `Доставка до ${n}`,
    title: local ? "Фигурки по снимка в Русе" : `Фигурка по снимка ${where}`,
    lead: `Персонализирана 3D фигурка по снимка, с доставка до офис на Еконт, Спиди или до адрес ${where}. Виждаш визуализацията веднага, плащаш при получаване.`,
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
          "Фигурка на човек, на двама или трима души, или на куче или котка — 14, 17 или 20 см, от 40 € до 110 €. За любимци има и ключодържател — 6 или 10 см, от 30 €.",
          "Качваш снимка, описваш дрехите и позата и за около минута виждаш как ще изглежда. Поръчваш само ако ти харесва.",
        ],
      },
    ],
    faq: [
      { q: `Колко време е доставката до ${n}?`, a: `Обикновено ${city.days} с куриер, след 7–12 работни дни изработка.` },
      { q: "Мога ли да платя при получаване?", a: "Да, плащането е с наложен платеж на куриера." },
      { q: "Колко струва фигурка по снимка?", a: "Фигурка 14 см е 40 €, 17 см е 60 €, 20 см е 80 €. За двама души: 60 € / 80 € / 100 €, за трима: 70 € / 90 € / 110 €." },
    ],
  };
}
