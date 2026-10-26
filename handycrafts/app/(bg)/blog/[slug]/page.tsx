import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/JsonLd";
import { articleBySlug, articles } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { absolute, breadcrumbJsonLd, siteName } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articleBySlug((await params).slug);
  return article ? pageMetadata("bg", `/blog/${article.slug}`, { title: article.title, description: article.description, bgOnly: true }) : {};
}

const day = (iso: string) => new Date(iso).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });

export default async function Page({ params }: Props) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();
  const path = `/blog/${article.slug}`;
  const others = articles.filter((other) => other.slug !== article.slug).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          image: absolute(article.image.src),
          datePublished: article.date,
          dateModified: article.date,
          inLanguage: "bg",
          mainEntityOfPage: absolute(path),
          author: { "@type": "Organization", name: siteName, url: absolute("/") },
          publisher: { "@type": "Organization", name: siteName, logo: { "@type": "ImageObject", url: absolute("/icon.png") } },
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Начало", path: "/" }, { name: "Блог", path: "/blog" }, { name: article.title, path }])} />
      <article className="px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Навигация" className="text-sm text-ink/50">
            <Link href="/" className="hover:text-ink">Начало</Link> / <Link href="/blog" className="hover:text-ink">Блог</Link>
          </nav>
          <h1 className="mt-6 text-[2rem] leading-[1.1] tracking-[-0.03em] sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-sm text-ink/50">
            <time dateTime={article.date}>{day(article.date)}</time> · {siteName}
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-sand">
            <Image src={article.image.src} alt={article.image.alt} fill priority className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
          </div>
          <p className="mt-8 text-xl leading-9 text-ink/80">{article.intro}</p>
          {article.sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="text-2xl leading-tight sm:text-3xl">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-lg leading-8 text-ink/75">{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-lg leading-8 text-ink/75">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-ember" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <Link
            href={article.cta.href}
            className="mt-12 inline-flex items-center gap-3 rounded-xl bg-ember px-7 py-4 text-lg font-extrabold text-ink transition hover:bg-ember-deep"
          >
            {article.cta.label} →
          </Link>
        </div>
      </article>
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-3xl border-t border-ink/10 pt-10">
          <p className="font-display text-xl">Още от блога</p>
          <div className="mt-5 space-y-3">
            {others.map((other) => (
              <Link key={other.slug} href={`/blog/${other.slug}`} className="block rounded-2xl bg-white px-5 py-4 font-semibold transition hover:bg-sand">
                {other.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
