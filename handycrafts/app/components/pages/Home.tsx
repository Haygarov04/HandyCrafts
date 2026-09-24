import Image from "next/image";
import Link from "next/link";
import FaqList from "../FaqList";
import JsonLd from "../JsonLd";
import { catalog, fromPrice } from "@/lib/catalog";
import { dict, localize, type Lang } from "@/lib/i18n";
import { faqJsonLd, productJsonLd } from "@/lib/site";

const productCards = [
  { image: "/shop/figurine.webp", position: "50% 50%", href: "/studio?product=figurine", product: "figurine" as const },
  { image: "/shop/pet.webp", position: "40% 50%", href: "/studio?product=figurine&subject=pet", product: "figurine" as const },
  { image: "/shop/keychain.webp", position: "50% 50%", href: "/studio?product=keychain", product: "keychain" as const },
];

export default function Home({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const h = t.home;
  const href = (path: string) => localize(lang, path);
  const products = productCards.map((card, index) => ({ ...card, ...h.products[index], n: `0${index + 1}` }));
  const steps = h.steps.map((step, index) => ({ ...step, n: `0${index + 1}` }));
  return (
    <>
      <JsonLd data={faqJsonLd(t.faq)} />
      <JsonLd
        data={productJsonLd({
          product: "figurine",
          name: h.productFigurineName,
          description: h.productFigurineText,
          image: "/shop/figurine.webp",
          url: href("/figurka-po-snimka"),
        })}
      />
      <JsonLd
        data={productJsonLd({
          product: "keychain",
          name: h.productKeychainName,
          description: h.productKeychainText,
          image: "/shop/keychain.webp",
          url: href("/klyuchodarzhatel-po-snimka"),
        })}
      />
      <section className="relative overflow-hidden px-4 pb-12 pt-[6.5rem] sm:px-6 sm:pt-36">
        <span className="pointer-events-none absolute -left-24 top-36 h-40 w-40 rounded-full bg-gradient-to-br from-[#ff9a7a] to-[#f06a4f] opacity-90 shadow-[0_30px_60px_rgba(240,106,79,0.35)] sm:-left-16 sm:h-72 sm:w-72" />
        <span className="pointer-events-none absolute -right-10 top-24 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,#6aa8ff,#1f5fe0_60%,#133d9e)] shadow-[0_25px_50px_rgba(31,95,224,0.35)] sm:right-10 sm:top-36 sm:h-40 sm:w-40" />
        <span className="pointer-events-none absolute bottom-40 right-[8%] hidden h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffe08a,#ffb800_65%)] shadow-[0_18px_36px_rgba(255,184,0,0.35)] lg:block" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
            {h.heroTitle[0]}
            <span className="block">{h.heroTitle[1]}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-ink/75 sm:mt-6 sm:text-xl sm:leading-9">
            {h.heroText}
          </p>
          <div className="mt-6 flex justify-center gap-2.5 sm:mt-8 sm:gap-3">
            <Link
              href={href("/studio?product=figurine")}
              className="rounded-2xl bg-ember px-5 py-3.5 text-center text-base font-bold sm:px-8 sm:py-4 sm:text-lg text-ink shadow-[0_14px_30px_rgba(255,122,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-ember-deep"
            >
              {h.create}
            </Link>
            <Link
              href={href("/#products")}
              className="rounded-2xl bg-white px-5 py-3.5 text-center text-base font-semibold sm:px-8 sm:py-4 sm:text-lg shadow-[0_10px_30px_rgba(22,21,19,0.08)] transition hover:-translate-y-0.5"
            >
              {h.pricesFrom} {t.money(fromPrice("keychain"))}
            </Link>
          </div>
        </div>

        <div className="relative -mx-4 mt-7 max-w-5xl sm:mx-auto sm:mt-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-sand sm:rounded-[2.2rem] shadow-[0_40px_90px_rgba(22,21,19,0.18)] sm:aspect-[16/9]">
            <Image
              src="/shop/hero-mobile.webp"
              alt={h.heroAlt}
              fill
              priority
              className="object-cover sm:hidden"
              sizes="100vw"
            />
            <Image
              src="/shop/hero.webp"
              alt={h.heroAlt}
              fill
              priority
              className="hidden object-cover sm:block"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(22,21,19,0.14)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {h.heroBadge}
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 rounded-[2rem] bg-white p-4 sm:p-6 lg:grid-cols-4">
          {h.perks.map((perk) => (
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
            {h.productsTitle[0]}
            <span className="block">{h.productsTitle[1]}</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70 sm:text-xl">{h.productsText}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((item) => (
              <Link
                key={item.n}
                href={href(item.href)}
                className="lift-card group flex flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white"
              >
                <span className="relative block aspect-[9/16] overflow-hidden bg-sand">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectPosition: item.position }}
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">
                    {t.from} {t.money(fromPrice(item.product))}
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
                          {size.cm} {t.cm} · {t.money(size.price)}
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
              <p className="text-sm font-semibold">{h.sizeTitle}</p>
              <p className="flex gap-4 text-xs text-ink/55">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ink/70" /> {h.sizeKeychain}</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ember" /> {h.sizeFigurine}</span>
              </p>
            </div>
            <div className="mt-6 flex items-end justify-around gap-2 border-b border-ink/15 sm:gap-4">
              {[...catalog.keychain.sizes.map((s) => ({ ...s, kind: "keychain" })), ...catalog.figurine.sizes.map((s) => ({ ...s, kind: "figurine" }))].map((size) => (
                <div key={`${size.kind}-${size.cm}`} className="flex flex-col items-center">
                  <span className="mb-2 text-xs text-ink/50">{t.money(size.price)}</span>
                  <span
                    className={`block w-8 rounded-t-full sm:w-12 ${size.kind === "figurine" ? "bg-ember" : "bg-ink/70"}`}
                    style={{ height: `${size.cm * 7}px` }}
                  />
                  <span className="mt-2 pb-2 text-sm font-semibold">{size.cm} {t.cm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-28 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              {h.howTitle[0]}
              <span className="block">{h.howTitle[1]}</span>
            </h2>
            <div className="relative mt-8 aspect-[9/16] overflow-hidden rounded-[2rem] bg-sand shadow-[0_30px_70px_rgba(22,21,19,0.12)] sm:aspect-[16/9]">
              <Image
                src="/shop/process-mobile.webp"
                alt={h.processAlt}
                fill
                className="object-cover sm:hidden"
                sizes="100vw"
              />
              <Image
                src="/shop/process.webp"
                alt={h.processAlt}
                fill
                className="hidden object-cover sm:block"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
          </div>

          <div>
            <ol className="divide-y divide-ink/10">
              {steps.map((step) => (
                <li key={step.n} className="flex items-center gap-5 py-6 first:pt-0">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-ember font-display text-xl text-ember-deep sm:h-[4.5rem] sm:w-[4.5rem] sm:text-2xl">
                    {step.n}
                  </span>
                  <span>
                    <span className="block font-display text-xl sm:text-2xl">{step.title}</span>
                    <span className="mt-1 block leading-7 text-ink/65">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center gap-5 rounded-[1.8rem] border border-ink/10 bg-paper p-5 sm:p-6">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white shadow-sm">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="#ff7a00" />
                  <circle cx="12" cy="10" r="2.6" fill="#fff" />
                </svg>
              </span>
              <span>
                <span className="block font-display text-lg sm:text-xl">{h.madeTitle}</span>
                <span className="mt-1 block text-sm leading-6 text-ink/65">
                  {h.madeText}
                </span>
              </span>
            </div>

            <Link
              href={href("/studio")}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-ember px-7 py-4 text-lg font-bold text-ink shadow-[0_14px_30px_rgba(255,122,0,0.3),inset_0_-3px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-ember-deep"
            >
              {h.startWithPhoto}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mb-20 overflow-hidden bg-[#fde7c7] px-4 py-16 sm:px-6 sm:py-24">
        <svg className="absolute inset-x-0 top-0 h-8 w-full text-paper sm:h-12" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0h1440v28c-240 26-480 32-720 16S240 10 0 30V0Z" fill="currentColor" />
        </svg>
        <svg className="absolute inset-x-0 bottom-0 h-8 w-full rotate-180 text-paper sm:h-12" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0h1440v28c-240 26-480 32-720 16S240 10 0 30V0Z" fill="currentColor" />
        </svg>
        <span className="pointer-events-none absolute -bottom-10 right-[6%] h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,#6aa8ff,#1f5fe0_60%,#133d9e)] shadow-[0_25px_50px_rgba(31,95,224,0.35)] sm:h-36 sm:w-36" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="-rotate-2 font-display text-lg italic text-ember-deep sm:text-xl">
              {h.giftKicker}
            </p>
            <h2 className="mt-4 text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              {h.giftTitle[0]}
              <span className="block">{h.giftTitle[1]}</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {h.occasions.map((item) => (
                <span key={item} className="rounded-full bg-white/70 px-3.5 py-1.5 text-sm">
                  {item}
                </span>
              ))}
            </div>
            <Link
              href={href("/studio")}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-ink px-7 py-4 text-lg font-bold text-paper transition hover:-translate-y-0.5 hover:bg-ember hover:text-ink"
            >
              {h.giftButton}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="relative mx-auto w-56 rotate-3 sm:w-72">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(22,21,19,0.2)] ring-8 ring-white">
              <Image src="/shop/keychain.webp" alt={h.keychainAlt} fill className="object-cover" sizes="300px" />
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember-deep">{h.faqKicker}</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">{h.faqTitle}</h2>
            <p className="mt-4 max-w-sm text-ink/60">
              {h.faqMore}{" "}
              <a href="mailto:handycraftshelp@gmail.com" className="font-semibold underline decoration-ember underline-offset-4">
                handycraftshelp@gmail.com
              </a>
            </p>
          </div>
          <FaqList items={t.faq} />
        </div>
      </section>
    </>
  );
}
