import Link from "next/link";

export default function ScanningPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Услуга
        </p>

        <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
          3D Сканиране
        </h1>

        <p className="mb-10 max-w-4xl text-lg leading-8 text-neutral-700">
          Дигитализираме реални обекти с цел репликиране, анализ, обратен
          инженеринг и подготовка за моделиране или последващ печат. Това е
          добър подход, когато има съществуваща част, но липсва готов модел.
        </p>

        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Подходящо за</h3>
            <p className="leading-7 text-neutral-700">
              Реални детайли, трудни форми, стари части, обекти за репликиране
              и случаи, в които се търси база за последваща обработка.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Резултат</h3>
            <p className="leading-7 text-neutral-700">
              Получавате дигитална геометрия, която може да се използва за
              корекции, моделиране, сравнение, възстановяване или производство.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Следващи стъпки</h3>
            <p className="leading-7 text-neutral-700">
              След сканиране можем да преминем към редакция, почистване на
              геометрията, подготовка за печат или обратен инженеринг.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            Кога е полезно 3D сканирането
          </h2>
          <ul className="grid gap-3 text-neutral-700 md:grid-cols-2">
            <li>• Когато има реален детайл, но няма CAD модел</li>
            <li>• Когато частта трябва да бъде възстановена</li>
            <li>• Когато трябва да се направят корекции по съществуващ обект</li>
            <li>• Когато искате дигитална база за следващо моделиране</li>
          </ul>
        </div>

        <Link
          href="/contact"
          className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          Изпрати запитване
        </Link>
      </div>
    </main>
  );
}