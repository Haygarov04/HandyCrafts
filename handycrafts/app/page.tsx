import Image from "next/image";
import Link from "next/link";
import FaqList from "./components/FaqList";
import { catalog, fromPrice, money, productionDays } from "@/lib/catalog";

const perks = [
  { icon: "◎", title: "Виждаш я веднага", text: "Визуализация за около минута" },
  { icon: "€", title: "Наложен платеж", text: "Плащаш, когато я получиш" },
  { icon: "✦", title: "Ръчно довършена", text: "Всяка фигурка минава през ръце" },
  { icon: "➜", title: "Еконт и Спиди", text: `Изпращаме за ${productionDays}` },
];

const steps = [
  {
    n: "1",
    title: "Качи снимка",
    text: "Една ясна снимка, лицето отпред. Опиши дрехите и позата, ако искаш промени.",
    image: "/shop/step-1.webp",
    tone: "bg-blush",
  },
  {
    n: "2",
    title: "Виж фигурката си",
    text: "За около минута получаваш визуализация. Не харесваш нещо? Промени и опитай пак.",
    image: "/shop/step-2.webp",
    tone: "bg-sky",
  },
  {
    n: "3",
    title: "Поръчай и чакай куриера",
    text: "Добавяш в количката, ние потвърждаваме по телефона и изпращаме. Плащаш при получаване.",
    image: "/shop/step-3.webp",
    tone: "bg-sage",
  },
];

const occasions = ["Рожден ден", "Годишнина", "Сватба", "Свети Валентин", "Коледа", "Абитуриент", "За колега", "За баба и дядо"];

const gallery = [1, 2, 3, 4, 5, 6].map((n) => `/shop/gallery-${n}.webp`);

