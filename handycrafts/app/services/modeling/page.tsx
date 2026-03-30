import Link from "next/link";

export default function ModelingPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Услуга
        </p>

        <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
          3D Моделиране
        </h1>

        <p className="mb-10 max-w-4xl text-lg leading-8 text-neutral-700">
          Създаваме, коригираме и подготвяме 3D модели по идея, снимка, скица,
          размери, чертеж или реален детайл. Това е подходящо, когато все още
          няма готов модел за производство или печат.
        </p>

        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Какво можем да моделираме</h3>
            <p className="leading-7 text-neutral-700">
              Детайли, корпуси, адаптери, персонализирани елементи, декоративни
              обекти, концепции и технически части.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">По какво работим</h3>
            <p className="leading-7 text-neutral-700">
              По снимка, идея, размери, примерен детайл, сканиран обект или
              налична техническа информация.
            </p>
          </div>

          <div className="rounded-[28px] bg-neutral-50 p-8">
            <h3 className="mb-4 text-xl font-bold">Краен резултат</h3>
            <p className="leading-7 text-neutral-700">
              Получавате подготвен 3D модел за печат, визуализация, прототипиране
              или инженерни корекции.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            Подходящо когато
          </h2>
          <ul className="grid gap-3 text-neutral-700 md:grid-cols-2">
            <li>• Имате идея, но не и готов модел</li>
            <li>• Искате детайл по снимка или пример</li>
            <li>• Нужна е редакция на съществуващ модел</li>
            <li>• Трябва моделът да се подготви за 3D печат</li>
          </ul>
        </div>

        <Link
          href="/contact"
          className="inline-block rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
        >
          Обсъди проект
        </Link>
      </div>
    </main>
  );
}