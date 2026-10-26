import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { articles } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/site";

export const metadata: Metadata = pageMetadata("bg", "/blog", {
  title: "Блог — идеи за подаръци и всичко за фигурките по снимка",
  description: "Съвети и идеи: персонализирани подаръци, как се прави фигурка по снимка, каква снимка да изберете и как да оцветите фигурка сами.",
  bgOnly: true,
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Начало", path: "/" }, { name: "Блог", path: "/blog" }])} />
      <section className="px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Навигация" className="text-sm text-ink/50">
            <Link href="/" className="hover:text-ink">Начало</Link> / <span className="text-ink/70">Блог</span>
          </nav>
          <h1 className="mt-6 text-[2rem] leading-[1.1] tracking-[-0.03em] sm:text-5xl">Блог</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/65">Идеи за подаръци, съвети за снимки и всичко за фигурките по снимка.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="lift-card group block overflow-hidden rounded-[1.6rem] bg-white">
                <span className="relative block aspect-[4/3] overflow-hidden bg-sand">
                  <Image src={article.image.src} alt={article.image.alt} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </span>
                <span className="block p-5">
                  <span className="block font-display text-lg leading-snug">{article.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-ink/60">{article.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