const products = [
  {
    id: "figurine" as const,
    image: "/shop/figurine.webp",
    tone: "bg-blush",
    badge: "Най-поръчвана",
  },
  {
    id: "keychain" as const,
    image: "/shop/keychain.webp",
    tone: "bg-sky",
    badge: "Малък подарък",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-14 pt-32 sm:px-6 sm:pt-36">
        <div className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-blush/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-sky/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-ember" /> Фигурки по снимка · Русе
            </span>
            <h1 className="mt-6 text-[2.5rem] leading-[1.05] sm:text-6xl">
              Твоята мини версия.
              <span className="block text-ember-deep">От една снимка.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-ink/70">
              Качваш снимка и след минута виждаш как ще изглежда фигурката. Харесваш я —
              добавяш в количката и плащаш с наложен платеж, когато пристигне.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio?product=figurine"
                className="rounded-full bg-ink px-7 py-4 text-center font-semibold text-paper shadow-[0_12px_30px_rgba(22,21,19,0.25)] transition hover:bg-ember hover:text-ink"
              >
                Създай фигурка — от {money(fromPrice("figurine"))}
              </Link>
              <Link
                href="/studio?product=keychain"
                className="rounded-full border border-ink/15 bg-white px-7 py-4 text-center font-semibold transition hover:border-ink/40"
              >
                Ключодържател — от {money(fromPrice("keychain"))}
              </Link>
            </div>
            <p className="mt-5 text-sm text-ink/55">
              Визуализацията е безплатна. Поръчваш само ако ти хареса.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sand shadow-[0_40px_90px_rgba(22,21,19,0.18)]">
              <Image
                src="/shop/hero.webp"
                alt="Фигурка на двойка, изработена по снимка"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 90vw"
              />
            </div>
            <div className="absolute -left-4 top-8 rounded-3xl bg-white px-5 py-4 shadow-[0_20px_40px_rgba(22,21,19,0.12)] sm:-left-8">
              <p className="text-xs text-ink/50">Фигурка 10 см</p>
              <p className="font-display text-2xl">{money(catalog.figurine.sizes[0].price)}</p>
            </div>
            <div className="absolute -right-2 bottom-8 max-w-[13rem] rounded-3xl bg-ink px-5 py-4 text-paper shadow-[0_20px_40px_rgba(22,21,19,0.2)] sm:-right-6">
              <p className="text-xs uppercase tracking-[0.18em] text-ember">Преди поръчка</p>
              <p className="mt-1 text-sm leading-6">Виждаш визуализацията и решаваш.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 rounded-[2rem] bg-white p-4 sm:p-6 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3 rounded-2xl p-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-lg text-ember-deep">
                {perk.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold">{perk.title}</span>
                <span className="block text-xs text-ink/55">{perk.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">Избери формата</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">Фигурка или ключодържател</h2>
            <p className="mt-4 text-ink/65">Една снимка, два начина да я запазиш. Цената е крайна за изработката.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {products.map((product) => {
              const item = catalog[product.id];
              return (
                <article key={product.id} className="lift-card group overflow-hidden rounded-[2rem] bg-white">
                  <Link href={`/studio?product=${product.id}`} className={`relative block aspect-[5/4] overflow-hidden ${product.tone}`}>
                    <Image
                      src={product.image}
                      alt={item.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 768px) 45vw, 100vw"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">
                      {product.badge}
                    </span>
                  </Link>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl sm:text-3xl">{item.label}</h3>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-ink/60">{item.line}</p>
                      </div>
                      <p className="shrink-0 text-right text-sm text-ink/50">
                        от<span className="block font-display text-2xl text-ink">{money(fromPrice(product.id))}</span>
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.sizes.map((size) => (
                        <Link
                          key={size.cm}
                          href={`/studio?product=${product.id}&cm=${size.cm}`}
                          className="rounded-2xl border border-ink/10 px-4 py-3 text-center transition hover:border-ember hover:bg-ember/5"
                        >
                          <span className="block text-sm font-semibold">{size.cm} см</span>
                          <span className="block text-xs text-ink/55">{money(size.price)}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/studio?product=${product.id}`}
                      className="mt-6 block rounded-full bg-ember py-3.5 text-center font-semibold text-ink transition hover:bg-ember-deep"
                    >
                      Качи снимка
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[2rem] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Колко голяма е?</p>
              <p className="flex gap-4 text-xs text-ink/55">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ink/70" /> ключодържател</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ember" /> фигурка</span>
              </p>
            </div>
            <div className="mt-6 flex items-end justify-around gap-2 border-b border-ink/15 sm:gap-4">
              {[...catalog.keychain.sizes.map((s) => ({ ...s, kind: "ключодържател" })), ...catalog.figurine.sizes.map((s) => ({ ...s, kind: "фигурка" }))].map((size) => (
                <div key={`${size.kind}-${size.cm}`} className="flex flex-col items-center">
                  <span className="mb-2 text-xs text-ink/50">{money(size.price)}</span>
                  <span
                    className={`block w-8 rounded-t-full sm:w-12 ${size.kind === "фигурка" ? "bg-ember" : "bg-ink/70"}`}
                    style={{ height: `${size.cm * 7}px` }}
                  />
                  <span className="mt-2 pb-2 text-sm font-semibold">{size.cm} см</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-28 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">Как работи</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">Три стъпки до твоята фигурка</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="overflow-hidden rounded-[2rem] bg-paper">
                <div className={`relative aspect-[4/3] ${step.tone}`}>
                  <Image src={step.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
                  <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white font-display text-lg">
                    {step.n}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/studio"
              className="inline-block rounded-full bg-ink px-8 py-4 font-semibold text-paper transition hover:bg-ember hover:text-ink"
            >
              Започни със снимка
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl leading-tight sm:text-5xl">От нашата работилница</h2>
            <Link href="/portfolio" className="text-sm font-semibold underline decoration-ember decoration-2 underline-offset-4">
              Виж още
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {gallery.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-sand">
                <Image src={src} alt="Изработена фигурка" fill className="object-cover transition duration-700 hover:scale-[1.04]" sizes="(min-width: 768px) 33vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-ink px-6 py-12 text-paper sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember">Подарък, който не се забравя</p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">За всеки повод, в който искаш да изненадаш някого.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {occasions.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-4 py-2 text-sm text-paper/85">
                {item}
              </span>
            ))}
          </div>
          <Link
            href="/studio"
            className="mt-10 inline-block rounded-full bg-ember px-8 py-4 font-semibold text-ink transition hover:bg-paper"
          >
            Направи подаръка
          </Link>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">Въпроси</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">Често питат</h2>
            <p className="mt-4 max-w-sm text-ink/60">
              Друго? Пиши ни на{" "}
              <a href="mailto:handycraftshelp@gmail.com" className="font-semibold underline decoration-ember underline-offset-4">
                handycraftshelp@gmail.com
              </a>
            </p>
          </div>
          <FaqList />
        </div>
      </section>
    </>
  );
}
