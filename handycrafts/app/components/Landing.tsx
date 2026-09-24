import Image from "next/image";
import Link from "next/link";
import { catalog, money, productionDays, type ProductId } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, landings, productJsonLd } from "@/lib/site";
import FaqList from "./FaqList";
import JsonLd from "./JsonLd";

export type LandingContent = {
  path: string;
  crumb: string;
  kicker: string;
  title: string;
  lead: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string; ratio: string };
  product: ProductId;
  productName: string;
  sections: { title: string; text: string[] }[];
  faq: { q: string; a: string }[];
};

const steps = [
  ["01", "Качваш снимка", "Една ясна снимка стига. Можеш да опишеш дрехи, поза или аксесоари."],
  ["02", "Виждаш визуализация", "За около минута. Не ти харесва? Промени описанието и опитай пак."],
  ["03", "Поръчваш с наложен платеж", `Потвърждаваме по телефона, изработваме за ${productionDays} и пращаме с куриер.`],
];

export default function Landing({ content }: { content: LandingContent }) {
  const sizes = catalog[content.product].sizes;
  return (
    <>
      <JsonLd
        data={productJsonLd({
          product: content.product,
          name: content.productName,
          description: content.lead,
          image: content.image.src,
          url: content.path,
        })}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Начало", path: "/" }, { name: content.crumb, path: content.path }])} />
      <JsonLd data={faqJsonLd(content.faq)} />

      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label="Навигация" className="text-sm text-ink/50">
              <Link href="/" className="hover:text-ink">
                Начало
              </Link>{" "}
              / <span className="text-ink/70">{content.crumb}</span>
            </nav>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-ember-deep">{content.kicker}</p>
            <h1 className="mt-3 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">{content.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">{content.lead}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span key={size.cm} className="rounded-full bg-white px-3.5 py-1.5 text-sm">
                  {size.cm} см · <b>{money(size.price)}</b>
                </span>
              ))}
            </div>
            <Link
              href={content.cta.href}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-ember px-7 py-4 text-lg font-bold text-ink shadow-[0_14px_30px_rgba(255,122,0,0.3),inset_0_-3px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-ember-deep"
            >
              {content.cta.label}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-ink/50">Визуализацията е безплатна. Плащаш при получаване.</p>
          </div>
          <div className={`relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-sand shadow-[0_30px_70px_rgba(22,21,19,0.15)] ${content.image.ratio}`}>
            <Image src={content.image.src} alt={content.image.alt} fill priority className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl leading-tight sm:text-4xl">Как става</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([n, title, text]) => (
              <li key={n} className="flex gap-4 rounded-[1.8rem] bg-paper p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ember font-display text-ember-deep">{n}</span>
                <span>
                  <span className="block font-display text-lg">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-ink/65">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <article className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl leading-tight sm:text-3xl">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-lg leading-8 text-ink/75">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-3xl leading-tight sm:text-4xl">Въпроси</h2>
          <FaqList items={content.faq} />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#fde7c7] p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">Виж още</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {landings
              .filter((page) => page.href !== content.path)
              .map((page) => (
                <Link key={page.href} href={page.href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold hover:bg-paper">
                  {page.label}
                </Link>
              ))}
          </div>
          <Link
            href={content.cta.href}
            className="mt-8 inline-flex rounded-2xl bg-ink px-7 py-4 font-bold text-paper transition hover:bg-ember hover:text-ink"
          >
            {content.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
