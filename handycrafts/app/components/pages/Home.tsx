import Image from "next/image";
import Link from "next/link";
import FaqList from "../FaqList";
import JsonLd from "../JsonLd";
import NewsletterBox from "../NewsletterBox";
import { catalog, fromPrice } from "@/lib/catalog";
import { dict, localize, type Lang } from "@/lib/i18n";
import { faqJsonLd, productJsonLd } from "@/lib/site";

const perkIcons = [
  // eye — see the preview
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  // banknote — cash on delivery
  <>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 9.5v5M18 9.5v5" />
  </>,
  // sparkle — finished by hand
  <>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16Z" />
  </>,
  // truck — courier
  <>
    <path d="M2.5 6.5h11v9h-11z" />
    <path d="M13.5 9.5h4l3 3.2v2.8h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </>,
];

const stepIcons = [
  // camera — upload a photo
  <>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
    <circle cx="12" cy="12.5" r="3.5" />
  </>,
  // check — approve the preview
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.7 2.7L16.5 9.5" />
  </>,
  // box — delivered by courier
  <>
    <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
  </>,
];

// Same order as the occasions in lib/i18n.ts.
const occasionSlugs = [
  "podarak-za-rozhden-den",
  "podarak-za-godishnina",
  "figurka-za-svatbena-torta",
  "podarak-za-sveti-valentin",
  "koleden-podarak",
  "podarak-za-abiturient",
  "podarak-za-kolega",
  "podarak-za-baba-i-dyado",
];

const productCards = [
  { image: "/shop/figurine.webp", position: "50% 50%", href: "/studio?product=figurine", product: "figurine" as const },
  { image: "/shop/pet.webp", position: "40% 50%", href: "/studio?product=figurine&subject=pet", product: "figurine" as const },
  { image: "/shop/keychain.webp", position: "50% 50%", href: "/studio?product=keychain", product: "keychain" as const },
];

