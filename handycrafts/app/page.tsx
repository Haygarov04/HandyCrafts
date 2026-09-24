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
    n: "01",
    title: "Фигурки по снимка",
    text: "Ти, половинката ти или цялото семейство — на рафта.",
    image: "/shop/figurine.webp",
    href: "/studio?product=figurine",
    product: "figurine" as const,
  },
  {
    n: "02",
    title: "Любимци",
    text: "Кучето или котката ти, с всяко петно на козината.",
    image: "/shop/pet.webp",
    href: "/studio?product=figurine&subject=pet",
    product: "figurine" as const,
  },
  {
    n: "03",
    title: "Ключодържатели",
    text: "Винаги с теб. Човек или любимец, в джоба.",
    image: "/shop/keychain.webp",
    href: "/studio?product=keychain",
    product: "keychain" as const,
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-36">
        <span className="pointer-events-none absolute -left-28 top-56 h-48 w-48 rounded-full bg-gradient-to-br from-[#ff9a7a] to-[#f06a4f] opacity-90 shadow-[0_30px_60px_rgba(240,106,79,0.35)] sm:-left-16 sm:h-72 sm:w-72" />
        <span className="pointer-events-none absolute -right-12 top-24 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,#6aa8ff,#1f5fe0_60%,#133d9e)] shadow-[0_25px_50px_rgba(31,95,224,0.35)] sm:right-10 sm:top-36 sm:h-40 sm:w-40" />
        <span className="pointer-events-none absolute bottom-40 right-[8%] hidden h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffe08a,#ffb800_65%)] shadow-[0_18px_36px_rgba(255,184,0,0.35)] lg:block" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
            3D фигурки
            <span className="block">по снимка.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink/75 sm:text-xl sm:leading-9">
            Персонализирани фигурки и ключодържатели по твоя снимка. Оригинален подарък за рожден
            ден, годишнина или любим човек.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/studio?product=figurine"
              className="rounded-2xl bg-ember px-8 py-4 text-center text-lg font-bold text-ink shadow-[0_14px_30px_rgba(255,122,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-ember-deep"
            >
              Създай фигурка
            </Link>
            <Link
              href="/#products"
              className="rounded-2xl bg-white px-8 py-4 text-center text-lg font-semibold shadow-[0_10px_30px_rgba(22,21,19,0.08)] transition hover:-translate-y-0.5"
            >
              Цени от {money(fromPrice("keychain"))}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2.2rem] bg-sand shadow-[0_40px_90px_rgba(22,21,19,0.18)] sm:aspect-[16/9]">
            <Image
              src="/shop/hero-mobile.webp"
              alt="Фигурка на момиче с къдрава коса до снимката, по която е направена"
              fill
              priority
              className="object-cover sm:hidden"
              sizes="100vw"
            />
            <Image
              src="/shop/hero.webp"
              alt="Фигурка на момиче с къдрава коса до снимката, по която е направена"
              fill
              priority
              className="hidden object-cover sm:block"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(22,21,19,0.14)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Виждаш фигурката преди да поръчаш
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 sm:px-6">
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
          <h2 className="text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
            Твоят спомен.
            <span className="block">Твоята форма.</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70 sm:text-xl">Избери как да го запазиш.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((item) => (
              <Link
                key={item.n}
                href={item.href}
                className="lift-card group flex flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white"
              >
                <span className="relative block aspect-[4/3.4] overflow-hidden bg-sand">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">
                    от {money(fromPrice(item.product))}
                  </span>
                </span>
                <span className="flex flex-1 items-start gap-4 p-6">
                  <span className="pt-1 font-display text-lg text-ink/80">{item.n}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl sm:text-2xl">{item.title}</span>
                    <span className="mt-2 block leading-7 text-ink/65">{item.text}</span>
                    <span className="mt-4 flex flex-wrap gap-1.5">
                      {catalog[item.product].sizes.map((size) => (
                        <span key={size.cm} className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink/70">
                          {size.cm} см · {money(size.price)}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="grid h-12 w-12 shrink-0 place-items-center self-end rounded-full bg-ink text-paper shadow-[0_8px_20px_rgba(22,21,19,0.25)] transition group-hover:bg-ember group-hover:text-ink">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            ))}
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

      <section id="faq" className="scroll-mt-28 px-4 pb-24 sm:px-6">
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
