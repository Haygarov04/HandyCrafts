import Link from "next/link";

const scanningCards = [
  {
    title: "Подходящо за",
    text: "Реални детайли, трудни форми, стари части, обекти за репликиране и случаи, в които се търси база за последваща обработка.",
  },
  {
    title: "Резултат",
    text: "Получавате дигитална геометрия, която може да се използва за корекции, моделиране, сравнение, възстановяване или производство.",
  },
  {
    title: "Следващи стъпки",
    text: "След сканиране можем да преминем към редакция, почистване на геометрията, подготовка за печат или обратен инженеринг.",
  },
];

const scanningUseCases = [
  "Когато има реален детайл, но няма CAD модел",
  "Когато частта трябва да бъде възстановена",
  "Когато трябва да се направят корекции по съществуващ обект",
  "Когато искате дигитална база за следващо моделиране",
];

export default function ScanningPage() {
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
              3D Сканиране
            </h1>

            <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Дигитализираме реални обекти с цел репликиране, анализ, обратен
              инженеринг и подготовка за моделиране или последващ печат. Това е
              добър подход, когато има съществуваща част, но липсва готов модел.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Изпрати запитване
              </Link>

              <Link
                href="/upload"
                className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Качи снимка или идея
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {scanningCards.map((card, index) => (
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
                Кога е полезно
              </p>
              <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                Кога е полезно 3D сканирането
              </h2>
            </div>

            <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              Scan • Repair • Reverse engineering
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scanningUseCases.map((item) => (
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