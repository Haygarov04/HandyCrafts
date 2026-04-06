import Link from "next/link";

const modelingCards = [
  {
    title: "Какво можем да моделираме",
    text: "Детайли, корпуси, адаптери, персонализирани елементи, декоративни обекти, концепции и технически части.",
  },
  {
    title: "По какво работим",
    text: "По снимка, идея, размери, примерен детайл, сканиран обект или налична техническа информация.",
  },
  {
    title: "Краен резултат",
    text: "Получавате подготвен 3D модел за печат, визуализация, прототипиране или инженерни корекции.",
  },
];

const modelingUseCases = [
  "Имате идея, но не и готов модел",
  "Искате детайл по снимка или пример",
  "Нужна е редакция на съществуващ модел",
  "Трябва моделът да се подготви за 3D печат",
];

export default function ModelingPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-black/5 bg-gradient-to-br from-white via-orange-50/40 to-neutral-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10 md:p-14">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-100/50 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Услуга
            </p>

            <h1 className="mb-6 text-4xl font-bold text-neutral-900 sm:text-5xl md:text-6xl">
              3D Моделиране
            </h1>

            <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Създаваме, коригираме и подготвяме 3D модели по идея, снимка, скица,
              размери, чертеж или реален детайл. Това е подходящо, когато все още
              няма готов модел за производство или печат.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Обсъди проект
              </Link>

              <Link
                href="/upload"
                className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Качи файл
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {modelingCards.map((card, index) => (
            <div
              key={card.title}
              className="lift-card glow-orange group rounded-[28px] border border-black/5 bg-neutral-50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-base font-bold text-orange-600">
                  0{index + 1}
                </div>
                <div className="h-2 w-16 rounded-full bg-orange-200 transition-all duration-300 group-hover:w-24 group-hover:bg-orange-400" />
              </div>

              <h3 className="mb-4 text-xl font-bold text-neutral-900">
                {card.title}
              </h3>
              <p className="leading-7 text-neutral-700">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Полезно при
              </p>
              <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                Подходящо когато
              </h2>
            </div>

            <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              CAD • Concept • Preparation
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {modelingUseCases.map((item) => (
              <div
                key={item}
                className="lift-card rounded-2xl border border-black/5 bg-neutral-50 px-5 py-5 text-neutral-700"
              >
                <span className="font-semibold text-orange-500">• </span>
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}