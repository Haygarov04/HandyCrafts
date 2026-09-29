import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { cityName } from "@/lib/cities";
import { localize, type Lang } from "@/lib/i18n";
import { landingLinks } from "@/lib/landing-links";
import { absolute } from "@/lib/site";
import { citySlugs } from "@/lib/topic-slugs";
import { topicCards } from "@/lib/topics";

export default function Ideas({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const cards = topicCards(lang);
  const href = (path: string) => localize(lang, path);
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: card.title,
      url: absolute(href(`/idei/${card.slug}`)),
    })),
  };

  return (
    <div className="px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
      <JsonLd data={list} />
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">{en ? "Ideas" : "Идеи"}</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
          {en ? "Figurine and gift ideas for every occasion" : "Идеи за фигурки и подаръци за всеки повод"}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
          {en
            ? "Weddings, birthdays, pets, grandparents, colleagues — every figurine is made from your photo and finished by hand."
            : "Сватби, рождени дни, любимци, баба и дядо, колеги — всяка фигурка е направена по твоя снимка и довършена на ръка."}
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.slug} href={href(`/idei/${card.slug}`)} className="lift-card group flex gap-4 rounded-[1.8rem] bg-white p-4">
              <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                <Image src={card.image} alt="" fill className="object-cover" sizes="80px" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg leading-tight">{card.title}</span>
                <span className="mt-1.5 line-clamp-3 block text-sm leading-6 text-ink/60">{card.lead}</span>
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-[2rem] bg-white p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">{en ? "Main products" : "Основни продукти"}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {landingLinks.map((page) => (
              <Link key={page.path} href={href(page.path)} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold hover:bg-sand">
                {page.label[lang]}
              </Link>
            ))}
          </div>
        </section>

        {!en ? (
          <section className="mt-6 rounded-[2rem] bg-[#fde7c7] p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl">Доставка в цяла България</h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink/70">
              Изпращаме с Еконт и Спиди до офис или адрес във всеки град — София, Пловдив, Варна, Бургас, Русе, Стара Загора,
              Плевен, Велико Търново, Сливен, Шумен, Добрич, Хасково, Пазарджик, Благоевград, Ямбол, Перник, Габрово, Враца,
              Видин, Монтана, Ловеч, Кюстендил, Кърджали, Смолян, Силистра, Търговище, Разград и навсякъде другаде.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {citySlugs.map((slug) => (
                <Link key={slug} href={`/figurka-po-snimka/${slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold hover:bg-paper">
                  {cityName(slug)}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