export default function Home({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const h = t.home;
  const href = (path: string) => localize(lang, path);
  const products = productCards.map((card, index) => ({ ...card, ...h.products[index] }));
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
      <section className="bed-grid relative overflow-hidden border-b border-ink/10 px-4 pb-14 pt-24 sm:px-6 sm:pt-32 lg:pb-20">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink/70">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {h.heroBadge}
            </p>
            <h1 className="mt-4 text-[2.7rem] leading-[1.02] sm:mt-6 sm:text-7xl lg:text-[5.2rem]">
              {h.heroTitle[0]}
              <span className="relative block italic text-ember-deep">
                <span className="relative">
                  {h.heroTitle[1]}
                  <svg className="absolute -bottom-2 left-0 h-3 w-full text-ember sm:-bottom-3 sm:h-4" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden>
                    <path d="M3 11c60-8 140-10 294-4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-7 text-ink/75 sm:mt-7 sm:text-xl sm:leading-9">{h.heroText}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
              <Link
                href={href("/studio?product=figurine")}
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-base font-bold text-paper transition hover:bg-ember hover:text-ink sm:px-7 sm:py-4 sm:text-lg"
              >
                {h.create}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href={href("/#products")}
                className="rounded-xl border-2 border-ink/15 bg-paper px-5 py-3 text-base font-semibold transition hover:border-ink sm:px-7 sm:py-3.5 sm:text-lg"
              >
                {h.pricesFrom} {t.money(fromPrice("keychain"))}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rotate-[1.5deg] rounded-[1.4rem] bg-white p-2.5 shadow-[0_30px_70px_rgba(22,21,19,0.16)] sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-sand">
                <Image src="/shop/hero-mobile.webp" alt={h.heroAlt} fill priority className="object-cover" sizes="(min-width: 1024px) 480px, 90vw" />
              </div>
            </div>
            <div className="absolute -left-2 bottom-6 -rotate-6 rounded-xl bg-ember px-4 py-2.5 font-display text-lg italic text-ink shadow-[0_12px_30px_rgba(217,101,0,0.35)] sm:-left-6 sm:text-xl">
              {t.from} {t.money(fromPrice("keychain"))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {h.perks.map((perk, index) => (
            <div
              key={perk.title}
              className={`flex items-start gap-3 py-5 lg:px-6 lg:py-7 ${index % 2 === 1 ? "pl-4" : "pr-3"} ${index < 2 ? "border-b border-ink/10 lg:border-b-0" : ""} ${index > 0 ? "lg:border-l lg:border-ink/10" : "lg:pl-0"} ${index % 2 === 1 ? "border-l border-ink/10" : ""}`}
            >
              <svg className="mt-0.5 shrink-0 text-ember-deep" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {perkIcons[index]}
              </svg>
              <span>
                <span className="block text-[15px] font-semibold leading-snug">{perk.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink/55">{perk.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[2.4rem] leading-[1.05] sm:text-6xl">
              {h.productsTitle[0]} <span className="italic text-ember-deep">{h.productsTitle[1]}</span>
            </h2>
            <p className="max-w-sm text-lg text-ink/65">{h.productsText}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((item) => (
              <Link key={item.href} href={href(item.href)} className="lift-card group block rounded-[1.6rem] bg-white p-2.5">
                <span className="relative block aspect-[9/16] overflow-hidden rounded-[1.2rem] bg-sand">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectPosition: item.position }}
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent p-5 pt-20 text-paper">
                    <span className="flex items-end justify-between gap-3">
                      <span className="block font-display text-2xl sm:text-[1.7rem]">{item.title}</span>
                      <span className="shrink-0 rounded-lg bg-ember px-2.5 py-1 text-sm font-bold text-ink">
                        {t.from} {t.money(fromPrice(item.product))}
                      </span>
                    </span>
                    <span className="mt-2 block text-[15px] leading-6 text-paper/80">{item.text}</span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-3 px-2 pb-1.5 pt-3">
                  <span className="flex flex-wrap gap-1.5">
                    {catalog[item.product].sizes.map((size) => (
                      <span key={size.cm} className="rounded-md border border-ink/10 px-2 py-1 text-xs text-ink/70">
                        {size.cm} {t.cm} · {t.money(size.price)}
                      </span>
                    ))}
                  </span>
                  <span className="text-sm font-semibold text-ink/60 transition group-hover:text-ember-deep">{h.create.split(" ")[0]} →</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-ink/10 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-xl">{h.sizeTitle}</p>
              <p className="flex gap-4 text-xs text-ink/55">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink/70" /> {h.sizeKeychain}</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ember" /> {h.sizeFigurine}</span>
              </p>
            </div>
            <div className="mt-6 flex items-end justify-around gap-2 border-b-2 border-ink sm:gap-4">
              {[...catalog.keychain.sizes.map((s) => ({ ...s, kind: "keychain" })), ...catalog.figurine.sizes.map((s) => ({ ...s, kind: "figurine" }))].map((size) => (
                <div key={`${size.kind}-${size.cm}`} className="flex flex-col items-center">
                  <span className="mb-2 text-xs text-ink/50">{t.money(size.price)}</span>
                  <span
                    className={`block w-8 rounded-t-lg sm:w-12 ${size.kind === "figurine" ? "bg-ember" : "bg-ink/70"}`}
                    style={{ height: `${size.cm * 7}px` }}
                  />
                  <span className="mt-2 pb-2 text-sm font-semibold">{size.cm} {t.cm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 border-y border-ink/10 bg-white px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-end gap-6 lg:grid-cols-2">
            <h2 className="text-[2.4rem] leading-[1.05] sm:text-6xl">
              {h.howTitle[0]} <span className="italic text-ember-deep">{h.howTitle[1]}</span>
            </h2>
            <p className="max-w-md text-lg text-ink/65 lg:justify-self-end">{h.madeText}</p>
          </div>

          <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            <span className="absolute left-7 top-7 hidden h-px w-[calc(100%-3.5rem)] border-t-2 border-dashed border-ink/15 md:block" aria-hidden />
            <span className="absolute bottom-7 left-7 top-7 w-px border-l-2 border-dashed border-ink/15 md:hidden" aria-hidden />
            {h.steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 md:block">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-paper">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {stepIcons[index]}
                  </svg>
                </span>
                <span className="md:mt-5 md:block">
                  <span className="block font-display text-xl sm:text-2xl">{step.title}</span>
                  <span className="mt-1.5 block leading-7 text-ink/65">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.6rem] bg-sand sm:aspect-[16/9]">
              <Image src="/shop/process-mobile.webp" alt={h.processAlt} fill className="object-cover sm:hidden" sizes="100vw" />
              <Image src="/shop/process.webp" alt={h.processAlt} fill className="hidden object-cover sm:block" sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <div>
              <p className="flex items-center gap-2 font-display text-2xl italic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="#ff7a00" />
                  <circle cx="12" cy="10" r="2.6" fill="#fff" />
                </svg>
                {h.madeTitle}
              </p>
              <p className="mt-3 leading-7 text-ink/65">{h.heroText}</p>
              <Link
                href={href("/studio")}
                className="mt-6 inline-flex items-center gap-3 rounded-xl bg-ember px-7 py-4 text-lg font-bold text-ink transition hover:bg-ink hover:text-paper"
              >
                {h.startWithPhoto}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-paper sm:px-12 sm:py-16 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-display text-lg italic text-ember">{h.giftKicker}</p>
            <h2 className="mt-3 text-[2.3rem] leading-[1.05] sm:text-6xl">
              {h.giftTitle[0]} <span className="italic text-ember">{h.giftTitle[1]}</span>
            </h2>
            <div className="mt-7 flex flex-wrap gap-2">
              {h.occasions.map((item, index) => (
                <Link
                  key={item}
                  href={href(`/idei/${occasionSlugs[index]}`)}
                  className="rounded-lg border border-paper/20 px-3.5 py-1.5 text-sm text-paper/85 transition hover:border-ember hover:text-ember"
                >
                  {item}
                </Link>
              ))}
              <Link href={href("/idei")} className="rounded-lg bg-paper px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:bg-ember">
                {lang === "en" ? "All ideas →" : "Всички идеи →"}
              </Link>
            </div>
            <Link
              href={href("/studio")}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-ember px-7 py-4 text-lg font-bold text-ink transition hover:bg-paper"
            >
              {h.giftButton}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="relative mx-auto w-56 -rotate-2 sm:w-72">
            <div className="rounded-[1.4rem] bg-paper p-2.5">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1rem]">
                <Image src="/shop/keychain.webp" alt={h.keychainAlt} fill className="object-cover" sizes="300px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBox />

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
