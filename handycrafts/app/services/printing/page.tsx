import Link from "next/link";

const printingCards = [
  {
    title: "За какво е подходящо",
    text: "Прототипи, корпуси, монтажни елементи, custom части, декоративни и функционални изделия, единични бройки и тестови модели.",
  },
  {
    title: "Материали",
    text: "PLA, PETG, ABS, TPU, Resin и други варианти според конкретния случай, нужната устойчивост и крайния външен вид.",
  },
  {
    title: "Какво получавате",
    text: "Консултация, подготовка на модела, препоръка за подходящ материал и добре изработен детайл с баланс между точност, здравина и визия.",
  },
];

const printingSteps = [
  "Изпращате файл, идея или снимка.",
  "Уточняваме материал, размери и приложение.",
  "Подготвяме модела и настройките за печат.",
  "Изработваме детайла и преминаваме към предаване.",
];

export default function PrintingPage() {
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
              3D Принтиране
            </h1>

            <p className="max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Изработваме 3D детайли за прототипиране, функционални приложения,
              резервни части, персонализирани изделия и малки серии. Подходът се
              избира според предназначението, необходимата здравина, визията и
              нивото на детайлност.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/upload"
                className="inline-block rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Качи файл
              </Link>

              <Link
                href="/contact"
                className="inline-block rounded-full border border-black/10 bg-white px-8 py-4 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Попитай за материал
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {printingCards.map((card, index) => (
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
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Процес
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Как протича услугата
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {printingSteps.map((step, index) => (
              <div
                key={step}
                className="lift-card rounded-[24px] border border-black/5 bg-neutral-50 p-6"
              >
                <p className="mb-3 text-sm font-bold tracking-[0.2em] text-orange-500">
                  0{index + 1}
                </p>
                <p className="leading-7 text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}