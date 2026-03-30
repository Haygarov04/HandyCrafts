import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-orange-500 py-24 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Имате идея, файл или детайл?
        </h2>

        <p className="mb-8 text-lg leading-8 text-white/90">
          Изпратете запитване и нека изберем най-добрия начин да го превърнем в
          реален 3D продукт.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/upload"
            className="rounded-full bg-white px-8 py-4 font-semibold text-orange-500 transition hover:bg-neutral-100"
          >
            Качи файл
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Свържи се с нас
          </Link>
        </div>
      </div>
    </section>
  );
}