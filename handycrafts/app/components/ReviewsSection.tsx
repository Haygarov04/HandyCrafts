"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import type { PublicReview } from "@/lib/reviews";

/** Published customer reviews. Loads after the page so the home page stays static; shows nothing until there are some. */
export default function ReviewsSection({ lang }: { lang: Lang }) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReviews(data?.reviews || []))
      .catch(() => undefined);
  }, []);

  if (reviews.length === 0) return null;
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="scroll-mt-24 border-b border-ink/10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl leading-tight sm:text-5xl">
            {lang === "en" ? "What customers " : "Какво казват "}
            <span className="text-ember-deep">{lang === "en" ? "say" : "клиентите"}</span>
          </h2>
          <p className="text-lg text-ink/65">
            <span className="text-ember">★</span> {average.toFixed(1).replace(".", lang === "en" ? "." : ",")} ·{" "}
            {lang === "en" ? `${reviews.length} reviews` : `${reviews.length} ${reviews.length === 1 ? "отзив" : "отзива"}`}
          </p>
        </div>
        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="w-[82%] shrink-0 snap-start rounded-[1.6rem] bg-white p-6 sm:w-auto">
              <p className="text-lg leading-none text-ember" aria-label={`${review.rating}/5`}>
                {"★".repeat(review.rating)}
                <span className="text-ink/15">{"★".repeat(5 - review.rating)}</span>
              </p>
              <p className="mt-4 whitespace-pre-line leading-7 text-ink/80">{review.text}</p>
              <p className="mt-5 font-semibold">
                {review.name}
                {review.city ? <span className="font-normal text-ink/55"> · {review.city}</span> : null}
              </p>
              {review.product ? <p className="text-sm text-ink/45">{review.product}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
