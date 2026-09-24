import Image from "next/image";
import Link from "next/link";
import { catalog, type ProductId } from "@/lib/catalog";
import { dict, localize, type Lang } from "@/lib/i18n";
import { landingLinks } from "@/lib/landing-links";
import { breadcrumbJsonLd, faqJsonLd, productJsonLd } from "@/lib/site";
import FaqList from "./FaqList";
import JsonLd from "./JsonLd";

export type LandingContent = {
  metaTitle: string;
  /** The Bulgarian URL; the English one is derived from it. */
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


export default function Landing({ content, lang }: { content: LandingContent; lang: Lang }) {
  const t = dict[lang];
  const href = (path: string) => localize(lang, path);
  const sizes = catalog[content.product].sizes;
  const steps = t.landing.steps;
  return (
    <>
      <JsonLd
        data={productJsonLd({
          product: content.product,
          name: content.productName,
          description: content.lead,
          image: content.image.src,
          url: href(content.path),
        })}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: t.landing.home, path: href("/") }, { name: content.crumb, path: href(content.path) }])} />
      <JsonLd data={faqJsonLd(content.faq)} />

      <section className="bed-grid border-b border-ink/10 px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <nav aria-label={t.landing.breadcrumbs} className="text-sm text-ink/50">
              <Link href={href("/")} className="hover:text-ink">
                {t.landing.home}
              </Link>{" "}
              / <span className="text-ink/70">{content.crumb}</span>
            </nav>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-ember-deep">{content.kicker}</p>
            <h1 className="mt-3 text-[2.4rem] leading-[1.05] sm:text-6xl">{content.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">{content.lead}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span key={size.cm} className="rounded-full bg-white px-3.5 py-1.5 text-sm">
                  {size.cm} {t.cm} · <b>{t.money(size.price)}</b>
                </span>
              ))}
            </div>
            <Link
              href={href(content.cta.href)}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-ink px-7 py-4 text-lg font-bold text-paper transition hover:bg-ember hover:text-ink"
            >
              {content.cta.label}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-ink/50">{t.landing.free}</p>
          </div>
          <div className={`relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-sand shadow-[0_30px_70px_rgba(22,21,19,0.15)] ${content.image.ratio}`}>
            <Image src={content.image.src} alt={content.image.alt} fill priority className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl leading-tight sm:text-4xl">{t.landing.how}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([n, title, text]) => (
              <li key={n} className="flex gap-4 rounded-[1.4rem] border border-ink/10 bg-paper p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink font-display text-lg italic text-paper">{n}</span>
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
          <h2 className="text-3xl leading-tight sm:text-4xl">{t.landing.faq}</h2>
          <FaqList items={content.faq} />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#fde7c7] p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">{t.landing.more}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {landingLinks
              .filter((page) => page.path !== content.path)
              .map((page) => (
                <Link key={page.path} href={href(page.path)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold hover:bg-paper">
                  {page.label[lang]}
                </Link>
              ))}
          </div>
          <Link
            href={href(content.cta.href)}
            className="mt-8 inline-flex rounded-2xl bg-ink px-7 py-4 font-bold text-paper transition hover:bg-ember hover:text-ink"
          >
            {content.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
