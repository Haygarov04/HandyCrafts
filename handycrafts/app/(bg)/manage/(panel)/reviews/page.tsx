import Link from "next/link";
import { listReviews, reviewStatusLabel } from "@/lib/reviews";
import ReviewControls from "./review-controls";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ show?: string }> };

const filters = [
  { key: "pending", label: "Чакат одобрение" },
  { key: "approved", label: "Публикувани" },
  { key: "hidden", label: "Скрити" },
] as const;

const tone = {
  pending: "bg-ember/15 text-ember-deep",
  approved: "bg-emerald-100 text-emerald-800",
  hidden: "bg-ink/10 text-ink/60",
};

export default async function ReviewsPage({ searchParams }: Props) {
  const show = (await searchParams).show || "pending";
  const reviews = await listReviews();
  const shown = reviews.filter((review) => review.status === show);
  const published = reviews.filter((review) => review.status === "approved");
  const average = published.length ? published.reduce((sum, r) => sum + r.rating, 0) / published.length : 0;

  return (
    <div className="space-y-5">
      <Link href="/manage" className="text-sm text-ink/55 hover:text-ink">
        ‹ Поръчки
      </Link>
      <div>
        <h1 className="text-3xl">Отзиви</h1>
        <p className="mt-1 text-sm text-ink/55">
          Идват от молбата за отзив, която пращаш от поръчката. На сайта се показват само тези, които публикуваш.
          {published.length ? ` Публикувани: ${published.length} · средно ${average.toFixed(1)} ★` : ""}
        </p>
      </div>

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((item) => (
          <Link
            key={item.key}
            href={`/manage/reviews?show=${item.key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${show === item.key ? "bg-ink text-paper" : "bg-white"}`}
          >
            {item.label}
            {item.key === "pending" ? ` (${reviews.filter((r) => r.status === "pending").length})` : ""}
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-ink/55">Няма нищо тук.</div>
      ) : (
        <ul className="grid gap-3">
          {shown.map((review) => (
            <li key={review.id} className="rounded-3xl bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg leading-none text-ember">
                    {"★".repeat(review.rating)}
                    <span className="text-ink/15">{"★".repeat(5 - review.rating)}</span>
                  </p>
                  <p className="mt-2 font-semibold">
                    {review.name}
                    {review.city ? <span className="font-normal text-ink/55"> · {review.city}</span> : null}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tone[review.status]}`}>{reviewStatusLabel[review.status]}</span>
              </div>
              <p className="mt-3 whitespace-pre-line leading-7">{review.text}</p>
              <p className="mt-3 text-xs text-ink/45">
                <Link href={`/manage/${review.id}`} className="underline">
                  {review.orderNumber}
                </Link>
                {review.product ? ` · ${review.product}` : ""} ·{" "}
                {new Date(review.updatedAt).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" })}
              </p>
              <ReviewControls id={review.id} status={review.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
